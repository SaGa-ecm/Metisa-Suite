# metisa

**E-bike controller firmware by SaGaLabs**  
Derived from the Arduino Pedelec "Forumscontroller" project. The inherited source contains prior contributors' work and third-party libraries; the metisa name does not replace their attribution or license notices.

## Project status

The inherited AVR targets are the only targets that currently build: Arduino Nano/ATmega328P (`nanoatmega328`) and Arduino Mega 2560/ATmega2560 (`megaatmega2560`). STM32 and ESP32 PlatformIO environments are exploratory only; the firmware still contains AVR-specific hardware code and those targets do not currently build. See the [MCU compatibility matrix](docs/platformio-mcu-compatibility.md) and [porting workbook](docs/mcu-port-project-workbook.md).

**Safety notice:** A successful firmware build is not a hardware or safety qualification. No metisa target has been newly qualified for motor-connected use. The inherited code has unresolved reset/shutdown, pinout, electrical-level, persistence, and hardware-test questions. Keep motor power physically disconnected during software bring-up. Do not treat this repository as road-use approval or as proof of compliance with local law.

## Build

Requires Python 3 and PlatformIO Core. From the repository root:

```powershell
python -m pip install platformio
python tools/validate_project_context.py
pio run -e nanoatmega328
pio run -e megaatmega2560
python tools/source_contract_test.py
```

PlatformIO dependencies are declared in `platformio.ini`; no user-specific Arduino library path should be needed. The project configuration defaults to the Nano environment. Building the Mega profile changes the hardware configuration selected by the compiler but does not verify a physical controller board.

## Configuration

Personal firmware settings remain in [`Arduino_Pedelec_Controller/config.h`](Arduino_Pedelec_Controller/config.h). Verify the real FC hardware revision, board schematic, signal voltage limits, ADC scaling, and pin mapping before changing hardware settings. The current default hardware revision is not a generic STM32/ESP32 pin map.

## Documentation

- [Breadboard and legacy board notes](docs/README_breadboard.md)
- [Build-system notes](docs/README_cmake.txt)
- [Hacking notes](docs/README_hacking.txt)
- [Menu documentation](docs/README_menu.txt)
- [Changelog](CHANGELOG.md)
- [GitHub Actions CI](.github/workflows/ci.yml)
- [MCU compatibility](docs/platformio-mcu-compatibility.md)
- [Porting project workbook](docs/mcu-port-project-workbook.md)
- [AI working guide](docs/AI_WORKING_GUIDE.md)
- [Fixed project rules](project-rules/INDEX.md)
- [Product surfaces and interface rules](project-rules/product-surfaces-and-interfaces.md)
- [AI skills index](skills/INDEX.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)
- [Licensing status](LICENSE)

## Contributions and permissions

Do not submit third-party code, secrets, hardware credentials, or changes copied from another project without documenting their source and license. Contributions are not accepted as a transfer or license grant merely by opening a pull request; see [CONTRIBUTING.md](CONTRIBUTING.md). Permission for use or distribution of metisa-owned material must be agreed with its verified rights holder in a separate written agreement. Existing third-party licenses continue to apply to their respective components.

## Security

Please report vulnerabilities privately where GitHub private vulnerability reporting is enabled. See [SECURITY.md](SECURITY.md). Never place API keys or access tokens in source files, issues, or pull requests.
