/*
 * Portable ST7789 SPI driver for 32-bit platforms (STM32, RP2040, ESP32)
 * Inherits from Adafruit_GFX for font and primitive rendering with zero external library overhead.
 */
#ifndef ST7789_PORTABLE_H
#define ST7789_PORTABLE_H

#ifdef min
#undef min
#endif
#ifdef max
#undef max
#endif

#include <Arduino.h>
#include <SPI.h>
#include <Adafruit_GFX.h>

#ifndef min
#define min(a,b) (((a)<(b))?(a):(b))
#endif
#ifndef max
#define max(a,b) (((a)>(b))?(a):(b))
#endif

class ST7789_Portable : public Adafruit_GFX
{
private:
    int8_t _cs;
    int8_t _dc;
    int8_t _rst;

    inline void write_cmd(uint8_t cmd)
    {
        digitalWrite(_dc, LOW);
        if (_cs >= 0) digitalWrite(_cs, LOW);
        SPI.transfer(cmd);
        if (_cs >= 0) digitalWrite(_cs, HIGH);
    }

    inline void write_data(uint8_t data)
    {
        digitalWrite(_dc, HIGH);
        if (_cs >= 0) digitalWrite(_cs, LOW);
        SPI.transfer(data);
        if (_cs >= 0) digitalWrite(_cs, HIGH);
    }

    void set_addr_window(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1)
    {
        write_cmd(0x2A); // CASET
        write_data(x0 >> 8); write_data(x0 & 0xFF);
        write_data(x1 >> 8); write_data(x1 & 0xFF);

        write_cmd(0x2B); // RASET
        write_data(y0 >> 8); write_data(y0 & 0xFF);
        write_data(y1 >> 8); write_data(y1 & 0xFF);

        write_cmd(0x2C); // RAMWR
    }

public:
    ST7789_Portable(int8_t cs, int8_t dc, int8_t rst = -1)
        : Adafruit_GFX(240, 320), _cs(cs), _dc(dc), _rst(rst)
    {
    }

    void init(uint16_t height = 240, uint16_t width = 320)
    {
        _width = width;
        _height = height;

        if (_cs >= 0)
        {
            pinMode(_cs, OUTPUT);
            digitalWrite(_cs, HIGH);
        }
        pinMode(_dc, OUTPUT);
        digitalWrite(_dc, HIGH);

        if (_rst >= 0)
        {
            pinMode(_rst, OUTPUT);
            digitalWrite(_rst, HIGH);
            delay(10);
            digitalWrite(_rst, LOW);
            delay(20);
            digitalWrite(_rst, HIGH);
            delay(120);
        }

        SPI.begin();

        write_cmd(0x01); // SWRESET
        delay(120);

        write_cmd(0x11); // SLPOUT
        delay(120);

        write_cmd(0x3A); // COLMOD
        write_data(0x55); // 16-bit RGB 5-6-5

        setRotation(1); // Default to landscape (320x240)

        write_cmd(0x29); // DISPON
        delay(20);
    }

    void setRotation(uint8_t m) override
    {
        Adafruit_GFX::setRotation(m);
        write_cmd(0x36); // MADCTL
        switch (rotation)
        {
            case 0:
                write_data(0x00);
                _width  = 240;
                _height = 320;
                break;
            case 1:
                write_data(0x70); // Landscape
                _width  = 320;
                _height = 240;
                break;
            case 2:
                write_data(0xC0);
                _width  = 240;
                _height = 320;
                break;
            case 3:
                write_data(0xA0); // Landscape reverse
                _width  = 320;
                _height = 240;
                break;
        }
    }

    void drawPixel(int16_t x, int16_t y, uint16_t color) override
    {
        if (x < 0 || x >= _width || y < 0 || y >= _height) return;
        set_addr_window(x, y, x, y);
        digitalWrite(_dc, HIGH);
        if (_cs >= 0) digitalWrite(_cs, LOW);
        SPI.transfer(color >> 8);
        SPI.transfer(color & 0xFF);
        if (_cs >= 0) digitalWrite(_cs, HIGH);
    }

    void fillRect(int16_t x, int16_t y, int16_t w, int16_t h, uint16_t color) override
    {
        if (x < 0) { w += x; x = 0; }
        if (y < 0) { h += y; y = 0; }
        if (x + w > _width) w = _width - x;
        if (y + h > _height) h = _height - y;
        if (w <= 0 || h <= 0) return;

        set_addr_window(x, y, x + w - 1, y + h - 1);
        digitalWrite(_dc, HIGH);
        if (_cs >= 0) digitalWrite(_cs, LOW);
        uint8_t hi = color >> 8;
        uint8_t lo = color & 0xFF;
        uint32_t count = (uint32_t)w * h;
        for (uint32_t i = 0; i < count; ++i)
        {
            SPI.transfer(hi);
            SPI.transfer(lo);
        }
        if (_cs >= 0) digitalWrite(_cs, HIGH);
    }

    void drawFastHLine(int16_t x, int16_t y, int16_t w, uint16_t color) override
    {
        fillRect(x, y, w, 1, color);
    }

    void drawFastVLine(int16_t x, int16_t y, int16_t h, uint16_t color) override
    {
        fillRect(x, y, 1, h, color);
    }
};

#endif
