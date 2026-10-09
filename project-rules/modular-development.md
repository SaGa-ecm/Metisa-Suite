# Modular Development and Checkpoints

## Core rule

Build metisa in small, independently understandable change units. Each unit should solve one concern, have an explicit dependency list, and be validated before the next unit begins. Do not mix unrelated refactors, branding, safety behavior, and board support into one change.

## Checkpoint lifecycle

1. Inspect the current branch, working-tree status, and existing changes before editing.
2. State the change unit, hypothesis, dependencies, acceptance checks, and rollback boundary.
3. Edit the smallest reasonable set of files. Keep formatting-only changes separate from behavior changes.
4. Run targeted tests first; run both AVR builds for firmware/core changes.
5. Record result and remaining risks in the workbook.
6. Create a local Git checkpoint for one validated logical unit, using a descriptive commit message. Do not include unrelated or unreviewed files.
7. Keep hardware-dependent work in separate branches/checkpoints from host tests and source cleanup.

## Selective integration

- New work should be split so a user can cherry-pick one logical commit without importing unrelated work.
- If a change depends on earlier work, declare those prerequisite commit IDs in its description and workbook entry.
- Prefer a short feature branch per independent work package. Merge or cherry-pick only after replaying relevant validation on the destination branch.
- If conflicts require semantic choices or board knowledge, stop and document the options; do not guess.
- Preserve a clean, tested checkpoint before starting a high-risk or broad refactor.

## Rollback boundaries

- Reverting a commit must undo only that logical change. Avoid coupling schema changes, pin changes, and unrelated cleanup.
- EEPROM format migrations require a separately reviewable migration/rollback plan and compatibility tests before firmware integration.
- Safety behavior changes require their own checkpoint, regression evidence, and hardware test plan.
- Do not use destructive Git reset/clean/checkout commands as a rollback mechanism.

## Repository prerequisites

The working directory must have Git metadata for real commits, branches, cherry-picks, and arbitrary checkout of prior states. Before the first baseline commit, review the entire staging set for generated files, secrets, absolute machine paths, and licensing blockers. A local Git repository is not a remote publication and does not settle licensing rights.

Do not push, publish, create a release, or alter remote visibility unless that exact action and destination are explicitly requested. If no `.git` directory exists, do not claim checkpoint/rollback capability until a local repository and validated baseline checkpoint have been established.