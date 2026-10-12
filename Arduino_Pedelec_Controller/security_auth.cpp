/**
 * ============================================================================
 * METISA ORBIT EMBEDDED SECURITY SUBSYSTEM - LEAN OPTIMIZED IMPLEMENTATION
 * Zero stdio formatting dependencies (no sscanf/sprintf/snprintf)
 * Optimized for AVR ATmega328P Flash & RAM limits and ESP32 hardware crypto
 * ============================================================================
 */

#include "security_auth.h"
#include "hal.h"

#if defined(ARDUINO_ARCH_ESP32)
#include <mbedtls/md.h>
#include <esp_system.h>
#endif

// ----------------------------------------------------------------------------
// Static Variables & Factory PSK (Gerätespezifischer Flash-Schlüssel)
// ----------------------------------------------------------------------------
uint8_t SecurityAuth::currentChallenge[CHALLENGE_LEN_BYTES] = {0};
uint32_t SecurityAuth::challengeTimestamp = 0;
bool SecurityAuth::challengeActive = false;
uint8_t SecurityAuth::failedAttempts = 0;
uint32_t SecurityAuth::lockoutUntilMs = 0;

// 256-Bit Pre-Shared Key im Flash
const uint8_t SecurityAuth::devicePsk[32] PROGMEM = {
    0x4D, 0x45, 0x54, 0x49, 0x53, 0x41, 0x5F, 0x53, // "METISA_S"
    0x41, 0x47, 0x41, 0x5F, 0x4C, 0x41, 0x42, 0x53, // "AGA_LABS"
    0x9F, 0x82, 0x11, 0x4B, 0xC3, 0xD4, 0x7E, 0x2A, // Entropie-Bytes
    0x58, 0x10, 0x99, 0xAA, 0x33, 0x77, 0xEE, 0xFF
};

// ----------------------------------------------------------------------------
// Ultra-Lean Hex Helpers (Zero libc stdio overhead)
// ----------------------------------------------------------------------------
static inline uint8_t hexNibble(char c) {
    if (c >= '0' && c <= '9') return (uint8_t)(c - '0');
    if (c >= 'a' && c <= 'f') return (uint8_t)(c - 'a' + 10);
    if (c >= 'A' && c <= 'F') return (uint8_t)(c - 'A' + 10);
    return 0;
}

static inline void byteToHex(uint8_t b, char* out) {
    const char hexChars[] = "0123456789ABCDEF";
    out[0] = hexChars[(b >> 4) & 0x0F];
    out[1] = hexChars[b & 0x0F];
}

static void word16ToHex(uint16_t w, char* out) {
    byteToHex((uint8_t)(w >> 8), out);
    byteToHex((uint8_t)(w & 0xFF), out + 2);
}

static void word32ToHex(uint32_t w, char* out) {
    byteToHex((uint8_t)(w >> 24), out);
    byteToHex((uint8_t)(w >> 16), out + 2);
    byteToHex((uint8_t)(w >> 8), out + 4);
    byteToHex((uint8_t)(w & 0xFF), out + 6);
}

// ----------------------------------------------------------------------------
// Lean AVR Software SHA-256 (Rolling 16-word circular buffer)
// ----------------------------------------------------------------------------
#if !defined(ARDUINO_ARCH_ESP32)

static uint32_t ror32(uint32_t x, uint8_t n) __attribute__((noinline));
static uint32_t ror32(uint32_t x, uint8_t n) {
    return (x >> n) | (x << (32 - n));
}

static uint32_t ep0_f(uint32_t x) __attribute__((noinline));
static uint32_t ep0_f(uint32_t x) {
    return ror32(x, 2) ^ ror32(x, 13) ^ ror32(x, 22);
}

static uint32_t ep1_f(uint32_t x) __attribute__((noinline));
static uint32_t ep1_f(uint32_t x) {
    return ror32(x, 6) ^ ror32(x, 11) ^ ror32(x, 25);
}

static uint32_t sig0_f(uint32_t x) __attribute__((noinline));
static uint32_t sig0_f(uint32_t x) {
    return ror32(x, 7) ^ ror32(x, 18) ^ (x >> 3);
}

static uint32_t sig1_f(uint32_t x) __attribute__((noinline));
static uint32_t sig1_f(uint32_t x) {
    return ror32(x, 17) ^ ror32(x, 19) ^ (x >> 10);
}

