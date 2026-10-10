/*
Hardware Abstraction Layer implementation for Arduino Pedelec Controller
(c) 2026 metisa project
*/

#include "hal.h"

#if !defined(__AVR__) && !__has_include(<EEPROM.h>)
HalEEPROMClass EEPROM;
#endif
