/**
 * ============================================================================
 * METISA ORBIT EMBEDDED SECURITY SUBSYSTEM
 * Architecture: Split-Privilege RBAC & HMAC-SHA256 Challenge-Response
 * Copyright (c) 2026 Benjamin Everts / SaGa Labs. All rights reserved.
 * ============================================================================
 */

#ifndef SECURITY_AUTH_H
#define SECURITY_AUTH_H

#include <Arduino.h>

// ----------------------------------------------------------------------------
// Register Definition & Privilege Boundaries
// ----------------------------------------------------------------------------
#define REG_ZONE_A_START          0x0000
#define REG_ZONE_A_END            0x00FF
#define REG_ZONE_B_START          0x0100
#define REG_ZONE_B_END            0x01FF

// Zone A: Unrestricted Registers (Basic Config)
#define REG_WHEEL_CIRCUMFERENCE   0x0010  // Wheel circumference in [mm]
#define REG_DISPLAY_TYPE          0x0011  // Display type index (ST7789, Nokia, King-Meter)
#define REG_DISPLAY_CONTRAST      0x0012  // Display contrast (0..255)
#define REG_IDLE_SHUTDOWN_SEC     0x0013  // Idle sleep timeout in [s]
#define REG_LIGHT_CONFIG          0x0014  // Headlight/taillight preset config

// Zone B: Restricted Registers (Motorsport / Dyno Inverter Limits)
#define REG_POWER_MAX_WATTS       0x0100  // Continuous power limit in [W] (250 to 3000)
#define REG_SPEED_CUTOFF_STOP     0x0101  // Hard velocity cutoff in [km/h * 10]
#define REG_SPEED_CUTOFF_START    0x0102  // Soft derating start in [km/h * 10]
#define REG_POWER_POTI_MAX        0x0103  // Poti power limit in [W]
#define REG_PURE_THROTTLE_ALLOWED 0x0104  // Pure throttle without pedaling (0=off, 1=on)
#define REG_PHASE_CURRENT_MAX_A   0x0105  // Motor phase current limit in [A * 10]
#define REG_SECURITY_CLASS_LEVEL  0x0106  // 0=StVZO EN 15194, 1=eKFV, 2=Race

// ----------------------------------------------------------------------------
// Security Parameters & Rate Limiting
// ----------------------------------------------------------------------------
#define CHALLENGE_LEN_BYTES       16
#define CHALLENGE_HEX_STR_LEN     33      // 16 Bytes * 2 + 1 null terminator
#define HMAC_SHA256_BYTES         32
#define HMAC_HEX_STR_LEN          65      // 32 Bytes * 2 + 1 null terminator
#define CHALLENGE_TTL_MS          8000UL  // 8.0 seconds lifetime
#define MAX_FAILED_ATTEMPTS       3       // Failed attempts before cooldown
#define LOCKOUT_DURATION_MS       30000UL // 30.0 seconds port lockout

enum AuthResult {
    AUTH_OK = 0,
    AUTH_ERR_RESTRICTED_REGISTER,
    AUTH_ERR_CHALLENGE_EXPIRED,
    AUTH_ERR_INVALID_HMAC,
    AUTH_ERR_PORT_LOCKED,
    AUTH_ERR_MALFORMED_PACKET
};

class SecurityAuth {
public:
    static void init();
    static bool isRestricted(uint16_t reg);
    
    // Zone A: Unrestricted direct write
    static bool writeBasic(uint16_t reg, int32_t val);
    
    // Zone B: Secure handshake
    static bool generateChallenge(char* outChallengeHex);
    static AuthResult writeSecure(uint16_t reg, int32_t val, const char* receivedHmacHex);
    
    // Cooldown & Rate Limiting
    static bool isLockedOut();
    static uint32_t getRemainingLockoutMs();

private:
    static uint8_t currentChallenge[CHALLENGE_LEN_BYTES];
    static uint32_t challengeTimestamp;
    static bool challengeActive;
    static uint8_t failedAttempts;
    static uint32_t lockoutUntilMs;

    // Pre-Shared Device Secret (Device PSK in Flash)
    static const uint8_t devicePsk[32];

    static void computeHmacSha256(const uint8_t* key, size_t keyLen, 
                                  const uint8_t* data, size_t dataLen, 
                                  uint8_t* outHmac);
    static bool constantTimeMemCmp(const uint8_t* a, const uint8_t* b, size_t len);
    static void commitToStorage(uint16_t reg, int32_t val);
};

#endif // SECURITY_AUTH_H
