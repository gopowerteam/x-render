# modal-render 移动端适配实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** modal-render 在移动端视口（≤768px）下自动切换为 bottom sheet（dialog）/ 全屏（drawer）形态，API 向后兼容。

**Architecture:** `createSharedComposable(useMediaQuery)` 检测视口 → container 计算属性产出 `modal--mobile` 类 → CSS 完成形态切换；内联样式冲突处（width/height/borderRadius）在 `contentStyle`/`bodyStyle` 增加最小 JS 分支。

**Tech Stack:** Vue 3 + `@vueuse/core` 14.2.1 + Less/SCSS。本项目无测试框架（AGENTS.md），验证方式为 lint + build（含 vue-tsc）+ playground 人工核验。

**Spec:** `docs/superpowers/specs/2026-09-08-modal-render-mobile-design.md`

---

### Task 1: 断点常量 + useMobile hook + 类型

**Files:**
- Modify: `packages/modal-render/src/constants.ts`
- Create: `packages/modal-render/src/hooks/use-mobile.ts`
- Modify: `packages/modal-render/src/interfaces.ts`

- [ ] **Step 1.1: constants.ts 增加断点**

```ts
import type { InjectionKey } from 'vue'
import type { ModalActions } from './interfaces'

export const ModalKey = Symbol('__MODAL__') as InjectionKey<ModalActions>

/** 移动端断点（视口宽度，单位 px） */
export const MOBILE_BREAKPOINT = 768
```

- [ ] **Step 1.2: 新建 `src/hooks/use-mobile.ts`**

```ts
import { createSharedComposable, useMediaQuery } from '@vueuse/core'
import { MOBILE_BREAKPOINT } from '../constants'

const useSharedMediaQuery = createSharedComposable(() =>
  useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`),
)

/**
 * 是否为移动端视口（所有 ModalContainer 共享同一个媒体查询监听）
 */
export function useMobile() {
  return useSharedMediaQuery()
}
```

- [ ] **Step 1.3: interfaces.ts 的 `OpenModalOptions` 增加选项（放在 `mode` 之后）**

```ts
  mode?: 'dialog' | 'drawer'
  /** 移动端形态开关：'auto' 跟随视口宽度（默认，继承 Provider），boolean 强制指定 */
  mobile?: boolean | 'auto'
```

- [ ] **Step 1.4: lint 验证**

Run: `pnpm --filter @gopowerteam/modal-render lint`
Expected: 无错误

---

### Task 2: modal-container.vue 移动端逻辑与样式

**Files:**
- Modify: `packages/modal-render/src/components/modal-container.vue`

- [ ] **Step 2.1: props 增加 `mobile`（默认 `'auto'`），withDefaults 中加 `mobile: 'auto'`**

```ts
    submitText?: string
    cancelText?: string
    mobile?: boolean | 'auto'
    zIndex?: number
```

- [ ] **Step 2.2: script 引入 hook 与计算属性（放在 `const modal = inject(ModalKey)` 之后）**

```ts
import { useMobile } from '../hooks/use-mobile'

const isMobileQuery = useMobile()

