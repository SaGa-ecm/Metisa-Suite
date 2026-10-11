/*
 * SaGa Labs METISA - Motor Control & Regulation Engine
 * Benchmark: Ecumaster / MoTeC Motorsport ECU Regulation
 * Smooth Speed Ramp, Cadence Scaling, Soft Cut-Off & Anti-Jerk
 *
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#ifndef METISA_MOTOR_CONTROL_H
#define METISA_MOTOR_CONTROL_H

#include "metisa_types.h"
#include "safety_manager.h"

namespace metisa {

struct PidTunings {
    int16_t kp;
    int16_t ki;
    int16_t kd;
};

class MotorController {
public:
    MotorController();

    void init(const DriveConfig& config);
    void setPidTunings(const PidTunings& tunings);

    // Main Control Loop Update (Call at fixed cycle, e.g. 50 Hz / 20 ms)
    DutyCycle16 computeDutyCycle(
        const SensorTelemetry& telemetry,
        const SafetyManager& safety,
        const DriveConfig& config,
        Milliseconds currentTimestampMs
    );

    DutyCycle16 getCurrentDutyCycle() const { return currentDuty; }
    uint8_t get8BitPwm() const { return static_cast<uint8_t>(currentDuty >> 8); }
    void reset();

private:
    DutyCycle16 currentDuty;
    DutyCycle16 targetDuty;
    
    int32_t integralAccumulator;
    int16_t lastSpeedError;
    
    PidTunings pid;
    Milliseconds lastComputeMs;
    
    // Smooth Speed Limit Derating (Ramp down between rampStart and maxSpeed)
    uint16_t calculateSpeedCutoffFactor(TenthsKmH speed, TenthsKmH maxSpeed);
    
    // Smooth Voltage Derating
    uint16_t calculateVoltageDeratingFactor(Millivolts voltage, Millivolts cutoff, Millivolts emergency);
};

} // namespace metisa

#endif // METISA_MOTOR_CONTROL_H
