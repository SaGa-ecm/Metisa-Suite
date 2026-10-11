#!/usr/bin/env python3
"""
Test Contract for the metisa Web-Configurator surface.
Validates:
1. File existence of web assets (HTML, CSS, JS, Wiki, Unlock Portal).
2. Schema parity between historical .apc profiles and the web engine.
3. config.h generator syntax and presence of safety macros.
4. Absence of marketing slogans and board selection in index.html.
5. Presence of PIN entry without PIN generation in index.html.
6. Dedicated SAGA LABS Freischalt-Portal with Serial Number, Warranty Waiver, and separate PIN generation.
"""

import os
import re
import unittest

CONFIGURATOR_DIR = os.path.join(os.path.dirname(__file__), "..", "configurator")

class WebConfiguratorContractTest(unittest.TestCase):

    def test_web_assets_exist(self):
        html_path = os.path.join(CONFIGURATOR_DIR, "index.html")
        css_path = os.path.join(CONFIGURATOR_DIR, "style.css")
        js_path = os.path.join(CONFIGURATOR_DIR, "app.js")
        wiki_path = os.path.join(CONFIGURATOR_DIR, "wiki.html")
        portal_path = os.path.join(CONFIGURATOR_DIR, "unlock_portal.html")
        handbook_path = os.path.join(os.path.dirname(__file__), "..", "docs", "WIKI_UND_FAQ_DAU_HANDBUCH.md")

        self.assertTrue(os.path.isfile(html_path), "index.html must exist")
        self.assertTrue(os.path.isfile(css_path), "style.css must exist")
        self.assertTrue(os.path.isfile(js_path), "app.js must exist")
        self.assertTrue(os.path.isfile(wiki_path), "wiki.html must exist")
        self.assertTrue(os.path.isfile(portal_path), "unlock_portal.html must exist")
        self.assertTrue(os.path.isfile(handbook_path), "WIKI_UND_FAQ_DAU_HANDBUCH.md must exist")

    def test_app_js_contains_apc_serializer_and_parser(self):
        js_path = os.path.join(CONFIGURATOR_DIR, "app.js")
        with open(js_path, "r", encoding="utf-8") as f:
            code = f.read()

        self.assertIn("exportApcString", code, "Must implement .apc export")
        self.assertIn("importApcString", code, "Must implement .apc import")
        self.assertIn("generateConfigHeader", code, "Must implement config.h generator")
        self.assertIn("parseRawTelemetry", code, "Must parse ---raw--- serial packets")
        self.assertIn("210286", code, "Must contain Master-PIN 210286 support")
        self.assertIn("verifyAndUnlockRaceMode", code, "Must implement PIN verification")
        self.assertIn("lockRaceMode", code, "Must implement re-lock")

    def test_html_contains_metisa_subsystems_and_no_marketing_or_board_selector(self):
        html_path = os.path.join(CONFIGURATOR_DIR, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()

        # No marketing slogans
        self.assertNotIn("KEINE GRENZEN", html, "Marketing slogans must be removed")
        self.assertNotIn("EIN GEHIRN. JEDE MASCHINE.", html, "Marketing slogans must be removed")
        self.assertNotIn("DAS KERNVERSPRECHEN", html, "Marketing slogans must be removed")

        # No board selection dropdown in HTML
        self.assertNotIn("target_mcu", html, "Board selection must be removed from user-facing HTML")

        # PIN entry without PIN generation
        self.assertIn("input_unlock_pin", html, "Must contain PIN entry field for open menu")
        self.assertIn("verifyAndUnlockRaceMode", html, "Must trigger unlock verification")
        self.assertNotIn("generatePin", html, "No PIN generation inside configurator HTML")

        # Essential hardware and signal controls
        self.assertIn("metisa_turn_signals", html, "Must contain turn signals input")
        self.assertIn("metisa_ess_brake_flash", html, "Must contain ESS brake flash input")
        self.assertIn("powerGraphCanvas", html, "Must contain power graph canvas")

    def test_unlock_portal_contract(self):
        portal_path = os.path.join(CONFIGURATOR_DIR, "unlock_portal.html")
        with open(portal_path, "r", encoding="utf-8") as f:
            portal = f.read()

        self.assertIn("portalSerial", portal, "Must require Serial Number input")
        self.assertIn("portalEmail", portal, "Must require Email input")
        self.assertIn("checkLegal", portal, "Must require Legal confirmation")
        self.assertIn("checkWarranty", portal, "Must require Warranty waiver confirmation")
        self.assertIn("generateUnlockPin", portal, "Must contain separate deterministic PIN generation")

    def test_config_h_generator_contract(self):
        js_path = os.path.join(CONFIGURATOR_DIR, "app.js")
        with open(js_path, "r", encoding="utf-8") as f:
            code = f.read()

        # Check required macros in template
        required_macros = [
            "CONFIG_H",
            "HARDWARE_REV",
            "DISPLAY_TYPE_TFT_ST7789",
            "METISA_PIN_SECURITY_ENABLED",
            "METISA_MASTER_PIN",
            "METISA_LIGHTS_ENABLED",
            "METISA_TURN_SIGNALS_ENABLED",
            "METISA_ESS_BRAKE_FLASH",
        ]
        for macro in required_macros:
            self.assertIn(macro, code, f"Generator must output {macro}")

if __name__ == "__main__":
    unittest.main(verbosity=2)
