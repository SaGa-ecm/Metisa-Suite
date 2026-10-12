/*
metisa firmware by SaGaLabs, derived from the Arduino Pedelec "Forumscontroller"
written by jenkie and others / pedelecforum.de
Copyright (C) 2012-2016

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

Features:
- pedaling-enabled, true-power-control throttle
- pedaling-enabled, pid-controlled motor-power which can be set by a potentiometer or buttons
- configurable starting aid
- configurable speed limit
- configurable power limit
- switchable profiles
- several displays: BMS, King-Meter, Nokia LCD, Serial LCD
- optional Bluetooth module to communicate with Android app
*/

#include "config.h"          //place all your personal configurations there and keep that file when updating!   
#include "globals.h"
#include "hal.h"
#include "display.h"         //display output functions
#include "display_backlight.h"  // LCD display backlight support
#include "PID_v1_nano.h"
#include "switches.h"        //contains switch handling functions
#include "menu.h"            //on the go menu
#include "serial_command.h"       //serial (bluetooth) communication stuff
#include "wireless_manager.h"     //onboard bluetooth & wifi telemetry manager

#ifdef SUPPORT_MOTOR_SERVO   //RC motor controller connected to motor output
#include <Servo.h>
Servo motorservo;
#endif

#ifdef SUPPORT_BMP085
#include <Wire.h>
#include "BMP085.h"          //library for altitude and temperature measurement using http://www.watterott.com/de/Breakout-Board-mit-dem-BMP085-absoluten-Drucksensor     
BMP085 bmp;
#endif

#ifdef SUPPORT_DSPC01
#include "DSPC01_nano.h"
DSPC01 dspc;
unsigned long dspc_timer = 0;
bool dspc_mode=false;  //is false if temperature, true if altitude
#endif

#ifdef SUPPORT_RTC
#include <Wire.h>
#include "ds1307.h"
RTC_DS1307 rtc;
Time now;
#endif

#ifdef SUPPORT_HRMI
#include <Wire.h>
#include "hrmi_funcs.h"
#endif

#if defined(SUPPORT_POTI) && defined(SUPPORT_SOFT_POTI)
#error You either have poti or soft-poti support. Disable one of them.
#endif

#if defined(SUPPORT_POTI) && defined(SUPPORT_THROTTLE_AUTO_CRUISE)
#error You either have poti or throttle auto cruise. Disable one of them.
#endif

#if defined(SUPPORT_POTI) && defined(SUPPORT_SWITCH_ON_POTI_PIN)
#error You either have a poti or a switch on the poti pin. Disable one of them.
#endif

#if defined(SUPPORT_POTI) && defined(SUPPORT_POTI_SWITCHES)
#error You either have a poti or switches to control the poti value
#endif

#if defined(SUPPORT_SOFT_POTI) && defined(SUPPORT_THROTTLE_AUTO_CRUISE)
#error Soft poti is incompatible with throttle auto cruise
#endif

#if defined(SUPPORT_LIGHTS_SWITCH) && (defined(SUPPORT_XCELL_RT)||defined(SUPPORT_SEMPU)||defined(SUPPORT_SEMPU_V1)||defined(SUPPORT_T9)) && HARDWARE_REV < 20
#error Software controlled lights switch is not compatible with torque sensor support on FC < 2.0
#endif

#if defined(SUPPORT_LIGHTS_SWITCH) && HARDWARE_REV < 3
#error Lights switch is only possible on FC hardware rev 3 or newer
#endif

#if DISPLAY_TYPE == DISPLAY_TYPE_KINGMETER
#error Specified type of KingMeter display wrong, upgrade your config.h and choose one of the new definitions
#endif


#if ((DISPLAY_TYPE & DISPLAY_TYPE_KINGMETER) || (DISPLAY_TYPE == DISPLAY_TYPE_BMS) || (DISPLAY_TYPE == DISPLAY_TYPE_BMS3))
#if HARDWARE_REV < 20
#include <SoftwareSerial.h>      // For King-Meter J-LCD, SW-LCD, KM5s-LCD, EBS-LCD2 and BMS S-LCD, S-LCD3
#endif
#endif

#ifdef SUPPORT_TEMP_SENSOR
#include "one_Wire.h"
#include "DallasTemp.h"
OneWire tempWire(temp_pin);
DallasTemperature sensors(&tempWire);
#endif

#ifdef SUPPORT_HX711
#include "HX711.h"
HX711 loadcell(hx711_data, hx711_sck);
double load=0; //this is the current load
bool load_updated=false; //new measurement flag, becomes true if measurement is updated
#endif

// #define DEBUG_MEMORY_USAGE               // enable this define to print memory usage in SERIAL_MODE_DEBUG

struct savings   //add variables if you want to store additional values to the eeprom
{
    float voltage;
    float wh; //watthours
    float kilometers; //trip kilometers
    float mah; //milliamphours
    unsigned long odo; //overall kilometers in units of wheel roundtrips
#ifdef SUPPORT_BATTERY_CHARGE_COUNTER
    unsigned int charge_count;//battery charge count
#endif
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
    float wh_human; //human watthours
#endif
};
savings variable = {0.0, 0.0, 0.0, 0.0, 0}; //variable stores last voltage and capacity read from EEPROM
savings variable_new = {0.0, 0.0, 0.0, 0.0, 0}; //variable_new stores new EEPROM values

//Pin Assignments-----------------------------------------------------------------------------------------------------
#if HARDWARE_REV == 1
const int option_pin = A0;         //Analog option
const int voltage_in = A1;         //Voltage read-Pin
const int current_in = A2;         //Current read-Pin
#endif
#if HARDWARE_REV == 2
const int fet_out = A0;              //FET: Pull high to switch off
const int voltage_in = A1;           //Voltage read-Pin
const int option_pin = A2;           //Analog option
const int current_in = A3;           //Current read-Pin
#endif
#if ((HARDWARE_REV >= 3)&&(HARDWARE_REV <= 5))
const int voltage_in = A0;           //Voltage read-Pin
const int fet_out = A1;              //FET: Pull high to switch off
const int current_in = A2;           //Current read-Pin
const int option_pin = A3;           //Analog option
const int lights_pin = A3;           //Software controlled lights switch
#endif
#if HARDWARE_REV <= 5
#if defined(A6) && defined(A7)
const int poti_in = A6;              //PAS Speed-Poti-Pin
const int throttle_in = A7;          //Throttle read-Pin
#else
const int poti_in = A0;              //PAS Speed-Poti-Pin fallback
const int throttle_in = A1;          //Throttle read-Pin fallback
#endif
const int pas_in = 2;                //PAS Sensor read-Pin
const int wheel_in = 3;              //Speed read-Pin
const int brake_in = 4;              //Brake-In-Pin
const int switch_thr = 5;            //Throttle-Switch read-Pin
const int throttle_out = 6;          //Throttle out-Pin
const int bluetooth_pin = 7;         //Bluetooth-Supply, do not use in Rev. 1.1!!!
const int switch_disp = 8;           //Display switch
#if (DISPLAY_TYPE & (DISPLAY_TYPE_NOKIA_4PIN|DISPLAY_TYPE_16X2_SERIAL))
const int switch_disp_2 = 12;        //second Display switch with Nokia-Display in 4-pin-mode
#endif
const int lights_front_pin = lights_pin;
const int lights_high_beam_pin = -1;
const int lights_rear_pin = -1;
const int lights_brake_pin = -1;
const int turn_signal_left_pin = -1;
const int turn_signal_right_pin = -1;
const int horn_pin = -1;
#endif
#if ((HARDWARE_REV >= 20)&&(HARDWARE_REV < 30))
const int voltage_in = A14;           //Voltage read-Pin
const int fet_out = 38;              //FET: Pull high to switch off
const int current_in = A15;           //Current read-Pin
const int option_pin = A2;            //Analog option
const int lights_pin = 44;           //Software controlled lights switch

const int poti_in = A4;              //PAS Speed-Poti-Pin
const int throttle_in = A3;          //Throttle read-Pin
const int pas_in = 3;                //PAS Sensor read-Pin
const int brake_in = 2;              //Brake-In-Pin
const int switch_thr = 5;            //Throttle-Switch read-Pin
const int throttle_out = 8;          //Throttle out-Pin
const int bluetooth_pin = 13;         //Bluetooth-Supply
const int switch_disp = 37;           //Display switch
// Currently not in use as it's hardwired to PORTH, pin 2
// const int switch_disp_2 = 48;        //second Display switch with Nokia-Display in 4-pin-mode
const int buzzer=11;
const int lights_front_pin = 44;
const int lights_high_beam_pin = 45;
const int lights_rear_pin = 46;
const int lights_brake_pin = 47;
const int turn_signal_left_pin = 42;
const int turn_signal_right_pin = 43;
const int horn_pin = buzzer;
#endif
#if HARDWARE_REV == 30
#if defined(ARDUINO_ARCH_STM32)
const int option_pin = PA0;
const int voltage_in = PA1;
const int current_in = PA2;
const int fet_out = PA3;
const int poti_in = PA4;
const int throttle_in = PA5;
const int pas_in = PB0;
const int wheel_in = PB1;
const int brake_in = PB10;
const int switch_thr = PB9;
const int throttle_out = PB6;
const int bluetooth_pin = PB12;
const int switch_disp = PB13;
const int lights_pin = PB14;
const int lights_front_pin = PB14;
const int lights_high_beam_pin = PB15;
const int lights_rear_pin = PA8;
const int lights_brake_pin = PA9;
const int turn_signal_left_pin = PA10;
const int turn_signal_right_pin = PA11;
const int horn_pin = PB8;
#elif defined(ARDUINO_ARCH_RP2040)
const int option_pin = 26;
const int voltage_in = 27;
const int current_in = 28;
const int fet_out = 22;
const int poti_in = 26;
const int throttle_in = 27;
const int pas_in = 2;
const int wheel_in = 3;
const int brake_in = 4;
const int switch_thr = 5;
const int throttle_out = 6;
const int bluetooth_pin = 7;
const int switch_disp = 8;
const int lights_pin = 9;
const int lights_front_pin = 9;
const int lights_high_beam_pin = 10;
const int lights_rear_pin = 11;
const int lights_brake_pin = 12;
const int turn_signal_left_pin = 13;
const int turn_signal_right_pin = 14;
const int horn_pin = 15;
#elif defined(ARDUINO_ARCH_ESP32)
const int option_pin = 34;
const int voltage_in = 35;
const int current_in = 32;
const int fet_out = 23;
const int poti_in = 33;
const int throttle_in = 36;
const int pas_in = 18;
const int wheel_in = 19;
const int brake_in = 21;
const int switch_thr = 22;
const int throttle_out = 25;
const int bluetooth_pin = 5;
const int switch_disp = 17;
const int lights_pin = 16;
const int lights_front_pin = 16;
const int lights_high_beam_pin = 4;
const int lights_rear_pin = 2;
const int lights_brake_pin = 15;
const int turn_signal_left_pin = 13;
const int turn_signal_right_pin = 14;
const int horn_pin = 27;
#else
const int option_pin = A0;
const int voltage_in = A1;
const int current_in = A2;
const int fet_out = A3;
const int poti_in = A4;
const int throttle_in = A5;
const int pas_in = 2;
const int wheel_in = 3;
const int brake_in = 4;
const int switch_thr = 5;
const int throttle_out = 6;
const int bluetooth_pin = 7;
const int switch_disp = 8;
const int lights_pin = 9;
const int lights_front_pin = 9;
const int lights_high_beam_pin = 10;
const int lights_rear_pin = 11;
const int lights_brake_pin = 12;
const int turn_signal_left_pin = 13;
const int turn_signal_right_pin = 14;
const int horn_pin = 15;
#endif
#endif
#if (HARDWARE_REV >= 22) && (HARDWARE_REV < 30)
const int current_in_neg = A13;           //Negative Current read-Pin
#endif



