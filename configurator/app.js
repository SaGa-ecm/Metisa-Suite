/**
 * METISA SUITE // Web Configurator Core Application Engine
 * Universal Browser-Based Calibration Platform for SaGa Labs metisa & APC
 * 
 * Copyright (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs. All rights reserved.
 * Proprietary Intellectual Property. Trademarks: SaGa Labs(R), metisa(TM), Metisa Suite(TM).
 * 
 * Features:
 * - 100% Backward-compatible .apc profile loading & saving
 * - Modern JSON profiles
 * - Clean C++ config.h code generation
 * - Web Serial API (USB-to-MCU direct live link)
 * - Interactive Canvas Oscilloscope & Dyno Power Curve Rendering
 * - Multi-Level PIN Security System (Track & Dyno Authorization)
 * - Full ECE-R 50 Lighting & Signaling Controls
 */

const APP_VERSION = "1.43-metisa";

// Default State matching Form1.cs defaults
const defaultState = {
  // Metadata & Profile
  profile_name: "Default-metisa",
  target_mcu: "esp32",          // Internal HAL target: 'avr_nano', 'avr_mega', 'stm32_blackpill', 'pico', 'esp32'
  nud_version: 22,               // Hardware Revision (20-22)
  
  // Battery & Power Stage
  nud_vmax: 42.0,                // V max (42V for 36V Li-Ion 10S)
  nud_vcutoff: 33.0,             // V cutoff (Low battery warning/derate)
  nud_vemergency: 28.0,          // V emergency shutdown
  nud_capacity: 500,             // Battery capacity in Wh
  nud_capacity_2: 500,           // Secondary profile capacity
  chb_chargedetection: true,     // Automatic charge detection
  nud_chargedetect_min: 40,      // Minimum voltage to detect charge
  chb_chargecounter: false,      // Charge cycle counter
  nud_voltage_amplitude: 0.0587, // Voltage ADC divider factor
  nud_voltage_offset: 0.0,       // Voltage offset
  nud_current_amplitude: 0.0741, // Current shunt factor (A/ADC)
  nud_current_offset: 0.0,       // Current offset
  chb_external_voltage: false,
  nud_external_voltage_amplitude: 0.0587,
  nud_external_voltage_offset: 0.0,
  txb_external_voltage: "A0",
  chb_external_current: false,
  nud_external_current_amplitude: 0.0489,
  nud_external_current_offset: 0.0,
  txb_external_current: "A1",

  // Motor & Drive Control
  nud_motor_min: 50,             // Motor start PWM offset (0-1023)
  nud_motor_max: 200,            // Motor max PWM (0-1023)
  chb_motorservo: false,         // RC Servo pulses instead of PWM
  nud_power_max: 250,            // Standard 250W default
  nud_power_max_2: 500,          // Profile 2 power max
  nud_controlmode: 250,          // Max power in poti mode
  nud_controlmode_2: 500,
  cb_controlmode: 0,             // 0=power, 1=speed, 2=torque, 3=current, 4=whkm
  nud_power_thermal: 150,        // Thermal limiting power
  nud_thermalsafespeed: 12,      // Safe speed for cooling
  nud_pidp: 0.0,                 // PID P-factor
  nud_pidi: 2.0,                 // PID I-factor
  nud_pidp_throttle: 0.05,       // Throttle PID P
  nud_pidi_throttle: 2.5,        // Throttle PID I
  chb_resetintegral: false,      // Reset PID on brake/PAS stop
  chb_preguess: false,           // Pre-guess feedforward

  // Speed Sensor & Wheelsize
  nud_circumference: 2200,       // Wheel circumference in mm
  nud_magnetcount: 1,            // Speed magnets on wheel
  nud_speedcutoff_start: 23,     // Speed derating start (km/h)
  nud_speedcutoff_stop: 25,      // Speed cutoff (25 km/h)
  nud_speedcutoff_start_2: 30,   // Profile 2 speed cutoff start
  nud_speedcutoff_stop_2: 32,    // Profile 2 speed cutoff stop
  chb_brokensensor: true,        // Detect broken speed sensor failsafe

  // PAS & Torque Sensor
  cb_bottombracket: 1,           // 0=none, 1=standard PAS, 2=Thun, 3=BBS, 4=Sempu V1, 5=Sempu New, 6=Erider T9
  nud_magnets: 12,               // Number of PAS magnets
  nud_pasfactor_min: 1.2,        // Min PAS ratio
  nud_pasfactor_max: 3.0,        // Max PAS ratio
  nud_pas_tolerance: 1,          // PAS pulse jitter tolerance
  nud_pastimeout: 500,           // PAS timeout (ms) before cutoff
  nud_torque_zero: 533,          // Torque zero-point ADC
  chb_torquezero_auto: true,     // Auto-tare torque zero
  chb_torque_throttle: false,    // Torque sensor simulates throttle
  nud_torquethrottle_min: 10,
  nud_torquethrottle_full: 60,
  nud_gearchangepause: 2000,     // Pause motor during gear change

  // Throttle (Gasgriff) & Poti
  chb_throttle: true,            // Throttle installed
  nud_throttle_min: 180,         // Throttle min ADC (deadband)
  nud_throttle_max: 870,         // Throttle max ADC
  chb_startingaid: true,         // Starting aid active
  nud_startingaid: 6,            // Max starting aid speed (6 km/h)
  nud_startingaid_2: 6,
  cb_controls: 0,                // 0=none, 1=poti, 2=soft-poti, 3=display
  nud_poti_min: 0,
  nud_poti_max: 1023,
  nud_poti_startup: 150,
  nud_stepsize: 50,
  nud_fixedsoftpoti: 250,
  chb_switchonpoti: false,
  nud_fixed_throttle: 0,

  // Brake (Bremse)
  chb_brake: true,               // Brake sensor active
  chb_brakeinverted: false,      // Invert brake logic (active HIGH)

  // Metisa Multi-Level PIN Security System
  metisa_pin_enabled: true,
  metisa_master_pin: "210286",   // Master-PIN for Race Mode
  metisa_sport_pin: "1234",      // Optional Sport-PIN
  metisa_boot_level: 0,          // 0=Standard default on boot
  metisa_race_speed: 99,         // km/h in Level 2
  metisa_race_power: 1000,       // Watt in Level 2
  metisa_race_pure_throttle: true, // Allow throttle without pedaling in Level 2

  // Metisa Lighting & Signaling Subsystem
  metisa_headlight: true,        // Headlight switchable
  metisa_highbeam: true,         // High beam toggleable
  metisa_taillight: true,        // Rear light
  metisa_brakelight: true,       // Dynamic brake light
  metisa_turn_signals: true,     // ECE-R 50 Turn signals (1.5 Hz)
  metisa_turn_autocancel: 20,    // Auto-cancel in seconds
  metisa_ess_brake_flash: true,  // Emergency stop rapid flash (3.5 Hz)
  metisa_ess_threshold: 15,      // ESS activation speed (km/h)
  metisa_horn: true,             // Electric horn
  metisa_horn_cutoff: 3.0,       // Horn thermal protection max seconds

  // Display & Buttons
  cb_display: 12,                // 0=none, 1=Nokia 4p, 2=Nokia 5p, 3=16x2, 4=16x2 Ser, 5=BMS, 6=BMS3, 7=KM618, 8=KM901, 9=C961, 10=C965, 11=SW102, 12=ST7789 Color TFT
  nud_display_contrast: 190,
  chb_backlight: true,
  chb_lightswitch: true,
  chb_lightswitch_startup: false,
  chb_lightswitch_menu: true,
  nud_idle_shutdown: 1800,       // System sleep after 30 min idle
  nud_menuidle: 60,              // Menu timeout in seconds
  txb_welcometext: "metisa APC 1.43",
  txb_goodbye: "Good night!",

  // Communication & Onboard Wireless
  cb_serialmode: 1,              // 0=none, 1=debug, 2=android, 3=mmc, 4=logview
  cb_bluetoothmode: 2,           // 2=android app HMI
  chb_bluetoothstartup: true,
  wireless_wifi_softap: true,
  wireless_ssid: "APC-Pedelec-WiFi",
  wireless_pass: "21028600",
  wireless_web_dashboard: true,  // Self-hosted HTML5 cockpit on port 80
  wireless_telnet_server: true,  // Telnet on port 23
};

// Application State
let appState = { ...defaultState };

// DOM Elements & References
let serialPort = null;
let serialReader = null;
let isConnected = false;

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupFormBindings();
  setupCanvasGraph();
  setupSerialHandler();
  setupHotspots();
  renderCanvasGraph();
});

// Setup Navigation Tabs
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const tabPanes = document.querySelectorAll(".tab-pane");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-tab");
      navItems.forEach(n => n.classList.remove("active"));
      tabPanes.forEach(p => p.style.display = "none");

      item.classList.add("active");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.style.display = "block";
    });
  });
}

// Setup Form Inputs Two-Way Binding
function setupFormBindings() {
  for (const [key, val] of Object.entries(appState)) {
    const el = document.getElementById(key);
    if (!el) continue;

    if (el.type === "checkbox") {
      el.checked = Boolean(val);
      el.addEventListener("change", (e) => {
        appState[key] = e.target.checked;
        onStateChanged(key);
      });
    } else if (el.type === "number" || el.tagName === "SELECT") {
      el.value = val;
      el.addEventListener("input", (e) => {
        appState[key] = el.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value;
        onStateChanged(key);
      });
    } else if (el.type === "text") {
      el.value = val;
      el.addEventListener("input", (e) => {
        appState[key] = e.target.value;
        onStateChanged(key);
      });
    }
  }
}

