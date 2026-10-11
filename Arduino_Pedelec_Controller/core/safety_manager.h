/*
 * SaGa Labs METISA - Safety Manager & Fault Monitor
 * Benchmark: Ecumaster / MoTeC Functional Safety & EN 15194 Interlocks
 * Failsafe Protection, Thermal Derating, Plausibility Checks
 *
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#ifndef METISA_SAFETY_MANAGER_H
#define METISA_SAFETY_MANAGER_H

#include "metisa_types.h"

namespace metisa {

struct SensorTelemetry {
    bool         brakeActive;
    uint16_t     throttleAdcRaw;
    Millivolts   voltageMv;
    Milliamps    currentMa;
    TenthsKmH    speedTenthsKmh;
    Rpm          cadenceRpm;
    Milliseconds lastPasPulseMs;
    TenthsDegC   temperatureTenthsC;
    bool         walkAssistRequested;
};

class SafetyManager {
public:
    SafetyManager();

    // Evaluation Cycle
    SafetyFault evaluate(
        const SensorTelemetry& telemetry,
        const DriveConfig& config,
        AuthorizationLevel level,
        Milliseconds currentTimestampMs,
        uint16_t commandedMotorDuty
    );

    // Safety Invariant State Queries
    bool isMotorCutoffRequired() const;
    Watts getEffectivePowerCapW() const { return effectivePowerCapW; }
    TenthsKmH getEffectiveSpeedCapTenthsKmh() const { return effectiveSpeedCap; }
    SafetyFault getActiveFaults() const { return activeFaults; }

    void resetFaults();

private:
    SafetyFault activeFaults;
    Watts effectivePowerCapW;
    TenthsKmH effectiveSpeedCap;
    
    // Broken speed sensor tracking
    Milliseconds highPowerSinceMs;
    bool highPowerTrackingActive;
};

} // namespace metisa

#endif // METISA_SAFETY_MANAGER_H
