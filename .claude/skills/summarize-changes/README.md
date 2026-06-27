# Summarize Changes Skill

A Claude Code skill for quickly summarizing git changes, diffs, and project modifications.

## Overview

This skill helps you:
- **Summarize diffs** — Get concise explanations of code changes
- **Generate commit messages** — Create descriptive commits from changes
- **Write PR descriptions** — Document feature additions and modifications
- **Analyze impacts** — Understand how changes affect the codebase
- **Detect breaking changes** — Identify potentially problematic modifications

## Installation

```bash
npx skills add ~/.claude/skills/summarize-changes
```

Or manually copy this directory to `~/.claude/skills/summarize-changes`

## Features

### Diff Summarization
Analyzes git diffs and provides:
- Summary of what changed
- Explanation of why changes were made
- Impact assessment on related code
- List of modified files

### Commit Message Generation
Creates well-formatted commit messages:
- Descriptive subject line
- Detailed body explaining changes
- References to related issues
- Follows conventional commit format

### PR Description Creation
Generates pull request content:
- Feature overview
- Testing instructions
- Breaking changes (if any)
- Related issues and PRs

## Usage Examples

### Summarize Last Commit
```bash
claude "Summarize the changes in the last commit"
```

### Analyze a Diff
```bash
claude "Explain what changed in this diff: $(git diff HEAD~1)"
```

### Generate PR Description
```bash
claude "Create a PR description for the changes from feature/branch to main"
```

### Detect Breaking Changes
```bash
claude "Are there any breaking changes in these modifications?"
```

## Configuration

No configuration required. The skill works automatically with your git repository.

## Supported Git Workflows

- ✅ Feature branches
- ✅ Commit history analysis
- ✅ Merge conflict resolution
- ✅ Rebase workflows
- ✅ Tag analysis

## Requirements

- Git 2.0 or later
- Node.js 18 or later
- Claude Code CLI

## License

MIT

## Support

For issues or suggestions, please open an issue in the project repository.