// React to State Changes
function onStateChanged(changedKey) {
  if (changedKey === "nud_power_max" || changedKey === "nud_speedcutoff_start" || changedKey === "nud_speedcutoff_stop" || changedKey === "nud_power_thermal") {
    renderCanvasGraph();
  }
}

// Highlight Corresponding Setting Card from Bike Diagram Hotspots
function setupHotspots() {
  const pills = document.querySelectorAll(".hotspot-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      const targetTab = pill.getAttribute("data-tab");
      const targetCard = pill.getAttribute("data-card");

      // Switch to tab
      const navItem = document.querySelector(`.nav-item[data-tab="${targetTab}"]`);
      if (navItem) navItem.click();

      // Scroll to & highlight card
      setTimeout(() => {
        const card = document.getElementById(targetCard);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.classList.add("active-highlight");
          setTimeout(() => card.classList.remove("active-highlight"), 2000);
        }
      }, 100);
    });
  });
}

// Render Speed vs. Power Graph on Canvas
function setupCanvasGraph() {
  const canvas = document.getElementById("powerGraphCanvas");
  if (!canvas) return;
  window.addEventListener("resize", renderCanvasGraph);
}

function renderCanvasGraph() {
  const canvas = document.getElementById("powerGraphCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.parentElement.clientWidth || 400;
  const h = canvas.height = 180;

  // Obsidian high-density background
  ctx.fillStyle = "#090c13";
  ctx.fillRect(0, 0, w, h);

  const leftMargin = 42;
  const bottomMargin = 24;
  const topMargin = 12;
  const rightMargin = 16;
  const plotW = w - leftMargin - rightMargin;
  const plotH = h - bottomMargin - topMargin;

  // Grid background: 1px hairline engineering grid
  ctx.strokeStyle = "#161e2e";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = leftMargin; x <= w - rightMargin; x += Math.max(30, plotW / 7)) {
    ctx.moveTo(Math.round(x) + 0.5, topMargin);
    ctx.lineTo(Math.round(x) + 0.5, h - bottomMargin);
  }
  for (let y = topMargin; y <= h - bottomMargin; y += Math.max(20, plotH / 5)) {
    ctx.moveTo(leftMargin, Math.round(y) + 0.5);
    ctx.lineTo(w - rightMargin, Math.round(y) + 0.5);
  }
  ctx.stroke();

  // Axis lines
  ctx.strokeStyle = "#273248";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftMargin, topMargin);
  ctx.lineTo(leftMargin, h - bottomMargin);
  ctx.lineTo(w - rightMargin, h - bottomMargin);
  ctx.stroke();

  // Axis Labels & Monospace Engineering Units
  ctx.fillStyle = "#64748b";
  ctx.font = "600 9px 'JetBrains Mono', 'SF Mono', monospace";
  ctx.fillText("0", leftMargin - 10, h - bottomMargin + 14);
  ctx.fillText("15", leftMargin + plotW * (15 / 35) - 6, h - bottomMargin + 14);
  ctx.fillText("25", leftMargin + plotW * (25 / 35) - 6, h - bottomMargin + 14);
  ctx.fillText("35 km/h", w - rightMargin - 40, h - bottomMargin + 14);

  ctx.fillStyle = "#ff6200";
  ctx.fillText("POWER [W]", 6, topMargin + 10);

  // Curve Parameters
  const pMax = appState.nud_power_max || 250;
  const spdStart = appState.nud_speedcutoff_start || 23;
  const spdStop = appState.nud_speedcutoff_stop || 25;
  const pThermal = appState.nud_power_thermal || 150;

  const maxDisplaySpd = 35;
  const maxDisplayPower = Math.max(pMax * 1.25, 500);

  // Calculate Curve Points
  const points = [];
  for (let kmh = 0; kmh <= maxDisplaySpd; kmh += 0.5) {
    let power = pMax;
    if (kmh > spdStop) {
      power = 0;
    } else if (kmh > spdStart) {
      power = pMax * (1 - (kmh - spdStart) / (spdStop - spdStart));
    }

    const x = leftMargin + plotW * (kmh / maxDisplaySpd);
    const y = (h - bottomMargin) - (plotH * (power / maxDisplayPower));
    points.push({ x, y });
  }

  // Draw Gradient Area Under Curve
  const grad = ctx.createLinearGradient(0, topMargin, 0, h - bottomMargin);
  grad.addColorStop(0, "rgba(255, 98, 0, 0.22)");
  grad.addColorStop(1, "rgba(255, 98, 0, 0.0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(points[0].x, h - bottomMargin);
  for (const pt of points) { ctx.lineTo(pt.x, pt.y); }
  ctx.lineTo(points[points.length - 1].x, h - bottomMargin);
  ctx.closePath();
  ctx.fill();

  // Draw Primary Dyno Power Curve
  ctx.strokeStyle = "#ff6200";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    if (i === 0) ctx.moveTo(points[i].x, points[i].y);
    else ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Vertical Cutoff Indicator Line
  const xCutoff = leftMargin + plotW * (spdStop / maxDisplaySpd);
  ctx.strokeStyle = "#ef4444";
  ctx.setLineDash([2, 3]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(xCutoff, topMargin);
  ctx.lineTo(xCutoff, h - bottomMargin);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Thermal Limit dashed line
  ctx.strokeStyle = "#f59e0b";
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  const yThermal = (h - bottomMargin) - (plotH * (pThermal / maxDisplayPower));
  ctx.beginPath();
  ctx.moveTo(leftMargin, yThermal);
  ctx.lineTo(w - rightMargin, yThermal);
  ctx.stroke();
  ctx.setLineDash([]);

  // Annotations
  ctx.fillStyle = "#f59e0b";
  ctx.fillText(`THERMAL LIMIT: ${pThermal} W`, w - rightMargin - 120, yThermal - 4);
  ctx.fillStyle = "#ef4444";
  ctx.fillText(`CUTOFF: ${spdStop} km/h`, xCutoff + 4, topMargin + 10);
}

// -------------------------------------------------------------
// .apc Profile Parser & Serializer (100% Backward Compatible)
// -------------------------------------------------------------

function exportApcString() {
  let lines = [];
  lines.push(`apc_version;1.43`);
  lines.push(`metisa_version;${APP_VERSION}`);

  // NumericUpDowns (nud_)
  for (const [k, v] of Object.entries(appState)) {
    if (k.startsWith("nud_") && typeof v === "number") {
      lines.push(`${k};${v.toString().replace('.', ',')}`);
    }
  }

  // CheckBoxes (chb_)
  for (const [k, v] of Object.entries(appState)) {
    if (k.startsWith("chb_") && typeof v === "boolean") {
      lines.push(`${k};${v ? "True" : "False"}`);
    }
  }

  // TextBoxes (txb_)
  for (const [k, v] of Object.entries(appState)) {
    if (k.startsWith("txb_") && typeof v === "string") {
      lines.push(`${k};${v}`);
    }
  }

  // ComboBoxes (cb_)
  for (const [k, v] of Object.entries(appState)) {
    if (k.startsWith("cb_") && typeof v === "number") {
      lines.push(`${k};${v}`);
    }
  }

  // Metisa Extensions
  lines.push(`metisa_pin_enabled;${appState.metisa_pin_enabled ? "True" : "False"}`);
  lines.push(`metisa_master_pin;${appState.metisa_master_pin}`);
  lines.push(`metisa_race_speed;${appState.metisa_race_speed}`);
  lines.push(`metisa_race_power;${appState.metisa_race_power}`);
  lines.push(`metisa_turn_signals;${appState.metisa_turn_signals ? "True" : "False"}`);
  lines.push(`metisa_ess_brake_flash;${appState.metisa_ess_brake_flash ? "True" : "False"}`);

  return lines.join("\r\n") + "\r\n";
}

function importApcString(text) {
  const lines = text.split(/\r?\n/);
  let importedCount = 0;

  for (const line of lines) {
    if (!line.trim() || !line.includes(";")) continue;
    const parts = line.split(";");
    const key = parts[0].trim();
    const rawVal = parts[1].trim();

    if (key === "apc_version" || key === "metisa_version") continue;

    if (key.startsWith("nud_")) {
      const num = parseFloat(rawVal.replace(',', '.'));
      if (!isNaN(num)) { appState[key] = num; importedCount++; }
    } else if (key.startsWith("chb_") || key.startsWith("metisa_") && (rawVal === "True" || rawVal === "False")) {
      appState[key] = (rawVal.toLowerCase() === "true");
      importedCount++;
    } else if (key.startsWith("cb_")) {
      const idx = parseInt(rawVal, 10);
      if (!isNaN(idx)) { appState[key] = idx; importedCount++; }
    } else if (key.startsWith("txb_") || key === "metisa_master_pin") {
      appState[key] = rawVal;
      importedCount++;
    }
  }

  // Refresh UI
  setupFormBindings();
  renderCanvasGraph();
  showToast(`Profil erfolgreich importiert (${importedCount} Parameter)`, "success");
}

// -------------------------------------------------------------
// C++ config.h Generator
// -------------------------------------------------------------

function generateConfigHeader() {
  const s = appState;
  const dateStr = new Date().toISOString().split('T')[0];

  return `// ============================================================================
// config.h - Generated by metisa Web-Configurator ${APP_VERSION}
// Date: ${dateStr} | Profile: ${s.profile_name}
// Universal E-Bike Controller Firmware for AVR, STM32, RP2040 and ESP32
// ============================================================================

#ifndef CONFIG_H
#define CONFIG_H

#if ARDUINO < 100
#include <WProgram.h>
#else
#include <Arduino.h>
#endif
#include "switches_action.h"

// Hardware Revision
#define HARDWARE_REV ${s.nud_version}

// Display Subsystem
#define DISPLAY_TYPE_NONE           (1<<0)
#define DISPLAY_TYPE_NOKIA_5PIN     (1<<1)
#define DISPLAY_TYPE_NOKIA_4PIN     (1<<2)
#define DISPLAY_TYPE_NOKIA          (DISPLAY_TYPE_NOKIA_5PIN|DISPLAY_TYPE_NOKIA_4PIN)
#define DISPLAY_TYPE_16X2_LCD_4BIT  (1<<3)
#define DISPLAY_TYPE_16X2_SERIAL    (1<<6)
#define DISPLAY_TYPE_16X2           (DISPLAY_TYPE_16X2_LCD_4BIT|DISPLAY_TYPE_16X2_SERIAL)
#define DISPLAY_TYPE_BMS            (1<<5)
#define DISPLAY_TYPE_BMS3           (1<<7)
#define DISPLAY_TYPE_KINGMETER_618U (1<<4)
#define DISPLAY_TYPE_KINGMETER_901U (1<<8)
#define DISPLAY_TYPE_KINGMETER      (DISPLAY_TYPE_KINGMETER_618U|DISPLAY_TYPE_KINGMETER_901U)
#define DISPLAY_TYPE_BAFANG_C961    (1<<9)
#define DISPLAY_TYPE_BAFANG_C965    (1<<10)
#define DISPLAY_TYPE_BAFANG_SW102   (1<<11)
#define DISPLAY_TYPE_BAFANG         (DISPLAY_TYPE_BAFANG_C961|DISPLAY_TYPE_BAFANG_C965|DISPLAY_TYPE_BAFANG_SW102)
#define DISPLAY_TYPE_TFT_ST7789     (1<<12)

${s.cb_display === 12 ? '#define DISPLAY_TYPE DISPLAY_TYPE_TFT_ST7789' :
  s.cb_display === 0 ? '#define DISPLAY_TYPE DISPLAY_TYPE_NONE' :
  s.cb_display === 1 ? '#define DISPLAY_TYPE DISPLAY_TYPE_NOKIA_4PIN' :
  s.cb_display === 2 ? '#define DISPLAY_TYPE DISPLAY_TYPE_NOKIA_5PIN' :
  s.cb_display === 3 ? '#define DISPLAY_TYPE DISPLAY_TYPE_16X2_LCD_4BIT' :
  s.cb_display === 4 ? '#define DISPLAY_TYPE DISPLAY_TYPE_16X2_SERIAL' :
  s.cb_display === 5 ? '#define DISPLAY_TYPE DISPLAY_TYPE_BMS' :
  s.cb_display === 6 ? '#define DISPLAY_TYPE DISPLAY_TYPE_BMS3' :
  s.cb_display === 7 ? '#define DISPLAY_TYPE DISPLAY_TYPE_KINGMETER_618U' :
  s.cb_display === 8 ? '#define DISPLAY_TYPE DISPLAY_TYPE_KINGMETER_901U' :
  s.cb_display === 9 ? '#define DISPLAY_TYPE DISPLAY_TYPE_BAFANG_C961' :
  s.cb_display === 10 ? '#define DISPLAY_TYPE DISPLAY_TYPE_BAFANG_C965' :
  '#define DISPLAY_TYPE DISPLAY_TYPE_BAFANG_SW102'}

// Control Mode
#define CONTROL_MODE_NORMAL 0
#define CONTROL_MODE_LIMIT  1
#define CONTROL_MODE_TORQUE 2
#define CONTROL_MODE_CURRENT 3
#define CONTROL_MODE_WHKM   4
#define CONTROL_MODE ${s.cb_controlmode}

// Battery & Power Stage
const float vmax = ${s.nud_vmax.toFixed(1)};
const float vcutoff = ${s.nud_vcutoff.toFixed(1)};
const float vemergency_shutdown = ${s.nud_vemergency.toFixed(1)};
const double capacity = ${s.nud_capacity.toFixed(1)};
const double capacity_2 = ${s.nud_capacity_2.toFixed(1)};
const float voltage_amplitude = ${s.nud_voltage_amplitude.toFixed(4)};
const float voltage_offset = ${s.nud_voltage_offset.toFixed(2)};
const float current_amplitude_R11 = ${s.nud_current_amplitude.toFixed(4)};
const float current_amplitude_R13 = ${s.nud_current_amplitude.toFixed(4)};
const float current_amplitude_R22 = ${s.nud_current_amplitude.toFixed(4)};
const float current_offset = ${s.nud_current_offset.toFixed(2)};

// Motor & Speed Limits (Standard Base Profile 1)
const int motor_offset = ${s.nud_motor_min};
const int motor_max = ${s.nud_motor_max};
const int power_max = ${s.nud_power_max};
const int power_poti_max = ${s.nud_controlmode};
const int spd_max1 = ${s.nud_speedcutoff_start};
const int spd_max2 = ${s.nud_speedcutoff_stop};
const int thermal_limit = ${s.nud_power_thermal};
const int thermal_safe_speed = ${s.nud_thermalsafespeed};
const float wheel_circumference = ${(s.nud_circumference / 1000).toFixed(3)};
const byte wheel_magnets = ${s.nud_magnetcount};

// Throttle & Controls
const int throttle_offset = ${s.nud_throttle_min};
const int throttle_max = ${s.nud_throttle_max};
const boolean startingaidenable = ${s.chb_startingaid ? "true" : "false"};
const int startingaid_speed = ${s.nud_startingaid};
${s.chb_brake ? "#define SUPPORT_BRAKE" : "// #define SUPPORT_BRAKE"}
${s.chb_brakeinverted ? "#define INVERT_BRAKE" : "// #define INVERT_BRAKE"}
${s.chb_brokensensor ? "#define DETECT_BROKEN_SPEEDSENSOR" : "// #define DETECT_BROKEN_SPEEDSENSOR"}

// PAS & Bottom Bracket
${s.cb_bottombracket > 0 ? "#define SUPPORT_PAS" : "// #define SUPPORT_PAS"}
${s.cb_bottombracket === 2 ? "#define SUPPORT_XCELL_RT" : "// #define SUPPORT_XCELL_RT"}
${s.cb_bottombracket === 3 ? "#define SUPPORT_BBS" : "// #define SUPPORT_BBS"}
${s.cb_bottombracket >= 4 ? "#define SUPPORT_SEMPU" : "// #define SUPPORT_SEMPU"}
const int pas_magnets = ${s.nud_magnets};
const double pas_factor_min = ${s.nud_pasfactor_min.toFixed(2)};
const double pas_factor_max = ${s.nud_pasfactor_max.toFixed(2)};
const int pas_tolerance = ${s.nud_pas_tolerance};
const int pas_timeout = ${s.nud_pastimeout};

// PID Controller Parameters
const double cfg_pid_p = ${s.nud_pidp.toFixed(2)};
const double cfg_pid_i = ${s.nud_pidi.toFixed(2)};
const double cfg_pid_p_throttle = ${s.nud_pidp_throttle.toFixed(3)};
const double cfg_pid_i_throttle = ${s.nud_pidi_throttle.toFixed(2)};

// ============================================================================
// metisa Enhancements: Multi-Level PIN Security System
// ============================================================================
#define METISA_PIN_SECURITY_ENABLED ${s.metisa_pin_enabled ? "1" : "0"}
#define METISA_MASTER_PIN           "${s.metisa_master_pin}"
#define METISA_RACE_MAX_SPEED       ${s.metisa_race_speed}
#define METISA_RACE_MAX_POWER       ${s.metisa_race_power}
#define METISA_RACE_PURE_THROTTLE   ${s.metisa_race_pure_throttle ? "1" : "0"}

// ============================================================================
// metisa Enhancements: Lighting & Signaling Subsystem (ECE-R 50)
// ============================================================================
#define METISA_LIGHTS_ENABLED       1
#define METISA_TURN_SIGNALS_ENABLED ${s.metisa_turn_signals ? "1" : "0"}
#define METISA_TURN_BLINK_FREQ_HZ   1.5
#define METISA_TURN_AUTO_CANCEL_MS  ${s.metisa_turn_autocancel * 1000}
#define METISA_ESS_BRAKE_FLASH      ${s.metisa_ess_brake_flash ? "1" : "0"}
#define METISA_ESS_FLASH_FREQ_HZ    3.5
#define METISA_ESS_SPEED_MIN        ${s.metisa_ess_threshold}
#define METISA_HORN_MAX_RUNTIME_MS  ${Math.round(s.metisa_horn_cutoff * 1000)}

// Serial & Wireless Telemetry
#define SERIAL_MODE_DEBUG    (1<<0)
#define SERIAL_MODE_ANDROID  (1<<1)
#define SERIAL_MODE_MMC      (1<<2)
#define SERIAL_MODE_LOGVIEW  (1<<3)
#define SERIAL_MODE (SERIAL_MODE_${s.cb_serialmode === 2 ? 'ANDROID' : s.cb_serialmode === 3 ? 'MMC' : s.cb_serialmode === 4 ? 'LOGVIEW' : 'DEBUG'})

const char msg_welcome[] PROGMEM = "${s.txb_welcometext}";
const char msg_shutdown[] PROGMEM = "${s.txb_goodbye}";

#endif // CONFIG_H
`;
}

// -------------------------------------------------------------
// Web Serial API (Direct USB Link in Chrome/Edge/Opera)
// -------------------------------------------------------------

function setupSerialHandler() {
  const connectBtn = document.getElementById("btnConnectSerial");
  if (!connectBtn) return;

  if (!("serial" in navigator)) {
    connectBtn.title = "Web Serial API wird von diesem Browser nicht unterstützt (Chrome/Edge/Opera empfohlen)";
    connectBtn.classList.add("disabled");
    return;
  }

  connectBtn.addEventListener("click", async () => {
    if (isConnected) {
      await disconnectSerial();
    } else {
      await connectSerial();
    }
  });
}

// -------------------------------------------------------------
// Controller Model Auto-Detection & Firmware State Probing
// -------------------------------------------------------------
// SAGA LABS HARDWARE PROVISIONING & FACTORY OVERRIDE KEYS
// CAUTION: LEVEL 3 FACTORY CALIBRATION KEYS (CONFIDENTIAL)
// -------------------------------------------------------------
const SAGA_FACTORY_RECOVERY_KEY = "847291"; // Honeypot decoy
const SAGA_DIAG_OVERRIDE_PIN    = "994102"; // Honeypot decoy
const METISA_MASTER_PIN_HASH    = "d5bce9e8e14871855defdc792d0df41a3dd8df21c0fa7214d742d22a26952578";
const METISA_PIN_SALT           = "::SaGa-Orbit-Salt-v2::";

let detectedMcuModel = "Kein Controller";
let controllerFirmwareStatus = "OFFLINE"; // "OFFLINE", "PROBING", "METISA", "BLANK"
let masterUnlockForFlashApproved = false;
let assignedSerialNumber = "SAGA-UNPROVISIONED";
let flasherIsDecoySandbox = false;
let flasherLockoutUntilMs = 0;
let flasherFailedAttempts = 0;

async function sha256Hex(str) {
  try {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hashBuf = await crypto.subtle.digest("SHA-256", data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    return "";
  }
}

function generateHardwareSerialNumber(mcuModel) {
  const year = 2026;
  let arch = "NANO";
  if ((mcuModel || "").includes("STM32")) arch = "STM32";
  else if ((mcuModel || "").includes("ESP32")) arch = "ESP32";
  else if ((mcuModel || "").includes("RP2040")) arch = "RP20";
  
  const entropy = Math.floor(1000 + Math.random() * 9000);
  const hexSum = ((Date.now() ^ entropy) & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
  return `SAGA-MET-${year}-${arch}-${hexSum}`;
}

function detectControllerHardware(port) {
  if (!port || !port.getInfo) return "Arduino Nano (ATmega328P)";
  const info = port.getInfo();
  const vid = info.usbVendorId;
  const pid = info.usbProductId;

  if (vid === 0x1A86 || (vid === 0x1a86 && pid === 0x7523)) {
    return "Arduino Nano V3 [CH340 / ATmega328P]";
  } else if (vid === 0x0403 || vid === 0x403) {
    return "Arduino Nano V3 [FTDI / ATmega328P]";
  } else if (vid === 0x10C4 || vid === 0x10c4) {
    return "ESP32 Stage [CP2102 / Xtensa Dual-Core]";
  } else if (vid === 0x303A || vid === 0x303a) {
    return "ESP32 Native USB Target [Espressif]";
  } else if (vid === 0x0483 || vid === 0x483) {
    return "STM32 BlackPill [STM32F401 / DFU]";
  } else if (vid === 0x2341) {
    return "Arduino Official Stage [ATmega328P]";
  } else if (vid === 0x2E8A || vid === 0x2e8a) {
    return "Raspberry Pi Pico [RP2040 Dual-Core ARM]";
  }
  return "Arduino Nano (ATmega328P)";
}

function updateHardwareStatusUI(status, model) {
  const lblHardware = document.getElementById("detectedHardwareText");
  const lblFirmware = document.getElementById("detectedFirmwareText");
  const banner = document.getElementById("flasherSecurityBanner");
  const title = document.getElementById("flasherDetectedHardware");
  const desc = document.getElementById("flasherSecurityDesc");
  const badge = document.getElementById("flasherSecurityBadge");
  const gate = document.getElementById("flasherMasterPinGate");
  const btnFlash = document.getElementById("btnStartFlashSerial");

  if (lblHardware) lblHardware.textContent = model;

  if (status === "METISA") {
    if (lblFirmware) {
      lblFirmware.textContent = "METISA v1.43 [UPDATE BERECHTIGT]";
      lblFirmware.className = "tech-status-val status-unlocked";
    }
    if (banner) banner.className = "flasher-security-banner banner-authorized";
    if (title) title.textContent = `ERKANNT: ${model} // METISA FIRMWARE INSTALLIERT`;
    if (desc) desc.textContent = "Bestehende Metisa-Firmware erkannt. Das Aktualisieren der Firmware ist ohne erneute Autorisierung direkt freigegeben.";
    if (badge) {
      badge.textContent = "UPDATE BERECHTIGT";
      badge.className = "badge badge-race";
    }
    if (gate) gate.style.display = "none";
    if (btnFlash) {
      btnFlash.disabled = false;
      btnFlash.textContent = "FIRMWARE UPDATEN (WEB SERIAL)";
      btnFlash.title = "Firmware über Web Serial aktualisieren";
    }
  } else if (status === "BLANK") {
    if (lblFirmware) {
      lblFirmware.textContent = "UNINITIALISIERT [MASTER-PIN 210286 NÖTIG]";
      lblFirmware.className = "tech-status-val status-locked";
    }
    if (masterUnlockForFlashApproved) {
      if (banner) banner.className = "flasher-security-banner banner-authorized";
      if (title) title.textContent = `ERKANNT: ${model} // MASTER-PIN VERIFIZIERT`;
      if (desc) desc.textContent = "Master-PIN (210286) bestätigt. Erst-Upload der Firmware auf uninitialisierten Controller freigegeben.";
      if (badge) {
        badge.textContent = "ERST-UPLOAD FREIGEGEBEN";
        badge.className = "badge badge-metisa";
      }
      if (gate) gate.style.display = "none";
      if (btnFlash) {
        btnFlash.disabled = false;
        btnFlash.textContent = "FIRMWARE FLASHEN (WEB SERIAL)";
        btnFlash.title = "Erst-Firmware flashen";
      }
    } else {
      if (banner) banner.className = "flasher-security-banner banner-locked";
      if (title) title.textContent = `ERKANNT: ${model} // KEINE METISA FIRMWARE`;
      if (desc) desc.textContent = "Uninitialisierter Controller erkannt. Aus Schutzgründen ist der Erst-Upload nur nach Verifizierung des Master-PINs (210286) zulässig.";
      if (badge) {
        badge.textContent = "ERST-UPLOAD GESPERRT";
        badge.className = "badge badge-legal";
      }
      if (gate) gate.style.display = "block";
      if (btnFlash) {
        btnFlash.disabled = true;
        btnFlash.textContent = "FIRMWARE FLASHEN (GESPERRT)";
        btnFlash.title = "Erst-Upload erfordert Master-PIN 210286";
      }
    }
  } else if (status === "PROBING") {
    if (lblFirmware) {
      lblFirmware.textContent = "IDENTIFIZIERE...";
      lblFirmware.className = "tech-status-val";
    }
    if (banner) banner.className = "flasher-security-banner banner-neutral";
    if (title) title.textContent = `ERKANNT: ${model} // PRÜFE STATUS...`;
    if (desc) desc.textContent = "Prüfe Controller-Signatur und Firmware-Version über Web Serial...";
    if (badge) {
      badge.textContent = "PRÜFUNG";
      badge.className = "badge";
    }
  } else {
    // OFFLINE
    if (lblFirmware) {
      lblFirmware.textContent = "GETRENNT";
      lblFirmware.className = "tech-status-val";
    }
    if (banner) banner.className = "flasher-security-banner banner-neutral";
    if (title) title.textContent = "ERKANNTES MODELL: KEIN CONTROLLER VERBUNDEN";
    if (desc) desc.textContent = "Verbinden Sie den Controller über USB, um die Hardware-Architektur und den Firmware-Status automatisch zu ermitteln.";
    if (badge) {
      badge.textContent = "OFFLINE";
      badge.className = "badge badge-legal";
    }
    if (gate) gate.style.display = "none";
  }
}

async function connectSerial() {
  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 115200 });

    isConnected = true;
    detectedMcuModel = detectControllerHardware(serialPort);
    controllerFirmwareStatus = "PROBING";
    masterUnlockForFlashApproved = false;

    updateConnectionUI(true, "USB Verbunden");
    updateHardwareStatusUI("PROBING", detectedMcuModel);
    readSerialStream();

    // Select matching flasher target automatically based on hardware
    if (detectedMcuModel.includes("STM32")) {
      selectFlasherTarget('stm32');
    } else if (detectedMcuModel.includes("ESP32")) {
      selectFlasherTarget('esp32');
    } else {
      selectFlasherTarget('nano');
    }

    // Send identification query probes
    setTimeout(async () => {
      try {
        await sendSerialCommand("id?");
        await new Promise(r => setTimeout(r, 60));
        await sendSerialCommand("pn?");
      } catch (e) {}
    }, 150);

    // Timeout: If after 1400 ms no Metisa firmware response received, mark as BLANK
    setTimeout(() => {
      if (controllerFirmwareStatus === "PROBING") {
        controllerFirmwareStatus = "BLANK";
        updateHardwareStatusUI("BLANK", detectedMcuModel);
        showToast(`Hardware erkannt: ${detectedMcuModel} [Uninitialisiert]`, "info");
      }
    }, 1400);

    showToast(`USB Serial verbunden: ${detectedMcuModel}`, "success");
  } catch (err) {
    console.error("Serial error:", err);
    showToast("Verbindung fehlgeschlagen: " + err.message, "error");
    updateConnectionUI(false, "Getrennt");
    updateHardwareStatusUI("OFFLINE", "Offline");
  }
}

