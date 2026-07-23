# AGENTS.md

Vue 3 monorepo of UI render libraries on TypeScript + Vite + Arco Design Vue.
Package manager is **pnpm** (enforced via `preinstall` `only-allow pnpm`); **Node >= 24**, pnpm 10.24.0.

## Packages

| Package | Depends on (workspace) | Notes |
| --- | --- | --- |
| `@gopowerteam/modal-render` | — | Dialog/Drawer, Promise-style API. Standalone. |
| `@gopowerteam/form-render` | `modal-render` (optional, peer) | Declarative form rendering. |
| `@gopowerteam/table-render` | `form-render`, `modal-render` (peers) + `exceljs`, `@gopowerteam/request` | Table with paging/sort/export. |

Build order is handled by Turborepo (`dependsOn: ["^build"]`) — never build packages out of order manually.
`apps/playground` is the dev harness (private, excluded from changesets).

## Commands

```bash
pnpm install                          # install (hoisted linker)
pnpm run lint                         # lint all packages (turbo)
pnpm run build                        # build all packages (turbo) — this is also the typecheck
pnpm run dev                          # turbo dev = vite build --watch for every PACKAGE
pnpm --filter playground dev          # the actual Vite dev SERVER (lives in apps/playground)
pnpm --filter @gopowerteam/table-render build   # build/lint a single package
```

> **`pnpm run dev` is watch-build, not a dev server.** It runs `vite build --watch` in each package and blocks. To get the browser playground, run the `playground` filter above instead.

### Verification before finishing a task

There is **no test framework** and **no standalone `typecheck` script**. Type errors only surface during `vite build` (via `vite-plugin-dts` + `vue-tsc`). So:

```bash
pnpm run lint   # and/or: pnpm --filter <pkg> lint
pnpm run build  # catches type errors and generates dist + .d.ts
```

Run both on the affected packages before declaring done.

## Git hooks (husky)

- `pre-commit` → `lint-staged`: runs `eslint --cache --fix` on `*.{ts,tsx,js,jsx}` (**excludes `*.spec.*`**). See `.lintstagedrc.js`.
- `commit-msg` → `commitlint` (`@commitlint/config-conventional`).

## Lint / format

- ESLint config is `@antfu/eslint-config` with `formatters: true` + `unocss` + `vue` enabled (`eslint.config.mjs`). **No Prettier** — formatting goes through ESLint.
- `markdown: false` (markdown is NOT linted). `no-console` is **off** (console statements allowed).
- ESLint ignores `dist/`, `es/`, `lib/`, `_site/`, `bin/`, and `*.spec.*`.
- TS strict mode; use `import type { ... }` for type-only imports.

## Conventions (non-obvious)

- **`.vue` files** use `<script setup lang="ts">`; **`.tsx` files** use `defineComponent` with a `render()`. Both styles coexist.
- User-facing **error messages and code comments are in Chinese** (e.g. `throw new Error("未找到需要编辑的数据")`). Match this — don't translate to English.
- File naming: `kebab-case.vue` / `kebab-case/index.tsx` / `kebab-case.service.ts` / `kebab-case.ts`.
- Each package's public API is barrel-exported from `src/index.ts`; `install.ts` is the Vue plugin installer.
- Generic types default to `<T = DataRecord>`.

## Package output / build shape

- All packages emit **ESM** (`dist/es/*.mjs`) + **CJS** (`dist/cjs/*.cjs`) + types (`dist/es/*.d.ts`) + a single `dist/style.css`.
- `table-render` additionally exports a **`./resolver`** subpath (`src/resolver.ts` → `TableRenderResolver`) for `unplugin-vue-components` auto-import. (`form-render` also has a `src/resolver.ts` and builds it, but does **not** declare a `./resolver` export in its `package.json`.) The playground uses this pattern (see `apps/playground/vite.config.ts`).
- Workspace deps use `workspace:*`; peer deps (vue, arco, etc.) are `external` in the rollup config.

## Commits & releases

- Commits are conventional-commit (commitlint). Allowed types: `feat fix docs style refactor perf test build ci chore revert improvement release`. Use `pnpm run commit` for the Commitizen (`cz-customizable`) prompt.
- Versioning/publishing uses **Changesets**. Base branch is **`master`**, npm `access: restricted` (overridden to `public` per-package in `publishConfig`), `playground` ignored.
  ```bash
  pnpm run cs                # add a changeset, then bump versions
  pnpm run publish-packages  # build + version + publish
  ```
