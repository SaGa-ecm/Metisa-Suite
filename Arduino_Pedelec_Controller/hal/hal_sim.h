/*
 * SaGa Labs METISA - Desktop Host Simulation HAL
 * Enables native host testing on Windows / Linux without hardware
 *
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#ifndef METISA_HAL_SIM_H
#define METISA_HAL_SIM_H

#include "hal_interface.h"
#include <string.h>

namespace metisa {
namespace hal {

class SimGpio : public IGpio {
public:
    SimGpio() {
        memset(pinStates, 0, sizeof(pinStates));
        memset(pinModes, 0, sizeof(pinModes));
    }
    void setPinMode(uint8_t pin, PinMode mode) override {
        if (pin < 64) pinModes[pin] = mode;
    }
    void writePin(uint8_t pin, PinState state) override {
        if (pin < 64) pinStates[pin] = state;
    }
    PinState readPin(uint8_t pin) override {
        return (pin < 64) ? pinStates[pin] : PinState::PIN_LOW;
    }
    void togglePin(uint8_t pin) override {
        if (pin < 64) {
            pinStates[pin] = (pinStates[pin] == PinState::PIN_LOW) ? PinState::PIN_HIGH : PinState::PIN_LOW;
        }
    }
    // Simulation Injection Helpers
    void injectPinState(uint8_t pin, PinState state) { writePin(pin, state); }

private:
    PinState pinStates[64];
    PinMode pinModes[64];
};

class SimPwm : public IPwm {
public:
    SimPwm() {
        memset(duties16, 0, sizeof(duties16));
    }
    void init(uint8_t pin, uint32_t frequencyHz) override {
        (void)pin; (void)frequencyHz;
    }
    void setDuty16(uint8_t pin, uint16_t duty65535) override {
        if (pin < 64) duties16[pin] = duty65535;
    }
    void setDuty8(uint8_t pin, uint8_t duty255) override {
        if (pin < 64) duties16[pin] = static_cast<uint16_t>(duty255) << 8;
    }
    void stop(uint8_t pin) override {
        if (pin < 64) duties16[pin] = 0;
    }
    uint16_t getDuty16(uint8_t pin) const {
        return (pin < 64) ? duties16[pin] : 0;
    }

private:
    uint16_t duties16[64];
};

class SimAdc : public IAdc {
public:
    SimAdc() {
        memset(rawValues, 0, sizeof(rawValues));
    }
    void init() override {}
    uint16_t readRaw(uint8_t channel) override {
        return (channel < 16) ? rawValues[channel] : 0;
    }
    uint32_t readMillivolts(uint8_t channel) override {
        return (static_cast<uint32_t>(readRaw(channel)) * 5000) / 1024;
    }
    uint8_t getResolutionBits() const override { return 10; }
    
    // Simulation Injection Helper
    void injectRaw(uint8_t channel, uint16_t val) {
        if (channel < 16) rawValues[channel] = val;
    }

private:
    uint16_t rawValues[16];
};

class SimNvm : public INvm {
public:
    SimNvm() {
        memset(storage, 0xFF, sizeof(storage));
    }
    bool read(uint16_t address, void* buffer, size_t length) override {
        if (address + length > sizeof(storage)) return false;
        memcpy(buffer, &storage[address], length);
        return true;
    }
    bool write(uint16_t address, const void* buffer, size_t length) override {
        if (address + length > sizeof(storage)) return false;
        memcpy(&storage[address], buffer, length);
        return true;
    }
    bool commit() override { return true; }
    size_t getCapacity() const override { return sizeof(storage); }

private:
    uint8_t storage[2048];
};

class SimClock : public IClock {
public:
    SimClock() : simMs(0) {}
    uint32_t getMillis() override { return simMs; }
    uint32_t getMicros() override { return simMs * 1000; }
    void delayMs(uint32_t ms) override { simMs += ms; }
    void delayUs(uint32_t us) override { simMs += (us / 1000); }
    
    void advanceMs(uint32_t ms) { simMs += ms; }
    void setMs(uint32_t ms) { simMs = ms; }

private:
    uint32_t simMs;
};

} // namespace hal
} // namespace metisa

#endif // METISA_HAL_SIM_H
