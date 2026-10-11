/*
 * SaGa Labs METISA - Security & Authorization Manager
 * Benchmark: Ecumaster / MoTeC Multi-Profile Security Standard
 * 3-Level State Machine with Brute-Force Rate Limiting
 *
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#ifndef METISA_SECURITY_MANAGER_H
#define METISA_SECURITY_MANAGER_H

#include "metisa_types.h"

namespace metisa {

class SecurityManager {
public:
    static constexpr uint32_t MASTER_PIN = 210286;
    static constexpr uint32_t SPORT_DEFAULT_PIN = 1234;
    static constexpr uint8_t  MAX_FAILED_ATTEMPTS = 5;
    static constexpr uint32_t LOCKOUT_DURATION_MS = 30000; // 30s lockout after 5 fails

    SecurityManager();

    // Verification and Level Setting
    bool unlockWithPin(uint32_t enteredPin, Milliseconds currentTimestampMs);
    void lockToLegal();
    void setSportPin(uint32_t newPin);

    // Queries
    AuthorizationLevel getLevel() const { return currentLevel; }
    bool isRaceTrackUnlocked() const { return currentLevel == AuthorizationLevel::TRACK; }
    bool isSportUnlocked() const { return currentLevel == AuthorizationLevel::SPORT; }
    bool isLocked() const { return currentLevel == AuthorizationLevel::LEGAL; }
    bool isBruteForceLockedOut(Milliseconds currentTimestampMs) const;

    uint8_t getFailedAttempts() const { return failedAttempts; }

private:
    AuthorizationLevel currentLevel;
    uint32_t sportPin;
    uint8_t  failedAttempts;
    Milliseconds lockoutUntilMs;
};

} // namespace metisa

#endif // METISA_SECURITY_MANAGER_H
