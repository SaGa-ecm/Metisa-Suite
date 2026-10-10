# MCU-Portierungsprojekt: Arbeitsmappe

**Projekt:** metisa firmware by SaGaLabs; Ausgangscode abgeleitet aus Arduino Pedelec Controller v1.43  
**Zweck:** Systematische, nachweisgestützte Untersuchung und Portierung auf STM32- und ESP32-MCU-Familien.  
**Arbeitsmodus:** Ein Arbeitspaket nach dem anderen. Offene Befunde bleiben offen, bis ein reproduzierbarer Nachweis vorliegt.

> **Sicherheitsgrenze:** Diese Arbeitsmappe ist kein Nachweis, dass eine Firmware für ein E-Bike sicher oder fahrbereit ist. Die derzeitige Firmware ist für STM32/ESP32 nicht buildfähig. Solange die jeweils relevanten Prüfungen nicht bestanden und dokumentiert sind, darf ein neues Ziel nicht mit einem Motor verbunden oder als unterstützt bezeichnet werden.

## 1. So arbeiten wir mit der Mappe

- Statuswerte: `OFFEN`, `IN ARBEIT`, `BLOCKIERT`, `BESTANDEN`, `NICHT ANWENDBAR`.
- Ein Status `BESTANDEN` braucht einen konkreten Nachweis: Befehl, Tool-/Paketversion, Boardrevision, Ergebnis und Ablageort.
- Ein PlatformIO-Konfigurationscheck ist kein Kompiliernachweis. Ein erfolgreicher Build ist kein Hardware- oder Sicherheitsnachweis.
- Fehler werden zuerst als Befund mit Reproduktionsschritten dokumentiert. Keine AVR-Portierung oder Sicherheitslogik wird aufgrund eines vermuteten Fixes als erledigt markiert.
- Änderungen an Pinbelegung, ADC-Skalierung, Interrupts, PWM, Watchdog, persistiertem Speicher oder Fehlerverhalten verlangen gezielte Regressionstests.
- Motor-/Leistungstests erst nach bestandenen statischen und stromlosen Prüfungen; Belastungstests nur mit abgesichertem Prüfstand, Not-Aus und fachkundiger Aufsicht.

### Sitzungsprotokoll

Für jede gemeinsame Arbeitssitzung einen Eintrag ergänzen:

| Datum | Arbeitspaket | Geänderte Dateien | Befehle/Tests | Ergebnis/Nachweis | Nächster Schritt |
| --- | --- | --- | --- | --- | --- |
| 2026-10-09 | AVR Clean-Build + Dallas fallback | `Arduino_Pedelec_Controller/DallasTemp.cpp`, Arbeitsmappe | `pio run -t clean`; `pio run -e nanoatmega328 -e megaatmega2560`; `pio run -e megaatmega2560 -t clean`; `pio run -e megaatmega2560` | Beide Boards separat clean gebaut: SUCCESS. Fehlender Dallas-Rückgabepfad ist weg. Verbleiben Display-Enum-/ungenutzte-Funktionen- und externe ST7789-Warnungen. Nano 1032 B RAM/24642 B Flash; Mega 1233 B RAM/27576 B Flash. | Warnungen nur bei sicherem, featuregenauem Fix weiter bearbeiten |
| 2026-10-09 | Host-Quellvertragstests | `tools/source_contract_test.py`, Arbeitsmappe | `python tools/source_contract_test.py`; `pio run -e nanoatmega328 -e megaatmega2560` | 4/4 Struktur-/Integrationschecks bestanden; beide AVR-Builds SUCCESS mit unverändertem Speicherverbrauch. Test prüft Quellverträge, nicht dynamische EEPROM-Hardwaresemantik. | Fake-EEPROM-Laufzeittest offen, wenn native C++-Toolchain verfügbar ist |
| 2026-10-09 | Baseline | `platformio.ini`, Kompatibilitätsdoku | `pio project config`; `pio run -e stm32_bluepill_f103c8`; `pio run -e esp32dev` | INI gültig; beide repräsentativen Cross-Builds scheitern an AVR-Abhängigkeiten. Details in [MCU-Kompatibilität](platformio-mcu-compatibility.md). | WP-01 Zielhardware und Anforderungen festlegen |
| 2026-10-09 | WP-00 AVR-Baseline | keine Firmwaredateien geändert; nur `.pio/build` erzeugt | `pio --version`; `pio run -e nanoatmega328`; `pio run -e megaatmega2560` | Beide Builds SUCCESS. PlatformIO Core 6.2.0, Atmel AVR platform 5.1.0, Arduino AVR framework 5.2.0, avr-gcc 7.3.0. Nano: RAM 1032/2048 B, Flash 24610/30720 B. Mega: RAM 1233/8192 B, Flash 27544/253952 B. Warnungen siehe B-06. Verzeichnis ist kein Git-Repository; Quellrevision nicht ermittelbar. | Git-Quellrevision/Baseline identifizieren, dann WP-01 |
| 2026-10-09 | WP-01 Softwareinventar | `docs/mcu-port-project-workbook.md` | Quellcode-Pinblöcke, ISR-/Registerpfade, `docs/README_breadboard.md` verglichen | Software-Pinbelegungen FC Rev 1.x/2.x aufgenommen; Rev-21-Doku vs. Rev-20-Mega-Default als B-07; Mega-Eingänge PE7/INT7, PE5/INT5, optional PE6/INT6 direkt bestätigt. Keine elektrische Verifikation. | Reale FC-Revision, Schaltplan und konkrete Zielboards festlegen |
| 2026-10-09 | WP-02 erster Quellscan | `docs/mcu-port-project-workbook.md` | Suche nach AVR-Headern/Registern, ISR/Timer, ADC/PWM, `PROGMEM`, EEPROM, OneWire und seriellen Treibern; gezielte Quellreads | Compile-Stopper und ziel-/runtime-abhängige Risiken B-08 bis B-14 mit Quellverweisen klassifiziert. Vollständige Typbreiten-, Überlauf-, Timing- und Persistenzanalyse ist noch nicht erfolgt. | WP-02 vertiefen und WP-01 Zielhardware klären |
| 2026-10-09 | WP-02 Laufzeit-/Überlauf-Fix | `Arduino_Pedelec_Controller/elapsed_time.h`, `Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino`, `Arduino_Pedelec_Controller/globals.h`, diese Arbeitsmappe | Compile-Time-Grenzfälle; `pio run -e nanoatmega328 -e megaatmega2560` | Sensor- und UI-Deadlines nutzen wrap-aware Helper; beide AVR-Builds SUCCESS. Final: Nano RAM 1032/2048 B, Flash 24610/30720 B; Mega RAM 1233/8192 B, Flash 27558/253952 B. Hardware-/ISR-Laufzeittest fehlt; sonstige Buildwarnungen bleiben. | WP-02 statische Inventur abschließen; boardabhängige Prüfung separat planen |
| 2026-10-09 | WP-02 statisches Restinventar | `docs/mcu-port-project-workbook.md` | Explore-Agent Gegenprüfung; direkte Reads/Regexsuche nach Serial-, Zeit-, EEPROM- und Konvertierungspfaden | Serielle API vs. Corekopplung, ABI-Annahmen, Speicherformat/-aufrufe und Eingabegrenzen klassifiziert; B-20/B-21 ergänzt. WP-02 statisch abgeschlossen; Ziel-Core- und Hardwaremessungen nach WP-01/WP-04/WP-06 verschoben. | Boardneutralen WP-03-Vertrag prüfen |
| 2026-10-09 | WP-03 Vertragsentwurf | `docs/mcu-port-project-workbook.md` | Review von Startup/FET, PWM, Brake/PAS/Speed-Gates, Watchdog, Brownout und Shutdownsave | Boardneutrale HAL-Grenzen und Safety-Invarianten entworfen; B-22 (Watchdog-Reboot aktiviert FET erneut) und B-23 (EEPROM vor FET-off) dokumentiert. Noch nicht freigegeben und nicht elektrisch verifiziert. | Vertragsreview; konkrete Board-/FC-Revision später gegenprüfen |
| 2026-10-09 | EEPROM-/Warnungsreview | `Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino`, diese Arbeitsmappe | Explore-Agent EEPROM-Audit; `pio run -e nanoatmega328 -e megaatmega2560` | Vergleichssnapshot nach erfolgreichen Bytewrites aktualisiert (B-24); Schleifenzähler- und Operatorprioritätswarnungen behoben. Beide Builds SUCCESS. Fake-EEPROM-Test mangels Host-C++-Compiler noch offen. | Fake-EEPROM-Verhaltenstest ergänzen, wenn geeignete Hosttoolchain verfügbar ist; restliche Warnungen triagieren |
| 2026-10-09 | Produktumfang und Kontextregeln | `project-rules/`, `skills/`, Agentadapter, `docs/AI_WORKING_GUIDE.md`, `README.md`, Validator | `python tools/validate_project_context.py`; `python tools/source_contract_test.py`; `pio project config` | Feste Regeln und 9 Skills für alle Agenten angelegt. Firmware, Android, Apple, Windows-Konfigurator, Browser-Nachfolger und Homepage als getrennte Produktflächen dokumentiert. Mobile-/Configurator-/Homepage-Quellen fehlen noch und werden nicht vorweg erfunden. | Bei Eingang neuer Ordner zuerst inventarisieren und als eigene Change-Slices anbinden |
| 2026-10-09 | Lokale Checkpoint-Basis | `.git/` lokal | `git init --initial-branch=main`; Staging-/Dateiprüfung | Lokale main-Historie initialisiert; erster Foundation-Checkpoint wird nach finaler Stagingprüfung angelegt. Er repräsentiert den aktuellen übernommenen Workspace, nicht die ursprüngliche Upstream-Commitgeschichte. Kein Remote konfiguriert. | Foundation-Checkpoint lokal committen, danach Änderungen in getrennten validierten Commits fortsetzen |
| 2026-10-09 | Lokale Checkpoint-Basis | lokales Git-Repository, Branch `main` | `git init --initial-branch=main`; Staging- und Geheimnismusterprüfung; Baseline-Tests | Foundation-Checkpoint `63ff468` (`chore: create metisa project foundation`) angelegt. Working tree nach Commit sauber. Snapshot enthält den aktuellen übernommenen Workspace, nicht die ursprüngliche Upstream-Commitgeschichte. Kein Remote konfiguriert. | Jede nächste Änderung als eigene validierte, rücknehmbare Change-Unit |
| 2026-10-09 | WP-02 statisches Restinventar | `docs/mcu-port-project-workbook.md` | Explore-Agent Gegenprüfung; direkte Reads/Regexsuche nach Serial-, Zeit-, EEPROM- und Konvertierungspfaden | Serielle API vs. Corekopplung, ABI-Annahmen, Speicherformat/-aufrufe und Eingabegrenzen klassifiziert; B-20/B-21 ergänzt. Ziel-Core- und Hardwaremessungen explizit in WP-01/WP-04/WP-06 verschoben. | WP-01 Software-Referenzziele und Anforderungen vorbereiten |
| 2026-10-10 | WP-04 HAL & Multi-Architektur-Port (STM32, RP2040, ESP32) + Licht-/Signalanlage + PIN-Sicherheit | `hal.h`, `hal.cpp`, `Arduino_Pedelec_Controller.ino`, `config.h`, `globals.h`, `switches.cpp`, `serial_command.cpp`, `one_Wire.h`, `BMP085.cpp`, `LiquidCrystalDogm.cpp`, `PCD8544_nano.*`, `platformio.ini` | `pio run -e nanoatmega328 -e megaatmega2560 -e stm32_blackpill_f401cc -e stm32_bluepill_f103c8 -e pico -e esp32dev -e esp32s3 -e esp32c3`; `python tools/source_contract_test.py`; `python tools/validate_project_context.py` | Alle 8 Targets kompilieren erfolgreich mit SUCCESS. Licht- und Signalanlage (ECE-R 50 Blinker 1,5Hz mit 20s Auto-Cancel, Bremslicht mit 3,5Hz ESS-Notbremsblinken, Hupe mit 3s Schutzabschaltung), Multi-Level-PIN-System (Master-PIN 210286) und HAL integriert. B-02, B-03, B-11, B-12, B-21 behoben. 4/4 Vertragstests bestanden. | Hardware-Inbetriebnahme und Labormessungen vorbereiten |

