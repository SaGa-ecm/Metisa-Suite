/*
Serial (bluetooth) communication functions
Written by Jens Kießling and Thomas Jarosch

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software Foundation,
Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
*/

#include "config.h"
#include "serial_command.h"
#include "security_auth.h"
#include "wireless_manager.h"
#include "globals.h"
#include "switches.h"
#ifdef SUPPORT_RTC
#include "ds1307.h"
#endif

//a command is always AA# or AA? where AA# sets # to variable AA and AA? returns value of AA
struct serial_command {char mnemonic[3];};
serial_command serial_commands[] =
{
    {{"ps"}},     //0: poti stat, gets and sets poti stat
    {{"od"}},     //1: total kilometers (odo), gets and sets total kilometers
    {{"sp"}},     //2: short button press, send button between 0 and 3
    {{"lp"}},     //3: long button press, send button between 0 and 3
    {{"hh"}},     //4: set/get hours
    {{"mm"}},     //5: set/get minutes
    {{"ss"}},     //6: set/get seconds
    {{"cc"}},     //7: set/get charge count
    {{"pn"}},     //8: set/get PIN unlock (0=StVZO, 1=Sport, 2=Race via 210286)
    {{"lf"}},     //9: Front light (0=off, 1=on low, 2=high beam)
    {{"lh"}},     //10: High beam (0=off, 1=on)
    {{"lr"}},     //11: Rear light (0=off, 1=on)
    {{"lb"}},     //12: Brake light (0=off, 1=on)
    {{"bl"}},     //13: Blinker links (0=off, 1=on)
    {{"br"}},     //14: Blinker rechts (0=off, 1=on)
    {{"hz"}},     //15: Warnblinker (0=off, 1=on)
    {{"hn"}},     //16: Hupe (0=off, 1=on)
    {{"id"}},     //17: Hardware- & Firmware-ID Probe
    {{"sn"}},     //18: Hardware-Seriennummer (get: sn?, set: sn=...)
    {{"sv"}},     //19: Save to EEPROM (get: sv?, set: sv1 or sv)
    {{"wb"}},     //20: write basic register (Zone A Unrestricted)
    {{"qc"}},     //21: query cryptographic challenge (Zero-Trust Nonce)
    {{"ws"}},     //22: write secure register (Zone B HMAC-SHA256 authenticated)
    {{"df"}},     //23: DFU / Bootloader jump (set: df1 or df)
};
const byte n_commands = sizeof(serial_commands)/sizeof(serial_command); //number of commands that we have

// Global Hardware Serial Number storage
char metisa_serial_number[26] = "SAGA-UNPROVISIONED";

enum parse_states
{
    Reset,
    SearchCommand,
    StoreNumber,
    ErrorWaitReturn,
};


struct serial_struct
{
  parse_states parse_state;
  char cmdbuf[2];
  byte cmd_index;
  char numberstring[84];
  byte number_pos;
};

serial_struct serial_port1={Reset,{0},0,{0},0};
#if HARDWARE_REV>=20
serial_struct serial_port2={Reset,{0},0,{0},0};
#endif
serial_struct serial_port_wireless={Reset,{0},0,{0},0};

serial_struct* active_serial = &serial_port1;
Print* active_serial_port = &Serial;

/**
 * @brief Look for valid commands in command input buffer
 * Also sets "cmd_index".
 *
 * @return bool True if command found, false otherwise
 */
static bool find_commands()
{
    for (byte i=0; i < n_commands; ++i)
    {
        if (serial_commands[i].mnemonic[0] == active_serial->cmdbuf[0] && serial_commands[i].mnemonic[1] == active_serial->cmdbuf[1])
        {
            active_serial->cmd_index = i;
            return true;
        }
    }

    return false;
}

static bool parseHexDword(char*& p, uint32_t& outDw) {
    while (*p == ' ' || *p == '\t') p++;
    if (!*p) return false;
    uint32_t acc = 0; int cnt = 0;
    while (*p) {
        char c = *p; int d = -1;
        if (c >= '0' && c <= '9') d = c - '0';
        else if (c >= 'a' && c <= 'f') d = c - 'a' + 10;
        else if (c >= 'A' && c <= 'F') d = c - 'A' + 10;
        else break;
        acc = (acc << 4) | (uint32_t)d;
        cnt++; p++;
    }
    if (cnt == 0) return false;
    outDw = acc; return true;
}

static bool parseHexWord(char*& p, uint16_t& outW) {
    uint32_t dw = 0;
    if (!parseHexDword(p, dw)) return false;
    outW = (uint16_t)dw;
    return true;
}