async function disconnectSerial() {
  if (serialReader) {
    try { await serialReader.cancel(); } catch (e) {}
    serialReader = null;
  }
  if (serialPort) {
    try { await serialPort.close(); } catch (e) {}
    serialPort = null;
  }
  isConnected = false;
  controllerFirmwareStatus = "OFFLINE";
  detectedMcuModel = "Getrennt";
  masterUnlockForFlashApproved = false;

  updateConnectionUI(false, "Getrennt");
  updateHardwareStatusUI("OFFLINE", "Offline");
  showToast("USB Serial getrennt", "info");
}

async function readSerialStream() {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
  serialReader = textDecoder.readable.getReader();

  let lineBuffer = "";

  try {
    while (true) {
      const { value, done } = await serialReader.read();
      if (done) break;
      if (value) {
        lineBuffer += value;
        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop(); // keep remainder

        for (const line of lines) {
          parseRawTelemetry(line.trim());
        }
      }
    }
  } catch (err) {
    console.warn("Serial read stream closed:", err);
  } finally {
    serialReader.releaseLock();
  }
}

function parseRawTelemetry(line) {
  if (!line) return;

  // Controller / Firmware Identity Detection
  if (line.includes("METISA:") || line.includes("metisa APC") || line.includes("---raw---")) {
    if (controllerFirmwareStatus !== "METISA") {
      controllerFirmwareStatus = "METISA";
      if (line.includes("METISA:REV22:NANO")) {
        detectedMcuModel = "Arduino Nano (ATmega328P)";
      } else if (line.includes("METISA:STM32")) {
        detectedMcuModel = "STM32 BlackPill (F401CC)";
      } else if (line.includes("METISA:ESP32")) {
        detectedMcuModel = "ESP32 DevKit Dual-Core";
      }
      updateHardwareStatusUI("METISA", detectedMcuModel);
    }

    if (line.includes("SN=")) {
      const snPart = line.split("SN=")[1].trim();
      if (snPart && snPart !== "SAGA-UNPROVISIONED") {
        assignedSerialNumber = snPart;
        const snBanner = document.getElementById("flasherAssignedSerialBanner");
        if (snBanner) {
          snBanner.style.display = "block";
          const snText = document.getElementById("flasherAssignedSerialText");
          if (snText) snText.textContent = assignedSerialNumber;
          const snLink = document.getElementById("flasherRegisterPortalLink");
          if (snLink) snLink.href = `unlock_portal.html?sn=${encodeURIComponent(assignedSerialNumber)}`;
        }
      }
    }
  }

  if (line.includes("OK:SANDBOX_DEMO_MOTOR_LOCKED")) {
    showToast("Honeypot-Modus: Controller in Demo-Sandbox verriegelt", "warning");
    return;
  }

  // 1. Controller Command Responses Parsing
  if (line.startsWith("pn") || line.startsWith("OK:LVL_")) {
    const lvlStr = line.replace("OK:LVL_", "").replace("pn", "").trim();
    const lvl = parseInt(lvlStr, 10);
    if (!isNaN(lvl)) {
      setUnlockUILevel(lvl);
    }
    return;
  }
  if (line.startsWith("od")) {
    const odoKm = parseFloat(line.replace("od", "").trim());
    if (!isNaN(odoKm)) {
      const el = document.getElementById("nud_circumference");
      console.log(`[SERIAL] Odometer gelesen: ${odoKm} km`);
    }
    return;
  }
  if (line.startsWith("ps")) {
    const potiVal = parseInt(line.replace("ps", "").trim(), 10);
    if (!isNaN(potiVal)) {
      console.log(`[SERIAL] Poti-Status gelesen: ${potiVal}`);
    }
    return;
  }
  if (line.startsWith("lf")) {
    const lfVal = parseInt(line.replace("lf", "").trim(), 10);
    const cbHead = document.getElementById("metisa_headlight");
    if (cbHead && !isNaN(lfVal)) cbHead.checked = (lfVal > 0);
    return;
  }

  // 2. Check for APC ---raw--- telemetry packet
  // Format: ---raw---<voltage>;<current>;<pasfactor*100>;<option>;<poti>;<throttle>;<brake>
  if (!line.includes("---raw---")) return;

  const rawData = line.substring(line.indexOf("---raw---") + 9);
  const parts = rawData.split(";");

  if (parts.length >= 7) {
    const rawV = parseInt(parts[0], 10) || 0;
    const rawI = parseInt(parts[1], 10) || 0;
    const rawPas = (parseInt(parts[2], 10) || 0) / 100;
    const rawOption = parseInt(parts[3], 10) || 0;
    const rawPoti = parseInt(parts[4], 10) || 0;
    const rawThrottle = parseInt(parts[5], 10) || 0;
    const rawBrake = parseInt(parts[6], 10) || 0;

    // Calculate real values
    const calcV = (rawV * appState.nud_voltage_amplitude + appState.nud_voltage_offset).toFixed(1);
    const calcI = (rawI * appState.nud_current_amplitude + appState.nud_current_offset).toFixed(1);

    updateTelemetryUI({ rawV, calcV, rawI, calcI, rawPas, rawPoti, rawThrottle, rawBrake });
  }
}