const isMobileMode = computed(() =>
  props.mobile === 'auto' ? isMobileQuery.value : props.mobile,
)
```

- [ ] **Step 2.3: `contentStyle` 五处修改（完整替换该 computed）**

```ts
const contentStyle = computed(() => {
  const styles: HTMLAttributes['style'] = {}

  if (props.mode === 'drawer' && ['top', 'bottom'].includes(props.position)) {
    styles.maxHeight = formatSizeValue(props.maxHeight!)
  }
  else if (!(isMobileMode.value && props.mode === 'dialog')) {
    // 移动端 dialog 宽度由 CSS 类控制（bottom sheet）
    styles.width = formatSizeValue(props.sizes![props.size!])
    styles.maxWidth = formatSizeValue(props.maxWidth!)
  }

  if (props.width) {
    styles.width = formatSizeValue(props.width)
  }

  if (props.height) {
    styles.height = formatSizeValue(props.height)
  }

  if (props.fullscreen) {
    styles.maxWidth = 'unset'
    styles.width = '100%'
    styles.position = 'fixed'
    styles.top = 0
    styles.left = 0
    styles.bottom = 0
    styles.right = 0
    styles.borderRadius = 0
  }

  if (props.draggable && !props.fullscreen && props.mode === 'dialog' && !isMobileMode.value) {
    styles.transform = `translate3d(${x.value - offsetX}px, ${y.value - offsetY}px, 0px)`
  }

  if (props.mode === 'drawer') {
    styles.borderRadius = 0

    if (isMobileMode.value) {
      // 移动端抽屉全屏
      styles.width = '100%'
      styles.height = '100%'
      styles.maxHeight = 'unset'
    }
    else if (['left', 'right'].includes(props.position)) {
      styles.height = '100%'
    }
    else {
      styles.width = '100%'
    }
  }

  // 移动端消息弹窗保持居中小卡，宽度自适应
  if (isMobileMode.value && props.mode === 'dialog' && props.type !== 'component') {
    styles.width = 'min(calc(100vw - 32px), 400px)'
  }

  if (props.offset && props.mode === 'dialog' && !isMobileMode.value) {
    styles.marginLeft = `${props.offset.x || 0}px`
    styles.marginTop = `${props.offset.y || 0}px`
  }

  if (props.backgroundColor) {
    styles.backgroundColor = props.backgroundColor
  }

  return styles
})
```

- [ ] **Step 2.4: `bodyStyle` 的 drawer 分支替换为**

```ts
  if (props.mode === 'drawer') {
    styles.maxHeight = 'unset'

    if (isMobileMode.value) {
      // 移动端抽屉全屏，与 fullscreen 相同策略
      styles.height = `calc(100% - ${extraHeight}px)`
    }
    else if (['left', 'right'].includes(props.position)) {
      styles.height = `${wrapperHeight.value - extraHeight}px`
    }
  }
```

- [ ] **Step 2.5: 模板绑定移动端类**

wrapper：

```html
  <div
    ref="wrapperRef"
    class="modal-wrapper"
    :class="{ 'modal-wrapper--mobile': isMobileMode }"
    :style="wrapperStyle"
    @click.self="maskClosable && onClose()"
  >
```

content：

```html
      :class="{ [`${mode}-mode`]: true, [`${position}-position`]: true, 'modal--mobile': isMobileMode }"
```

- [ ] **Step 2.6: scoped 样式末尾追加移动端块**

```less
// 移动端适配
.modal-wrapper--mobile {
  align-items: flex-end;
}

