# modal-render 移动端适配设计

- 日期：2026-09-08
- 状态：已确认
- 范围：`packages/modal-render`

## 背景

modal-render 当前所有尺寸为百分比（small 50% / middle 70% / large 90%），无移动端适配：居中弹窗在窄屏上过窄、抽屉不贴满屏幕、按钮触控目标偏小（32px）、无安全区适配、无滚动穿透与动画形态处理。

## 目标

- 移动端（视口 ≤ 768px）下自动切换交互形态：
  - dialog → **bottom sheet**：贴底、宽 100%、顶部圆角 16px、上滑入场动画
  - drawer → **全屏**（宽高 100%、无圆角）
  - confirm/info/warning/error/success 消息弹窗保持**居中小卡**，宽度 `min(calc(100vw - 32px), 400px)`
- 触控优化：移动端按钮高度 32px → 44px；底部安全区 `env(safe-area-inset-bottom)` 适配
- API 向后兼容，桌面端行为零变化

## 非目标

- 不处理 iOS 键盘弹出时 fixed 容器与 visual viewport 的差异（现状限制）
- 不引入 `dvh`（body 高度上限已由 JS 测量逻辑保证，避免兼容性问题）
- 不改 table-render / form-render（自动受益于 modal-render 的新行为）

## API 设计（增量，向后兼容）

| 位置 | 新增 | 默认 | 说明 |
| --- | --- | --- | --- |
| `ModalProvider` props | `mobile?: boolean \| 'auto'` | `'auto'` | 全局开关 |
| `OpenModalOptions` | `mobile?: boolean \| 'auto'` | — | 单次覆盖，优先级最高 |

解析规则：单次 `open()` 选项 → Provider 全局 prop → `'auto'`（媒体查询结果）。

## 技术方案

### 1. 视口检测：`src/hooks/use-mobile.ts`

基于 `@vueuse/core` 14.2.1：

```ts
import { createSharedComposable, useMediaQuery } from '@vueuse/core'

const useSharedMediaQuery = createSharedComposable(
  () => useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`),
)

export function useMobile() {
  return useSharedMediaQuery()
}
```

- `MOBILE_BREAKPOINT = 768` 加入 `src/constants.ts`
- 全部 ModalContainer 共享同一 MediaQueryList 监听器；SSR 下 `createSharedComposable` 自动隔离

### 2. `modal-container.vue`

- 新增 prop `mobile`，setup 中调用一次 `const isMobileQuery = useMobile()`，计算 `isMobileMode = computed(() => props.mobile === 'auto' ? isMobileQuery.value : props.mobile)`
- 进一步区分 `isBottomSheetMode`（= mobile + dialog + 组件弹窗）：wrapper 加 `modal-wrapper--bottom-sheet`（贴底），content 加 `modal--bottom-sheet`（宽度/圆角/安全区）；`modal--mobile` 类作用于所有移动端弹窗（触控按钮 44px、抽屉 body 安全区）——保证 confirm 等消息弹窗不受贴底样式影响
- `contentStyle` 新增分支（内联样式优先级高于类，无法纯 CSS 解决）：
  1. dialog + mobile：跳过 `sizes` 百分比 width/maxWidth（由 CSS 类设 100%）；显式 `props.width` 仍以内联生效
  2. 消息弹窗（`type !== 'component'`）+ mobile + dialog：`width: min(calc(100vw - 32px), 400px)`
  3. drawer + mobile：`width: 100%; height: 100%; maxHeight: unset; borderRadius: 0`（全屏）
  4. mobile 下跳过 `draggable` transform 与 `offset` margin
- `bodyStyle` 新增分支：mobile drawer 同 fullscreen 逻辑：`maxHeight: unset; height: calc(100% - extraHeight)`

### 3. CSS 形态切换（`modal-container.vue` scoped 样式）

```less
.modal-wrapper--bottom-sheet { align-items: flex-end; } // bottom sheet 贴底（仅组件弹窗）

.modal-content.modal--mobile {
  // 触控目标优化：按钮 44px（含 :deep(.modal-dialog button)）
  &.drawer-mode .modal-body { padding-bottom: env(safe-area-inset-bottom, 0px); }
}

.modal-content.modal--bottom-sheet {
  width: 100%;
  max-width: 100%;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

### 4. 入场/离场动画（`modal-provider.vue`）

现有 `transition-group` 的 `:deep()` 机制（已被 drawer 动画验证），追加：

```scss
.modal-fade-enter-active, .modal-fade-leave-active {
  &:deep(.modal-content.dialog-mode.modal--mobile) { transition: transform 0.3s ease; }
}
.modal-fade-enter-from, .modal-fade-leave-to {
  &:deep(.modal-content.dialog-mode.modal--mobile) { transform: translate3d(0, 100%, 0); }
}
```

### 5. 配套

- playground `views/modal.vue` 增加移动端形态示例（dialog / drawer / confirm / 禁用 mobile）
- README 补充 `mobile` 选项与 `viewport-fit=cover` 说明（safe-area 生效前提）

## 错误处理与边界

- 消息弹窗宽度分支仅在 `mode === 'dialog'` 时生效；显式传 `mode: 'drawer'` 的 confirm 同样走全屏抽屉逻辑
- 嵌套弹窗：各 wrapper 独立、zIndex 既有机制不变
- `min()`/`env()` 为渐进增强，旧浏览器回退为默认行为

## 验证

- 无测试框架：`pnpm --filter @gopowerteam/modal-render lint && pnpm --filter @gopowerteam/modal-render build`（build 含 vue-tsc 类型检查）
- playground 启动后用浏览器响应式视口（375×667）人工核验四种形态 + 桌面端回归

## 已知限制

- iOS 键盘弹出遮挡：fixed 容器不随 visual viewport 缩放（现状即如此）
- safe-area 需宿主 `<meta name="viewport" content="..., viewport-fit=cover">`