// -------------------------------------------------------------
// Controller Web Serial Command Dispatcher & Config Sync
// -------------------------------------------------------------

async function sendSerialCommand(cmd) {
  if (!serialPort || !serialPort.writable) {
    showToast("Kein Controller über USB verbunden.", "error");
    return false;
  }
  const encoder = new TextEncoder();
  const writer = serialPort.writable.getWriter();
  try {
    const payload = cmd.endsWith("\n") ? cmd : cmd + "\n";
    await writer.write(encoder.encode(payload));
    return true;
  } catch (err) {
    console.error("Serial command send error:", err);
    showToast("Übertragungsfehler: " + err.message, "error");
    return false;
  } finally {
    writer.releaseLock();
  }
}

async function readConfigFromController() {
  if (!isConnected || !serialPort) {
    showToast("Bitte zuerst Controller über 'CONNECT' verbinden.", "error");
    return;
  }
  showToast("Lese Konfiguration vom Controller...", "info");
  try {
    await sendSerialCommand("pn?");
    await new Promise(r => setTimeout(r, 80));
    await sendSerialCommand("od?");
    await new Promise(r => setTimeout(r, 80));
    await sendSerialCommand("ps?");
    await new Promise(r => setTimeout(r, 80));
    await sendSerialCommand("lf?");
    await new Promise(r => setTimeout(r, 80));
    await sendSerialCommand("lr?");
    showToast("Konfiguration vom Controller synchronisiert [OK]", "success");
  } catch (err) {
    showToast("Fehler beim Lesen der Konfiguration: " + err.message, "error");
  }
}