#define CH(x, y, z) (((x) & (y)) ^ (~(x) & (z)))
#define MAJ(x, y, z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))

static const uint32_t K256[64] PROGMEM = {
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
};

struct Sha256Ctx {
    uint32_t state[8];
    uint32_t totalLen;
    uint8_t  buffer[64];
    uint8_t  bufLen;
};

static void sha256Init(Sha256Ctx* ctx) {
    ctx->state[0] = 0x6a09e667; ctx->state[1] = 0xbb67ae85;
    ctx->state[2] = 0x3c6ef372; ctx->state[3] = 0xa54ff53a;
    ctx->state[4] = 0x510e527f; ctx->state[5] = 0x9b05688c;
    ctx->state[6] = 0x1f83d9ab; ctx->state[7] = 0x5be0cd19;
    ctx->totalLen = 0;
    ctx->bufLen = 0;
}

__attribute__((noinline))
static void sha256ProcessBlock(Sha256Ctx* ctx, const uint8_t* block) {
    uint32_t w[16];
    for (uint8_t i = 0; i < 16; ++i) {
        w[i] = ((uint32_t)block[i * 4] << 24) |
               ((uint32_t)block[i * 4 + 1] << 16) |
               ((uint32_t)block[i * 4 + 2] << 8) |
               ((uint32_t)block[i * 4 + 3]);
    }

    uint32_t s[8];
    for (uint8_t j = 0; j < 8; ++j) {
        s[j] = ctx->state[j];
    }

    for (uint8_t i = 0; i < 64; ++i) {
        uint32_t w_val;
        if (i < 16) {
            w_val = w[i];
        } else {
            uint32_t s0 = sig0_f(w[(i + 1) & 15]);
            uint32_t s1 = sig1_f(w[(i + 14) & 15]);
            w_val = w[i & 15] = w[i & 15] + s1 + w[(i + 9) & 15] + s0;
        }

        uint8_t p = (8 - (i & 7)) & 7;
        uint32_t a = s[p];
        uint32_t b = s[(p + 1) & 7];
        uint32_t c = s[(p + 2) & 7];
        uint32_t e = s[(p + 4) & 7];
        uint32_t f = s[(p + 5) & 7];
        uint32_t g = s[(p + 6) & 7];
        uint32_t h = s[(p + 7) & 7];

        uint32_t t1 = h + ep1_f(e) + CH(e, f, g) + pgm_read_dword(&K256[i]) + w_val;
        uint32_t t2 = ep0_f(a) + MAJ(a, b, c);

        s[(p + 3) & 7] += t1;
        s[(p + 7) & 7] = t1 + t2;
    }

    for (uint8_t j = 0; j < 8; ++j) {
        ctx->state[j] += s[j];
    }
}

static void sha256Update(Sha256Ctx* ctx, const uint8_t* data, size_t len) {
    ctx->totalLen += len;
    while (len > 0) {
        uint8_t toCopy = 64 - ctx->bufLen;
        if (toCopy > len) toCopy = (uint8_t)len;
        memcpy(&ctx->buffer[ctx->bufLen], data, toCopy);
        ctx->bufLen += toCopy;
        data += toCopy;
        len -= toCopy;
        if (ctx->bufLen == 64) {
            sha256ProcessBlock(ctx, ctx->buffer);
            ctx->bufLen = 0;
        }
    }
}

static void sha256Final(Sha256Ctx* ctx, uint8_t digest[32]) {
    ctx->buffer[ctx->bufLen++] = 0x80;
    if (ctx->bufLen > 56) {
        while (ctx->bufLen < 64) ctx->buffer[ctx->bufLen++] = 0;
        sha256ProcessBlock(ctx, ctx->buffer);
        ctx->bufLen = 0;
    }
    while (ctx->bufLen < 56) ctx->buffer[ctx->bufLen++] = 0;
    uint32_t totalBits = ctx->totalLen * 8;
    ctx->buffer[56] = 0; ctx->buffer[57] = 0; ctx->buffer[58] = 0; ctx->buffer[59] = 0;
    ctx->buffer[60] = (uint8_t)(totalBits >> 24);
    ctx->buffer[61] = (uint8_t)(totalBits >> 16);
    ctx->buffer[62] = (uint8_t)(totalBits >> 8);
    ctx->buffer[63] = (uint8_t)totalBits;
    sha256ProcessBlock(ctx, ctx->buffer);

    for (uint8_t i = 0; i < 8; ++i) {
        digest[i * 4]     = (uint8_t)(ctx->state[i] >> 24);
        digest[i * 4 + 1] = (uint8_t)(ctx->state[i] >> 16);
        digest[i * 4 + 2] = (uint8_t)(ctx->state[i] >> 8);
        digest[i * 4 + 3] = (uint8_t)(ctx->state[i]);
    }
}
#endif