.modal-content.modal--mobile {
  &.dialog-mode {
    width: 100%;
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  &.drawer-mode .modal-body {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  // 触控目标优化：按钮高度 44px
  .modal-footer button {
    height: 44px;
    line-height: 44px;
  }

  :deep(.modal-dialog button) {
    height: 44px;
    line-height: 44px;
  }
}
```

---

### Task 3: modal-provider.vue 移动端 prop 与上滑动画

**Files:**
- Modify: `packages/modal-render/src/components/modal-provider.vue`

- [ ] **Step 3.1: props 增加（默认 `'auto'`）**

```ts
    offset?: { x?: number, y?: number }
    mobile?: boolean | 'auto'
  }>(),
  {
    ...
    offset: () => ({ x: 0, y: 0 }),
    mobile: 'auto',
  },
```

- [ ] **Step 3.2: 模板向 ModalContainer 传参（置于 `v-bind="modal.options"` 之前，保证 open() 选项可覆盖）**

```html
          :sizes="sizes"
          :mobile="mobile"
          v-bind="modal.options"
```

- [ ] **Step 3.3: scoped scss 动画追加（两个选择器块内各加一条 `:deep` 规则）**

```scss
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;

  &:deep(.modal-content.drawer-mode) {
    transition: transform 0.5s ease;
  }
  &:deep(.modal-content.dialog-mode.modal--mobile) {
    transition: transform 0.3s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  /* ...既有 drawer 规则保持不变... */
  &:deep(.modal-content.dialog-mode.modal--mobile) {
    transform: translate3d(0, 100%, 0);
  }
}
```

- [ ] **Step 3.4: lint + build 验证**

Run: `pnpm --filter @gopowerteam/modal-render lint && pnpm --filter @gopowerteam/modal-render build`
Expected: 均成功（build 含 vue-tsc 类型检查）

- [ ] **Step 3.5: 提交核心实现**

```bash
git add packages/modal-render/src
git commit -m "feat(modal-render): 移动端自动适配 bottom sheet 与全屏抽屉"
```

---

### Task 4: playground 移动端示例

**Files:**
- Modify: `apps/playground/src/views/modal.vue`

- [ ] **Step 4.1: script 追加三个示例函数**

```ts
function onOpenDrawer() {
  modal.open(Test1, {}, {
    title: '抽屉',
    mode: 'drawer',
    position: 'right',
    footer: true,
  })
}

function onOpenConfirm() {
  modal.confirm({
    content: '确认执行该操作吗？',
    onOk() {
      console.log('ok')
    },
  })
}

function onOpenDesktopDialog() {
  modal.open(Test1, {}, {
    title: '保持桌面形态',
    mobile: false,
    footer: true,
  })
}
```

- [ ] **Step 4.2: template 追加按钮**

```html
  <button @click="onOpenDrawer">
    抽屉
  </button>
  <button @click="onOpenConfirm">
    confirm
  </button>
  <button @click="onOpenDesktopDialog">
    禁用移动端形态
  </button>
```

---

### Task 5: README 文档

**Files:**
- Modify: `packages/modal-render/README.md`

- [ ] **Step 5.1: 「特性」追加一条**

```markdown
- 移动端自适应：视口 ≤768px 时弹窗自动切换为 bottom sheet、抽屉自动全屏
```

- [ ] **Step 5.2: ModalProvider 属性表追加行**

```markdown
| mobile | `boolean \| 'auto'` | `'auto'` | 移动端形态开关，`'auto'` 按视口宽度（768px）自动判断 |
```

- [ ] **Step 5.3: OpenModalOptions 配置表追加行（mode 之后）**

```markdown
| mobile | `boolean \| 'auto'` | 继承 Provider | 移动端形态开关，单次覆盖全局配置 |
```

- [ ] **Step 5.4: 「高级用法」追加小节**

```markdown
### 移动端适配

视口宽度 ≤768px 时自动启用移动端形态：弹窗（dialog）切换为底部弹出（bottom sheet），
抽屉（drawer）切换为全屏，预设消息弹窗保持居中小卡，按钮触控高度提升至 44px。

// 全局禁用
<ModalProvider :mobile="false">...</ModalProvider>

// 单次强制移动端形态
modal.open(Component, {}, { mobile: true })

// 单次禁用，保持桌面形态
modal.open(Component, {}, { mobile: false })

> 安全区适配说明：底部安全区依赖宿主页面 `<meta name="viewport" content="..., viewport-fit=cover">`。
```

---

### Task 6: 整体验证

- [ ] **Step 6.1: 全量 lint + build**

Run: `pnpm run lint && pnpm run build`
Expected: 全部包成功

- [ ] **Step 6.2: playground 移动端视口人工核验**

Run: `pnpm --filter playground dev`，浏览器 375×667 视口核验：
1. dialog → bottom sheet（贴底、顶圆角、上滑动画）
2. drawer → 全屏
3. confirm → 居中小卡
4. `mobile: false` → 桌面形态
5. 桌面视口（>768px）回归：形态与改动前一致

- [ ] **Step 6.3: 提交配套改动**

```bash
git add apps/playground/src/views/modal.vue packages/modal-render/README.md
git commit -m "docs(modal-render): 补充移动端适配文档与示例"
```
