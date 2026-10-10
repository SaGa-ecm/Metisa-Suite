/*
Hardware Abstraction Layer (HAL) for Arduino Pedelec Controller
Supports AVR (ATmega328P, ATmega2560), STM32 (Cortex-M), RP2040/RP2350 (ARM/RISC-V), and ESP32.
(c) 2026 metisa project
*/

#ifndef HAL_H
#define HAL_H

#include <Arduino.h>

// Serial1 availability detection across architectures
#if defined(HAVE_HWSERIAL1) || (defined(__AVR__) && defined(UBRR1H)) || defined(ARDUINO_ARCH_ESP32) || (defined(ARDUINO_ARCH_MBED) && defined(Serial1)) || defined(ARDUINO_ARCH_RP2040)
#define APC_HAVE_SERIAL1 1
#endif

#if defined(__AVR__)
#include <avr/io.h>
#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <avr/wdt.h>
#include <avr/eeprom.h>
#include <EEPROM.h>
#else
// Non-AVR Architecture Compatibility Layer (STM32, RP2040/RP2350, ESP32)

#ifndef PROGMEM
#define PROGMEM
#endif

#ifndef PSTR
#define PSTR(s) (s)
#endif

#ifndef pgm_read_byte
#define pgm_read_byte(addr) (*(const uint8_t *)(addr))
#endif

#ifndef pgm_read_word
#define pgm_read_word(addr) (*(const uint16_t *)(addr))
#endif

#ifndef pgm_read_dword
#define pgm_read_dword(addr) (*(const uint32_t *)(addr))
#endif

#ifndef pgm_read_float
#define pgm_read_float(addr) (*(const float *)(addr))
#endif

#ifndef cli
#define cli() noInterrupts()
#endif

#ifndef sei
#define sei() interrupts()
#endif

// Hardware Watchdog Stubs for non-AVR (real hardware watchdogs handled in platform drivers)
#ifndef wdt_enable
#define wdt_enable(x) ((void)0)
#endif
#ifndef wdt_reset
#define wdt_reset() ((void)0)
#endif
#ifndef wdt_disable
#define wdt_disable() ((void)0)
#endif
#ifndef WDTO_1S
#define WDTO_1S 0
#endif
#ifndef WDTO_2S
#define WDTO_2S 0
#endif

#ifndef A0
#if defined(ARDUINO_ARCH_ESP32)
#define A0 36
#define A1 39
#define A2 34
#define A3 35
#define A4 32
#define A5 33
#define A6 25
#define A7 26
#else
#define A0 0
#define A1 1
#define A2 2
#define A3 3
#define A4 4
#define A5 5
#define A6 6
#define A7 7
#endif
#endif
#ifndef A2
#define A2 34
#endif

#undef min
#define min(a,b) (((a)<(b))?(a):(b))
#undef max
#define max(a,b) (((a)>(b))?(a):(b))

#if __has_include(<EEPROM.h>)
#include <EEPROM.h>
#else
class HalEEPROMClass {
public:
    uint8_t read(int idx) { return 0xFF; }
    void write(int idx, uint8_t val) {}
    void update(int idx, uint8_t val) {}
};
extern HalEEPROMClass EEPROM;
#endif

#endif // !__AVR__

#endif // HAL_H
