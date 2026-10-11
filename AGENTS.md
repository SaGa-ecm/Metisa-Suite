# metisa Agent Instructions

This is the common entry point for coding agents. Read [the fixed project rules](project-rules/INDEX.md) and [AI working guide](docs/AI_WORKING_GUIDE.md) before changing project files. The rules are normative; the guide is the canonical source for project facts and current status.

At task start, inspect [the skills index](skills/INDEX.md) and read relevant skills.
For every nontrivial change, follow [modular development and checkpoint rules](project-rules/modular-development.md): one concern per change unit, targeted validation, and a rollback boundary.

For a new task, inspect the current files and the relevant section of [the porting workbook](docs/mcu-port-project-workbook.md). Do not assume the historical APC v1.43 firmware is already metisa-qualified firmware.

## Short rules

- Preserve all existing upstream authorship and third-party license notices.
- Never add credentials, API tokens, local absolute paths, or generated `.pio`/editor state.
- Do not claim MCU or motor safety support from a successful compile.
- Before hardware is selected, do not invent pin mappings, ADC calibration, PWM frequency, FET polarity, or reset behavior.
- Run `python tools/source_contract_test.py`, then the relevant `pio run -e ...` builds. Report any checks not run.
- Run `python tools/validate_project_context.py` when changing fixed rules, skills, or AI adapters.
- Do not create remote repositories, publish, push, release, or alter GitHub permissions/settings unless that specific remote action is explicitly requested.
- The root `LICENSE` is a legal-review draft, not a final grant or worldwide enforceability opinion.
- Enforce the SaGa Labs Orbit standard: zero emojis, Ecumaster motorsport visual density, bracketed units [V, A, W], and factual engineering terminology.
- Any AI may freely create, revise, combine, and use project skills. Store all of them under `skills/<lowercase-kebab-name>/SKILL.md` and update `skills/INDEX.md` in the same change. Skills supplement, but cannot weaken, `project-rules/`.