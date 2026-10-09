# Contributing to metisa

metisa is derived from an existing Pedelec controller project and includes third-party code. Contributions must preserve upstream attribution and must not silently change hardware behavior or licensing.

## Before opening a change

- Keep changes focused and explain their hardware and firmware impact.
- Split work into independently reviewable, testable change units. State prerequisites and rollback boundaries; do not mix unrelated changes.
- Do not include credentials, private keys, machine-specific paths, generated PlatformIO output, or copied code with unknown provenance.
- Identify the exact board, hardware revision, framework, and feature configuration used for validation.
- Safety-sensitive changes to throttle, brake, PAS, speed limiting, FET control, watchdog, ADC, PWM, interrupts, or persistent data need explicit tests and a review of failure behavior.
- A compile success is not a motor-control safety qualification. Do not connect motor power for an unqualified build.

## Local checks

```powershell
python tools/source_contract_test.py
pio run -e nanoatmega328
pio run -e megaatmega2560
```

Report unrun checks and any warnings. STM32/ESP32 profiles are exploratory and currently fail because the firmware contains AVR-specific code.

## Rights and permission

Opening a pull request does not transfer copyright or grant SaGaLabs a license. Do not submit code unless you own it or can document permission and compatible terms. No contribution will be merged until the rights holder and contribution terms have been agreed in a separate written agreement. The repository's licensing status is under review; see [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Pull request checklist

- [ ] Scope and affected boards/features are described.
- [ ] Change is an independently reviewable unit with prerequisites and rollback noted.
- [ ] Source provenance and license are documented for new code/assets.
- [ ] Relevant source-contract tests and AVR builds pass, or failures are explained.
- [ ] Hardware and safety assumptions are listed; no unsupported target is presented as qualified.
- [ ] Documentation and compatibility status are updated.