// ----------------------------------------------------------------------------
// HMAC-SHA256 Generator
// ----------------------------------------------------------------------------
__attribute__((noinline))
void SecurityAuth::computeHmacSha256(const uint8_t* key, size_t keyLen, 
                                     const uint8_t* data, size_t dataLen, 
                                     uint8_t* outHmac) {
#if defined(ARDUINO_ARCH_ESP32)
    mbedtls_md_context_t ctx;
    mbedtls_md_init(&ctx);
    mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(MBEDTLS_MD_SHA256), 1);
    mbedtls_md_hmac_starts(&ctx, key, keyLen);
    mbedtls_md_hmac_update(&ctx, data, dataLen);
    mbedtls_md_hmac_finish(&ctx, outHmac);
    mbedtls_md_free(&ctx);
#else
    uint8_t k_pad[64];
    memset(k_pad, 0x36, 64);
    for (size_t i = 0; i < 32 && i < keyLen; i++) {
        k_pad[i] ^= pgm_read_byte(&key[i]);
    }

    Sha256Ctx ctx;
    uint8_t innerHash[32];
    sha256Init(&ctx);
    sha256Update(&ctx, k_pad, 64);
    sha256Update(&ctx, data, dataLen);
    sha256Final(&ctx, innerHash);

    memset(k_pad, 0x5c, 64);
    for (size_t i = 0; i < 32 && i < keyLen; i++) {
        k_pad[i] ^= pgm_read_byte(&key[i]);
    }

    sha256Init(&ctx);
    sha256Update(&ctx, k_pad, 64);
    sha256Update(&ctx, innerHash, 32);
    sha256Final(&ctx, outHmac);
#endif
}

// ----------------------------------------------------------------------------
// Constant-Time Memory Comparison (Timing-Attack Protection)
// ----------------------------------------------------------------------------
bool SecurityAuth::constantTimeMemCmp(const uint8_t* a, const uint8_t* b, size_t len) {
    uint8_t diff = 0;
    for (size_t i = 0; i < len; ++i) {
        diff |= (a[i] ^ b[i]);
    }
    return (diff == 0);
}

// ----------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------
void SecurityAuth::init() {
    challengeActive = false;
    failedAttempts = 0;
    lockoutUntilMs = 0;
}

bool SecurityAuth::isRestricted(uint16_t reg) {
    return (reg >= REG_ZONE_B_START && reg <= REG_ZONE_B_END);
}

bool SecurityAuth::isLockedOut() {
    if (lockoutUntilMs == 0) return false;
    if (millis() >= lockoutUntilMs) {
        lockoutUntilMs = 0;
        failedAttempts = 0;
        return false;
    }
    return true;
}

uint32_t SecurityAuth::getRemainingLockoutMs() {
    if (!isLockedOut()) return 0;
    return (lockoutUntilMs - millis());
}

bool SecurityAuth::writeBasic(uint16_t reg, int32_t val) {
    // Zero-Trust Boundary: Niemals geschützte Register ohne Handshake beschreiben
    if (isRestricted(reg)) {
        return false;
    }
    commitToStorage(reg, val);
    return true;
}

bool SecurityAuth::generateChallenge(char* outChallengeHex) {
    if (isLockedOut()) return false;

    // Kryptografische Nonce-Erzeugung
    for (size_t i = 0; i < CHALLENGE_LEN_BYTES; ++i) {
#if defined(ARDUINO_ARCH_ESP32)
        currentChallenge[i] = (uint8_t)esp_random();
#else
        // Entropie-Harvesting auf AVR: ADC-Rauschen + Microlaufzeit
        uint16_t noise = analogRead(A0) ^ (uint16_t)micros();
        currentChallenge[i] = (uint8_t)(noise ^ (noise >> 8));
        delayMicroseconds(12);
#endif
    }

    challengeTimestamp = millis();
    challengeActive = true;

    // Hex-Konvertierung
    for (size_t i = 0; i < CHALLENGE_LEN_BYTES; ++i) {
        byteToHex(currentChallenge[i], &outChallengeHex[i * 2]);
    }
    outChallengeHex[CHALLENGE_HEX_STR_LEN - 1] = '\0';
    return true;
}

