/*
 * SaGa Labs METISA - Espressif ESP32 (Xtensa Dual-Core) Concrete HAL
 * (c) 2026 Benjamin Everts, Bielefeld / SaGa Labs Technologies.
 * Sole Intellectual Property & Rights Reserved.
 */

#ifndef METISA_HAL_ESP32_H
#define METISA_HAL_ESP32_H

#if defined(ARDUINO_ARCH_ESP32)

#include "hal_interface.h"
#include <Arduino.h>

namespace metisa {
namespace hal {

class Esp32Gpio : public IGpio {
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

class Esp32Pwm : public IPwm {
public:
    void init(uint8_t pin, uint32_t frequencyHz) override {
        ledcAttach(pin, frequencyHz, 12); // ESP32 LEDC PWM with 12-bit resolution
    }
    void setDuty16(uint8_t pin, uint16_t duty65535) override {
        ledcWrite(pin, duty65535 >> 4); // scale 16-bit to 12-bit
    }
    void setDuty8(uint8_t pin, uint8_t duty255) override {
        ledcWrite(pin, static_cast<uint32_t>(duty255) << 4);
    }
    void stop(uint8_t pin) override {
        ledcWrite(pin, 0);
    }
};

class Esp32Adc : public IAdc {
public:
    void init() override {
        analogReadResolution(12);
    }
    uint16_t readRaw(uint8_t channel) override {
        return analogRead(channel);
    }
    uint32_t readMillivolts(uint8_t channel) override {
        return analogReadMilliVolts(channel);
    }
    uint8_t getResolutionBits() const override { return 12; }
};

class Esp32Nvm : public INvm {
public:
    bool read(uint16_t address, void* buffer, size_t length) override {
        (void)address; (void)buffer; (void)length;
        return true;
    }
    bool write(uint16_t address, const void* buffer, size_t length) override {
        (void)address; (void)buffer; (void)length;
        return true;
    }
    bool commit() override { return true; }
    size_t getCapacity() const override { return 4096; }
};

class Esp32Clock : public IClock {
public:
    uint32_t getMillis() override { return millis(); }
    uint32_t getMicros() override { return micros(); }
    void delayMs(uint32_t ms) override { delay(ms); }
    void delayUs(uint32_t us) override { delayMicroseconds(us); }
};

} // namespace hal
} // namespace metisa

#endif // ARDUINO_ARCH_ESP32
#endif // METISA_HAL_ESP32_H
