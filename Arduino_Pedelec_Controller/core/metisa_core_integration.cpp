/*
 * SaGa Labs METISA - Board-neutral C++ core integration adapter (implementation)
 *
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#include "metisa_core_integration.h"

#ifdef METISA_CORE_ENABLE

namespace metisa_core {

CoreRuntime g_core;

void coreInit(
    metisa::Watts   powerLimitLegal,
    metisa::TenthsKmH speedLimitLegal,
    metisa::TenthsKmH speedLimitSport,
    metisa::TenthsKmH speedLimitTrack,
    metisa::Millivolts vCutoffMv,
    metisa::Millivolts vEmergencyMv
)
{
    g_core.config.speedLimitLegal = speedLimitLegal;
    g_core.config.speedLimitSport = speedLimitSport;
    g_core.config.speedLimitTrack = speedLimitTrack;
    g_core.config.powerLimitLegal = powerLimitLegal;

    g_core.config.vCutoffMv    = vCutoffMv;
    g_core.config.vEmergencyMv = vEmergencyMv;

    // Remaining fields keep their struct defaults until a hardware target
    // defines real values. Nothing is invented here.

    g_core.motor.init(g_core.config);
    g_core.safety.resetFaults();

    g_core.lastFaults       = metisa::SafetyFault::NONE;
    g_core.lastDuty         = 0;
    g_core.initialised      = true;
    g_core.lastEvaluateMs   = 0;
}

metisa::AuthorizationLevel coreAuthLevelFromLegacy(unsigned int legacyLevel)
{
    switch (legacyLevel) {
        case 2:  return metisa::AuthorizationLevel::TRACK;
        case 1:  return metisa::AuthorizationLevel::SPORT;
        default: return metisa::AuthorizationLevel::LEGAL;
    }
}

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
)
{
    if (!g_core.initialised) {
        return 0;
    }

    g_core.telemetry.brakeActive         = brakeActive;
    g_core.telemetry.throttleAdcRaw      = throttleAdcRaw;
    g_core.telemetry.voltageMv           = voltageMv;
    g_core.telemetry.currentMa           = currentMa;
    g_core.telemetry.speedTenthsKmh      = speedTenthsKmh;
    g_core.telemetry.cadenceRpm          = cadenceRpm;
    g_core.telemetry.lastPasPulseMs      = lastPasPulseMs;
    g_core.telemetry.temperatureTenthsC  = temperatureTenthsC;
    g_core.telemetry.walkAssistRequested = walkAssistRequested;

    const metisa::AuthorizationLevel level =
        coreAuthLevelFromLegacy(legacySecurityLevel);

    g_core.lastFaults = g_core.safety.evaluate(
        g_core.telemetry,
        g_core.config,
        level,
        nowMs,
        g_core.motor.getCurrentDutyCycle()
    );

    g_core.lastDuty = g_core.motor.computeDutyCycle(
        g_core.telemetry,
        g_core.safety,
        g_core.config,
        nowMs
    );

    g_core.lastEvaluateMs = nowMs;
    return g_core.lastDuty;
}

bool coreMotorCutoffRequired()
{
    return g_core.safety.isMotorCutoffRequired();
}

metisa::Watts coreEffectivePowerCapW()
{
    return g_core.safety.getEffectivePowerCapW();
}

metisa::TenthsKmH coreEffectiveSpeedCapTenthsKmh()
{
    return g_core.safety.getEffectiveSpeedCapTenthsKmh();
}

metisa::SafetyFault coreActiveFaults()
{
    return g_core.safety.getActiveFaults();
}

} // namespace metisa_core

#endif // METISA_CORE_ENABLE
