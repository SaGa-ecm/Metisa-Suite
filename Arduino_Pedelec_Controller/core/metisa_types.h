/*
 * SaGa Labs METISA - Core Data Types & Physical Units Standard
 * Benchmark: Ecumaster / MoTeC Motorsport Grade
 * Bracketed Units: [V, A, W, km/h, RPM, ms, degC, Nm]
 *
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#ifndef METISA_TYPES_H
#define METISA_TYPES_H

#include <stdint.h>
#include <stdbool.h>

namespace metisa {

// Physical Unit Representation Types
typedef uint16_t Millivolts;      // [mV]
typedef int16_t  Milliamps;       // [mA] (signed for regen)
typedef uint16_t Watts;           // [W]
typedef uint16_t TenthsKmH;       // [0.1 km/h] (e.g. 250 = 25.0 km/h)
typedef uint16_t Rpm;             // [RPM] (Cadence or Motor RPM)
typedef int16_t  TenthsDegC;      // [0.1 degC] (e.g. 450 = 45.0 degC)
typedef uint32_t Milliseconds;    // [ms]
typedef uint32_t OdometerMeters;  // [m]
typedef uint16_t DutyCycle16;     // [0..65535] 16-bit normalized duty cycle

// Security and Mode Classification
enum class AuthorizationLevel : uint8_t {
    LEGAL = 0,   // StVZO / EN 15194 Pedelec (25 km/h, 250 W, PAS mandatory)
    SPORT = 1,   // Private Trail / S-Pedelec (45 km/h, 500 W)
    TRACK = 2    // Dyno / Closed Race Track / R&D (Unrestricted: 99 km/h, 3000 W, Handgas)
};

// Safety System Status Flags
enum class SafetyFault : uint16_t {
    NONE                  = 0x0000,
    BRAKE_ACTIVE          = 0x0001,
    THROTTLE_OUT_OF_RANGE = 0x0002,
    SPEED_SENSOR_FAULT    = 0x0004,
    PAS_TIMEOUT           = 0x0008,
    OVERCURRENT           = 0x0010,
    UNDERVOLTAGE          = 0x0020,
    OVERVOLTAGE           = 0x0040,
    OVERTEMPERATURE       = 0x0080,
    WATCHDOG_TRIP         = 0x0100,
    COMMUNICATION_LOST    = 0x0200
};

inline SafetyFault operator|(SafetyFault a, SafetyFault b) {
    return static_cast<SafetyFault>(static_cast<uint16_t>(a) | static_cast<uint16_t>(b));
}

inline bool hasFault(SafetyFault mask, SafetyFault check) {
    return (static_cast<uint16_t>(mask) & static_cast<uint16_t>(check)) != 0;
}

// Drive Profile Calibration Configuration Structure
struct DriveConfig {
    uint16_t speedLimitLegal;     // [0.1 km/h] default: 250 (25.0 km/h)
    uint16_t speedLimitSport;     // [0.1 km/h] default: 450 (45.0 km/h)
    uint16_t speedLimitTrack;     // [0.1 km/h] default: 990 (99.0 km/h)
    
    uint16_t powerLimitLegal;     // [W] default: 250 W
    uint16_t powerLimitSport;     // [W] default: 500 W
    uint16_t powerLimitTrack;     // [W] default: 3000 W
    
    uint16_t startingAidSpeed;    // [0.1 km/h] default: 60 (6.0 km/h)
    uint16_t pasTimeoutMs;        // [ms] default: 500 ms
    
    uint16_t vCutoffMv;           // [mV] Battery cutoff threshold
    uint16_t vEmergencyMv;        // [mV] Battery emergency shutdown threshold
    
    uint16_t currentMaxMa;        // [mA] Peak current limit
    
    uint16_t throttleMinRaw;      // Raw ADC lower plausibility boundary
    uint16_t throttleMaxRaw;      // Raw ADC upper plausibility boundary
    
    uint16_t wheelCircumferenceMm;// [mm] Wheel circumference
};

} // namespace metisa

#endif // METISA_TYPES_H