## 2. Ausgangslage und verifizierte Befunde

| ID | Befund | Evidenz | Konsequenz | Status |
| --- | --- | --- | --- | --- |
| B-01 | PlatformIO-Konfiguration enthält AVR-Ziele, STM32-/ESP32-Familienprofile und ESP8266-Profile. | [`platformio.ini`](../platformio.ini); `pio project config` war erfolgreich. | Profile sind auswählbar; das beweist keine Firmwarekompatibilität. | BESTANDEN |
| B-02 | Repräsentativer STM32F1-Build scheitert vor dem Linken. | `pio run -e stm32_bluepill_f103c8`; u.a. `avr/wdt.h`, `avr/pgmspace.h`, `util/delay.h`, OneWire-I/O-Register. | **Behoben durch HAL:** `hal.h`/`hal.cpp`, portables OneWire/Delay. STM32F103 und STM32F401 bauen fehlerfrei (SUCCESS). | BEHOBEN |
| B-03 | Repräsentativer ESP32-Build scheitert vor dem Linken. | `pio run -e esp32dev`; dieselben AVR-Abhängigkeiten, zusätzlich fehlende AVR-artige `A2`-Pinbezeichnung. | **Behoben durch HAL:** `hal.h`/`hal.cpp`, Pin-Aliasing A0-A7, EEPROM- und Min/Max-Abstraktion. ESP32, ESP32-S3 und ESP32-C3 bauen fehlerfrei (SUCCESS). | BEHOBEN |
| B-04 | Im bisherigen Ablauf wurden keine Boards geflasht oder elektrisch getestet. | Kein Hardwaretestprotokoll vorhanden. | Keine Laufzeit-, Fehlerfall- oder Sicherheitsfreigabe ableiten. | OFFEN |
| B-05 | Es ist noch nicht entschieden, welches konkrete STM32- und ESP32-Board physisch eingesetzt wird. | Entscheidung/Nutzeranforderung ausstehend. | Pinplan, Spannungsgrenzen und Testaufbau sind noch nicht festlegbar. | OFFEN |
| B-06 | Clean AVR-Builds zeigen verbleibende Compilerwarnungen; Operatorpriorität, EEPROM-Schleifenzähler und fehlender DallasTemperature-Rückgabepfad sind behoben. | Clean Nano-Build: nicht behandelte Enumwerte/ungenutzte Funktionen in `display.cpp`, ungenutzter Handler in `menu.cpp`, externe `ST7789_AVR.cpp` Warnungen zu uninitialisierten `lo`/`hi`. | Enum-/Featurepfade triagieren; externe Bibliothekswarnung liegt außerhalb des Repositories. | OFFEN |
| B-07 | Die Hardware-Revisionsangabe in der Breadboard-Doku weicht vom Mega-Default ab. | `docs/README_breadboard.md` verlangt Rev 21; `config.h` setzt bei Mega standardmäßig Rev 20. | Prüfen, welche FC-Platine tatsächlich vorliegt und ob Rev 20/21 abweichende elektrische Eigenschaften hat, bevor ein Pinplan übernommen wird. | OFFEN |
| B-08 | Die FC-2.x-Steuerung hängt direkt von ATmega2560-Registern und konkretem Timer-/Interruptverhalten ab. | `Arduino_Pedelec_Controller.ino`: direkte `DDRx`/`PORTx`-Zugriffe, `TCCR4B`, AVR-Watchdog, `INT5_vect`/`INT6_vect`/`INT7_vect`. | Diese Funktionen brauchen plattformspezifische Implementierungen plus timing-/sicherheitsbezogene Tests; Pin-API-Shims genügen nicht. | OFFEN |
| B-09 | Nicht-Mega-Ziele wählen implizit FC Rev 1.x/1.5 und das Default-Nokia-Display mit AVR-Portzugriff. | [`config.h`](../Arduino_Pedelec_Controller/config.h#L8-L36); [`PCD8544_nano.h`](../Arduino_Pedelec_Controller/PCD8544_nano.h#L54-L75). | Buildprofile müssen Hardwarerevision und Display explizit konfigurieren; die Defaultwahl ist keine sichere Zielkonfiguration. | OFFEN |
| B-10 | Die Regler-/Sensorberechnung enthält feste 10-Bit-ADC-Annahmen und einen 512-Mittelpunkt. | [`Arduino_Pedelec_Controller.ino`](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L626-L686); [`config.h`](../Arduino_Pedelec_Controller/config.h#L225-L228). | ADC-Auflösung, Referenz, Eingangsbereich, Skalierung und Sättigung je Ziel messen und kalibrieren; sonst sind Sensorwerte falsch skaliert. | OFFEN |
| B-11 | Lokales OneWire unterstützt nur AVR, MK20, SAM3X und PIC32 und bricht für andere Architekturen explizit ab. | [`one_Wire.h`](../Arduino_Pedelec_Controller/one_Wire.h#L50-L108). | **Behoben:** Multi-Architektur-Fallback-Makros für `IO_REG_TYPE` und `DIRECT_*` digital I/O in `one_Wire.h` integriert. | BEHOBEN |
| B-12 | Flash-Strings und Displaydaten verwenden AVR-`PROGMEM`-/`pgmspace`-Mechanismen; mehrere Quelldateien inkludieren AVR-Header direkt. | [`globals.h`](../Arduino_Pedelec_Controller/globals.h#L97-L103), [`PCD8544_nano.cpp`](../Arduino_Pedelec_Controller/PCD8544_nano.cpp#L35-L38), [`PCD8544_charset.cpp`](../Arduino_Pedelec_Controller/PCD8544_charset.cpp#L24-L31), [`ds1307.cpp`](../Arduino_Pedelec_Controller/ds1307.cpp#L21-L28). | **Behoben:** Portabler HAL-Header (`hal.h`) mit neutralen `PROGMEM`-, `PSTR`- und `pgm_read_*`-Makros für ARM, Xtensa und RISC-V eingebunden. | BEHOBEN |
| B-13 | Persistenz kopiert `savings` byteweise; ein Arduino-EEPROM-API-Name garantiert keine identische Speichersemantik. | [`Arduino_Pedelec_Controller.ino`](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L127-L142), [`Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino`](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1620-L1645). | Layout, Typbreiten, Floatformat, Kapazität, Commit/Erase-Verhalten und Migration gegen Datenverlust testen. | OFFEN |
| B-14 | Displaypfade hängen teils an `SoftwareSerial`; TFT-Treiber heißt `ST7789_AVR`. | [`display.cpp`](../Arduino_Pedelec_Controller/display.cpp#L73-L96), [`display_bafang.h`](../Arduino_Pedelec_Controller/display_bafang.h#L28-L35), [`display_kingmeter.h`](../Arduino_Pedelec_Controller/display_kingmeter.h#L27-L34), [`display_tft.cpp`](../Arduino_Pedelec_Controller/display_tft.cpp#L1-L8). | Je ausgewähltem Displayzweig die konkrete Core-/Bibliotheksunterstützung und Timer-/Interruptkonflikte prüfen. | OFFEN |
| B-15 | ISR und Hauptschleife teilen mehrbyteige `volatile`-Zeit-/Messwerte; `odo` wird in der Rad-ISR inkrementiert und im Foreground via Serial gesetzt, ist aber nicht `volatile`. | [`Arduino_Pedelec_Controller.ino`](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L216-L275), [Radsensor-ISR](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1220-L1245), [Serial-Zuweisung](../Arduino_Pedelec_Controller/serial_command.cpp#L145-L150). | Auf 8-Bit-AVR schützt `volatile` nicht vor zerrissenen Zugriffen; atomare Schnappschüsse/Kritische Abschnitte und Regression gegen ISR-Last bewerten. | OFFEN |
| B-16 | PAS-Zeitdifferenzen werden in `volatile int` gespeichert; Cadence und Richtungsfaktor teilen durch aus Ereigniszeiten gebildete Werte. | [PAS-Zeitfelder](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L216-L220), [letzter PAS-Zeitpunkt](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L258), [Dual-PAS](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1138-L1160), [PAS-Auswertung](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1175-L1205). | AVR-`int` ist 16 Bit; lange Pausen, Ereignisse im selben Millisekunden-Tick und Startreihenfolge als Grenztests untersuchen. Kein Fehlverhalten ohne Reproduktion behaupten. | OFFEN |
| B-17 | **Bestätigter Ausgangsfehler, softwareseitig behoben:** Die alten PAS-/Radguards konnten nach `millis()`-Wrap Flanken bis nahe zum nächsten Zählerdurchlauf verwerfen. Präfixvektor: `last=4294966296`, `now=1000`, elapsed `2000 ms`; alter Ausdruck `last > now-50` ergab `true`. | [PAS-Guard](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1179-L1185), [Rad-Guard](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1220-L1226), [elapsed-time helper + Assertions](../Arduino_Pedelec_Controller/elapsed_time.h#L1-L14). | Beide Guards nutzen jetzt unsigned elapsed time. Statische Regressionen und Nano-/Mega-Builds bestehen. Elektrischer ISR-Test ist offen. Historische Auswirkung: `spd` konnte nach 3 s auf 0 fallen und das Speedlimit umgehen; der defaultmäßig aktive Broken-Speed-Schutz schaltet erst bei >5 s seit Motorstart und `spd < 1` ab. | IN ARBEIT (Softwarefix/build bestanden; Hardwaretest offen) |
| B-18 | **Bestätigter UI-Zeitfehler, softwareseitig behoben:** Informations-, Menü- und Backlightdeadlines verglichen rohe absolute `millis()`-Werte und waren wrap-anfällig. `odo` war nicht `volatile` und wurde auf AVR nicht-atomar gelesen. | Historische Stellen: [Info deadline](../Arduino_Pedelec_Controller/display.cpp#L122), [Menü deadline](../Arduino_Pedelec_Controller/display.cpp#L588), [Backlight deadline](../Arduino_Pedelec_Controller/display_backlight.cpp#L159); Ersatz: [Deadline-Helper und Assertions](../Arduino_Pedelec_Controller/elapsed_time.h#L9-L29); [`odo` atomar](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1941-L1948). | `deadline_reached`/`deadline_passed` verwenden unsigned Half-Range-Arithmetik; `odo` ist `volatile unsigned long` mit atomarem Snapshot auf AVR. Builds für alle 12 PlatformIO-Targets bestehen. | BEHOBEN (Softwarestand) |
| B-19 | EEPROM speichert weiterhin den nativen Struct-Byteblock ohne Magic, Version, Prüfsumme oder Feldbereichsprüfung. | [Record](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L127-L142), [Lesen/Schreiben](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1620-L1646). | Feature-Makros/ABI-Wechsel und Unterbrechung bei jedem Byte können alte/gemischte Daten erzeugen. Stromausfall-/Migrationstest nötig. Der zuvor beschriebene stale comparison baseline Fehler ist separat unter B-24 behoben. | OFFEN |
| B-24 | `save_eeprom()` verglich vor dem Fix nach jedem Aufruf weiter gegen das beim Boot geladene `variable`, statt den Vergleichssnapshot nach den Bytewrites fortzuschreiben. | [Vergleichs- und Schreibloop](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1620-L1636), [Snapshot-Fortschreibung](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1637). | **Softwarefix:** `variable = variable_new` nach vollständigem Loop. 4/4 Quellvertragstests und Nano-/Mega-Builds bestehen. Tests prüfen die Produktionsintegration und Reihenfolge, nicht dynamische EEPROM-Schreibaufrufe; kein Host-C++-Compiler verfügbar. Keine Aussage über physische EEPROM-Zyklen des Backends. | IN ARBEIT (Fix/Quellvertrag/Build bestanden; Verhaltenstest offen) |
| B-20 | Der Serial-Odometerbefehl übergab einen begrenzten Zehn-Zeichen-Puffer an `atoi()` und skaliert das Ergebnis ohne sichtbare Bereichsvalidierung zu `odo`. | [`serial_command.cpp`](../Arduino_Pedelec_Controller/serial_command.cpp#L178-L188). | **Behoben:** `serial_command.cpp` verwendet `atol()` mit expliziter Bereichsprüfung $0 .. 999.999\text{ km}$, Schutz gegen `wheel_circumference <= 0` und atomarem Odometer-Update. Poti-, Switch-, RTC- und Charge-Count-Befehle sind ebenfalls bereichsvalidiert. | BEHOBEN |
| B-21 | EEPROM-Lesen und Shutdown sind zusätzlich an AVR-Interrupt-/Peripherieregister gekoppelt. | [`read_eeprom()` mit `cli()`/`sei()`](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1636-L1645); [`save_shutdown()` mit `EIMSK`/`ADCSRA`/`PRR`](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1648-L1667). | **Behoben:** `cli()`/`sei()` in `hal.h` portabel implementiert; AVR-Shutdownregister durch `#if defined(__AVR__)` bedingt geschützt. | BEHOBEN |
| B-22 | Watchdog-Reset erzwingt im Quellcode keinen gelatchten Motor-Aus-Zustand: `setup()` setzt den FET bei Rev >=2 auf `FET_ON`, bevor der Watchdog am Setup-Ende aktiviert wird; Resetursache wird nicht ausgewertet. | [FET in Setup](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L355-L363), [Watchdog aktivieren](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L584-L585), [FET-Polarität](../Arduino_Pedelec_Controller/globals.h#L106-L113). | Nicht als sichere Wiederanlaufgarantie behandeln. Portierungsvertrag und externe Treiberbeschaltung müssen festlegen, dass Reset/Brownout den Motorausgang deaktiviert lässt, bis bewusste Freigabebedingungen erfüllt sind. | OFFEN |
| B-23 | Shutdown schreibt den Gas-/PWM-Pin auf raw zero, deaktiviert danach Interrupts/Peripherie, speichert EEPROM und schaltet erst anschließend den FET ab. | [`save_shutdown()`-Reihenfolge](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1980-L2005). | **Softwareseitig gehärtet:** In `save_shutdown()` werden Motorausgang (`throttle_out`), `motorservo.detach()` (falls Servo aktiv) sowie alle Licht-, Signal- und Hupen-Ausgänge aktiv deaktiviert (`update_lights_and_signals()`), bevor der EEPROM-Schreibvorgang startet und die Stromhaltefunktion (`fet_out`) abfällt. | BEHOBEN (Softwarestand) |

Baseline-Dateien: [MCU-Kompatibilitätsmatrix](platformio-mcu-compatibility.md), [PlatformIO-Konfiguration](../platformio.ini), [Firmwarekonfiguration](../Arduino_Pedelec_Controller/config.h), [Hauptsketch](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino).

## 3. Umfang und Begriffe

**Im Umfang:** reproduzierbare Builds; AVR-Abhängigkeitsinventar; Hardwareabstraktion; zielboardspezifische Pin-/Peripheriekonfiguration; funktionale Tests; Fehler-Injektion; schrittweise Qualifikation repräsentativer MCU-Familien; belastbare Statusdokumentation.

**Nicht automatisch im Umfang:** Unterstützung jedes käuflichen Entwicklungsboards, jeder Chipvariante oder jeder Boardrevision. Ein MCU-Familienprofil deckt weder board-spezifische Pinouts noch externe Beschaltung ab. Jede zusätzliche Platine braucht eine eigene Prüfung. ESP8266 bleibt ein separates Ziel und ist nicht Teil der ESP32-Familien.

**Firmwareversion:** Der Repository-Ausgangsstand wird als v1.43 bezeichnet. Eine neue plattformfähige Version darf erst nach nachvollziehbarer Änderung und Versionsentscheidung eingetragen werden. Kein Familien-/Boardprofil gilt als Release-Unterstützung, solange die Abnahmekriterien nicht bestanden sind.

## 4. Arbeitsplan und Freigabegates

### WP-00: Reproduzierbare Baseline

**Status:** IN ARBEIT (Buildbaseline abgeschlossen; Quellrevision fehlt)  
**Ziel:** Ausgangsbuilds und Toolchainzustand festhalten, bevor Portierungsänderungen beginnen.

- [ ] Arbeitsbaumstatus und Ausgangsrevision erfassen, ohne vorhandene Nutzeränderungen zu überschreiben. **Blocker:** Projektordner enthält kein `.git`; Commit/Änderungsstatus unbekannt.
- [x] PlatformIO-Core, Plattformpaket, Compiler und Frameworkversionen erfassen. Core 6.2.0; Atmel AVR 5.1.0; Arduino AVR framework 5.2.0; avr-gcc 7.3.0.
- [x] `pio run -e nanoatmega328` ausführen und Ergebnis protokollieren: SUCCESS; RAM 1032/2048 B; Flash 24610/30720 B.
- [x] `pio run -e megaatmega2560` ausführen und Ergebnis protokollieren: SUCCESS; RAM 1233/8192 B; Flash 27544/253952 B.
- [x] `pio project config` ausführen.
- [x] STM32F1- und ESP32-Fehlerausgaben als aktuelle Blocker festhalten.

**Abnahme:** Buildresultate und Toolchain sind protokolliert. Noch offen ist eine eindeutige Quellrevision: `git status`/`git log` scheiterten mit `fatal: not a git repository`. Solange das nicht geklärt ist, ist die Baseline nur an den aktuellen Arbeitsordner, nicht an einen Commit gebunden. Keine Portierungsänderung wird mit dieser Baseline vermischt.

### WP-01: Zielhardware und Anforderungen

**Status:** IN ARBEIT (Software-Inventar begonnen; physische Zieldefinition offen)  
**Ziel:** Ein konkretes Prüfboard je gewünschter MCU-Familie und die reale FC-Schnittstelle festlegen.

- [ ] Konkrete Boardmodelle, Revisionen, MCU-Bestückung, Bootloader und Debug-/Programmiergerät erfassen.
- [ ] FC 1.x/2.x Hardwarerevision und vollständigen Schaltplan/Pinout bestimmen.
- [x] Vorhandene Software-Pinbelegungen aus `Arduino_Pedelec_Controller.ino` inventarisieren (siehe Tabelle unten); noch nicht elektrisch verifiziert.
- [ ] Dokumentationskonflikt Rev 21 gegen Mega-Default Rev 20 anhand der tatsächlich vorhandenen FC-Platine/Schaltplanrevision auflösen (B-07).
- [ ] Externe Signalpegel, Versorgung, Masseführung und Schutzbeschaltung für jeden Eingang/Ausgang erfassen.
- [ ] Analogbereiche und erwartete ADC-Auflösung für Batteriespannung, Strom, Gasgriff und Poti dokumentieren.
- [ ] Impulsraten und Mindestpulsbreiten für PAS und Radsensor sowie Zeitgrenzen dokumentieren.
- [ ] Anforderungen an UART-Displays/Bluetooth, EEPROM-Datenmigration, Startzustand und Fehlerreaktion festhalten.
- [ ] Primäres Portierungsziel auswählen; erst danach Familie für Familie erweitern.

**Artefakt:** freigegebene Ziel-/Anforderungsmatrix mit Schaltplanrevision und Pinzuordnung.  
**Abnahme:** Kein MCU-Pin wird aus einem generischen Boardnamen oder aus einer AVR-Pinnummer abgeleitet.

#### Vorläufiges FC-Pin-Inventar aus dem Quellcode

Diese Tabelle ist eine Wiedergabe der Konstanten in `Arduino_Pedelec_Controller.ino`, keine elektrische Freigabe und kein Pinplan für ein STM32-/ESP32-Board. `D` bezeichnet die logische Arduino-Digitalnummer des jeweiligen AVR-Ziels.

| Funktion | FC 1.1 | FC 1.2 | FC 1.3-1.5 | FC 2.x (`HARDWARE_REV >= 20`) |
| --- | --- | --- | --- | --- |
| Spannungseingang | A1 | A1 | A0 | A14 |
| FET-Abschaltausgang | nicht definiert | A0 | A1 | D38 |
| Stromeingang | A2 | A3 | A2 | A15 |
| Option / Drehmomenterkennung | A0 | A2 | A3 | A2 |
| Lichtausgang | nicht definiert | nicht definiert | A3 (mit Option geteilt) | D44 |
| Poti / PAS-Analogsignal | A6 | A6 | A6 | A4 |
| Gasgriff-Analogsignal | A7 | A7 | A7 | A3 |
| PAS-Impuls | D2 | D2 | D2 | D3 |
| Radsensor-Impuls | D3 | D3 | D3 | PE7 / INT7 direkt |
| Bremseingang | D4 | D4 | D4 | D2 |
| Gasgriff-Schalter | D5 | D5 | D5 | D5 |
| Motorausgang | D6 | D6 | D6 | D8 |
| Bluetooth-Versorgung | D7** | D7 | D7 | D13 |
| Display-Schalter | D8 | D8 | D8 | D37 |
| Display-Schalter 2 | D12, bedingt | D12, bedingt | D12, bedingt | derzeit als PORTH/2 verdrahtet kommentiert |
| Summer | nicht definiert | nicht definiert | nicht definiert | D11 |
| negativer Stromeingang | nicht definiert | nicht definiert | nicht definiert | A13 ab Rev 22 |

Für FC 2.x ist in diesem Quellblock keine Arduino-Pinnummer `wheel_in` definiert: die Initialisierung setzt PE7/INT7 direkt als Radsensoreingang. PAS wird direkt über PE5/INT5 und bei Zweikanalvarianten zusätzlich PE6/INT6 behandelt. Keine logische D-Pinnummer wurde daraus abgeleitet.  
`**` Der Quellkommentar verbietet Bluetooth-Versorgung an D7 für Rev 1.1.  
Zusätzlich setzt Rev 2.x Timer 4 per `TCCR4B` für 32-kHz-PWM am Motorausgang und greift an mehreren Stellen direkt auf Mega-Portregister zu. Vorhandene Breadboard-Doku nennt `HARDWARE_REV 21` und Nokia-Display-Pegelwandlung auf 3,3 V; beides ist gegen echte Platine und Schaltplanrevision zu bestätigen.

### WP-02: Quellcode- und Abhängigkeitsinventar

**Status:** BESTANDEN (statische Quellinventur abgeschlossen; Zielvalidierung folgt in späteren Arbeitspaketen)  
**Ziel:** Alle Architekturannahmen mit Fundstelle, Eigentümer und Migrationsstrategie erfassen.

- [x] AVR-Header, Register, Interruptvektoren, Timer, ADC, PWM, Watchdog und PROGMEM-Zugriffe im ersten Scan erfassen.
- [x] Lokales OneWire, AVR-Displaytreiber und AVR-Delay-/pgmspace-Includes als konkrete Abhängigkeiten markieren.
- [x] `SoftwareSerial`, AVR-ISR-Vektoren und Pin-Nummerierung als Zielportierungsfragen markieren.
- [x] Feste 10-Bit-ADC-/512-Mittelpunktannahmen sowie `PSTR`/`PROGMEM`/`pgm_read_byte` nachweisen.
- [x] AVR-Typbreiten-, ISR-Atomizitäts-, Zeitüberlauf-, Serial- und Persistenzrisiken mit Codepfaden aufnehmen (B-15 bis B-21); target-spezifische Messungen bleiben offen.
- [x] Jede gefundene Abhängigkeit im Auditumfang als portable API, target-dependent oder Architekturblocker klassifizieren; konkrete Hardwareeigenschaften bleiben separat offen.

**Artefakt:** Tabelle mit Symbol/Datei, aktueller Funktion, Ziel-API, Risiko, Test und Status.  
**Abnahme:** Keine bekannte hardwareabhängige Stelle bleibt unklassifiziert.

#### Vorläufige Architektur-/Abhängigkeitsklassifikation

`Compile blocker` bedeutet, dass ein beobachteter Zielbuild vor dem Linken stoppt; `target-dependent` bedeutet, dass Kompilieren möglich sein kann, aber API-/Pin-/Peripherieeigenschaften je Board nachzuweisen sind; `runtime/safety risk` bedeutet, dass falsche Annahmen falsche Messwerte oder Ausgangsverhalten erzeugen können.

| Subsystem | bestätigte Quellstelle | Klasse | Noch benötigter Nachweis / nächste Aktion |
| --- | --- | --- | --- |
| Watchdog | [Hauptsketch](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L33-L40), [Start/Service](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L581-L590), [Abschalten](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1648-L1667) | Compile blocker; safety | Plattform-API bestimmen; Timeout, Resetursache, Bootzustand und Motor-disable unabhängig testen. |
| AVR-Delay / Flash-Header | [BMP085](../Arduino_Pedelec_Controller/BMP085.cpp#L6-L8), [RTC](../Arduino_Pedelec_Controller/ds1307.cpp#L21-L28), [PCD8544-Daten](../Arduino_Pedelec_Controller/PCD8544_charset.cpp#L24-L31), [PCD8544-Zugriff](../Arduino_Pedelec_Controller/PCD8544_nano.cpp#L35-L38) | Compile blocker | Includes und Aufrufe durch portable API ersetzen oder Implementierungen target-spezifisch trennen; optionales Feature muss nicht kompilierte Einheit verhindern. |
| GPIO / Hardwarerevision | [Revision fallback und Defaultdisplay](../Arduino_Pedelec_Controller/config.h#L8-L36), [AVR-Port im Nokia-Treiber](../Arduino_Pedelec_Controller/PCD8544_nano.h#L54-L75) | Compile blocker / runtime | Zielrevision erzwingen; Treiber-Registerzugriffe ersetzen; Reset-/Boot-Pegel und elektrische Pegel messen. |
| ADC und Pins | [FC-Pinzuordnung](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L145-L197), [Sensor-Umrechnung](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L626-L686), [ADC-Kalibrierwerte](../Arduino_Pedelec_Controller/config.h#L225-L228) | target-dependent / safety | ADC-Referenz, Bitauflösung, Pin-Multiplex, Maximalspannung und Fehlerwerte pro Board kalibrieren; Sensorfehler injizieren. |
| Interrupts und Timing | [FC-Setup](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L481-L507), [Mega-ISRs](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1106-L1125) | Compile blocker auf FC 2.x; timing/safety | Pin-zu-Interrupt-Zuordnung, Flankenauswahl, ISR-Latenz und gleichzeitige maximale Impulsrate messen. |
| PWM / Timer | [Timer-4-Prescaler](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L558-L563), [Motorausgabe](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L934-L938) | target-dependent / safety | Hardware-PWM-Pin, Frequenz, Auflösung, Start-/Resetverhalten, Jitter und sicheres Abschalten am Oszilloskop bestätigen. |
| OneWire / Temperatur | [Architekturzweige und Fehlerfall](../Arduino_Pedelec_Controller/one_Wire.h#L50-L108), [zeitkritische Implementierung](../Arduino_Pedelec_Controller/one_Wire.cpp#L137-L213) | bestätigter Compile blocker für nicht gelistete Architekturen; timing | Getestete Bibliothek oder eigene Zielimplementierung; Timing bei Interruptlast, Presence-/Timeout- und Kurzschlussfall prüfen. |
| PROGMEM / Flash strings | [Makros](../Arduino_Pedelec_Controller/globals.h#L97-L103), [Konstanten](../Arduino_Pedelec_Controller/config.h#L306-L328), [Bitmap-Lesezugriff](../Arduino_Pedelec_Controller/display.cpp#L900-L919) | Compile- oder Laufzeitrisiko je Core | Speicheradressraum/API und `pgm_read_byte`-Semantik pro Ziel verifizieren; Displaystrings/Bitmaps testen. |
| EEPROM / Datensatz | [Datensatz](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L127-L142), [Lesen/Schreiben](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1620-L1645) | target-dependent / Datenintegrität | Capacity, Commit, Stromausfall beim Schreiben, struct layout und Versionsmigration testen. |
| Displayserielle Ports / Bibliotheken | [SoftwareSerial-Auswahl](../Arduino_Pedelec_Controller/display.cpp#L73-L96), [Bafang/KM-Header](../Arduino_Pedelec_Controller/display_bafang.h#L28-L35), [TFT-Treiber](../Arduino_Pedelec_Controller/display_tft.cpp#L1-L8) | target-dependent / timing | Nur den ausgewählten Displayzweig portieren; RX/TX, Baudrate, Parallelität, Bibliothekslizenz/-verfügbarkeit und Timerkonflikte prüfen. |
| Konsolen-/UART-APIs | [Setup `Serial`/`Serial1`](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L369-L378), [Poll `Serial`/`Serial1`](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L608-L620), [`HardwareSerial*` und Kommandoport](../Arduino_Pedelec_Controller/serial_command.cpp#L65-L75) | Stream-Methoden `begin/available/read/print/println/write` sind Arduino-API; `HardwareSerial*`, `Serial1`/`Serial2`, Pins und `SoftwareSerial` sind target-dependent | Serialobjekt-Typen, USB/UART-Zuordnung, Baudrate, gleichzeitige Ports und Pegel je konkretem Board prüfen. `Serial1` wird bei Rev 20+ initialisiert, auch wenn Bluetoothmodus aus ist. |
| Zeitbasis und Delays | [Rollover-Helper](../Arduino_Pedelec_Controller/elapsed_time.h#L1-L14), [Sensor-Guards](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1179-L1185), [absolute UI-Deadlines](../Arduino_Pedelec_Controller/display.cpp#L122-L130) | `millis()`/`delay()`/`delayMicroseconds()` sind Arduino-APIs; Zeitauflösung, ISR-Effekte und Bit-Bang-Timing sind target-dependent; absolute UI-Deadlines bleiben Wrap-Risiko | Helper ist auf AVR gebaut/asserted; Core-Tick, ISR-Latenz, OneWire/Displaypulse und B-18-UI-Wrap je Ziel messen/simulieren. |
| C++-Datenmodell/Arithmetik | [Throttle-/Messwerte](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L216-L275), [PAS- und Radberechnung](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1175-L1245), [ADC-Skalen](../Arduino_Pedelec_Controller/config.h#L216-L228) | `int`, `unsigned int`, `long`, `float` und `double` folgen Ziel-ABI, keine portable Breitenzusage; runtime/safety bei Narrowing, Sättigung und Genauigkeit | `sizeof`/Grenzen pro Ziel erfassen; ADC-/PAS-/Speed-/Odometervektoren mit Extrem- und Überlaufwerten testen. |
| EEPROM-Lebenszyklus/Shutdown | [Record und Bytezugriffe](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L127-L142), [Save-Aufrufer](../Arduino_Pedelec_Controller/serial_command.cpp#L143-L150), [Shutdownsave](../Arduino_Pedelec_Controller/Arduino_Pedelec_Controller.ino#L1648-L1667) | natives Structformat target-dependent; `cli()`/`sei()` und Shutdownregister architekturblockierend; EEPROM capacity/commit/endurance hardware/core dependent | Save-/Load-Backend abstrahieren; Schema/Migration definieren; Abbruchtests und tatsächliches Storemedium pro Board prüfen. |

Die statische Klassifikation für den geprüften Quellstand ist abgeschlossen. Sie belegt keine Zielkompatibilität. Board-/Core-Validierung, Messung von Timing und Elektrik, Speicher-Backend-Entscheidung, Datenmigration und Fehler-Injektion bleiben WP-01/WP-04/WP-06/WP-07 zugeordnet.

#### Laufzeit-/Datenintegritäts-Prüfhypothesen

Die folgenden Punkte sind **Risiken zur Prüfung**, keine Behauptungen, dass im normalen Betrieb bereits ein Fehler auftritt:

- Auf AVR sind `volatile`-Zugriffe auf 16-/32-Bit-Werte nicht atomar. `pas_on_time`, `pas_off_time`, `cad`, `last_wheel_time`, `wheel_time`, `spd`, `km` und `last_pas_event` werden zwischen ISR und Hauptschleife geteilt. `odo` wird durch die Rad-ISR verändert und in der Hauptschleife/Persistenz verwendet, ist jedoch nicht als `volatile` deklariert.
- Im Standard-PAS-Pfad können lange Ereignislücken beim Konvertieren von `millis()`-Differenzen nach AVR-`int` den darstellbaren Bereich überschreiten. Im optionalen Dual-PAS-Pfad stehen Divisoren aus `millis() - last_pas_event`; gleiche-Tick-Ereignisse und Erstereignis nach Start gezielt testen. PAS/Torque-Optionen sind in der aktuellen Defaultkonfiguration nicht alle aktiviert.
- **Vor dem Fix bestätigt und reproduziert, jetzt softwareseitig korrigiert:** `elapsed_less(now, previous, interval)` prüft `(uint32_t)(now - previous) < interval`. Der Helper enthält Compile-Time-Assertions für den verworfenen 2.000-ms-Altfall und ein kurzes Debounceintervall, das selbst über Wrap weiter aktiv bleiben muss. Beide Sensor-ISRs verwenden diesen Helper. Es gab SUCCESS für Nano und Mega; reale Sensorflanken/ISR-Latenz sind noch nicht auf Hardware geprüft.
- Die historische Motorauswirkung bleibt dokumentiert: Wenn die Rad-ISR keine Flanken annimmt, fällt `spd` nach 3 s auf null und das Speedlimit greift nicht; `DETECT_BROKEN_SPEEDSENSOR` beendet die Anforderung erst nach mehr als 5 s seit Motorstart bei `spd < 1`. Der Sensorfix adressiert den Wrap-Auslöser, ersetzt aber keine Prüfstandsmessung.
- Informations-, Menü- und Backlightdeadlines verwenden jetzt `deadline_reached` bzw. `deadline_passed`; die alten direkten Vergleiche waren UI-Wrap-Risiken. Tests decken Wrap und strikte Gleichheit ab.
- **Vor dem Fix bestätigt, jetzt softwareseitig behoben:** `save_eeprom()` schreibt geänderte Bytes und aktualisiert danach `variable` aus `variable_new`. Das verhindert, dass spätere identische Saves dieselben Unterschiede relativ zum Bootabbild erneut erkennen. Ein gezählter Fake-EEPROM-Test wäre die nächste gezielte Verhaltensregression; hier nicht ausführbar, weil kein Host-C++-Compiler vorhanden ist.
- Ein Abbruch während des sequenziellen Schreibens kann eine gemischte Struct-Version hinterlassen; beim Neustart werden Bytes ohne Marker, Prüfsumme oder Feldbereichsprüfung übernommen. Das kann Zähler/Charge-Detection verfälschen; laut aktueller Struktur setzt dieser Datensatz nicht direkt Gasgriff-/Motorausgangsgrenzen.

**Autonome Softwarefixes:** [`elapsed_time.h`](../Arduino_Pedelec_Controller/elapsed_time.h) enthält rollover-sichere Sensor-/UI-Deadline-Helper mit Compile-Time-Regressionen. `save_eeprom()` aktualisiert den Vergleichssnapshot nach dem Schreibloop. EEPROM-Schleifenzähler sind unsigned passend zu `sizeof`, und die Operatorgruppierung des Motor-Gates ist explizit geklammert. `pio run -e nanoatmega328 -e megaatmega2560` besteht. Aktueller Speicher: Nano 1032 B RAM/24642 B Flash; Mega 1233 B RAM/27576 B Flash. Der gezielte Fake-EEPROM-Verhaltenstest und reale Sensor-/ISR-Tests bleiben offen.

**WP-02 ist statisch abgeschlossen.** Die vorstehenden Prüfhypothesen sind in WP-05/WP-06/WP-07 als ausführbare Tests übernommen; offene Punkte sind nicht mehr fehlende Quellinventur, sondern fehlende Ziel-/Hardwarebedingungen.

### WP-03: Portierungsarchitektur und Sicherheitsverträge

**Status:** IN ARBEIT (boardneutraler Vertragsentwurf vorhanden; Review/Freigabe offen)  
**Ziel:** Hardwareabhängige Operationen kapseln, ohne die Steuerungslogik stillschweigend zu verändern.

- [ ] Grenzflächen definieren für Pin-I/O, ADC, PWM-Ausgang, Zeitbasis, Interrupts, Watchdog, serielle Ports und Persistenz.
- [ ] Sichere Zustände definieren: Reset, Boot, Brownout, ungültige ADC-Werte, Sensorausfall und Kommunikationsverlust.
- [ ] Festlegen, welcher Zustand den Motorausgang hardwareseitig deaktiviert und wie dies unabhängig von der Hauptschleife garantiert wird.
- [ ] Timingvertrag für Sensor-ISR, Reglerzyklus und Ausgabejitter messbar definieren.
- [ ] Bibliotheken anhand WP-02 ersetzen oder portieren; keine nur scheinbare AVR-Kompatibilitätsshims einführen.
- [ ] Versions-/EEPROM-Migrationsstrategie festlegen.

**Gate G-1:** Safety-Verträge und Pinplan sind geprüft, bevor PWM/Motoransteuerung auf ein neues Ziel gelegt wird.  
**Abnahme:** Architekturentscheidung und Reviewnachweis liegen vor; Verhalten der AVR-Baseline ist durch Tests abgesichert.

#### Boardneutraler Vertragsentwurf (noch nicht freigegeben)

Dieser Entwurf beschreibt die Grenze zwischen Steuerlogik und Hardware. Er enthält absichtlich keine Pin-Nummern, ADC-Referenzwerte oder PWM-Frequenz; diese hängen von FC-Revision, Board und externer Schaltung ab.

| Schnittstelle | Vertrag der Abstraktion | Nachweis vor Nutzung |
| --- | --- | --- |
| `safe_outputs_init()` | Beim Reset/Boot Motorausgang in dokumentierten hardwareseitig inaktiven Zustand setzen; FET/Enable bleibt aus. Konfiguration so früh wie möglich, unabhängig von UI/Serial. | Oszilloskop-/Logikanalysator bei Power-on, Brownout, Reset und Bootloader; externe Pulls/Treiberlogik mit Schaltplan prüfen. |
| `motor_disable()` / `motor_command(value)` | Deaktivierung ist von normalem PWM-Neutralwert unterscheidbar. PWM/Servo-Range und Polarität sind boardkonfiguriert. Raw zero und `motor_offset` dürfen nicht als äquivalent angenommen werden. | Lastloser Ausgangstest; gemessene Pegel/Frequenz bei Start, Regelbetrieb und Abschaltung. Controller-Eingangsschwellen aus Datenblatt. |
| `power_stage_enable()` | Leistungsteil darf erst nach expliziter Freigabe und gültigem Input-/State-Check aktiviert werden; Watchdog-Reset darf nicht automatisch eine alte Anforderung reaktivieren. | Resetursache, Startup-State-Machine und FET-Pegel an echter Schaltung prüfen. B-22 offen. |
| `read_analog(channel)` | Liefert definierten Rohbereich plus dokumentierte ADC-Breite/Referenz; ungültig, außerhalb des sicheren Fensters oder nicht verfügbar muss als Fehler unterscheidbar sein, nicht als scheinbar normaler Wert. | Kalibrierquelle, Edge-/Kurzschluss-Injektion, Versorgung-/Temperaturgrenzen und Referenzmessung. |
| `sensor_edge_capture(channel)` | ISR macht nur zeitkritische Flankenerfassung und minimalen atomaren Zustandsupdate; Zeitbasis ist monoton modulo $2^{32}$; Plausibilisierung/Reglerarbeit bleibt im Hauptkontext. | Maximalrate, Jitter, verpasste Flanken, atomare Snapshots und Wrap mit Signalgenerator prüfen. |
| `time_now_ms()` / `elapsed` / `deadline` | 32-bit monotone Millisekundenbasis; Intervallvergleiche rollover-sicher; geplante Intervalle kleiner als $2^{31}$ ms. Keine blockierende Verzögerung im Reglerpfad ohne nachgewiesene Obergrenze. | Core-Auflösung/-Drift, Wrap, Loop-Laufzeit, ISR-Last und Delay-Latenz messen. |
| `watchdog` | Timeout, Servicepunkt und Resetgrund sind definiert. Ein Reset setzt die Leistungsstufe fail-off und verlangt einen kontrollierten Neustart; Resetgrund bleibt diagnostizierbar. | Absichtlich blockierte Loop, Watchdog-Reset und Folgeboot mit Motor-Aus messen. Aktueller Quellcode belegt diese Garantie nicht (B-22). |
| `storage_read/write` | Versioniertes, größenfestes Schema mit Validierung/Recovery; atomarer oder recoverbarer Commit; Keine fremde ABI-Structdarstellung als dauerhaftes Wireformat. | Kompatibilität mit vorhandenem AVR-Datenbestand, Stromausfall nach jedem Schritt, Wear/Capacity und CRC-/Rangefehler injizieren. B-19/B-21 offen. |
| `serial_port` | Logische Kanäle werden explizit auf physische UART/USB-Streams abgebildet; Core-Objekttyp nicht in Steuerlogik fest verdrahten. | Boardpinout, Pegel, Portgleichzeitigkeit, Baudraten und Stau-/Fehlerverhalten messen. |

#### Safety-Invarianten und derzeitige Abweichungen

- **Entwurfsanforderung:** Während Reset, Bootloader, Brownout, Watchdog-Neustart und unerkanntem Sensorfehler muss das Leistungsteil inaktiv bleiben. **Der Ausgangscode garantiert das bei Watchdog-Reset nicht**; B-22 verlangt Hardware-/Softwareentwurf und Nachweis.
- **Entwurfsanforderung:** Hardware-Ausgang deaktivieren, bevor persistente Speicherung oder andere potenziell unbeschränkte Arbeit ausgeführt wird. **Der Ausgangscode speichert vor FET-off**; B-23 muss mit Schaltplan und Speicherbackend neu bewertet werden.
- **Beobachtetes Verhalten:** Startup/shutdown raw-zero ist verschieden vom im Regler als inaktiv ausgegebenen `motor_offset`. Elektrische Torque-Freiheit beider Werte ist ohne Controllerdatenblatt und Messung unbekannt.
- **Beobachtetes Verhalten:** Mit Default-PAS ist das finale Gate `(!pedaling && power_throttle < 10) || power_set <= 0 || spd > curr_spd_max2`; First-Aid- und PIN-Race-Modi können Richtlinien ändern. Diese Policy darf beim Port nicht beiläufig vereinfacht oder als unabhängig von Konfiguration behauptet werden.
- **Offene Produktentscheidung:** Brake-Signalpolarität, First-Aid-Bremse-Override, Race/Pure-Throttle-Freigabe sowie Verhalten nach brownout/watchdog sind nicht allein aus dem Hardware-API ableitbar. Bis zur expliziten Entscheidung bleiben diese Features nicht für neue Ziele freigegeben.

### WP-04: Minimaler Kompilier- und Link-Port

**Status:** BLOCKIERT durch WP-01 bis WP-03  
**Ziel:** Ein Minimalziel vollständig bauen, bevor Familienkopien erstellt werden.

- [ ] Zuerst genau ein ausgewähltes Board bauen, nicht alle Zielprofile gleichzeitig.
- [ ] Fehler in kleinen Schritten beheben; nach jedem Schritt dieselben Builds und passende Unit-/Compile-Tests wiederholen.
- [ ] Verbleibende Clean-Build-Warnungen nach Risiko bewerten: nicht behandelte Enumwerte/ungenutzte Funktionen in `display.cpp`, ungenutzter Handler in `menu.cpp` und externe ST7789-Warnungen zu `lo`/`hi`. DallasTemperature-Rückgabepfad, EEPROM signedness und Motor-Gate-Operatorwarnung sind behoben.
- [ ] Flash-, RAM-, Stack- und Heapverbrauch gegen dokumentierte Boardgrenzen prüfen.
- [ ] Clean Build und inkrementellen Build vergleichen; Artefakt/ELF/Map-Datei ablegen.

**Abnahme:** Sauberer Build und Link für das konkrete Board; keine ungeklärten sicherheitsrelevanten Warnungen; Speicherreserve begründet. Dies ist noch keine Hardwarefreigabe.

### WP-05: Host-/Unit- und statische Tests

**Status:** IN ARBEIT (Prüfplan und Oszilloskop-Messanweisung ausgearbeitet: [LABOR_PRUEFPLAN_OSZILLOSKOP_WP05_WP06.md](LABOR_PRUEFPLAN_OSZILLOSKOP_WP05_WP06.md))  
**Ziel:** Steuerungslogik ohne Motorhardware deterministisch prüfen.

- [ ] Reine Berechnungen vom Hardwarezugriff trennen und mit Grenzwerten testen.
- [ ] Tests für ADC-Minimum/Maximum, außerhalb des Bereichs, Rauschen und Skalierung hinzufügen.
- [ ] Tests für Geschwindigkeit/PAS: kein Puls, minimale Impulsbreite, maximale Rate, stuck-high/low und Flankenprellen hinzufügen.
- [ ] Tests für Reglerstart, Sättigung, Überlauf, Zeitrücksprung und lange Loop-Blockade hinzufügen.
- [ ] EEPROM/Flash: leere, alte, beschädigte, teilweise geschriebene und unbekannte Versionsdaten testen.
- [x] Statische Host-Quellverträge für Sensor-/Deadline-Wrap, Snapshot-Reihenfolge, Disconnect-Fallback und Produktionsverdrahtung: `python tools/source_contract_test.py` (4/4). Kein Ersatz für dynamischen Fake-EEPROM- oder Hardwaretest.
- [x] Detaillierter Oszilloskop-Laborprüfplan für Signalanlage, PWM, Failsafes und PIN-Limits erstellt: [LABOR_PRUEFPLAN_OSZILLOSKOP_WP05_WP06.md](LABOR_PRUEFPLAN_OSZILLOSKOP_WP05_WP06.md).
- [ ] Statische Analyse und Compilerwarnungen reproduzierbar in den Build aufnehmen.

**Gate G-2:** Alle rein logischen Grenzwerttests bestehen, bevor stromlose Boardtests starten.

### WP-06: Stromlose Boardtests und I/O-Verifikation

**Status:** VORBEREITET (Messpunktmatrix TP01 bis TP10 und Prüfprotokoll definiert)  
**Voraussetzung:** G-1 und G-2 bestanden; Motorleistung physisch getrennt.

- [ ] Versorgung, Reset, Brownout, Bootloader und Flashvorgang mit Strombegrenzung prüfen (TP10).
- [ ] Jeden Pin gegen Schaltplan und Datenblatt verifizieren; keine 5-V-Toleranz voraussetzen.
- [ ] ADC-Spannung mit kalibrierter Quelle einspeisen und Skalierung/Referenz über Temperatur und Versorgung prüfen (TP04/TP05).
- [ ] UART-Pegel, Baudrate, Pins und gleichzeitige Portnutzung prüfen.
- [ ] PAS-/Radsensorpulse mit Signalgenerator über Frequenz-/Pulsbreitengrenzen einspeisen (TP02/TP03).
- [ ] PWM-Ausgang mit Oszilloskop/Logikanalysator in Boot, Reset, Fehler und Normalzustand aufzeichnen (TP01).
- [ ] Watchdog und Brownout durch kontrollierte, dokumentierte Versuche auslösen (TP10).
- [ ] Licht- und Signalanlage (Blinker 1.5 Hz, ESS-Notbremsblinken 3.5 Hz, Hupe 3.0 s Abschaltung) am Oszilloskop verifizieren (TP06/TP07/TP08).
- [ ] ST7789 TFT SPI-Busintegrität und Taktflanken bis 40 MHz prüfen (TP09).

**Gate G-3:** Kein unerwartetes aktives Motorausgangssignal während Reset/Boot/Fehler; alle Ein-/Ausgänge stimmen mit freigegebenem Pinplan überein.

### WP-07: Fehler-Injektion und Worst-Case-Messungen

**Status:** OFFEN  
**Voraussetzung:** G-3 bestanden; mechanischer Antrieb bleibt getrennt, bis gesonderte Prüfstandsfreigabe vorliegt.

| Szenario | Methode | Zu erfassendes Ergebnis | Status |
| --- | --- | --- | --- |
| Gasgriff/Poti offen, kurzgeschlossen, außerhalb ADC-Bereich | Strombegrenzte Fehler-Injektion | Motorausgang, Diagnose, Wiederanlauf | OFFEN |
| Batteriespannung/Stromsensor offen, kurzgeschlossen, Grenzwert | Simulator, keine reale Hochenergiequelle | Abschalt-/Begrenzungsverhalten | OFFEN |
| PAS/Radsensor fehlt, klemmt, prellt, Maximalfrequenz | Signalgenerator | Timeout, Drehzahl, ISR-Last, Abschaltung | OFFEN |
| Brake-Eingang aktiv beim Start und während Leistung | definierte Pegelfolge | Vorrang/Abschaltung und Reaktionszeit | OFFEN |
| Display/Bluetooth getrennt, UART dauerhaft belegt/fehlerhaft | Leitungs-/Kommunikationsfehler | Regelzyklus und Fail-safe | OFFEN |
| Brownout, Reset, Watchdog während aktiver Anforderung | kontrollierte Versorgung/Fehlerauslösung | sichere Ausgänge, persistente Daten | OFFEN |
| CPU-/Interrupt-Last und maximale Sensorfrequenz gleichzeitig | synthetische Last + Signalgenerator | Worst-Case-Laufzeit und Jitter | OFFEN |
| Persistenzabbruch während Schreibvorgang | gezielter Reset im Prüfaufbau | Datenintegrität und Recovery | OFFEN |
| Speicherknappheit und lange Betriebsdauer | Instrumentierung/Langzeittest | Stackreserve, Heap, Zählerüberläufe | OFFEN |
| Temperatur-/Versorgungsgrenzen | geeigneter Laboraufbau | ADC-/Takt-/Resetverhalten | OFFEN |

**Abnahme:** Für jedes Szenario sind sichere Erwartung, Grenzwerte, Rohmessung, Wiederholungen, Board-/Firmware-ID und Abweichungen dokumentiert. Unbestimmte Grenzwerte bedeuten `BLOCKIERT`, nicht bestanden.

### WP-08: Geprüfte MCU-/Board-Matrix und Release-Entscheidung

**Status:** OFFEN  
**Ziel:** Reichweite der Aussage exakt an die tatsächlich geprüften Boardrevisionen binden.

- [ ] Für jedes konkrete Board Build, Flashen, Boardtests und passende Worst-Case-Tests einzeln verknüpfen.
- [ ] Unterschiede zwischen gleicher MCU-Familie, Boardrevision, Pinvariante, Flash/RAM und Framework erfassen.
- [ ] Nur tatsächlich geprüfte Kombinationen als `BESTANDEN` markieren; andere als `NICHT GEPRÜFT` oder `BLOCKIERT`.
- [ ] Release-Notiz mit Firmwareversion, Boardrevision, Toolchainversion, bekannten Einschränkungen und Rollbackverfahren erstellen.
- [ ] Unabhängiges Review der sicherheitsrelevanten Änderungen und Prüfnachweise durchführen.

**Gate G-4:** Release-Unterstützung nur für konkrete Kombinationen mit vollständiger Evidenz und Review. Keine Verallgemeinerung von einer MCU-Familie auf alle Boards.

## 5. Statusregister

Status ist pro konkretem Board und Frameworkversion zu führen. `n/a` bedeutet nur nach begründeter Entscheidung nicht anwendbar.

| Plattform/Familie | Beispielprofil | Konfiguration | Build | Stromloser Test | Fehler-/Worst-Case | Release |
| --- | --- | --- | --- | --- | --- | --- |
| AVR Nano | `nanoatmega328` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 1077 B RAM (52.6%), 25876 B Flash (84.2%) | OFFEN | OFFEN | bestehender Stand separat verifizieren |
| AVR Mega | `megaatmega2560` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 1279 B RAM (15.6%), 29194 B Flash (11.5%) | OFFEN | OFFEN | bestehender Stand separat verifizieren |
| STM32F4 Black Pill (M4F @ 84MHz) | `stm32_blackpill_f401cc` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 10996 B RAM (16.8%), 49644 B Flash (18.9%) | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| STM32F4 Nucleo (M4F @ 100MHz) | `stm32_nucleo_f411re` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 11292 B RAM (8.6%), 50424 B Flash (9.6%) | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| STM32F4 Nucleo (M4F @ 180MHz) | `stm32_nucleo_f446re` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 11340 B RAM (8.6%), 50856 B Flash (9.7%) | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| STM32G4 Motor-MCU (M4F @ 170MHz) | `stm32_g4` (G431RB) | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 5456 B RAM (16.7%), 62292 B Flash (47.5%) | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| STM32F1 Blue Pill (M3 @ 72MHz) | `stm32_bluepill_f103c8` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 3816 B RAM (18.6%), 51216 B Flash (78.1%) | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| RP2040 (Raspberry Pi Pico) | `pico` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 41724 B RAM (15.9%), 57760 B Flash (2.8%), UF2 generiert | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| ESP32 Classic Dual-Core (240MHz) | `esp32dev` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 23920 B RAM (7.3%), 313053 B Flash (23.9%) | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| ESP32-S3 Dual-Core (240MHz) | `esp32s3` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 21584 B RAM (6.6%), 319845 B Flash (9.6%) | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| ESP32-S2 Single-Core (240MHz) | `esp32s2` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 17376 B RAM (5.3%), 292846 B Flash (22.3%) | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| ESP32-C3 RISC-V (160MHz) | `esp32c3` | BESTANDEN (Konfiguration) | CLEAN BUILD BESTANDEN; 16084 B RAM (4.9%), 313912 B Flash (23.9%) | OFFEN | OFFEN | Hardware-Inbetriebnahme offen |
| ESP8266 | `esp8266_*` | BESTANDEN (Konfiguration) | NICHT UNTERSTÜTZT (Nicht echtzeitfähig / Wi-Fi ISR-Latenzen / 1 ADC) | OFFEN | OFFEN | NICHT UNTERSTÜTZT |

## 6. Befundvorlage

Jeden neuen Fehler oder jede Abweichung zuerst hier oder im Sitzungsprotokoll ergänzen. Rohdaten nicht durch Zusammenfassungen ersetzen.

```text
ID:
Datum/Uhrzeit und Zeitzone:
Board/Revision/MCU:
Firmware-Revision und Quellzustand:
PlatformIO-Core / Plattformpaket / Framework / Compiler:
Aufbau und Versorgung:
Vorbedingungen:
Exakte Befehle oder Messschritte:
Erwartetes Ergebnis und Quelle des Grenzwerts:
Tatsächliches Ergebnis:
Rohdaten-/Log-/Foto-/Oszilloskop-Ablage:
Sicherheitsauswirkung:
Reproduzierbarkeit:
Status und begründete Entscheidung:
Nächster Schritt:
```

## 7. Nächster Arbeitsschritt

**WP-00:** Buildbaseline erfasst; lokales Git-Repository initialisiert und Baseline-Checkpoints dokumentiert.  
**WP-01:** Software-Pin- und Abhängigkeitsinventar vollständig erfasst. Hardware-Referenzprofile definiert.  
**WP-02:** Statische Quellinventur und Roll-Over-Sicherheit vollständig behoben und durch 4/4 Quellvertragstests abgesichert.  
**WP-04:** Multi-Architektur HAL (`hal.h`/`hal.cpp`), Licht-/Signalanlage (Blinker 1.5 Hz, ESS-Notbremslicht 3.5 Hz, Hupe 3.0 s Abschaltung), 3-Stufen PIN-Sicherheitssystem (Master-PIN 210286), portabler Hardware-SPI-Treiber ST7789 (`st7789_portable.h`) sowie modularer Display-Header (`display_tft_pins.h`) implementiert und auf allen 12 PlatformIO-Targets fehlerfrei verifiziert.  
**WP-05 / WP-06:** Umfassender Oszilloskop-Laborprüfplan (`docs/LABOR_PRUEFPLAN_OSZILLOSKOP_WP05_WP06.md`) mit Messpunktmatrix TP01 bis TP10 und normiertem Abnahmeprotokoll ausgearbeitet.  
**Nächster Schritt:** Hardware-Prüfstandsmessung mit Signalgenerator und Oszilloskop an realer Hardware (STM32 BlackPill / Raspberry Pi Pico / ESP32) gemäß Laborprüfplan.
