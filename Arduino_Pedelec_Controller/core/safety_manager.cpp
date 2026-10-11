/*
 * SaGa Labs METISA - Safety Manager Implementation
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#include "safety_manager.h"

namespace metisa {

SafetyManager::SafetyManager()
    : activeFaults(SafetyFault::NONE)
    , effectivePowerCapW(250)
    , effectiveSpeedCap(250)
    , highPowerSinceMs(0)
    , highPowerTrackingActive(false)
{
}

void SafetyManager::resetFaults() {
    activeFaults = SafetyFault::NONE;
}

SafetyFault SafetyManager::evaluate(
    const SensorTelemetry& telemetry,
    const DriveConfig& config,
    AuthorizationLevel level,
    Milliseconds currentTimestampMs,
    uint16_t commandedMotorDuty
) {
    uint16_t faults = 0;

    // 1. Brake Interlock: Mechanical or Hall Brake Active -> Cut motor immediately
    if (telemetry.brakeActive) {
        faults |= static_cast<uint16_t>(SafetyFault::BRAKE_ACTIVE);
    }

    // 2. Throttle Plausibility Check (Broken wire / ground loss / short to 5V)
    if (telemetry.throttleAdcRaw > 0) {
        if (telemetry.throttleAdcRaw < (config.throttleMinRaw > 50 ? config.throttleMinRaw - 50 : 0) ||
            telemetry.throttleAdcRaw > (config.throttleMaxRaw + 100)) {
            faults |= static_cast<uint16_t>(SafetyFault::THROTTLE_OUT_OF_RANGE);
        }
    }

    // 3. Battery Voltage Protection
    if (telemetry.voltageMv > 0) {
        if (telemetry.voltageMv < config.vEmergencyMv) {
            faults |= static_cast<uint16_t>(SafetyFault::UNDERVOLTAGE);
        }
    }

    // 4. Broken Speed Sensor Protection (Detect disconnect while under power)
    if (commandedMotorDuty > 32768) { // >50% duty
        if (!highPowerTrackingActive) {
            highPowerSinceMs = currentTimestampMs;
            highPowerTrackingActive = true;
        } else if ((currentTimestampMs - highPowerSinceMs) > 5000 && telemetry.speedTenthsKmh == 0) {
            faults |= static_cast<uint16_t>(SafetyFault::SPEED_SENSOR_FAULT);
        }
    } else {
        highPowerTrackingActive = false;
    }

    // 5. EN 15194 PAS (Pedal Assist Sensor) Supervision
    if (level != AuthorizationLevel::TRACK) {
        // In LEGAL and SPORT, motor only allowed if pedaling OR walk assist active
        bool isWalkAssist = telemetry.walkAssistRequested && (telemetry.speedTenthsKmh <= config.startingAidSpeed);
        if (!isWalkAssist) {
            if ((currentTimestampMs - telemetry.lastPasPulseMs) > config.pasTimeoutMs && telemetry.cadenceRpm == 0) {
                faults |= static_cast<uint16_t>(SafetyFault::PAS_TIMEOUT);
            }
        }
    }

    // 6. Profile Limits & Thermal Derating
    switch (level) {
        case AuthorizationLevel::TRACK:
            effectiveSpeedCap = config.speedLimitTrack;
            effectivePowerCapW = config.powerLimitTrack;
            break;
        case AuthorizationLevel::SPORT:
            effectiveSpeedCap = config.speedLimitSport;
            effectivePowerCapW = config.powerLimitSport;
            break;
        case AuthorizationLevel::LEGAL:
        default:
            effectiveSpeedCap = config.speedLimitLegal;
            effectivePowerCapW = config.powerLimitLegal;
            break;
    }

    // Thermal Derating: If motor/FET temperature exceeds 80.0 °C, derate power linearly down to 0 at 100.0 °C
    if (telemetry.temperatureTenthsC > 800) {
        if (telemetry.temperatureTenthsC >= 1000) {
            faults |= static_cast<uint16_t>(SafetyFault::OVERTEMPERATURE);
            effectivePowerCapW = 0;
        } else {
            uint16_t derateFactor = 1000 - telemetry.temperatureTenthsC; // 200 down to 0
            effectivePowerCapW = (static_cast<uint32_t>(effectivePowerCapW) * derateFactor) / 200;
        }
    }

    activeFaults = static_cast<SafetyFault>(faults);
    return activeFaults;
}

bool SafetyManager::isMotorCutoffRequired() const {
    const uint16_t cutoffMask =
        static_cast<uint16_t>(SafetyFault::BRAKE_ACTIVE) |
        static_cast<uint16_t>(SafetyFault::THROTTLE_OUT_OF_RANGE) |
        static_cast<uint16_t>(SafetyFault::SPEED_SENSOR_FAULT) |
        static_cast<uint16_t>(SafetyFault::PAS_TIMEOUT) |
        static_cast<uint16_t>(SafetyFault::UNDERVOLTAGE) |
        static_cast<uint16_t>(SafetyFault::OVERTEMPERATURE);

    return (static_cast<uint16_t>(activeFaults) & cutoffMask) != 0;
}

} // namespace metisa
