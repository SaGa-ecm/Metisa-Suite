/*
 * wireless_manager.cpp - Onboard Wireless Communication Manager
 * 
 * Supports:
 * - ESP32 Classic Bluetooth SPP (BluetoothSerial): connects directly to Android HMI App via RFCOMM
 * - ESP32 & RP2040 Pico W WiFi Telemetry: SoftAP with TCP socket / Telnet server on Port 23 / 8080
 *
 * Part of the metisa / Arduino Pedelec Controller project.
 */

#include "wireless_manager.h"
#include "globals.h"
#include "serial_command.h"

// Forward declaration of Android telemetry output function
extern void serial_android(Print* localSerial);

#if defined(SUPPORT_ESP32_BLUETOOTH) && defined(ARDUINO_ARCH_ESP32) && !defined(CONFIG_IDF_TARGET_ESP32S2) && !defined(CONFIG_IDF_TARGET_ESP32S3) && !defined(CONFIG_IDF_TARGET_ESP32C3)
#define WIRELESS_HAS_BT_CLASSIC 1
#include "BluetoothSerial.h"
static BluetoothSerial SerialBT;
static bool bt_initialized = false;
#endif

#if defined(SUPPORT_WIFI_TELEMETRY) && defined(ARDUINO_ARCH_ESP32)
#include <WiFi.h>
#include <WiFiServer.h>
#include <WiFiClient.h>
#define WIRELESS_HAS_WIFI 1
#endif

#if defined(WIRELESS_HAS_WIFI)
#ifndef WIFI_AP_SSID
#define WIFI_AP_SSID "APC-Pedelec-WiFi"
#endif
#ifndef WIFI_AP_PASSWORD
#define WIFI_AP_PASSWORD "21028600"
#endif
#ifndef WIFI_SERVER_PORT
#define WIFI_SERVER_PORT 23
#endif
static WiFiServer wifiServer(WIFI_SERVER_PORT);
static WiFiClient wifiClient;
static bool wifi_initialized = false;
#endif

void wireless_init()
{
#if defined(WIRELESS_HAS_BT_CLASSIC)
#ifndef BT_DEVICE_NAME
#define BT_DEVICE_NAME "APC-Pedelec"
#endif
    SerialBT.begin(BT_DEVICE_NAME);
    bt_initialized = true;
#endif

#if defined(WIRELESS_HAS_WIFI)
    WiFi.mode(WIFI_AP);
    WiFi.softAP(WIFI_AP_SSID, WIFI_AP_PASSWORD);
    wifiServer.begin();
    wifi_initialized = true;
#endif
}

void wireless_poll()
{
#if defined(WIRELESS_HAS_BT_CLASSIC)
    if (bt_initialized)
    {
        while (SerialBT.available() > 0)
        {
            char c = (char)SerialBT.read();
            parse_serial(c, 2);
        }
    }
#endif

#if defined(WIRELESS_HAS_WIFI)
    if (wifi_initialized)
    {
        if (wifiServer.hasClient())
        {
            if (!wifiClient || !wifiClient.connected())
            {
                if (wifiClient)
                {
                    wifiClient.stop();
                }
                wifiClient = wifiServer.available();
            }
        }

        if (wifiClient && wifiClient.connected())
        {
            while (wifiClient.available() > 0)
            {
                char c = (char)wifiClient.read();
                parse_serial(c, 2);
            }
        }
    }
#endif
}

void wireless_send_telemetry()
{
#if defined(WIRELESS_HAS_BT_CLASSIC)
    if (bt_initialized && SerialBT.hasClient())
    {
        serial_android(&SerialBT);
    }
#endif

#if defined(WIRELESS_HAS_WIFI)
    if (wifi_initialized && wifiClient && wifiClient.connected())
    {
        serial_android(&wifiClient);
    }
#endif
}

bool wireless_is_connected()
{
#if defined(WIRELESS_HAS_BT_CLASSIC)
    if (bt_initialized && SerialBT.hasClient()) return true;
#endif
#if defined(WIRELESS_HAS_WIFI)
    if (wifi_initialized && wifiClient && wifiClient.connected()) return true;
#endif
    return false;
}

Print* wireless_get_stream()
{
#if defined(WIRELESS_HAS_BT_CLASSIC)
    if (bt_initialized && SerialBT.hasClient()) return &SerialBT;
#endif
#if defined(WIRELESS_HAS_WIFI)
    if (wifi_initialized && wifiClient && wifiClient.connected()) return &wifiClient;
#endif
    return nullptr;
}
