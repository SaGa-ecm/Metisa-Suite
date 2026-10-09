# Changelog

Notable changes to metisa are recorded here. The inherited source baseline is Arduino Pedelec Controller v1.43; that historical version is not a metisa release.

## Unreleased

- Adopt the metisa product name by SaGaLabs while preserving upstream author notices.
- Add reproducible PlatformIO library dependencies and GitHub Actions builds for the existing Nano and Mega AVR targets.
- Add GitHub contribution, security, issue, and pull-request metadata.
- Add static source-contract checks for rollover-safe timing, EEPROM snapshot ordering, and temperature-disconnect fallback.
- Fix the inherited rollover-sensitive sensor and display deadlines, EEPROM comparison snapshot, and missing temperature fallback.
- STM32 and ESP32 firmware support remains blocked by AVR-specific source and is not claimed.
- Public distribution remains gated on third-party license and rights-chain review.