//Variable-Declarations-----------------------------------------------------------------------------------------------
double pid_p=cfg_pid_p;
double pid_i=cfg_pid_i;
double pid_p_throttle=cfg_pid_p_throttle;
double pid_i_throttle=cfg_pid_i_throttle;
double pid_out,pid_set;        //pid output, pid set value
int throttle_stat = 0;         //Throttle reading
#ifdef SUPPORT_THROTTLE_AUTO_CRUISE
int throttle_pre = 0;          //Previous throttle reading (auto-cruise)
byte throttle_zero_count = 0;  //Counter for zero-throttle readings (auto-cruise)
byte throttle_up_count = 0;    //Counter for throttle-readings (auto-cruise)
#endif
int throttle_write=0;          //Throttle write value
int poti_stat = 0;         //Poti reading
volatile int pas_on_time = 0;  //High-Time of PAS-Sensor-Signal (needed to determine pedaling direction)
volatile int pas_off_time = 0; //Low-Time of PAS-Sensor-Signal  (needed to determine pedaling direction)
volatile int pas_failtime = 0; //how many subsequent "wrong" PAS values?
volatile int cad=0;            //Cadence
unsigned long looptime=0;      //Loop Time in milliseconds (for testing)
byte battery_percent_fromcapacity=0;     //battery capacity calculated from capacity
int lowest_raw_current = 1023; //automatic current offset calibration
float current = 0.0;           //measured battery current
float voltage = 0.0;           //measured battery voltage
float voltage_1s,voltage_2s = 0.0; //Voltage history 1s and 2s before "now"
float voltage_display = 0.0;   //averaged voltage
float current_display = 0.0;   //averaged current
double power=0.0;              //calculated power
double power_display=0.0;      //averaged power for display
double power_set = 0;          //Set Power
double power_poti = 0.0;   //set power, calculated with current poti setting
double power_throttle=0.0; //set power, calculated with current throttle setting
float factor_speed=1.0;        //factor controling the speed
float factor_volt=1.0;         //factor controling voltage cutoff
float wh,mah=0.0;              //watthours, mah drawn from battery
unsigned int charge_count=0;     //battery charge count
float temperature = 0.0;       //temperature
float altitude = 0.0;          //altitude
float altitude_start=0.0;      //altitude at start
float last_altitude;           //height
float slope = 0.0;             //current slope
volatile float km=0.0;         //trip-km
volatile float spd=0.0;        //speed
float range = 0.0;             //expected range
volatile unsigned long odo=0;           //overall kilometers in units of wheel roundtrips
unsigned long last_writetime = millis();  //last time display has been refreshed
#ifdef SUPPORT_THROTTLE_AUTO_CRUISE
unsigned long last_writetime_short = millis(); //used for fast loop (auto-cruise)
byte short_writetime_counter = 0; //Counter for fast-loop
#endif
volatile unsigned long last_wheel_time = millis(); //last time of wheel sensor change 0->1
volatile unsigned long wheel_time = 65535;  //time for one revolution of the wheel
#ifdef DETECT_BROKEN_SPEEDSENSOR
unsigned long motor_started_time = millis(); //time the motor started, needed to measure how long motor is running but no speed signal is detected
int last_throttle_write=0;                      //last throttle write value
#endif
volatile byte wheel_counter=0; //counter for events that should happen once per wheel revolution. only needed if wheel_magnets>1
volatile unsigned long last_pas_event = millis();  //last change-time of PAS sensor status
#if defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_T9)
  #define pas_time 1875 //conversion factor for pas_time to rpm (cadence), 32 Pulses
#else
  #define pas_time 60000/pas_magnets //conversion factor for pas_time to rpm (cadence)
#endif
volatile bool pedaling = false;  //pedaling? (in forward direction!)
volatile bool pedalingbackwards = false;  //pedalingn in backward direction
bool firstrun = true;  //first run of loop?
bool brake_stat = true; //brake activated?
PID myPID(&power, &pid_out,&pid_set,pid_p,pid_i,0, DIRECT);
unsigned int idle_shutdown_count = 0;
unsigned long idle_shutdown_last_wheel_time = millis();
byte pulse_human=0;          //cyclist's heart rate
double torque=0.0;           //cyclist's torque in Nm (averaged over one pedal revolution)
double torque_instant=0.0;   //cyclist's torque in Nm (live)
double power_human=0.0;      //cyclist's power
double wh_human=0;
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
int torque_zero=TORQUE_ZERO; //Offset of torque sensor. Adjusted at startup if TORQUE_AUTOZERO option is set
static volatile bool analogRead_in_use = false; //read torque values in interrupt only if no analogRead in process
static volatile bool torque_want_calculation = false; //read torque values in interrupt only if no analogRead in process
#if HARDWARE_REV<20 && defined(SUPPORT_XCELL_RT)
const int torquevalues_count=8;
volatile int torquevalues[torquevalues_count]= {0,0,0,0,0,0,0,0}; //stores the 8 torque values per pedal roundtrip
#elif defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_XCELL_RT) || defined(SUPPORT_T9)
const int torquevalues_count=16;
volatile int torquevalues[torquevalues_count]= {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}; //stores the 16 torque values per pedal roundtrip (Thun) or half roundtrip (Sempu)
#elif defined(SUPPORT_SEMPU)
const int torquevalues_count=24;
volatile int torquevalues[torquevalues_count]= {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}; //stores the 24 torque values per pedal roundtrip (Sempu new version)
#endif
volatile byte torqueindex=0;        //index to write next torque value
volatile bool readtorque=false;  //true if torque array has been updated -> recalculate in main loop
#endif
#ifdef SUPPORT_BBS
unsigned long bbs_pausestart=0; //start time of power pause for gear change
#endif

#ifdef SUPPORT_THERMISTOR
float temperature_thermistor=0; //thermistor temperature
#endif

#if (SERIAL_MODE & SERIAL_MODE_MMC)           //communicate with mmc-app
String mmc_command="";
byte mmc_value=0;
bool mmc_nextisvalue=false;
#endif

//declarations for profile switching
int curr_startingaid_speed=startingaid_speed;
int curr_spd_max1=spd_max1;
int curr_spd_max2=spd_max2;
int curr_power_max=power_max;
int curr_power_poti_max=power_poti_max;
double curr_capacity=capacity;
bool current_profile=0; //0: blue profile, 1: red profile

// PIN Security System (0 = StVZO legal, 1 = Sport/Trail, 2 = Race/Privatgelände via Master-PIN 210286)
byte pin_security_level = 0;
bool pure_throttle_allowed = false;

// On-the-go duct tape to get you home with broken wiring.
bool first_aid_ignore_break = false;
bool first_aid_ignore_pas = false;
bool first_aid_ignore_speed = false;
bool first_aid_ignore_poti = false;
bool first_aid_ignore_throttle = false;
bool first_aid_ignore_temp_sensor = false;

// Forward declarations for compatibility with new gcc versions
void pas_change();
void pas_change_dual(bool signal);
void speed_change();
void send_serial_data();
void handle_dspc();
void read_eeprom();
void save_eeprom();
void save_shutdown();
void handle_unused_pins();
void send_bluetooth_data();
void read_current_torque();
int analogRead_noISR(uint8_t pin);

#ifdef DEBUG_MEMORY_USAGE
int memFree()
{
    extern int __heap_start, *__brkval;
    int next_pointer;

    return (int) &next_pointer - (__brkval == 0 ? (int) &__heap_start : (int) __brkval);
}
#endif

// Lighting & Signaling State
bool lights_front_active = false;
bool lights_high_beam_active = false;
bool lights_rear_active = false;
bool lights_brake_active = false;
bool turn_left_active = false;
bool turn_right_active = false;
bool hazard_active = false;
bool horn_active = false;

static unsigned long blink_phase_start = 0;
static bool blink_state = false;
static unsigned long turn_auto_cancel_time = 0;
static unsigned long horn_start_time = 0;

void set_lights_front(bool on, bool high_beam)
{
    lights_front_active = on;
    lights_high_beam_active = on && high_beam;
    if (lights_front_pin >= 0)
        digitalWrite(lights_front_pin, lights_front_active ? HIGH : LOW);
    if (lights_high_beam_pin >= 0)
        digitalWrite(lights_high_beam_pin, lights_high_beam_active ? HIGH : LOW);
#ifdef SUPPORT_LIGHTS_SWITCH
    digitalWrite(lights_pin, lights_front_active ? HIGH : LOW);
#endif
}

void toggle_lights_front()
{
    set_lights_front(!lights_front_active, false);
}

