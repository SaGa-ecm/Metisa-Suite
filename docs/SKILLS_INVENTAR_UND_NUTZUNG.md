# SAGA LABS METISA // SKILLS-INVENTAR & NUTZUNGSDOKUMENTATION

> **Dokumenten-Status:** Offizielles Verzeichnis aller im Antigravity-Ökosystem und Metisa-Repository verfügbaren Agenten-Skills sowie Nachweis ihrer bisherigen Nutzung.  
> **Stand:** 11. Oktober 2026 | SaGa Labs Metisa Orbit Architektur

---

## 1. Skill-Architektur im Überblick

Im SaGa Labs Metisa Projekt wird strikt zwischen zwei Skill-Kategorien unterschieden:

```
+-----------------------------------------------------------------------------------+
|                           ANTIGRAVITY AGENTEN-UMGEBUNG                            |
+-----------------------------------------------------------------------------------+
             |                                                  |
             v                                                  v
+-----------------------------------------+   +-------------------------------------+
|        LOKALE PROJEKT-SKILLS            |   |     GLOBALE SYSTEM- / PLUGIN-SKILLS |
|     (Repository: skills/*/SKILL.md)     |   |       (IDE- & Plugin-Laufzeit)      |
+-----------------------------------------+   +-------------------------------------+
| Portabel, normativ, versionskontrolliert|   | Entwicklungswerkzeuge, Mobile SDKs, |
| Direkt an das Firmware- und Kalibrier-  |   | Browser-DevTools, Cloud-Konnektoren |
| projekt gebunden (10 normative Skills)  |   |                                     |
+-----------------------------------------+   +-------------------------------------+
```

---

## 2. Lokale Projekt-Skills (Repository-Standard)

Alle lokalen Projekt-Skills sind in `skills/<skill-name>/SKILL.md` hinterlegt und im normativen Index [`skills/INDEX.md`](../skills/INDEX.md) registriert.

| Skill-Name | Verzeichnis | Primärer Zweck | Bisheriger Nutzungsstatus |
| :--- | :--- | :--- | :---: |
| **`saga-labs-engineering-orbit`** | [`skills/saga-labs-engineering-orbit`](../skills/saga-labs-engineering-orbit/SKILL.md) | Durchsetzung des Ecumaster Motorsport-Standards, 100% Emoji-Freiheit, 1.5px Haarlinien-SVGs, physische Einheiten in eckigen Klammern `[V, A, W]`, sachliche Datenpräsentation ohne Marketingphrasen. | **AKTIV GENUTZT** (WP-08) |
| **`avr-build-validation`** | [`skills/avr-build-validation`](../skills/avr-build-validation/SKILL.md) | Reproduzierbare PlatformIO-Builds für ATmega328P (Nano) und ATmega2560 (Mega) sowie Erfassung von Flash/RAM-Footprints und Compiler-Warnungen. | **AKTIV GENUTZT** (WP-00, WP-04) |
| **`source-contract-tests`** | [`skills/source-contract-tests`](../skills/source-contract-tests/SKILL.md) | Ausführung und Erweiterung automatisierter Python-Prüfverträge (`tools/source_contract_test.py`, `tools/test_configurator_contract.py`). | **AKTIV GENUTZT** (WP-02, WP-04, WP-07, WP-08) |
| **`firmware-safety-review`** | [`skills/firmware-safety-review`](../skills/firmware-safety-review/SKILL.md) | Audit von Motorsteuerungs-Failsafes, Brems-Latenzen (&lt; 2 ms), Notabschalt-Schwellen und millis()-Überlaufssicherheit. | **AKTIV GENUTZT** (WP-02, WP-04, WP-06) |
| **`mcu-portability-audit`** | [`skills/mcu-portability-audit`](../skills/mcu-portability-audit/SKILL.md) | Analyse von AVR-Kopplungen (Registerzugriffe, Timer, EEPROM) und Entwurf der Multi-Target HAL für STM32, RP2040 und ESP32. | **AKTIV GENUTZT** (WP-01, WP-04) |
| **`license-provenance-audit`** | [`skills/license-provenance-audit`](../skills/license-provenance-audit/SKILL.md) | Forensische Überprüfung aller Quellcodes, Lizenzen (GPL/LGPL) und Autoren-Urheberrechte (Jenkie, Thomas Jarosch). | **AKTIV GENUTZT** (WP-01) |
| **`workbook-maintenance`** | [`skills/workbook-maintenance`](../skills/workbook-maintenance/SKILL.md) | Kontinuierliche Fortschreibung des technischen Arbeitsbuchs (`docs/mcu-port-project-workbook.md`) mit Messnachweisen und Meilensteinen. | **AKTIV GENUTZT** (WP-00 bis WP-08) |
| **`project-context-maintenance`** | [`skills/project-context-maintenance`](../skills/project-context-maintenance/SKILL.md) | Validierung der Konsistenz zwischen `project-rules/`, `skills/` und allen AI-Adaptern (`tools/validate_project_context.py`). | **AKTIV GENUTZT** (WP-04, WP-08) |
| **`modular-development`** | [`skills/modular-development`](../skills/modular-development/SKILL.md) | Einteilung aller Arbeitsfortschritte in atomare, prüfbare Einheiten mit klaren Rollback-Grenzen und Git-Checkpoints. | **AKTIV GENUTZT** (WP-00 bis WP-08) |
| **`cross-client-integration`** | [`skills/cross-client-integration`](../skills/cross-client-integration/SKILL.md) | Synchronisation von Schnittstellen zwischen C++ Firmware (`config.h`), .apc Serialisierung, HTML5 Web-Configurator und Android HMI. | **AKTIV GENUTZT** (WP-04, WP-07) |

