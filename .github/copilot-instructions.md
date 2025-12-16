# Copilot Instructions - Astro Integration PocketBase

This document provides comprehensive instructions for GitHub Copilot and other AI agents working on the `astro-integration-pocketbase` repository.

## Project Overview

This is an Astro integration package that provides additional tooling for developers working with `astro-loader-pocketbase`. It adds a new toolbar to inspect PocketBase entries used via the loader and enables real-time updates so that changes in PocketBase collections will instantly refresh the content of the dev server.

### Key Features

- Toolbar for inspecting PocketBase entries
- Real-time updates support (for `astro-loader-pocketbase`)

### Additional documentation

- [Astro Content Loader API](https://docs.astro.build/en/reference/content-loader-reference/)
- [Astro Integration API](https://docs.astro.build/en/reference/integrations-reference/)
- [Astro Dev Toolbar App API](https://docs.astro.build/en/reference/dev-toolbar-app-reference/)
- [PocketBase Documentation](https://pocketbase.io/docs/)

## Repository Structure

```
src/
├── core/                     # Core refresh logic
├── middleware/               # Middleware to extract PocketBase entries
├── toolbar/                  # Entity viewer toolbar
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
└── pocketbase-integration.ts # Main integration function
index.ts                      # Main export file
```

## Development Workflow

### Essential NPM Scripts

#### Code Quality

```bash
# Format code (required before commit)
npm run format

# Lint code (oxlint, includes type-checking)
npm run lint:fix

# Type checking (required before commit)
npm run typecheck
```

### Pre-commit Requirements

Before any commit, the following MUST pass:

1. `npm run format` - Code formatting
2. `npm run lint:fix` - Linting with oxlint (and type-checking at the same time)
3. `npm run typecheck` - TypeScript type checking

These are enforced by husky pre-commit hooks and lint-staged configuration.

## Commit Message Format

This project uses **Conventional Commits** enforced by commitlint:

### Format

```
<type>(scope): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `build`: Maintenance tasks

### Examples

```bash
feat(toolbar): add support for file attachments
fix(refresh): handle missing updated field correctly
docs(README): update installation instructions
refactor(middleware): extract entry parsing logic
```

### Scope Guidelines

Use these scopes when applicable or custom ones:

- `toolbar`: Core toolbar / browser functionality
- `refresh`: Core fresh logic
- `middleware`: Middleware logic

## Code Conventions

### TypeScript

- Use strict TypeScript configuration
- Define types in the `types/` directory
- Import types using `import type` syntax
- Use relative imports
- Use descriptive interface names with PascalCase

### Function Organization

- Keep functions small and focused
- Use descriptive names that explain what the function does
- Place utility functions in appropriate `utils/` files
- Export only what's needed externally

### Error Handling

- Provide meaningful error messages
- Handle async operations properly with try/catch