void toggle_lights_high_beam()
{
    if (!lights_front_active) {
        set_lights_front(true, true);
    } else {
        set_lights_front(true, !lights_high_beam_active);
    }
}

void set_lights_rear(bool on)
{
    lights_rear_active = on;
    if (lights_rear_pin >= 0)
        digitalWrite(lights_rear_pin, lights_rear_active ? HIGH : LOW);
}

void toggle_lights_rear()
{
    set_lights_rear(!lights_rear_active);
}

void set_brake_light(bool on)
{
    lights_brake_active = on;
    if (lights_brake_pin >= 0)
        digitalWrite(lights_brake_pin, lights_brake_active ? HIGH : LOW);
}

void set_turn_signal_left(bool on)
{
    if (on) {
        turn_left_active = true;
        turn_right_active = false;
        hazard_active = false;
        blink_phase_start = millis();
        blink_state = true;
        turn_auto_cancel_time = millis() + 20000UL;
    } else {
        turn_left_active = false;
        if (turn_signal_left_pin >= 0)
            digitalWrite(turn_signal_left_pin, LOW);
    }
}

void toggle_turn_signal_left()
{
    set_turn_signal_left(!turn_left_active);
}

void set_turn_signal_right(bool on)
{
    if (on) {
        turn_right_active = true;
        turn_left_active = false;
        hazard_active = false;
        blink_phase_start = millis();
        blink_state = true;
        turn_auto_cancel_time = millis() + 20000UL;
    } else {
        turn_right_active = false;
        if (turn_signal_right_pin >= 0)
            digitalWrite(turn_signal_right_pin, LOW);
    }
}

void toggle_turn_signal_right()
{
    set_turn_signal_right(!turn_right_active);
}

void set_hazard_lights(bool on)
{
    hazard_active = on;
    if (hazard_active) {
        turn_left_active = false;
        turn_right_active = false;
        blink_phase_start = millis();
        blink_state = true;
    } else {
        if (turn_signal_left_pin >= 0)
            digitalWrite(turn_signal_left_pin, LOW);
        if (turn_signal_right_pin >= 0)
            digitalWrite(turn_signal_right_pin, LOW);
    }
}

void toggle_hazard_lights()
{
    set_hazard_lights(!hazard_active);
}

void set_horn(bool on)
{
    if (on) {
        horn_active = true;
        horn_start_time = millis();
        if (horn_pin >= 0)
            digitalWrite(horn_pin, HIGH);
    } else {
        horn_active = false;
        if (horn_pin >= 0)
            digitalWrite(horn_pin, LOW);
    }
}

void update_lights_and_signals()
{
    const unsigned long now = millis();

    // 1. Horn Thermal Protection (Max 3.0s continuous on)
    if (horn_active) {
        if (now - horn_start_time >= 3000UL) {
            set_horn(false);
        }
    }

    // 2. Dynamic Brake Light
    bool braking_now = (brake_stat == 0);
#ifdef INVERT_BRAKE
    braking_now = (brake_stat != 0);
#endif
    if (first_aid_ignore_break) {
        braking_now = false;
    }

#ifdef SUPPORT_BRAKE_LIGHT
    if (braking_now) {
#ifdef SUPPORT_EMERGENCY_BRAKE_FLASH
        if (spd > 15.0) {
            bool ess_phase = ((now / 143) % 2) == 0;
            if (lights_brake_pin >= 0)
                digitalWrite(lights_brake_pin, ess_phase ? HIGH : LOW);
        } else {
            if (lights_brake_pin >= 0)
                digitalWrite(lights_brake_pin, HIGH);
        }
#else
        if (lights_brake_pin >= 0)
            digitalWrite(lights_brake_pin, HIGH);
#endif
    } else {
        if (lights_brake_pin >= 0)
            digitalWrite(lights_brake_pin, LOW);
    }
#endif

    // 3. Turn Signals and Hazard Flasher Generator
    // 1.5 Hz (333 ms on, 333 ms off)
    const unsigned long BLINK_HALF_CYCLE = 333UL;

    if (turn_left_active || turn_right_active || hazard_active) {
        if (!hazard_active && deadline_reached(now, turn_auto_cancel_time)) {
            set_turn_signal_left(false);
            set_turn_signal_right(false);
            return;
        }

        if (now - blink_phase_start >= BLINK_HALF_CYCLE) {
            blink_phase_start = now;
            blink_state = !blink_state;
        }

        bool left_pin_state = (hazard_active || turn_left_active) && blink_state;
        bool right_pin_state = (hazard_active || turn_right_active) && blink_state;

        if (turn_signal_left_pin >= 0)
            digitalWrite(turn_signal_left_pin, left_pin_state ? HIGH : LOW);
        if (turn_signal_right_pin >= 0)
            digitalWrite(turn_signal_right_pin, right_pin_state ? HIGH : LOW);
    }
}

//Setup---------------------------------------------------------------------------------------------------------------------
void setup()
{
#if defined(ARDUINO_ARCH_ESP32) || defined(ARDUINO_ARCH_STM32) || defined(ARDUINO_ARCH_RP2040)
    analogReadResolution(10); // Standardize on 10-bit ADC resolution (0..1023) for APC sensor pipeline compatibility
#endif
    pinMode(throttle_out,OUTPUT);
    digitalWrite(throttle_out,0); //turn motor off for security reasons during startup
#if HARDWARE_REV >= 2
    pinMode(fet_out,OUTPUT);
    digitalWrite(fet_out, FET_ON);           // turn on whole system on
#endif
#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30)
    pinMode(buzzer, OUTPUT);
    tone(buzzer, 261, 50);
    delay(50);
    tone(buzzer,329, 50);
    delay(50);
    tone(buzzer,440, 50);
    handle_unused_pins(); //for current saving
#if (BLUETOOTH_MODE & BLUETOOTH_MODE_IOS)
    Serial1.begin(57600);     //IOS app requires 57600
#else
    Serial1.begin(115200);     //this is the bluetooth serial port
#endif
#endif
#if (SERIAL_MODE & SERIAL_MODE_IOS)
    Serial.begin(57600);     //IOS app requires 57600
#else
    Serial.begin(115200);
#endif
    wireless_init();

#ifdef DEBUG_MEMORY_USAGE
    Serial.print(MY_F("memFree before setup:"));
    Serial.print(memFree());
    Serial.print(MY_F("\n"));
#endif

#ifdef SUPPORT_TEMP_SENSOR
    sensors.begin(); //initialize Dallas library
    sensors.setWaitForConversion(false);
    sensors.setResolution(TEMP_12_BIT); // Set conversion resolution to 12 bit (most accurate mode). Conversion time approximately 700 ms!
#endif

#ifdef SUPPORT_DSPC01
#if HARDWARE_REV < 20
    dspc.begin(A5,A4);
#else
    dspc.begin(21,20);
#endif
    dspc.request_temperature();
    delay(200);
    temperature=dspc.temperature()/10.0;
    dspc.request_altitude();
    delay(200);
    altitude_start=dspc.altitude()/10.0;
#endif
    init_switches();
    init_menu();
    display_init();

#if (DISPLAY_TYPE & (DISPLAY_TYPE_NOKIA_4PIN|DISPLAY_TYPE_16X2_SERIAL))
#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30) && defined(__AVR__)
    // set to INPUT
    bitClear(DDRH, 2);
    // turn on pullup resistors
    bitSet(PORTH, 2);
#else
#if defined(switch_disp_2)
    digitalWrite(switch_disp_2, HIGH);    // turn on pullup resistors on display-switch 2
#endif
#endif
#endif
#ifdef SUPPORT_SWITCH_ON_POTI_PIN
    digitalWrite(poti_in, HIGH);
#endif

#ifdef SUPPORT_LIGHTS_SWITCH
    pinMode(lights_pin,OUTPUT);
    if (lights_front_pin >= 0) pinMode(lights_front_pin, OUTPUT);
    if (lights_high_beam_pin >= 0) pinMode(lights_high_beam_pin, OUTPUT);
    if (lights_rear_pin >= 0) pinMode(lights_rear_pin, OUTPUT);
    if (lights_brake_pin >= 0) pinMode(lights_brake_pin, OUTPUT);
    if (turn_signal_left_pin >= 0) pinMode(turn_signal_left_pin, OUTPUT);
    if (turn_signal_right_pin >= 0) pinMode(turn_signal_right_pin, OUTPUT);
    if (horn_pin >= 0) pinMode(horn_pin, OUTPUT);
#ifdef SUPPORT_LIGHTS_ENABLE_ON_STARTUP
    set_lights_front(true);
    set_lights_rear(true);
#else
    set_lights_front(false);
    set_lights_rear(false);
#endif
#endif

#if HARDWARE_REV >= 2
    pinMode(bluetooth_pin,OUTPUT);
#ifdef SUPPORT_BLUETOOTH_ENABLE_ON_STARTUP
    digitalWrite(bluetooth_pin, HIGH);    // turn bluetooth on during boot
#else
    digitalWrite(bluetooth_pin, LOW);     // turn bluetooth off
#endif
#endif
#ifdef SUPPORT_BRAKE
    digitalWrite(brake_in, HIGH);         // turn on pullup resistors on brake
#endif
    digitalWrite(switch_thr, HIGH);       // turn on pullup resistors on throttle-switch
    digitalWrite(switch_disp, HIGH);      // turn on pullup resistors on display-switch
#if HARDWARE_REV < 20
    digitalWrite(wheel_in, HIGH);         // turn on pullup resistors on wheel-sensor
#endif
    digitalWrite(pas_in, HIGH);           // turn on pullup resistors on pas-sensor

#if defined(SUPPORT_DISPLAY_BACKLIGHT) && !(DISPLAY_TYPE & DISPLAY_TYPE_16X2_SERIAL)
#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30) && defined(__AVR__)
    bitSet(DDRH, 2);
    bitClear(PORTH, 2);
#else
    pinMode(display_backlight_pin, OUTPUT);
#endif
#endif

#ifdef SUPPORT_BBS
pinMode(option_pin,OUTPUT); //make torque pin on Thun connector to 5V source for BBS PAS sensor
digitalWrite(option_pin,HIGH);
#endif

#ifdef SUPPORT_GEAR_SHIFT
    pinMode(gear_shift_pin_low_gear, OUTPUT);
    pinMode(gear_shift_pin_high_gear, OUTPUT);
    // set to auto mode
    digitalWrite(gear_shift_pin_low_gear, HIGH);
    digitalWrite(gear_shift_pin_high_gear, HIGH);
#endif

    read_eeprom();      //read stored variables
    odo=variable.odo;   //load overall kilometers from eeprom
#ifdef SUPPORT_BATTERY_CHARGE_COUNTER
    charge_count=variable.charge_count; //load charge count from eeprom
#endif
    display_show_welcome_msg();

//setup interrupt handling
#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30) && defined(__AVR__)
    bitClear(DDRE,7);      //configure PE7 as input
    bitSet(PORTE,7);       //enable pull-up on wheel sensor
    bitSet(EICRB,6);      //trigger on rising edge INT7 for wheel sensor
    bitSet(EICRB,7);      //trigger on rising edge INT7 for wheel sensor
    EIMSK  |= (1<<INT7);  //turn on interrupt for wheel sensor
#ifdef SUPPORT_PAS
    bitClear(DDRE,5);      //configure PE5 as input
    bitSet(PORTE,5);       //enable pull-up on PAS sensor
#if !defined(SUPPORT_XCELL_RT) && !defined(SUPPORT_BBS) && !defined(SUPPORT_SEMPU) //add second interrupt for two-signal-pas-sensors
    bitSet(EICRB,2);      //trigger on any edge INT5 for PAS sensor
    EIMSK  |= (1<<INT5);  //turn on interrupt INT5 for PAS sensor
#else
    bitClear(DDRE,6);      //configure PE6 as input
    bitSet(PORTE,6);       //enable pull-up on PAS 2 sensor
    bitSet(EICRB,2);      //trigger on rising edge INT5 for Thun sensor/BBS/Sempu
    bitSet(EICRB,3);      //trigger on rising edge INT5 for Thun sensor/BBS/Sempu
    bitSet(EICRB,4);      //trigger on rising edge INT6 for Thun sensor/BBS/Sempu
    bitSet(EICRB,5);      //trigger on rising edge INT6 for Thun sensor/BBS/Sempu
    EIMSK  |= (1<<INT5);  //turn on interrupt INT5 for PAS sensor
    EIMSK  |= (1<<INT6);  //turn on interrupt for Thun sensor/BBS/Sempu
#endif
#endif
#else
#ifdef SUPPORT_PAS
    attachInterrupt(digitalPinToInterrupt(pas_in), pas_change, CHANGE); //attach interrupt for PAS-Sensor
#endif
    attachInterrupt(digitalPinToInterrupt(wheel_in), speed_change, RISING); //attach interrupt for Wheel-Sensor
#endif

    myPID.SetMode(AUTOMATIC);             //initialize pid
    myPID.SetOutputLimits(0,1023);        //initialize pid
    myPID.SetSampleTime(10);              //compute pid every 10 ms
#ifdef SUPPORT_BMP085
    Wire.begin();                         //initialize i2c-bus
    bmp.begin();                          //initialize barometric altitude sensor
    temperature = bmp.readTemperature();
    altitude_start=bmp.readAltitude();
#endif
#if defined(SUPPORT_BMP085) || defined(SUPPORT_DSPC01)
    display_show_welcome_msg_temp();
#endif
#ifdef SUPPORT_HRMI
    hrmi_open();
#endif
#ifdef SUPPORT_RTC
    Wire.begin();
#endif
#ifndef SUPPORT_PAS
    pedaling=true;
#endif

#if defined(SUPPORT_SOFT_POTI) || defined(SUPPORT_POTI_SWITCHES)
    poti_stat = map(poti_value_on_startup_in_watts, 0, curr_power_poti_max, 0, 1023);
#endif

#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) ||defined(SUPPORT_T9)
#ifdef TORQUE_AUTOZERO
    torque_rezero();
#endif
#endif

#ifdef SUPPORT_MOTOR_SERVO
motorservo.attach(throttle_out);
#endif

#ifdef USE_EXTERNAL_CURRENT_SENSOR
  pinMode(external_current_in,INPUT);   //configure as input
  digitalWrite(external_current_in,LOW); //disable pull-ups
#endif

#ifdef USE_EXTERNAL_VOLTAGE_SENSOR
  pinMode(external_voltage_in,INPUT);   //configure as input
  digitalWrite(external_voltage_in,LOW); //disable pull-ups
#endif

//increase PWM frequency
#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30) && defined(__AVR__)
  int myEraser = 7;
  TCCR4B &= ~myEraser;  //reset timer 4 prescaler
  int myPrescaler = 1;
  TCCR4B |= myPrescaler; //set timer 4 prescaler to 001 --> 32 kHz PWM frequency on motor output pin
#endif

#ifdef SUPPORT_HX711     
loadcell.tare();                   //set zero scale. remove any load diring startup!
loadcell.set_scale(hx711_scale);   //apply scaling
#endif

#ifdef SUPPORT_THERMISTOR
  pinMode(thermistor_pin,INPUT);
#endif

#ifdef DEBUG_MEMORY_USAGE
    Serial.print(MY_F("memFree after setup:"));
    Serial.print(memFree());
    Serial.print(MY_F("\n"));
#endif

    // Initial PIN security state: StVZO default on boot
    pin_set_level(0);

    // Hardware Watchdog Timer: 1 second timeout
    wdt_enable(WDTO_1S);
}

