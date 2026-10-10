# Normiertes Labor-Messabnahmeprotokoll (WP-05 / WP-06)

**Projekt:** metisa Pedelec Controller (APC 1.43 Multi-Target Port)  
**Dokument-ID:** LAB-PROTOKOLL-WP05-WP06-REV1  
**Gültig für:** Hardware-Inbetriebnahme, Prüfstands- & Oszilloskop-Messungen an STM32, RP2040, ESP32 und AVR  
**Sicherheitsgrenze:** Alle Messungen erfolgen stromlos bzw. mit galvanisch getrennter Motor-Leistungselektronik!  

---

## 1. Stammdaten & Prüfplatz-Ausrüstung

| Prüffeld | Wert / Eintragung |
| :--- | :--- |
| **Prüfdatum & Uhrzeit:** | `________________________________________` |
| **Prüfer / Ingenieur:** | `________________________________________` |
| **Prüfling (DUT - Device Under Test):** | `[ ] STM32 BlackPill F401CC  [ ] STM32 BluePill F103C8  [ ] STM32 Nucleo G431RB`<br>`[ ] RP2040 Pico  [ ] ESP32 DevKit  [ ] Arduino Nano  [ ] Arduino Mega` |
| **Seriennummer / Board-Revision:** | `________________________________________` |
| **Firmware Git-Commit-Hash:** | `________________________________________` |
| **Oszilloskop-Modell & Kalibrierdatum:** | `________________________________________` |
| **Signalgenerator-Modell:** | `________________________________________` |
| **Labornetzteil & Strombegrenzung:** | `Soll: 12.0 V / 0.20 A Begrenzung (DUT-Versorgung)` |

---

## 2. Messpunkt-Prüfmatrix (TP01 bis TP10)

### TP01: Motorausgang (PWM / Servo-Signal)
- **Signalanschluss:** Oszilloskop Tastkopf 10:1 an `throttle_out` gegen GND.
- **Prüfschritte:**
  1. Boot-Phase (0..500 ms): Signalpegel messen. **Soll:** 0.0 V starr (kein Glitch / High-Impuls).
  2. Leerlauf (PAS inaktiv): Signalpegel messen. **Soll:** Inaktiv (0% PWM bzw. 1.0 ms Servo-Neutral).
  3. Bremse betätigt (`brake_in = LOW`): Motor-Anforderung erzwingen. **Soll:** Sofortige Abschaltung auf 0 V ($\le 10\text{ ms}$).

| Prüfschritt | Sollwert | Toleranz | Gemessen | Bewertung |
| :--- | :--- | :--- | :--- | :--- |
| TP01.1: Boot-Glitchfreiheit | $0.0\text{ V}$ | $< 0.4\text{ V}, < 100\,\mu\text{s}$ | `________ V` | `[ ] PASS [ ] FAIL` |
| TP01.2: PWM-Frequenz (FC2 / 32-Bit) | $32.0\text{ kHz}$ | $\pm 2.0\%$ ($31.36 .. 32.64\text{ kHz}$) | `________ kHz`| `[ ] PASS [ ] FAIL` |
| TP01.3: Bremsabschaltlatenz | $\le 10\text{ ms}$ | Max. $15\text{ ms}$ | `________ ms` | `[ ] PASS [ ] FAIL` |

---

### TP02: PAS (Pedal Assist Sensor) Schnittstelle
- **Signalanschluss:** Signalgenerator CH1 an `pas_in`, Oszilloskop CH1 an `pas_in`, CH2 an `throttle_out`.
- **Einspeisung:** Rechteck $0..3.3\text{ V}$ (bzw. $0..5\text{ V}$ für AVR), $50\%$ Duty Cycle, $15\text{ Hz}$ ($90\text{ rpm}$ Cadence).
- **Prüfschritte:**
  1. Signal aktivieren: Motorfreigabe prüfen.
  2. Signal stoppen: Timeout-Abschaltung messen. **Soll:** Motor stoppt nach $\le 500\text{ ms}$ (`pas_timeout`).

| Prüfschritt | Sollwert | Toleranz | Gemessen | Bewertung |
| :--- | :--- | :--- | :--- | :--- |
| TP02.1: Cadence-Messgenauigkeit | $90\text{ rpm}$ | $\pm 2\text{ rpm}$ ($88 .. 92\text{ rpm}$) | `________ rpm`| `[ ] PASS [ ] FAIL` |
| TP02.2: PAS-Timeout Motorstopp | $500\text{ ms}$ | $\pm 50\text{ ms}$ ($450 .. 550\text{ ms}$) | `________ ms` | `[ ] PASS [ ] FAIL` |

