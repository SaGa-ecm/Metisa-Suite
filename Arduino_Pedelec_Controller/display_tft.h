#ifndef DISPLAY_TFT_H
#define DISPLAY_TFT_H

#include "config.h"
#if (DISPLAY_TYPE & DISPLAY_TYPE_TFT_ST7789)

#include <Arduino.h>

class TFTDisplay : public Print
{
public:
    void begin(uint8_t width = 84, uint8_t height = 48, uint8_t model = 0);
    void clear();
    void setCursor(uint8_t col, uint8_t row);
    void setCursorInPixels(uint8_t x, uint8_t y);
    size_t write(uint8_t c);
    size_t write(int c) { return write((uint8_t)c); }
    void createChar(uint8_t loc, const uint8_t *glyph);
    void drawBitmap(const uint8_t *data, uint8_t cols, uint8_t lines);
    void drawVerticalBar(word maxV, word limit, word value,
                         byte width, byte height,
                         byte outer = 2, byte inner = 1);
    using Print::write;
};

#endif
#endif