## Summary

Describe the change and why it is needed.

## Affected targets

- Board / MCU:
- FC hardware revision:
- Feature configuration:

## Validation

- [ ] `python tools/source_contract_test.py`
- [ ] `pio run -e nanoatmega328`
- [ ] `pio run -e megaatmega2560`
- [ ] Hardware checks are documented, or explicitly marked not run.
- [ ] Source provenance and license are documented for new code/assets.

## Safety impact

Describe changed behavior for reset, watchdog, throttle, brake, PAS, speed sensing, power-stage enable, and storage. State whether motor power remained disconnected during software tests.