---

### TP03: Radsensor (Geschwindigkeitserfassung) & Abregelung
- **Signalanschluss:** Signalgenerator CH2 an `wheel_in` (Reed / Hallsensor Impuls).
- **Einspeisung:** $2.20\text{ m}$ Radumfang.
  - $20\text{ km/h} \Rightarrow 2.52\text{ Hz}$
  - $24.9\text{ km/h} \Rightarrow 3.14\text{ Hz}$
  - $25.5\text{ km/h} \Rightarrow 3.22\text{ Hz}$ (Abregelgrenze StVZO)
- **Prüfschritte:**
  1. $20\text{ km/h}$: Volle Motorleistung aktiv.
  2. $25.0\text{ km/h}$: PID-Leistungsreduktion setzt ein.
  3. $> 25.5\text{ km/h}$: Motorleistung $0\text{ W}$ (vollständige Abschaltung).

| Prüfschritt | Sollwert | Toleranz | Gemessen | Bewertung |
| :--- | :--- | :--- | :--- | :--- |
| TP03.1: Geschwindigkeitsanzeige 20 km/h | $20.0\text{ km/h}$ | $\pm 0.3\text{ km/h}$ | `________ km/h`| `[ ] PASS [ ] FAIL` |
| TP03.2: StVZO Abschaltung bei 25.0 km/h | $0\text{ W}$ PWM | $\le 25.5\text{ km/h}$ | `________ km/h`| `[ ] PASS [ ] FAIL` |

---

### TP04 & TP05: Gasgriff Window-Comparator & Analog-Failsafes
- **Signalanschluss:** Regelbare Gleichspannungsquelle an `throttle_in`.
- **Grenzwerte:**
  - $V_{in} < 0.5\text{ V}$ (Kabelbruch / Masseverbindung abgerissen): **SOFORT NOT-AUS!**
  - $V_{in} > 4.4\text{ V}$ (5V-Kurzschluss / Massebruch am Hallsensor): **SOFORT NOT-AUS!**
  - $0.9\text{ V} .. 3.6\text{ V}$: Normaler Regelbereich ($0 .. 100\%$ Leistung).

| Prüfschritt | Einspeisung | Soll-Reaktion | Gemessen | Bewertung |
| :--- | :--- | :--- | :--- | :--- |
| TP04.1: Kurzschluss nach Masse | $0.20\text{ V}$ | `throttle_stat = 0` (0% PWM) | `________` | `[ ] PASS [ ] FAIL` |
| TP04.2: Normaler Nullpunkt | $0.95\text{ V}$ | `throttle_stat = 0` (0% PWM) | `________` | `[ ] PASS [ ] FAIL` |
| TP04.3: Vollgas | $3.50\text{ V}$ | `throttle_stat = 1023` (100% PWM) | `________` | `[ ] PASS [ ] FAIL` |
| TP04.4: Kurzschluss nach 5V | $4.80\text{ V}$ | `throttle_stat = 0` (0% PWM Failsafe) | `________` | `[ ] PASS [ ] FAIL` |

---

### TP06: ECE-R 50 Richtungsblinker
- **Signalanschluss:** Oszilloskop CH1 an `turn_signal_left_pin`, CH2 an `turn_signal_right_pin`.
- **Prüfschritte:**
  1. Blinker Links einschalten.
  2. Blinkfrequenz und Tastverhältnis messen. **Soll:** $1.50\text{ Hz} \pm 5\%$ ($333\text{ ms}$ High / $333\text{ ms}$ Low).
  3. Auto-Cancel-Timer abwarten: **Soll:** Selbsttätige Abschaltung nach $20.0\text{ s} \pm 0.5\text{ s}$.

| Prüfschritt | Sollwert | Toleranz | Gemessen | Bewertung |
| :--- | :--- | :--- | :--- | :--- |
| TP06.1: Blinkfrequenz | $1.50\text{ Hz}$ | $1.42 .. 1.58\text{ Hz}$ | `________ Hz` | `[ ] PASS [ ] FAIL` |
| TP06.2: Tastverhältnis (Duty Cycle) | $50.0\%$ | $48.0 .. 52.0\%$ | `________ %` | `[ ] PASS [ ] FAIL` |
| TP06.3: Auto-Cancel Abschaltzeit | $20.0\text{ s}$ | $19.5 .. 20.5\text{ s}$ | `________ s` | `[ ] PASS [ ] FAIL` |

