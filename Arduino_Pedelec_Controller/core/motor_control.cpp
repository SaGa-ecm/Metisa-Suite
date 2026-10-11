/*
 * SaGa Labs METISA - Motor Control Implementation
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#include "motor_control.h"

namespace metisa {

MotorController::MotorController()
    : currentDuty(0)
    , targetDuty(0)
    , integralAccumulator(0)
    , lastSpeedError(0)
    , pid{10, 2, 0}
    , lastComputeMs(0)
{
}

void MotorController::init(const DriveConfig& config) {
    (void)config;
    reset();
}

void MotorController::reset() {
    currentDuty = 0;
    targetDuty = 0;
    integralAccumulator = 0;
    lastSpeedError = 0;
}

void MotorController::setPidTunings(const PidTunings& tunings) {
    pid = tunings;
}

uint16_t MotorController::calculateSpeedCutoffFactor(TenthsKmH speed, TenthsKmH maxSpeed) {
    // Smooth linear power roll-off over the top 3.0 km/h (30 tenths)
    if (speed >= maxSpeed) {
        return 0; // Full cutoff at limit
    }
    
    const uint16_t rampWindow = 30; // 3.0 km/h
    if (maxSpeed > rampWindow && speed > (maxSpeed - rampWindow)) {
        uint16_t delta = maxSpeed - speed; // 30 down to 1
        return (static_cast<uint32_t>(delta) * 1024) / rampWindow; // 1024 down to 0
    }
    
    return 1024; // 100% full factor below cutoff ramp
}

uint16_t MotorController::calculateVoltageDeratingFactor(Millivolts voltage, Millivolts cutoff, Millivolts emergency) {
    if (voltage <= emergency) return 0;
    if (voltage >= cutoff) return 1024;
    
    uint32_t span = cutoff - emergency;
    if (span == 0) return 1024;
    
    uint32_t delta = voltage - emergency;
    return static_cast<uint16_t>((delta * 1024) / span);
}

DutyCycle16 MotorController::computeDutyCycle(
    const SensorTelemetry& telemetry,
    const SafetyManager& safety,
    const DriveConfig& config,
    Milliseconds currentTimestampMs
) {
    // 1. Check Safety Manager Interlocks: If cutoff requested, immediately reset to 0
    if (safety.isMotorCutoffRequired() || safety.getEffectivePowerCapW() == 0) {
        reset();
        return 0;
    }

    // 2. Compute Raw Demand from Throttle or PAS
    uint32_t rawDemand = 0;
    if (telemetry.throttleAdcRaw > config.throttleMinRaw) {
        uint32_t range = (config.throttleMaxRaw > config.throttleMinRaw) 
                         ? (config.throttleMaxRaw - config.throttleMinRaw) : 1;
        uint32_t val = telemetry.throttleAdcRaw - config.throttleMinRaw;
        if (val > range) val = range;
        rawDemand = (val * 65535) / range;
    } else if (telemetry.cadenceRpm > 0) {
        // Linear cadence assist curve: scales between 30 RPM and 80 RPM
        if (telemetry.cadenceRpm >= 80) {
            rawDemand = 65535;
        } else if (telemetry.cadenceRpm > 30) {
            rawDemand = ((static_cast<uint32_t>(telemetry.cadenceRpm - 30)) * 65535) / 50;
        } else {
            rawDemand = 10000; // minimum assist threshold
        }
    } else if (telemetry.walkAssistRequested) {
        rawDemand = 20000; // ~30% walk assist
    }

    // 3. Apply Speed Cutoff Scaling
    uint16_t speedFactor = calculateSpeedCutoffFactor(telemetry.speedTenthsKmh, safety.getEffectiveSpeedCapTenthsKmh());
    rawDemand = (rawDemand * speedFactor) / 1024;

    // 4. Apply Voltage Derating Scaling
    uint16_t voltFactor = calculateVoltageDeratingFactor(telemetry.voltageMv, config.vCutoffMv, config.vEmergencyMv);
    rawDemand = (rawDemand * voltFactor) / 1024;

    // 5. Apply Power Limit Scaling (relative to 3000 W max hardware capability)
    uint32_t powerCap = safety.getEffectivePowerCapW();
    if (powerCap < 3000) {
        uint32_t powerDutyLimit = (powerCap * 65535) / 3000;
        if (rawDemand > powerDutyLimit) {
            rawDemand = powerDutyLimit;
        }
    }

    targetDuty = static_cast<DutyCycle16>(rawDemand);

    // 6. Anti-Jerk Slew Rate Limiter (Soft Ramp)
    // Ramp up max 2000 counts per 20 ms (~0.65s 0-100%), ramp down 4000 counts per 20 ms
    const uint16_t maxRampUp = 2000;
    const uint16_t maxRampDown = 4000;

    if (targetDuty > currentDuty) {
        if ((targetDuty - currentDuty) > maxRampUp) {
            currentDuty += maxRampUp;
        } else {
            currentDuty = targetDuty;
        }
    } else if (targetDuty < currentDuty) {
        if ((currentDuty - targetDuty) > maxRampDown) {
            currentDuty -= maxRampDown;
        } else {
            currentDuty = targetDuty;
        }
    }

    lastComputeMs = currentTimestampMs;
    return currentDuty;
}

} // namespace metisa
