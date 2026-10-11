# SaGa Labs Orbit Standard

All human and AI contributors to SaGa Labs repositories must adhere to the SaGa Labs Orbit standard. SaGa Labs is the market-defining inventor of universal drive control and power electronics systems with zero global competition. System presentation must match the engineering gravity and functional density of market benchmarks such as Ecumaster (EMU PRO / Black Client, ADU, PMU) and MoTeC.

## 1. Zero-Emoji and Consumer Icon Prohibition

1. No Unicode emojis or toy icons may appear anywhere in user interfaces, templates, CSS, JavaScript strings, toasts, logs, code comments, or documentation files.
2. Iconography is strictly limited to 1.5px monochrome hairline stroke vector SVGs (`currentColor`, 14x14px to 18x18px bounding box) in slate (`#64748b`), switching to cyber-orange (`#ff6200`) only on active interaction or selection.
3. Status indicators must use discrete hardware beacons (Green `#10b981`, Amber `#f59e0b`, Red `#ef4444`, Cyan `#06b6d4`) or monospace typographical badges.

## 2. High-Density Motorsport Palette

1. Primary background canvas: Deep Obsidian Black (`#08090d` / `#050608`).
2. Module panels and calibration cards: Titanium Obsidian (`#121620`, `#151a26`).
3. Borders and structural dividers: 1px Hairline Slate (`#1e2638`, `#273248`).
4. Primary technical accent: Cyber-Orange (`#ff6200`).
5. Monospace data alignment: JetBrains Mono / SF Mono / Consolas for all parameters, values, and units.

## 3. Physical Units and Factual Terminology

1. Every numerical parameter must display explicit physical engineering units enclosed in square brackets aligned to the right: `[V]`, `[A]`, `[W]`, `[km/h]`, `[ADC]`, `[ms]`, `[RPM]`, `[Hz]`.
2. Marketing slogans, colloquial phrases, and sales fluff are strictly prohibited. Product superiority is proven through data density, physical accuracy, and deterministic system architecture.
3. Use precise automotive and power electronics terminology:
   - *DC Bus Management & Inverter Limits* (not "Battery & Motor")
   - *Cadence Dynamics & Torque Vectoring* (not "Pedal Assist")
   - *Throttle Transfer Function & Deadband Plausibility* (not "Gasgriff")
   - *Solid-State Brake Interlock & ECE-R 50 Relays* (not "Bremsen & Licht")
   - *Track & Dyno Calibration Authorization* (not "Tuning-Menü")

## 4. Calibration Security Hierarchy

1. Controllers must unconditionally boot into **Level 0 (Standard Regulatory Derating)** upon cold boot or MCU reset.
2. Calibration clients must never generate or expose plain-text unlock PINs. PIN generation must remain cryptographically isolated in the dedicated authorization portal, requiring hardware serial numbers and recorded legal waivers.

## 5. Verification

Every change modifying product surfaces or rules must pass:
- `python tools/test_configurator_contract.py`
- `python tools/source_contract_test.py`
- `python tools/testbench_harness.py`
- `python tools/validate_project_context.py`