void loop()
{
  wdt_reset(); // Service hardware watchdog timer
  looptime=millis();
  update_lights_and_signals(); // Service lights, turn signals, brake light, and horn
//Readings-----------------------------------------------------------------------------------------------------------------
#ifdef SUPPORT_DSPC01
    handle_dspc();
#endif
#ifdef SUPPORT_POTI
    if (first_aid_ignore_poti == false)
        poti_stat = constrain(map(analogRead_noISR(poti_in),poti_offset,poti_max,0,1023),0,1023);   // 0...1023
#endif

#ifdef SUPPORT_HX711
if (loadcell.is_ready())     //new conversion result from load cell available
{
  load=loadcell.get_units_fast();
  load_updated=true;         //set new measurement flag
}
#endif

#if ((DISPLAY_TYPE & DISPLAY_TYPE_KINGMETER) || (DISPLAY_TYPE == DISPLAY_TYPE_BMS) || (DISPLAY_TYPE == DISPLAY_TYPE_BMS3)||(DISPLAY_TYPE & DISPLAY_TYPE_BAFANG))
    display_update();
#endif

    if (Serial.available() > 0)
    {
        parse_serial(Serial.read(),0);
    }
#if (HARDWARE_REV >= 20) && defined(APC_HAVE_SERIAL1)
    if (Serial1.available() > 0)
    {
        parse_serial(Serial1.read(),1);
    }
#endif
    wireless_poll();

#ifdef SUPPORT_THROTTLE
    int raw_throttle = analogRead_noISR(throttle_in);
    // Plausibility check (Window comparator) against GND loss / short circuit:
    // Disconnected signal wire or short to GND is < 100 ADC (~0.5V).
    // Disconnected GND wire (runaway hazard) or short to 5V is > 900 ADC (~4.4V).
    if (raw_throttle < 100 || raw_throttle > 900)
    {
        throttle_stat = 0; // Immediate failsafe cut
    }
    else
    {
        throttle_stat = constrain(map(raw_throttle, throttle_offset, throttle_max, 0, 1023), 0, 1023);   // 0...1023
    }
    if (throttle_stat<5 || first_aid_ignore_throttle) //avoid noisy throttle readout
    {
        throttle_stat=0;
    }
#elif (!(DISPLAY_TYPE & DISPLAY_TYPE_KINGMETER) && !(DISPLAY_TYPE == DISPLAY_TYPE_BMS) && !(DISPLAY_TYPE == DISPLAY_TYPE_BMS3))
    // Reset throttle_stat for non-serial communicating displays if SUPPORT_THROTTLE is disabled
    // This is needed to switch off ACTION_FIXED_THROTTLE_VALUE.
    throttle_stat=0;
#endif

#ifdef SUPPORT_BRAKE
#ifdef INVERT_BRAKE
    brake_stat = !digitalRead(brake_in);
#else
    brake_stat = digitalRead(brake_in);
#endif
#else
    brake_stat = true;
#endif
#ifdef SUPPORT_FIRST_AID_MENU
    if (first_aid_ignore_break)
        brake_stat = true;
#endif
//voltage, current, power

#ifndef USE_EXTERNAL_VOLTAGE_SENSOR
    voltage = analogRead_noISR(voltage_in)*voltage_amplitude+voltage_offset; //check with multimeter, change in config.h if needed!
#else
    voltage = analogRead_noISR(external_voltage_in)*external_voltage_amplitude+external_voltage_offset; //check with multimeter, change in config.h if needed!
#endif    
    
#ifndef USE_EXTERNAL_CURRENT_SENSOR
  #if HARDWARE_REV <= 2
      // Read in current and auto-calibrate the shift offset:
      // There is a constant offset depending on the
      // Arduino / resistor value, so we automatically
      // shift it to zero on the scale.
      int raw_current = analogRead_noISR(current_in);
      if (raw_current < lowest_raw_current)
          lowest_raw_current = raw_current;
      current = (raw_current-lowest_raw_current)*current_amplitude_R11; //check with multimeter, change in config.h if needed!
      current = constrain(current,0,30);
  #elif (HARDWARE_REV >= 3 && HARDWARE_REV <= 21) || (HARDWARE_REV >= 30)
      current = (analogRead_noISR(current_in)-512)*current_amplitude_R13+current_offset;    //check with multimeter, change in config.h if needed!
      current = constrain(current,-30,30);
  #elif (HARDWARE_REV >= 22) && (HARDWARE_REV < 30)
      current = (analogRead_noISR(current_in)-analogRead_noISR(current_in_neg))*current_amplitude_R22+current_offset;    //check with multimeter, change in config.h if needed!
      current = constrain(current,-30,30);
  #endif
#else //using external current sensor
    current = analogRead_noISR(external_current_in)*external_current_amplitude+external_current_offset;
#endif

    voltage_display = 0.99*voltage_display + 0.01*voltage; //averaged voltage for display
    current_display = 0.99*current_display + 0.01*current; //averaged current for display
    power=current*voltage;
    power_display = current_display*voltage_display;

#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
#ifdef SUPPORT_XCELL_RT
      torque_instant=0.49*(analogRead(option_pin)-torque_zero);  //multiplication constant for THUN X-CELL RT is approx. 0.49Nm/count
#else //Sempu and T9
      torque_instant=0.33*(analogRead(option_pin)-torque_zero);  //multiplication constant for SEMPU and T9 is approx. 0.33Nm/count
#endif
    if (readtorque==true)
    {
        torque=0.0;
        for (int i = 0; i < torquevalues_count; i++)
        {
            torque+=torquevalues[i];
        }
        readtorque=false;
//now calculate torque_instant, torque and power
#ifdef SUPPORT_XCELL_RT
  #if HARDWARE_REV<20
          torque=abs((torque)*0.061);   //torque=sum of torque values/#of torque values*5V/1023 counts/(10mV/Nm)
  #else
          torque=abs((torque)*0.03054740957);
  #endif
          power_human=0.20943951*cad*torque;   //power=2*pi*cadence*torque/60s*2 (*2 because only left side torque is measured by x-cell rt)
#elif defined(SUPPORT_SEMPU_V1) //SEMPU V1
      torque=abs((torque)*0.02078055073);   //torque=sum of torque values/#of torque values*5V/1023 counts/(14.7 mV/Nm)
      power_human=0.10471975512*cad*torque;   //power=2*pi*cadence*torque/60s
#elif defined(SUPPORT_T9) //Erider T9
      torque=abs((torque)*0.01847160065);   //torque=sum of torque values/#of torque values*5V/1023 counts/(14.7 mV/Nm)
      power_human=0.10471975512*cad*torque;   //power=2*pi*cadence*torque/60s
#else //SEMPU
      torque=abs((torque)*0.01385370049);   //torque=sum of torque values/#of torque values*5V/1023 counts/(14.7 mV/Nm)
      power_human=0.10471975512*cad*torque;   //power=2*pi*cadence*torque/60s
#endif
    }
#endif

//handle switches----------------------------------------------------------------------------------------------------------
    handle_switch(SWITCH_THROTTLE, digitalRead(switch_thr));
    handle_switch(SWITCH_DISPLAY1, digitalRead(switch_disp));
#if (DISPLAY_TYPE & (DISPLAY_TYPE_NOKIA_4PIN|DISPLAY_TYPE_16X2_SERIAL))
#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30) && defined(__AVR__)
    handle_switch(SWITCH_DISPLAY2, bitRead(PINH, 2));
#elif defined(switch_disp_2)
    handle_switch(SWITCH_DISPLAY2, digitalRead(switch_disp_2));
#endif
#endif

#ifdef SUPPORT_SWITCH_ON_POTI_PIN
    handle_switch(SWITCH_POTI, (analogRead_noISR(poti_in)>512));
#endif

//Check if Battery was charged since last power down-----------------------------------------------------------------------
    if (firstrun==true)
    {
        bool force_eeprom_load = false;
#ifndef SUPPORT_BATTERY_CHARGE_DETECTION
        force_eeprom_load = true;
#endif

        if (variable.voltage>(voltage - 2) ||                      //charging detected if voltage is 2V higher than last stored voltage
                voltage < battery_charged_min_voltage ||               //and higher than min. charged voltage
                force_eeprom_load)
        {
            wh=variable.wh;
            km=variable.kilometers;
            mah=variable.mah;
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
            wh_human=variable.wh_human;
#endif
        }
        else
        {
            display_show_important_info(FROM_FLASH(msg_battery_charged), 5);
#ifdef SUPPORT_BATTERY_CHARGE_COUNTER
            charge_count++; //increase charge counter
#endif
        }
    }
    firstrun=false;                                     //first loop run done (ok, up to this line :))

//Are we pedaling?---------------------------------------------------------------------------------------------------------
#ifdef SUPPORT_PAS
    if (((millis()-last_pas_event)>pas_timeout)||(pas_failtime>pas_tolerance)) //we are not pedaling anymore, if pas did not change for > 0,5 s
    {
      pedaling = false;         
      pedalingbackwards = false;
    }                               
    // First aid support: Ignore missing PAS events
    // Note: No need to fix it up in pas_change(), "pedaling" is only set to false above.
    // If we still get some cadence, show it to the rider.
    if (first_aid_ignore_pas)
        pedaling = true;

    cad=cad*pedaling;

#ifdef SUPPORT_BBS
    if (pedalingbackwards) //gear change pause requested
      bbs_pausestart=millis();
#endif //SUPPORT_BBS 
#endif //SUPPORT_PAS



//live speed update when there is no speed_change interrupt-----------------------------------------------------------------
    unsigned long wheeltime_temp=(millis()-last_wheel_time)*wheel_magnets; //current upper limit of the speed based on last measurement
    if (wheeltime_temp>wheel_time)                                //is current upper limit slower than last real measurement?
      spd = 3600*wheel_circumference/wheeltime_temp;

    if ((millis()-last_wheel_time)>3000) //wheel did not spin for 3 seconds --> speed is zero
    {
        spd=0;
        wheel_time=65535;
    }

    // First aid support: Set speed to 1 km/h.
    // This will still show the graphical display.
    if (first_aid_ignore_speed)
    {
        spd=1;
    }


//Power control-------------------------------------------------------------------------------------------------------------
#ifdef SUPPORT_BBS
   if ((millis()-bbs_pausestart)<BBS_GEARCHANGEPAUSE)  //activate brake for specified pause time to allow for gear change
     brake_stat=0;
#endif
    power_throttle = throttle_stat / 1023.0 * curr_power_max;         //power currently set by throttle

#if CONTROL_MODE == CONTROL_MODE_TORQUE                      //human power control mode
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
    power_poti = poti_stat/102300.0* curr_power_poti_max*power_human*(1+spd/20.0); //power_poti_max is in this control mode interpreted as percentage. Example: power_poti_max=200 means; motor power = 200% of human power
#ifdef SUPPORT_TORQUE_THROTTLE                              //we want to trigger throttle just by pedal torque
    if (abs(torque_instant)>torque_throttle_min)            //we are above the threshold to trigger throttle
    {
      double power_torque_throttle = abs(torque_instant/torque_throttle_full*poti_stat/1023*curr_power_max);  //translate torque_throttle_full to maximum power
      power_throttle = max(power_throttle,power_torque_throttle); //decide if thumb throttle or torque throttle are higher
      power_throttle = constrain(power_throttle,0,curr_power_max); //constrain throttle value to maximum power 
    }
#endif
#endif
#endif

#if CONTROL_MODE == CONTROL_MODE_NORMAL                      //constant power mode
    power_poti = poti_stat / 1023.0 * curr_power_poti_max;
#endif

#if CONTROL_MODE == CONTROL_MODE_LIMIT_WH_PER_KM            //wh/km control mode
    power_poti = poti_stat / 1023.0 * whkm_max * spd;        //power currently set by poti in relation to speed and maximum wattage per km
#endif

#ifdef SUPPORT_HRMI                                          //limit heart rate to specified range if possible
    if (pulse_human>0)
    {
        power_poti=min(power_poti+curr_power_max*constrain((pulse_human-pulse_min)/pulse_range,0.0,1.0),(double)curr_power_max);
    }
#endif

    power_poti = min(power_poti,(double)(thermal_limit+(curr_power_max-thermal_limit)*constrain(spd/thermal_safe_speed,0,1))); //thermal limiting

    if ((power_throttle) > (power_poti))                     //IF power set by throttle IS GREATER THAN power set by poti (throttle override)
    {
        myPID.SetTunings(pid_p_throttle,pid_i_throttle,0);   //THEN throttle mode: throttle sets power with "agressive" p and i parameters        power_set=throttle_stat/1023.0*power_max;
        power_set = power_throttle;
    }
    else                                                     //ELSE poti mode: poti sets power with "soft" p and i parameters
    {
        myPID.SetTunings(pid_p,pid_i,0);
        power_set = power_poti;
    }

//Speed cutoff-------------------------------------------------------------------------------------------------------------
    if (pedaling==true || pure_throttle_allowed==true)
    {factor_speed=constrain(1-(spd-curr_spd_max1)/(curr_spd_max2-curr_spd_max1),0,1);} //linear decrease of maximum power for speeds higher than spd_max1
    else
    {
        if (startingaidenable==true)                         //starting aid activated
        {factor_speed=constrain((curr_startingaid_speed-spd)/2,0,1);}
        else
        {factor_speed=0;}                                    //no starting aid
    }

    if (power_set>curr_power_max*factor_speed)
    {power_set=curr_power_max*factor_speed;}                  //Maximum allowed power including Speed-Cutoff    
    if ((((poti_stat<=throttle_stat)||(pedaling==false))&&(power_throttle<10))||(brake_stat==0))  //integral part of PID regulator is slowly shrinked to 0 when you stop pedaling or brake
    {
#ifdef RESET_PID_ON_BRAKE
      myPID.ResetIntegral();
#else
      myPID.ShrinkIntegral();
#endif
    }
    else
    {
      pid_set=power_set;
      myPID.Compute();                                      //this computes the needed drive voltage for the motor controller to maintain the "power_set" based on the current "power" measurment
    }


//Voltage cutoff----------------------------------------------------------------------------------------------------------
    if (voltage<vcutoff)
    {factor_volt=factor_volt*0.9997;}
    else
    {factor_volt=factor_volt*0.9997+0.0003;}

//Temperature cutoff
#if defined(SUPPORT_THERMISTOR) && defined(SUPPORT_THERMISTOR_CUTOFF)
    if (!first_aid_ignore_temp_sensor)
    {
        float factor_temperature=constrain(1-(temperature_thermistor-temperature_cutoff_start)/(temperature_cutoff_stop-temperature_cutoff_start),0,1); //linear decrease of maximum power for temperatures higher than temperature_cutoff_start
        factor_volt=factor_volt*factor_temperature;
    }
#endif

//Throttle output-------------------------------------------------------------------------------------------------------
#ifdef SUPPORT_MOTOR_GUESS
    throttle_write=map(pid_out*brake_stat*factor_volt,0,1023,motor_offset,motor_max) + spd/spd_idle*(motor_max-motor_offset);
    throttle_write=constrain(throttle_write,0,motor_max);
#else
    throttle_write=map(pid_out*brake_stat*factor_volt,0,1023,motor_offset,motor_max);
#endif
#ifdef SUPPORT_PAS
    if (((pedaling==false)&&(power_throttle<10))||power_set<=0||spd>curr_spd_max2)
#else
    if (power_throttle<10||spd>curr_spd_max2)
#endif
    {throttle_write=motor_offset;}
//Broken speed sensor detection START
#ifdef DETECT_BROKEN_SPEEDSENSOR
    if ((last_throttle_write==motor_offset)&&(throttle_write>motor_offset))
    {
      motor_started_time=millis();
    }
    last_throttle_write=throttle_write;
    if (((millis()-motor_started_time)>5000)&&(spd<1))  //5 seconds no speed signal although motor powered --> stop motor
    {
      throttle_write=motor_offset;  
      myPID.ResetIntegral();  
    }
#endif
//Broken speed sensor detection END
#ifdef SUPPORT_MOTOR_SERVO
    motorservo.writeMicroseconds(throttle_write);
#else
    analogWrite(throttle_out,throttle_write);
#endif

#ifdef SUPPORT_DISPLAY_BACKLIGHT
    handle_backlight();
#endif

#if (SERIAL_MODE & SERIAL_MODE_MMC)           //communicate with mmc-app
    if(Serial.available())
    {
        while(Serial.available())
        {
            char readchar=Serial.read();
            //Serial.println((char)readchar);
            if (readchar==13)                        //command without value received
            {
                if (mmc_command=="at-ccap")            //reset capacity
                {
                    wh=0;
                    mah=0;
                }
                if (mmc_command=="at-cdist")          //reset distance
                    km=0;
                if (mmc_command=="at-0")              //anybody there?
                    Serial.println(MY_F("ok"));
                readchar=0;
                mmc_command="";
                return;
            }
            if (readchar==10)                       //ignore newline
            {return;}
            if (mmc_nextisvalue)                    //command with value received
            {
                mmc_value=(char)readchar;
                //if (mmc_command=="at-light")        //switch on and off light
                //Serial.println((char)mmc_value);

                mmc_command="";
                mmc_nextisvalue=false;
            }
            else
            {
                if (readchar==61)                        //equal-sign received
                    mmc_nextisvalue=true;
                else
                    mmc_command+=readchar;
            }

        }
    }
#endif

    // Super-fast menu system (no delay)
    if (menu_active)
        display_update();

#ifdef SUPPORT_THROTTLE_AUTO_CRUISE
//Throttle-auto-cruise reset detection ----------------------------
  if (millis()-last_writetime_short > 50) {
    short_writetime_counter++;
    if (throttle_stat > 0) {
      throttle_up_count++;
      throttle_zero_count = 0;
    }
    else {
      throttle_zero_count++;
      if (throttle_up_count > 7 || throttle_zero_count > 10) {
        throttle_up_count = 0;
      }
    }
    //short tip
    if (throttle_up_count > 2 && throttle_up_count < 8 && throttle_zero_count > 0) { 
      action_set_soft_poti(0);
      throttle_up_count = 0;
    }
    last_writetime_short = millis();
  }

  if (short_writetime_counter > 9) {
    short_writetime_counter = 0;
    if (throttle_pre < throttle_stat + 20 && throttle_pre > throttle_stat - 20 && throttle_stat > 5) {
      action_set_soft_poti(throttle_stat);
      throttle_pre = 0;
    }
    else {
      throttle_pre = throttle_stat;
    }
  }
#endif   

// Emergency power down to protect battery from undervoltage. Also saves to EEPROM
// Don't shut down on USB power.
            if (voltage < vemergency_shutdown
                    && voltage_2s > 6.0)
            {
                display_show_important_info(FROM_FLASH(msg_emergency_shutdown), 60);
                save_shutdown();
            }

//slow loop start----------------------//use this subroutine to place any functions which should happen only once a second
    if (millis()-last_writetime > 1000)              //don't do this more than once a second
    {
        voltage_2s=voltage_1s;                           //update voltage history
        voltage_1s=voltage;                              //update voltage history

#ifdef SUPPORT_BMP085
        temperature = bmp.readTemperature();
        altitude = bmp.readAltitude()-altitude_start;
#endif

#ifdef SUPPORT_TEMP_SENSOR
        sensors.requestTemperatures(); // read temperature(s) from DS18x20 sensor. Readouts are in sensors.getTempCByIndex(n)
#endif

#ifdef SUPPORT_THERMISTOR
        temperature_thermistor=1/(thermistor_t0+thermistor_b*log((10/(1023.0/analogRead(thermistor_pin)-1))/thermistor_r))-273.15; //calculate thermistor temperature from Steinhart-Hart parameters
#endif

        battery_percent_fromcapacity = constrain((1-wh/ curr_capacity)*100,0,100);     //battery percent calculation from battery capacity. For voltage-based calculation see above
        range=constrain(curr_capacity/wh*km-km,0.0,200.0);               //range calculation from battery capacity
        wh+=current*(millis()-last_writetime)/3600000.0*voltage;  //watthours calculation
        wh_human+=(millis()-last_writetime)/3600000.0*power_human;  //human watthours calculation
        mah+=current*(millis()-last_writetime)/3600.0;  //mah calculation

#if (!(DISPLAY_TYPE & DISPLAY_TYPE_KINGMETER) && !(DISPLAY_TYPE == DISPLAY_TYPE_BMS) && !(DISPLAY_TYPE == DISPLAY_TYPE_BMS3)&& !(DISPLAY_TYPE & DISPLAY_TYPE_BAFANG))
#if !(DISPLAY_TYPE == DISPLAY_TYPE_NONE)
        display_update();
#endif
#endif

        send_serial_data();                                        //sends data over serial port depending on SERIAL_MODE
#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30)        
        send_bluetooth_data();
#endif
        wireless_send_telemetry();

// Idle shutdown
            if (last_wheel_time != idle_shutdown_last_wheel_time)
            {
                idle_shutdown_last_wheel_time = last_wheel_time;
                idle_shutdown_count = 0;
            }
            else
            {
                ++idle_shutdown_count;
                if (idle_shutdown_count > idle_shutdown_secs)
                {
                    display_show_important_info(FROM_FLASH(msg_idle_shutdown), 60);
                    save_shutdown();
                }
            }

#ifdef SUPPORT_HRMI
        pulse_human=getHeartRate();
#endif

#ifdef SUPPORT_RTC
        now=rtc.get_time(); //read current time
        //Serial.print(now.hh, DEC);
        //Serial.print(':');
        //Serial.print(now.mm, DEC);
        //Serial.print(':');
        //Serial.print(now.ss, DEC);
        //Serial.println();
#endif

        last_writetime=millis();
//slow loop end------------------------------------------------------------------------------------------------------
    }
}

