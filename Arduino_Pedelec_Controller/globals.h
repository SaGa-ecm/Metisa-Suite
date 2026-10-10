/*
Global variables from the main program code end up here.
(c) 2013 Thomas Jarosch / pedelecforum.de

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software Foundation,
Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
*/

#ifndef GLOBALS_H
#define GLOBALS_H

#include "hal.h"
#include "elapsed_time.h"
#include "ds1307.h"

// Global defines from the main program code
extern float mah;
extern bool display_force_text;
extern float voltage_display;
extern float current_display;
extern byte battery_percent_fromvoltage;
extern byte battery_percent_fromcapacity;
extern double power;
extern double power_display;
extern double power_set;
extern float wh;
extern double wh_human;
extern unsigned int charge_count;
extern volatile float spd;
extern volatile int cad;
extern volatile float km;
extern float range;
extern volatile unsigned long odo;
extern float temperature;
extern float altitude;
extern float altitude_start;
extern float slope;
extern int poti_stat;
extern int throttle_stat;
extern bool brake_stat;
extern volatile unsigned long wheel_time;
extern byte pulse_human;
extern double power_human;
extern bool variables_saved;

extern const int bluetooth_pin;
extern const int fet_out;
extern const int lights_pin;
extern const int lights_front_pin;
extern const int lights_high_beam_pin;
extern const int lights_rear_pin;
extern const int lights_brake_pin;
extern const int turn_signal_left_pin;
extern const int turn_signal_right_pin;
extern const int horn_pin;

extern bool lights_front_active;
extern bool lights_high_beam_active;
extern bool lights_rear_active;
extern bool lights_brake_active;
extern bool turn_left_active;
extern bool turn_right_active;
extern bool hazard_active;
extern bool horn_active;

extern void set_lights_front(bool on, bool high_beam = false);
extern void set_lights_rear(bool on);
extern void set_brake_light(bool on);
extern void set_turn_signal_left(bool on);
extern void set_turn_signal_right(bool on);
extern void set_hazard_lights(bool on);
extern void set_horn(bool on);
extern void toggle_lights_front();
extern void toggle_lights_high_beam();
extern void toggle_lights_rear();
extern void toggle_turn_signal_left();
extern void toggle_turn_signal_right();
extern void toggle_hazard_lights();
extern void update_lights_and_signals();

extern int curr_startingaid_speed;
extern int curr_spd_max1;
extern int curr_spd_max2;
extern int curr_power_max;
extern int curr_power_poti_max;
extern double curr_capacity;
extern bool current_profile;

extern bool first_aid_ignore_break;
extern bool first_aid_ignore_pas;
extern bool first_aid_ignore_speed;
extern bool first_aid_ignore_poti;
extern bool first_aid_ignore_throttle;
extern bool first_aid_ignore_temp_sensor;

extern void save_eeprom();
extern void save_shutdown();
extern void activate_new_profile();

// PIN Security System (0 = StVZO, 1 = Sport/Trail, 2 = Race/Privatgelände via Master-PIN 210286)
extern byte pin_security_level;
extern bool pure_throttle_allowed;
extern bool pin_check_and_apply(unsigned long entered_pin);
extern void pin_set_level(byte new_level);

extern RTC_DS1307 rtc;
extern Time now;

void torque_rezero();

#ifdef SUPPORT_TEMP_SENSOR
#include "DallasTemp.h"
extern DallasTemperature sensors;
#endif
#ifdef SUPPORT_THERMISTOR
extern float temperature_thermistor;
#endif

// Define own version of F() macro since compile will
// fail on newer gcc versions with a "const" warning.
// This is the version as in Arduino 1.5 and newer.
#define MY_F(string_literal) (reinterpret_cast<const __FlashStringHelper *>(PSTR(string_literal)))

#define FROM_FLASH(str) (reinterpret_cast<const __FlashStringHelper *>(str))

#if HARDWARE_REV <= 5
#define FET_ON LOW
#define FET_OFF HIGH
#else
#define FET_ON HIGH
#define FET_OFF LOW
#endif

#endif