static void trigger_bootloader_jump()
{
    // Bootloader entry is restricted to a session already authorized on the
    // controller itself (Level 2). The browser cannot grant this.
    if (pin_security_level != 2)
    {
        active_serial_port->println(MY_F("ERR:DFU_NOT_AUTHORIZED"));
        return;
    }
    active_serial_port->println(MY_F("OK:DFU_BOOTLOADER_ENTER"));
#if defined(ARDUINO_ARCH_STM32)
    delay(50);
    __disable_irq();
    SysTick->CTRL = 0;
    SysTick->LOAD = 0;
    SysTick->VAL = 0;
    for (uint8_t i = 0; i < 8; i++) {
        NVIC->ICER[i] = 0xFFFFFFFF;
        NVIC->ICPR[i] = 0xFFFFFFFF;
    }
#if defined(STM32F4xx) || defined(STM32G4xx)
    __HAL_RCC_SYSCFG_CLK_ENABLE();
    SYSCFG->MEMRMP = 0x01;
    const uint32_t boot_addr = 0x1FFF0000;
#elif defined(STM32F1xx)
    const uint32_t boot_addr = 0x1FFFF000;
#else
    const uint32_t boot_addr = 0x1FFF0000;
#endif
    uint32_t jump_addr = *(__IO uint32_t*)(boot_addr + 4);
    void (*boot_jump)(void) = (void (*)(void))jump_addr;
    __set_MSP(*(__IO uint32_t*)boot_addr);
    boot_jump();
    while (1);
#elif defined(__AVR__)
    wdt_enable(WDTO_15MS);
    while (1);
#endif
}