#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30) && defined(__AVR__) //attach interrupts manually
ISR(INT7_vect)
{
    speed_change();
}
#ifdef SUPPORT_PAS
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_BBS) || defined(SUPPORT_SEMPU)
ISR(INT5_vect)
{
    pas_change_dual(false);
}
ISR(INT6_vect)
{
    pas_change_dual(true);
}
#else //no thun bracket or BBS
ISR(INT5_vect)
{
    pas_change();
}
#endif
#endif
#endif

#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30) && defined(__AVR__)
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_BBS) || defined(SUPPORT_SEMPU)
void pas_change_dual(bool signal)
{
    if (signal)
        pedaling=bitRead(PINE,5);
    else
    {
        pedaling=!bitRead(PINE,6);
#ifdef SUPPORT_XCELL_RT
        cad=7500/(millis()-last_pas_event); //8 pulses per revolution
#else //Sempu or BBS with 24 Pulses per Revolution
        cad=2500/(millis()-last_pas_event); //24 pulses per revolution
#endif        
        last_pas_event = millis();
    }
    pedalingbackwards=!pedaling;
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU)
    if (analogRead_in_use)
    {
      torque_want_calculation = true;
      return;
    }
    read_current_torque();
#endif
}
#endif
#endif

#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
void read_current_torque() //this reads the current torque value
{
    torquevalues[torqueindex]=analogRead(option_pin)-torque_zero;
    torqueindex++;
    if (torqueindex==torquevalues_count)
        torqueindex=0;
    readtorque=true;
}

