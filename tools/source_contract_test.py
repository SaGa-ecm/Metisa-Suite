#!/usr/bin/env python3
"""Static source-contract checks for safety-relevant fixes.

These checks verify production-code wiring and ordering. They do not emulate
EEPROM hardware or replace PlatformIO builds and board-level tests.
"""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
FIRMWARE = ROOT / "Arduino_Pedelec_Controller"


def extract_block(source, signature):
    start = source.index(signature)
    opening = source.index("{", start)
    depth = 0
    for index in range(opening, len(source)):
        if source[index] == "{":
            depth += 1
        elif source[index] == "}":
            depth -= 1
            if depth == 0:
                return source[opening + 1:index]
    raise AssertionError("Unclosed C++ block: " + signature)


class SourceContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.main = (FIRMWARE / "Arduino_Pedelec_Controller.ino").read_text(encoding="utf-8")
        cls.time_helpers = (FIRMWARE / "elapsed_time.h").read_text(encoding="utf-8")
        cls.display = (FIRMWARE / "display.cpp").read_text(encoding="utf-8")
        cls.backlight = (FIRMWARE / "display_backlight.cpp").read_text(encoding="utf-8")

    def test_sensor_debounce_uses_rollover_safe_elapsed_time(self):
        self.assertIn("elapsed_less(millis(), last_pas_event, 10U)", self.main)
        self.assertIn("elapsed_less(millis(), last_wheel_time, 50U)", self.main)
        self.assertIn(
            "static_cast<uint32_t>(now - previous) < interval",
            self.time_helpers,
        )
        self.assertIn("static_assert(!elapsed_less(1000U, 4294966296UL, 50U)", self.time_helpers)
        self.assertIn("static_assert(elapsed_less(20U, 0xFFFFFFF0UL, 50U)", self.time_helpers)

    def test_display_deadlines_use_rollover_safe_comparisons(self):
        self.assertIn("!deadline_reached(millis(), show_important_info_until)", self.display)
        self.assertIn("deadline_passed(millis(), menu_activity_expire)", self.display)
        self.assertIn("!deadline_reached(millis(), backlight_next_event_ms)", self.backlight)
        self.assertIn("static_assert(!deadline_reached(0xFFFFFFF0UL, 0x00000010UL)", self.time_helpers)
        self.assertIn("static_assert(deadline_reached(0x00000010UL, 0xFFFFFFF0UL)", self.time_helpers)

    def test_eeprom_comparison_snapshot_advances_after_write_loop(self):
        save_body = extract_block(self.main, "void save_eeprom()\n{")
        loop_start = save_body.index("for (i = 0; i < sizeof(variable_new); i++)")
        loop_open = save_body.index("{", loop_start)
        loop = extract_block(save_body, save_body[loop_start:loop_open].strip())
        loop_end = loop_start + save_body[loop_start:].index("}") + 1
        snapshot_update = save_body.index("variable = variable_new;")

        self.assertIn("EEPROM.write(i, *(p_new++))", loop)
        self.assertGreater(snapshot_update, loop_end)

    def test_unknown_temperature_family_returns_disconnect_sentinel(self):
        temperature_source = (FIRMWARE / "DallasTemp.cpp").read_text(encoding="utf-8")
        calculation = extract_block(
            temperature_source,
            "float DallasTemperature::calculateTemperature(",
        )
        self.assertTrue(calculation.rstrip().endswith("return DEVICE_DISCONNECTED;"))


if __name__ == "__main__":
    unittest.main(verbosity=2)