# SAGA LABS // METISA SUITE

**Universal Drive Control & Power Electronics Calibration Platform**  
*Entwickelt und herausgegeben von SaGa Labs | Benjamin Everts, Bielefeld*

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Live%20Suite-success?style=flat-square&logo=github)](https://saga-ecm.github.io/Metisa-Suite/)
[![PlatformIO Build Status](https://img.shields.io/badge/PlatformIO-12%2F12%20Targets%20Pass-10b981?style=flat-square)](platformio.ini)
[![Design Standard](https://img.shields.io/badge/Design%20Standard-SaGa%20Labs%20Orbit-ff6200?style=flat-square)](docs/SAGA_LABS_METISA_ORBIT_AGENT_DIRECTIVE.md)
[![License](https://img.shields.io/badge/Intellectual%20Property-All%20Rights%20Reserved-red?style=flat-square)](TRADEMARKS_AND_IP.md)

---

## 1. Live Web-Services (Sofort im Browser nutzbar)

Die gesamte Metisa Suite steht als responsives, installationsfreies System live im Web bereit:

* **Haupt-Portal (Launcher Hub):**  
  [https://saga-ecm.github.io/Metisa-Suite/](https://saga-ecm.github.io/Metisa-Suite/)
* **Web Configurator Client (Ecumaster Orbit Standard):**  
  [https://saga-ecm.github.io/Metisa-Suite/configurator/](https://saga-ecm.github.io/Metisa-Suite/configurator/)  
  *Vollständige Kalibrierung, .apc-Parität, C++ `config.h` Export, Web Serial Live-Messung und Oszilloskop-Dynokurve.*
* **Track & Dyno Autorisierungs-Portal:**  
  [https://saga-ecm.github.io/Metisa-Suite/configurator/unlock_portal.html](https://saga-ecm.github.io/Metisa-Suite/configurator/unlock_portal.html)  
  *Kryptografische PIN-Zertifizierung und rechtsverbindlicher Garantieverzicht für den Rennstrecken- und Prüfstandseinsatz.*
* **Technisches Feldhandbuch (DIN/ISO):**  
  [https://saga-ecm.github.io/Metisa-Suite/configurator/wiki.html](https://saga-ecm.github.io/Metisa-Suite/configurator/wiki.html)  
  *Pinbelegung, Leitungsstrang-Konfektionierung, Signalpegel und 25-Punkte-Felddiagnose.*

---

## 2. Geistiges Eigentum & Gesetzlicher Markenschutz

### Copyright © 2026 Benjamin Everts, Bielefeld / SaGa Labs. Alle Rechte vorbehalten.

* **Markenschutz (Trademarks):**  
  **SaGa Labs**®, **metisa**™, **Metisa Suite**™ und **SaGa Labs Orbit**™ sowie alle zugehörigen Logos, Vektorsignaturen und UI-Ausstattungsmerkmale (Trade Dress) sind das ausschließliche geistige Eigentum von **Benjamin Everts / SaGa Labs**. Eine unautorisierte Nutzung, Nachahmung oder markenmäßige Verwendung ist untersagt.
* **Proprietäres geistiges Eigentum:**  
  Die gesamte *Metisa Web Configurator Suite*, das Autorisierungsportal, die Multi-Architecture HAL-Strukturen, das 3-Stufen PIN-Sicherheitssystem, die ECE-R 50 Beleuchtungs- und Signalarchitektur sowie alle Prüfstände und Dokumentationen sind urheberrechtlich geschütztes geistiges Eigentum von Benjamin Everts / SaGa Labs.
* **Drittkomponenten & Historische Basis:**  
  Die Urheberrechte an historischen Upstream-Fragmenten des ursprünglichen Arduino Pedelec Controllers verbleiben bei den jeweiligen Autoren (Jenkie et al., GPL-3.0-or-later). Upstream-Hinweise werden in den Quelldateien vollständig gewahrt.
* **Vollständige Rechtsdokumentation:**  
  Siehe [`TRADEMARKS_AND_IP.md`](TRADEMARKS_AND_IP.md), [`LICENSE`](LICENSE) und [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

---

## 3. Technische Systemarchitektur

### Multi-Architecture Hardware Abstraction Layer (HAL)
Metisa verfügt über eine hardwarenahe HAL (`hal.h`/`hal.cpp`), die portabel auf modernen 32-Bit Mikrocontrollern sowie klassischen AVRs aufbaut:

| Architektur / Familie | Getestete Referenz-Hardware | Status |
| :--- | :--- | :---: |
| **STM32F4 (ARM Cortex-M4F @ 84-180 MHz)** | Black Pill (F401CC), Nucleo (F411RE, F446RE) | **Clean Build** |
| **STM32G4 Motor-MCU (Cortex-M4F @ 170 MHz)** | Nucleo G431RB | **Clean Build** |
| **STM32F1 (ARM Cortex-M3 @ 72 MHz)** | Blue Pill (F103C8) | **Clean Build** |
| **RP2040 Dual-Core (Cortex-M0+ @ 133 MHz)** | Raspberry Pi Pico | **Clean Build** |
| **ESP32 SoC Family (Dual-Core / RISC-V)** | ESP32 DevKit, ESP32-S3, ESP32-S2, ESP32-C3 | **Clean Build (BT + WiFi SoftAP)** |
| **Klassische AVRs (8-Bit ATmega)** | Arduino Nano 3.0 (328P), Arduino Mega 2560 | **Clean Build** |

### Integrierte Subsysteme & Failsafes
* **Licht- & Signalanlage (ECE-R 50):** 1.5 Hz Fahrtrichtungsanzeiger mit 20 s Auto-Cancel, 3.5 Hz ESS Notbrems-Stroboskop, 3.0 s thermische Abschaltung der Signalhupe.
* **Sicherheitsebenen:** 
  * Level 0: Standard StVZO / EN 15194 Derating (25 km/h, 250 W, PAS-Pflicht).
  * Level 1: Sport Calibration (32 km/h, 500 W).
  * Level 2: Track & Dyno Calibration (Bis 99 km/h, 3000 W, Direktgas via Master-PIN).
* **Sensorik & HMI:** Shunt-Stromerfassung, PAS-Flankenerfassung mit Überlaufschutz, Brems-Interlock &lt; 2 ms, Hardware-SPI ST7789 Color TFT und autarker HTML5 Web-Server über ESP32 SoftAP (`192.168.4.1`).

---

## 4. Lokaler Build & Qualitätssicherung

```powershell
# 1. Quell- und Kontextvalidierung
python tools/validate_project_context.py

# 2. Firmware-Builds über PlatformIO
pio run -e nanoatmega328
pio run -e stm32_blackpill_f401cc
pio run -e pico
pio run -e esp32dev

# 3. Automatisierte Testsuiten
python tools/test_configurator_contract.py
python tools/source_contract_test.py
python tools/testbench_harness.py
```

---

## 5. Kontakt & Lizenzierungsanfragen

**SaGa Labs**  
Inhaber: Benjamin Everts, Bielefeld  
E-Mail: sagaporsche45@gmail.com | kontakt@sagalabs.de  
Web: [https://sagalabs.de](https://sagalabs.de) | GitHub: [https://github.com/SaGa-ecm/Metisa-Suite](https://github.com/SaGa-ecm/Metisa-Suite)
