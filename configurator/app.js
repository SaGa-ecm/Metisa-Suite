/**
 * metisa Web Configurator - Core Application Engine
 * Universal Browser-Based Configurator for Arduino Pedelec Controller (APC) & metisa
 * 
 * Supports:
 * - 100% Backward-compatible .apc profile loading & saving
 * - Modern JSON profiles
 * - Clean C++ config.h code generation
 * - Web Serial API (USB-to-MCU direct live link)
 * - Interactive Canvas Power Curve Rendering
 * - Multi-Target Architecture Selection (AVR, STM32, RP2040, ESP32)
 * - Multi-Level PIN Security System (Master-PIN 210286)
 * - Full ECE-R 50 Lighting & Signaling Controls
 */

const APP_VERSION = "1.43-metisa";

// Default State matching Form1.cs defaults
const defaultState = {
  // Metadata & Profile
  profile_name: "Default-metisa",
  target_mcu: "esp32",          // 'avr_nano', 'avr_mega', 'stm32_blackpill', 'pico', 'esp32'
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
  nud_power_max: 250,            // StVZO Legal 250W default
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
  nud_speedcutoff_stop: 25,      // Speed hard cutoff (StVZO 25 km/h)
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
  metisa_boot_level: 0,          // 0=Legal (StVZO default on boot)
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

  ctx.clearRect(0, 0, w, h);

  // Background grid
  ctx.strokeStyle = "rgba(71, 85, 105, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 40; x < w; x += 50) { ctx.moveTo(x, 0); ctx.lineTo(x, h - 25); }
  for (let y = 10; y < h - 25; y += 30) { ctx.moveTo(40, y); ctx.lineTo(w, y); }
  ctx.stroke();

  // Axis Labels
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText("0 km/h", 40, h - 10);
  ctx.fillText("25 km/h", Math.min(w - 60, 40 + (w - 70) * (25 / 35)), h - 10);
  ctx.fillText("35 km/h", w - 45, h - 10);
  ctx.fillText("W", 15, 20);

  // Curve Parameters
  const pMax = appState.nud_power_max || 250;
  const spdStart = appState.nud_speedcutoff_start || 23;
  const spdStop = appState.nud_speedcutoff_stop || 25;
  const pThermal = appState.nud_power_thermal || 150;

  // Draw Normal Power Derating Curve
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  const maxDisplaySpd = 35;
  const maxDisplayPower = Math.max(pMax * 1.2, 500);

  for (let kmh = 0; kmh <= maxDisplaySpd; kmh += 0.5) {
    let power = pMax;
    if (kmh > spdStop) {
      power = 0;
    } else if (kmh > spdStart) {
      power = pMax * (1 - (kmh - spdStart) / (spdStop - spdStart));
    }

    const x = 40 + (w - 55) * (kmh / maxDisplaySpd);
    const y = (h - 25) - ((h - 40) * (power / maxDisplayPower));

    if (kmh === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw Thermal Limit dashed line
  ctx.strokeStyle = "#f59e0b";
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.5;
  const yThermal = (h - 25) - ((h - 40) * (pThermal / maxDisplayPower));
  ctx.beginPath();
  ctx.moveTo(40, yThermal);
  ctx.lineTo(w - 15, yThermal);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#f59e0b";
  ctx.fillText(`Thermal: ${pThermal}W`, w - 100, yThermal - 5);
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

// Motor & Speed Limits (StVZO Base Profile 1)
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

async function connectSerial() {
  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 115200 });

    isConnected = true;
    updateConnectionUI(true, "USB Verbunden");
    readSerialStream();
    showToast("USB Serial verbunden (115200 Baud)", "success");
  } catch (err) {
    console.error("Serial error:", err);
    showToast("Verbindung fehlgeschlagen: " + err.message, "error");
    updateConnectionUI(false, "Getrennt");
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
  updateConnectionUI(false, "Getrennt");
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
  // Check for APC ---raw--- packet
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
    btn.textContent = connected ? "Trennen" : "USB Verbinden";
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
    showToast("config.h in die Zwischenablage kopiert!", "success");
  });
}

function downloadConfigHeader() {
  const code = generateConfigHeader();
  downloadBlob(code, "config.h", "text/x-c");
  showToast("config.h heruntergeladen!", "success");
}

function downloadApcProfile() {
  const apc = exportApcString();
  const filename = `${appState.profile_name || "apc_profile"}.apc`;
  downloadBlob(apc, filename, "text/plain");
  showToast(`${filename} exportiert!`, "success");
}

function downloadJsonProfile() {
  const jsonStr = JSON.stringify(appState, null, 2);
  const filename = `${appState.profile_name || "apc_profile"}.json`;
  downloadBlob(jsonStr, filename, "application/json");
  showToast(`${filename} exportiert!`, "success");
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
        showToast("JSON Profil geladen", "success");
      } catch (err) {
        showToast("Ungültige JSON-Datei", "error");
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