void torque_rezero() //resets torque sensor
{
  torque_zero=analogRead_noISR(option_pin);
}
#endif

#ifdef SUPPORT_PAS
void pas_change()       //Are we pedaling? PAS Sensor Change------------------------------------------------------------------------------------------------------------------
{
    if (elapsed_less(millis(), last_pas_event, 10U)) return;
    bool pas_stat=digitalRead(pas_in);
    if (pas_stat)
    {
        pas_off_time=millis()-last_pas_event;
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
        if (analogRead_in_use)
          torque_want_calculation = true;
        else
          read_current_torque();
#endif
    }
    else
    {pas_on_time=millis()-last_pas_event;}
    last_pas_event = millis();
    cad=pas_time/(pas_on_time+pas_off_time);
    
    #ifdef SUPPORT_SEMPU_V1
      pedaling=bitRead(PINE,6); //read direction pin of pas sensor and set pedaling to true
    #elif defined(SUPPORT_T9)
      pedaling=true; //no direction pin, set pedaling to true!
    #else
      pas_failtime=pas_failtime+1;
      double pas_factor=(double)pas_on_time/(double)pas_off_time;
      if ((pas_factor>pas_factor_min)&&(pas_factor<pas_factor_max))
      {
          pedaling=true;
          pas_failtime=0;
      }
    #endif
}
#else
#warning PAS sensor support is required for legal operation of a Pedelec  by EU-wide laws except Austria or Swiss.
#endif

void speed_change()    //Wheel Sensor Change------------------------------------------------------------------------------------------------------------------
{
#ifdef SUPPORT_FIRST_AID_MENU
    if (first_aid_ignore_speed)
        return;
#endif

    //Speed and Km
    if (elapsed_less(millis(), last_wheel_time, 50U)) return;          //debouncing reed-sensor
    wheel_counter++;
    wheel_time=(millis()-last_wheel_time)*wheel_magnets;
    spd = (spd+3600*wheel_circumference/wheel_time)/2;  //a bit of averaging for smoother speed-cutoff
    
    if (wheel_counter>(wheel_magnets-1)) //wheel has made one complete revolution
    {
      wheel_counter=0;
      km=km+wheel_circumference/1000.0;
      ++odo;
#if defined(SUPPORT_BMP085) || defined(SUPPORT_DSPC01)
//slope-stuff start-------------------------------
      slope=0.98*slope+2*(altitude-last_altitude)/wheel_circumference;
      last_altitude=altitude;
//slope-stuff end---------------------------------
#endif    
    }
    last_wheel_time=millis();
}


