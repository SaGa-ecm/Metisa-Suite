# ForumsController Schematics

This directory contains references to all schematic files for the ForumsController hardware from the [pedelecforum.de wiki](https://www.pedelecforum.de/wiki/doku.php?id=elektrotechnik:forumscontroller).

**Note:** The wiki is protected by Cloudflare which requires JavaScript. Automated downloads (curl/wget) will not work. You must manually download these files using a web browser.

## Pinout Diagrams (PNG)

| Version | Description | Direct URL |
|---------|-------------|------------|
| 2.3 | Platinenversion 2.3 (neueste) | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:fc_pinbelegung_2.3.png |
| 2.2 | Platinenversion 2.2 | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:fc_pinbelegung_2.2.png |
| 2.0/2.1 | Platinenversion 2.0 und 2.1 | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:fc_pinbelegung_2.0.png |
| 1.4/1.5 | Platinenversion 1.4 und 1.5 | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:fc_pinbelegung_1.4.png |
| 1.3 | Platinenversion 1.3 | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:fc_pinbelegung_1.3.png |
| 1.2 | Platinenversion 1.2 | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:fc_pinbelegung_1.2.png |
| 1.1 | Platinenversion 1.1 | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:fc_pinbelegung_1.1.png |

## Photos

| File | Description | Direct URL |
|------|-------------|------------|
| fc_1.4_1.jpg | Version 1.4 mit Bluetooth-Modul (Foto 1) | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:fc_1.4_1.jpg |
| fc_1.4_2.jpg | Version 1.4 mit Bluetooth-Modul (Foto 2) | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:fc_1.4_2.jpg |

## Documentation

| File | Description | Direct URL |
|------|-------------|------------|
| fc_changelog.pdf | Hardware-Versionsübersicht / Changelog | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:fc_changelog.pdf |
| teileliste_1.5.xlsx | Teileliste für Version 1.5 | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:teileliste_1.5.xlsx |
| teileliste_1.2.xls | Teileliste für Version 1.2 | https://www.pedelecforum.de/wiki/lib/exe/fetch.php?media=elektrotechnik:forumscontroller:teileliste_1.2.xls |

## Eagle/Design Files

The wiki mentions that for Version 1.3, an Eagle file (ELFKW-Controller E-Plan) is available at GitHub:
- https://github.com/jenkie/Arduino-Pedelec-Controller (check the repository for Eagle files)

## How to Download

1. Open the URL in a web browser (Chrome, Firefox, Edge)
2. The Cloudflare challenge will complete automatically
3. Right-click the image/file → "Save as..."
4. Save to this directory (`docs/schematics/`)

## Connection Tables (from Wiki)

The wiki also contains detailed connection tables for each version. See the [wiki page](https://www.pedelecforum.de/wiki/doku.php?id=elektrotechnik:forumscontroller) for:
- J1-J10 connector pinouts
- Solder jumper (SJ1-SJ4) configurations
- RJ45 connector pinouts for handlebar controls and displays
- Component values (R11, R21 for voltage adjustment)

## Analysis Report

A detailed analysis comparing the downloaded schematics with the project code has been created:

- **[ANALYSIS_REPORT.md](ANALYSIS_REPORT.md)** - Comprehensive pin mapping comparison, critical issues found, and recommendations

### Key Findings Summary

| Issue | Severity | Platform | Status |
|-------|----------|----------|--------|
| RP2040 pin conflicts (option/poti, voltage/throttle) | HIGH | RP2040 | 🔴 Open |
| ESP32 strapping pins used for outputs | HIGH | ESP32 | 🔴 Open |
| HARDWARE_REV 20 vs 21 default conflict | MEDIUM | Mega | 🟡 Documented (B-07) |
| Wheel input uses direct port access (no D-number) | MEDIUM | Mega | 🟡 Documented |
| Missing schematics for v1.3-v1.5 | LOW | All | 🟡 Server 404 |

## License

The wiki content is licensed under [CC Attribution-Noncommercial-Share Alike 4.0 International](http://creativecommons.org/licenses/by-nc-sa/4.0/).