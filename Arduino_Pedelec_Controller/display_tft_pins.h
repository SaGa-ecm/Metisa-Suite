/*
 * Hardware-specific Pin- and Bus-Configuration for ST7789 Displays (Adafruit / Waveshare)
 * Metisa / Arduino-Pedelec-Controller
 *
 * Supported Target Architectures:
 *  - STM32: BlackPill F401/F411, Nucleo F411/F446, Nucleo G431, BluePill F103
 *  - Raspberry Pi RP2040: Pico / Pico 2 (ARM Cortex-M0+ / RISC-V Hazard3 / M33)
 *  - Espressif: ESP32 DevKit, ESP32-S3, ESP32-S2, ESP32-C3
 *  - Atmel AVR: Arduino Nano V3 (ATmega328P), Arduino Mega 2560 (ATmega2560)
 */

#ifndef DISPLAY_TFT_PINS_H
#define DISPLAY_TFT_PINS_H

#include <Arduino.h>

// ==============================================================================
// 1. PIN-ZUORDNUNGEN JE ZIELARCHITEKTUR
// ==============================================================================

#if defined(ARDUINO_ARCH_STM32)
    // STM32 Cortex-M Family (Hardware SPI1: SCK=PA5, MISO=PA6, MOSI=PA7)
    #ifndef TFT_CS
    #define TFT_CS   PA4     // Chip Select (Hardware NSS / GPIO)
    #endif
    #ifndef TFT_DC
    #define TFT_DC   PB1     // Data / Command Control
    #endif
    #ifndef TFT_BL
    #define TFT_BL   PB9     // Backlight Control (PWM-fähig via TIM4_CH4 / TIM17)
    #endif
    #ifndef TFT_RST
    #define TFT_RST  -1      // Reset (an VDD 3.3V oder via RC-Glied)
    #endif
    #ifndef TFT_SPI_FREQ
    #define TFT_SPI_FREQ 24000000  // 24 MHz SPI Clock für STM32
    #endif

#elif defined(ARDUINO_ARCH_RP2040)
    // Raspberry Pi Pico RP2040 (Hardware SPI0: SCK=GP18, MOSI=GP19, MISO=GP16)
    #ifndef TFT_CS
    #define TFT_CS   17      // GP17 (SPI0 CSn)
    #endif
    #ifndef TFT_DC
    #define TFT_DC   20      // GP20 (Data / Command)
    #endif
    #ifndef TFT_BL
    #define TFT_BL   22      // GP22 (Backlight PWM)
    #endif
    #ifndef TFT_RST
    #define TFT_RST  21      // GP21 (Hardware Reset)
    #endif
    #ifndef TFT_SPI_FREQ
    #define TFT_SPI_FREQ 31250000  // 31.25 MHz SPI Clock für RP2040
    #endif

#elif defined(CONFIG_IDF_TARGET_ESP32S3)
    // ESP32-S3 Dual-Core (Hardware FSPI: SCK=GPIO12, MOSI=GPIO11)
    #ifndef TFT_CS
    #define TFT_CS   10      // GPIO10
    #endif
    #ifndef TFT_DC
    #define TFT_DC   9       // GPIO9
    #endif
    #ifndef TFT_BL
    #define TFT_BL   21      // GPIO21 (Backlight LEDC PWM)
    #endif
    #ifndef TFT_RST
    #define TFT_RST  14      // GPIO14
    #endif
    #ifndef TFT_SPI_FREQ
    #define TFT_SPI_FREQ 40000000  // 40 MHz SPI Clock für ESP32-S3
    #endif

#elif defined(CONFIG_IDF_TARGET_ESP32C3)
    // ESP32-C3 RISC-V Single-Core (Hardware FSPI: SCK=GPIO4, MOSI=GPIO6)
    #ifndef TFT_CS
    #define TFT_CS   7       // GPIO7
    #endif
    #ifndef TFT_DC
    #define TFT_DC   8       // GPIO8
    #endif
    #ifndef TFT_BL
    #define TFT_BL   3       // GPIO3
    #endif
    #ifndef TFT_RST
    #define TFT_RST  10      // GPIO10
    #endif
    #ifndef TFT_SPI_FREQ
    #define TFT_SPI_FREQ 26000000  // 26 MHz SPI Clock für ESP32-C3
    #endif

