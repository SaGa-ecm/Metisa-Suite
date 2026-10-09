# metisa Project Skills

All project skills live in this repository under `skills/<skill-name>/SKILL.md`. This directory is the single source of truth for project-specific skills; do not require global installation or an external skills service. Skills are optional procedures and are subordinate to the fixed rules in `project-rules/`.

Any AI model or contributor may read, invoke, combine, improve, or add skills here without prior approval. Before creating a skill, check this index and nearby skills for overlap. New skills must follow the format below and be added to this index in the same change.

## Skill format

Each skill is a Markdown file named `SKILL.md` in a lowercase kebab-case directory. Begin with YAML frontmatter containing `name` and `description`. Include: when to use it, required context, a bounded procedure, safety/licensing constraints, and validation/evidence to record. Keep skills repository-relative, deterministic, and useful to any agent provider.

Do not place credentials, private data, generated reports, machine-specific paths, or hardware assumptions in skills. Skills may direct agents to inspect repository files; they must not silently authorize remote publication, hardware actuation, license changes, or destructive Git operations.

## Available skills

| Skill | Use it for |
| --- | --- |
| [`avr-build-validation`](avr-build-validation/SKILL.md) | Reproducible PlatformIO Nano/Mega builds and warning capture. |
| [`source-contract-tests`](source-contract-tests/SKILL.md) | Running and extending the Python source-integration checks. |
| [`firmware-safety-review`](firmware-safety-review/SKILL.md) | Reviewing motor-control/reset/storage changes without claiming hardware qualification. |
| [`mcu-portability-audit`](mcu-portability-audit/SKILL.md) | Classifying AVR coupling and target-port blockers. |
| [`license-provenance-audit`](license-provenance-audit/SKILL.md) | Tracking notices and provenance without making legal conclusions. |
| [`workbook-maintenance`](workbook-maintenance/SKILL.md) | Updating the project workbook with evidence and honest status. |
| [`project-context-maintenance`](project-context-maintenance/SKILL.md) | Maintaining fixed project rules, agent adapters, and this skill catalogue. |
| [`modular-development`](modular-development/SKILL.md) | Building independently validated checkpoints for rollback and selective integration. |
| [`cross-client-integration`](cross-client-integration/SKILL.md) | Versioned interfaces and slices across firmware, mobile apps, and configurators. |

## Using skills

Agents should inspect this index at task start, then read only the relevant `SKILL.md` files. Skill instructions supplement, and never override, `AGENTS.md`, `docs/AI_WORKING_GUIDE.md`, user requests, license terms, or safety constraints.