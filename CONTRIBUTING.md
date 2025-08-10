# Contributing to astro-integration-pocketbase

Thank you for your interest in contributing to astro-integration-pocketbase! This guide will help you get started with contributing to the project.

## Getting Started

### Prerequisites

- Node.js (see `.nvmrc` for the required version)
- npm
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/astro-integration-pocketbase.git
   cd astro-integration-pocketbase
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development Workflow

### Code Style and Quality

Before making any changes, familiarize yourself with our code quality requirements:

- **Formatting**: Run `npm run format` to format code with Prettier
- **Linting**: Run `npm run lint:fix` to lint code with oxlint
- **Type Checking**: Run `npm run typecheck` to check TypeScript types

These checks are enforced by pre-commit hooks and must pass before any commit.

### Making Changes

1. Create a new branch for your feature or fix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes following our code conventions:
   - Use strict TypeScript configuration
   - Define types in the `types/` directory
   - Use relative imports and descriptive function names
   - Keep functions small and focused
   - Place utility functions in appropriate `utils/` files

3. Ensure your code passes all quality checks:
   ```bash
   npm run format
   npm run lint:fix
   npm run typecheck
   ```

### Commit Messages

We use [Conventional Commits](https://conventionalcommits.org/) for commit messages. The format is:

```
<type>(scope): <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `build`: Maintenance tasks

**Scopes:**

- `toolbar`: Core toolbar/browser functionality
- `refresh`: Core refresh logic
- `middleware`: Middleware logic
- Or custom scopes as appropriate

**Examples:**

```
feat(toolbar): add support for file attachments
fix(refresh): handle missing updated field correctly
docs(README): update installation instructions
refactor(middleware): extract entry parsing logic
```

### Testing

While contributing, ensure your changes don't break existing functionality.
This project does not use tests (yet), but you can use a local Astro project using `astro-loader-pocketbase` to test your changes.

## Pull Request Process

### Before Submitting

1. Ensure all code quality checks pass
2. Rebase your branch on the latest next / master branch
3. Test your changes thoroughly

### Creating a Pull Request

1. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a pull request on GitHub using our PR template (target the `next` branch if available)

3. In your PR description:
   - Clearly describe what your changes do and why
   - Reference any related issues
   - Include any breaking changes or migration notes
   - Add screenshots or examples if applicable

### PR Structure

Your PR should follow this structure:

```markdown
## Changes

- Clear bullet points describing what changed

## Issues

- Closes #123 (if applicable)

## Dependencies

- Depends on: #456 (if applicable)
```

### Review Process

- All PRs require review before merging (maybe also including a review from Copilot)
- Please address feedback promptly and push additional commits as needed
- Once approved, a maintainer will merge your PR into the `next` branch and create a pre-release for beta testing
- We may squash commits to keep the git history clean

## Issue Reporting

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check if the issue exists in the latest version (older versions may have bugs that are fixed already)
- Gather relevant information about your environment

### Creating Issues

Use our issue templates for:

- **Feature Requests**: Propose new functionality
- **Bug Reports**: Report problems or unexpected behavior

Provide as much detail as possible to help us understand and reproduce the issue.

## Code of Conduct

Please be respectful and constructive in all interactions. We want to maintain a welcoming environment for all contributors.

While it's okay to use AI tools like Copilot (we provide instructions for agents in `.github/copilot-instructions.md`), please ensure that the code you submit adheres to our quality standards and conventions. Especially since this project does not use tests yet, it's important to ensure your changes are well-tested in a local Astro project before submitting a PR.

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Look at existing issues and PRs for examples
- Review the codebase to understand patterns and conventions

Thank you for contributing to astro-integration-pocketbase!