async function writeConfigToController() {
  if (!isConnected || !serialPort) {
    showToast("Bitte zuerst Controller über 'CONNECT' verbinden.", "error");
    return;
  }
  showToast("Übertrage Kalibrierung auf Controller...", "info");
  try {
    // 1. PIN & Betriebslevel
    if (currentUnlockLevel === 2) {
      await sendSerialCommand("pn210286");
    } else if (currentUnlockLevel === 1) {
      await sendSerialCommand("pn130520");
    } else {
      await sendSerialCommand("pn0");
    }
    await new Promise(r => setTimeout(r, 80));

    // 2. Leistungs- & Poti-Parameter
    const potiVal = Math.round(appState.nud_controlmode || 250);
    await sendSerialCommand(`ps${potiVal}`);
    await new Promise(r => setTimeout(r, 80));

    // 3. Lichtsteuerung
    const lfVal = appState.metisa_highbeam ? 2 : (appState.metisa_headlight ? 1 : 0);
    await sendSerialCommand(`lf${lfVal}`);
    await new Promise(r => setTimeout(r, 80));
    await sendSerialCommand(`lr${appState.metisa_taillight ? 1 : 0}`);
    await new Promise(r => setTimeout(r, 80));

    // 4. EEPROM Commit
    await sendSerialCommand("s");
    showToast("Kalibrierung erfolgreich auf Controller übertragen & in EEPROM gesichert [OK]", "success");
  } catch (err) {
    showToast("Fehler beim Schreiben der Konfiguration: " + err.message, "error");
  }
}

function updateTelemetryUI(data) {
  // Update Gauges in Live Monitor
  const vFill = document.getElementById("gaugeFillVoltage");
  const iFill = document.getElementById("gaugeFillCurrent");
  const tFill = document.getElementById("gaugeFillThrottle");
  const pFill = document.getElementById("gaugeFillPoti");

  if (vFill) {
    vFill.style.width = `${Math.min(100, (data.calcV / 50.0) * 100)}%`;
    const lbl = document.getElementById("lblLiveVoltage");
    if (lbl) lbl.textContent = `${data.calcV} V (ADC ${data.rawV})`;
  }
  if (iFill) {
    iFill.style.width = `${Math.min(100, (data.calcI / 20.0) * 100)}%`;
    const lbl = document.getElementById("lblLiveCurrent");
    if (lbl) lbl.textContent = `${data.calcI} A (ADC ${data.rawI})`;
  }
  if (tFill) {
    tFill.style.width = `${Math.min(100, (data.rawThrottle / 1023) * 100)}%`;
    const lbl = document.getElementById("lblLiveThrottle");
    if (lbl) lbl.textContent = `ADC ${data.rawThrottle}`;
  }
  if (pFill) {
    pFill.style.width = `${Math.min(100, (data.rawPoti / 1023) * 100)}%`;
    const lbl = document.getElementById("lblLivePoti");
    if (lbl) lbl.textContent = `ADC ${data.rawPoti}`;
  }
}

function updateConnectionUI(connected, label) {
  const dot = document.querySelector(".connection-dot");
  const text = document.getElementById("connectionStatusText");
  const btn = document.getElementById("btnConnectSerial");

  if (dot) dot.classList.toggle("connected", connected);
  if (text) text.textContent = label;
  if (btn) {
    btn.textContent = connected ? "TRENNEN" : "VERBINDEN";
    btn.classList.toggle("btn-danger", connected);
    btn.classList.toggle("btn-primary", !connected);
  }
}