void serial_android(Print* localSerial)
{ 
#if (SERIAL_MODE & SERIAL_MODE_ANDROID)||(BLUETOOTH_MODE & BLUETOOTH_MODE_ANDROID) || defined(SUPPORT_ESP32_BLUETOOTH) || defined(SUPPORT_WIFI_TELEMETRY)
    if (!localSerial) return;
    localSerial->print(voltage,1);
    localSerial->print(MY_F(";"));
    localSerial->print(current,1);
    localSerial->print(MY_F(";"));
    localSerial->print((int)power);
    localSerial->print(MY_F(";"));
    localSerial->print(spd,1);
    localSerial->print(MY_F(";"));
    localSerial->print(km,3);
    localSerial->print(MY_F(";"));
    localSerial->print((int)cad);
    localSerial->print(MY_F(";"));
    localSerial->print((int)wh);
    localSerial->print(MY_F(";"));
    localSerial->print((int)power_human);
    localSerial->print(MY_F(";"));
    localSerial->print((int)wh_human);
    localSerial->print(MY_F(";"));
    localSerial->print((int)(poti_stat/1023.0*curr_power_poti_max));
    localSerial->print(MY_F(";"));
    localSerial->println(CONTROL_MODE);
#endif
}

void serial_logview(Print* localSerial)
{ 
#if (SERIAL_MODE & SERIAL_MODE_LOGVIEW)||(BLUETOOTH_MODE & BLUETOOTH_MODE_LOGVIEW)
    if (!localSerial) return;
    localSerial->print(MY_F("$1;1;0;"));
    localSerial->print(voltage,2);
    localSerial->print(MY_F(";"));
    localSerial->print(current,2);
    localSerial->print(MY_F(";"));
    localSerial->print(wh,1);
    localSerial->print(MY_F(";"));
    localSerial->print(spd,2);
    localSerial->print(MY_F(";"));
    localSerial->print(km,3);
    localSerial->print(MY_F(";"));
    localSerial->print(cad);
    localSerial->print(MY_F(";"));
    localSerial->print(0);   //arbitrary user data here
    localSerial->print(MY_F(";"));
    localSerial->print(0);   //arbitrary user data here
    localSerial->print(MY_F(";"));
    localSerial->print(0);   //arbitrary user data here
    localSerial->print(MY_F(";"));
    localSerial->print(0);  //arbitrary user data here
    localSerial->print(MY_F(";"));
    localSerial->print(0);   //arbitrary user data here
    localSerial->print(MY_F(";"));
    localSerial->print(0);   //arbitrary user data here
    localSerial->print(MY_F(";0"));
    localSerial->println(13,DEC);
#endif
}

void serial_debug(Print* localSerial)
{ 
#if (SERIAL_MODE & SERIAL_MODE_DEBUG)||(BLUETOOTH_MODE & BLUETOOTH_MODE_DEBUG)
    if (!localSerial) return;
#ifdef DEBUG_MEMORY_USAGE
    localSerial->print(MY_F("memFree"));
    localSerial->print(memFree());
    localSerial->print(MY_F(" looptime"));
    localSerial->print(millis()-looptime);
    localSerial->print(MY_F(" "));
#endif
    localSerial->print(MY_F("Voltage"));
    localSerial->print(voltage,2);
    localSerial->print(MY_F(" Current"));
    localSerial->print(current,1);
    localSerial->print(MY_F(" Power"));
    localSerial->print(power,0);
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
    localSerial->print(MY_F(" Pedaling"));
    localSerial->print(pedaling);
    localSerial->print(MY_F(" Torque"));
    localSerial->print(torque_instant,1); //print current torque value in Nm
#else
    localSerial->print(MY_F(" PAS_On"));
    localSerial->print(pas_on_time);
    localSerial->print(MY_F(" PAS_Off"));
    localSerial->print(pas_off_time);
    localSerial->print(MY_F(" PAS_factor"));
    localSerial->print((float)pas_on_time/pas_off_time);
    localSerial->print(MY_F(" Pedaling"));
    localSerial->print(pedaling);
#endif
    localSerial->print(MY_F(" Speed"));
    localSerial->print(spd);
    localSerial->print(MY_F(" Brake"));
    localSerial->print(brake_stat);
    localSerial->print(MY_F(" Poti"));
    localSerial->print(poti_stat);
    localSerial->print(MY_F(" Throttle"));
    localSerial->print(throttle_stat);
#ifdef SUPPORT_TEMP_SENSOR
    localSerial->print(MY_F(" Temp"));
    localSerial->print(sensors.getTempCByIndex(0),2);
#endif
#ifdef SUPPORT_THERMISTOR
    localSerial->print(MY_F(" Temp"));
    localSerial->print(temperature_thermistor,1);
#endif
    /*
        localSerial->print(MY_F(" TEMP"));
        localSerial->print(temperature);
        localSerial->print(MY_F(" ALTI"));
        localSerial->print(altitude);
        localSerial->print(MY_F("/"));
        localSerial->print(altitude_start);
    */
    //now: data for Arduino Pedelec Configurator
    //0:voltage 1:current 2:pasfactor*100 3:option-pin 4:poti 5:throttle 6: brake
    localSerial->print(MY_F("---raw---"));
#ifndef USE_EXTERNAL_VOLTAGE_SENSOR
    localSerial->print(analogRead_noISR(voltage_in)); Serial.print(MY_F(";"));
#else
    localSerial->print(analogRead_noISR(external_voltage_in)); Serial.print(MY_F(";"));
#endif
#ifndef USE_EXTERNAL_CURRENT_SENSOR
#if (HARDWARE_REV <= 21) || (HARDWARE_REV >= 30)
    localSerial->print(analogRead_noISR(current_in)); localSerial->print(MY_F(";"));
#else
    localSerial->print(analogRead_noISR(current_in)-analogRead_noISR(current_in_neg)); localSerial->print(MY_F(";"));
#endif
#else
    localSerial->print(analogRead_noISR(external_current_in)); localSerial->print(MY_F(";"));
#endif
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU)
    localSerial->print(pedaling); localSerial->print(MY_F(";"));
#else
    localSerial->print(((int)(100*(double)pas_on_time/(double)pas_off_time))); localSerial->print(MY_F(";"));
#endif
    localSerial->print(analogRead_noISR(option_pin)); localSerial->print(MY_F(";"));
    localSerial->print(analogRead_noISR(poti_in)); localSerial->print(MY_F(";"));
    localSerial->print(analogRead_noISR(throttle_in)); localSerial->print(MY_F(";"));
    localSerial->println(digitalRead(brake_in));
#endif
}

void serial_mmc(Print* localSerial)
{ 
#if (SERIAL_MODE & SERIAL_MODE_MMC)||(BLUETOOTH_MODE & BLUETOOTH_MODE_MMC)
    if (!localSerial) return;
    localSerial->print((int)(voltage_display*10));
    localSerial->print(MY_F("\t"));
    localSerial->print((int)(current*1000));
    localSerial->print(MY_F("\t"));
    localSerial->print((int)(spd*10));
    localSerial->print(MY_F("\t"));
    localSerial->print((long)(mah*3600));
    localSerial->print(MY_F("\t"));
    localSerial->print((int)0); //naximum current
    localSerial->print(MY_F("\t"));
    localSerial->print((long)(km*1000/wheel_circumference)); //distance
    localSerial->print(MY_F("\t"));
    localSerial->println((int)0); //profile
#endif
}

void serial_ios(Print* localSerial)
{ 
#if (SERIAL_MODE & SERIAL_MODE_IOS)||(BLUETOOTH_MODE & BLUETOOTH_MODE_IOS)
    if (!localSerial) return;
    localSerial->print(voltage,1);
    localSerial->print(MY_F(";"));
    localSerial->print(current,1);
    localSerial->print(MY_F(";"));
    localSerial->print((int)power);
    localSerial->print(MY_F(";"));
    localSerial->print(spd,1);
    localSerial->print(MY_F(";"));
    localSerial->print(km,3);
    localSerial->print(MY_F(";"));
    localSerial->print((int)cad);
    localSerial->print(MY_F(";"));
    localSerial->print((int)wh);
    localSerial->print(MY_F(";"));
    localSerial->print((int)power_human);
    localSerial->print(MY_F(";"));
    localSerial->print((int)wh_human);
    localSerial->print(MY_F(";"));
    localSerial->print((int)(poti_stat/1023.0*curr_power_poti_max));
    localSerial->print(MY_F(";"));
    localSerial->print(CONTROL_MODE);
    localSerial->print(MY_F(";"));
    localSerial->print((int)mah);
    localSerial->print(MY_F(";"));
    localSerial->print(current_profile);
    localSerial->print(MY_F(";"));
    localSerial->println(curr_power_poti_max);
#endif
}

void send_bluetooth_data() //send bluetooth data
{
#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30)
#if (BLUETOOTH_MODE & BLUETOOTH_MODE_ANDROID)
    serial_android(&Serial1);
#endif     
  
#if (BLUETOOTH_MODE & BLUETOOTH_MODE_LOGVIEW)
    serial_logview(&Serial1);
#endif    

#if (BLUETOOTH_MODE & BLUETOOTH_MODE_DEBUG)
    serial_debug(&Serial1);
#endif   
  
#if (BLUETOOTH_MODE & BLUETOOTH_MODE_MMC)
    serial_mmc(&Serial1);
#endif 

#if (BLUETOOTH_MODE & BLUETOOTH_MODE_IOS)
    serial_ios(&Serial1);
#endif

#if (BLUETOOTH_MODE & BLUETOOTH_MODE_DISPLAYDEBUG)
    display_debug(&Serial1);
#endif
#endif // HARDWARE_REV>=20
}

