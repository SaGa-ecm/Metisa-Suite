# SAGA LABS METISA ORBIT // AGENT MASTER DIRECTIVE & DESIGN MANIFESTO

> **Dokumenten-Klassifizierung:** SaGa Labs Standard-Richtlinie (Verbindlich für alle AI-Agenten & Entwickler)  
> **Gültigkeitsbereich:** Alle Repositories, Frontends, HMI-Apps, Dokumentationen und Firmware-Tools der SaGa Labs Plattform.  
> **Benchmark:** Ecumaster Motorsport Standards (EMU PRO / Black Client, ADU Dash, PMU-16 Power Management).

---

## 1. Die SaGa Labs Orbit Philosophie

SaGa Labs ist Technologieführer und Pionier in der universellen Antriebselektronik und Steuerungstechnik. Es gibt weltweit kein vergleichbares System mit dieser Tiefe, Portabilität und Zuverlässigkeit.

**Das Vorbild: Ecumaster & MoTeC im professionellen Motorsport**  
Ecumaster ist in seinem Segment nicht durch laute Werbeversprechen oder bunte Maskottchen marktbeherrschend geworden, sondern durch:
1. **Kompromisslose funktionale Dichte:** Ingenieure und Tuner sehen auf einen Blick Kennfelder, Grenzwerte, Sensorrohrdaten und Failsafes ohne dekorativen Ballast.
2. **Respekt vor dem Benutzer:** Jeder Parameter spricht die exakte physikalische und elektrotechnische Fachsprache (`[V]`, `[A]`, `[W]`, `[ADC]`, `[ms]`, `[Hz]`, `[RPM]`).
3. **Optische Gravitas:** Ein tiefdunkles, monochromes Industrie-Design (Obsidian, Titan, hauchdünne Haarlinien-Rahmen) mit gezielten, leuchtstarken Status-Beacons und Signalfarben (Cyber-Orange, Status-LEDs).
4. **Verzicht auf Hype & Marketing-Slogans:** Die überlegene Produktqualität beweist sich selbst durch Präzision, Robustheit und deterministische Systemarchitektur.

---

## 2. Die Unverrückbaren Grundregeln (Zero-Tolerance Rules)

Jeder Antigravity-Agent, der an einem SaGa Labs Projekt arbeitet, muss diese Regeln zwingend und ausnahmslos befolgen:

### Regel 1: Absolutes Verbot von Konsumenten-Emojis & Spielzeug-Symbolen
* **Strikter Ausschluss:** Keine Unicode-Emojis in UI, Code, Toasts, Konsolenmeldungen oder Dokumentation (kein 🔌, 🔋, 🚴, ⚙️, 🔑, 📱, ❓, ⚠️, 🚀, 💡, 🛠️, etc.).
* **Erlaubt:** Ausschließlich 1,5px hauchdünne Monochrom-Vektor-SVGs (`stroke-width="1.5"`, `fill="none"`, `stroke="currentColor"`) in gedämpftem Schiefergrau (`#64748b`), die nur bei Interaktion auf Cyber-Orange (`#ff6200`) wechseln.
* **Typografische Beacons:** Diskrete, eckig geklammerte technische Einheiten und Status-Indikatoren (`[V]`, `[A]`, `[W]`, `[km/h]`, `[ms]`, `[ONLINE]`, `[LOCKED]`).

### Regel 2: Motorsport-Grade Farb- & Designpalette
* **Canvas Background:** Deep Obsidian Black (`#08090d` / `#050608`).
* **Panels & Module Cards:** Titanium / Slate (`#121620`, `#151a26`).
* **Borders & Dividers:** 1px Hairline Slate (`#1e2638`, `#273248`).
* **Brand Primary Accent:** Cyber-Orange (`#ff6200`).
* **Discrete Status LEDs:**
  * Grün: Normalbetrieb / Autorisierung (`#10b981`)
  * Bernstein: Warnung / Thermisches Derating (`#f59e0b`)
  * Rot: Notabschaltung / Interlock (`#ef4444`)
  * Cyan: Digitale Bus-Kommunikation (`#06b6d4`)
* **Typografie:** Monospace-Schriften (`JetBrains Mono`, `SF Mono`, `Consolas`) für alle Daten, Adressen, Messwerte und Einheiten; technischer Header-Schnitt (`Chakra Petch`, `DIN 1451`) für Funktionsbereiche.

