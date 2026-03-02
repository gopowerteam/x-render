# AGENTS.md - AI Coding Agent Guide

## Project Overview

This is a Vue 3 monorepo containing UI render libraries built with TypeScript, Vite, and Arco Design Vue. The project uses pnpm as the package manager and Turborepo for build orchestration.

### Packages

- `@gopowerteam/modal-render` - Modal/dialog component library
- `@gopowerteam/form-render` - Form rendering library
- `@gopowerteam/table-render` - Table rendering library (depends on form-render and modal-render)

### Apps

- `playground` - Development/testing environment

---

## Commands

### Package Manager

**IMPORTANT:** This project uses pnpm. Always use `pnpm` instead of `npm`, `yarn`, or `bun`.

```bash
pnpm install          # Install dependencies
pnpm add <package>    # Add dependency
pnpm add -D <package> # Add dev dependency
```

### Build

```bash
pnpm run build        # Build all packages (via turbo)
pnpm run dev          # Start dev mode with watch
```

To build a specific package:

```bash
cd packages/table-render && pnpm run build
```

### Lint

```bash
pnpm run lint         # Lint all packages
```

Lint-staged runs automatically on pre-commit for `.ts`, `.tsx`, `.js`, `.jsx` files (excluding spec files).

### Testing

No test framework is currently configured in this project. If adding tests, create a test setup first.

---

## Code Style

### Formatting (Prettier)

```js
{
  semi: false,        // No semicolons
  singleQuote: true,  // Use single quotes
}
```

### EditorConfig

- Indent: 2 spaces
- Charset: UTF-8
- End of line: LF
- Trim trailing whitespace
- Insert final newline

### TypeScript

- Target: ES2022
- Strict mode enabled
- Use `type` for type imports: `import type { Foo } from 'bar'`
- Generic types use `<T = DataRecord>` pattern with defaults

### ESLint

Extends `@gopowerteam/eslint-config`. Console statements are allowed.

---

## Code Conventions

### File Naming

- **TSX components:** `kebab-case/index.tsx` (e.g., `table-columns/text/index.tsx`)
- **Vue components:** `kebab-case.vue` (e.g., `modal-dialog.vue`)
- **Utility files:** `kebab-case.ts` (e.g., `is-promise.ts`)
- **Service files:** `kebab-case.service.ts` (e.g., `sort.service.ts`)

### Import Order

```typescript
// 1. External dependencies (Node built-ins first)
import { resolve } from 'node:path'

// 2. Third-party packages
import { defineComponent, ref } from 'vue'
import { Table } from '@arco-design/web-vue'

// 3. Internal packages (using workspace protocol)
import { ModalProvider } from '@gopowerteam/modal-render'

// 4. Relative imports
import { createTableSource } from '../utils/create-table-source'
import type { TableColumnOptions } from '../../interfaces'
```

### Vue Components

Use `<script setup>` with TypeScript:

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    content: string
  }>(),
  {
    title: 'Default Title',
  },
)
</script>

<template>
  <!-- template content -->
</template>

<style scoped lang="less">
/* styles */
</style>
```

### TSX Components

Use `defineComponent` with render function:

```tsx
import { defineComponent, ref } from 'vue'

export const MyComponent = defineComponent({
  props: {
    value: { type: String, required: false },
  },
  setup(props, ctx) {
    const data = ref<string>()

    return { data }
  },
  render() {
    return <div>{this.data}</div>
  },
})
```

### Exports

Barrel exports from `index.ts`:

```typescript
export * from './interfaces'
export * from './hooks'
export * from './defines'
export { default } from './install'
```

### Type Definitions

- Export types alongside implementations
- Use `interface` for object shapes, `type` for unions/intersections
- Export instance types for components:

```typescript
export type MyComponentInstance = InstanceType<typeof MyComponent>
export type MyComponentProps = MyComponentInstance['$props']
```

### Naming Conventions

- **Components:** PascalCase (`TableRender`, `ModalProvider`)
- **Functions:** camelCase (`createTableSource`, `useTable`)
- **Constants:** UPPER_SNAKE_CASE or camelCase (`ModalKey`)
- **Interfaces:** PascalCase with descriptive suffix (`TableColumnOptions`, `FormItemsOptions`)
- **Service classes:** PascalCase with suffix (`PageService`, `SortService`)

### Error Handling

Throw descriptive errors (Chinese comments in codebase):

```typescript
if (!record) {
  throw new Error('未找到需要编辑的数据')
}
```

Return rejected promises for async failures:

```typescript
if (!props.dataLoad) {
  return Promise.reject()
}
```

---

## Commit Conventions

Uses Commitizen with conventional commits:

| Type       | Description      |
| ---------- | ---------------- |
| `feat`     | New feature      |
| `fix`      | Bug fix          |
| `docs`     | Documentation    |
| `refactor` | Code refactoring |
| `perf`     | Performance      |
| `test`     | Tests            |
| `build`    | Build system     |
| `revert`   | Revert changes   |

Run `pnpm run commit` for interactive commit creation.

---

## Project Structure

```
x-render/
├── packages/
│   ├── modal-render/
│   │   └── src/
│   │       ├── components/   # Vue components
│   │       ├── hooks/        # Composables
│   │       ├── interfaces.ts # Type definitions
│   │       └── index.ts      # Barrel export
│   ├── form-render/
│   │   └── src/
│   │       ├── form-render/  # Main component
│   │       ├── form-items/   # Form field components
│   │       ├── defines/      # Type factories
│   │       └── hooks/        # Composables
│   └── table-render/
│       └── src/
│           ├── table-render/ # Main component
│           ├── table-columns/# Column renderers
│           ├── utils/        # Utilities
│           └── plugins/      # Table plugins
├── apps/
│   └── playground/           # Dev playground
└── turbo.json                # Turbo pipeline
```

---

## Key Dependencies

- **Vue 3.4+** with Composition API
- **Arco Design Vue** - UI component library
- **UnoCSS** - Atomic CSS
- **VueUse** - Vue composables
- **Vite** - Build tool
- **Less** - CSS preprocessor

---

## Notes

- All packages output both ESM (`dist/es/*.mjs`) and CJS (`dist/cjs/*.cjs`) formats
- Type definitions are generated via `vite-plugin-dts`
- Workspace packages use `workspace:*` protocol for local deps
- UnoCSS styles imported via `import 'virtual:uno.css'`