#elif defined(CONFIG_IDF_TARGET_ESP32S2)
    // ESP32-S2 Single-Core (Hardware FSPI: SCK=GPIO36, MOSI=GPIO35)
    #ifndef TFT_CS
    #define TFT_CS   34      // GPIO34
    #endif
    #ifndef TFT_DC
    #define TFT_DC   38      // GPIO38
    #endif
    #ifndef TFT_BL
    #define TFT_BL   33      // GPIO33
    #endif
    #ifndef TFT_RST
    #define TFT_RST  37      // GPIO37
    #endif
    #ifndef TFT_SPI_FREQ
    #define TFT_SPI_FREQ 40000000  // 40 MHz SPI Clock für ESP32-S2
    #endif

#elif defined(ARDUINO_ARCH_ESP32)
    // ESP32 Classic Dual-Core (Hardware VSPI: SCK=GPIO18, MOSI=GPIO23, MISO=GPIO19)
    #ifndef TFT_CS
    #define TFT_CS   5       // GPIO5
    #endif
    #ifndef TFT_DC
    #define TFT_DC   21      // GPIO21
    #endif
    #ifndef TFT_BL
    #define TFT_BL   15      // GPIO15 (Backlight LEDC PWM)
    #endif
    #ifndef TFT_RST
    #define TFT_RST  4       // GPIO4
    #endif
    #ifndef TFT_SPI_FREQ
    #define TFT_SPI_FREQ 40000000  // 40 MHz SPI Clock für ESP32
    #endif

#else
    // Atmel AVR Referenz (Arduino Nano ATmega328P / Mega 2560)
    // Hardware SPI: SCK=D13/D52, MOSI=D11/D51, MISO=D12/D50
    #ifndef TFT_CS
    #define TFT_CS   10      // D10 (SS)
    #endif
    #ifndef TFT_DC
    #define TFT_DC   7       // D7
    #endif
    #ifndef TFT_BL
    #define TFT_BL   9       // D9 (OC1A PWM)
    #endif
    #ifndef TFT_RST
    #define TFT_RST  -1      // Reset an Reset-Leitung oder VDD
    #endif
    #ifndef TFT_SPI_FREQ
    #define TFT_SPI_FREQ 8000000   // 8 MHz (F_CPU / 2 auf 16 MHz AVR)
    #endif

#endif

// ==============================================================================
// 2. DISPLAY-FARBDEFINITIONEN (RGB 5-6-5 High Color)
// ==============================================================================
#ifndef TFT_COLOR_BLACK
#define TFT_COLOR_BLACK       0x0000
#define TFT_COLOR_NAVY        0x000F
#define TFT_COLOR_DARKGREEN   0x03E0
#define TFT_COLOR_DARKCYAN    0x03EF
#define TFT_COLOR_MAROON      0x7800
#define TFT_COLOR_PURPLE      0x780F
#define TFT_COLOR_OLIVE       0x7BE0
#define TFT_COLOR_LIGHTGREY   0xC618
#define TFT_COLOR_DARKGREY    0x7BEF
#define TFT_COLOR_BLUE        0x001F
#define TFT_COLOR_GREEN       0x07E0
#define TFT_COLOR_CYAN        0x07FF
#define TFT_COLOR_RED         0xF800
#define TFT_COLOR_MAGENTA     0xF81F
#define TFT_COLOR_YELLOW      0xFFE0
#define TFT_COLOR_WHITE       0xFFFF
#define TFT_COLOR_ORANGE      0xFD20
#define TFT_COLOR_GREENYELLOW 0xAFE5
#define TFT_COLOR_PINK        0xF81F
#endif

// ==============================================================================
// 3. DISPLAY-DIMENSIONEN (ST7789 Standard: 320x240 Pixel Landscape)
// ==============================================================================
#ifndef TFT_DISP_WIDTH
#define TFT_DISP_WIDTH   320
#define TFT_DISP_HEIGHT  240
#define TFT_MAX_COLS     26   // 320 / (6 * 2) = 26 Spalten
#define TFT_MAX_ROWS     15   // 240 / (8 * 2) = 15 Zeilen
#endif

#endif // DISPLAY_TFT_PINS_H
