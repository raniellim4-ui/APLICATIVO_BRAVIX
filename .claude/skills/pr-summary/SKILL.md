---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

# PR Summary

Analyze and summarize pull request changes, comments, and impact.

## Pull Request Context

!`gh pr diff`

!`gh pr view --comments`

!`gh pr diff --name-only`

## Your Task

Summarize this pull request by providing:

1. **Overview** — What changes were made and why
2. **Files Changed** — List modified files and their purpose
3. **Risk Assessment** — Potential issues or breaking changes
4. **Comments** — Summary of PR discussion and feedback
5. **Recommendation** — Ready to merge? Any concerns?

## Output Format

Provide a structured summary:

```
## PR Summary

### Overview
[2-3 sentence description of changes]

### Files Changed
- [file]: [brief description]
- [file]: [brief description]

### Risk Assessment
- [potential issue or breaking change]
- [test coverage consideration]

### Comments & Discussion
[Summary of any important comments or feedback]

### Recommendation
[Merge-ready status and any conditions]
```

## Usage

**Summarize current PR:**
```bash
claude pr-summary
```

**Summarize specific PR:**
```bash
claude pr-summary --pr 123
```

**Save summary to file:**
```bash
claude pr-summary > pr-review.md
```

## What Gets Analyzed

- **PR Diff** — Code changes line by line
- **PR Comments** — Discussion and feedback
- **Changed Files** — List of affected files
- **File Changes** — Type and scope of modifications
- **Commit Messages** — Intent of changes
- **CI/CD Status** — Test and build results

## Integration Points

Use before:
- Code review meetings
- Merging to main branch
- Creating release notes
- Documenting features

## Agent

Uses `Explore` agent for thorough code analysis and pattern detection.

## Model Invocation

Model invocation is enabled — Uses Claude analysis for intelligent summarization.

## Safety

Runs in `fork` context for isolated execution. Only GitHub CLI tools allowed.