---

### TP07: ESS Dynamisches Notbremsblinken
- **Signalanschluss:** Oszilloskop an `lights_brake_pin`.
- **Bedingung A (Normalbremsung):** $v \le 15\text{ km/h}$ und Bremse aktiv $\Rightarrow$ Dauerlicht (Dauer-High).
- **Bedingung B (Notbremsung):** $v > 15\text{ km/h}$ und Bremse aktiv $\Rightarrow$ Notbremsblinken $3.50\text{ Hz}$ ($143\text{ ms}$ Takt).

| Prüfschritt | Geschwindigkeit | Soll-Verhalten | Gemessen | Bewertung |
| :--- | :--- | :--- | :--- | :--- |
| TP07.1: Normales Bremslicht | $10.0\text{ km/h}$ | Dauer-HIGH ($100\%$) | `________` | `[ ] PASS [ ] FAIL` |
| TP07.2: ESS Notbremsblinken | $25.0\text{ km/h}$ | $3.50\text{ Hz} \pm 0.2\text{ Hz}$ ($143\text{ ms}$ Takt) | `________ Hz` | `[ ] PASS [ ] FAIL` |

---

### TP08: Hupe Thermische Schutzabschaltung
- **Signalanschluss:** Oszilloskop an `horn_pin`.
- **Prüfschritt:** Dauerbetätigung der Hupe auslösen.
- **Soll:** Signal schaltet nach exakt $3.0\text{ s}$ automatisch auf LOW (Spulenschutz gegen Überhitzung).

| Prüfschritt | Sollwert | Toleranz | Gemessen | Bewertung |
| :--- | :--- | :--- | :--- | :--- |
| TP08.1: Maximale Einschaltdauer | $3.00\text{ s}$ | $2.85 .. 3.15\text{ s}$ | `________ s` | `[ ] PASS [ ] FAIL` |

---

### TP09: ST7789 TFT SPI-Busintegrität
- **Signalanschluss:** Oszilloskop an `SCK`, `MOSI`, `CS`, `DC`.
- **Messung:** Taktfrequenz, Flankensteilheit ($t_r$, $t_f$) und Überschwingen (Overshoot).

| Prüfschritt | Sollwert | Toleranz | Gemessen | Bewertung |
| :--- | :--- | :--- | :--- | :--- |
| TP09.1: SPI Taktfrequenz | Bis $40.0\text{ MHz}$ | Signal stabil, Flanken $< 10\text{ ns}$ | `________ MHz`| `[ ] PASS [ ] FAIL` |
| TP09.2: Überschwingen (V_overshoot) | $< 300\text{ mV}$ | Signal rauscharm | `________ mV` | `[ ] PASS [ ] FAIL` |

---

### TP10: Watchdog & Brownout-Verhalten
- **Signalanschluss:** Labornetzteil Spannungsvariation ($3.3\text{ V} \to 2.5\text{ V} \to 3.3\text{ V}$) bzw. Test-Loop-Blockade.
- **Soll:**
  - Watchdog löst bei Schleifenblockade nach $1.0\text{ s}$ zuverlässig einen Reset aus.
  - Nach Reset verbleibt der Motorausgang inaktiv ($0.0\text{ V}$), bis eine neue gültige Tretanforderung vorliegt.

| Prüfschritt | Sollwert | Toleranz | Gemessen | Bewertung |
| :--- | :--- | :--- | :--- | :--- |
| TP10.1: Watchdog-Auslösezeit | $1.00\text{ s}$ | $\pm 0.15\text{ s}$ | `________ s` | `[ ] PASS [ ] FAIL` |
| TP10.2: Motor nach Reboot inaktiv | $0.0\text{ V}$ | Keinerlei Anlauf | `________ V` | `[ ] PASS [ ] FAIL` |

---

## 3. Gesamtfreigabe-Entscheidung

- **Prüfergebnis:** `[ ] VOLLSTÄNDIG BESTANDEN  [ ] MIT AUFLAGEN  [ ] DURCHGEFALLEN`
- **Bemerkungen / Abweichungen:**  
  `__________________________________________________________________________________`  
- **Unterschrift Prüfingenieur:** `________________________________________`
