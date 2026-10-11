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
};
const byte n_commands = sizeof(serial_commands)/sizeof(serial_command); //number of commands that we have

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
  char numberstring[10];
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

static void handle_command()
{
    // sanity check
    if (active_serial->number_pos == 0 || active_serial->cmd_index >= n_commands)
    {
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
                active_serial_port->println(odo/1000.0*wheel_circumference,0);
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
                active_serial_port->println(MY_F("METISA:REV22:NANO:1.43"));
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
                unsigned long pin = strtoul(active_serial->numberstring, NULL, 10);
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
            // skip return chars
            if (read_c == 10 || read_c == 13)
            {
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
