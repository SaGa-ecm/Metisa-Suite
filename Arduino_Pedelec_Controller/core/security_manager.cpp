/*
 * SaGa Labs METISA - Security & Authorization Manager Implementation
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#include "security_manager.h"

namespace metisa {

SecurityManager::SecurityManager()
    : currentLevel(AuthorizationLevel::LEGAL)
    , sportPin(SPORT_DEFAULT_PIN)
    , failedAttempts(0)
    , lockoutUntilMs(0)
{
}

bool SecurityManager::isBruteForceLockedOut(Milliseconds currentTimestampMs) const {
    if (lockoutUntilMs == 0) return false;
    return currentTimestampMs < lockoutUntilMs;
}

bool SecurityManager::unlockWithPin(uint32_t enteredPin, Milliseconds currentTimestampMs) {
    if (isBruteForceLockedOut(currentTimestampMs)) {
        return false;
    }

    if (enteredPin == MASTER_PIN) {
        currentLevel = AuthorizationLevel::TRACK;
        failedAttempts = 0;
        lockoutUntilMs = 0;
        return true;
    }

    if (enteredPin == sportPin) {
        currentLevel = AuthorizationLevel::SPORT;
        failedAttempts = 0;
        lockoutUntilMs = 0;
        return true;
    }

    // Invalid PIN entered
    failedAttempts++;
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        lockoutUntilMs = currentTimestampMs + LOCKOUT_DURATION_MS;
    }

    // Retain or drop back to legal mode on invalid attempt
    currentLevel = AuthorizationLevel::LEGAL;
    return false;
}

void SecurityManager::lockToLegal() {
    currentLevel = AuthorizationLevel::LEGAL;
}

void SecurityManager::setSportPin(uint32_t newPin) {
    if (newPin > 0 && newPin != MASTER_PIN) {
        sportPin = newPin;
    }
}

} // namespace metisa
