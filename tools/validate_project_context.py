#!/usr/bin/env python3
"""Validate repository-local rules, skills, indexes, and AI adapters."""

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
ERRORS = []


def fail(message):
    ERRORS.append(message)


def validate_skills():
    skill_root = ROOT / "skills"
    index_path = skill_root / "INDEX.md"
    if not index_path.is_file():
        fail("Missing skills/INDEX.md")
        return

    index = index_path.read_text(encoding="utf-8")
    listed = set(re.findall(r"\]\(([^/)]+)/SKILL\.md\)", index))
    skill_files = sorted(skill_root.glob("*/SKILL.md"))
    actual = {path.parent.name for path in skill_files}
    for name in sorted(actual - listed):
        fail("Skill not listed in skills/INDEX.md: " + name)
    for name in sorted(listed - actual):
        fail("Skill index entry has no file: " + name)

    for path in skill_files:
        relative = str(path.relative_to(ROOT))
        text = path.read_text(encoding="utf-8")
        if not text.startswith("---\n"):
            fail(relative + ": missing YAML frontmatter")
            continue
        end = text.find("\n---", 4)
        if end < 0:
            fail(relative + ": unterminated YAML frontmatter")
            continue
        frontmatter = text[4:end]
        if not re.search(r"^name:\s*" + re.escape(path.parent.name) + r"\s*$", frontmatter, re.M):
            fail(relative + ": name must match skill directory")
        if not re.search(r"^description:\s*\S.+$", frontmatter, re.M):
            fail(relative + ": missing description")
        for heading in ("## Use when", "## Procedure", "## Constraints", "## Done when"):
            if heading not in text:
                fail(relative + ": missing required section " + heading)


def validate_rules():
    rule_root = ROOT / "project-rules"
    index_path = rule_root / "INDEX.md"
    if not index_path.is_file():
        fail("Missing project-rules/INDEX.md")
        return

    text = index_path.read_text(encoding="utf-8")
    for target in re.findall(r"\]\(([^)#]+\.md)\)", text):
        if not (rule_root / target).is_file():
            fail("Broken project-rules index link: " + target)


def validate_adapters():
    adapters = (
        ROOT / "AGENTS.md",
        ROOT / "GEMINI.md",
        ROOT / "CLAUDE.md",
        ROOT / ".github" / "copilot-instructions.md",
        ROOT / ".cursor" / "rules" / "metisa.mdc",
        ROOT / ".agent" / "rules" / "metisa.md",
    )
    for path in adapters:
        relative = str(path.relative_to(ROOT))
        if not path.is_file():
            fail("Missing AI adapter: " + relative)
            continue
        text = path.read_text(encoding="utf-8")
        if "project-rules/INDEX.md" not in text and "/project-rules/INDEX.md" not in text:
            fail(relative + ": missing fixed-rule index reference")
        if "skills/INDEX.md" not in text and "/skills/INDEX.md" not in text:
            fail(relative + ": missing project-skill index reference")


def main():
    validate_skills()
    validate_rules()
    validate_adapters()
    if ERRORS:
        for error in ERRORS:
            print("ERROR:", error)
        return 1
    print("Project rules, skills, indexes, and agent adapters are consistent.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
