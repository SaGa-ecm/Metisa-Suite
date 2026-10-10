/*
 * wireless_manager.cpp - Onboard Wireless Communication Manager
 * 
 * Supports:
 * - ESP32 Classic Bluetooth SPP (BluetoothSerial): connects directly to Android HMI App via RFCOMM
 * - ESP32 & RP2040 Pico W WiFi Telemetry: SoftAP with TCP socket (Port 23) and Web Dashboard / REST API (Port 80)
 *
 * Part of the metisa / Arduino Pedelec Controller project.
 */

#include "wireless_manager.h"
#include "globals.h"
#include "serial_command.h"
#include "wireless_web_dashboard.h"

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
static WiFiServer wifiServer(WIFI_SERVER_PORT); // Raw socket / Telnet server (Port 23)
static WiFiServer webServer(80);                // HTTP Web Dashboard & JSON REST API (Port 80)
static WiFiClient wifiClient;
static bool wifi_initialized = false;

static void handle_web_request(WiFiClient& client)
{
    String req = "";
    unsigned long timeout = millis() + 500;
    while (client.connected() && millis() < timeout)
    {
        if (client.available())
        {
            char c = client.read();
            req += c;
            if (c == '\n') break;
        }
    }

    if (req.indexOf("GET /api/telemetry") >= 0 || req.indexOf("GET /api/status") >= 0)
    {
        client.print(F("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nConnection: close\r\nAccess-Control-Allow-Origin: *\r\n\r\n"));
        client.print(F("{\"spd\":")); client.print(spd, 1);
        client.print(F(",\"w\":")); client.print(power, 1);
        client.print(F(",\"a\":")); client.print(current, 1);
        client.print(F(",\"v\":")); client.print(voltage, 1);
        client.print(F(",\"cad\":")); client.print(cad);
        client.print(F(",\"km\":")); client.print(km, 1);
        client.print(F(",\"odo\":")); client.print(odo);
        client.print(F(",\"wh\":")); client.print(wh, 1);
        client.print(F(",\"temp\":")); client.print(temperature, 1);
        client.print(F(",\"pin\":")); client.print(pin_security_level);
        client.print(F(",\"lights\":{"));
        client.print(F("\"front\":")); client.print(lights_front_active ? "true" : "false");
        client.print(F(",\"high\":")); client.print(lights_high_beam_active ? "true" : "false");
        client.print(F(",\"rear\":")); client.print(lights_rear_active ? "true" : "false");
        client.print(F(",\"brake\":")); client.print(lights_brake_active ? "true" : "false");
        client.print(F(",\"left\":")); client.print(turn_left_active ? "true" : "false");
        client.print(F(",\"right\":")); client.print(turn_right_active ? "true" : "false");
        client.print(F(",\"hazard\":")); client.print(hazard_active ? "true" : "false");
        client.print(F(",\"horn\":")); client.print(horn_active ? "true" : "false");
        client.print(F("}}\r\n"));
    }
    else if (req.indexOf("GET /api/cmd") >= 0)
    {
        if (req.indexOf("action=front_toggle") >= 0) toggle_lights_front();
        else if (req.indexOf("action=high_toggle") >= 0) toggle_lights_high_beam();
        else if (req.indexOf("action=rear_toggle") >= 0) toggle_lights_rear();
        else if (req.indexOf("action=turn_left") >= 0) toggle_turn_signal_left();
        else if (req.indexOf("action=turn_right") >= 0) toggle_turn_signal_right();
        else if (req.indexOf("action=hazard") >= 0) toggle_hazard_lights();
        else if (req.indexOf("action=horn&on=1") >= 0) set_horn(true);
        else if (req.indexOf("action=horn&on=0") >= 0) set_horn(false);
        else if (req.indexOf("action=lock") >= 0) pin_set_level(0);
        else if (req.indexOf("action=pin&code=") >= 0)
        {
            int idx = req.indexOf("code=");
            if (idx >= 0)
            {
                unsigned long entered = 0;
                for (unsigned int i = idx + 5; i < req.length(); i++)
                {
                    char digit = req.charAt(i);
                    if (digit >= '0' && digit <= '9')
                    {
                        entered = entered * 10 + (digit - '0');
                    }
                    else
                    {
                        break;
                    }
                }
                pin_check_and_apply(entered);
            }
        }

        // Return updated status immediately in one roundtrip
        client.print(F("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nConnection: close\r\nAccess-Control-Allow-Origin: *\r\n\r\n"));
        client.print(F("{\"spd\":")); client.print(spd, 1);
        client.print(F(",\"w\":")); client.print(power, 1);
        client.print(F(",\"a\":")); client.print(current, 1);
        client.print(F(",\"v\":")); client.print(voltage, 1);
        client.print(F(",\"cad\":")); client.print(cad);
        client.print(F(",\"km\":")); client.print(km, 1);
        client.print(F(",\"odo\":")); client.print(odo);
        client.print(F(",\"pin\":")); client.print(pin_security_level);
        client.print(F(",\"lights\":{"));
        client.print(F("\"front\":")); client.print(lights_front_active ? "true" : "false");
        client.print(F(",\"high\":")); client.print(lights_high_beam_active ? "true" : "false");
        client.print(F(",\"rear\":")); client.print(lights_rear_active ? "true" : "false");
        client.print(F(",\"brake\":")); client.print(lights_brake_active ? "true" : "false");
        client.print(F(",\"left\":")); client.print(turn_left_active ? "true" : "false");
        client.print(F(",\"right\":")); client.print(turn_right_active ? "true" : "false");
        client.print(F(",\"hazard\":")); client.print(hazard_active ? "true" : "false");
        client.print(F(",\"horn\":")); client.print(horn_active ? "true" : "false");
        client.print(F("}}\r\n"));
    }
    else
    {
        // Serve Web Dashboard
        client.print(F("HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nConnection: close\r\n\r\n"));
        client.print(reinterpret_cast<const __FlashStringHelper*>(DASHBOARD_HTML));
    }

    client.stop();
}
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
    webServer.begin();
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
        // 1. Poll Raw Socket / Telnet Server (Port 23)
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

        // 2. Poll HTTP Web Dashboard & REST API (Port 80)
        WiFiClient httpClient = webServer.available();
        if (httpClient)
        {
            handle_web_request(httpClient);
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
