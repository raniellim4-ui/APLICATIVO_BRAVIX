# PR Summary Skill

Intelligent analysis and summarization of GitHub pull requests with risk assessment.

## Overview

This skill analyzes pull requests to provide:
- Comprehensive change summaries
- Risk and breaking change detection
- Comment and discussion analysis
- Merge recommendations
- Impact assessment

## Installation

```bash
npx skills add ~/.claude/skills/pr-summary
```

## Features

✅ **Analyze PR Diffs** — Understand code changes
✅ **Risk Detection** — Flag potential issues
✅ **Comment Summary** — Consolidate feedback
✅ **File Impact** — Show what changed and why
✅ **Merge Ready** — Clear recommendation
✅ **Explore Agent** — Deep code analysis

## Usage

**Summarize current pull request:**
```bash
claude pr-summary
```

**Summarize specific PR by number:**
```bash
claude pr-summary --pr 123
```

**Summarize PR from URL:**
```bash
claude pr-summary --url https://github.com/user/repo/pull/123
```

**Save to file:**
```bash
claude pr-summary > summary.md
```

## What Gets Analyzed

### PR Diff
- Lines added, removed, modified
- Code patterns and changes
- File structure impact

### Changed Files
- Complete list of modified files
- Type of changes per file
- Relative importance

### Comments & Discussion
- Reviewer feedback
- Questions and concerns
- Suggestions and approvals

### Risk Assessment
- Breaking changes
- Missing error handling
- Incomplete tests
- Performance impact
- Security considerations

## Output Example

```
## PR Summary

### Overview
Refactors authentication middleware to use async/await pattern 
instead of callbacks. Improves code readability and error handling.

### Files Changed
- src/middleware/auth.js: Main authentication logic
- tests/auth.test.js: Updated tests for new pattern
- docs/auth.md: Documentation updates

### Risk Assessment
- ⚠️ Breaking change: Callback API deprecated
- ✅ All tests passing
- ✅ Backwards compatibility maintained via wrapper

### Comments & Discussion
Reviewer approved with suggestion to add timeout handling.
Author acknowledged and added timeout logic.

### Recommendation
✅ Ready to merge - All concerns addressed
```

## Configuration

### Required
- Git 2.0+
- GitHub CLI (gh) 2.0+
- GitHub token (`GITHUB_TOKEN` env var)

### Optional
- GitHub organization context
- Custom PR filter criteria

## Integration

Use before:
- **Code reviews** — Understand changes quickly
- **Merging** — Ensure quality gates passed
- **Release notes** — Document features
- **Team meetings** — Present changes

## Advanced Usage

**Generate PR summary for documentation:**
```bash
claude pr-summary --format=markdown > CHANGES.md
```

**Compare multiple PRs:**
```bash
claude pr-summary --pr 123 > pr-123-summary.md
claude pr-summary --pr 124 > pr-124-summary.md
```

**Review before merge:**
```bash
claude pr-summary && git merge origin/feature-branch
```

## Agent Configuration

- **Agent Type:** Explore
- **Context:** Fork (isolated)
- **Tools:** GitHub CLI only (security)
- **Timeout:** 1 minute

## How It Works

1. **Fetch PR Data** — Gets diff, comments, file list
2. **Analyze Changes** — Explore agent reviews code
3. **Assess Risks** — Identifies potential issues
4. **Summarize** — Creates clear summary
5. **Recommend** — Provides merge recommendation

## Tips & Tricks

**Quick review before merge:**
```bash
claude pr-summary && gh pr merge
```

**Review all open PRs:**
```bash
gh pr list --json number -q '.[].number' | while read pr; do
  echo "=== PR #$pr ===" 
  claude pr-summary --pr $pr
done
```

**Create PR summary as comment:**
```bash
gh pr comment $(gh pr view --json number -q '.number') \
  -b "$(claude pr-summary)"
```

## Requirements

- GitHub CLI installed (`brew install gh` on macOS)
- Authenticated with GitHub (`gh auth login`)
- Write access to the repository

## Troubleshooting

**"gh: command not found"**
- Install GitHub CLI: https://cli.github.com
- Verify: `gh --version`

**"Not authenticated"**
- Login: `gh auth login`
- Follow prompts to authenticate

**"API rate limit exceeded"**
- GitHub API has rate limits
- Wait for reset or use authenticated token
- Set `GITHUB_TOKEN` environment variable

## License

MIT

## See Also

- **summarize-changes** — Summarize uncommitted changes
- **deploy** — Automated deployment workflow
- **api-conventions** — API design guidelines
