# AGENTS.md

Compact ramp-up guide for AI agents. Each item exists because an agent would likely miss it.

## Project

An Astro integration package that adds tooling for developers working with `astro-loader-pocketbase`. Key capabilities: a dev toolbar for inspecting PocketBase entries and real-time updates so that collection changes in PocketBase instantly trigger a dev server refresh.

Relevant upstream documentation:

- [Astro Content Loader API](https://docs.astro.build/en/reference/content-loader-reference/)
- [Astro Integration API](https://docs.astro.build/en/reference/integrations-reference/)
- [Astro Dev Toolbar App API](https://docs.astro.build/en/reference/dev-toolbar-app-reference/)
- [PocketBase Documentation](https://pocketbase.io/docs/)

## Environment

- Node >= 22.12.0 required; `.nvmrc` specifies node version. Use `nvm use` before anything.
- Package manager: `npm` (version enforced via `packageManager` field). Do not use pnpm or yarn.

## Essential commands

```bash
npm run format       # oxfmt — format all files
npm run lint:fix     # oxlint --fix — lint + auto-fix
npm run typecheck    # tsc --noEmit on src/
npm run build        # tsdown → dist/
```

## Pre-commit order (husky enforces this)

All three must pass before committing, in this order:

1. `npm run format`
2. `npm run lint:fix`
3. `npm run typecheck`

`lint-staged` runs oxfmt + oxlint on staged files automatically. The pre-commit hook also runs `npm run typecheck` if any `.ts` files are staged.

## No test suite

This package has no unit or e2e tests. CI only runs lint, format check, type check, and build.

## Code conventions (enforced by oxlint — violations are errors)

- Use `interface`, not `type`, for object shapes.
- Use `Array<T>`, not `T[]`.
- Use `undefined`, never `null` (`unicorn/no-null: error`).
- Use `import type` for type-only imports (`typescript/consistent-type-imports`).
- Filenames must be kebab-case (`unicorn/filename-case`).
- No circular imports (`import/no-cycle`).
- No CommonJS (`import/no-commonjs`).
- Max 500 lines per file, 100 lines per function — **except** `src/toolbar/**/*` where the function limit is 200 (DOM construction is verbose by nature).
- `src/toolbar/**/*` runs under the browser environment (not node).
- JS/CJS files are not linted (oxlint ignores `*.{js,cjs}`).

## Commit messages

Enforced by commitlint (`@commitlint/config-conventional`):

```
<type>(scope): <description>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `build`
Scopes: `toolbar`, `refresh`, `middleware` (or custom)

## Branch and release

- Default PR target: `next` branch (pre-release), not `master`.
- Releases are driven by semantic-release from `master`/`next`. Commit types determine version bumps automatically.

## Build output

- Bundler: `tsdown` → `dist/` (ESM only, `.mjs`).
- Multiple entry points: `.` (main), `./middleware`, `./toolbar`.
- Only `dist/` is published to npm.
- Build runs automatically on `npm publish` via `prepublishOnly`.

## CI notes

- `HUSKY=0` is set in all CI jobs — do not remove it.
- CI runs `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, and `npm run build` in parallel.
- There is no test step in CI.
