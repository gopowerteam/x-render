# @gopowerteam/modal-render

Vue 3 模态框/抽屉渲染组件库，基于 Promise 风格 API，提供灵活的对话框和抽屉功能。

## 目录

- [特性](#特性)
- [安装](#安装)
- [快速开始](#快速开始)
- [快速参考](#快速参考)
- [组件 API](#组件-api)
- [useModal Hook](#usemodal-hook)
- [OpenModalOptions 配置项](#openmodaloptions-配置项)
- [onSubmit Hook](#onsubmit-hook)
- [完整示例](#完整示例)
- [高级用法](#高级用法)
- [样式自定义](#样式自定义)
- [TypeScript 类型](#typescript-类型)
- [FAQ](#faq)
- [注意事项](#注意事项)

## 特性

- 支持 Dialog（对话框）和 Drawer（抽屉）两种模式
- Promise 风格 API，支持 async/await
- 预设对话框：confirm、info、warning、error、success
- 可拖拽、全屏、自定义尺寸
- 支持嵌套模态框
- 完整的 TypeScript 类型支持

## 安装

```bash
pnpm add @gopowerteam/modal-render
```

## 快速开始

### 1. 配置 ModalProvider

在 `App.vue` 中配置 `ModalProvider`：

```vue
<script setup lang="ts">
import { ModalProvider } from '@gopowerteam/modal-render'
</script>

<template>
  <ModalProvider :offset="{ x: 0, y: 0 }">
    <RouterView />
  </ModalProvider>
</template>
```

### 2. 导入样式

在入口文件 `main.ts` 中导入样式：

```ts
import '@gopowerteam/modal-render/dist/style.css'
```

### 3. 基础使用

```vue
<script setup lang="ts">
import { useModal } from '@gopowerteam/modal-render'
import MyModalContent from './components/MyModalContent.vue'

const modal = useModal()

function openModal() {
  modal.open(
    MyModalContent,
    { /* props */ },
    {
      title: '标题',
      footer: true,
      onOk({ close }) {
        // 处理确认
        close()
      },
    },
  )
}
</script>

<template>
  <button @click="openModal">打开弹窗</button>
</template>
```

---

## 快速参考

### 导入

```ts
// 组件
import { ModalProvider, ModalHeader, ModalFooter } from '@gopowerteam/modal-render'

// Hook
import { useModal, onSubmit } from '@gopowerteam/modal-render'

// 类型
import type { OpenModalOptions, SizeOptions, ShowLoadingOptions } from '@gopowerteam/modal-render'

// 样式
import '@gopowerteam/modal-render/dist/style.css'
```

### useModal 方法速查

```ts
const modal = useModal()

// 打开组件
modal.open(Component, props?, options?) → Promise<any> & { close }

// 预设对话框
modal.confirm({ title, content, onOk?, onCancel? })
modal.info({ title, content })
modal.success({ title, content })
modal.warning({ title, content })
modal.error({ title, content })

// 关闭
modal.close(data?)      // 关闭当前模态框
modal.closeAll()        // 关闭所有模态框

// 加载状态
modal.showLoading(options?) → () => void  // 返回关闭函数
modal.hideLoading()
```

### 常用 options 配置

```ts
// 基础对话框
{ title: '标题', footer: true }

// 抽屉
{ mode: 'drawer', position: 'right', title: '标题' }

// 全屏
{ fullscreen: true }

// 可拖拽
{ draggable: true }

// 点击遮罩关闭
{ maskClosable: true }

// 自定义尺寸
{ width: 800, height: 600 }
{ size: 'large' }  // small | middle | large

// 隐藏头部
{ header: false }

// 表单提交
{ footer: true, form: 'formName', onOk: ({ close }) => {} }
```

### onSubmit 用法

```ts
// 在模态框内容组件中
onSubmit((actions) => {
  actions.showLoading()
  // 异步操作完成后
  actions.close(data)
})
```

### ModalProvider 配置

```vue
<ModalProvider
  :append-to-body="false"
  :sizes="{ small: '50%', middle: '70%', large: '90%' }"
  max-width="90%"
  max-height="90%"
  :offset="{ x: 0, y: 0 }"
>
  <App />
</ModalProvider>
```

---

## 组件 API

### ModalProvider

最外层容器组件，用于提供模态框上下文。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| appendToBody | `boolean \| string` | `false` | 是否挂载到 body，传入字符串时作为选择器 |
| sizes | `SizeOptions` | `{ small: '50%', middle: '70%', large: '90%' }` | 预设尺寸配置 |
| maxWidth | `string \| number` | `'90%'` | 最大宽度 |
| maxHeight | `string \| number` | `'90%'` | 最大高度 |
| offset | `{ x?: number, y?: number }` | `{ x: 0, y: 0 }` | 偏移量 |

```vue
<ModalProvider
  :append-to-body="true"
  :sizes="{ small: '400px', middle: '600px', large: '80%' }"
  max-width="1200px"
  :offset="{ x: 100, y: 50 }"
>
  <App />
</ModalProvider>
```

### ModalHeader

自定义模态框头部，插入到默认头部位置。

```vue
<script setup lang="ts">
import { ModalHeader } from '@gopowerteam/modal-render'
</script>

<template>
  <ModalHeader>
    <span>自定义标题</span>
  </ModalHeader>
</template>
```

### ModalFooter

自定义模态框底部，插入到默认底部位置。

```vue
<script setup lang="ts">
import { ModalFooter, useModal } from '@gopowerteam/modal-render'

const modal = useModal()
</script>

<template>
  <ModalFooter>
    <button @click="modal.close()">关闭</button>
    <button @click="modal.close({ saved: true })">保存</button>
  </ModalFooter>
</template>
```

---

## useModal Hook

获取模态框操作方法，必须在 `ModalProvider` 内部使用。

```ts
const modal = useModal()
```

### open()

打开自定义组件或预设对话框。

```ts
// 打开自定义组件
modal.open(component: Component, props?: Record<string, any>, options?: OpenModalOptions): Promise<any> & { close: () => void }

// 打开预设对话框
modal.open('confirm' | 'info' | 'warning' | 'error' | 'success', props: object, options?: OpenModalOptions): Promise<any> & { close: () => void }
```

**返回值**：返回 Promise 和 close 方法，Promise resolve 的值即为 `close(data)` 传入的数据。

```vue
<script setup lang="ts">
const modal = useModal()

async function openAndWait() {
  const result = await modal.open(
    MyComponent,
    { message: 'Hello' },
    { title: '标题' }
  )
  console.log('模态框返回:', result)
}

// 或者使用 close 方法
const instance = modal.open(MyComponent, {}, { title: '标题' })
instance.then(result => console.log(result))
instance.close() // 主动关闭
</script>
```

### close()

关闭当前所在模态框。

```ts
modal.close() // 不传值，相当于取消
modal.close(data) // 传递数据，Promise 会 resolve 此数据
```

### closeAll()

关闭所有打开的模态框。

```ts
modal.closeAll()
```

### 预设对话框

快捷方法打开预设对话框。

```ts
// 确认对话框
modal.confirm({
  title: '提示',
  content: '确定要执行此操作吗？',
  async onOk() {
    await doSomething()
  },
  onCancel() {
    console.log('取消了')
  },
})

// 信息对话框
modal.info({
  title: '提示',
  content: '操作成功',
})

// 成功/警告/错误对话框用法相同
modal.success({ title: '完成', content: '保存成功' })
modal.warning({ title: '警告', content: '请检查输入' })
modal.error({ title: '错误', content: '操作失败' })
```

### showLoading() / hideLoading()

显示/隐藏加载状态。

```ts
// 在模态框内容组件内使用
const { showLoading, hideLoading } = modal

function handleAsync() {
  const closeLoading = showLoading({ text: '处理中...' })
  
  fetchData().then(() => {
    closeLoading()
  })
}

// 全局 Loading（无需打开模态框）
function showGlobalLoading() {
  const close = modal.showLoading({
    text: '加载中...',
  })
  
  // 3秒后自动关闭
  setTimeout(() => {
    close()
  }, 3000)
}
```

---

## OpenModalOptions 配置项

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| mode | `'dialog' \| 'drawer'` | `'dialog'` | 显示模式 |
| position | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | 抽屉方向（drawer 模式） |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | 预设尺寸 |
| width | `string \| number` | - | 自定义宽度 |
| height | `string \| number` | - | 自定义高度 |
| fullscreen | `boolean` | `false` | 全屏显示 |
| draggable | `boolean` | `false` | 可拖拽移动 |
| title | `string` | - | 标题文字 |
| header | `boolean` | `true` | 是否显示头部 |
| footer | `boolean` | `false` | 是否显示底部按钮 |
| closeable | `boolean` | `true` | 是否显示关闭按钮 |
| esc | `boolean` | `false` | 按 ESC 键关闭 |
| mask | `boolean` | `true` | 是否显示遮罩 |
| maskClosable | `boolean` | `false` | 点击遮罩关闭 |
| bodyStyle | `CSSProperties` | - | 内容区样式 |
| backgroundColor | `string` | - | 背景色 |
| submitText | `string` | `'确定'` | 确认按钮文字 |
| cancelText | `string` | `'取消'` | 取消按钮文字 |
| form | `string` | - | 关联表单的 name，配合 `onSubmit` 使用 |
| onOk | `(options: { close: () => void }) => void` | - | 确认回调 |
| onCancel | `() => void` | - | 取消回调 |

---

## onSubmit Hook

在模态框内容组件中监听底部按钮提交事件，通常配合 `form` 属性和表单组件使用。

```vue
<script setup lang="ts">
import { onSubmit, useModal } from '@gopowerteam/modal-render'

const modal = useModal()

// 监听提交事件
onSubmit((actions) => {
  // 显示加载状态
  actions.showLoading()
  
  // 模拟异步操作
  setTimeout(() => {
    // 返回数据并关闭
    actions.close({ success: true })
  }, 1000)
})
</script>

<template>
  <form name="myForm">
    <!-- 表单内容 -->
  </form>
</template>
```

使用时在 `open` 的 options 中指定 `form` 属性：

```ts
modal.open(
  MyFormComponent,
  {},
  {
    footer: true,
    form: 'myForm',
    onOk({ close }) {
      // 触发 form 提交，会调用 onSubmit 回调
      close()
    },
  }
)
```

---

## 完整示例

### 示例 1：基础对话框

```vue
<!-- views/modal.vue -->
<script setup lang="ts">
import { useModal } from '@gopowerteam/modal-render'
import Test1 from '../components/test1.vue'

const modal = useModal()

function onClick() {
  const instance = modal.open(
    Test1,
    { content: 'asdasd' },
    {
      mode: 'dialog',
      title: 'asdasd',
      footer: true,
      submitText: '提交',
      onOk({ close }) {
        console.log('确认')
        close()
      },
      onCancel() {
        console.log('取消')
      },
      bodyStyle: {
        padding: '20px',
      },
    },
  )

  instance.then((data) => {
    console.log('返回数据:', data)
  })
}
</script>

<template>
  <button @click="onClick">打开弹窗</button>
</template>
```

### 示例 2：抽屉模式

```ts
modal.open(
  MyComponent,
  {},
  {
    mode: 'drawer',
    position: 'right', // left, top, bottom
    title: '右侧抽屉',
    footer: true,
  },
)
```

### 示例 3：表单提交

```vue
<!-- 调用方：views/UserModal.vue -->
<script setup lang="ts">
import { useModal } from '@gopowerteam/modal-render'
import UserForm from '../components/UserForm.vue'

const modal = useModal()

function openUserForm() {
  modal.open(
    UserForm,
    {},
    {
      title: '编辑用户',
      footer: true,
      form: 'userForm',
      width: 600,
      onOk({ close }) {
        // 触发 form 提交，会调用 onSubmit 回调
        // 实际关闭在 onSubmit 中处理
      },
    },
  )
}
</script>

<template>
  <button @click="openUserForm">编辑用户</button>
</template>
```

```vue
<!-- 表单组件：components/UserForm.vue -->
<script setup lang="ts">
import type { FieldRule } from '@arco-design/web-vue'
import { Form as AForm } from '@arco-design/web-vue'
import { onSubmit } from '@gopowerteam/modal-render'
import { reactive } from 'vue'

const formModel = reactive({
  name: '',
  email: '',
})

const formRules: Record<string, FieldRule> = {
  name: { required: true, message: '姓名不能为空' },
  email: [
    { required: true, message: '邮箱不能为空' },
    { type: 'email', message: '请输入正确的邮箱格式' },
  ],
}

// 监听提交事件
onSubmit((modal) => {
  modal.showLoading()
  // 模拟提交
  setTimeout(() => {
    modal.close(formModel)
  }, 1000)
})
</script>

<template>
  <AForm :model="formModel" name="userForm" :rules="formRules">
    <AFormItem field="name" label="姓名">
      <AInput v-model="formModel.name" />
    </AFormItem>
    <AFormItem field="email" label="邮箱">
      <AInput v-model="formModel.email" />
    </AFormItem>
  </AForm>
</template>
```

### 示例 4：嵌套模态框

```vue
<!-- views/test1.vue -->
<script setup lang="ts">
import { useModal } from '@gopowerteam/modal-render'
import Test2 from '../components/test2.vue'

const modal = useModal()

function onOpen() {
  modal.open(Test2, {}, { footer: true })
}
</script>

<template>
  <AButton type="primary" @click="onOpen">打开</AButton>
</template>
```

```vue
<!-- components/test2.vue -->
<script setup lang="ts">
import { useModal } from '@gopowerteam/modal-render'

const modal = useModal()

function openNested() {
  // 嵌套打开另一个模态框
  modal.open(
    AnotherComponent,
    {},
    { title: '嵌套弹窗', footer: true },
  )
}
</script>

<template>
  <div>
    <p>这是第一个模态框</p>
    <button @click="openNested">打开嵌套</button>
  </div>
</template>
```

---

## 高级用法

### 全屏模式

```ts
modal.open(
  MyComponent,
  {},
  {
    fullscreen: true,
    title: '全屏模态框',
  },
)
```

### 可拖拽对话框

```ts
modal.open(
  MyComponent,
  {},
  {
    draggable: true,
    title: '可拖拽',
  },
)
```

### 自定义背景色

```ts
modal.open(
  MyComponent,
  {},
  {
    backgroundColor: '#f0f2f5',
    bodyStyle: { padding: '20px' },
  },
)
```

### ESC 键关闭

```ts
modal.open(
  MyComponent,
  {},
  {
    esc: true,
    closeable: true,
  },
)
```

### 点击遮罩关闭

```ts
modal.open(
  MyComponent,
  {},
  {
    maskClosable: true,
    title: '点击遮罩关闭',
  },
)
```

### 隐藏头部

```ts
modal.open(
  MyComponent,
  {},
  {
    header: false,
    footer: true,
    title: '无头部模态框',
  },
)
```

### 自定义尺寸

```ts
// 自定义宽度
modal.open(
  MyComponent,
  {},
  {
    width: 800,
    title: '固定宽度',
  },
)

// 自定义高度（抽屉模式）
modal.open(
  MyComponent,
  {},
  {
    mode: 'drawer',
    position: 'right',
    height: '80%',
    title: '自定义高度',
  },
)

// 使用预设尺寸
modal.open(
  MyComponent,
  {},
  {
    size: 'large',
    title: '大尺寸',
  },
)
```

### 挂载到 body

适用于模态框内容需要脱离当前容器上下文的场景：

```vue
<!-- App.vue -->
<ModalProvider :append-to-body="true">
  <RouterView />
</ModalProvider>
```

或者指定挂载位置：

```vue
<ModalProvider append-to-body="#modal-root">
  <App />
</ModalProvider>
```

### 示例：完整的表单提交流程

```vue
<!-- 调用方：ParentComponent.vue -->
<script setup lang="ts">
import { useModal } from '@gopowerteam/modal-render'
import UserForm from './UserForm.vue'

const modal = useModal()

function openForm() {
  modal.open(
    UserForm,
    {},
    {
      title: '新增用户',
      footer: true,
      form: 'userForm',
      width: 600,
      onOk({ close }) {
        // 点击确定时触发 form 提交，会调用 onSubmit 回调
        // 实际关闭在 onSubmit 中处理
      },
    },
  )
}
</script>

<template>
  <button @click="openForm">新增用户</button>
</template>
```

```vue
<!-- 表单组件：UserForm.vue -->
<script setup lang="ts">
import type { FieldRule } from '@arco-design/web-vue'
import { Form as AForm } from '@arco-design/web-vue'
import { onSubmit } from '@gopowerteam/modal-render'
import { reactive } from 'vue'

const formModel = reactive({
  name: '',
  email: '',
  phone: '',
})

const formRules: Record<string, FieldRule> = {
  name: { required: true, message: '请输入姓名' },
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ],
  phone: { required: true, message: '请输入手机号' },
}

// 监听表单提交
onSubmit((actions) => {
  actions.showLoading({ text: '提交中...' })
  
  // 模拟异步提交
  setTimeout(() => {
    console.log('表单数据:', formModel)
    actions.close(formModel)
  }, 1500)
})
</script>

<template>
  <AForm :model="formModel" name="userForm" :rules="formRules" layout="vertical">
    <AFormItem field="name" label="姓名">
      <AInput v-model="formModel.name" placeholder="请输入姓名" />
    </AFormItem>
    <AFormItem field="email" label="邮箱">
      <AInput v-model="formModel.email" placeholder="请输入邮箱" />
    </AFormItem>
    <AFormItem field="phone" label="手机号">
      <AInput v-model="formModel.phone" placeholder="请输入手机号" />
    </AFormItem>
  </AForm>
</template>
```

---

## 样式自定义

### CSS 变量

组件使用以下 CSS 变量，可通过覆盖全局样式自定义：

```css
:root {
  --color-border-1: rgb(232, 232, 232);
  --color-text-2: #4e5969;
  --color-fill-1: #f5f5f5;
  --color-fill-3: #e5e6eb;
  --color-fill-4: #c9cdd4;
  --primary-5: rgb(28, 76, 207);
  --primary-6: rgb(45, 106, 251);
  --primary-7: rgb(14, 66, 210);
}
```

### bodyStyle 属性

通过 `bodyStyle` 属性自定义内容区样式：

```ts
modal.open(
  MyComponent,
  {},
  {
    bodyStyle: {
      padding: '20px',
      backgroundColor: '#fff',
    },
  },
)
```

### 自定义主题

在全局样式中覆盖组件样式：

```css
.modal-header {
  background-color: #f5f7fa;
}

.modal-footer button.submit-button {
  background-color: #409eff;
}
```

---

## TypeScript 类型

### SizeOptions

```ts
interface SizeOptions {
  small: string | number
  middle: string | number
  large: string | number
}
```

### ShowLoadingOptions

```ts
interface ShowLoadingOptions {
  duration?: number  // 自动关闭时间（毫秒）
  text?: string      // 加载提示文字
}
```

### OpenModalOptions

```ts
interface OpenModalOptions {
  closeable?: boolean
  esc?: boolean
  mask?: boolean
  maskClosable?: boolean
  title?: string
  header?: boolean
  footer?: boolean
  width?: number | string
  height?: number | string
  size?: 'large' | 'middle' | 'small'
  fullscreen?: boolean
  draggable?: boolean
  form?: string
  mode?: 'dialog' | 'drawer'
  position?: 'top' | 'right' | 'bottom' | 'left'
  backgroundColor?: string
  bodyStyle?: CSSProperties
  submitText?: string
  cancelText?: string
  onOk?: (options: { close: () => void }) => void
  onCancel?: () => void
}
```

### ModalActions

```ts
interface ModalActions {
  open: (component: Component | 'confirm' | 'info' | 'warning' | 'error' | 'success', props?: Record<string, any>, options?: OpenModalOptions) => Promise<any> & { close: () => void }
  close: (id: string, data?: any) => void
  closeAll: () => void
  addEventListener: (id: string, event: 'submit', callback: (modal: ReturnType<typeof useModal>) => void) => void
  showLoading: (id?: string, options?: ShowLoadingOptions) => () => void
  hideLoading: (id?: string) => void
}
```

---

## FAQ

### 1. 为什么 useModal 报错 "Not Found Modal Provider Component"？

`useModal` 必须在 `ModalProvider` 组件内部调用，确保组件树中存在 Provider：

```vue
<!-- 正确 -->
<template>
  <ModalProvider>
    <App />
  </ModalProvider>
</template>
```

### 2. 如何在模态框内部关闭？

两种方式：

```ts
// 方式1：在 onOk 回调中调用 close
onOk({ close }) {
  close()
}

// 方式2：使用 useModal
const modal = useModal()
modal.close()
```

### 3. 如何阻止模态框关闭？

不调用 `close()` 方法即可阻止关闭：

```ts
onOk({ close }) {
  validate().then(() => {
    close() // 只有验证通过才关闭
  })
}
```

### 4. 支持 SSR 吗？

支持，内部通过 `clientMounted` 处理了 SSR 场景。

### 5. 如何自定义按钮样式？

两种方式：

```ts
// 方式1：自定义提交按钮文字
modal.open(Component, {}, {
  submitText: '保存',
  cancelText: '放弃',
})

// 方式2：完全自定义底部
modal.open(Component, {}, {
  footer: false, // 隐藏默认底部
})
```

然后在组件内使用 `ModalFooter` 插槽自定义：

```vue
<template>
  <div>
    <ModalFooter>
      <button @click="handleCancel">取消</button>
      <button @click="handleSave">保存</button>
    </ModalFooter>
  </div>
</template>
```

### 6. 多个模态框如何区分？

通过 `useModal()` 在不同组件中调用会自动定位到当前所在模态框，无需手动管理。

---

## 注意事项

1. **必须在 ModalProvider 内使用**：`useModal` 必须在 `ModalProvider` 组件树内调用
2. **样式文件导入**：记得在入口文件中导入 `dist/style.css`
3. **表单提交**：使用 `onSubmit` 时需要配合 `form` 属性指定表单 name
4. **Promise 行为**：调用 `close()` 时传入的数据会作为 Promise 的 resolve 值
5. **嵌套层级**：组件会自动处理多层嵌套，无需额外配置

---

## License

MIT