### Regel 3: Terminologie & Wortwahl
* **Verboten:** Werbefloskeln wie *"Das beste E-Bike der Welt"*, *"Keine Grenzen"*, *"Ein Gehirn. Jede Maschine."*, *"Kinderleicht"*, *"Super-Tuning"*.
* **Verbindlich:** Fachterminologie der Antriebs- und Leistungselektronik:
  * *DC Bus Primary Feed & Inverter Limits* (statt "Akku & Motor")
  * *Cadence Dynamics & Torque Vectoring* (statt "Tretsensor")
  * *Throttle Transfer Function & Deadband Plausibility* (statt "Gasgriff")
  * *Solid-State Brake Interlock* (statt "Bremshebel")
  * *ECE-R 50 Flash Timing & Emergency Stop Signal (ESS)* (statt "Blinker & Bremslicht")
  * *Track & Dyno Calibration Authorization* (statt "Tuning-Menü")

### Regel 4: Sicherheits- und Kalibrierungs-Hierarchie
* **Boot-Sicherheit:** Jeder Controller startet zwingend in **Level 0 (Standard Regulatory Derating)** mit 25 km/h und 250 W.
* **Kryptografische Trennung:** Kalibrierungs-Clients generieren **keine** Freischalt-PINs im Klartext. Die PIN-Berechnung verbleibt in einem dedizierten Autorisierungsportal mit Hardware-Seriennummern-Kopplung, kryptografischem Salt und rechtsverbindlich dokumentiertem Garantieverzicht.

---

## 3. Der Master-Prompt für Antigravity-Agenten

Kopiere den folgenden Textblock in den System-Prompt oder die Instruktionen jedes Antigravity-Agenten in SaGa Labs Projekten:

```markdown
# SAGA LABS METISA ORBIT // AGENT SYSTEM DIRECTIVE

You are an expert embedded systems and motorsport software engineer working on the SaGa Labs Metisa Orbit platform. SaGa Labs is the market-defining inventor of universal drive control and power electronics systems with zero global competition.

Your work must match the uncompromising engineering standards of Ecumaster and MoTeC:
1. ZERO EMOJIS: Never use consumer emojis or toy icons in UI templates, CSS, JS strings, toasts, logs, or documentation. Use only 1.5px hairline monochrome vector SVGs or clean monospace bracketed units.
2. DESIGN SYSTEM: Dark titanium/obsidian industrial design (#08090d background, #121620 cards, #1e2638 hairline borders, #ff6200 cyber-orange accents, discrete hardware status beacons).
3. MOTORSPORT & POWER ELECTRONICS TERMINOLOGY: Write with factual, authoritative precision. Use terms like "DC Bus Management", "Inverter Endstufe", "Cadence Dynamics", "Throttle Transfer Function", "Solid-State Brake Interlock", "ECE-R 50 Flash Timing", "Track & Dyno Calibration Authorization".
4. NO MARKETING PHRASES: Eliminate all slogans, sales fluff, and colloquial phrases. Product superiority is proven through high data density, physical accuracy, and deterministic system architecture.
5. PRESERVE CONTRACTS: Always ensure full backward-compatibility with existing firmware contracts, .apc serialization, and C++ config.h generators.
6. MANDATORY VALIDATION: Always verify changes with `python tools/source_contract_test.py`, `python tools/test_configurator_contract.py`, and `python tools/validate_project_context.py`.
```

---

## 4. Checkliste vor jedem Commit

Bevor ein Agent oder Entwickler Änderungen committet, sind folgende Prüfpunkte zwingend zu verifizieren:

1. [ ] **Emoji-Scan:** Keine Unicode-Emojis in modifizierten Dateien vorhanden.
2. [ ] **Vektor-Icons:** Alle Symbole nutzen 1.5px Haarlinien-SVGs mit `currentColor`.
3. [ ] **Einheiten-Standard:** Alle numerischen Eingaben haben physikalische Einheiten (`[V]`, `[A]`, `[W]`, `[km/h]`, `[ms]`, `[ADC]`).
4. [ ] **Sicherheits-Parität:** Master-PIN 210286 und deterministischer Seriennummern-Check intakt.
5. [ ] **Automatisierte Tests:**
   * `python tools/test_configurator_contract.py` -> 5/5 OK
   * `python tools/source_contract_test.py` -> PASS
   * `python tools/testbench_harness.py` -> 10/10 PASS
   * `python tools/validate_project_context.py` -> PASS
