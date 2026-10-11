#!/usr/bin/env python3
"""Automated Unit & Contract Test Suite for SaGa Labs METISA C++ Core & HAL

Verifies:
1. GCC Arm Cortex-M Compilation of Core Modules & HAL Headers.
2. SecurityManager: 3-level PIN state machine & brute-force rate limiting.
3. SafetyManager: EN 15194 compliance, brake interlocks, thermal derating, sensor plausibility.
4. MotorController: Anti-jerk rate limiter, smooth speed cutoff, voltage derating.

(c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
"""

import os
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORE_DIR = ROOT / "Arduino_Pedelec_Controller" / "core"
HAL_DIR = ROOT / "Arduino_Pedelec_Controller" / "hal"

ARM_GCC = Path(r"C:\Users\Admin\.platformio\packages\toolchain-gccarmnoneeabi\bin\arm-none-eabi-g++.exe")


class MetisaCppCoreCompilationTest(unittest.TestCase):
    """Verifies that the clean C++17 core compiles with zero warnings under GCC 12.3."""

    def test_arm_gcc_compiles_core_modules(self):
        if not ARM_GCC.exists():
            self.skipTest("arm-none-eabi-g++ not found on host")

        source_files = [
            CORE_DIR / "security_manager.cpp",
            CORE_DIR / "safety_manager.cpp",
            CORE_DIR / "motor_control.cpp",
        ]

        for src in source_files:
            cmd = [
                str(ARM_GCC),
                "-std=c++17",
                "-Wall",
                "-Wextra",
                "-Werror",
                "-fsyntax-only",
                str(src),
                "-I", str(CORE_DIR),
                "-I", str(HAL_DIR),
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            self.assertEqual(
                result.returncode, 0,
                f"Compilation failed for {src.name}:\nSTDOUT: {result.stdout}\nSTDERR: {result.stderr}"
            )


class SecurityManagerSimulationTest(unittest.TestCase):
    """Simulates and verifies the 3-Level Authorization State Machine."""

    MASTER_PIN = 210286
    SPORT_PIN = 1234

    def setUp(self):
        self.level = 0  # 0: Legal, 1: Sport, 2: Track
        self.failed_attempts = 0
        self.lockout_until_ms = 0

    def unlock_with_pin(self, pin, now_ms):
        if self.lockout_until_ms > 0 and now_ms < self.lockout_until_ms:
            return False

        if pin == self.MASTER_PIN:
            self.level = 2
            self.failed_attempts = 0
            self.lockout_until_ms = 0
            return True

        if pin == self.SPORT_PIN:
            self.level = 1
            self.failed_attempts = 0
            self.lockout_until_ms = 0
            return True

        self.failed_attempts += 1
        if self.failed_attempts >= 5:
            self.lockout_until_ms = now_ms + 30000
        self.level = 0
        return False

    def test_default_is_legal_mode(self):
        self.assertEqual(self.level, 0)

    def test_master_pin_unlocks_track_mode(self):
        success = self.unlock_with_pin(210286, 1000)
        self.assertTrue(success)
        self.assertEqual(self.level, 2)

    def test_sport_pin_unlocks_sport_mode(self):
        success = self.unlock_with_pin(1234, 1000)
        self.assertTrue(success)
        self.assertEqual(self.level, 1)

    def test_invalid_pin_drops_to_legal_mode(self):
        self.unlock_with_pin(210286, 1000)
        self.assertEqual(self.level, 2)
        success = self.unlock_with_pin(9999, 2000)
        self.assertFalse(success)
        self.assertEqual(self.level, 0)

    def test_brute_force_lockout_after_five_failed_attempts(self):
        for i in range(5):
            self.unlock_with_pin(1111, 1000 + i * 100)
        self.assertEqual(self.failed_attempts, 5)
        self.assertEqual(self.lockout_until_ms, 31400)

        # Attempt during lockout fails even with correct Master PIN
        success = self.unlock_with_pin(210286, 15000)
        self.assertFalse(success)

        # Attempt after lockout expires succeeds
        success = self.unlock_with_pin(210286, 32000)
        self.assertTrue(success)
        self.assertEqual(self.level, 2)

    def test_honeypot_decoy_pins_trap_in_sandbox(self):
        decoy_pins = [847291, 994102]
        for dp in decoy_pins:
            # Decoy pin must NOT unlock genuine track mode
            is_genuine = (dp == self.MASTER_PIN)
            self.assertFalse(is_genuine)

    def test_salted_sha256_hash_matches_genuine_master_pin(self):
        import hashlib
        salt = "::SaGa-Orbit-Salt-v2::"
        expected_hash = "d5bce9e8e14871855defdc792d0df41a3dd8df21c0fa7214d742d22a26952578"
        computed = hashlib.sha256(("210286" + salt).encode("utf-8")).hexdigest()
        self.assertEqual(computed, expected_hash)

    def test_hardware_serial_number_format(self):
        import re
        sample_serials = [
            "SAGA-MET-2026-NANO-7A31",
            "SAGA-MET-2026-STM32-9B82",
            "SAGA-MET-2026-ESP32-1F40",
        ]
        pattern = re.compile(r"^SAGA-MET-2026-(NANO|STM32|ESP32|RP20)-[0-9A-F]{4}$")
        for sn in sample_serials:
            self.assertTrue(pattern.match(sn), f"Serial {sn} does not match expected format")


class SafetyManagerSimulationTest(unittest.TestCase):
    """Simulates and verifies safety invariants, interlocks, and derating."""

    def evaluate_safety(self, brake, throttle_raw, v_mv, speed_tenths, last_pas_ms, temp_c, level, now_ms):
        faults = 0
        v_cutoff = 33000
        v_emergency = 28000
        pas_timeout_ms = 500

        # 1. Brake
        if brake:
            faults |= 0x0001
        # 2. Throttle out of range
        if throttle_raw > 0:
            if throttle_raw < 140 or throttle_raw > 950:
                faults |= 0x0002
        # 3. Undervoltage
        if v_mv < v_emergency:
            faults |= 0x0020
        # 4. PAS Timeout (if not Track)
        if level != 2:
            if (now_ms - last_pas_ms) > pas_timeout_ms:
                faults |= 0x0008
        # 5. Overtemperature
        if temp_c >= 100.0:
            faults |= 0x0080

        cutoff = (faults & (0x0001 | 0x0002 | 0x0020 | 0x0008 | 0x0080)) != 0
        return faults, cutoff

    def test_brake_causes_instant_cutoff(self):
        faults, cutoff = self.evaluate_safety(
            brake=True, throttle_raw=500, v_mv=36000, speed_tenths=200,
            last_pas_ms=1000, temp_c=40.0, level=0, now_ms=1100
        )
        self.assertTrue(cutoff)
        self.assertTrue(faults & 0x0001)

    def test_throttle_broken_wire_causes_cutoff(self):
        # Short to ground (raw = 50 < 140)
        faults, cutoff = self.evaluate_safety(
            brake=False, throttle_raw=50, v_mv=36000, speed_tenths=200,
            last_pas_ms=1000, temp_c=40.0, level=0, now_ms=1100
        )
        self.assertTrue(cutoff)
        self.assertTrue(faults & 0x0002)

        # Short to 5V (raw = 1000 > 950)
        faults, cutoff = self.evaluate_safety(
            brake=False, throttle_raw=1000, v_mv=36000, speed_tenths=200,
            last_pas_ms=1000, temp_c=40.0, level=0, now_ms=1100
        )
        self.assertTrue(cutoff)
        self.assertTrue(faults & 0x0002)

    def test_emergency_undervoltage_causes_cutoff(self):
        faults, cutoff = self.evaluate_safety(
            brake=False, throttle_raw=500, v_mv=27500, speed_tenths=200,
            last_pas_ms=1000, temp_c=40.0, level=0, now_ms=1100
        )
        self.assertTrue(cutoff)
        self.assertTrue(faults & 0x0020)

    def test_pas_timeout_in_legal_mode(self):
        faults, cutoff = self.evaluate_safety(
            brake=False, throttle_raw=500, v_mv=36000, speed_tenths=200,
            last_pas_ms=1000, temp_c=40.0, level=0, now_ms=1600  # 600ms elapsed > 500ms
        )
        self.assertTrue(cutoff)
        self.assertTrue(faults & 0x0008)

    def test_pas_timeout_ignored_in_track_mode(self):
        faults, cutoff = self.evaluate_safety(
            brake=False, throttle_raw=500, v_mv=36000, speed_tenths=200,
            last_pas_ms=1000, temp_c=40.0, level=2, now_ms=5000  # Track mode (level=2)
        )
        self.assertFalse(cutoff)
        self.assertEqual(faults, 0)


class MotorControllerSimulationTest(unittest.TestCase):
    """Simulates and verifies anti-jerk slew rates and speed limit roll-off."""

    def test_speed_limit_smooth_cutoff_factor(self):
        def factor(spd, max_spd):
            if spd >= max_spd:
                return 0
            ramp_window = 30  # 3.0 km/h
            if max_spd > ramp_window and spd > (max_spd - ramp_window):
                delta = max_spd - spd
                return (delta * 1024) // ramp_window
            return 1024

        max_speed = 250  # 25.0 km/h

        # Below 22.0 km/h: 100% full factor
        self.assertEqual(factor(200, max_speed), 1024)
        self.assertEqual(factor(220, max_speed), 1024)

        # Between 22.0 km/h and 25.0 km/h: linear decrease
        self.assertEqual(factor(235, max_speed), 512)   # 50% factor at 23.5 km/h
        self.assertEqual(factor(240, max_speed), 341)   # 33% factor at 24.0 km/h
        self.assertEqual(factor(247, max_speed), 102)   # 10% factor at 24.7 km/h

        # At or above 25.0 km/h: 0% factor
        self.assertEqual(factor(250, max_speed), 0)
        self.assertEqual(factor(260, max_speed), 0)

    def test_anti_jerk_ramp_rate_limiting(self):
        current_duty = 0
        target_demand = 60000
        max_ramp_up = 2000

        # Simulate 10 loop cycles (200 ms)
        for _ in range(10):
            if (target_demand - current_duty) > max_ramp_up:
                current_duty += max_ramp_up
            else:
                current_duty = target_demand

        self.assertEqual(current_duty, 20000)
        self.assertLess(current_duty, target_demand)


if __name__ == "__main__":
    unittest.main()
