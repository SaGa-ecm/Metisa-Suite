/*
 * SaGa Labs METISA - Board-neutral C++ core integration adapter
 *
 * Purpose: instantiate and drive the metisa:: C++ core (MotorController,
 * SafetyManager) from the legacy Arduino sketch, using only values that are
 * already present in the running firmware. No pin map, ADC reference, PWM
 * frequency, FET polarity or reset behaviour is invented here.
 *
 * This adapter is observational and board-neutral. It is enabled explicitly
 * via METISA_CORE_ENABLE and performs no hardware writes of its own.
 *
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#ifndef METISA_CORE_INTEGRATION_H
#define METISA_CORE_INTEGRATION_H

#ifdef METISA_CORE_ENABLE

#include "core/motor_control.h"
#include "core/safety_manager.h"
#include "core/metisa_types.h"

namespace metisa_core {

// Fixed cycle for the core evaluation. Matches the PID sample time of 10 ms.
static const metisa::Milliseconds CORE_CYCLE_MS = 10;

// Adapter state. Kept in one place so the sketch has a single seam.
struct CoreRuntime {
    metisa::MotorController motor;
    metisa::SafetyManager   safety;
    metisa::DriveConfig     config;

    // Last telemetry assembled from legacy globals (for diagnostics).
    metisa::SensorTelemetry telemetry;
    metisa::SafetyFault     lastFaults;
    metisa::DutyCycle16     lastDuty;

    bool initialised;
    metisa::Milliseconds lastEvaluateMs;
};

// Single runtime instance owned by the sketch.
// Defined in metisa_core_integration.cpp to avoid multiple definition.
extern CoreRuntime g_core;

// Initialise the core with a config whose limits are taken from the legacy
// live variables (curr_power_max, curr_spd_max1, curr_spd_max2). The caller
// passes those values explicitly so nothing is invented.
void coreInit(
    metisa::Watts   powerLimitLegal,
    metisa::TenthsKmH speedLimitLegal,
    metisa::TenthsKmH speedLimitSport,
    metisa::TenthsKmH speedLimitTrack,
    metisa::Millivolts vCutoffMv,
    metisa::Millivolts vEmergencyMv
);

// Map the legacy PIN security level (0/1/2) onto the core authorization enum.
metisa::AuthorizationLevel coreAuthLevelFromLegacy(unsigned int legacyLevel);

// Assemble telemetry from legacy globals and run one core evaluation.
// Returns the duty cycle the core would command. Caller decides whether to
// act on it. Does not write any hardware register.
metisa::DutyCycle16 coreEvaluate(
    bool              brakeActive,
    uint16_t          throttleAdcRaw,
    metisa::Millivolts voltageMv,
    metisa::Milliamps  currentMa,
    metisa::TenthsKmH  speedTenthsKmh,
    metisa::Rpm        cadenceRpm,
    metisa::Milliseconds lastPasPulseMs,
    metisa::TenthsDegC temperatureTenthsC,
    bool              walkAssistRequested,
    unsigned int      legacySecurityLevel,
    metisa::Milliseconds nowMs
);

// Read-only accessors for diagnostics and telemetry export.
bool coreMotorCutoffRequired();
metisa::Watts    coreEffectivePowerCapW();
metisa::TenthsKmH coreEffectiveSpeedCapTenthsKmh();
metisa::SafetyFault coreActiveFaults();

} // namespace metisa_core

#endif // METISA_CORE_ENABLE

#endif // METISA_CORE_INTEGRATION_H
