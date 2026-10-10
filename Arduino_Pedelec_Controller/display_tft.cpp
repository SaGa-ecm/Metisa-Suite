#include "config.h"
#if (DISPLAY_TYPE & DISPLAY_TYPE_TFT_ST7789)

#include "display_tft.h"

#if defined(__AVR__)
#include <ST7789_AVR.h>
// ST7789_AVR argument order: (int8_t DC, int8_t RST, int8_t CS)
static ST7789_AVR tft(TFT_DC, TFT_RST, TFT_CS);
#else
#include "st7789_portable.h"
// ST7789_Portable argument order: (int8_t CS, int8_t DC, int8_t RST)
static ST7789_Portable tft(TFT_CS, TFT_DC, TFT_RST);
#endif

#ifndef TFT_COLOR_BLACK
#define TFT_COLOR_BLACK 0x0000
#endif
#ifndef TFT_COLOR_WHITE
#define TFT_COLOR_WHITE 0xFFFF
#endif

// Zeichenraster: 320/12 = 26 Spalten, 240/16 = 15 Zeilen
#define TFT_COLS 26
#define TFT_ROWS 15
#define TFT_CHAR_W 6
#define TFT_CHAR_H 8

static uint8_t cur_col = 0;
static uint8_t cur_row = 0;

void TFTDisplay::begin(uint8_t width, uint8_t height, uint8_t model)
{
    tft.init(240, 320);
    tft.setRotation(1);          // Querformat: 320×240
    tft.fillScreen(TFT_COLOR_BLACK);
    tft.setTextColor(TFT_COLOR_WHITE, TFT_COLOR_BLACK);
    tft.setTextSize(2);          // 12×16 Pixel pro Zeichen
    tft.setCursor(0, 0);
#if TFT_BL >= 0
    pinMode(TFT_BL, OUTPUT);
    digitalWrite(TFT_BL, HIGH);
#endif
    cur_col = 0;
    cur_row = 0;
}

void TFTDisplay::clear()
{
    tft.fillScreen(TFT_COLOR_BLACK);
    cur_col = 0;
    cur_row = 0;
    tft.setCursor(0, 0);
}

void TFTDisplay::setCursor(uint8_t col, uint8_t row)
{
    cur_col = col;
    cur_row = row;
    tft.setCursor(col * TFT_CHAR_W * 2, row * TFT_CHAR_H * 2);
}

void TFTDisplay::setCursorInPixels(uint8_t x, uint8_t y)
{
    // Nokia-Pixelkoordinaten (84×48) auf TFT skalieren (320×240)
    tft.setCursor((uint16_t)x * 320 / 84, (uint16_t)y * 240 / 48);
}

size_t TFTDisplay::write(uint8_t c)
{
    tft.write(c);
    cur_col++;
    if (cur_col >= TFT_COLS) { cur_col = 0; cur_row++; }
    return 1;
}

void TFTDisplay::createChar(uint8_t loc, const uint8_t *glyph)
{
    // Nokia-Custom-Chars werden ignoriert oder durch GFX-Primitive dargestellt
}

void TFTDisplay::drawBitmap(const uint8_t *data, uint8_t cols, uint8_t lines)
{
    // Nokia-Bitmaps (5 Bytes = 1 Zeichenblock) auf TFT skalieren
    int start_x = cur_col * TFT_CHAR_W * 2;
    int start_y = cur_row * TFT_CHAR_H * 2;
    for (uint8_t y = 0; y < lines * 8; y++)
    {
        for (uint8_t x = 0; x < cols; x++)
        {
            if (pgm_read_byte(data + (y / 8) * cols + x) & (1 << (y % 8)))
            {
                tft.fillRect(start_x + x * 2, start_y + y * 2, 2, 2, TFT_COLOR_WHITE);
            }
        }
    }
}

void TFTDisplay::drawVerticalBar(word maxV, word limit, word value,
                                  byte width, byte height,
                                  byte outer, byte inner)
{
    int x0 = cur_col * TFT_CHAR_W * 2;
    int y0 = cur_row * TFT_CHAR_H * 2;
    int w  = width * 2;
    int h  = height * 16;
    tft.drawRect(x0, y0, w, h, TFT_COLOR_WHITE);
    if (maxV > 0)
    {
        int fill = (int)((long)min(value, maxV) * (w - 2) / maxV);
        if (fill > 0)
            tft.fillRect(x0 + 1, y0 + 1, fill, h - 2, TFT_COLOR_WHITE);
    }
}

#endif