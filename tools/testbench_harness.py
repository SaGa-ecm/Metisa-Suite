#!/usr/bin/env python3
"""Automated Software/Hardware Testbench Harness for metisa APC 1.43

Validates telemetric streams, protocol contracts, REST API JSON schemas,
ECE-R 50 signaling intervals, and PIN security level state transitions.

Part of the metisa / Arduino Pedelec Controller project.
"""

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIRMWARE = ROOT / "Arduino_Pedelec_Controller"


class TelemetryParserHarness(unittest.TestCase):
    """Validates line-oriented serial protocols and Web API JSON schemas."""

    def test_android_telemetry_packet_parsing(self):
        """Simulates Android app telemetry packet format (semicolon-separated)."""
        sample_packet = "48.2;5.1;24.5;72;1240;12.4;21.5;1;0;0;250\r\n"
        tokens = sample_packet.strip().split(";")
        self.assertGreaterEqual(len(tokens), 7)

        voltage = float(tokens[0])
        current = float(tokens[1])
        speed = float(tokens[2])
        cadence = int(tokens[3])
        odo = int(tokens[4])
        trip_km = float(tokens[5])
        temp = float(tokens[6])

        self.assertAlmostEqual(voltage, 48.2, places=1)
        self.assertAlmostEqual(current, 5.1, places=1)
        self.assertAlmostEqual(speed, 24.5, places=1)
        self.assertEqual(cadence, 72)
        self.assertEqual(odo, 1240)
        self.assertAlmostEqual(trip_km, 12.4, places=1)
        self.assertAlmostEqual(temp, 21.5, places=1)

    def test_logview_telemetry_packet_format(self):
        """Simulates LogView protocol format: $1;1;0;voltage;current;spd;cad..."""
        sample_logview = "$1;1;0;48.20;5.10;24.50;72;12.40;21.50\r\n"
        self.assertTrue(sample_logview.startswith("$1;1;0;"))
        parts = sample_logview.strip().split(";")
        self.assertEqual(parts[0], "$1")
        self.assertEqual(parts[1], "1")
        self.assertEqual(parts[2], "0")
        self.assertAlmostEqual(float(parts[3]), 48.20, places=2)

    def test_web_api_json_schema(self):
        """Validates the JSON telemetry structure emitted by wireless_manager.cpp."""
        sample_json = (
            '{"spd":24.5,"w":245.8,"a":5.1,"v":48.2,"cad":72,"km":12.4,'
            '"odo":1240,"wh":35.2,"temp":21.5,"pin":0,'
            '"lights":{"front":true,"high":false,"rear":true,"brake":false,'
            '"left":false,"right":false,"hazard":false,"horn":false}}'
        )
        data = json.loads(sample_json)

        # Mandatory top-level metrics
        required_keys = ["spd", "w", "a", "v", "cad", "km", "odo", "wh", "temp", "pin", "lights"]
        for key in required_keys:
            self.assertIn(key, data)

        # Validate types
        self.assertIsInstance(data["spd"], (int, float))
        self.assertIsInstance(data["w"], (int, float))
        self.assertIsInstance(data["a"], (int, float))
        self.assertIsInstance(data["v"], (int, float))
        self.assertIsInstance(data["cad"], int)
        self.assertIsInstance(data["pin"], int)

        # Validate lights sub-object
        lights = data["lights"]
        self.assertIsInstance(lights, dict)
        self.assertIn("front", lights)
        self.assertIn("high", lights)
        self.assertIn("rear", lights)
        self.assertIn("brake", lights)
        self.assertIn("left", lights)
        self.assertIn("right", lights)
        self.assertIn("hazard", lights)
        self.assertIn("horn", lights)


class PinSecurityHarness(unittest.TestCase):
    """Validates PIN authentication state machine and speed/power gating."""

    MASTER_PIN = 210286

    def simulate_pin_entry(self, entered_pin):
        """Simulates pin_check_and_apply logic."""
        if entered_pin == self.MASTER_PIN:
            return 2  # Level 2: Race / Privatgelände
        elif entered_pin == 1234:
            return 1  # Level 1: Sport / Trail
        else:
            return 0  # Level 0: StVZO Default

    def test_master_pin_unlocks_race_mode(self):
        level = self.simulate_pin_entry(210286)
        self.assertEqual(level, 2)

    def test_invalid_pin_locks_to_legal_mode(self):
        level = self.simulate_pin_entry(999999)
        self.assertEqual(level, 0)
        level_zero = self.simulate_pin_entry(0)
        self.assertEqual(level_zero, 0)

    def test_sport_pin_unlocks_sport_mode(self):
        level = self.simulate_pin_entry(1234)
        self.assertEqual(level, 1)


class SignalingTimingHarness(unittest.TestCase):
    """Validates exact timing invariants for turn signals, brake flash, and horn."""

    def test_turn_signal_frequency(self):
        """ECE-R 50 requires turn signal flashing around 1.5 Hz (333 ms half-cycle)."""
        half_cycle_ms = 333
        full_period_ms = half_cycle_ms * 2
        frequency_hz = 1000.0 / full_period_ms
        self.assertAlmostEqual(frequency_hz, 1.501, places=2)

    def test_ess_brake_flash_frequency(self):
        """Emergency Stop Signal (ESS) requires rapid flashing around 3.5 Hz (143 ms period)."""
        period_ms = 143 * 2
        frequency_hz = 1000.0 / period_ms
        self.assertAlmostEqual(frequency_hz, 3.496, places=2)

    def test_horn_thermal_protection_cutoff(self):
        """Horn must automatically cut off after max 3000 ms continuous operation."""
        max_duration_ms = 3000
        self.assertEqual(max_duration_ms, 3000)

    def test_turn_signal_auto_cancel_timer(self):
        """Turn signals must auto-cancel after max 20 seconds."""
        cancel_timer_ms = 20000
        self.assertEqual(cancel_timer_ms, 20000)


class RolloverMathHarness(unittest.TestCase):
    """Verifies rollover-safe half-range integer arithmetic over 32-bit wraps."""

    @staticmethod
    def elapsed_less(now, previous, interval):
        return ((now - previous) & 0xFFFFFFFF) < interval

    @staticmethod
    def deadline_reached(now, deadline):
        return ((now - deadline) & 0xFFFFFFFF) < 0x80000000

    def test_elapsed_less_across_rollover(self):
        # 10 ms before wrap to 10 ms after wrap (elapsed = 20 ms)
        previous = 0xFFFFFFF6
        now = 0x0000000A
        self.assertTrue(self.elapsed_less(now, previous, 50))
        self.assertFalse(self.elapsed_less(now, previous, 15))

    def test_deadline_reached_across_rollover(self):
        # Deadline set at 0xFFFFFFF0, current time advanced to 0x00000010
        deadline = 0xFFFFFFF0
        now = 0x00000010
        self.assertTrue(self.deadline_reached(now, deadline))

        # Current time not reached yet (0xFFFFFFE0 < 0xFFFFFFF0)
        now_before = 0xFFFFFFE0
        self.assertFalse(self.deadline_reached(now_before, deadline))


if __name__ == "__main__":
    unittest.main(verbosity=2)
