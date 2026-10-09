# Safety and Hardware Rules

- A successful compile or source test is not electrical, motor-load, regulatory, or road-use qualification.
- Nano and Mega are the only targets currently buildable from the declared PlatformIO environments. STM32/ESP32 profiles remain exploratory until their AVR-specific blockers are ported and each concrete board is validated.
- Do not connect motor power during ordinary coding, build, or software-only tests. Powered tests require an isolated/current-limited fixture, a physical emergency stop, documented limits, and qualified supervision.
- Never invent or infer pin mappings, voltage tolerance, ADC reference/range, PWM routing/frequency, FET polarity, reset pulls, output neutral, or watchdog behavior. Require the exact MCU board, FC hardware revision, schematic, and relevant data sheets.
- Treat raw zero, configured `motor_offset`, and disabled power-stage enable as distinct states until the external motor controller's electrical behavior has been measured.
- Changes to throttle, brake, PAS, speed limiting, FET control, watchdog, ADC, PWM, interrupts, startup, shutdown, or persisted control state require explicit failure-state analysis and targeted validation.
- Consider reset, bootloader, brownout, watchdog reset, invalid/missing sensors, stuck signals, serial blocking, and interrupted persistence. Keep untested states marked open.
- Do not remove safety checks or change behavior just to silence warnings. Trace control flow and add a focused regression before changing it.
- Report observed behavior and inferred risk separately. Never claim safety based only on source inspection.