---

## 3. Nutzungsmatrix der Projekt-Skills nach Arbeitsphasen

| Meilenstein / Arbeitspaket | Beschreibung | Eingesetzte Projekt-Skills | Ergebnis |
| :--- | :--- | :--- | :--- |
| **WP-01: Forensische Quellanalyse** | Untersuchung aller Zeitstempel, Lizenzstrukturen und fehlender ST7789 TFT-Dateien. | `license-provenance-audit`, `mcu-portability-audit`, `modular-development` | Forensischer Bericht, Aufdeckung von 6 isolierten TFT-Fragmenten. |
| **WP-02: Safety & Millis-Rollover** | Behebung von Überlauffehlern in Sensor-Debounce, Display-Deadlines und EEPROM-Schreibschleifen. | `firmware-safety-review`, `source-contract-tests`, `workbook-maintenance` | 8/8 Tests in `source_contract_test.py` bestanden. |
| **WP-03 / WP-04: Multi-Target HAL & Signalanlage** | Portabler HAL (`hal.h`/`hal.cpp`), ECE-R 50 Blinker (1.5 Hz), ESS-Notbremslicht (3.5 Hz), Hupe (3.0 s Timeout), 3-Stufen PIN-System (Master-PIN 210286) und ST7789 Hardware-SPI. | `mcu-portability-audit`, `avr-build-validation`, `firmware-safety-review`, `modular-development` | Erfolgreicher Clean-Build auf allen 12 PlatformIO-Targets (Nano, Mega, STM32 F4/G4/F1, RP2040, ESP32 Dev/S3/S2/C3). |
| **WP-05 / WP-06: Laborprüfplan** | Ausarbeitung der Prüfvorschrift für Hardware-Oszilloskope mit 10 Messpunkten (TP01-TP10). | `firmware-safety-review`, `workbook-maintenance` | Vollständiger Prüfplan in `docs/LABOR_PRUEFPLAN_OSZILLOSKOP_WP05_WP06.md`. |
| **WP-07: Web-Configurator & Portale** | Autarker HTML5/Web-Serial Kalibrierungs-Client mit vollständiger .apc Parität, separatem Autorisierungsportal und DIN/ISO Handbuch. | `cross-client-integration`, `source-contract-tests`, `workbook-maintenance` | 5/5 Tests in `test_configurator_contract.py` bestanden. |
| **WP-08: Ecumaster Orbit Overhaul** | Vollständige visuelle Überarbeitung: Beseitigung aller Emojis, Haarlinien-SVGs, tiefdunkles Titanium-Design, Dyno-Prüfstandskurve, Multi-Agent-Direktive. | `saga-labs-engineering-orbit`, `project-context-maintenance`, `modular-development` | Bereitstellung von `project-rules/saga-labs-orbit.md` und `docs/SAGA_LABS_METISA_ORBIT_AGENT_DIRECTIVE.md`. |