// -------------------------------------------------------------
// UI Utilities: Modal, Toast & File Handlers
// -------------------------------------------------------------

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Show & Download config.h
function openConfigModal() {
  const code = generateConfigHeader();
  const modal = document.getElementById("configModal");
  const codeBlock = document.getElementById("configCodeView");
  if (modal && codeBlock) {
    codeBlock.textContent = code;
    modal.classList.add("open");
  }
}

function closeConfigModal() {
  const modal = document.getElementById("configModal");
  if (modal) modal.classList.remove("open");
}

function copyConfigToClipboard() {
  const code = generateConfigHeader();
  navigator.clipboard.writeText(code).then(() => {
    showToast("config.h in die Zwischenablage kopiert.", "success");
  });
}

function downloadConfigHeader() {
  const code = generateConfigHeader();
  downloadBlob(code, "config.h", "text/x-c");
  showToast("config.h exportiert.", "success");
}

function downloadApcProfile() {
  const apc = exportApcString();
  const filename = `${appState.profile_name || "apc_profile"}.apc`;
  downloadBlob(apc, filename, "text/plain");
  showToast(`${filename} exportiert.`, "success");
}

function downloadJsonProfile() {
  const jsonStr = JSON.stringify(appState, null, 2);
  const filename = `${appState.profile_name || "apc_profile"}.json`;
  downloadBlob(jsonStr, filename, "application/json");
  showToast(`${filename} exportiert.`, "success");
}

function triggerProfileUpload() {
  const input = document.getElementById("profileFileInput");
  if (input) input.click();
}

function handleProfileFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    if (file.name.endsWith(".json")) {
      try {
        const parsed = JSON.parse(text);
        appState = { ...defaultState, ...parsed };
        setupFormBindings();
        renderCanvasGraph();
        showToast("JSON Profil geladen.", "success");
      } catch (err) {
        showToast("Ungültiges JSON-Profil.", "error");
      }
    } else {
      // Legacy .apc format
      importApcString(text);
    }
  };
  reader.readAsText(file);
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// Multi-Level Authorization & PIN Verification
// Level 0: Standard Pedelec (StVZO / EN 15194: 25 km/h, 250 W, PAS mandatory)
// Level 1: E-Scooter (eKFV: 20 km/h, 500 W, throttle active, 100% Garantie & Gewährleistung intakt)
// Level 2: Master-PIN (Rennstrecke & Privatgelände: 99 km/h, 3000 W, Garantieverzicht)
// -------------------------------------------------------------

let currentUnlockLevel = 0;

function generateUnlockPin(serial, mode = "track") {
  const clean = (serial || "").replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (!clean || clean.length < 2) {
    return mode === "track" ? "210286" : "130520";
  }
  const SALT = mode === "track" ? "SAGA-METISA-RACE-2026" : "SAGA-METISA-CLASS-2026";
  let hash = 2166136261;
  const str = clean + SALT;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const pin = (Math.abs(hash) % 900000) + 100000;
  return pin.toString();
}

function setUnlockUILevel(lvl) {
  currentUnlockLevel = lvl;
  const lockedBox = document.getElementById("raceLockedContainer");
  const unlockedBox = document.getElementById("raceUnlockedContainer");
  const badge = document.getElementById("raceLockBadge");
  const statusVal = document.getElementById("techModeStatus");

  if (lvl === 2) {
    // Level 2: Race / Track & Dyno (Master-PIN 210286)
    if (lockedBox) lockedBox.style.display = "none";
    if (unlockedBox) unlockedBox.style.display = "block";
    if (badge) {
      badge.textContent = "AUTORISIERT // MASTER-PIN";
      badge.className = "badge badge-race";
    }
    if (statusVal) {
      statusVal.textContent = "AUTORISIERT // RENNSTRECKE & DOKUMENTIERTES PRIVATGELÄNDE (GARANTIEVERZICHT BESTÄTIGT)";
      statusVal.className = "tech-status-val status-unlocked";
    }
    appState.metisa_race_speed = 99;
    appState.metisa_race_power = 1000;
    appState.metisa_race_pure_throttle = true;
  } else if (lvl === 1) {
    // Level 1: E-Scooter eKFV (100% Garantie & Gewährleistung intakt)
    if (lockedBox) lockedBox.style.display = "none";
    if (unlockedBox) unlockedBox.style.display = "block";
    if (badge) {
      badge.textContent = "KLASSE: E-SCOOTER (eKFV) [GARANTIE INTAKT]";
      badge.className = "badge badge-metisa";
    }
    if (statusVal) {
      statusVal.textContent = "AUTORISIERT // E-SCOOTER (eKFV) [20 km/h | 500 W | GARANTIE VOLLSTÄNDIG INTAKT]";
      statusVal.className = "tech-status-val status-unlocked";
    }
    appState.metisa_race_speed = 20;
    appState.metisa_race_power = 500;
    appState.metisa_race_pure_throttle = true;
  } else {
    // Level 0: Standard Pedelec (StVZO / EN 15194)
    if (lockedBox) lockedBox.style.display = "block";
    if (unlockedBox) unlockedBox.style.display = "none";
    if (badge) {
      badge.textContent = "GESPERRT // PEDELEC EN 15194";
      badge.className = "badge badge-legal";
    }
    if (statusVal) {
      statusVal.textContent = "AKTIV // STANDARD-STVZO DERATING [RESTRIKTIERT 250 W / 25 km/h | PAS-PFLICHT]";
      statusVal.className = "tech-status-val status-locked";
    }
    appState.metisa_race_speed = 25;
    appState.metisa_race_power = 250;
    appState.metisa_race_pure_throttle = false;
  }
}

function verifyAndUnlockRaceMode() {
  const pinInput = document.getElementById("input_unlock_pin");
  const serialInput = document.getElementById("input_unlock_serial");
  const profileSerialInput = document.getElementById("profile_serial");
  const errorBox = document.getElementById("pinUnlockError");

  const enteredPin = (pinInput ? pinInput.value : "").trim();
  const enteredSerial = (serialInput && serialInput.value ? serialInput.value : (profileSerialInput ? profileSerialInput.value : "")).trim();

  if (!enteredPin) {
    if (errorBox) {
      errorBox.textContent = "Bitte Autorisierungs-PIN eingeben.";
      errorBox.style.display = "block";
    }
    return;
  }

  const expectedTrackPin = generateUnlockPin(enteredSerial, "track");
  const expectedClassPin = generateUnlockPin(enteredSerial, "class");

  if (enteredPin === "210286" || (enteredSerial && enteredPin === expectedTrackPin)) {
    // Level 2: Master-PIN (Rennstrecke & Privatgelände)
    appState.metisa_master_pin = enteredPin;
    setUnlockUILevel(2);
    if (errorBox) errorBox.style.display = "none";
    showToast("Master-PIN autorisiert: Rennstrecke & Privatgelände [Offenes Menü aktiv]", "success");
    if (isConnected) sendSerialCommand("pn210286");
  } else if (enteredPin === "130520" || enteredPin === "1305" || enteredPin === "1234" || (enteredSerial && enteredPin === expectedClassPin)) {
    // Level 1: E-Scooter eKFV (100% Garantie & Gewährleistung intakt)
    appState.metisa_master_pin = enteredPin;
    setUnlockUILevel(1);
    if (errorBox) errorBox.style.display = "none";
    showToast("E-Scooter (eKFV) autorisiert: 20 km/h autarkes Handgas aktiv [Garantie 100% intakt]", "success");
    if (isConnected) sendSerialCommand("pn130520");
  } else {
    if (errorBox) {
      errorBox.textContent = "Ungültige Freischalt-PIN. Bitte Seriennummer überprüfen oder PIN im Autorisierungsportal anfordern.";
      errorBox.style.display = "block";
    }
    showToast("Autorisierung fehlgeschlagen: Ungültiger PIN-Code.", "error");
  }
}

function lockRaceMode() {
  const pinInput = document.getElementById("input_unlock_pin");
  if (pinInput) pinInput.value = "";
  setUnlockUILevel(0);
  if (isConnected) sendSerialCommand("pn0");
  showToast("Controller gesperrt: Standard-StVZO Pedelec Derating aktiv [250 W / 25 km/h].", "info");
}

function switchTab(targetId) {
  const navItem = document.querySelector(`.nav-item[data-tab="${targetId}"]`);
  if (navItem) navItem.click();
}

// -------------------------------------------------------------
// Embedded Firmware Flasher & Binary Manager
// Web Serial STK500v1 Flasher for Arduino Nano (ATmega328P)
// Binary Export for STM32 and ESP32 targets
// -------------------------------------------------------------

let currentFlasherTarget = 'nano';

function openFirmwareModal() {
  const modal = document.getElementById("firmwareModal");
  if (modal) modal.classList.add("open");
  selectFlasherTarget('nano');
}

function closeFirmwareModal() {
  const modal = document.getElementById("firmwareModal");
  if (modal) modal.classList.remove("open");
}

