# Third-Party Notices

This inventory is a starting point, not a legal compatibility determination. Preserve notices in individual source files and consult the complete upstream license text before redistributing source or firmware binaries.

| Component / source area | Evidence in this repository | Preliminary status |
| --- | --- | --- |
| Inherited Pedelec Controller firmware | Main sketch and many modules identify prior contributors and GPL version 3 or later. | Do not replace original author notices. Verify ownership/assignment and scope of each notice. |
| HX711 driver | `Arduino_Pedelec_Controller/HX711.cpp` and `.h` say derived from `bogde/HX711`; `HX711_license.txt` contains the GNU GPL version 2 text. | Exact license grant on the modified source is not explicit in its file header. Resolve with upstream/license holder; compatibility with the inherited GPL-3.0-or-later firmware is a release blocker pending review. |
| MenuSystem | `MenuSystem.cpp` and `.h` state both "Released into the public domain" and "License: LGPL 3". | Conflicting notices. Verify provenance and intended license; do not assume either notice cancels the other. |
| DallasTemperature / OneWire-derived code | Source files contain upstream attribution and individual license text/notices. | Follow each file's complete notice; inventory and preserve notices during porting. |
| PCD8544 display code | Source files attribute Carlos Rodrigues and contain an MIT-style notice. | Preserve copyright and permission notice. |
| BMP085 code | `BMP085.cpp` identifies Adafruit and an MIT license. | Preserve attribution and license notice. |
| Arduino PID library | `PID_v1_nano.cpp` identifies Brett Beauregard and GPLv3. | Preserve source notice and include license text when distributing. |
| PlatformIO display dependencies | Declared in `platformio.ini`: `cbm80amiga/ST7789 AVR` 1.2.1 and `adafruit/Adafruit GFX Library` 1.12.6 (which depends on Adafruit BusIO). | Dependencies are fetched separately by PlatformIO; check their upstream license files for each distribution. |
| Arduino CMake toolchain | `cmake/LICENSE.md` contains the toolchain's MIT license, copyright 2020. | License applies to vendored CMake toolchain files, not automatically to the controller firmware. |

## Release gate

Before making this repository or a combined firmware image public, complete a file-by-file license inventory, resolve the HX711 and MenuSystem questions, confirm all required source notices are shipped, and obtain legal review of the combined-work licensing model. `LICENSE` is a draft notice and must not be represented as a final worldwide legal opinion.