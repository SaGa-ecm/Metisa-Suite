# PlatformIO MCU compatibility

## Firmware status

There is currently no released metisa firmware version in this repository that is buildable for STM32 or ESP32. The inherited source is still tied to AVR hardware. The PlatformIO environments below are compile targets for porting work, not supported firmware releases and not evidence of runtime compatibility. The inherited source baseline is Arduino Pedelec Controller v1.43; this does not imply a metisa release number.

The installed PlatformIO catalog exposes the following MCU families. One representative board is configured per family; this does not claim that every board using that MCU has the same pinout or peripherals.

| MCU family | PlatformIO environment | Representative board | Inherited v1.43 source status |
| --- | --- | --- | --- |
| STM32C0 | `stm32_c0` | `nucleo_c031c6` | Build blocked |
| STM32F0 | `stm32_f0` | `nucleo_f072rb` | Build blocked |
| STM32F1 | `stm32_bluepill_f103c8` | `bluepill_f103c8` | Build blocked |
| STM32F2 | `stm32_f2` | `nucleo_f207zg` | Build blocked |
| STM32F3 | `stm32_f3` | `nucleo_f303re` | Build blocked |
| STM32F4 | `stm32_nucleo_f411re`, `stm32_nucleo_f446re` | `nucleo_f411re`, `nucleo_f446re` | Build blocked |
| STM32F7 | `stm32_f7` | `nucleo_f767zi` | Build blocked |
| STM32G0 | `stm32_g0` | `nucleo_g070rb` | Build blocked |
| STM32G4 | `stm32_g4` | `nucleo_g431rb` | Build blocked |
| STM32H5 | `stm32_h5` | `nucleo_h563zi` | Build blocked |
| STM32H7 | `stm32_h7` | `nucleo_h743zi` | Build blocked |
| STM32L0 | `stm32_l0` | `nucleo_l073rz` | Build blocked |
| STM32L1 | `stm32_l1` | `nucleo_l152re` | Build blocked |
| STM32L4 | `stm32_l4` | `nucleo_l476rg` | Build blocked |
| STM32L5 | `stm32_l5` | `nucleo_l552ze_q` | Build blocked |
| STM32U5 | `stm32_u5` | `nucleo_u575zi_q` | Build blocked |
| STM32WB | `stm32_wb` | `nucleo_wb55rg_p` | Build blocked |
| STM32WL | `stm32_wl` | `nucleo_wl55jc` | Build blocked |
| ESP32 | `esp32dev` | `esp32dev` | Build blocked |
| ESP32-C3 | `esp32c3` | `esp32-c3-devkitc-02` | Build blocked |
| ESP32-C6 | `esp32c6` | `esp32-c6-devkitc-1` | Build blocked |
| ESP32-S2 | `esp32s2` | `esp32-s2-saola-1` | Build blocked |
| ESP32-S3 | `esp32s3` | `esp32-s3-devkitc-1` | Build blocked |

The ESP8266 environments from the earlier configuration remain available, but ESP8266 is not an ESP32 family and is not included in this matrix. Only MCU families present in the installed PlatformIO board catalog can be configured this way; newly added families need an explicit board definition and verification.

## Build checks performed

Representative builds were run for `stm32_bluepill_f103c8` (STM32F1) and `esp32dev` (original ESP32). Both reached compilation and failed on architecture-specific source dependencies before linking. The observed blockers include:

- `avr/wdt.h` in the main sketch.
- `avr/pgmspace.h` and `util/delay.h` in shared source files.
- AVR I/O-register assumptions in the bundled OneWire implementation.
- ESP32 does not define the AVR-style `A2` pin name used by the current configuration.
- Additional direct AVR port, timer and interrupt-register accesses remain in the firmware.

Because these failures are shared source-level blockers, an APC firmware image cannot currently be produced for any target in the matrix. PlatformIO configuration parsing is not a firmware build and must not be reported as one.

## Worst-case and hardware validation

No runtime or electrical worst-case tests have been run. They cannot be meaningfully or safely run until the firmware builds and has a board-specific pin map and hardware abstraction. In particular, motor output safety, watchdog/reset behavior, ADC scaling and saturation, sensor open/short faults, missing or stuck speed/PAS signals, interrupt load, brownouts, and flash/EEPROM persistence remain unverified for every STM32 and ESP32 target.

Before marking a family supported, port and build the hardware-dependent code, then run its build target and board-level tests with motor power isolated. Compile success alone is not a safety qualification.
