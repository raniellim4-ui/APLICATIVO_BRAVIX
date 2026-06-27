---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
---

# Summarize Changes

Quickly summarize git changes, diffs, and project modifications with risk assessment.

## Current Changes

!`git diff HEAD`

## Instructions

Summarize the changes above in two or three bullet points, then list any risks you notice such as:
- Missing error handling
- Hardcoded values
- Tests that need updating
- Potential security issues
- Performance concerns
- Breaking changes

If the diff is empty, report that there are no uncommitted changes.

## Usage

Use this skill when you need to:
- Review uncommitted changes before committing
- Generate commit messages from diffs
- Flag risky modifications
- Understand what changed in your working directory
- Create PR descriptions with risk assessment

## Examples

**Review current changes:**
```
claude "what did I change?"
```

**Flag any issues:**
```
claude "review my diff for any problems"
```

**Get commit message:**
```
claude "create a commit message for my changes"
```

## Risk Assessment

This skill identifies and highlights:
- ✋ Missing error handling
- ⚠️ Hardcoded values that should be configurable
- 🧪 Tests that need updating
- 🔒 Potential security vulnerabilities
- ⚡ Performance bottlenecks
- 💥 Breaking changes
