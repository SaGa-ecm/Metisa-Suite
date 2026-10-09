# AI Working Guide

This document is the canonical technical context for VS Code Copilot, Gemini/Antigravity, Claude, Cursor, and other coding agents. Fixed normative rules live separately in [`project-rules/`](../project-rules/INDEX.md); provider adapters should point to both instead of copying divergent policy.

## Fixed rules and project skills

Read [`project-rules/INDEX.md`](../project-rules/INDEX.md) before acting. Those files are the normative rules for safety/hardware, rights/provenance, modular development/checkpoints, change validation, secrets, and remote operations.  
Read [`skills/INDEX.md`](../skills/INDEX.md) and applicable skills. Every AI model is explicitly free to create, revise, combine, and use skills without prior approval. All skill files must live in `skills/<lowercase-kebab-name>/SKILL.md`, and every new skill must be indexed in the same change. Skills may add procedures but may not override fixed project rules.

## Project identity and provenance

- Product name: **metisa**, by SaGaLabs.
- This workspace is an inherited Arduino Pedelec "Forumscontroller" source tree, historically identified as Arduino Pedelec Controller v1.43. The historical version is a source baseline, not a metisa release number.
- Preserve original contributors' names and notices. Rebranding does not establish ownership or transfer copyright.
- No Git repository metadata is present in this workspace. Do not infer a commit, remote, branch, tracked-file set, or clean working tree.

## Technical baseline

- PlatformIO project source directory: `Arduino_Pedelec_Controller/`.
- Existing build targets: `nanoatmega328` and `megaatmega2560`.
- Nano and Mega have both been clean-built locally with the declared PlatformIO registry dependencies.
- STM32 and ESP32 environments are exploratory. Representative builds failed on direct AVR dependencies, AVR register access, the local OneWire implementation, and board pin assumptions. They are not supported targets.
- The CMake build is a legacy AVR-only path. The legacy feature matrix in `tools/compile_test.py` is not in CI; although its config restoration is now non-destructive, it requires a Linux/Arduino-CMake environment and has not been run here.
- The checked-in source-contract tests are static integration checks, not dynamic firmware, EEPROM, or electrical tests.

## Product surfaces

The intended metisa product also includes Android and Apple applications, a current Windows-only configurator, a planned browser configurator, and a homepage/website whose files will be supplied later. Those source folders are not present yet. Follow `project-rules/product-surfaces-and-interfaces.md`; do not invent app/web frameworks, protocols, homepage content, or feature parity before inspecting the actual sources and requirements. Work across surfaces in separately checkpointed slices against versioned shared contracts.

## Validation commands

Run from the repository root:

```powershell
python tools/source_contract_test.py
pio run -e nanoatmega328
pio run -e megaatmega2560
```

PlatformIO dependencies and AVR platform versions are declared/pinned in `platformio.ini`. Do not reintroduce absolute paths to a user's Arduino library or tool installation. CI is defined under `.github/workflows/`.

## Safety and hardware boundaries

- No new MCU/board has been electrically or motor-load qualified.
- A successful build is not a safety qualification, regulatory approval, or permission for road use.
- Keep motor power physically disconnected for software bring-up. Any powered test needs an isolated, current-limited fixture, a physical emergency stop, and qualified supervision.
- Never guess target pins, ADC input ranges/references, PWM routing/frequency, FET polarity, output neutral values, watchdog reset behavior, or external pull states.
- Current workbook findings include unresolved watchdog-reset/FET behavior, shutdown ordering, board revision versus documentation, ADC assumptions, ISR atomicity, and EEPROM format/power-loss cases. Read `docs/mcu-port-project-workbook.md` before altering these areas.
- The control output distinguishes raw zero from configured `motor_offset`; do not collapse them without circuit-level evidence.

## Licensing and publication boundary

- `LICENSE` is explicitly a draft for legal review, not a final operative license or a worldwide enforceability opinion.
- The source tree contains inherited GPL notices and components with MIT, LGPL, GPLv2, and other/conflicting notices. `THIRD_PARTY_NOTICES.md` is preliminary. The HX711 and MenuSystem licensing/provenance questions are unresolved.
- Do not remove or rewrite third-party notices. Do not state that SaGaLabs owns inherited code unless an assignment or other rights evidence is available.
- Do not publish, push, create a public remote repository, create releases, or change remote permissions based solely on local workspace access. Those actions require explicit confirmation of the repository and visibility, and licensing review.
- Never request, store, or print API keys/tokens in files or logs. Use an already configured credential manager/CLI for explicitly requested remote work.

## GitHub and contribution workflow

- GitHub Actions builds the Nano and Mega environments and runs the source-contract checks.
- Review `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`, `CONTRIBUTING.md`, and `SECURITY.md` for project workflows.
- Preserve narrow scope. Do not run cleanup commands that delete user data or untracked files. Do not use `git checkout`, `git reset`, or `git clean` as a restoration mechanism.
- For legacy build tests, restore generated configuration from a byte-for-byte backup in `finally` and use isolated temporary build directories.

## Workbook practice

Update `docs/mcu-port-project-workbook.md` when a finding, test result, safety assumption, or target status changes. Separate confirmed source facts, static checks, compiler builds, simulated behavior, and physical hardware measurements. Mark unrun checks as open; never infer hardware safety from software-only evidence.