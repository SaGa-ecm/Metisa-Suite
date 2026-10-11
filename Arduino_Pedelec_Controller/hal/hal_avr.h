/*
 * SaGa Labs METISA - Atmel AVR (ATmega328P / ATmega2560) Concrete HAL
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#ifndef METISA_HAL_AVR_H
#define METISA_HAL_AVR_H

#if defined(__AVR__)

#include "hal_interface.h"
#include <Arduino.h>
#include <EEPROM.h>

namespace metisa {
namespace hal {

class AvrGpio : public IGpio {
public:
    void setPinMode(uint8_t pin, PinMode mode) override {
        switch (mode) {
            case PinMode::INPUT_MODE: pinMode(pin, INPUT); break;
            case PinMode::INPUT_PULLUP_MODE: pinMode(pin, INPUT_PULLUP); break;
            case PinMode::OUTPUT_MODE: pinMode(pin, OUTPUT); break;
        }
    }
    void writePin(uint8_t pin, PinState state) override {
        digitalWrite(pin, (state == PinState::PIN_HIGH) ? HIGH : LOW);
    }
    PinState readPin(uint8_t pin) override {
        return (digitalRead(pin) == HIGH) ? PinState::PIN_HIGH : PinState::PIN_LOW;
    }
    void togglePin(uint8_t pin) override {
        digitalWrite(pin, !digitalRead(pin));
    }
};

class AvrPwm : public IPwm {
public:
    void init(uint8_t pin, uint32_t frequencyHz) override {
        (void)frequencyHz;
        pinMode(pin, OUTPUT);
    }
    void setDuty16(uint8_t pin, uint16_t duty65535) override {
        analogWrite(pin, duty65535 >> 8);
    }
    void setDuty8(uint8_t pin, uint8_t duty255) override {
        analogWrite(pin, duty255);
    }
    void stop(uint8_t pin) override {
        analogWrite(pin, 0);
    }
};

class AvrAdc : public IAdc {
public:
    void init() override {}
    uint16_t readRaw(uint8_t channel) override {
        return analogRead(channel);
    }
    uint32_t readMillivolts(uint8_t channel) override {
        return (static_cast<uint32_t>(readRaw(channel)) * 5000) / 1024;
    }
    uint8_t getResolutionBits() const override { return 10; }
};

class AvrNvm : public INvm {
public:
    bool read(uint16_t address, void* buffer, size_t length) override {
        uint8_t* ptr = static_cast<uint8_t*>(buffer);
        for (size_t i = 0; i < length; i++) {
            ptr[i] = EEPROM.read(address + i);
        }
        return true;
    }
    bool write(uint16_t address, const void* buffer, size_t length) override {
        const uint8_t* ptr = static_cast<const uint8_t*>(buffer);
        for (size_t i = 0; i < length; i++) {
            EEPROM.update(address + i, ptr[i]);
        }
        return true;
    }
    bool commit() override { return true; }
    size_t getCapacity() const override { return E2END + 1; }
};

class AvrClock : public IClock {
public:
    uint32_t getMillis() override { return millis(); }
    uint32_t getMicros() override { return micros(); }
    void delayMs(uint32_t ms) override { delay(ms); }
    void delayUs(uint32_t us) override { delayMicroseconds(us); }
};

} // namespace hal
} // namespace metisa

#endif // __AVR__
#endif // METISA_HAL_AVR_H
