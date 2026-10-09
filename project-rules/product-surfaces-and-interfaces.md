# Product Surfaces and Interfaces

## Product surfaces

The metisa product is expected to include multiple independently developed surfaces:

- Embedded controller firmware.
- Android application.
- Apple application (the exact Apple platforms/frameworks are not yet specified).
- Existing Windows-only configurator executable.
- Planned browser-based configurator intended to replace or supersede the Windows-only tool.
- metisa homepage/website, whose source directory and files will be supplied later.

The mobile-app, configurator, and homepage source directories have not yet been supplied. Until they exist in the workspace, do not create speculative app/web frameworks, invent protocols, or claim feature parity.

## Modular boundaries

- Keep firmware, Android, Apple, Windows configurator, and browser configurator as explicit modules/work packages. Do not mix unrelated client changes in one checkpoint.
- Keep the homepage as its own web module and checkpoint, separate from the browser configurator even if they later share components or a build system.
- Before editing a newly supplied client, inventory its language, build system, tests, protocol, configuration format, release process, and license/provenance.
- For a feature spanning clients, split work into independently validated slices: shared contract/schema, firmware producer/consumer, then each client adapter. Declare dependencies between checkpoints.
- Treat cross-client schemas, serial/Bluetooth messages, configuration files, and firmware settings as versioned interfaces. Preserve old-reader compatibility or provide an explicit migration/rollback plan.
- Keep common protocol fixtures and compatibility tests separate from UI implementations so Android, Apple, and browser clients can validate the same contract.
- Record any required firmware/client version pairing and supported combinations in the workbook.

## Configurator migration

- The current Windows executable is the behavioral reference only after its source, version, and rights are inspected; do not assume all behavior is known from the executable.
- Before replacing it with a browser version, inventory settings, units, validation bounds, device communication, import/export formats, offline expectations, and user-data handling.
- Write a parity matrix and migration/rollback plan before deprecating the Windows tool.
- Do not silently change configuration defaults or persist an incompatible format. Version configuration schemas and test old-file import/export.
- Browser security boundaries, permissions, local-device APIs, supported browsers, and offline behavior must be decided from actual requirements rather than guessed.

## Homepage integration

- When homepage files arrive, first inventory their framework, build/deployment pipeline, domains, assets, analytics, forms, and existing legal/privacy notices before edits.
- Treat the homepage as an information surface, not as evidence that firmware or hardware is supported or certified.
- Keep website content, images, fonts, and analytics dependencies traceable by source/license. Do not publish unsupported safety, certification, compatibility, performance, or legal claims.
- Keep homepage-specific build/deploy and responsive/accessibility checks in its own checkpoint; do not mix website release with firmware flashing or electrical qualification.
- Do not create a placeholder framework or deploy a public site before the source, hosting destination, and publication intent are known.

## Integration and release

- Every client change must be independently buildable/testable where possible and have its own checkpoint.
- A cross-surface release requires a compatibility matrix linking firmware, mobile apps, and configurator versions. A client compile does not prove device protocol or hardware compatibility.
- Use mocks/fixtures for early contract tests. Hardware-connected end-to-end tests require a safe test fixture and are never inferred from simulator results.
- Keep unsupported or unverified pairings explicitly marked; do not imply that an Android/Apple/browser client works with every firmware version.