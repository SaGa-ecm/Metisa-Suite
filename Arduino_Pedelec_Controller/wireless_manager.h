/*
 * wireless_manager.h - Onboard Wireless Communication Manager
 * 
 * Supports:
 * - ESP32 Classic Bluetooth SPP (BluetoothSerial): connects directly to Android HMI App via RFCOMM
 * - ESP32 & RP2040 Pico W WiFi Telemetry: SoftAP with TCP socket / Telnet server on Port 23 / 8080
 *
 * Part of the metisa / Arduino Pedelec Controller project.
 */

#ifndef WIRELESS_MANAGER_H
#define WIRELESS_MANAGER_H

#include <Arduino.h>
#include "config.h"

void wireless_init();
void wireless_poll();
void wireless_send_telemetry();
bool wireless_is_connected();
Print* wireless_get_stream();

#endif // WIRELESS_MANAGER_H