static void handle_command()
{
    // sanity check
    if (active_serial->cmd_index >= n_commands)
    {
        active_serial_port->println(MY_F("ERROR"));
        return;
    }

    if (active_serial->number_pos == 0)
    {
        if (active_serial->cmd_index == 19) // "sv" without arguments
        {
            active_serial_port->print(serial_commands[active_serial->cmd_index].mnemonic);
            save_eeprom();
            active_serial_port->println(MY_F("OK:EEPROM_SAVED"));
            return;
        }
        if (active_serial->cmd_index == 21) // "qc" without arguments
        {
            if (SecurityAuth::isLockedOut())
            {
                active_serial_port->print(MY_F("ERR:LOCKED_COOLDOWN:"));
                active_serial_port->println(SecurityAuth::getRemainingLockoutMs() / 1000);
                return;
            }
            char challengeHex[CHALLENGE_HEX_STR_LEN];
            if (SecurityAuth::generateChallenge(challengeHex))
            {
                active_serial_port->print(MY_F("OK:CHALLENGE:"));
                active_serial_port->println(challengeHex);
                return;
            }
            active_serial_port->println(MY_F("ERR:CHALLENGE_GEN_FAILED"));
            return;
        }
        if (active_serial->cmd_index == 23) // "df" without arguments
        {
            trigger_bootloader_jump();
            return;
        }
        active_serial_port->println(MY_F("ERROR"));
        return;
    }

    active_serial_port->print(serial_commands[active_serial->cmd_index].mnemonic);
    // Info command?
    if (active_serial->numberstring[0] == '?')
    {
        switch(active_serial->cmd_index)
        {
            case 0:             //poti_stat
                active_serial_port->println(poti_stat);
                break;
            case 1:             //total kilometers
                active_serial_port->println((unsigned long)(odo / 1000.0 * wheel_circumference));
                break;
            case 4:              //hours read
#ifdef SUPPORT_RTC
                active_serial_port->println(now.hh);
#endif
                break;
            case 5:              //minutes read
#ifdef SUPPORT_RTC
                active_serial_port->println(now.mm);
#endif
                break;
            case 6:              //seconds read
#ifdef SUPPORT_RTC
                active_serial_port->println(now.ss);
#endif
                break;
            case 7:              //charge count read
#ifdef SUPPORT_BATTERY_CHARGE_COUNTER
                active_serial_port->println(charge_count);
#endif
                break;
            case 8:              //PIN level query
                active_serial_port->println(pin_security_level);
                break;
            case 9:              //Front light query
                active_serial_port->println(lights_front_active ? (lights_high_beam_active ? 2 : 1) : 0);
                break;
            case 10:             //High beam query
                active_serial_port->println(lights_high_beam_active ? 1 : 0);
                break;
            case 11:             //Rear light query
                active_serial_port->println(lights_rear_active ? 1 : 0);
                break;
            case 12:             //Brake light query
                active_serial_port->println(lights_brake_active ? 1 : 0);
                break;
            case 13:             //Blinker links query
                active_serial_port->println(turn_left_active ? 1 : 0);
                break;
            case 14:             //Blinker rechts query
                active_serial_port->println(turn_right_active ? 1 : 0);
                break;
            case 15:             //Warnblinker query
                active_serial_port->println(hazard_active ? 1 : 0);
                break;
            case 16:             //Hupe query
                active_serial_port->println(horn_active ? 1 : 0);
                break;
            case 17:             //Hardware- & Firmware-ID query
#if defined(ARDUINO_ARCH_ESP32) || defined(ESP32)
                active_serial_port->print(MY_F("METISA:REV22:ESP32:1.43:SN="));
#elif defined(STM32F407xx) || defined(TARGET_STM32F407)
                active_serial_port->print(MY_F("METISA:REV22:STM32F407:1.43:SN="));
#elif defined(STM32F405xx) || defined(TARGET_STM32F405)
                active_serial_port->print(MY_F("METISA:REV22:STM32F405:1.43:SN="));
#elif defined(STM32F401xC)
                active_serial_port->print(MY_F("METISA:REV22:STM32F401:1.43:SN="));
#elif defined(STM32F411xE)
                active_serial_port->print(MY_F("METISA:REV22:STM32F411:1.43:SN="));
#elif defined(STM32F103xB)
                active_serial_port->print(MY_F("METISA:REV22:STM32F103:1.43:SN="));
#elif defined(STM32G431xx)
                active_serial_port->print(MY_F("METISA:REV22:STM32G431:1.43:SN="));
#elif defined(ARDUINO_ARCH_STM32)
                active_serial_port->print(MY_F("METISA:REV22:STM32:1.43:SN="));
#elif defined(__AVR_ATmega2560__)
                active_serial_port->print(MY_F("METISA:REV22:MEGA2560:1.43:SN="));
#elif defined(ARDUINO_ARCH_RP2350) || defined(PICO_RP2350) || defined(TARGET_RP2350) || defined(__ARM_ARCH_8M_MAIN__)
                active_serial_port->print(MY_F("METISA:REV22:RP2350:1.43:SN="));
#elif defined(ARDUINO_ARCH_RP2040)
                active_serial_port->print(MY_F("METISA:REV22:RP2040:1.43:SN="));
#else
                active_serial_port->print(MY_F("METISA:REV22:NANO:1.43:SN="));
#endif
                active_serial_port->println(metisa_serial_number);
                break;
            case 18:             //Hardware-Seriennummer query
                active_serial_port->println(metisa_serial_number);
                break;
            case 19:             //EEPROM status query
                active_serial_port->println(MY_F("EEPROM:OK"));
                break;
        }

        return;
    }

    // Write command?
    switch(active_serial->cmd_index)
    {
        case 0:              //poti_stat
            {
                long val = atol(active_serial->numberstring);
                if (val < 0) val = 0;
                poti_stat = min((int)(val * 1023.0 / power_poti_max), 1023);
            }
            break;
        case 1:              //total kilometers (addresses finding B-20)
            {
                long km_input = atol(active_serial->numberstring);
                if (km_input >= 0 && km_input <= 999999L && wheel_circumference > 0.0)
                {
                    odo = (unsigned long)((double)km_input * 1000.0 / wheel_circumference);
                    save_eeprom();
                }
            }
            break;
        case 2:              //short button press
            {
                int sw = atoi(active_serial->numberstring);
                if (sw >= 0 && sw < _SWITCHES_COUNT)
                    handle_switch(static_cast<switch_name>(sw), 0, PRESSED_SHORT);
            }
            break;
        case 3:              //long button press
            {
                int sw = atoi(active_serial->numberstring);
                if (sw >= 0 && sw < _SWITCHES_COUNT)
                    handle_switch(static_cast<switch_name>(sw), 0, PRESSED_LONG);
            }
            break;
        case 4:              //hours write
#ifdef SUPPORT_RTC
            {
                int val = atoi(active_serial->numberstring);
                if (val >= 0 && val <= 23)
                    rtc.adjust_time(val, now.mm, now.ss);
            }
#endif
            break;
        case 5:              //minutes write
#ifdef SUPPORT_RTC
            {
                int val = atoi(active_serial->numberstring);
                if (val >= 0 && val <= 59)
                    rtc.adjust_time(now.hh, val, now.ss);
            }
#endif
            break;
        case 6:              //seconds write
#ifdef SUPPORT_RTC
            {
                int val = atoi(active_serial->numberstring);
                if (val >= 0 && val <= 59)
                    rtc.adjust_time(now.hh, now.mm, val);
            }
#endif
            break;
        case 7:              //charge count write
#ifdef SUPPORT_BATTERY_CHARGE_COUNTER
            {
                long val = atol(active_serial->numberstring);
                if (val >= 0 && val <= 65535L)
                {
                    charge_count = (unsigned int)val;
                    save_eeprom();
                }
            }
#endif
            break;
        case 8:              //PIN code write/unlock
            {
                unsigned long pin = (unsigned long)atol(active_serial->numberstring);
                if (pin == 847291UL || pin == 994102UL)
                {
                    // Honeypot Decoy Trap: Deceptively confirm but lock motor in demo sandbox
                    active_serial_port->println(MY_F("OK:SANDBOX_DEMO_MOTOR_LOCKED"));
                    return;
                }
                if (pin_check_and_apply(pin))
                {
                    active_serial_port->print(MY_F("OK:LVL_"));
                    active_serial_port->println(pin_security_level);
                }
                else
                {
                    active_serial_port->println(MY_F("ERR:PIN"));
                }
                return;
            }
        case 9: // Front light (0=off, 1=low beam, 2=high beam)
            {
                int val = atoi(active_serial->numberstring);
                if (val == 2) set_lights_front(true, true);
                else if (val == 1) set_lights_front(true, false);
                else set_lights_front(false, false);
                break;
            }
        case 10: // High beam (0=off, 1=on)
            set_lights_front(true, atoi(active_serial->numberstring) > 0);
            break;
        case 11: // Rear light
            set_lights_rear(atoi(active_serial->numberstring) > 0);
            break;
        case 12: // Brake light test
            set_brake_light(atoi(active_serial->numberstring) > 0);
            break;
        case 13: // Blinker links
            set_turn_signal_left(atoi(active_serial->numberstring) > 0);
            break;
        case 14: // Blinker rechts
            set_turn_signal_right(atoi(active_serial->numberstring) > 0);
            break;
        case 15: // Warnblinker
            set_hazard_lights(atoi(active_serial->numberstring) > 0);
            break;
        case 16: // Hupe
            set_horn(atoi(active_serial->numberstring) > 0);
            break;
        case 18: // Hardware-Seriennummer zuweisen
            {
                char* p_sn = active_serial->numberstring;
                if (*p_sn == '=') p_sn++;
                if (strlen(p_sn) > 0)
                {
                    strncpy(metisa_serial_number, p_sn, sizeof(metisa_serial_number) - 1);
                    metisa_serial_number[sizeof(metisa_serial_number) - 1] = '\0';
                    save_eeprom();
                    active_serial_port->print(MY_F("OK:SN_ASSIGNED="));
                    active_serial_port->println(metisa_serial_number);
                    return;
                }
                break;
            }
        case 19: // EEPROM persistieren
            {
                save_eeprom();
                active_serial_port->println(MY_F("OK:EEPROM_SAVED"));
                return;
            }
        case 20: // wb: write basic (Zone A unrestricted)
            {
                uint16_t reg = 0;
                uint32_t val = 0;
                char* str = active_serial->numberstring;
                while (*str == ' ' || *str == '=') str++;

                if (parseHexWord(str, reg) && parseHexDword(str, val))
                {
                    if (SecurityAuth::writeBasic(reg, (int32_t)val))
                    {
                        active_serial_port->print(MY_F("OK:WRITE_BASIC:"));
                        active_serial_port->println(reg, HEX);
                        return;
                    }
                    else
                    {
                        active_serial_port->println(MY_F("ERR:RESTRICTED_REGISTER_ACCESS_DENIED"));
                        return;
                    }
                }
                active_serial_port->println(MY_F("ERR:SYNTAX_WB"));
                return;
            }
        case 21: // qc: query challenge
            {
                if (SecurityAuth::isLockedOut())
                {
                    active_serial_port->print(MY_F("ERR:LOCKED_COOLDOWN:"));
                    active_serial_port->println(SecurityAuth::getRemainingLockoutMs() / 1000);
                    return;
                }
                char challengeHex[CHALLENGE_HEX_STR_LEN];
                if (SecurityAuth::generateChallenge(challengeHex))
                {
                    active_serial_port->print(MY_F("OK:CHALLENGE:"));
                    active_serial_port->println(challengeHex);
                    return;
                }
                active_serial_port->println(MY_F("ERR:CHALLENGE_GEN_FAILED"));
                return;
            }
        case 22: // ws: write secure (Zone B with HMAC-SHA256)
            {
                uint16_t reg = 0;
                uint32_t val = 0;
                char hmacBuf[65] = {0};
                char* str = active_serial->numberstring;
                while (*str == ' ' || *str == '=') str++;

                if (parseHexWord(str, reg) && parseHexDword(str, val))
                {
                    while (*str == ' ' || *str == '\t') str++;
                    size_t hLen = 0;
                    while (*str && *str != ' ' && *str != '\t' && *str != '\r' && *str != '\n') {
                        if (hLen < 64) {
                            hmacBuf[hLen++] = *str;
                        }
                        str++;
                    }
                    hmacBuf[hLen] = '\0';

                    if (hLen == 64)
                    {
                        AuthResult res = SecurityAuth::writeSecure(reg, (int32_t)val, hmacBuf);
                        switch (res)
                        {
                            case AUTH_OK:
                                active_serial_port->print(MY_F("OK:WRITE_SECURE:"));
                                active_serial_port->println(reg, HEX);
                                return;
                            case AUTH_ERR_PORT_LOCKED:
                                active_serial_port->println(MY_F("ERR:PORT_RATE_LIMITED"));
                                return;
                            case AUTH_ERR_CHALLENGE_EXPIRED:
                                active_serial_port->println(MY_F("ERR:CHALLENGE_TIMEOUT"));
                                return;
                            case AUTH_ERR_INVALID_HMAC:
                                active_serial_port->println(MY_F("ERR:HMAC_AUTHENTICATION_FAILED"));
                                return;
                            default:
                                active_serial_port->println(MY_F("ERR:SECURE_WRITE_FAILED"));
                                return;
                        }
                    }
                }
                active_serial_port->println(MY_F("ERR:SYNTAX_WS"));
                return;
            }
        case 23: // "df" with argument (e.g. df1)
            trigger_bootloader_jump();
            return;
    }
    active_serial_port->println(MY_F("OK"));
}

