# @gopowerteam/modal-render

## 1.0.4

### Patch Changes

- 优化代码
- 修复 modal-render 一系列缺陷与质量问题：

  **缺陷修复**

  - 修复 `hideLoading()` 在无容器场景下对 `undefined` 解构抛出 TypeError 的问题，并补充全局 Loading 的兜底关闭逻辑（`showLoading()` 打开的全局 Loading 现在可由 `hideLoading()` 关闭）
  - 修复 `maxHeight` 传入数字（如 `90`）时计算产生 `NaNpx` 的问题；现在百分比字符串按容器高度折算，数字 / px 字符串直接作为像素上限，容器默认值对齐 Provider 为 `'90%'`；`ModalContainer` 独立使用时补充 `sizes` 默认值，不再抛错
  - 修复 ESC 监听器泄漏：弹窗经其他途径关闭后 `keydown` 监听器现在会在 `onUnmounted` 成对移除
  - 修复 `ModalHeader` / `ModalFooter` 的 Teleport 锚点使用全局硬编码 id 的问题：嵌套弹窗时插槽内容会串扰到第一个弹窗；现在锚点 id 含容器实例 id（`modal-header-slot_${id}`），各弹窗互不串扰，并修复了挂载时序导致 Teleport 从未成功命中锚点的存量问题（此前实际以原位渲染降级）
  - 修复 `confirm` / `info` / `success` / `warning` / `error` 快捷方法依赖 `this` 的问题，解构调用（`const { confirm } = useModal()`）不再报错
  - `openModal` 不再污染调用方传入的 `props` / `options` 对象
  - 断开 `modal-dialog` → 包入口的循环依赖

  **行为调整**

  - zIndex 改为按打开顺序递增（`1000 + 已打开数量`），移除消息弹窗固定 `1100` 的特例；后打开的弹窗层级始终在上，用户显式传入 `zIndex` 仍可覆盖
  - 错误消息中文化：`未找到 ModalProvider 组件，请将组件包裹在 <ModalProvider> 内使用` / `未找到当前弹窗容器，请在弹窗内容组件中使用`（原英文文案已废弃）
  - `ModalFooter` 增加按钮布局（flex 右对齐）与 `:slotted(button)` 样式命中，自定义插槽按钮获得与内置按钮一致的视觉
  - 移除从未实现的 `OpenModalOptions.mask` 选项（文档与接口不一致）

  **其他**

  - 新增 `role="dialog"` / `aria-modal` / 关闭图标 `aria-label` 基础无障碍属性
  - 样式预处理统一为 scss，提取共享按钮 / spinner 样式 partial 去重；`onEvent` 支持同一事件多个监听器；`addEventListener` 增加重复注册去重；移除 `observer` 等死代码
  - `package.json` 新增 `sideEffects` 声明，修正 `npm:publish` 的 `--access public` 参数

## 1.0.3

### Patch Changes

- 优化移动端显示

## 1.0.2

### Patch Changes

- 优化移动端显示

## 1.0.1

### Patch Changes

- 更新 README.md

## 1.0.0

### Minor Changes

- 升级相关依赖

## 0.0.48

### Patch Changes

- fixed modal button submit

## 0.0.47

### Patch Changes

- fixed modal submit button

## 0.0.46

### Patch Changes

- fixed inheritAttrs

## 0.0.45

### Patch Changes

- rebuild

## 0.0.44

### Patch Changes

- update modal

## 0.0.43

### Patch Changes

- update form text render

## 0.0.42

### Patch Changes

- update version

## 0.0.41

### Patch Changes

- add show loading function

## 0.0.40

### Patch Changes

- upgrade vue 3.3 to 3.4

## 0.0.39

### Patch Changes

- fixed button size

## 0.0.38

### Patch Changes

- update dependency

## 0.0.37

### Patch Changes

- update

## 0.0.36

### Patch Changes

- update

## 0.0.35

### Patch Changes

- update

## 0.0.34

### Patch Changes

- update

## 0.0.33

### Patch Changes

- update

## 0.0.32

### Patch Changes

- fixed height compute

## 0.0.31

### Patch Changes

- fixed height compute

## 0.0.30

### Patch Changes

- fixed max height compute

## 0.0.29

### Patch Changes

- update

## 0.0.28

### Patch Changes

- update

## 0.0.27

### Patch Changes

- update css

## 0.0.26

### Patch Changes

- fixed max height

## 0.0.25

### Patch Changes

- update

## 0.0.24

### Patch Changes

- add modal footer

## 0.0.23

### Patch Changes

- update

## 0.0.22

### Patch Changes

- fixed modal fullscreen

## 0.0.21

### Patch Changes

- update size

## 0.0.20

### Patch Changes

- update

## 0.0.19

### Patch Changes

- fixed modal

## 0.0.18

### Patch Changes

- fixed

## 0.0.17

### Patch Changes

- fixed cache
- update

## 0.0.16

### Patch Changes

- update

## 0.0.15

### Patch Changes

- update background color property

## 0.0.14

### Patch Changes

- update

## 0.0.13

### Patch Changes

- update

## 0.0.12

### Patch Changes

- fixed contain:content

## 0.0.11

### Patch Changes

- add offset props

## 0.0.10

### Patch Changes

- update version

## 0.0.9

### Patch Changes

- init base fun

## 0.0.8

### Patch Changes

- update and fixed

## 0.0.7

### Patch Changes

- add modal dialog support

## 0.0.6

### Patch Changes

- fixed drawer height

## 0.0.5

### Patch Changes

- update props params

## 0.0.4

### Patch Changes

- add drawer mode
