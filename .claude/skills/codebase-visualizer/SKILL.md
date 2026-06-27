---
name: codebase-visualizer
description: Visualize codebase structure, dependencies, and architecture
context: fork
agent: Explore
allowed-tools: Bash(find *) Bash(ls *) Grep Read
---

# Codebase Visualizer

Analyze and visualize your codebase structure, dependencies, and architecture patterns.

## Capabilities

### 1. Generate Architecture Diagrams

Visualize the high-level structure of your project:
- Directory hierarchy and organization
- Module relationships
- Layer separation
- Component boundaries

```bash
claude visualize architecture
```

### 2. Map Dependencies

Track how components depend on each other:
- Import relationships
- Module coupling
- Circular dependencies
- External dependencies

```bash
claude visualize dependencies
```

### 3. Analyze Connectivity

Understand how components communicate:
- Function call graphs
- API endpoints
- Data flow patterns
- Service interactions

```bash
claude visualize connectivity
```

### 4. Project Structure Overview

Get a complete view of your project:
- File organization
- Code metrics
- Technology stack
- File sizes and types

```bash
claude visualize structure
```

## Usage Examples

**Visualize entire project:**
```bash
claude visualize architecture
```

**Analyze specific directory:**
```bash
claude visualize dependencies src/components
```

**Generate dependency graph:**
```bash
claude visualize connectivity --format=graph
```

**Export visualization:**
```bash
claude visualize structure --output=diagram.md
```

## Supported Formats

- **Markdown** — Text-based diagrams
- **Mermaid** — Graph and flow diagrams
- **ASCII** — Terminal-friendly visualizations
- **JSON** — Machine-readable structure

## What Gets Analyzed

- **File structure** — Directories, files, organization
- **File types** — Code, tests, configuration, docs
- **Dependencies** — Imports, requires, references
- **Relationships** — Coupling, cohesion, patterns
- **Metrics** — Size, complexity, organization

## Supported Languages

- JavaScript/TypeScript
- Python
- Java
- Go
- Rust
- C/C++
- And more...

## Output Examples

### Architecture View
```
project/
├── src/
│   ├── components/      (UI Layer)
│   ├── services/        (Business Logic)
│   └── utils/           (Utilities)
├── tests/               (Test Layer)
└── docs/                (Documentation)
```

### Dependency Graph
```
components → services
    ↓           ↓
  utils ← ← ← ←
```

### Statistics
- Total files: 247
- Lines of code: 12,543
- Main languages: TypeScript (78%), CSS (15%), HTML (7%)
- Modules: 34
- Dependencies: 23 external

## Integration Points

Use visualization before:
- Code reviews — Understand architecture
- Refactoring — Plan changes safely
- Onboarding — New team member orientation
- Documentation — Create visual guides

## Agent

Uses `Explore` agent for thorough codebase analysis and pattern detection.

## Model Invocation

Model invocation is enabled — Uses Claude to interpret code structure and generate insights.

## Safety

Runs in `fork` context for isolated execution. Read-only access to filesystem (find, ls, Grep, Read only).
