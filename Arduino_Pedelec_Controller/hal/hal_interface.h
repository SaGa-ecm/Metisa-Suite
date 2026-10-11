/*
 * SaGa Labs METISA - Hardware Abstraction Layer (HAL) Interface Standard
 * Benchmark: Ecumaster / MoTeC Clean Hardware Decoupling
 * Zero-Cost Extensible C++ Interfaces for Multi-Target MCUs
 *
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#ifndef METISA_HAL_INTERFACE_H
#define METISA_HAL_INTERFACE_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

namespace metisa {
namespace hal {

enum class PinMode : uint8_t {
    INPUT_MODE,
    INPUT_PULLUP_MODE,
    OUTPUT_MODE
};

enum class PinState : uint8_t {
    PIN_LOW = 0,
    PIN_HIGH = 1
};

// Abstract GPIO Interface
class IGpio {
public:
    virtual ~IGpio() = default;
    virtual void setPinMode(uint8_t pin, PinMode mode) = 0;
    virtual void writePin(uint8_t pin, PinState state) = 0;
    virtual PinState readPin(uint8_t pin) = 0;
    virtual void togglePin(uint8_t pin) = 0;
};

// Abstract PWM Timer Interface
class IPwm {
public:
    virtual ~IPwm() = default;
    virtual void init(uint8_t pin, uint32_t frequencyHz) = 0;
    virtual void setDuty16(uint8_t pin, uint16_t duty65535) = 0;
    virtual void setDuty8(uint8_t pin, uint8_t duty255) = 0;
    virtual void stop(uint8_t pin) = 0;
};

// Abstract Multichannel ADC Interface
class IAdc {
public:
    virtual ~IAdc() = default;
    virtual void init() = 0;
    virtual uint16_t readRaw(uint8_t channel) = 0;
    virtual uint32_t readMillivolts(uint8_t channel) = 0;
    virtual uint8_t getResolutionBits() const = 0;
};

// Abstract Non-Volatile Storage (EEPROM / Flash Emulation)
class INvm {
public:
    virtual ~INvm() = default;
    virtual bool read(uint16_t address, void* buffer, size_t length) = 0;
    virtual bool write(uint16_t address, const void* buffer, size_t length) = 0;
    virtual bool commit() = 0;
    virtual size_t getCapacity() const = 0;
};

// Abstract High-Precision Clock
class IClock {
public:
    virtual ~IClock() = default;
    virtual uint32_t getMillis() = 0;
    virtual uint32_t getMicros() = 0;
    virtual void delayMs(uint32_t ms) = 0;
    virtual void delayUs(uint32_t us) = 0;
};

} // namespace hal
} // namespace metisa

#endif // METISA_HAL_INTERFACE_H