void parse_serial(const char &read_c, const byte port)
{
    if (port==0)
    {
      active_serial=&serial_port1;
      active_serial_port=&Serial;
    }
#if (HARDWARE_REV >= 20) && defined(APC_HAVE_SERIAL1)
    else if (port==1)
    {
      active_serial=&serial_port2;
      active_serial_port=&Serial1;
    }
#endif
    else if (port==2)
    {
      active_serial=&serial_port_wireless;
      Print* p = wireless_get_stream();
      active_serial_port = p ? p : &Serial;
    }

    switch(active_serial->parse_state)
    {
        case Reset:
            memset(active_serial->cmdbuf, 0, sizeof(active_serial->cmdbuf));
            memset(active_serial->numberstring, 0, sizeof(active_serial->numberstring));
            active_serial->cmd_index = 255;
            active_serial->number_pos = 0;

            active_serial->parse_state = SearchCommand;
            /* fallthrough */

        case SearchCommand:
            // skip return chars or handle legacy single-character 's' save command
            if (read_c == 10 || read_c == 13)
            {
                if (active_serial->cmdbuf[0] == 's' && active_serial->cmdbuf[1] == 0)
                {
                    save_eeprom();
                    active_serial_port->println(MY_F("sOK:EEPROM_SAVED"));
                }
                active_serial->parse_state = Reset;
                break;
            }

            if (active_serial->cmdbuf[0] == 0)
            {
                // store first character
                active_serial->cmdbuf[0] = read_c;
            }
            else
            {
                active_serial->cmdbuf[1] = read_c;

                // Look for valid commands
                if (find_commands() == true)
                    active_serial->parse_state = StoreNumber;
                else
                    active_serial->parse_state = ErrorWaitReturn;
            }
            break;

        case StoreNumber:
            if (read_c == 10 || read_c == 13)
            {
                // User input is done
                handle_command();
                active_serial->parse_state = Reset;
            }
            else
            {
                // Store character
                if (active_serial->number_pos < sizeof(active_serial->numberstring)-1)        // reserve one byte for the terminating zero (atoi())
                {
                    active_serial->numberstring[active_serial->number_pos] = read_c;
                    ++active_serial->number_pos;
                }
            }
            break;
        case ErrorWaitReturn:
            if (read_c == 10 || read_c == 13)
            {
                active_serial_port->println(MY_F("ERROR"));
                active_serial->parse_state = Reset;
            }
            break;
    }
}
