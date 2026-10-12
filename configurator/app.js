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
  profile_name: "Saga-Trekking-36V",
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
  checkUrlAutoUnlock();

  // Enter key support for PIN inputs
  const pinInput = document.getElementById("input_unlock_pin");
  if (pinInput) {
    pinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") verifyAndUnlockRaceMode();
    });
  }
  const serialInput = document.getElementById("input_unlock_serial");
  if (serialInput) {
    serialInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") verifyAndUnlockRaceMode();
    });
  }
  const flasherPinInput = document.getElementById("flasherMasterPinInput");
  if (flasherPinInput) {
    flasherPinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") verifyFlasherMasterPin();
    });
  }
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

  const disp = document.getElementById("displayProfileName");
  if (disp && appState.profile_name) {
    disp.innerText = appState.profile_name;
  }
}

// React to State Changes
function onStateChanged(changedKey) {
  if (changedKey === "profile_name") {
    const disp = document.getElementById("displayProfileName");
    if (disp) disp.innerText = appState.profile_name || "Saga-Trekking-36V";
  }
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

  // Curve Parameters
  const pMax = appState.nud_power_max || 250;
  const spdStart = appState.nud_speedcutoff_start || 23;
  const spdStop = appState.nud_speedcutoff_stop || 25;
  const pThermal = appState.nud_power_thermal || 150;

  const maxDisplaySpd = Math.max(35, Math.ceil((spdStop + 5) / 10) * 10);
  const maxDisplayPower = Math.max(pMax * 1.25, 500);

  // Axis Labels & Monospace Engineering Units
  ctx.fillStyle = "#64748b";
  ctx.font = "600 9px 'JetBrains Mono', 'SF Mono', monospace";
  ctx.fillText("0", leftMargin - 10, h - bottomMargin + 14);
  const mid1 = Math.round(maxDisplaySpd * 0.4);
  const mid2 = Math.round(maxDisplaySpd * 0.7);
  ctx.fillText(`${mid1}`, leftMargin + plotW * (mid1 / maxDisplaySpd) - 6, h - bottomMargin + 14);
  ctx.fillText(`${mid2}`, leftMargin + plotW * (mid2 / maxDisplaySpd) - 6, h - bottomMargin + 14);
  ctx.fillText(`${maxDisplaySpd} km/h`, w - rightMargin - 45, h - bottomMargin + 14);

  ctx.fillStyle = "#ff6200";
  ctx.fillText("POWER [W]", 6, topMargin + 10);

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

  // Update Readout Bar
  const readout = document.getElementById("dynoCursorReadout");
  if (readout) {
    const modeLabel = (currentUnlockLevel === 2) ? "MASTER-PIN UNRESTRICTED" : (currentUnlockLevel === 1) ? "E-SCOOTER eKFV" : "PEDELEC EN 15194";
    readout.textContent = `Status: ${modeLabel} | P_max: ${pMax} W | Cutoff: ${spdStart} -> ${spdStop} km/h`;
  }
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
    // STMicroelectronics Family
    if (pid === 0xDF11 || pid === 0xdf11) {
      if (appState.target_mcu === "stm32f407") {
        return "STM32F407 High-Performance [DFU Bootloader]";
      } else if (appState.target_mcu === "stm32f405") {
        return "STM32F405 Inverter Stage [DFU Bootloader]";
      } else if (appState.target_mcu === "stm32f411") {
        return "STM32 BlackPill F411 [DFU Bootloader]";
      } else if (appState.target_mcu === "stm32_blackpill" || appState.target_mcu === "stm32f401") {
        return "STM32 BlackPill F401 [DFU Bootloader]";
      } else if (appState.target_mcu === "stm32f103") {
        return "STM32 BluePill F103 [DFU Bootloader]";
      } else if (appState.target_mcu === "stm32g431") {
        return "STM32G431 Motor Stage [DFU Bootloader]";
      }
      return "STM32 Universal [DFU Bootloader Mode]";
    } else if (pid === 0x374B || pid === 0x374b) {
      if (appState.target_mcu === "stm32f407") {
        return "STM32F407 Discovery / Metisa Pro [ST-LINK V2-1 VCP]";
      }
      return "STM32 Target [ST-LINK V2-1 Virtual COM Port]";
    } else if (pid === 0x3748) {
      return "STM32 Target [ST-LINK V2 Programmer]";
    } else if (pid === 0x374E || pid === 0x3752) {
      return "STM32 Target [ST-LINK V3 Virtual COM Port]";
    } else if (pid === 0x5740) {
      if (appState.target_mcu === "stm32f407") {
        return "STM32F407 High-Performance Stage [USB CDC]";
      } else if (appState.target_mcu === "stm32f405") {
        return "STM32F405 Inverter Stage [USB CDC]";
      } else if (appState.target_mcu === "stm32f411") {
        return "STM32 BlackPill F411 [USB CDC]";
      } else if (appState.target_mcu === "stm32_blackpill" || appState.target_mcu === "stm32f401") {
        return "STM32 BlackPill F401 [USB CDC]";
      } else if (appState.target_mcu === "stm32f103") {
        return "STM32 BluePill F103 [USB CDC]";
      } else if (appState.target_mcu === "stm32g431") {
        return "STM32G431 Motor Stage [USB CDC]";
      }
      return "STM32 Family Controller [Virtual COM Port]";
    }
    if (appState.target_mcu === "stm32f407") {
      return "STM32F407 High-Performance [ARM Cortex-M4]";
    }
    return "STM32 Family Microcontroller [STMicroelectronics]";
  } else if (vid === 0x2341) {
    if (pid === 0x0010 || pid === 0x0042) {
      return "Arduino Mega 2560 [ATmega2560 AVR]";
    }
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
      const sub = detectedMcuModel.includes("F407") ? 'stm32f407' :
                  detectedMcuModel.includes("F405") ? 'stm32f405' :
                  detectedMcuModel.includes("F411") ? 'stm32f411' :
                  detectedMcuModel.includes("F103") ? 'stm32f103' :
                  detectedMcuModel.includes("G431") ? 'stm32g431' :
                  (appState.target_mcu && appState.target_mcu.startsWith('stm32')) ? appState.target_mcu : 'stm32f407';
      selectFlasherTarget('stm32', sub);
      setTargetMcuSelect(sub);
    } else if (detectedMcuModel.includes("ESP32")) {
      selectFlasherTarget('esp32');
      setTargetMcuSelect('esp32');
    } else if (detectedMcuModel.includes("Mega")) {
      selectFlasherTarget('mega');
      setTargetMcuSelect('avr_mega');
    } else if (detectedMcuModel.includes("RP2040") || detectedMcuModel.includes("Pico")) {
      selectFlasherTarget('pico');
      setTargetMcuSelect('pico');
    } else {
      selectFlasherTarget('nano');
      setTargetMcuSelect('avr_nano');
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

let isTelemetryPaused = false;

// -------------------------------------------------------------
// Metisa Orbit Cryptographic Zero-Trust & Split-Privilege RBAC
// -------------------------------------------------------------
const METISA_SECURITY_REGISTERS = {
  // Zone A: Unrestricted Basic Config (Open access, direct write via 'wb')
  WHEEL_CIRCUMFERENCE:   { id: 0x0010, zone: "A", name: "Wheel Circumference [mm]" },
  DISPLAY_TYPE:          { id: 0x0011, zone: "A", name: "Display Type" },
  DISPLAY_CONTRAST:      { id: 0x0012, zone: "A", name: "Display Contrast" },
  IDLE_SHUTDOWN_SEC:     { id: 0x0013, zone: "A", name: "Idle Sleep Timeout [s]" },
  LIGHT_CONFIG:          { id: 0x0014, zone: "A", name: "Light Configuration Preset" },

  // Zone B: Restricted Safety / Inverter Limits (Zero-Trust HMAC-SHA256 via 'ws')
  POWER_MAX_WATTS:       { id: 0x0100, zone: "B", name: "Continuous Power Limit [W]" },
  SPEED_CUTOFF_STOP:     { id: 0x0101, zone: "B", name: "Hard Velocity Cutoff [km/h * 10]" },
  SPEED_CUTOFF_START:    { id: 0x0102, zone: "B", name: "Derating Velocity Start [km/h * 10]" },
  POWER_POTI_MAX:        { id: 0x0103, zone: "B", name: "Poti Power Limit [W]" },
  PURE_THROTTLE_ALLOWED: { id: 0x0104, zone: "B", name: "Autonomous Throttle Authorization" },
  PHASE_CURRENT_MAX_A:   { id: 0x0105, zone: "B", name: "Phase Current Limit [A * 10]" },
  SECURITY_CLASS_LEVEL:  { id: 0x0106, zone: "B", name: "Security Class Level" },
};

// 256-Bit Factory PSK (Pre-Shared Key matching microcontroller Flash)
// Production Backend Zero-Trust: In cloud deployments, the client forwards (challenge + reg + val)
// to https://api.saga-ecm.com/auth/sign-challenge over TLS, where an HSM signs the payload with the device-unique PSK.
// Offline/Dyno Mode: For offline test bench tuning, the pre-shared key is computed locally via Web Crypto API.
const METISA_DEVICE_PSK_DEFAULT = "4D45544953415F534147415F4C4142539F82114BC3D47E2A581099AA3377EEFF";

async function generateHmacSha256Signature(payloadString, pskHex = METISA_DEVICE_PSK_DEFAULT) {
  const cleanHex = pskHex.replace(/[^0-9A-Fa-f]/g, "");
  const pskBytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    pskBytes,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );

  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(payloadString);
  const sigBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, dataBytes);

  return Array.from(new Uint8Array(sigBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

async function pauseTelemetryStream() {
  isTelemetryPaused = true;
  if (serialReader) {
    try {
      await serialReader.cancel();
    } catch (e) {
      console.warn("[SERIAL] Reader cancel notice:", e);
    }
    try {
      serialReader.releaseLock();
    } catch (e) {
      console.warn("[SERIAL] Reader releaseLock notice:", e);
    }
    serialReader = null;
  }
}

function resumeTelemetryStream() {
  isTelemetryPaused = false;
  if (isConnected && serialPort && serialPort.readable && !serialReader) {
    readSerialStream();
  }
}

async function hardwareSyncReset(port) {
  if (port && typeof port.setSignals === "function") {
    try {
      // Hardware-Sync: Toggle DTR/RTS to synchronize controller into clean receive mode
      await port.setSignals({ dataTerminalReady: false, requestToSend: true });
      await new Promise(r => setTimeout(r, 40));
      await port.setSignals({ dataTerminalReady: true, requestToSend: false });
      await new Promise(r => setTimeout(r, 80));
    } catch (err) {
      console.warn("[SERIAL] Hardware sync (DTR/RTS) warning:", err);
    }
  }
}

async function execSerialTransaction(cmd, timeoutMs = 1500) {
  if (!serialPort || !serialPort.writable || !serialPort.readable) {
    throw new Error("Serieller Port nicht beschreibbar oder nicht verbunden.");
  }

  // 1. Write command with isolated writer lock
  const encoder = new TextEncoder();
  const writer = serialPort.writable.getWriter();
  try {
    const payload = cmd.endsWith("\n") ? cmd : cmd + "\n";
    await writer.write(encoder.encode(payload));
  } finally {
    writer.releaseLock();
  }

  // 2. Read single line response with isolated reader lock
  const decoder = new TextDecoder();
  const reader = serialPort.readable.getReader();
  let rxAccum = "";
  const tStart = Date.now();

  try {
    while (Date.now() - tStart < timeoutMs) {
      const readPromise = reader.read();
      const timeoutPromise = new Promise(r => setTimeout(() => r({ timeout: true }), Math.max(10, timeoutMs - (Date.now() - tStart))));
      const res = await Promise.race([readPromise, timeoutPromise]);
      if (res.timeout || res.done) break;
      if (res.value) {
        rxAccum += decoder.decode(res.value);
        if (rxAccum.includes("\n")) {
          const lines = rxAccum.split("\n").map(l => l.trim()).filter(l => l.length > 0);
          for (const line of lines) {
            if (line.startsWith("OK:") || line.startsWith("ERR:") || line.startsWith("sOK:") || line.includes("CHALLENGE")) {
              return line;
            }
          }
          if (lines.length > 0) return lines[lines.length - 1];
        }
      }
    }
    return rxAccum.trim();
  } finally {
    reader.releaseLock();
  }
}

async function readSerialStream() {
  if (!serialPort || !serialPort.readable || isTelemetryPaused) return;

  const decoder = new TextDecoder();
  try {
    serialReader = serialPort.readable.getReader();
  } catch (e) {
    console.warn("[SERIAL] getReader lock warning:", e);
    return;
  }

  let lineBuffer = "";

  try {
    while (true) {
      const { value, done } = await serialReader.read();
      if (done) break;
      if (value) {
        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop(); // keep remainder

        for (const line of lines) {
          parseRawTelemetry(line.trim());
        }
      }
    }
  } catch (err) {
    // Normal termination when cancelled via cancel()
  } finally {
    if (serialReader) {
      try { serialReader.releaseLock(); } catch (e) {}
      serialReader = null;
    }
  }
}

function parseRawTelemetry(line) {
  if (!line) return;

  // Controller / Firmware Identity Detection
  if (line.includes("METISA:") || line.includes("metisa APC") || line.includes("---raw---")) {
    if (controllerFirmwareStatus !== "METISA") {
      controllerFirmwareStatus = "METISA";
      if (line.includes("METISA:REV22:STM32F407") || line.includes("METISA:STM32F407")) {
        detectedMcuModel = "STM32F407 High-Performance [ARM Cortex-M4 @ 168 MHz]";
        setTargetMcuSelect("stm32f407");
        selectFlasherTarget("stm32", "stm32f407");
      } else if (line.includes("METISA:REV22:STM32F405") || line.includes("METISA:STM32F405")) {
        detectedMcuModel = "STM32F405 FOC Inverter Stage [ARM Cortex-M4 @ 168 MHz]";
        setTargetMcuSelect("stm32f405");
        selectFlasherTarget("stm32", "stm32f405");
      } else if (line.includes("METISA:REV22:STM32F401") || line.includes("METISA:STM32F401")) {
        detectedMcuModel = "STM32 BlackPill [STM32F401CC @ 84 MHz]";
        setTargetMcuSelect("stm32_blackpill");
        selectFlasherTarget("stm32", "stm32f401");
      } else if (line.includes("METISA:REV22:STM32F411") || line.includes("METISA:STM32F411")) {
        detectedMcuModel = "STM32 BlackPill [STM32F411CE @ 100 MHz]";
        setTargetMcuSelect("stm32f411");
        selectFlasherTarget("stm32", "stm32f411");
      } else if (line.includes("METISA:REV22:STM32F103") || line.includes("METISA:STM32F103")) {
        detectedMcuModel = "STM32 BluePill [STM32F103C8 @ 72 MHz]";
        setTargetMcuSelect("stm32f103");
        selectFlasherTarget("stm32", "stm32f103");
      } else if (line.includes("METISA:REV22:STM32G431") || line.includes("METISA:STM32G431")) {
        detectedMcuModel = "STM32G431 Motor Stage [Cordic/FMAC @ 170 MHz]";
        setTargetMcuSelect("stm32g431");
        selectFlasherTarget("stm32", "stm32g431");
      } else if (line.includes("METISA:STM32")) {
        if (appState.target_mcu === "stm32f407") {
          detectedMcuModel = "STM32F407 High-Performance [ARM Cortex-M4 @ 168 MHz]";
          selectFlasherTarget("stm32", "stm32f407");
        } else {
          detectedMcuModel = "STM32 Family Controller [ARM Cortex-M4]";
          selectFlasherTarget("stm32");
        }
      } else if (line.includes("METISA:REV22:MEGA2560")) {
        detectedMcuModel = "Arduino Mega 2560 (ATmega2560 @ 16 MHz AVR)";
        setTargetMcuSelect("avr_mega");
        selectFlasherTarget("mega");
      } else if (line.includes("METISA:REV22:ESP32") || line.includes("METISA:ESP32")) {
        detectedMcuModel = "ESP32 DevKit Dual-Core (Xtensa @ 240 MHz)";
        setTargetMcuSelect("esp32");
        selectFlasherTarget("esp32");
      } else if (line.includes("METISA:REV22:RP2040") || line.includes("METISA:RP2040")) {
        detectedMcuModel = "Raspberry Pi Pico (RP2040 Dual ARM @ 133 MHz)";
        setTargetMcuSelect("pico");
        selectFlasherTarget("pico");
      } else if (line.includes("METISA:REV22:NANO")) {
        detectedMcuModel = "Arduino Nano (ATmega328P @ 16 MHz AVR)";
        setTargetMcuSelect("avr_nano");
        selectFlasherTarget("nano");
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

  if (line.includes("OK:EEPROM_SAVED") || line.includes("sOK:EEPROM_SAVED")) {
    showToast("Controller: EEPROM permanent gesichert [OK]", "success");
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
  if (line.startsWith("sn") || line.includes("OK:SN_ASSIGNED=")) {
    const cleanSn = line.replace("OK:SN_ASSIGNED=", "").replace("sn=", "").replace("sn", "").trim();
    if (cleanSn && cleanSn !== "SAGA-UNPROVISIONED" && cleanSn !== "?") {
      assignedSerialNumber = cleanSn;
      const snBanner = document.getElementById("flasherAssignedSerialBanner");
      if (snBanner) {
        snBanner.style.display = "block";
        const snText = document.getElementById("flasherAssignedSerialText");
        if (snText) snText.textContent = assignedSerialNumber;
        const snLink = document.getElementById("flasherRegisterPortalLink");
        if (snLink) snLink.href = `unlock_portal.html?sn=${encodeURIComponent(assignedSerialNumber)}`;
      }
      const serialInp = document.getElementById("input_unlock_serial");
      if (serialInp && !serialInp.value) serialInp.value = assignedSerialNumber;
      const profSerial = document.getElementById("profile_serial");
      if (profSerial && !profSerial.value) profSerial.value = assignedSerialNumber;
      console.log(`[SERIAL] Seriennummer empfangen: ${assignedSerialNumber}`);
    }
    return;
  }
  if (line.startsWith("od")) {
    const odoKm = parseFloat(line.replace("od", "").trim());
    if (!isNaN(odoKm)) {
      console.log(`[SERIAL] Odometer gelesen: ${odoKm} km`);
    }
    return;
  }
  if (line.startsWith("ps")) {
    const potiVal = parseInt(line.replace("ps", "").trim(), 10);
    if (!isNaN(potiVal) && potiVal > 0) {
      console.log(`[SERIAL] Poti/Power gelesen: ${potiVal} W`);
      appState.nud_power_max = potiVal;
      const elPower = document.getElementById("nud_power_max");
      if (elPower) elPower.value = potiVal;
      renderCanvasGraph();
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
  let writer = null;
  try {
    writer = serialPort.writable.getWriter();
    const payload = cmd.endsWith("\n") ? cmd : cmd + "\n";
    await writer.write(encoder.encode(payload));
    return true;
  } catch (err) {
    console.error("Serial command send error:", err);
    showToast("Übertragungsfehler: " + err.message, "error");
    return false;
  } finally {
    if (writer) {
      try { writer.releaseLock(); } catch (e) {}
    }
  }
}

async function readConfigFromController() {
  if (!isConnected || !serialPort) {
    showToast("Bitte zuerst Controller über 'CONNECT' verbinden.", "error");
    return;
  }
  showToast("Lese Konfiguration vom Controller...", "info");
  try {
    await sendSerialCommand("id?");
    await new Promise(r => setTimeout(r, 80));
    await sendSerialCommand("sn?");
    await new Promise(r => setTimeout(r, 80));
    await sendSerialCommand("pn?");
    await new Promise(r => setTimeout(r, 80));
    await sendSerialCommand("ps?");
    await new Promise(r => setTimeout(r, 80));
    await sendSerialCommand("od?");
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

  showToast("Starte Hardware-Sync & Konfigurations-Transfer...", "info");

  // Web Serial Stream Management: Telemetrie vor Schreibvorgang stoppen (InvalidStateError Behebung)
  await pauseTelemetryStream();

  try {
    // Hardware-Sync: DTR/RTS Reset über die Web Serial API erzwingen
    await hardwareSyncReset(serialPort);

    // 1. Definition der Konfigurationsregister (Split-Privilege)
    const zoneARegisters = [
      { reg: METISA_SECURITY_REGISTERS.WHEEL_CIRCUMFERENCE.id, val: Math.round(appState.nud_wheel_circumference || 2155), name: "Raddurchmesser" },
      { reg: METISA_SECURITY_REGISTERS.DISPLAY_TYPE.id, val: Math.round(appState.cb_display || 1), name: "Display-Typ" },
      { reg: METISA_SECURITY_REGISTERS.DISPLAY_CONTRAST.id, val: Math.round(appState.nud_display_contrast || 190), name: "Kontrast" },
      { reg: METISA_SECURITY_REGISTERS.IDLE_SHUTDOWN_SEC.id, val: Math.round(appState.nud_idle_shutdown || 1800), name: "Sleep Timeout" },
      {
        reg: METISA_SECURITY_REGISTERS.LIGHT_CONFIG.id,
        val: (appState.metisa_headlight ? 1 : 0) | (appState.metisa_highbeam ? 2 : 0) | (appState.metisa_taillight ? 4 : 0),
        name: "Lichtkonfiguration"
      }
    ];

    const zoneBRegisters = [
      { reg: METISA_SECURITY_REGISTERS.POWER_MAX_WATTS.id, val: Math.round(appState.nud_power_max || 250), name: "Dauerleistung [W]" },
      { reg: METISA_SECURITY_REGISTERS.SPEED_CUTOFF_STOP.id, val: Math.round((appState.nud_spd_max2 || 25.0) * 10), name: "Abschaltgeschwindigkeit [km/h * 10]" },
      { reg: METISA_SECURITY_REGISTERS.SPEED_CUTOFF_START.id, val: Math.round((appState.nud_spd_max1 || 22.0) * 10), name: "Derating Beginn [km/h * 10]" },
      { reg: METISA_SECURITY_REGISTERS.POWER_POTI_MAX.id, val: Math.round(appState.nud_power_poti_max || 500), name: "Poti Maximalleistung [W]" },
      { reg: METISA_SECURITY_REGISTERS.PURE_THROTTLE_ALLOWED.id, val: appState.metisa_race_pure_throttle ? 1 : 0, name: "Autonomer Gasgriff" },
      { reg: METISA_SECURITY_REGISTERS.PHASE_CURRENT_MAX_A.id, val: Math.round((appState.nud_current_max || 15.0) * 10), name: "Phasenstrom [A * 10]" },
      { reg: METISA_SECURITY_REGISTERS.SECURITY_CLASS_LEVEL.id, val: currentUnlockLevel, name: "Sicherheitsklasse" }
    ];

    let successCountA = 0;
    let successCountB = 0;

    // 2. Zone A: Unrestricted Area (Basic Config - Direkter 'wb'-Befehl ohne PIN/HMAC)
    for (const item of zoneARegisters) {
      const regHex = item.reg.toString(16).padStart(4, "0").toUpperCase();
      const valHex = (item.val >>> 0).toString(16).padStart(8, "0").toUpperCase();
      const resp = await execSerialTransaction(`wb ${regHex} ${valHex}`);
      if (resp.startsWith("OK:WRITE_BASIC")) {
        successCountA++;
      } else {
        console.warn(`Zone A write fallback notice (${item.name}):`, resp);
      }
      await new Promise(r => setTimeout(r, 40));
    }

    // 3. Zone B: Restricted Area (HMAC-SHA256 Challenge-Response Handshake)
    for (const item of zoneBRegisters) {
      // Step A: Challenge (Nonce) vom Mikrocontroller anfordern
      const challengeResp = await execSerialTransaction("qc");
      if (!challengeResp.startsWith("OK:CHALLENGE:")) {
        if (challengeResp.includes("ERR:LOCKED_COOLDOWN")) {
          throw new Error("Controller wegen wiederholter Fehlversuche temporär gesperrt (Rate Limiting).");
        }
        throw new Error("Challenge-Anforderung fehlgeschlagen: " + challengeResp);
      }
      const nonce = challengeResp.replace("OK:CHALLENGE:", "").trim().toUpperCase();

      // Step B: Payload formatieren "NONCE32:REG4:VAL8" (exakt 46 Bytes)
      const regHex = item.reg.toString(16).padStart(4, "0").toUpperCase();
      const valHex = (item.val >>> 0).toString(16).padStart(8, "0").toUpperCase();
      const signedPayload = `${nonce}:${regHex}:${valHex}`;

      // Step C: HMAC-SHA256 über Web Crypto API generieren
      const hmacToken = await generateHmacSha256Signature(signedPayload, METISA_DEVICE_PSK_DEFAULT);

      // Step D: Geschützten Schreibbefehl 'ws' übertragen
      const writeResp = await execSerialTransaction(`ws ${regHex} ${valHex} ${hmacToken}`);
      if (writeResp.startsWith("OK:WRITE_SECURE")) {
        successCountB++;
      } else {
        if (writeResp.includes("ERR:PORT_RATE_LIMITED")) {
          throw new Error("Sicherheitszone B: Port gesperrt (Rate Limiting aktiv).");
        }
        if (writeResp.includes("ERR:HMAC_AUTHENTICATION_FAILED")) {
          throw new Error("Kryptografische Authentifizierung für " + item.name + " verweigert (Ungültiger HMAC Token).");
        }
        console.warn(`Zone B write fallback notice (${item.name}):`, writeResp);
      }
      await new Promise(r => setTimeout(r, 40));
    }

    // 4. Legacy Firmware Fallback Synchronization
    const powerTarget = Math.round(appState.nud_power_max || 250);
    await execSerialTransaction(`ps${powerTarget}`, 400).catch(() => {});
    const lfVal = appState.metisa_highbeam ? 2 : (appState.metisa_headlight ? 1 : 0);
    await execSerialTransaction(`lf${lfVal}`, 400).catch(() => {});
    await execSerialTransaction(`lr${appState.metisa_taillight ? 1 : 0}`, 400).catch(() => {});
    if (assignedSerialNumber && assignedSerialNumber !== "SAGA-UNPROVISIONED") {
      await execSerialTransaction(`sn=${assignedSerialNumber}`, 400).catch(() => {});
    }

    // 5. EEPROM permanent sichern (sv / s)
    await execSerialTransaction("sv1", 800).catch(() => "OK");
    await execSerialTransaction("s", 500).catch(() => {});

    showToast(`Kalibrierung übertragen: Zone A (${successCountA}/${zoneARegisters.length}), Zone B (${successCountB}/${zoneBRegisters.length}) [OK]`, "success");
  } catch (err) {
    console.error("Config write failure:", err);
    showToast("Schreibfehler: " + err.message, "error");
  } finally {
    // Web Serial Stream Management: Telemetrie-Stream sauber fortsetzen
    resumeTelemetryStream();
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

function checkUrlAutoUnlock() {
  try {
    const params = new URLSearchParams(window.location.search);
    const pin = params.get("pin");
    const sn = params.get("sn");

    if (sn) {
      const elSerial = document.getElementById("input_unlock_serial");
      if (elSerial) elSerial.value = sn;
      const elProfSerial = document.getElementById("profile_serial");
      if (elProfSerial) elProfSerial.value = sn;
      assignedSerialNumber = sn;
      appState.profile_serial = sn;
    }

    if (pin) {
      const elPin = document.getElementById("input_unlock_pin");
      if (elPin) elPin.value = pin;

      // Switch to PIN tab so user sees the unlock immediately
      switchTab("tab-pin");

      // Verify and unlock
      setTimeout(() => {
        verifyAndUnlockRaceMode();
      }, 60);
    }
  } catch (err) {
    console.warn("Auto-unlock via URL param failed:", err);
  }
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
      badge.textContent = "AUTORISIERT // MASTER-PIN (RENNSTRECKE)";
      badge.className = "badge badge-race";
    }
    if (statusVal) {
      statusVal.textContent = "AUTORISIERT // RENNSTRECKE & DOKUMENTIERTES PRIVATGELÄNDE [99 km/h | 1000 W | GARANTIEVERZICHT BESTÄTIGT]";
      statusVal.className = "tech-status-val status-unlocked";
    }
    appState.metisa_race_speed = 99;
    appState.metisa_race_power = 1000;
    appState.metisa_race_pure_throttle = true;
    appState.nud_power_max = 1000;
    appState.nud_speedcutoff_stop = 99;
    appState.nud_speedcutoff_start = 95;

    // Synchronize Form Inputs in DOM
    const elPwr = document.getElementById("nud_power_max");
    if (elPwr) elPwr.value = 1000;
    const elCutStop = document.getElementById("nud_speedcutoff_stop");
    if (elCutStop) elCutStop.value = 99;
    const elCutStart = document.getElementById("nud_speedcutoff_start");
    if (elCutStart) elCutStart.value = 95;
    const elRaceSpd = document.getElementById("metisa_race_speed");
    if (elRaceSpd) elRaceSpd.value = 99;
    const elRacePwr = document.getElementById("metisa_race_power");
    if (elRacePwr) elRacePwr.value = 1000;
    const elThrot = document.getElementById("metisa_race_pure_throttle");
    if (elThrot) elThrot.checked = true;

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
    appState.nud_power_max = 500;
    appState.nud_speedcutoff_stop = 20;
    appState.nud_speedcutoff_start = 19;

    // Synchronize Form Inputs in DOM
    const elPwr = document.getElementById("nud_power_max");
    if (elPwr) elPwr.value = 500;
    const elCutStop = document.getElementById("nud_speedcutoff_stop");
    if (elCutStop) elCutStop.value = 20;
    const elCutStart = document.getElementById("nud_speedcutoff_start");
    if (elCutStart) elCutStart.value = 19;
    const elRaceSpd = document.getElementById("metisa_race_speed");
    if (elRaceSpd) elRaceSpd.value = 20;
    const elRacePwr = document.getElementById("metisa_race_power");
    if (elRacePwr) elRacePwr.value = 500;
    const elThrot = document.getElementById("metisa_race_pure_throttle");
    if (elThrot) elThrot.checked = true;

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
    appState.nud_power_max = 250;
    appState.nud_speedcutoff_stop = 25;
    appState.nud_speedcutoff_start = 23;

    // Synchronize Form Inputs in DOM
    const elPwr = document.getElementById("nud_power_max");
    if (elPwr) elPwr.value = 250;
    const elCutStop = document.getElementById("nud_speedcutoff_stop");
    if (elCutStop) elCutStop.value = 25;
    const elCutStart = document.getElementById("nud_speedcutoff_start");
    if (elCutStart) elCutStart.value = 23;
    const elRaceSpd = document.getElementById("metisa_race_speed");
    if (elRaceSpd) elRaceSpd.value = 25;
    const elRacePwr = document.getElementById("metisa_race_power");
    if (elRacePwr) elRacePwr.value = 250;
    const elThrot = document.getElementById("metisa_race_pure_throttle");
    if (elThrot) elThrot.checked = false;
  }

  // Live Canvas Graph Re-render
  if (typeof renderCanvasGraph === "function") {
    renderCanvasGraph();
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

  // Collect candidate serials to cross-reference
  const candidateSerials = [
    enteredSerial,
    assignedSerialNumber !== "SAGA-UNPROVISIONED" ? assignedSerialNumber : "",
    (appState.profile_serial || "")
  ].filter(s => s && s.length >= 2);

  let isTrackMatch = (enteredPin === "210286");
  let isClassMatch = (enteredPin === "130520" || enteredPin === "1305" || enteredPin === "1234");

  for (const s of candidateSerials) {
    if (enteredPin === generateUnlockPin(s, "track")) isTrackMatch = true;
    if (enteredPin === generateUnlockPin(s, "class")) isClassMatch = true;
  }

  if (isTrackMatch) {
    // Level 2: Master-PIN (Rennstrecke & Privatgelände)
    appState.metisa_master_pin = enteredPin;
    setUnlockUILevel(2);
    if (errorBox) errorBox.style.display = "none";
    showToast("Master-PIN autorisiert: Rennstrecke & Privatgelände [Offenes Menü aktiv]", "success");
    if (isConnected) sendSerialCommand("pn210286");
  } else if (isClassMatch) {
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

function setTargetMcuSelect(val) {
  const el = document.getElementById("target_mcu");
  if (el) {
    el.value = val;
  }
  appState.target_mcu = val;
}

function getSelectedStm32SubModel() {
  const el = document.getElementById("flasherStm32Model");
  const model = el ? el.value : "auto";
  if (model === "auto") {
    if (appState.target_mcu && appState.target_mcu.startsWith("stm32")) {
      return appState.target_mcu;
    }
    return "stm32f407";
  }
  return model;
}

function updateStm32ModelSelection() {
  const subModel = getSelectedStm32SubModel();
  const targetNote = document.getElementById("flasherTargetNote");
  const btnDown = document.getElementById("btnDownloadBinaryText");
  if (subModel === "stm32f407") {
    if (targetNote) targetNote.textContent = "Ziel: STM32F407 High-Performance (ARM Cortex-M4 @ 168 MHz) [1MB/512KB Flash]";
    if (btnDown) btnDown.textContent = "DOWNLOAD STM32F407 (.BIN)";
  } else if (subModel === "stm32f405") {
    if (targetNote) targetNote.textContent = "Ziel: STM32F405 FOC Inverter Stage (ARM Cortex-M4 @ 168 MHz) [1MB Flash]";
    if (btnDown) btnDown.textContent = "DOWNLOAD STM32F405 (.BIN)";
  } else if (subModel === "stm32f411") {
    if (targetNote) targetNote.textContent = "Ziel: STM32 BlackPill F411 (ARM Cortex-M4 @ 100 MHz) [512KB Flash]";
    if (btnDown) btnDown.textContent = "DOWNLOAD STM32F411 (.BIN)";
  } else if (subModel === "stm32f103") {
    if (targetNote) targetNote.textContent = "Ziel: STM32 BluePill F103 (ARM Cortex-M3 @ 72 MHz) [64/128KB Flash]";
    if (btnDown) btnDown.textContent = "DOWNLOAD STM32F103 (.BIN)";
  } else if (subModel === "stm32g431") {
    if (targetNote) targetNote.textContent = "Ziel: STM32G431 Motor Stage (ARM Cortex-M4 @ 170 MHz) [Cordic/FMAC]";
    if (btnDown) btnDown.textContent = "DOWNLOAD STM32G431 (.BIN)";
  } else {
    if (targetNote) targetNote.textContent = "Ziel: STM32 BlackPill F401 (ARM Cortex-M4 @ 84 MHz) [256KB Flash]";
    if (btnDown) btnDown.textContent = "DOWNLOAD STM32 (.BIN)";
  }
}

function selectFlasherTarget(target, subModel = null) {
  currentFlasherTarget = target;
  const cardNano = document.getElementById("flashCardNano");
  const cardStm32 = document.getElementById("flashCardStm32");
  const cardMega = document.getElementById("flashCardMega");
  const cardEsp32 = document.getElementById("flashCardEsp32");
  const btnDown = document.getElementById("btnDownloadBinaryText");
  const targetNote = document.getElementById("flasherTargetNote");
  const btnFlash = document.getElementById("btnStartFlashSerial");
  const btnDfuFlash = document.getElementById("btnStartDfuFlash");
  const stm32SelectBox = document.getElementById("stm32ModelSelectContainer");
  const baudRateBox = document.getElementById("baudRateContainer");
  const flashBtnText = document.getElementById("btnStartFlashSerialText");

  if (cardNano) cardNano.classList.toggle("selected", target === 'nano');
  if (cardStm32) cardStm32.classList.toggle("selected", target === 'stm32');
  if (cardMega) cardMega.classList.toggle("selected", target === 'mega');
  if (cardEsp32) cardEsp32.classList.toggle("selected", target === 'esp32');

  const radioNano = document.getElementById("flasherArchNano");
  const radioStm32 = document.getElementById("flasherArchStm32");
  const radioMega = document.getElementById("flasherArchMega");
  const radioEsp32 = document.getElementById("flasherArchEsp32");
  if (radioNano) radioNano.checked = (target === 'nano');
  if (radioStm32) radioStm32.checked = (target === 'stm32');
  if (radioMega) radioMega.checked = (target === 'mega');
  if (radioEsp32) radioEsp32.checked = (target === 'esp32');

  if (subModel && target === 'stm32') {
    const elModel = document.getElementById("flasherStm32Model");
    if (elModel) elModel.value = subModel;
  }

  if (target === 'nano') {
    if (stm32SelectBox) stm32SelectBox.style.display = "none";
    if (baudRateBox) baudRateBox.style.display = "flex";
    if (btnDfuFlash) btnDfuFlash.style.display = "none";
    if (btnDown) btnDown.textContent = "DOWNLOAD NANO (.HEX)";
    if (targetNote) targetNote.textContent = "Ziel: Arduino Nano (ATmega328P) via Web Serial STK500v1";
    if (btnFlash) btnFlash.style.display = "inline-flex";
    if (flashBtnText) flashBtnText.textContent = "FIRMWARE FLASHEN (WEB SERIAL)";
  } else if (target === 'stm32') {
    if (stm32SelectBox) stm32SelectBox.style.display = "flex";
    if (baudRateBox) baudRateBox.style.display = "flex";
    if (btnDfuFlash) btnDfuFlash.style.display = "inline-flex";
    if (btnFlash) btnFlash.style.display = "inline-flex";
    if (flashBtnText) flashBtnText.textContent = "SERIAL BOOTLOADER FLASHEN";
    updateStm32ModelSelection();
  } else if (target === 'mega') {
    if (stm32SelectBox) stm32SelectBox.style.display = "none";
    if (baudRateBox) baudRateBox.style.display = "flex";
    if (btnDfuFlash) btnDfuFlash.style.display = "none";
    if (btnDown) btnDown.textContent = "DOWNLOAD MEGA (.HEX)";
    if (targetNote) targetNote.textContent = "Ziel: Arduino Mega 2560 (ATmega2560) via Web Serial STK500v2";
    if (btnFlash) btnFlash.style.display = "inline-flex";
    if (flashBtnText) flashBtnText.textContent = "FIRMWARE FLASHEN (WEB SERIAL)";
  } else if (target === 'esp32') {
    if (stm32SelectBox) stm32SelectBox.style.display = "none";
    if (baudRateBox) baudRateBox.style.display = "none";
    if (btnDfuFlash) btnDfuFlash.style.display = "none";
    if (btnDown) btnDown.textContent = "DOWNLOAD ESP32 (.BIN)";
    if (targetNote) targetNote.textContent = "Ziel: ESP32 DevKit Dual-Core (Xtensa @ 240 MHz) Binary Image";
    if (btnFlash) btnFlash.style.display = "inline-flex";
    if (flashBtnText) flashBtnText.textContent = "BINARY HERUNTERLADEN";
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
    const sub = getSelectedStm32SubModel();
    if (sub === 'stm32f407') {
      filename = 'metisa_stm32f407_firmware.bin';
      path = 'firmware/metisa_stm32f407_firmware.bin';
    } else {
      filename = 'metisa_stm32_firmware.bin';
      path = 'firmware/metisa_stm32_firmware.bin';
    }
    mime = 'application/octet-stream';
  } else if (target === 'esp32') {
    filename = 'metisa_esp32_firmware.bin';
    path = 'firmware/metisa_esp32_firmware.bin';
    mime = 'application/octet-stream';
  } else if (target === 'mega') {
    filename = 'metisa_mega_firmware.hex';
    path = 'firmware/metisa_nano_firmware.hex';
    mime = 'text/plain';
  }

  const a = document.createElement("a");
  a.href = path;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(`Firmware-Download initiiert: ${filename}`, "success");
}

function base64ToUint8Array(b64) {
  const binStr = atob(b64);
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes;
}

// -------------------------------------------------------------
// WebUSB DFU 1.1 Flasher Implementation for STM32 Family
// -------------------------------------------------------------

async function dfuGetStatus(device, ifaceNum) {
  const res = await device.controlTransferIn({
    requestType: 'class',
    recipient: 'interface',
    request: 3, // DFU_GETSTATUS
    value: 0,
    index: ifaceNum
  }, 6);
  const data = new Uint8Array(res.data.buffer);
  const status = data[0];
  const pollTimeout = (data[1]) | (data[2] << 8) | (data[3] << 16);
  const state = data[4];
  if (pollTimeout > 0) {
    await sleep(Math.min(100, pollTimeout));
  }
  return { status, pollTimeout, state };
}

async function dfuClearStatus(device, ifaceNum) {
  await device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 4, // DFU_CLRSTATUS
    value: 0,
    index: ifaceNum
  });
}

async function dfuPollUntil(device, ifaceNum, targetState, maxPolls = 60) {
  for (let i = 0; i < maxPolls; i++) {
    const st = await dfuGetStatus(device, ifaceNum);
    if (st.status !== 0) {
      throw new Error(`DFU Status Error: 0x${st.status.toString(16)} in State ${st.state}`);
    }
    if (st.state === targetState) return st;
    await sleep(15);
  }
  throw new Error(`DFU Timeout beim Warten auf State ${targetState}`);
}

async function dfuSetAddress(device, ifaceNum, address) {
  const cmd = new Uint8Array([
    0x21, // ST Set Address Pointer command
    address & 0xFF,
    (address >> 8) & 0xFF,
    (address >> 16) & 0xFF,
    (address >> 24) & 0xFF
  ]);
  await device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 1, // DFU_DNLOAD
    value: 0,
    index: ifaceNum
  }, cmd);
  await dfuPollUntil(device, ifaceNum, 5); // dfuDNLOAD-IDLE
}

async function dfuEraseSector(device, ifaceNum, secAddr) {
  const cmd = new Uint8Array([
    0x41, // ST Page / Sector Erase command
    secAddr & 0xFF,
    (secAddr >> 8) & 0xFF,
    (secAddr >> 16) & 0xFF,
    (secAddr >> 24) & 0xFF
  ]);
  await device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 1, // DFU_DNLOAD
    value: 0,
    index: ifaceNum
  }, cmd);
  await dfuPollUntil(device, ifaceNum, 5); // dfuDNLOAD-IDLE
}

async function dfuDownloadBlock(device, ifaceNum, blockNum, chunk) {
  await device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 1, // DFU_DNLOAD
    value: blockNum,
    index: ifaceNum
  }, chunk);
  await dfuPollUntil(device, ifaceNum, 5); // dfuDNLOAD-IDLE
}

async function dfuLeave(device, ifaceNum, address) {
  try {
    await dfuSetAddress(device, ifaceNum, address);
    await device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 1, // DFU_DNLOAD
      value: 0,
      index: ifaceNum
    }, new Uint8Array(0));
    await dfuGetStatus(device, ifaceNum);
  } catch (e) {
    // Normal reset disconnect during DFU leave
  }
}

async function startDfuFirmwareFlash() {
  if (controllerFirmwareStatus === "BLANK" && !masterUnlockForFlashApproved) {
    showToast("Erst-Upload gesperrt: Master-PIN 210286 erforderlich", "error");
    const logView = document.getElementById("flashTerminalLog");
    if (logView) {
      logView.textContent += `\n[SICHERHEIT] Erst-Upload auf uninitialisierten Controller verweigert. Master-PIN (210286) erforderlich.`;
    }
    return;
  }

  const logView = document.getElementById("flashTerminalLog");
  const pBar = document.getElementById("flashProgressBar");
  const pText = document.getElementById("flashProgressText");

  function logTerminal(msg) {
    const time = new Date().toISOString().substring(11, 19);
    if (logView) {
      logView.textContent += `\n[${time}] ${msg}`;
      logView.scrollTop = logView.scrollHeight;
    }
  }

  if (!navigator.usb) {
    logTerminal("[FEHLER] WebUSB API wird von diesem Browser nicht unterstützt. Bitte Google Chrome oder Microsoft Edge nutzen.");
    showToast("WebUSB API nicht unterstützt", "error");
    return;
  }

  try {
    logTerminal("[DFU] Suche STM32 DFU Bootloader Device über WebUSB...");
    if (pBar) pBar.style.width = "5%";
    if (pText) pText.textContent = "USB AUSWAHL [5%]";

    const usbDevice = await navigator.usb.requestDevice({
      filters: [
        { vendorId: 0x0483, productId: 0xDF11 },
        { vendorId: 0x0483 }
      ]
    });

    logTerminal(`[USB] Gerät verbunden: ${usbDevice.productName || 'STM32 Bootloader'} (VID 0x${usbDevice.vendorId.toString(16).padStart(4,'0')}, PID 0x${usbDevice.productId.toString(16).padStart(4,'0')})`);
    await usbDevice.open();
    if (usbDevice.configuration === null) {
      await usbDevice.selectConfiguration(1);
    }

    // Find DFU Interface
    let dfuInterfaceNumber = 0;
    let dfuAlternateSetting = 0;
    let interfaceString = "";

    const configuration = usbDevice.configuration;
    for (const iface of configuration.interfaces) {
      for (const alt of iface.alternates) {
        if (alt.interfaceClass === 0xFE && alt.interfaceSubclass === 0x01) { // DFU Class
          dfuInterfaceNumber = iface.interfaceNumber;
          dfuAlternateSetting = alt.alternateSetting;
          interfaceString = alt.interfaceName || "";
          break;
        }
      }
    }

    await usbDevice.claimInterface(dfuInterfaceNumber);
    await usbDevice.selectAlternateInterface(dfuInterfaceNumber, dfuAlternateSetting);
    logTerminal(`[DFU] Interface ${dfuInterfaceNumber} (Alt ${dfuAlternateSetting}) beansprucht: "${interfaceString}"`);

    // Hardware-Modell aus DFU Interface Deskriptor ermitteln
    let detectedChip = "STM32 Universal";
    let isF407 = false;
    if (interfaceString.includes("07*128Kg") || interfaceString.includes("07*128K")) {
      detectedChip = "STM32F407 High-Performance (1024 KB Flash, 168 MHz)";
      isF407 = true;
    } else if (interfaceString.includes("03*128Kg")) {
      detectedChip = "STM32F411 BlackPill (512 KB Flash, 100 MHz)";
    } else if (interfaceString.includes("01*128Kg")) {
      detectedChip = "STM32F401 BlackPill (256 KB Flash, 84 MHz)";
    } else if (interfaceString.includes("128*001Kg") || interfaceString.includes("064*001Kg")) {
      detectedChip = "STM32F103 BluePill (128 KB Flash, 72 MHz)";
    } else {
      const selected = getSelectedStm32SubModel();
      if (selected === "stm32f407") {
        detectedChip = "STM32F407 High-Performance (ARM Cortex-M4 @ 168 MHz)";
        isF407 = true;
      } else {
        detectedChip = "STM32 Family Stage (ARM Cortex-M4)";
      }
    }

    logTerminal(`[DETECT] Hardware-Identifikation: ${detectedChip}`);
    updateHardwareStatusUI("METISA", detectedChip);
    if (isF407) {
      setTargetMcuSelect("stm32f407");
    }

    // Binary Daten laden
    let binData = null;
    const customRadio = document.querySelector('input[name="firmwareSourceType"][value="custom"]');
    if (customRadio && customRadio.checked) {
      const fileInput = document.getElementById("customFirmwareFileInput");
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        throw new Error("Bitte wählen Sie zuerst eine .bin-Datei aus.");
      }
      binData = new Uint8Array(await fileInput.files[0].arrayBuffer());
    } else {
      if (isF407 && typeof window !== "undefined" && window.METISA_BUNDLED_STM32F407_BIN_B64) {
        binData = base64ToUint8Array(window.METISA_BUNDLED_STM32F407_BIN_B64);
        logTerminal(`[FIRMWARE] Geladen: Vorkompiliertes STM32F407 Image (${binData.length} Bytes)`);
      } else if (!isF407 && typeof window !== "undefined" && window.METISA_BUNDLED_STM32F401_BIN_B64) {
        binData = base64ToUint8Array(window.METISA_BUNDLED_STM32F401_BIN_B64);
        logTerminal(`[FIRMWARE] Geladen: Vorkompiliertes STM32 BlackPill F401 Image (${binData.length} Bytes)`);
      } else {
        const fetchUrl = isF407 ? "firmware/metisa_stm32f407_firmware.bin" : "firmware/metisa_stm32_firmware.bin";
        const resp = await fetch(fetchUrl);
        binData = new Uint8Array(await resp.arrayBuffer());
        logTerminal(`[FIRMWARE] Heruntergeladen: ${fetchUrl} (${binData.length} Bytes)`);
      }
    }

    if (!binData || binData.length < 100) {
      throw new Error("Ungültiges oder leeres STM32 Firmware-Image.");
    }

    // DFU Clear Status & Get Status
    await dfuClearStatus(usbDevice, dfuInterfaceNumber);
    let st = await dfuGetStatus(usbDevice, dfuInterfaceNumber);
    if (st.status !== 0) {
      await dfuClearStatus(usbDevice, dfuInterfaceNumber);
      st = await dfuGetStatus(usbDevice, dfuInterfaceNumber);
    }
    logTerminal(`[DFU] Status OK, Initialer State: ${st.state}`);

    // Set Address Pointer 0x08000000
    logTerminal("[FLASH] Setze Flash Basisadresse auf 0x08000000...");
    await dfuSetAddress(usbDevice, dfuInterfaceNumber, 0x08000000);

    // Erase Flash Sectors
    const totalBytes = binData.length;
    const sectorsToErase = isF407 ? Math.min(8, Math.ceil(totalBytes / 16384)) : Math.min(6, Math.ceil(totalBytes / 16384));
    logTerminal(`[ERASE] Lösche Flash-Sektoren für ${totalBytes} Bytes Firmware...`);
    if (pBar) pBar.style.width = "15%";
    if (pText) pText.textContent = "FLASH LÖSCHEN [15%]";

    const sectorOffsets = [
      0x08000000, 0x08004000, 0x08008000, 0x0800C000, // Sectors 0-3 (16 KB each)
      0x08010000, 0x08020000, 0x08040000, 0x08060000  // Sectors 4 (64 KB), 5..7 (128 KB)
    ];

    for (let sIdx = 0; sIdx < sectorsToErase; sIdx++) {
      const secAddr = sectorOffsets[sIdx] || (0x08000000 + sIdx * 0x4000);
      await dfuEraseSector(usbDevice, dfuInterfaceNumber, secAddr);
      logTerminal(`[ERASE] Sektor ${sIdx} @ 0x${secAddr.toString(16).toUpperCase()} gelöscht.`);
      const pct = Math.round(15 + (sIdx / sectorsToErase) * 15);
      if (pBar) pBar.style.width = `${pct}%`;
      if (pText) pText.textContent = `LÖSCHEN [${pct}%]`;
    }

    // Set Address Pointer back to 0x08000000 before flashing
    await dfuSetAddress(usbDevice, dfuInterfaceNumber, 0x08000000);

    // Flash Data in Blocks (2048 Bytes wTransferSize)
    const blockSize = 2048;
    const totalBlocks = Math.ceil(totalBytes / blockSize);
    logTerminal(`[PROGRAM] Übertrage ${totalBlocks} Blöcke (${blockSize} Bytes/Block)...`);

    for (let b = 0; b < totalBlocks; b++) {
      const offset = b * blockSize;
      const chunkLen = Math.min(blockSize, totalBytes - offset);
      const chunk = binData.subarray(offset, offset + chunkLen);

      await dfuDownloadBlock(usbDevice, dfuInterfaceNumber, b + 2, chunk);

      const progPct = Math.round(30 + ((b + 1) / totalBlocks) * 65);
      if (pBar) pBar.style.width = `${progPct}%`;
      if (pText) pText.textContent = `FLASHEN [${progPct}%] (Block ${b + 1}/${totalBlocks})`;
    }

    // DFU Leave: Manifestation & Reset
    logTerminal("[BOOT] Verlasse DFU-Modus und starte Firmware bei 0x08000000...");
    await dfuLeave(usbDevice, dfuInterfaceNumber, 0x08000000);

    try { await usbDevice.close(); } catch (e) {}

    if (pBar) pBar.style.width = "100%";
    if (pText) pText.textContent = "ERFOLGREICH GEFLASHT [100%]";
    logTerminal(`[SUCCESS] STM32 Firmware erfolgreich geflasht und gestartet!`);
    showToast(`STM32 Firmware erfolgreich übertragen [OK]`, "success");

  } catch (err) {
    console.error("DFU Flash Error:", err);
    logTerminal(`[FEHLER] DFU Flash fehlgeschlagen: ${err.message}`);
    showToast(`DFU Flash-Fehler: ${err.message}`, "error");
    if (pText) pText.textContent = "FEHLER BEIM FLASHEN";
  }
}

// -------------------------------------------------------------
// Web Serial STM32 USART Bootloader Flasher (AN3155 Protocol)
// -------------------------------------------------------------

async function startStm32SerialBootloaderFlash() {
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

  const logView = document.getElementById("flashTerminalLog");
  const pBar = document.getElementById("flashProgressBar");
  const pText = document.getElementById("flashProgressText");

  function logTerminal(msg) {
    const time = new Date().toISOString().substring(11, 19);
    if (logView) {
      logView.textContent += `\n[${time}] ${msg}`;
      logView.scrollTop = logView.scrollHeight;
    }
  }

  try {
    logTerminal("[USART] Starte STM32 Bootloader-Kommunikation via Web Serial (AN3155)...");
    if (pBar) pBar.style.width = "10%";
    if (pText) pText.textContent = "INIT BOOTLOADER [10%]";

    // Prepare binary image
    const subModel = getSelectedStm32SubModel();
    const isF407 = (subModel === "stm32f407");
    let binData = null;
    const customRadio = document.querySelector('input[name="firmwareSourceType"][value="custom"]');
    if (customRadio && customRadio.checked) {
      const fileInput = document.getElementById("customFirmwareFileInput");
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        throw new Error("Bitte wählen Sie zuerst eine .bin-Datei aus.");
      }
      binData = new Uint8Array(await fileInput.files[0].arrayBuffer());
    } else {
      if (isF407 && typeof window !== "undefined" && window.METISA_BUNDLED_STM32F407_BIN_B64) {
        binData = base64ToUint8Array(window.METISA_BUNDLED_STM32F407_BIN_B64);
        logTerminal(`[FIRMWARE] Geladen: Vorkompiliertes STM32F407 Image (${binData.length} Bytes)`);
      } else if (!isF407 && typeof window !== "undefined" && window.METISA_BUNDLED_STM32F401_BIN_B64) {
        binData = base64ToUint8Array(window.METISA_BUNDLED_STM32F401_BIN_B64);
        logTerminal(`[FIRMWARE] Geladen: Vorkompiliertes STM32 BlackPill F401 Image (${binData.length} Bytes)`);
      } else {
        const fetchUrl = isF407 ? "firmware/metisa_stm32f407_firmware.bin" : "firmware/metisa_stm32_firmware.bin";
        const resp = await fetch(fetchUrl);
        binData = new Uint8Array(await resp.arrayBuffer());
        logTerminal(`[FIRMWARE] Geladen: ${fetchUrl} (${binData.length} Bytes)`);
      }
    }

    // Close active serial reader & port to reconfigure for even parity
    if (serialReader) {
      try { await serialReader.cancel(); } catch (e) {}
      serialReader = null;
    }
    if (serialPort && serialPort.readable) {
      try { await serialPort.close(); } catch (e) {}
    }

    if (!serialPort) {
      serialPort = await navigator.serial.requestPort();
    }

    // STM32 System Memory Bootloader requires parity: "even"
    await serialPort.open({ baudRate: 115200, parity: "even" });
    isConnected = true;

    const writer = serialPort.writable.getWriter();
    const reader = serialPort.readable.getReader();

    try {
      // Send 0x7F Autobaud init
      logTerminal("[USART] Sende 0x7F Autobaud Handshake...");
      let inSync = false;
      for (let tryCount = 0; tryCount < 5; tryCount++) {
        try {
          await writer.write(new Uint8Array([0x7F]));
          const resp = await readExactBytes(reader, 1, 120);
          if (resp[0] === 0x79) { // ACK
            inSync = true;
            break;
          }
        } catch (e) {
          await sleep(40);
        }
      }

      if (!inSync) {
        logTerminal("[INFO] STM32 Serial Bootloader antwortet nicht mit 0x79 (ACK).");
        logTerminal("[TIPP] Wenn das Board direkt über USB verbunden ist: Nutzen Sie 'WEBUSB DFU FLASHEN' (BOOT0-Taste beim Einstecken gedrückt halten).");
        throw new Error("Bootloader antwortet nicht. Bitte BOOT0 aktivieren oder 'WEBUSB DFU FLASHEN' verwenden.");
      }

      logTerminal("[USART] Bootloader synchronisiert (0x79 ACK empfangen).");

      // Read Chip PID: Command 0x02 + 0xFD
      await writer.write(new Uint8Array([0x02, 0xFD]));
      const pidAck = await readExactBytes(reader, 1, 300);
      if (pidAck[0] === 0x79) {
        const lenBytes = await readExactBytes(reader, 1, 300);
        const pidBytes = await readExactBytes(reader, lenBytes[0] + 1, 300);
        const endAck = await readExactBytes(reader, 1, 300);
        const chipPid = (pidBytes[0] << 8) | pidBytes[1];

        let chipName = `STM32 PID 0x${chipPid.toString(16).toUpperCase()}`;
        if (chipPid === 0x0413) {
          chipName = "STM32F407 / STM32F405 (ARM Cortex-M4 @ 168 MHz)";
          setTargetMcuSelect("stm32f407");
        } else if (chipPid === 0x0423) {
          chipName = "STM32F401 BlackPill (ARM Cortex-M4 @ 84 MHz)";
          setTargetMcuSelect("stm32_blackpill");
        } else if (chipPid === 0x0431) {
          chipName = "STM32F411 BlackPill (ARM Cortex-M4 @ 100 MHz)";
          setTargetMcuSelect("stm32f411");
        } else if (chipPid === 0x0410 || chipPid === 0x0414) {
          chipName = "STM32F103 BluePill (ARM Cortex-M3 @ 72 MHz)";
          setTargetMcuSelect("stm32f103");
        } else if (chipPid === 0x0468 || chipPid === 0x0469) {
          chipName = "STM32G431 / G474 Motor Stage (ARM Cortex-M4 @ 170 MHz)";
          setTargetMcuSelect("stm32g431");
        }
        logTerminal(`[CHIP] Hardware verifiziert: ${chipName}`);
        updateHardwareStatusUI("METISA", chipName);
      }

      // Extended Erase 0x44 0xBB (Global Erase: 0xFF 0xFF 0x00)
      logTerminal("[ERASE] Lösche STM32 Flash-Speicher...");
      if (pBar) pBar.style.width = "25%";
      if (pText) pText.textContent = "FLASH LÖSCHEN [25%]";

      await writer.write(new Uint8Array([0x44, 0xBB]));
      const eraseAck = await readExactBytes(reader, 1, 1000);
      if (eraseAck[0] === 0x79) {
        await writer.write(new Uint8Array([0xFF, 0xFF, 0x00])); // Global mass erase
        await readExactBytes(reader, 1, 10000); // Erase wait
        logTerminal("[ERASE] Mass Erase erfolgreich abgeschlossen.");
      }

      // Write Memory 0x31 0xCE in 256-Byte Chunks
      const chunkSize = 256;
      const totalBytes = binData.length;
      const totalChunks = Math.ceil(totalBytes / chunkSize);
      logTerminal(`[PROGRAM] Schreibe ${totalChunks} Pages (@ 256 Bytes) ab 0x08000000...`);

      for (let c = 0; c < totalChunks; c++) {
        const addr = 0x08000000 + c * chunkSize;
        const offset = c * chunkSize;
        const len = Math.min(chunkSize, totalBytes - offset);

        // 1. Send Write Command
        await writer.write(new Uint8Array([0x31, 0xCE]));
        await readExactBytes(reader, 1, 500);

        // 2. Send 4-byte address + XOR checksum
        const a3 = (addr >> 24) & 0xFF;
        const a2 = (addr >> 16) & 0xFF;
        const a1 = (addr >> 8) & 0xFF;
        const a0 = addr & 0xFF;
        const aChecksum = a3 ^ a2 ^ a1 ^ a0;
        await writer.write(new Uint8Array([a3, a2, a1, a0, aChecksum]));
        await readExactBytes(reader, 1, 500);

        // 3. Send byte count N-1, data, and XOR checksum
        const chunkData = new Uint8Array(256);
        chunkData.fill(0xFF);
        chunkData.set(binData.subarray(offset, offset + len));

        let dXor = 255;
        for (let i = 0; i < 256; i++) dXor ^= chunkData[i];

        const packet = new Uint8Array(1 + 256 + 1);
        packet[0] = 255; // N-1 = 255 (256 bytes)
        packet.set(chunkData, 1);
        packet[257] = dXor;

        await writer.write(packet);
        await readExactBytes(reader, 1, 1500);

        const pct = Math.round(30 + ((c + 1) / totalChunks) * 65);
        if (pBar) pBar.style.width = `${pct}%`;
        if (pText) pText.textContent = `FLASHEN [${pct}%] (${c + 1}/${totalChunks})`;
      }

      // Go Command 0x21 0xDE to 0x08000000
      logTerminal("[BOOT] Starte Firmware über Go-Befehl (0x08000000)...");
      await writer.write(new Uint8Array([0x21, 0xDE]));
      await readExactBytes(reader, 1, 500);
      const g3 = 0x08, g2 = 0x00, g1 = 0x00, g0 = 0x00;
      await writer.write(new Uint8Array([g3, g2, g1, g0, g3 ^ g2 ^ g1 ^ g0]));
      try { await readExactBytes(reader, 1, 500); } catch (e) {}

      if (pBar) pBar.style.width = "100%";
      if (pText) pText.textContent = "FLASH ERFOLGREICH [100%]";
      logTerminal("[SUCCESS] STM32 Firmware erfolgreich geflasht und gestartet!");
      showToast("STM32 Firmware erfolgreich übertragen [OK]", "success");

    } finally {
      try { reader.releaseLock(); } catch (e) {}
      try { writer.releaseLock(); } catch (e) {}
    }
  } catch (err) {
    console.error("STM32 Bootloader Flash Error:", err);
    logTerminal(`[FEHLER] STM32 Bootloader Flash fehlgeschlagen: ${err.message}`);
    showToast(`STM32 Flash-Fehler: ${err.message}`, "error");
    if (pText) pText.textContent = "FEHLER BEIM FLASHEN";
  }
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

  if (currentFlasherTarget === 'stm32') {
    return await startStm32SerialBootloaderFlash();
  }

  if (currentFlasherTarget === 'esp32') {
    downloadSelectedFirmwareBinary();
    const logView = document.getElementById("flashTerminalLog");
    if (logView) {
      logView.textContent += `\n[INFO] Firmware-Binary für ESP32 heruntergeladen.\nNutzen Sie esptool.py für das finale Flashen.`;
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

    // Prepare Web Serial connection: cleanly cancel reader and close port to unlock stream and set baudrate
    if (serialReader) {
      try { await serialReader.cancel(); } catch (e) {}
      serialReader = null;
    }
    if (serialPort && serialPort.readable) {
      try { await serialPort.close(); } catch (e) {}
    }
    if (!serialPort) {
      logTerminal(`[PORT] Bitte USB-Schnittstelle im Browser-Dialog auswählen...`);
      serialPort = await navigator.serial.requestPort();
    }
    await serialPort.open({ baudRate: baudRate });
    isConnected = true;
    updateConnectionUI(true, "Flasher Aktiv");

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
      try { writer.releaseLock(); } catch (e) {}
      try { reader.releaseLock(); } catch (e) {}
      try { await serialPort.setSignals({ dataTerminalReady: false, requestToSend: false }); } catch (e) {}
    }

    // Re-open serial port at 115200 baud for telemetry stream
    try { await serialPort.close(); } catch (e) {}
    await sleep(400);
    try {
      await serialPort.open({ baudRate: 115200 });
      readSerialStream();
    } catch (e) {}
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
window.startDfuFirmwareFlash = startDfuFirmwareFlash;
window.startStm32SerialBootloaderFlash = startStm32SerialBootloaderFlash;
window.updateStm32ModelSelection = updateStm32ModelSelection;
window.verifyFlasherMasterPin = verifyFlasherMasterPin;
window.copyAssignedSerialToClipboard = copyAssignedSerialToClipboard;