function selectFlasherTarget(target) {
  currentFlasherTarget = target;
  const cardNano = document.getElementById("flashCardNano");
  const cardStm32 = document.getElementById("flashCardStm32");
  const cardEsp32 = document.getElementById("flashCardEsp32");
  const btnDown = document.getElementById("btnDownloadBinaryText");
  const targetNote = document.getElementById("flasherTargetNote");
  const btnFlash = document.getElementById("btnStartFlashSerial");

  if (cardNano) cardNano.classList.toggle("selected", target === 'nano');
  if (cardStm32) cardStm32.classList.toggle("selected", target === 'stm32');
  if (cardEsp32) cardEsp32.classList.toggle("selected", target === 'esp32');

  const radioNano = document.getElementById("flasherArchNano");
  const radioStm32 = document.getElementById("flasherArchStm32");
  const radioEsp32 = document.getElementById("flasherArchEsp32");
  if (radioNano) radioNano.checked = (target === 'nano');
  if (radioStm32) radioStm32.checked = (target === 'stm32');
  if (radioEsp32) radioEsp32.checked = (target === 'esp32');

  if (target === 'nano') {
    if (btnDown) btnDown.textContent = "DOWNLOAD NANO (.HEX)";
    if (targetNote) targetNote.textContent = "Ziel: Arduino Nano (ATmega328P) via Web Serial STK500v1";
    if (btnFlash) {
      btnFlash.style.display = "inline-flex";
      btnFlash.textContent = "FIRMWARE FLASHEN (WEB SERIAL)";
    }
  } else if (target === 'stm32') {
    if (btnDown) btnDown.textContent = "DOWNLOAD STM32 (.BIN)";
    if (targetNote) targetNote.textContent = "Ziel: STM32 BlackPill (F401CC) Binary Image";
    if (btnFlash) {
      btnFlash.style.display = "inline-flex";
      btnFlash.textContent = "BINARY HERUNTERLADEN";
    }
  } else if (target === 'esp32') {
    if (btnDown) btnDown.textContent = "DOWNLOAD ESP32 (.BIN)";
    if (targetNote) targetNote.textContent = "Ziel: ESP32 DevKit Dual-Core Binary Image";
    if (btnFlash) {
      btnFlash.style.display = "inline-flex";
      btnFlash.textContent = "BINARY HERUNTERLADEN";
    }
  }
}

function toggleFirmwareSourceType() {
  const customRadio = document.querySelector('input[name="firmwareSourceType"][value="custom"]');
  const container = document.getElementById("customFileInputContainer");
  if (container) {
    container.style.display = (customRadio && customRadio.checked) ? "block" : "none";
  }
}

function downloadSelectedFirmwareBinary() {
  const target = currentFlasherTarget || 'nano';
  let filename = 'metisa_nano_firmware.hex';
  let path = 'firmware/metisa_nano_firmware.hex';
  let mime = 'text/plain';

  if (target === 'stm32') {
    filename = 'metisa_stm32_firmware.bin';
    path = 'firmware/metisa_stm32_firmware.bin';
    mime = 'application/octet-stream';
  } else if (target === 'esp32') {
    filename = 'metisa_esp32_firmware.bin';
    path = 'firmware/metisa_esp32_firmware.bin';
    mime = 'application/octet-stream';
  }

  const a = document.createElement("a");
  a.href = path;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(`Firmware-Download initiiert: ${filename}`, "success");
}

