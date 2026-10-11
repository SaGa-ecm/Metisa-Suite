# SAGA LABS METISA // TECHNISCHES INTEGRATIONS- UND BETRIEBSHANDBUCH (WIKI & FAQ)

> **Zweck und Zielgruppe:**  
> Dieses Handbuch vermittelt die physikalischen, elektrischen und systemtechnischen Grundlagen des SaGa Labs metisa Universal-Controllers in verständlicher und präziser Form. Es dient als praxisnaher Leitfaden für Werkstatt, Inbetriebnahme, Leitungsstrang-Konfektionierung und Fehlersuche.

---

## Inhaltsverzeichnis
1. [Teil 1: Systemarchitektur im Überblick](#teil-1-systemarchitektur-im-überblick)
2. [Teil 2: Leitungsstrang & Schnittstellen-Pinout](#teil-2-leitungsstrang--schnittstellen-pinout)
3. [Teil 3: Der Web-Konfigurator Client](#teil-3-der-web-konfigurator-client)
4. [Teil 4: Kalibrierungs-Ebenen & PIN-Sicherheitsarchitektur](#teil-4-kalibrierungs-ebenen--pin-sicherheitsarchitektur)
5. [Teil 5: Telemetrie & Funktransporte (Bluetooth & WLAN)](#teil-5-telemetrie--funktransporte-bluetooth--wlan)
6. [Teil 6: Felddiagnose & System-FAQ (25 Prüffälle)](#teil-6-felddiagnose--system-faq-25-prüffälle)
7. [Teil 7: Technisches Glossar & Kenngrößen](#teil-7-technisches-glossar--kenngrößen)

---

## Teil 1: Systemarchitektur im Überblick

Die Antriebseinheit gliedert sich in vier gekoppelte Subsysteme:
* **DC-Bus / Energiespeicher:** Liefert die elektrische Betriebsspannung (24 V bis 48 V Nennspannung, 10S bis 14S Li-Ion).
* **BLDC-Inverter & Stator:** Wandelt Gleichspannung über Drehstrom-Halbbrücken in dreiphasige Kommutierung für den Motor.
* **metisa Universal-Controller:** Erfasst Sensordaten (PAS-Trittfrequenz, Raddrehzahl, Drehmoment, Shunt-Strom), berechnet den PID-Regelkreis und steuert ECE-R 50 Beleuchtungsstufen sowie Sicherheits-Failsafes.
* **HMI / Cockpit:** Visualisiert Fahrdaten und ermöglicht Parameterabstimmung via USB, SPI/I2C-Displays oder autarken Web-Client.

### Grundlegende Sicherheitsregel:
> **SICHERHEITSHINWEIS:** Vor sämtlichen Arbeiten am Leitungsstrang oder an den Steckverbindern ist der **DC-Hauptschalter zu öffnen bzw. der Akku-Hauptstecker physisch zu trennen**. Kurzschlüsse am DC-Bus führen zu extremen Entladeströmen, Lichtbögen und thermischer Zerstörung von Leiterbahnen und Halbleitern.

---

## Teil 2: Leitungsstrang & Schnittstellen-Pinout

Jede Zuleitung erfüllt eine definierte elektrische Funktion. Nachfolgend die standardisierte Leitungsübersicht:

```
                  +-----------------------------------+
                  |         METISA CONTROLLER         |
                  |     (Universal-ECU Plattform)     |
                  +-----------------------------------+
                     |         |         |         |
    +----------------+         |         |         +----------------+
    |                          |         |                          |
 [DC-BUS]                   [MOTOR]    [PAS-TRETSENSOR]         [LENKER]
 + / - (Rot/Schwarz)        3 Phasen   Hall-Flanke              Gasgriff, Bremsen,
 24V - 48V                  zum ESC    am Tretlager             Display & Blinker
```

### 1. DC-Bus Hauptstromversorgung
* **Rot = Plus (+)**
* **Schwarz = Minus / Masse (GND)**
* **HINWEIS:** Absoluter Verpolungsschutz ist sicherzustellen. Falschpolung überbrückt die internen Freilaufdioden und führt zur thermischen Überlastung der Shunts.

### 2. PAS-Trittfrequenzsensor
* Hall-Sensorring an der Tretlagerachse zur Messung der Tretbewegung.
* **Regulatorische Funktion:** Nach EN 15194 darf Motorunterstützung nur bei aktiver Kurbeldrehung freigegeben werden.
* **Justage:** Der axiale Abstand zwischen Sensorkopf und Magnetscheibe muss **1,0 bis 2,0 mm** betragen. Größere Luftspalte führen zu Signalverlust oder Jitter.

### 3. Raddrehzahl-Sensor (Speichentacho)
* Magnetschalter an Felge oder Bremsscheibe.
* Liefert die Taktung für die Raddrehzahl- und Odometrieberechnung im Millisekunden-Raster.

### 4. Analoger Hall-Gasgriff
* Dreipolige Schnittstelle:
  * **Rot:** +5 V Hilfsspannung
  * **Schwarz:** Masse (GND)
  * **Signal (Blau/Grün/Weiß):** Analoge Ausgangsspannung (0,8 V bis 4,2 V).
* **Begrenzung:** Im gesetzlichen Modus nur bis maximal **6 km/h** als Anfahr- und Schiebehilfe wirksam.

### 5. Bremshebel-Unterbrecher
* Schaltet den Motor bei Betätigung **latenzfrei (&lt; 2 ms)** stromlos und triggert die ECE-R 50 Bremslicht- und ESS-Stufe.

---

## Teil 3: Der Web-Konfigurator Client

Der metisa Web-Konfigurator arbeitet autark im Browser ohne externe Abhängigkeiten oder Installationsprozesse:

### Start der Kalibrierumgebung:
1. Öffne die Datei `configurator/index.html` in einem modernen WebKit- oder Chromium-Browser (Chrome, Edge, Safari, Firefox).
2. Die Oberfläche präsentiert sich im hochauflösenden SaGa Labs Orbit Design mit dunklem Obsidian-Thema und technischer Datendichte.

### USB-Verbindung (Web Serial Live-Messung):
1. Verbinde den Controller via USB-Schnittstelle mit dem Computer.
2. Betätige in der oberen Werkzeugleiste die Schaltfläche **[ VERBINDEN ]**.
3. Wähle den entsprechenden COM-Port / UART-Bridge (z. B. CP2102, CH340 oder MCU-CDC) aus.
4. Nach dem Handshake werden die Telemetrie-Rohdaten im Monitor in Echtzeit aktualisiert.

### Profilexport und Firmware-Header:
1. Kalibriere die motorspezifischen Parameter (Spannungsschwellen, Shunt-Faktor, Cutoff-Rampen).
2. Nutze **[ APC ]** oder **[ JSON ]** zum dauerhaften Speichern der Kalibrierungsstände.
3. Betätige **[ GENERATE CONFIG.H ]**, um den maßgeschneiderten C++ Header für den Build-Prozess zu exportieren.

---

## Teil 4: Kalibrierungs-Ebenen & PIN-Sicherheitsarchitektur

Das Sicherheitskonzept implementiert eine dreistufige Hierarchie:

| Stufe | Bezeichnung | Max. Speed | Nennleistung | Kurbelpflicht (PAS) | Daumengas |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **0** | **Standard (Werkseinstellung)** | **25 km/h** | **250 W** | **Strikt aktiv** | Max. 6 km/h (Schiebehilfe) |
| **1** | **Sport** | **32 km/h** | **500 W** | Aktiv | Max. 6 km/h |
| **2** | **Track & Dyno (Rennstrecke)** | **Bis 99 km/h** | **Bis 3000 W** | **Deaktiviert** | **Ungedrosselt (Direkt-Gas)** |

### Sicherheitsmechanismen:
* **Autonomer Boot-Schutz:** Bei jedem Kaltstart oder System-Reset lädt die Firmware zwingend **Stufe 0**.
* **Kryptografische Entkopplung:** Die Freischaltung von Stufe 2 erfordert einen gerätespezifischen PIN-Code.
* **Autorisierungs-Workflow:**
  1. Öffne das offizielle Autorisierungsportal (`configurator/unlock_portal.html`).
  2. Gib Controller-Seriennummer, Halterdaten und Zustell-E-Mail ein.
  3. Bestätige die regulatorischen Erklärungen für den geschlossenen Motorsportbetrieb sowie den Gewährleistungsverzicht.
  4. Die gerätespezifische PIN wird generiert und kryptografisch dokumentiert.
  5. Im Konfigurator Client den PIN-Code eingeben und bestätigen; die Track-Parameter werden sofort freigeschaltet.

---

## Teil 5: Telemetrie & Funktransporte (Bluetooth & WLAN)

Auf Systemen mit integriertem Wireless-SoC (z. B. ESP32) stehen autarke Funktransporte bereit:

### Bluetooth RFCOMM / SPP (Android HMI & Logger):
1. Am Endgerät Bluetooth aktivieren und nach `APC-Pedelec` suchen.
2. Koppeln mittels Standard-PIN: `1234`.
3. Kompatibel mit Android HMI und Standard-Telemetrie-Decodern.

### IEEE 802.11 SoftAP (Universelles HTML5 Cockpit):
1. WLAN-Verbindung mit SSID herstellen: **`APC-Pedelec-WiFi`**.
2. WPA2-Passwort eingeben: **`21028600`**.
3. Browser öffnen und die Gateway-Adresse aufrufen:  
   **`http://192.168.4.1`**
4. Das interaktive Cockpit stellt Telemetriedaten (Geschwindigkeit, DC-Spannung, Phasenstrom, Beleuchtungsstatus) verzögerungsfrei dar.

---

## Teil 6: Felddiagnose & System-FAQ (25 Prüffälle)

### CASE 01: Null-Leistungsabgabe trotz aktivem Systemstatus.
> **Diagnose:** 1. DC-Busspannung am Eingang prüfen (min. 28,0 V). 2. Bremshebel-Schaltzustand prüfen (geschlossener Kontakt forciert 0 W Notabschaltung). 3. PAS-Signalflanken im Live-Monitor verifizieren; im Standardprofil wird Leistung erst bei registrierter Kurbeldrehzahl freigegeben.

### CASE 02: Drehmoment-Ruckeln oder Kommutierungsfehler beim Anlauf.
> **Diagnose:** BLDC-Phasensequenz inkonsistent. Bei sensorlosen oder Block-Kommutierungs-Invertern zwei der drei Motorphasenleitungen (U, V, W) tauschen, um korrekte Phasenlage und Drehrichtung herzustellen.

### CASE 03: Raddrehzahl-Signal verharrt statisch auf 0,0 km/h.
> **Diagnose:** Reed- bzw. Hall-Sensor dejustiert. Der Speichenmagnet muss einen radialen Abstand von maximal 2,0 bis 3,0 mm zur Sensorstirnfläche aufweisen. Flankenerkennung im Live-Monitor gegenprüfen.

### CASE 04: Motorischer Nachlauf nach Kurbelstillstand.
> **Diagnose:** Der Parameter `pas_timeout` definiert die Latenz bis zur Abschaltung (Standard: 500 ms). Bei PAS-Scheiben mit 12 Magneten kann der Wert im Konfigurator auf `200 - 250 ms` herabgesetzt werden.

### CASE 05: Gasgriff ohne Sollwertausgabe bei Null-Trittfrequenz.
> **Diagnose:** Im Standard-Profil (Level 0) ist die reine Gasgriff-Funktion gesetzlich auf 6 km/h Anfahrhilfe limitiert. Für ungedrosselten Betrieb auf abgesperrten Strecken muss Level 2 über das Autorisierungsportal freigeschaltet werden.

### CASE 06: DC-Bus-Spannungseinbruch unter Beschleunigungslast.
> **Diagnose:** Physikalischer Spannungseinbruch (Voltage Sag) durch Innenwiderstand der Akkuzellen und Zuleitungsimpedanz. Bei hohem Innenwiderstand Zuleitungsquerschnitte (min. 2,5 - 4,0 mm²) und Zellgesundheit prüfen.

### CASE 07: Display-Interface initialisiert nicht / Display bleibt dunkel.
> **Diagnose:** Versorgungsspannung am Display-Port prüfen. Bei ST7789 Color TFT SPI-Signale (DC, CS, BL) und Hintergrundbeleuchtungs-Treiberstufe prüfen. Bei PCD8544 Monochrom-Displays Kontrast-Register im Konfigurator anpassen.

### CASE 08: WLAN-SoftAP-Beacon "APC-Pedelec-WiFi" nicht auffindbar.
> **Diagnose:** Controller-Chip prüfen. Ältere AVR-Targets verfügen über keinen Onboard-Transceiver. Bei ESP32-Targets sicherstellen, dass `wireless_wifi_softap` in der Konfiguration gesetzt und 2,4 GHz aktiviert ist.

### CASE 09: Browser-Cockpit auf iOS- oder Desktop-Clients ohne App-Installation.
> **Diagnose:** Keine native Applikation erforderlich. Nach Verbindung mit `APC-Pedelec-WiFi` (WPA2 Key `21028600`) im Browser `http://192.168.4.1` aufrufen; der autarke Webserver hostet das Cockpit plattformunabhängig.

### CASE 10: Radumfangskalibrierung in Millimetern.
> **Diagnose:** Der Parameter `nud_circumference` erfordert das exakte Abrollmaß in mm unter Fahrergewicht (z. B. 2200 mm bei 28 Zoll / 700x38C). Fehlerhafte Werte verfälschen Geschwindigkeits- und Odometrie-Berechnungen.

### CASE 11: Stromerfassung und Shunt-Kalibrierfaktor.
> **Diagnose:** Die Stromerfassung erfolgt über einen Low-Side-Messshunt. Der Parameter `nud_current_amplitude` [A/ADC] skaliert die ADC-Werte präzise in Ampere für Watt- und Kapazitätsintegratoren.

### CASE 12: Fahrtrichtungsanzeiger nach ECE-R 50 Spezifikation.
> **Diagnose:** Die integrierte Blinkgeber-Logik taktet mit exakt 1,5 Hz (90 Zyklen/min) bei 50% Tastverhältnis. Die automatische Abschaltung (Auto-Cancel) deaktiviert das Signal nach 20 Sekunden Fahrtzeit.

### CASE 13: Emergency Stop Signal (ESS) Notbrems-Stroboskop.
> **Diagnose:** Bei Bremsbetätigung oberhalb von 15 km/h und starker Verzögerung taktet die Bremslicht-Endstufe mit 3,5 Hz Hochfrequenz-Stroboskop, um Folgeverkehr vor drohender Kollision zu warnen.

### CASE 14: Thermische Sicherheitsabschaltung der Signalhupe.
> **Diagnose:** Zum Schutz der Spulenwicklung vor Überhitzung begrenzt metisa die kontinuierliche Bestromung der Hupe auf maximal 3,0 Sekunden. Nach Tasterentlastung erfolgt sofortige Reaktivierung.

### CASE 15: Tiefentladeschutz und Notabschalt-Schwellen.
> **Diagnose:** Zwei Sicherheitsstufen: 1. `vcutoff` (z. B. 33,0 V bei 10S) bewirkt kontinuierliches Leistungsderating. 2. `vemergency_shutdown` (28,0 V) forciert komplette Endstufen-Abschaltung.

### CASE 16: Leiterquerschnitte und Steckverbinder für Hochstrom-Anwendungen.
> **Diagnose:** Für Dauerströme bis 25 A mindestens 2,5 mm², oberhalb 25 A min. 4,0 mm² hochflexible Silikonleitung (AWG 12/AWG 10) und korrosionsfeste Goldkontakte (XT60 / XT90-S mit Anti-Spark) verwenden.

### CASE 17: Umgebungsbedingungen und IP-Schutzklasse.
> **Diagnose:** Gehäuse und Kabeldurchführungen sind nach Schutzart IP67 ausgeführt. Bei individueller Integration Kabelverschraubungen nach unten ausrichten und Kondenswasserbildung durch Druckausgleichselemente verhindern.

### CASE 18: Verlust des Track-Kalibrierungs-PIN-Codes.
> **Diagnose:** Der Autorisierungs-PIN-Code wird kryptografisch aus der Hardware-Seriennummer und einem geschützten Salt abgeleitet. Er kann jederzeit im offiziellen Autorisierungsportal unter Angabe der Seriennummer erneut abgerufen werden.

### CASE 19: Automatisches Sleep-Timeout nach Inaktivität.
> **Diagnose:** Der Parameter `idle_shutdown_secs` versetzt den Controller nach programmierter Inaktivität (Standard: 1800 s = 30 min) in den Ruhezustand, um Ruhestromverluste am Akku zu eliminieren.

### CASE 20: Adaption abweichender DC-Bus-Spannungsniveaus (z. B. 48V / 13S).
> **Diagnose:** Hardwarekompatibilität vorausgesetzt, müssen im Konfigurator Ladeschlussspannung (54,6 V), Derating-Start (42,0 V) und Notabschalt-Schwelle (39,0 V) exakt an die Zellchemie angepasst werden.

### CASE 21: Notwendigkeit elektrischer Bremskontaktschalter.
> **Diagnose:** Elektrische Unterbrecherkontakte sind sicherheitskritisch. Sie garantieren die unverzügliche Endstufen-Abschaltung unabhängig von I-Anteilen des PID-Reglers und verhindern Gegenmoment-Überlastungen.

### CASE 22: Hall-Gasgriff Kalibrierung und Totband-Justage.
> **Diagnose:** Über den Live-Monitor den Ruhewert (z. B. ADC 185) und den Vollausschlag (z. B. ADC 860) erfassen. Diese Werte als `nud_throttle_min` und `nud_throttle_max` eintragen; Signale außerhalb dieses Bereichs werden als Sensorfehler gewertet.

### CASE 23: Wiederherstellung der Werkseinstellungen (EEPROM Reset).
> **Diagnose:** Profil `Default-metisa` im Konfigurator laden. Über die serielle Diagnoseschnittstelle kann das EEPROM mittels des Kommandos `clean_eeprom` vollständig auf Werkszustand bereinigt werden.

### CASE 24: Fehlende Bestromung des Scheinwerfer-Ausgangs.
> **Diagnose:** Solid-State-Lichtschalterstufe prüfen. Im Konfigurator prüfen, ob `metisa_headlight` aktiviert ist. Zustand im HMI-Displaymenü oder über dedizierten Lenkertaster toggeln.

### CASE 25: Technischer Eskalationssupport und Firmware-Archiv.
> **Diagnose:** Dokumentation, Schaltpläne und Firmware-Quellcodes stehen im offiziellen SaGa Labs Metisa Orbit Repository bereit. Für technische Audits und Laborprüfungen stehen die automatisierten Testbench-Harnesses zur Verfügung.

---

## Teil 7: Technisches Glossar & Kenngrößen

* **Ampere (A):** Elektrische Stromstärke. Maß für den momentanen Ladungsträgerfluss durch die Leitungsquerschnitte.
* **Volt (V):** Elektrisches Potenzial bzw. Spannung am DC-Bus.
* **Leistung (W):** Elektrische Wirkleistung: $P = U \times I$.
* **Energieinhalt (Wh):** Zeitintegral der Wirkleistung: $E = \int P(t)\,dt$.
* **BLDC:** *Brushless Direct Current* (Bürstenloser Gleichstrommotor mit permanentmagnetischem Rotor).
* **Kadenz:** Trittfrequenz in Kurbelumdrehungen pro Minute (RPM).
* **Rekuperation:** Rückspeisung kinetischer Energie in den DC-Bus bei elektrischer Bremsverzögerung.
* **PID-Regler:** Proportional-Integral-Differential-Regler zur kontinuierlichen Ausregelung der Motorlast ohne Regelschwingungen.
* **ECE-R 50 / EN 15194:** Internationale Normen für lichttechnische Einrichtungen von Zweirädern bzw. Pedelec-Sicherheit.
