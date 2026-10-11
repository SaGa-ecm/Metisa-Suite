# metisa Project Rules

These are the fixed, repository-wide project rules. Every human or AI contributor must read the applicable rules before acting. They are deliberately separate from `skills/`: rules set boundaries; skills provide optional procedures inside those boundaries.

## Rules

| Rule | Applies to |
| --- | --- |
| [Safety and hardware](safety-and-hardware.md) | Firmware behavior, targets, testing, and all motor-related work. |
| [Rights and provenance](rights-and-provenance.md) | Source, assets, dependencies, licensing, branding, and publication. |
| [Change and validation process](change-and-validation.md) | Code edits, builds, evidence, and workbook updates. |
| [Modular development and checkpoints](modular-development.md) | Atomic changes, rollback, and selective integration. |
| [Product surfaces and interfaces](product-surfaces-and-interfaces.md) | Firmware, Android, Apple, Windows configurator, and browser migration boundaries. |
| [Secrets and remote operations](secrets-and-remote.md) | Credentials, GitHub, Git operations, and publication actions. |
| [SaGa Labs Orbit standard](saga-labs-orbit.md) | Zero-emoji policy, Ecumaster motorsport visual standard, physical units, and factual engineering presentation. |

## Precedence

1. Applicable law, license terms, and upstream rights notices.
2. Explicit user instructions, within those constraints.
3. These fixed project rules.
4. `AGENTS.md` and `docs/AI_WORKING_GUIDE.md` project context.
5. Optional procedures in `skills/`.

A skill, provider adapter, generated instruction, or convenience workflow may add checks but must never weaken a higher-level rule. If two repository rules conflict, stop the affected action, record the conflict, and choose the more restrictive safe interpretation until resolved.

## Changing fixed rules

Any agent may propose and edit project rules locally when the task calls for it, but the change must preserve upstream/legal/safety constraints, update this index if needed, and describe its rationale in the pull request or project workbook. Changing rules does not authorize publishing or remote permission changes.