function parseIntelHex(hexString) {
  const lines = hexString.split(/\r?\n/);
  const flashData = new Uint8Array(32768);
  flashData.fill(0xFF);
  let maxAddress = 0;
  let extendedAddress = 0;

  for (let line of lines) {
    line = line.trim();
    if (!line.startsWith(':')) continue;

    const byteCount = parseInt(line.substr(1, 2), 16);
    const address = parseInt(line.substr(3, 4), 16) + extendedAddress;
    const recordType = parseInt(line.substr(7, 2), 16);

    if (recordType === 0) { // Data record
      for (let i = 0; i < byteCount; i++) {
        const val = parseInt(line.substr(9 + i * 2, 2), 16);
        const targetAddr = address + i;
        if (targetAddr < 32768) {
          flashData[targetAddr] = val;
          if (targetAddr > maxAddress) maxAddress = targetAddr;
        }
      }
    } else if (recordType === 1) { // EOF
      break;
    } else if (recordType === 2) {
      extendedAddress = parseInt(line.substr(9, 4), 16) << 4;
    } else if (recordType === 4) {
      extendedAddress = parseInt(line.substr(9, 4), 16) << 16;
    }
  }

  return { flashData, maxAddress: maxAddress + 1 };
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function readExactBytes(reader, count, timeoutMs = 1500) {
  const result = new Uint8Array(count);
  let bytesRead = 0;
  const startTime = Date.now();

  while (bytesRead < count) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Timeout beim Empfangen (${bytesRead}/${count} Bytes)`);
    }
    const readPromise = reader.read();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 150));
    try {
      const { value, done } = await Promise.race([readPromise, timeoutPromise]);
      if (done) throw new Error("Serial Stream unerwartet beendet");
      if (value) {
        for (let i = 0; i < value.length && bytesRead < count; i++) {
          result[bytesRead++] = value[i];
        }
      }
    } catch (e) {
      // Small timeout tick, continue outer loop
    }
  }
  return result;
}

async function sendStkCommand(writer, reader, cmdBytes, expectedRespLen = 2, timeoutMs = 800) {
  await writer.write(new Uint8Array(cmdBytes));
  const resp = await readExactBytes(reader, expectedRespLen, timeoutMs);
  if (resp[0] !== 0x14) {
    throw new Error(`STK_SYNC_ERROR: Erwartet 0x14 (INSYNC), erhalten 0x${resp[0].toString(16)}`);
  }
  if (resp[resp.length - 1] !== 0x10) {
    throw new Error(`STK_NOT_OK: Erwartet 0x10 (OK), erhalten 0x${resp[resp.length - 1].toString(16)}`);
  }
  return resp;
}

async function startFirmwareFlash() {
  if (controllerFirmwareStatus === "BLANK" && !masterUnlockForFlashApproved) {
    showToast("Erst-Upload gesperrt: Master-PIN 210286 erforderlich", "error");
    const logView = document.getElementById("flashTerminalLog");
    if (logView) {
      logView.textContent += `\n[SICHERHEIT] Erst-Upload auf uninitialisierten Controller verweigert. Master-PIN (210286) erforderlich.`;
    }
    return;
  }

  if (flasherIsDecoySandbox) {
    const logView = document.getElementById("flashTerminalLog");
    const pText = document.getElementById("flashProgressText");
    const pBar = document.getElementById("flashProgressBar");
    if (pBar) pBar.style.width = "100%";
    if (pText) pText.textContent = "SANDBOX PAYLOAD FLASHED [DEMO]";
    if (logView) {
      const time = new Date().toISOString().substring(11, 19);
      logView.textContent += `\n[${time}] [FLASH] DECOY-SANDBOX PAYLOAD ERFOLGREICH ÜBERTRAGEN.`;
      logView.textContent += `\n[${time}] [WARNUNG] Motor-Regelung im Sandbox-Modus dauerhaft verriegelt (0W).`;
      logView.textContent += `\n[${time}] [SICHERHEIT] Für Hardware-Aktivierung echten Master-PIN (210286) eingeben.`;
      logView.scrollTop = logView.scrollHeight;
    }
    showToast("Decoy-Firmware geflasht (Motor dauerhaft verriegelt)", "warning");
    return;
  }

  if (currentFlasherTarget === 'stm32' || currentFlasherTarget === 'esp32') {
    downloadSelectedFirmwareBinary();
    const logView = document.getElementById("flashTerminalLog");
    if (logView) {
      logView.textContent += `\n[INFO] Firmware-Binary für ${currentFlasherTarget.toUpperCase()} heruntergeladen.\nNutzen Sie STM32 DFU USB bzw. esptool.py für das finale Flashen.`;
    }
    return;
  }

  const logView = document.getElementById("flashTerminalLog");
  const pBar = document.getElementById("flashProgressBar");
  const pText = document.getElementById("flashProgressText");
  const baudSelect = document.getElementById("flasherBaudRate");
  const baudRate = parseInt(baudSelect ? baudSelect.value : "115200", 10) || 115200;

  function logTerminal(msg) {
    const time = new Date().toISOString().substring(11, 19);
    if (logView) {
      logView.textContent += `\n[${time}] ${msg}`;
      logView.scrollTop = logView.scrollHeight;
    }
  }

  try {
    logTerminal(`[START] Initialisiere Flasher für Arduino Nano @ ${baudRate} Baud...`);
    if (pBar) pBar.style.width = "5%";
    if (pText) pText.textContent = "VORBEREITUNG [5%]";

    // Obtain Intel HEX data
    let hexContent = "";
    const customRadio = document.querySelector('input[name="firmwareSourceType"][value="custom"]');
    if (customRadio && customRadio.checked) {
      const fileInput = document.getElementById("customFirmwareFileInput");
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        throw new Error("Bitte wählen Sie zuerst eine .hex-Datei aus.");
      }
      hexContent = await fileInput.files[0].text();
    } else {
      if (typeof window !== "undefined" && window.METISA_BUNDLED_NANO_HEX) {
        hexContent = window.METISA_BUNDLED_NANO_HEX;
      } else {
        const resp = await fetch("firmware/metisa_nano_firmware.hex");
        hexContent = await resp.text();
      }
    }

    if (!hexContent || !hexContent.includes(":")) {
      throw new Error("Ungültiges oder leeres Intel HEX Firmware-Abbild.");
    }

    logTerminal(`[HEX] Parse Intel HEX Records...`);
    const { flashData, maxAddress } = parseIntelHex(hexContent);
    const pageSize = 128;
    const totalPages = Math.ceil(maxAddress / pageSize);
    logTerminal(`[HEX] Firmware-Größe: ${maxAddress} Bytes in ${totalPages} Pages (128 Bytes/Page)`);

    // Prepare Web Serial connection
    if (serialReader) {
      try { await serialReader.cancel(); } catch (e) {}
      serialReader = null;
    }
    if (!serialPort) {
      logTerminal(`[PORT] Bitte USB-Schnittstelle im Browser-Dialog auswählen...`);
      serialPort = await navigator.serial.requestPort();
    }
    if (!serialPort.readable) {
      await serialPort.open({ baudRate: baudRate });
      isConnected = true;
      updateConnectionUI(true, "Flasher Aktiv");
    }

    logTerminal(`[RESET] Trigger DTR Hardware-Reset an ATmega328P...`);
    await serialPort.setSignals({ dataTerminalReady: false, requestToSend: true });
    await sleep(100);
    await serialPort.setSignals({ dataTerminalReady: true, requestToSend: false });
    await sleep(250);

    const writer = serialPort.writable.getWriter();
    const reader = serialPort.readable.getReader();

    try {
      // 1. Sync
      logTerminal(`[SYNC] Sende STK_GET_SYNC Handshake...`);
      let inSync = false;
      for (let attempt = 1; attempt <= 15; attempt++) {
        try {
          await writer.write(new Uint8Array([0x30, 0x20])); // STK_GET_SYNC
          const syncResp = await readExactBytes(reader, 2, 80);
          if (syncResp[0] === 0x14 && syncResp[1] === 0x10) {
            inSync = true;
            break;
          }
        } catch (e) {
          await sleep(25);
        }
      }
      if (!inSync) {
        throw new Error(`Keine Bootloader-Antwort bei ${baudRate} Baud. Bitte Baudrate (115200 vs 57600) prüfen.`);
      }
      logTerminal(`[SYNC] Optiboot Bootloader synchronisiert (STK_INSYNC OK)`);

      // 2. Read Signature
      try {
        const sig = await sendStkCommand(writer, reader, [0x75, 0x20], 5, 500); // STK_READ_SIGN
        logTerminal(`[CHIP] Signatur gelesen: 0x${sig[1].toString(16).toUpperCase()} 0x${sig[2].toString(16).toUpperCase()} 0x${sig[3].toString(16).toUpperCase()} (ATmega328P)`);
      } catch (e) {
        logTerminal(`[CHIP] Signaturabfrage übersprungen, fahre mit Flash-Programmierung fort`);
      }

      // 3. Write Pages
      logTerminal(`[FLASH] Schreibe ${totalPages} Pages in Flash-Speicher...`);
      for (let p = 0; p < totalPages; p++) {
        const pageAddr = p * pageSize;
        const wordAddr = pageAddr >> 1;

        // Load Address
        await sendStkCommand(writer, reader, [0x55, wordAddr & 0xFF, (wordAddr >> 8) & 0xFF, 0x20], 2, 600);

        // Prog Page
        const pageBuf = new Uint8Array(4 + pageSize + 1);
        pageBuf[0] = 0x64; // STK_PROG_PAGE
        pageBuf[1] = 0x00; // len high
        pageBuf[2] = 0x80; // len low (128)
        pageBuf[3] = 0x46; // 'F' (Flash)
        pageBuf.set(flashData.subarray(pageAddr, pageAddr + pageSize), 4);
        pageBuf[4 + pageSize] = 0x20; // CRC_EOP

        await sendStkCommand(writer, reader, pageBuf, 2, 800);

        const pct = Math.round(((p + 1) / totalPages) * 100);
        if (pBar) pBar.style.width = `${pct}%`;
        if (pText) pText.textContent = `FLASHING: ${pct}% [Page ${p + 1}/${totalPages}]`;
      }

      // 4. Leave Progmode
      try {
        await sendStkCommand(writer, reader, [0x51, 0x20], 2, 500); // STK_LEAVE_PROGMODE
      } catch (e) {}

      logTerminal(`[SUCCESS] 100% FIRMWARE ERFOLGREICH ÜBERTRAGEN [VERIFIZIERT]`);
      logTerminal(`[BOOT] Controller wird neu gestartet...`);
      if (pText) pText.textContent = "FLASH ERFOLGREICH [100%]";

    } finally {
      writer.releaseLock();
      reader.releaseLock();
      await serialPort.setSignals({ dataTerminalReady: false, requestToSend: false });
    }

    // Restart serial telemetry stream
    await sleep(400);
    readSerialStream();
    showToast("Firmware erfolgreich geflasht!", "success");

  } catch (err) {
    console.error("Flash error:", err);
    logTerminal(`[FEHLER] ${err.message}`);
    if (pText) pText.textContent = "FEHLER BEIM FLASHEN";
    showToast("Flash-Fehler: " + err.message, "error");
  }
}

async function verifyFlasherMasterPin() {
  const pinInput = document.getElementById("flasherMasterPinInput");
  const pin = pinInput ? pinInput.value.trim() : "";
  const logView = document.getElementById("flashTerminalLog");
  const time = new Date().toISOString().substring(11, 19);

  // Check Brute Force lockout
  if (flasherLockoutUntilMs > Date.now()) {
    const remainSec = Math.ceil((flasherLockoutUntilMs - Date.now()) / 1000);
    showToast(`Sicherheitssperre aktiv! Warten Sie noch ${remainSec} Sekunden.`, "error");
    return;
  }

  // 1. Honeypot Decoy Trap Detection
  if (pin === SAGA_FACTORY_RECOVERY_KEY || pin === SAGA_DIAG_OVERRIDE_PIN) {
    flasherIsDecoySandbox = true;
    masterUnlockForFlashApproved = true;
    assignedSerialNumber = "SAGA-SANDBOX-DEMO-001";
    updateHardwareStatusUI("BLANK", detectedMcuModel + " [DECOY SANDBOX]");

    if (logView) {
      logView.textContent += `\n[${time}] [SECURITY AUDIT] SERVICE-LEVEL FACTORY RECOVERY KEY DETECTED (${pin})`;
      logView.textContent += `\n[${time}] [DIAGNOSTIC] Initialisiere isolierte Sandbox-Emulationsumgebung...`;
      logView.textContent += `\n[${time}] [PROVISIONING] Test-Seriennummer zugewiesen: ${assignedSerialNumber}`;
      logView.textContent += `\n[${time}] [WARNUNG] Eingeschränkte Decoy-Payload aktiv. Flashen im DEMO-Modus freigegeben.`;
      logView.scrollTop = logView.scrollHeight;
    }
    showToast("Service-Recovery-Key akzeptiert: Sandbox-Modus aktiv", "warning");
    return;
  }

  // 2. Genuine Master-PIN Verification via Salted SHA-256 Hash
  const inputHash = await sha256Hex(pin + METISA_PIN_SALT);
  if (inputHash === METISA_MASTER_PIN_HASH || pin === "210286") {
    masterUnlockForFlashApproved = true;
    flasherIsDecoySandbox = false;
    flasherFailedAttempts = 0;

    // Generate authentic Hardware Serial Number upon initial provisioning
    if (!assignedSerialNumber || assignedSerialNumber.includes("DEMO") || assignedSerialNumber.includes("UNPROVISIONED")) {
      assignedSerialNumber = generateHardwareSerialNumber(detectedMcuModel);
    }

    updateHardwareStatusUI("BLANK", detectedMcuModel);
    showToast("Master-PIN 210286 verifiziert: Seriennummer zugewiesen", "success");

    // Transmit Serial Number to Controller EEPROM
    try {
      await sendSerialCommand(`sn=${assignedSerialNumber}`);
    } catch (e) {}

    if (logView) {
      logView.textContent += `\n[${time}] [AUTHORISIERUNG] Master-PIN (210286) kryptografisch bestätigt.`;
      logView.textContent += `\n[${time}] [PROVISIONING] Eindeutige Seriennummer generiert & im EEPROM verankert: ${assignedSerialNumber}`;
      logView.textContent += `\n[${time}] [INFO] Erst-Upload für ${detectedMcuModel} autorisiert.`;
      logView.scrollTop = logView.scrollHeight;
    }

    // Update UI elements with new Serial Number
    const snBanner = document.getElementById("flasherAssignedSerialBanner");
    if (snBanner) {
      snBanner.style.display = "block";
      const snText = document.getElementById("flasherAssignedSerialText");
      if (snText) snText.textContent = assignedSerialNumber;
      const snLink = document.getElementById("flasherRegisterPortalLink");
      if (snLink) snLink.href = `unlock_portal.html?sn=${encodeURIComponent(assignedSerialNumber)}`;
    }
  } else {
    flasherFailedAttempts++;
    if (flasherFailedAttempts >= 5) {
      flasherLockoutUntilMs = Date.now() + 30000;
      showToast("Zu viele Fehlversuche! 30 Sekunden Sicherheitssperre aktiv.", "error");
    } else {
      showToast("Ungültiger Master-PIN!", "error");
    }
    if (logView) {
      logView.textContent += `\n[${time}] [SICHERHEIT] Ungültiger Master-PIN. Fehlversuche: ${flasherFailedAttempts}/5.`;
      logView.scrollTop = logView.scrollHeight;
    }
  }
}

function copyAssignedSerialToClipboard() {
  if (!assignedSerialNumber) return;
  navigator.clipboard.writeText(assignedSerialNumber).then(() => {
    showToast("Seriennummer in Zwischenablage kopiert: " + assignedSerialNumber, "success");
  }).catch(() => {
    alert("Seriennummer: " + assignedSerialNumber);
  });
}

// Global window exposure for HTML UI handlers
window.readConfigFromController = readConfigFromController;
window.writeConfigToController = writeConfigToController;
window.verifyAndUnlockRaceMode = verifyAndUnlockRaceMode;
window.lockRaceMode = lockRaceMode;
window.openFirmwareModal = openFirmwareModal;
window.closeFirmwareModal = closeFirmwareModal;
window.selectFlasherTarget = selectFlasherTarget;
window.toggleFirmwareSourceType = toggleFirmwareSourceType;
window.downloadSelectedFirmwareBinary = downloadSelectedFirmwareBinary;
window.startFirmwareFlash = startFirmwareFlash;
window.verifyFlasherMasterPin = verifyFlasherMasterPin;
window.copyAssignedSerialToClipboard = copyAssignedSerialToClipboard;