void send_serial_data()  //send serial data
{
#if (SERIAL_MODE & SERIAL_MODE_ANDROID)
    serial_android(&Serial);
#endif     
  
#if (SERIAL_MODE & SERIAL_MODE_LOGVIEW)
    serial_logview(&Serial);
#endif    

#if (SERIAL_MODE & SERIAL_MODE_DEBUG)
    serial_debug(&Serial);
#endif   
  
#if (SERIAL_MODE & SERIAL_MODE_MMC)
    serial_mmc(&Serial);
#endif 

#if (SERIAL_MODE & SERIAL_MODE_IOS)
    serial_ios(&Serial);
#endif

#if (SERIAL_MODE & SERIAL_MODE_DISPLAYDEBUG)
    display_debug(&Serial);
#endif
}



void pin_set_level(byte new_level)
{
    pin_security_level = new_level;
    if (pin_security_level == 0) // Level 0: StVZO Default
    {
        curr_startingaid_speed = startingaid_speed;
        curr_spd_max1 = spd_max1;
        curr_spd_max2 = spd_max2;
        curr_power_max = power_max;
        curr_power_poti_max = power_poti_max;
        curr_capacity = (current_profile == 0) ? capacity : capacity_2;
        pure_throttle_allowed = false;
    }
    else if (pin_security_level == 1) // Level 1: Sport / Trail
    {
        curr_startingaid_speed = startingaid_speed;
        curr_spd_max1 = spd_max1_sport;
        curr_spd_max2 = spd_max2_sport;
        curr_power_max = power_max_sport;
        curr_power_poti_max = power_poti_max_sport;
        curr_capacity = (current_profile == 0) ? capacity : capacity_2;
        pure_throttle_allowed = true; // E-Scooter (eKFV): autarker Daumengasbetrieb bis 20 km/h zulässig (100% Garantie & Gewährleistung intakt)
    }
    else if (pin_security_level == 2) // Level 2: Race / Privatgelände (Master-PIN 210286)
    {
        curr_startingaid_speed = spd_max2_race;
        curr_spd_max1 = spd_max1_race;
        curr_spd_max2 = spd_max2_race;
        curr_power_max = power_max_race;
        curr_power_poti_max = power_poti_max_race;
        curr_capacity = (current_profile == 0) ? capacity : capacity_2;
        pure_throttle_allowed = true; // Handgas freigeschaltet
    }
}

uint32_t compute_pin_hash(const char* serial, bool is_track)
{
    const char* salt = is_track ? "SAGA-METISA-RACE-2026" : "SAGA-METISA-CLASS-2026";
    uint32_t hash = 2166136261UL;
    for (const char* p = serial; *p; ++p)
    {
        char c = *p;
        if (c >= 'a' && c <= 'z') c -= 32;
        if ((c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9'))
        {
            hash ^= (uint8_t)c;
            hash = hash * 16777619UL;
        }
    }
    for (const char* s = salt; *s; ++s)
    {
        hash ^= (uint8_t)*s;
        hash = hash * 16777619UL;
    }
    int32_t signed_hash = (int32_t)hash;
    if (signed_hash < 0) signed_hash = -signed_hash;
    return (uint32_t)((signed_hash % 900000L) + 100000L);
}

bool pin_check_and_apply(unsigned long entered_pin)
{
    if (entered_pin == PIN_MASTER_RACE) // 210286: Master-PIN
    {
        pin_set_level(2);
        return true;
    }
    else if (entered_pin == PIN_SPORT_TRAIL || entered_pin == 1234UL || entered_pin == 130520UL) // E-Scooter (eKFV) / Sport-PIN
    {
        pin_set_level(1);
        return true;
    }
    else if (entered_pin == 0) // Sofortige Sperrung zurück auf StVZO
    {
        pin_set_level(0);
        return true;
    }

    // Dynamic serial-bound PIN verification
    if (metisa_serial_number[0] != '\0' && strcmp(metisa_serial_number, "SAGA-UNPROVISIONED") != 0)
    {
        if (entered_pin == compute_pin_hash(metisa_serial_number, true))
        {
            pin_set_level(2);
            return true;
        }
        if (entered_pin == compute_pin_hash(metisa_serial_number, false))
        {
            pin_set_level(1);
            return true;
        }
    }
    return false;
}

void activate_new_profile()
{
    if (pin_security_level != 0)
    {
        pin_set_level(pin_security_level);
        return;
    }

    if (current_profile==0)
    {
        curr_startingaid_speed =startingaid_speed;
        curr_spd_max1= spd_max1;
        curr_spd_max2=spd_max2;
        curr_power_max=power_max;
        curr_power_poti_max=power_poti_max;
        curr_capacity = capacity;
    }
    else
    {
        curr_startingaid_speed = startingaid_speed_2;
        curr_spd_max1= spd_max1_2;
        curr_spd_max2=spd_max2_2;
        curr_power_max=power_max_2;
        curr_power_poti_max=power_poti_max_2;
        curr_capacity = capacity_2;
    }
}

void handle_dspc()
{
#ifdef SUPPORT_DSPC01
    if (!dspc_mode) //altitude mode
    {
        if ((millis()-dspc_timer)>200)
        {
            altitude=dspc.altitude()/10.0-altitude_start;
            dspc_mode=1;
            dspc_timer=millis();
            dspc.request_temperature();
        }
    }
    else
    {
        if ((millis()-dspc_timer)>200)
        {
            temperature=dspc.temperature()/10.0;
            dspc_mode=0;
            dspc_timer=millis();
            dspc.request_altitude();
        }
    }
#endif
}

void save_eeprom()
{
  //save the voltage value 2 seconds before switch-off-detection    
  if (voltage_2s)
      variable_new.voltage=voltage_2s;
  else
      variable_new.voltage=voltage;

  variable_new.wh=wh;          //save watthours drawn from battery
  variable_new.kilometers=km;  //save trip kilometers
  variable_new.mah=mah;        //save milliamperehours drawn from battery
#if defined(__AVR__)
  uint8_t old_sreg = SREG;
  cli();
  variable_new.odo = odo;        //save total kilometers
  SREG = old_sreg;
#else
  variable_new.odo = odo;        //save total kilometers
#endif
#ifdef SUPPORT_BATTERY_CHARGE_COUNTER
  variable_new.charge_count=charge_count; //save charge counter
#endif
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
  variable_new.wh_human=wh_human; //save human watthours
#endif
  const byte* p_new = (const byte*)(const void*)&variable_new; //pointer to new variables to save
  const byte* p_old = (const byte*)(const void*)&variable; //pointer to current EEPROM content
    unsigned int i;
  for (i = 0; i < sizeof(variable_new); i++)
  {
    if (*p_new==*p_old) //this byte has not changed --> ignore
      ++p_new;
    else
      EEPROM.write(i, *(p_new++)); //this byte has changed --> write
    ++p_old;
  }
    variable = variable_new;

    // Persist provisioned serial number if set
    if (metisa_serial_number[0] == 'S')
    {
        for (i = 0; i < sizeof(metisa_serial_number); i++)
        {
            if (EEPROM.read(64 + i) != (byte)metisa_serial_number[i])
                EEPROM.write(64 + i, (byte)metisa_serial_number[i]);
        }
    }
}

void read_eeprom()
{
  byte* p = (byte*)(void*)&variable;
    unsigned int i;
  cli();
  for (i = 0; i < sizeof(variable); i++)
    *p++ = EEPROM.read(i);
  sei();

  // Restore serial number from EEPROM offset 64 if provisioned
  if (EEPROM.read(64) == 'S')
  {
    for (i = 0; i < sizeof(metisa_serial_number) - 1; i++)
    {
      char c = (char)EEPROM.read(64 + i);
      if (c == 0 || c == (char)0xFF) break;
      metisa_serial_number[i] = c;
    }
    metisa_serial_number[i] = '\0';
  }
}

void save_shutdown()
{
  digitalWrite(throttle_out,0); //turn motor off
#if defined(SUPPORT_MOTOR_SERVO)
  if (motorservo.attached()) {
    motorservo.detach();
  }
#endif
  // Turn off all lights and signaling outputs safely
  lights_front_active = false;
  lights_high_beam_active = false;
  lights_rear_active = false;
  lights_brake_active = false;
  turn_left_active = false;
  turn_right_active = false;
  hazard_active = false;
  horn_active = false;
  update_lights_and_signals();
#if defined(__AVR__)
  EIMSK=0; //disable interrupts
  cli(); //disable interrupts
  ADCSRA = 0; //disable ADC 
#if defined(PRR0)
  PRR0=B11101111; //shut down I2C, Timers, ADCs, UARTS
  PRR1=B00111111; //shut down I2C, Timers, ADCs, UARTS   
#elif defined(PRR)
  PRR=B11101111;
#endif  
#else
  cli();
#endif  
  
  save_eeprom(); //save variables now
  
#if HARDWARE_REV >= 2
  digitalWrite(fet_out,FET_OFF); //turn off
#endif
  wdt_disable(); // Disable watchdog before indefinite halt
  while(true); //there is nothing more to do -> stay in endless loop until turned off

}

void handle_unused_pins()
{
#if (HARDWARE_REV >= 20) && (HARDWARE_REV < 30) && defined(__AVR__)
  //this saves 10-20 mA!
  DDRA=0; //set all Ports to input
  PORTA = B11111111;
  PORTB|= B01010001;
  PORTC = B11111111;
  PORTD|= B01110000;
  PORTE|= B00000100;
  PORTF|= B11000011;
  PORTG|= B00011111;
  PORTH|= B10000000;
  PORTJ|= B11111100;
  PORTK|= B00011111;
  PORTL|= B11000111;
#endif
}

int analogRead_noISR(uint8_t pin) //this function makes sure that analogRead is never used in interrupt. only important for X-Cell RT bottom brackets
{
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
    analogRead_in_use = true; //this prevents analogReads in Interrupt from Thun bracket
    if (torque_want_calculation)
    {
      torque_want_calculation=false;
      read_current_torque();
    }
#endif
    int temp=analogRead(pin);
#if defined(SUPPORT_XCELL_RT) || defined(SUPPORT_SEMPU_V1) || defined(SUPPORT_SEMPU) || defined(SUPPORT_T9)
    analogRead_in_use = false;
#endif
    return temp;
}