AuthResult SecurityAuth::writeSecure(uint16_t reg, int32_t val, const char* receivedHmacHex) {
    if (isLockedOut()) {
        return AUTH_ERR_PORT_LOCKED;
    }

    if (!challengeActive || (millis() - challengeTimestamp > CHALLENGE_TTL_MS)) {
        challengeActive = false;
        return AUTH_ERR_CHALLENGE_EXPIRED;
    }

    if (strlen(receivedHmacHex) != 64) {
        return AUTH_ERR_MALFORMED_PACKET;
    }

    // Payload manuell ohne snprintf formatieren:
    // Format: "NONCE32:REG4:VAL8" (32 + 1 + 4 + 1 + 8 = 46 Zeichen)
    char signedPayload[48];
    for (size_t i = 0; i < CHALLENGE_LEN_BYTES; ++i) {
        byteToHex(currentChallenge[i], &signedPayload[i * 2]);
    }
    signedPayload[32] = ':';
    word16ToHex(reg, &signedPayload[33]);
    signedPayload[37] = ':';
    word32ToHex((uint32_t)val, &signedPayload[38]);
    signedPayload[46] = '\0';

    uint8_t expectedHmac[32];
    computeHmacSha256(devicePsk, sizeof(devicePsk), (const uint8_t*)signedPayload, 46, expectedHmac);

    // Konvertiere empfangenen Hex-String in Bytes
    uint8_t receivedHmac[32];
    for (size_t i = 0; i < 32; ++i) {
        receivedHmac[i] = (hexNibble(receivedHmacHex[i * 2]) << 4) | hexNibble(receivedHmacHex[i * 2 + 1]);
    }

    // Single-Use Nonce sofort invalidieren (Replay-Angriffsschutz)
    challengeActive = false;

    // Zeitkonstante Validierung
    if (!constantTimeMemCmp(expectedHmac, receivedHmac, 32)) {
        failedAttempts++;
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            lockoutUntilMs = millis() + LOCKOUT_DURATION_MS;
        }
        return AUTH_ERR_INVALID_HMAC;
    }

    // Authentifizierung erfolgreich: Fehlversuche zurücksetzen & Parameter persistieren
    failedAttempts = 0;
    commitToStorage(reg, val);
    return AUTH_OK;
}

void SecurityAuth::commitToStorage(uint16_t reg, int32_t val) {
    extern int curr_power_max;
    extern int curr_power_poti_max;
    extern int curr_spd_max1;
    extern int curr_spd_max2;
    extern bool pure_throttle_allowed;
    extern void pin_set_level(byte new_level);
    extern void save_eeprom();

    // Hardware-Routing & EEPROM-Abbildung
    switch (reg) {
        // ZONE A (Unrestricted Basic Parameters)
        case REG_WHEEL_CIRCUMFERENCE: {
            break;
        }
        case REG_DISPLAY_TYPE: {
            break;
        }
        case REG_DISPLAY_CONTRAST: {
            break;
        }
        case REG_IDLE_SHUTDOWN_SEC: {
            break;
        }

        // ZONE B (Restricted Inverter Safety Limits)
        case REG_POWER_MAX_WATTS: {
            if (val >= 100 && val <= 3500) {
                curr_power_max = (int)val;
            }
            break;
        }
        case REG_POWER_POTI_MAX: {
            if (val >= 100 && val <= 3500) {
                curr_power_poti_max = (int)val;
            }
            break;
        }
        case REG_SPEED_CUTOFF_STOP: {
            if (val >= 100 && val <= 1200) { // 10.0 to 120.0 km/h (Faktor 10)
                curr_spd_max2 = (int)(val / 10);
            }
            break;
        }
        case REG_SPEED_CUTOFF_START: {
            if (val >= 100 && val <= 1200) {
                curr_spd_max1 = (int)(val / 10);
            }
            break;
        }
        case REG_PURE_THROTTLE_ALLOWED: {
            pure_throttle_allowed = (val > 0);
            break;
        }
        case REG_SECURITY_CLASS_LEVEL: {
            if (val >= 0 && val <= 2) {
                pin_set_level((byte)val);
            }
            break;
        }
    }

    // Im EEPROM sichern
    save_eeprom();
}
