# Change and Validation Rules

- Inspect relevant source, tests, project rules, and workbook entries before editing. Make the smallest coherent change and state the hypothesis it tests.
- Keep product code, generated files, and documentation changes distinguishable. Never edit `.pio/` output or generated local editor settings as project source.
- Before finalizing firmware changes, run `python tools/source_contract_test.py` and the applicable PlatformIO target(s). For supported-target changes, run both `pio run -e nanoatmega328` and `pio run -e megaatmega2560`.
- When changing fixed rules, skills, or AI adapters, run `python tools/validate_project_context.py`.
- For dependency/build configuration changes, verify a clean build with declared dependencies and no user-specific library path.
- Distinguish incremental and clean builds, compile-time assertions, host tests, simulations, and physical measurements. Record exact commands, environment, result, warnings, and memory usage when relevant.
- Update `docs/mcu-port-project-workbook.md` for new findings, status changes, tests, blockers, or safety assumptions. Open means not proven; do not promote status without evidence.
- Do not run the legacy `tools/compile_test.py` matrix unless its CMake/Arduino environment is available and the user's config restoration has been verified. The script must preserve the original `config.h` byte-for-byte and use isolated temporary build output.
- Do not hide, blanket-suppress, or misclassify warnings. Investigate the control flow and source of each warning before changing code.
- If a check cannot run, state the concrete reason and leave its status open.