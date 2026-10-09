# Security Policy

## Reporting a vulnerability

Do not disclose exploitable issues in a public issue. If GitHub private vulnerability reporting is enabled for the repository, use the **Security** tab to submit a private report. Otherwise contact the repository owner through a private channel listed on the verified SaGaLabs GitHub profile. Do not include access tokens or API keys in the report.

## Scope and response

This repository controls physical motor-related outputs. Reports involving unintended activation, reset behavior, braking, sensor failure, speed limiting, power-stage enable, or firmware update integrity should identify the affected source revision and hardware revision where safe to do so. No response-time guarantee is made until a maintained release and support channel are established.

Do not connect a motor or battery to reproduce a suspected unsafe behavior unless using an appropriately isolated, current-limited test setup with a physical emergency stop and qualified supervision.