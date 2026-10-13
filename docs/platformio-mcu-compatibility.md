# PlatformIO MCU compatibility

## Firmware status

There is currently no released metisa firmware version in this repository. The inherited source baseline is Arduino Pedelec Controller v1.43; this does not imply a metisa release number. The PlatformIO environments below are compile targets for porting work, not supported firmware releases and not evidence of runtime compatibility. After the WP-04 hardware-abstraction port, the AVR, STM32, RP2040/RP2350 and ESP32 targets listed as verified below compile and link. STM32 families without a verified build remain compile targets only. A successful build is not electrical, motor-load, or safety qualification.

The installed PlatformIO catalog exposes the following MCU families. One representative board is configured per family; this does not claim that every board using that MCU has the same pinout or peripherals.

Status codes: `build verified` means compile and link succeeded locally on 2026-10-13 but carries no runtime, electrical, or safety claim; `build open` means no verified build exists yet.

The FC hardware revision each target compiles against is not set per environment; it follows only the compiler default in `config.h` lines 13-20. ATmega2560 selects `HARDWARE_REV 20` (FC 2.x), other AVR selects `HARDWARE_REV 5` (FC 1.5), every 32-bit target selects `HARDWARE_REV 30` (generic 32-bit profile, not a historical FC revision). No environment sets `HARDWARE_REV` explicitly, so FC 2.1/2.2 builds require a manual `-DHARDWARE_REV=21` or `-DHARDWARE_REV=22` flag. See the FC revision to controller matrix in [the porting workbook](mcu-port-project-workbook.md).

| MCU family | PlatformIO environment | Representative board | FC revision default | Source status |
| --- | --- | --- | --- | --- |
| ATmega328P | `nanoatmega328` | `nanoatmega328` | FC 1.5 (`HARDWARE_REV 5`) | build verified |
| ATmega2560 | `megaatmega2560` | `megaatmega2560` | FC 2.0 (`HARDWARE_REV 20`) | build verified |
| STM32C0 | `stm32_c0` | `nucleo_c031c6` | Rev 30 | build open |
| STM32F0 | `stm32_f0` | `nucleo_f072rb` | Rev 30 | build open |
| STM32F1 | `stm32_bluepill_f103c8` | `bluepill_f103c8` | Rev 30 | build verified |
| STM32F2 | `stm32_f2` | `nucleo_f207zg` | Rev 30 | build open |
| STM32F3 | `stm32_f3` | `nucleo_f303re` | Rev 30 | build open |
| STM32F4 | `stm32_blackpill_f401cc`, `stm32_nucleo_f411re`, `stm32_nucleo_f446re` | `blackpill_f401cc`, `nucleo_f411re`, `nucleo_f446re` | Rev 30 | build verified |
| STM32F7 | `stm32_f7` | `nucleo_f767zi` | Rev 30 | build open |
| STM32G0 | `stm32_g0` | `nucleo_g070rb` | Rev 30 | build open |
| STM32G4 | `stm32_g4` | `nucleo_g431rb` | Rev 30 | build verified |
| STM32H5 | `stm32_h5` | `nucleo_h563zi` | Rev 30 | build open |
| STM32H7 | `stm32_h7` | `nucleo_h743zi` | Rev 30 | build open |
| STM32L0 | `stm32_l0` | `nucleo_l073rz` | Rev 30 | build open |
| STM32L1 | `stm32_l1` | `nucleo_l152re` | Rev 30 | build open |
| STM32L4 | `stm32_l4` | `nucleo_l476rg` | Rev 30 | build open |
| STM32L5 | `stm32_l5` | `nucleo_l552ze_q` | Rev 30 | build open |
| STM32U5 | `stm32_u5` | `nucleo_u575zi_q` | Rev 30 | build open |
| STM32WB | `stm32_wb` | `nucleo_wb55rg_p` | Rev 30 | build open |
| STM32WL | `stm32_wl` | `nucleo_wl55jc` | Rev 30 | build open |
| RP2040 | `pico` | `pico` | Rev 30 | build verified |
| RP2350 | `pico2w` | `rpipico2w` | Rev 30 | build open |
| ESP32 | `esp32dev` | `esp32dev` | Rev 30 | build verified |
| ESP32-C3 | `esp32c3` | `esp32-c3-devkitc-02` | Rev 30 | build verified |
| ESP32-C6 | `esp32c6` | `esp32-c6-devkitc-1` | Rev 30 | build open |
| ESP32-S2 | `esp32s2` | `esp32-s2-saola-1` | Rev 30 | build verified |
| ESP32-S3 | `esp32s3` | `esp32-s3-devkitc-1` | Rev 30 | build verified |

The ESP8266 environments from the earlier configuration remain available, but ESP8266 is not an ESP32 family and is not included in this matrix. Only MCU families present in the installed PlatformIO board catalog can be configured this way; newly added families need an explicit board definition and verification.

## Build checks performed

On 2026-10-13 the following environments were built locally with `pio run` and reported `SUCCESS` (compile and link):

- `nanoatmega328` (ATmega328P), FC 1.5 default
- `megaatmega2560` (ATmega2560), FC 2.0 default
- `stm32_bluepill_f103c8` (STM32F1), Rev 30
- `stm32_blackpill_f401cc`, `stm32_f407ve`, `stm32_f407vg`, `stm32_nucleo_f411re`, `stm32_nucleo_f446re` (STM32F4), Rev 30. `stm32_f407ve` and `stm32_f407vg` built with `-DMETISA_CORE_ENABLE` (board-neutral C++ core adapter active, observational only).
- `stm32_g4` (STM32G4), Rev 30
- `pico` (RP2040), Rev 30
- `esp32dev`, `esp32s2`, `esp32s3`, `esp32c3` (ESP32 family), Rev 30

Additional FC revision compile checks on 2026-10-13 (megaatmega2560 only, no flash):

- `megaatmega2560` with `PLATFORMIO_BUILD_FLAGS=-DHARDWARE_REV=21` -> `SUCCESS`
- `megaatmega2560` with `PLATFORMIO_BUILD_FLAGS=-DHARDWARE_REV=22` -> `SUCCESS`

These are compile/link results only. They are not a hardware qualification and do not establish that FC 2.1 or FC 2.2 is electrically identical to FC 2.0.

Earlier representative builds for `stm32_bluepill_f103c8` and `esp32dev` failed on architecture-specific source dependencies before linking. The observed blockers were:

- `avr/wdt.h` in the main sketch.
- `avr/pgmspace.h` and `util/delay.h` in shared source files.
- AVR I/O-register assumptions in the bundled OneWire implementation.
- ESP32 does not define the AVR-style `A2` pin name used by the current configuration.
- Additional direct AVR port, timer and interrupt-register accesses remain in the firmware.

These blockers were addressed by the WP-04 hardware-abstraction port (`hal.h`/`hal.cpp`, portable OneWire/delay/PROGMEM shims, board pin aliasing). PlatformIO configuration parsing is not a firmware build and must not be reported as one.

## Worst-case and hardware validation

No runtime or electrical worst-case tests have been run. They cannot be meaningfully or safely run until the firmware builds and has a board-specific pin map and hardware abstraction. In particular, motor output safety, watchdog/reset behavior, ADC scaling and saturation, sensor open/short faults, missing or stuck speed/PAS signals, interrupt load, brownouts, and flash/EEPROM persistence remain unverified for every STM32 and ESP32 target.

Before marking a family supported, port and build the hardware-dependent code, then run its build target and board-level tests with motor power isolated. Compile success alone is not a safety qualification.