---

## 4. Globale Antigravity- und System-Skills

Neben den repository-gebundenen Projekt-Skills stehen in der Agenten-Laufzeitumgebung spezialisierte globale System- und Plugin-Skills zur Verfügung:

### A. Entwicklungswerkzeuge & Anpassung (Relevant für das Gesamtsystem)
* **`agy-customizations`**: Architektur und Konfiguration von Antigravity-Skills, Regeln und MCP-Servern.
* **`antigravity-guide`**: Umfassendes Referenzhandbuch für die Antigravity-Umgebung, Slash-Commands und Workflows.
* **`automation`**: Erstellung wiederkehrender Hintergrund-Prozesse und geplanter Aufgaben.
* **`generative_ui`**: Rendern interaktiver HTML/CSS/JS-Widgets und Standalone-Artefakte im Browser. *(Nutzung bei UI-Prototypen des Konfigurators).*
* **`google-antigravity-sdk`**: Design und Orchestrierung autonomer Multi-Agenten-Systeme.
* **`plugin`**: Verwaltung und Paketierung modularer Tool-Bundles.
* **`accidental-data-loss-prevention`**: Sicherheits-Prävention gegen irreversiblen Datenverlust vor destruktiven Operationen.

### B. Web-Inspektion & Browser-Debugging
* **`chrome-devtools`**: Browser-Automatisierung, DOM-Inspektion und Netzwerkanalysen via DevTools MCP.
* **`a11y-debugging`**: Barrierefreiheits-Auditing für semantisches HTML, Kontraste und Tastatur-Navigation.
* **`debug-optimize-lcp`**: Performance-Optimierung von Web-Applikationen und Ladezeiten.
* **`memory-leak-debugging`**: Erkennung und Behebung von Speicherlecks in JavaScript/Client-Anwendungen.
* **`troubleshooting`**: Diagnose von Verbindungs- und Laufzeitfehlern im Browser.

### C. Mobile & Cross-Platform (Relevant für spätere metisa Smartphone-Apps)
* **`flutter-*` (z. B. `flutter-apply-architecture-best-practices`, `flutter-build-responsive-layout`, `flutter-add-widget-test`)**: Entwicklung plattformübergreifender Android/iOS Cockpit-Apps.
* **`dart-*` (z. B. `dart-run-static-analysis`, `dart-setup-ffi-assets`, `dart-use-ffigen`)**: Low-Level C/C++ FFI-Anbindung und Native Assets für hardwarenahe Kommunikationsschichten.
* **`android-cli`**: Android-Builds, SDK-Verwaltung und Geräte-Emulatoren.
* **`xcode-project-setup`**: Konfiguration von iOS/macOS Xcode-Projekten.

### D. Cloud & Workspace-Dienste
* **`firebase-*`**: Firebase Authentifizierung, Firestore, Hosting und App Hosting.
* **`gdocs` / `gsheets` / `gdrive` / `gcalendar`**: Automatisierte Verwaltung von Google Workspace Dokumenten und Tabellen.
* **`bigquery-*` / `gcp-*` / `dataform-*` / `dbt-*`**: Datenpipelines, Cloud Composer und Enterprise-Datenverarbeitung.

### E. Wissenschaftliche & Domänenspezifische Datenbanken (Inaktiv für Firmware)
* Bioinformatik-, Protein- und Strukturdatenbanken (`alphafold-*`, `chembl-*`, `clinvar-*`, `ensembl-*`, `pdb-*`, `pubchem-*`, `uniprot-*`, etc.): Diese Skills stehen in der globalen Umgebung bereit, sind jedoch für Embedded-Firmware und E-Bike-Steuerungstechnik nicht relevant.

---

## 5. Zusammenfassung & Richtlinie für neue Aufgaben

1. **Jede Änderung an Metisa-Quellcodes** muss durch die entsprechenden **Projekt-Skills** (`skills/`) geleitet werden.
2. Vor jedem Commit ist der Skill **`saga-labs-engineering-orbit`** zur Einhaltung des Ecumaster Motorsport Standards (Zero-Emoji, 1.5px Haarlinien-SVGs, hochdichtes Design, physische Einheiten) bindend.
3. Die Integrität des Skill-Katalogs wird automatisiert über `python tools/validate_project_context.py` überwacht.
