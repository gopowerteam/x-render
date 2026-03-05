# @gopowerteam/form-render

基于 Vue 3 + Arco Design 的声明式表单渲染库，通过配置化的方式快速构建表单。

## 目录

- [速查表](#速查表)
  - [导出列表](#导出列表)
  - [FormRender Props 速查](#formrender-props-速查)
  - [FormRender Methods 速查](#formrender-methods-速查)
  - [FormRender Events 速查](#formrender-events-速查)
  - [字段类型速查](#字段类型速查)
  - [FormItemOptions 速查](#formitemoptions-速查)
- [快速开始](#快速开始)
- [表单布局](#表单布局)
- [表单字段类型](#表单字段类型)
  - [Input 输入框](#input-输入框)
  - [Textarea 文本域](#textarea-文本域)
  - [Select 选择器](#select-选择器)
  - [TreeSelect 树选择](#treeselect-树选择)
  - [Cascader 级联选择](#cascader-级联选择)
  - [Radio 单选框](#radio-单选框)
  - [Switch 开关](#switch-开关)
  - [Date 日期选择](#date-日期选择)
  - [DateRange 日期范围](#daterange-日期范围)
  - [Currency 金额输入](#currency-金额输入)
  - [Render 自定义渲染](#render-自定义渲染)
- [表单项配置](#表单项配置)
- [FormRender 组件](#formrender-组件)
- [useForm Hook](#useform-hook)
- [高级功能](#高级功能)
- [与 table-render 集成](#与-table-render-集成)
- [工具函数](#工具函数)
- [TypeScript 类型](#typescript-类型)
- [最佳实践](#最佳实践)

## 速查表

### 导出列表

| 导出名称 | 类型 | 说明 |
|----------|------|------|
| `defineForm` | 函数 | 定义表单配置，支持泛型 |
| `FormRender` | 组件 | 表单渲染组件 |
| `FormRenderInstance` | 类型 | 组件实例类型 |
| `useForm` | Hook | 通过 ref 获取表单实例 |
| `createFormSource` | 工具函数 | 手动创建表单数据源 |
| `FormRenderResolver` | 工具函数 | unplugin-vue-components 解析器 |
| `FormItemsOptions` | 类型 | 表单配置数组类型 |
| `FormItemOptions` | 类型 | 表单项配置类型 |
| `DataRecord` | 类型 | 通用数据记录类型 |

### FormRender Props 速查

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `form` | `FormItemsOptions<T>` | - | **必填**，表单配置数组 |
| `value` | `Record<string, any>` | - | 初始表单数据（非响应式） |
| `modelValue` | `Record<string, any>` | - | 初始表单数据（支持 v-model） |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 表单布局模式 |
| `columns` | `number` | 自动计算 | 固定列数 |
| `minWidth` | `number` | `400` | 每列最小宽度（px） |
| `name` | `string` | - | 表单 name 属性 |
| `id` | `string` | - | 表单 id 属性 |
| `collapsedMode` | `'append' \| 'dialog'` | `'append'` | 折叠模式 |
| `collapsedDialogColumns` | `number` | `2` | 弹窗模式列数 |
| `showFormResult` | `boolean` | dialog 模式为 true | 显示已选条件标签 |
| `submitable` | `boolean` | `false` | 显示提交/取消按钮 |
| `searchable` | `boolean` | `false` | 显示搜索/重置按钮 |
| `resetable` | `boolean` | `true` | 显示重置按钮 |
| `footer` | `boolean` | `false` | 操作按钮底部样式 |
| `rowGap` | `number` | `6` | 行间距（px） |
| `colGap` | `number` | `12` | 列间距（px） |

### FormRender Methods 速查

| 方法 | 签名 | 说明 |
|------|------|------|
| `formSource` | `Ref<DataRecord>` | 响应式表单数据 |
| `validate` | `() => Promise<void>` | 验证表单 |
| `reset` | `() => void` | 重置表单 |
| `updateFormField` | `(key: string, value: any) => void` | 更新单个字段 |
| `updateFormSource` | `(value: DataRecord) => void` | 更新整个表单 |

### FormRender Events 速查

| 事件 | 参数 | 说明 |
|------|------|------|
| `submit` | `formSource: Record<string, any>` | 表单提交时触发 |
| `cancel` | - | 点击取消按钮时触发 |
| `update:model-value` | `formSource: Record<string, any>` | 表单数据更新时触发 |

### 字段类型速查

| 类型 | 渲染方法 | 关键配置 | 常用场景 |
|------|----------|----------|----------|
| 输入框 | `r.input()` | `type`, `clearable`, `autoSubmit` | 文本/数字输入 |
| 文本域 | `r.textarea()` | `autosize`, `maxLength` | 多行文本 |
| 选择器 | `r.select()` | `options`, `multiple`, `cache` | 单选/多选下拉 |
| 树选择 | `r.treeSelect()` | `options`, `treeProps`, `fieldNames` | 树形数据选择 |
| 级联选择 | `r.cascader()` | `options`, `pathMode`, `multiple` | 级联数据选择 |
| 单选框 | `r.radio()` | `options`, `type: 'button'` | 单选按钮组 |
| 开关 | `r.switch()` | `openValue`, `closeValue`, `openLabel` | 布尔切换 |
| 日期 | `r.date()` | `type`, `showTime`, `shortcuts` | 日期/时间选择 |
| 日期范围 | `r.dateRange()` | `valueFormat`, `shortcuts` | 日期区间选择 |
| 金额 | `r.currency()` | `inputUnit`, `outputUnit`, `thousands` | 金额输入（支持单位转换） |
| 自定义 | `r.render()` | 自定义渲染函数 | 完全自定义字段 |

### FormItemOptions 速查

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `key` | `string` | - | **必填**，字段键名 |
| `title` | `string` | - | **必填**，字段标签 |
| `default` | `any \| (() => any)` | - | 默认值，支持函数 |
| `render` | `FormItemRender<T>` | - | **必填**，渲染函数 |
| `rule` | `FieldRule \| FieldRule[]` | - | 验证规则 |
| `visiable` | `boolean \| ((data: T) => boolean)` | `true` | 条件显隐 |
| `collapsed` | `boolean` | `false` | 折叠状态下隐藏 |
| `span` | `number` | `1` | 网格跨列数 |
| `hideLabel` | `boolean` | `false` | 隐藏字段标签 |
| `group` | `string \| string[]` | - | 分组（dialog 模式） |
| `labelStyle` | `CSSProperties` | - | 标签样式 |
| `contentStyle` | `CSSProperties` | - | 内容样式 |
| `mode` | `'component' \| 'text'` | `'component'` | 显示模式 |

---

## 快速开始

### 基础用法

```vue
<script setup lang="ts">
import { defineForm, FormRender } from '@gopowerteam/form-render'

interface UserForm {
  name: string
  email: string
  status: string
}

const form = defineForm<UserForm>([
  {
    key: 'name',
    title: '姓名',
    render: r => r.input({ placeholder: '请输入姓名', clearable: true }),
  },
  {
    key: 'email',
    title: '邮箱',
    render: r => r.input({ placeholder: '请输入邮箱' }),
  },
  {
    key: 'status',
    title: '状态',
    render: r => r.select({
      options: new Map([['1', '启用'], ['0', '禁用']]),
      clearable: true,
    }),
  },
])

const handleSubmit = (data: UserForm) => {
  console.log('表单数据:', data)
}
</script>

<template>
  <FormRender
    :form="form"
    searchable
    @submit="handleSubmit"
  />
</template>
```

### defineForm 配置函数

`defineForm` 是一个类型安全的表单配置函数，支持泛型参数：

```typescript
interface User {
  name: string
  age: number
}

// 使用泛型获得类型提示
const form = defineForm<User>([
  {
    key: 'name',  // 自动推导为 'name' | 'age'
    title: '姓名',
    render: r => r.input(),
  },
  {
    key: 'age',
    title: '年龄',
    render: r => r.input({ type: 'number' }),
  },
])
```

## 表单布局

### 布局模式

支持 `horizontal`（水平）和 `vertical`（垂直）两种布局：

```vue
<!-- 水平布局（默认） -->
<FormRender :form="form" layout="horizontal" />

<!-- 垂直布局 -->
<FormRender :form="form" layout="vertical" />
```

### 响应式列布局

表单会根据容器宽度自动计算列数：

```vue
<!-- 自动计算列数，每列最小宽度 400px -->
<FormRender :form="form" :min-width="400" />

<!-- 固定 2 列 -->
<FormRender :form="form" :columns="2" />
```

### 折叠模式

当表单字段较多时，可以使用折叠模式隐藏部分字段：

#### append 模式（默认）

点击"展开/收起"按钮，在原位置展开更多字段：

```vue
<FormRender
  :form="form"
  collapsed-mode="append"
  searchable
/>
```

#### dialog 模式

点击"高级搜索"按钮，在弹窗中显示更多字段：

```vue
<FormRender
  :form="form"
  collapsed-mode="dialog"
  :collapsed-dialog-columns="2"
  searchable
/>
```

配置字段为折叠状态：

```typescript
const form = defineForm([
  {
    key: 'name',
    title: '姓名',
    // 此字段在折叠状态下隐藏
    collapsed: true,
    render: r => r.input(),
  },
])
```

### 表单间距

```vue
<FormRender
  :form="form"
  :row-gap="6"
  :col-gap="12"
/>
```

## 表单字段类型

### Input 输入框

```typescript
interface RenderInputItemOptions {
  placeholder?: string
  clearable?: boolean
  readonly?: boolean
  autoSubmit?: boolean
  type?: 'string' | 'number'
}
```

**基础用法：**

```typescript
const form = defineForm([
  {
    key: 'name',
    title: '姓名',
    render: r => r.input({ placeholder: '请输入姓名' }),
  },
])
```

**数字输入：**

```typescript
{
  key: 'age',
  title: '年龄',
  render: r => r.input({ type: 'number', placeholder: '请输入年龄' }),
}
```

**自动提交：**

```typescript
{
  key: 'keyword',
  title: '关键词',
  render: r => r.input({ autoSubmit: true, clearable: true }),
}
```

### Textarea 文本域

```typescript
interface RenderTextareaItemOptions {
  placeholder?: string
  rows?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  autosize?: { minRows: number, maxRows: number }
  maxLength?: number
}
```

**基础用法：**

```typescript
const form = defineForm([
  {
    key: 'description',
    title: '描述',
    render: r => r.textarea({ placeholder: '请输入描述' }),
  },
])
```

**自适应高度：**

```typescript
{
  key: 'content',
  title: '内容',
  render: r => r.textarea({
    autosize: { minRows: 3, maxRows: 6 },
    maxLength: 500,
  }),
}
```

### Select 选择器

```typescript
interface RenderSelectItemOptions {
  placeholder?: string
  clearable?: boolean
  searchable?: boolean
  createable?: boolean
  options: SelectOptions | (() => SelectOptions) | (() => Promise<SelectOptions>) | Ref<SelectOptions>
  multiple?: boolean
  maxTagCount?: number
  default?: string | number | boolean
  autoSubmit?: boolean
  cache?: boolean
  onChange?: (value) => void
}

type SelectOptions = Map<string | number | boolean, string>
```

**静态选项：**

```typescript
const form = defineForm([
  {
    key: 'status',
    title: '状态',
    render: r => r.select({
      options: new Map([['1', '启用'], ['0', '禁用']]),
      clearable: true,
    }),
  },
])
```

**多选：**

```typescript
{
  key: 'tags',
  title: '标签',
  render: r => r.select({
    multiple: true,
    options: new Map([['vue', 'Vue'], ['react', 'React'], ['angular', 'Angular']]),
  }),
}
```

**异步选项：**

```typescript
const loadOptions = () => {
  return Promise.resolve(new Map([['a', '选项A'], ['b', '选项B']]))
}

{
  key: 'category',
  title: '分类',
  render: r => r.select({
    options: loadOptions,
    cache: true,  // 开启缓存，避免重复请求
  }),
}
```

**响应式选项：**

```typescript
import { ref } from 'vue'

const options = ref(new Map([['a', '选项A']]))

// 动态更新选项
setTimeout(() => {
  options.value = new Map([['b', '选项B'], ['c', '选项C']])
}, 3000)

{
  key: 'type',
  title: '类型',
  render: r => r.select({ options }),
}
```

### TreeSelect 树选择

```typescript
interface RenderTreeSelectItemOptions {
  placeholder?: string
  clearable?: boolean
  searchable?: boolean
  fieldNames?: TreeFieldNames
  options: TreeNodeData[] | (() => ...) | Ref<...>
  multiple?: boolean
  maxTagCount?: number
  default?: string | number | boolean
  autoSubmit?: boolean
  cache?: boolean
  treeProps?: Partial<TreeProps>
  treeCheckStrictly?: boolean
  treeCheckedStrategy?: 'all' | 'parent' | 'child'
  slots?: Record<string, (data?: TreeNodeData) => JSX.Element>
}
```

**基础用法：**

```typescript
const form = defineForm([
  {
    key: 'department',
    title: '部门',
    render: r => r.treeSelect({
      options: [
        {
          key: '1',
          title: '技术部',
          children: [
            { key: '1-1', title: '前端组' },
            { key: '1-2', title: '后端组' },
          ],
        },
        {
          key: '2',
          title: '产品部',
        },
      ],
    }),
  },
])
```

**自定义字段映射：**

```typescript
{
  key: 'org',
  title: '组织',
  render: r => r.treeSelect({
    fieldNames: { key: 'id', title: 'name', children: 'children' },
    options: [{ id: '1', name: '组织A', children: [] }],
  }),
}
```

**使用插槽：**

```typescript
{
  key: 'category',
  title: '分类',
  render: r => r.treeSelect({
    options: treeOptions,
    slots: {
      'tree-slot-title': (data) => <div>{data.title}</div>,
      'footer': () => <div>自定义底部</div>,
    },
  }),
}
```

### Cascader 级联选择

```typescript
interface RenderCascaderItemOptions {
  placeholder?: string
  clearable?: boolean
  searchable?: boolean
  pathMode?: boolean
  options: CascaderOption[] | (() => ...) | Ref<...>
  multiple?: boolean
  maxTagCount?: number
  default?: string | number | boolean
  autoSubmit?: boolean
  checkStrictly?: boolean
  triggerProps?: TriggerProps
  cache?: boolean
}
```

**基础用法：**

```typescript
const form = defineForm([
  {
    key: 'region',
    title: '地区',
    render: r => r.cascader({
      options: [
        {
          value: 'beijing',
          label: '北京',
          children: [
            { value: 'chaoyang', label: '朝阳区' },
            { value: 'haidian', label: '海淀区' },
          ],
        },
        {
          value: 'shanghai',
          label: '上海',
          children: [
            { value: 'pudong', label: '浦东新区' },
          ],
        },
      ],
    }),
  },
])
```

**路径模式：**

```typescript
{
  key: 'address',
  title: '地址',
  render: r => r.cascader({
    pathMode: true,  // 返回路径数组 ['beijing', 'chaoyang']
    multiple: true,
    options: addressOptions,
  }),
}
```

**异步加载：**

```typescript
const loadOptions = () => {
  return Promise.resolve([
    { value: '1', label: '选项1', children: [] },
  ])
}

{
  key: 'category',
  title: '分类',
  render: r => r.cascader({
    options: loadOptions,
    cache: true,
  }),
}
```

### Radio 单选框

```typescript
interface RenderRadioItemOptions {
  options: RadioOptions | (() => RadioOptions) | Ref<RadioOptions>
  type?: 'radio' | 'button'
  size?: 'mini' | 'small' | 'medium' | 'large'
  default?: string | number
  autoSubmit?: boolean
  cache?: boolean
  onChange?: (value: string | number) => void
}

type RadioOptions = Map<string | number, string>
```

**基础用法：**

```typescript
const form = defineForm([
  {
    key: 'gender',
    title: '性别',
    render: r => r.radio({
      options: new Map([['male', '男'], ['female', '女']]),
    }),
  },
])
```

**按钮样式：**

```typescript
{
  key: 'status',
  title: '状态',
  render: r => r.radio({
    type: 'button',
    size: 'large',
    options: new Map([['1', '启用'], ['0', '禁用']]),
    autoSubmit: true,
  }),
}
```

### Switch 开关

```typescript
interface RenderSwitchItemOptions {
  size?: 'small' | 'medium'
  openLabel?: string       // 默认: '是'
  closeLabel?: string      // 默认: '否'
  openValue?: string | number | boolean   // 默认: true
  closeValue?: string | number | boolean  // 默认: false
  default?: string | number | boolean
  autoSubmit?: boolean
}
```

**基础用法：**

```typescript
const form = defineForm([
  {
    key: 'enabled',
    title: '启用',
    default: false,
    render: r => r.switch(),
  },
])
```

**自定义值和标签：**

```typescript
{
  key: 'status',
  title: '状态',
  render: r => r.switch({
    openLabel: '开启',
    closeLabel: '关闭',
    openValue: 1,
    closeValue: 0,
  }),
}
```

### Date 日期选择

```typescript
interface RenderDateItemOptions {
  placeholder?: string
  clearable?: boolean
  disabledDate?: (value: string, date: Date) => boolean
  type?: 'date' | 'year' | 'quarter' | 'month' | 'week'
  valueFormat?: string
  labelFormat?: string
  shortcuts?: ShortcutType[]
  showTime?: boolean
  onChange?: (value: string | number | Date | undefined) => void
  autoSubmit?: boolean
}
```

**日期选择：**

```typescript
const form = defineForm([
  {
    key: 'birthday',
    title: '出生日期',
    render: r => r.date({ type: 'date' }),
  },
])
```

**日期时间选择：**

```typescript
{
  key: 'createdAt',
  title: '创建时间',
  render: r => r.date({ showTime: true }),
}
```

**年/月/季度/周选择：**

```typescript
{
  key: 'year',
  title: '年份',
  render: r => r.date({ type: 'year' }),
}
{
  key: 'month',
  title: '月份',
  render: r => r.date({ type: 'month' }),
}
{
  key: 'quarter',
  title: '季度',
  render: r => r.date({ type: 'quarter' }),
}
{
  key: 'week',
  title: '周',
  render: r => r.date({ type: 'week' }),
}
```

**禁用日期：**

```typescript
{
  key: 'date',
  title: '日期',
  render: r => r.date({
    disabledDate: (value, date) => {
      return date > new Date()  // 禁用未来日期
    },
  }),
}
```

### DateRange 日期范围

```typescript
interface RenderDateRangeItemOptions {
  placeholder?: string[]
  clearable?: boolean
  multiple?: boolean
  type?: 'date' | 'year' | 'quarter' | 'month' | 'week'
  valueFormat?: string       // 默认: 'YYYY-MM-DD HH:mm:ss'
  labelFormat?: string
  disabledDate?: (value: string[], date: Date) => boolean
  shortcuts?: ShortcutType[]
  onChange?: (value: string[] | undefined) => void
  autoSubmit?: boolean
}
```

**基础用法：**

```typescript
const form = defineForm([
  {
    key: 'dateRange',
    title: '日期范围',
    render: r => r.dateRange(),
  },
])
```

**自定义格式：**

```typescript
{
  key: 'dateRange',
  title: '日期范围',
  render: r => r.dateRange({
    valueFormat: 'YYYY-MM-DD',
    labelFormat: 'YYYY年MM月DD日',
    autoSubmit: true,
  }),
}
```

**自定义快捷选项：**

```typescript
{
  key: 'dateRange',
  title: '日期范围',
  render: r => r.dateRange({
    shortcuts: [
      {
        label: '最近7天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 7 * 24 * 3600 * 1000)
          return [start, end]
        },
      },
    ],
  }),
}
```

### Currency 金额输入

```typescript
interface RenderCurrencyOptions {
  placeholder?: string
  clearable?: boolean
  readonly?: boolean
  prefix?: string | (() => JSX.Element)
  suffix?: string | (() => JSX.Element)
  thousands?: boolean     // 默认: true
  precision?: number
  inputUnit?: '分' | '元' | '万'   // 默认: '元'
  outputUnit?: '分' | '元' | '万'  // 默认: '元'
}
```

**基础用法：**

```typescript
const form = defineForm([
  {
    key: 'price',
    title: '价格',
    render: r => r.currency(),
  },
])
```

**单位转换（分转元）：**

```typescript
{
  key: 'amount',
  title: '金额',
  render: r => r.currency({
    inputUnit: '元',     // 输入时显示单位
    outputUnit: '分',    // 输出时转换为单位
    precision: 2,
  }),
}
```

**千分位显示：**

```typescript
{
  key: 'total',
  title: '总额',
  render: r => r.currency({
    thousands: true,
    suffix: '元',
  }),
}
```

### Render 自定义渲染

```typescript
interface RenderInputItemOptions<T> {
  (record: T, form?: FormItemOptions<T>): JSX.Element
}
```

**自定义渲染：**

```typescript
const form = defineForm([
  {
    key: 'custom',
    title: '自定义字段',
    render: r => r.render((data, form) => {
      return (
        <div class="flex gap-2">
          <AInput v-model={data.custom} />
          <AButton>按钮</AButton>
        </div>
      )
    }),
  },
])
```

## 表单项配置

### FormItemOptions 接口

```typescript
interface FormItemOptions<T = Record<string, any>> {
  key: keyof T | string       // 字段键名
  title: string               // 字段标签
  default?: any | (() => any) | (() => Promise<any>)  // 默认值
  collapsed?: boolean         // 是否在折叠状态下隐藏
  group?: string | string[]   // 分组（用于 dialog 模式的 tab 分组）
  visiable?: boolean | ((record: T) => boolean)  // 条件显隐
  span?: number               // 网格跨列数
  hideLabel?: boolean         // 隐藏标签
  labelStyle?: CSSProperties  // 标签样式
  contentStyle?: CSSProperties // 内容样式
  rule?: FieldRule | FieldRule[]  // 验证规则
  mode?: 'component' | 'text' // 显示模式
  render?: FormItemRender<T>  // 渲染函数
}
```

### 配置项说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `key` | `string` | - | 字段键名，对应表单数据中的属性名 |
| `title` | `string` | - | 字段标签文本 |
| `default` | `any \| (() => any)` | - | 默认值，支持函数形式 |
| `collapsed` | `boolean` | `false` | 在折叠模式下隐藏此字段 |
| `group` | `string \| string[]` | - | 字段分组，用于弹窗模式的 tab 切换 |
| `visiable` | `boolean \| ((record) => boolean)` | `true` | 条件显隐，支持响应式函数 |
| `span` | `number` | `1` | 网格跨列数 |
| `hideLabel` | `boolean` | `false` | 隐藏字段标签 |
| `labelStyle` | `CSSProperties` | - | 标签自定义样式 |
| `contentStyle` | `CSSProperties` | - | 内容区域自定义样式 |
| `rule` | `FieldRule \| FieldRule[]` | - | 表单验证规则 |
| `mode` | `'component' \| 'text'` | `'component'` | 显示模式，text 模式用于只读展示 |
| `render` | `FormItemRender<T>` | - | 字段渲染函数 |

### 条件显隐

```typescript
const form = defineForm([
  {
    key: 'type',
    title: '类型',
    render: r => r.select({
      options: new Map([['1', '类型A'], ['2', '类型B']]),
    }),
  },
  {
    key: 'extra',
    title: '额外信息',
    // 当 type 为 '1' 时才显示
    visiable: (data) => data.type === '1',
    render: r => r.input(),
  },
])
```

### 字段跨度

```typescript
const form = defineForm([
  {
    key: 'title',
    title: '标题',
    span: 2,  // 跨 2 列
    render: r => r.input(),
  },
  {
    key: 'content',
    title: '内容',
    span: 2,  // 跨 2 列
    render: r => r.textarea(),
  },
])
```

### 字段分组

用于 `dialog` 折叠模式下的 tab 分组：

```typescript
const form = defineForm([
  {
    key: 'name',
    title: '姓名',
    group: ['基本信息'],  // 属于"基本信息"分组
    render: r => r.input(),
  },
  {
    key: 'address',
    title: '地址',
    group: ['联系方式'],  // 属于"联系方式"分组
    render: r => r.input(),
  },
])
```

## FormRender 组件

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `form` | `FormItemsOptions<T>` | - | **必填**，表单配置数组 |
| `value` | `Record<string, any>` | - | 初始表单数据（非响应式） |
| `modelValue` | `Record<string, any>` | - | 初始表单数据（支持 v-model） |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 表单布局 |
| `columns` | `number` | 自动计算 | 固定列数 |
| `minWidth` | `number` | `400` | 每列最小宽度（用于自动计算列数） |
| `name` | `string` | - | 表单 name 属性 |
| `id` | `string` | - | 表单 id 属性 |
| `collapsedMode` | `'append' \| 'dialog'` | `'append'` | 折叠模式 |
| `collapsedDialogColumns` | `number` | `2` | 弹窗模式的列数 |
| `showFormResult` | `boolean` | dialog 模式为 `true` | 显示已选条件标签 |
| `submitable` | `boolean` | `false` | 显示提交/取消按钮 |
| `searchable` | `boolean` | `false` | 显示搜索/重置按钮 |
| `resetable` | `boolean` | `true` | 显示重置按钮 |
| `footer` | `boolean` | `false` | 操作按钮使用底部样式 |
| `rowGap` | `number` | `6` | 行间距 |
| `colGap` | `number` | `12` | 列间距 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `submit` | `formSource: Record<string, any>` | 表单提交时触发 |
| `cancel` | - | 点击取消按钮时触发 |
| `update:model-value` | `formSource: Record<string, any>` | 表单数据更新时触发 |

### Expose Methods

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `formSource` | - | `Ref<DataRecord>` | 响应式表单数据 |
| `updateFormField` | `(key: string, value: any)` | `void` | 更新单个字段 |
| `updateFormSource` | `(value: DataRecord)` | `void` | 更新整个表单 |
| `reset` | - | `void` | 重置表单 |
| `validate` | - | `Promise` | 验证表单 |

### Slots

| 插槽 | 说明 |
|------|------|
| `actions` | 自定义操作按钮 |

### 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { defineForm, FormRender } from '@gopowerteam/form-render'

const formRef = ref()
const formData = ref({ name: '初始值' })

const form = defineForm([
  { key: 'name', title: '姓名', render: r => r.input() },
])

const handleSubmit = (data) => {
  console.log('提交:', data)
}

const handleValidate = async () => {
  try {
    await formRef.value?.validate()
    console.log('验证通过')
  } catch (errors) {
    console.log('验证失败:', errors)
  }
}

const handleReset = () => {
  formRef.value?.reset()
}
</script>

<template>
  <FormRender
    ref="formRef"
    :form="form"
    v-model="formData"
    searchable
    @submit="handleSubmit"
  >
    <template #actions>
      <AButton @click="handleValidate">验证</AButton>
      <AButton @click="handleReset">重置</AButton>
    </template>
  </FormRender>
</template>
```

## useForm Hook

通过 `useForm` 获取表单实例的引用：

```typescript
import { useForm } from '@gopowerteam/form-render'

const form = useForm('formRef')

// 访问表单数据
console.log(form.value.formSource)

// 更新字段
form.value.updateFormField('name', '新值')

// 重置表单
form.value.reset()

// 验证表单
await form.value.validate()
```

### 完整示例

```vue
<script setup lang="ts">
import { defineForm, FormRender, useForm } from '@gopowerteam/form-render'

const form = defineForm([
  { key: 'name', title: '姓名', render: r => r.input() },
  { key: 'status', title: '状态', render: r => r.select({ options: new Map() }) },
])

const formRef = useForm('myForm')

const updateName = () => {
  formRef.value.updateFormField('name', '新名字')
}

const getFormData = () => {
  console.log(formRef.value.formSource)
}
</script>

<template>
  <FormRender ref="myForm" :form="form" searchable />
  <AButton @click="updateName">更新姓名</AButton>
  <AButton @click="getFormData">获取数据</AButton>
</template>
```

## 高级功能

### 表单验证

使用 Arco Design 的 `FieldRule` 进行验证：

```typescript
import type { FieldRule } from '@arco-design/web-vue'

const form = defineForm([
  {
    key: 'name',
    title: '姓名',
    rule: [{ required: true, message: '请输入姓名' }],
    render: r => r.input(),
  },
  {
    key: 'email',
    title: '邮箱',
    rule: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '邮箱格式不正确' },
    ],
    render: r => r.input(),
  },
  {
    key: 'password',
    title: '密码',
    rule: [
      { required: true, message: '请输入密码' },
      { minLength: 6, message: '密码至少6位' },
    ],
    render: r => r.input(),
  },
])
```

**自定义验证器：**

```typescript
{
  key: 'confirmPassword',
  title: '确认密码',
  rule: [
    {
      validator: (value, callback) => {
        if (value !== formData.password) {
          callback('两次密码不一致')
        } else {
          callback()
        }
      },
    },
  ],
  render: r => r.input(),
}
```

### 动态显隐

基于表单数据动态控制字段显隐：

```typescript
const form = defineForm([
  {
    key: 'type',
    title: '类型',
    render: r => r.radio({
      type: 'button',
      options: new Map([['personal', '个人'], ['company', '企业']]),
    }),
  },
  {
    key: 'companyName',
    title: '公司名称',
    visiable: (data) => data.type === 'company',
    rule: [{ required: true, message: '请输入公司名称' }],
    render: r => r.input(),
  },
  {
    key: 'idCard',
    title: '身份证号',
    visiable: (data) => data.type === 'personal',
    render: r => r.input(),
  },
])
```

### 异步选项加载

支持 Promise 形式的异步选项：

```typescript
// 模拟 API 请求
const fetchOptions = () => {
  return new Promise<Map<string, string>>((resolve) => {
    setTimeout(() => {
      resolve(new Map([
        ['1', '选项1'],
        ['2', '选项2'],
        ['3', '选项3'],
      ]))
    }, 1000)
  })
}

const form = defineForm([
  {
    key: 'category',
    title: '分类',
    render: r => r.select({
      options: fetchOptions,
      cache: true,  // 开启缓存
    }),
  },
])
```

### 自动提交

字段值变化后自动触发表单提交：

```typescript
const form = defineForm([
  {
    key: 'keyword',
    title: '关键词',
    render: r => r.input({ autoSubmit: true }),
  },
  {
    key: 'status',
    title: '状态',
    render: r => r.select({
      options: statusOptions,
      autoSubmit: true,  // 选择后立即提交
    }),
  },
])
```

### 搜索结果展示

在 `dialog` 模式下，可以显示已选择的搜索条件：

```vue
<FormRender
  :form="form"
  collapsed-mode="dialog"
  :show-form-result="true"
  searchable
  @submit="handleSearch"
/>
```

## 与 table-render 集成

`form-render` 可以与 `@gopowerteam/table-render` 配合使用，作为表格的搜索表单：

```vue
<script setup lang="ts">
import { defineForm } from '@gopowerteam/form-render'
import { defineColumns, defineTableLoad, useTable, TableRender } from '@gopowerteam/table-render'

// 定义搜索表单
const form = defineForm([
  {
    key: 'keyword',
    title: '关键词',
    hideLabel: true,
    render: r => r.input({ placeholder: '请输入关键词', autoSubmit: true }),
  },
  {
    key: 'status',
    title: '状态',
    hideLabel: true,
    render: r => r.select({
      options: new Map([['1', '启用'], ['0', '禁用']]),
      clearable: true,
      autoSubmit: true,
    }),
  },
  {
    key: 'dateRange',
    title: '日期',
    hideLabel: true,
    collapsed: true,
    render: r => r.dateRange(),
  },
])

// 定义表格列
const columns = defineColumns([
  { key: 'name', title: '名称' },
  { key: 'status', title: '状态' },
  { key: 'createdAt', title: '创建时间' },
])

// 定义数据加载
const table = useTable('tableRef')
const onTableLoad = defineTableLoad(async ({ form, update, page }) => {
  const res = await fetch('/api/list', {
    method: 'POST',
    body: JSON.stringify({ ...form, page }),
  })
  const data = await res.json()
  update(data.list)
  page.total = data.total
})
</script>

<template>
  <TableRender
    ref="tableRef"
    :form="form"
    :form-options="{ minWidth: 300 }"
    :columns="columns"
    :data-load="onTableLoad"
    collapsable
    pageable
    searchable
  />
</template>
```

### 通过 table 实例访问表单

```typescript
const table = useTable('tableRef')

// 获取表单数据
console.log(table.value.formSource)

// 更新表单字段
table.value.formInstance?.updateFormField('status', '1')

// 重置表单
table.value.formInstance?.reset()
```

## 工具函数

### createFormSource

手动创建表单数据源：

```typescript
import { createFormSource } from '@gopowerteam/form-render'

const form = defineForm([
  { key: 'name', title: '姓名', default: '默认名' },
  { key: 'age', title: '年龄', default: 18 },
])

// 创建响应式数据源
const [formSource, updateFormSource] = createFormSource(form, { name: '初始名' })

console.log(formSource.value)  // { name: '初始名', age: 18 }

// 更新数据
updateFormSource({ name: '新名字', age: 20 })
```

### FormRenderResolver

用于 `unplugin-vue-components` 自动导入：

```typescript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { FormRenderResolver } from '@gopowerteam/form-render'

export default {
  plugins: [
    Components({
      resolvers: [FormRenderResolver()],
    }),
  ],
}
```

## TypeScript 类型

### 导出的类型

```typescript
// 核心类型
export type { DataRecord, DataProp } from './interfaces'
export type { FormItemsOptions, FormItemOptions, FormItemRender, FormItemRenderFun, FormItemRenderReturn } from './interfaces'

// 组件实例
export type { FormRenderInstance } from './form-render'

// 字段选项类型
export type { RenderInputItemOptions } from './form-items/input'
export type { RenderTextareaItemOptions } from './form-items/textarea'
export type { RenderSelectItemOptions, SelectOptions } from './form-items/select'
export type { RenderTreeSelectItemOptions } from './form-items/tree-select'
export type { RenderCascaderItemOptions } from './form-items/cascader'
export type { RenderRadioItemOptions, RadioOptions } from './form-items/radio'
export type { RenderSwitchItemOptions } from './form-items/switch'
export type { RenderDateItemOptions } from './form-items/date'
export type { RenderDateRangeItemOptions } from './form-items/date-range'
export type { RenderCurrencyOptions } from './form-items/currency'
```

### 泛型使用

```typescript
interface UserFormData {
  name: string
  email: string
  age: number
}

// 使用泛型获得完整的类型提示
const form = defineForm<UserFormData>([
  {
    key: 'name',  // 类型为 'name' | 'email' | 'age'
    title: '姓名',
    render: r => r.input(),
  },
])

// 组件 Props 类型
const props = defineProps<{
  form: FormItemsOptions<UserFormData>
}>()

// 实例类型
const formRef = ref<FormRenderInstance>()
```

## 最佳实践

### 1. 使用 TypeScript 泛型

始终使用泛型参数获得类型提示：

```typescript
// ✅ 推荐
interface FormData { name: string }
const form = defineForm<FormData>([...])

// ❌ 不推荐
const form = defineForm([...])
```

### 2. 提取选项配置

将复杂的选项配置提取为常量：

```typescript
const STATUS_OPTIONS = new Map([
  ['1', '启用'],
  ['0', '禁用'],
])

const form = defineForm([
  {
    key: 'status',
    title: '状态',
    render: r => r.select({ options: STATUS_OPTIONS }),
  },
])
```

### 3. 合理使用 autoSubmit

在搜索表单中，对常用筛选条件开启自动提交：

```typescript
{
  key: 'status',
  title: '状态',
  render: r => r.select({
    options: STATUS_OPTIONS,
    autoSubmit: true,  // 选择后立即搜索
  }),
}
```

### 4. 使用 hideLabel 优化搜索表单

搜索表单中可以隐藏标签以节省空间：

```typescript
const form = defineForm([
  {
    key: 'keyword',
    title: '关键词',
    hideLabel: true,
    render: r => r.input({ placeholder: '请输入关键词' }),
  },
])
```

### 5. 异步选项使用缓存

避免重复请求相同的选项数据：

```typescript
{
  key: 'category',
  title: '分类',
  render: r => r.select({
    options: fetchCategories,
    cache: true,  // 开启缓存
  }),
}
```

### 6. 合理使用折叠模式

对于字段较多的表单，使用折叠模式提升用户体验：

```typescript
const form = defineForm([
  { key: 'keyword', title: '关键词', render: r => r.input() },
  { key: 'status', title: '状态', render: r => r.select({ options: STATUS_OPTIONS }) },
  // 以下字段默认折叠
  { key: 'dateRange', title: '日期范围', collapsed: true, render: r => r.dateRange() },
  { key: 'category', title: '分类', collapsed: true, render: r => r.select({ options: [] }) },
])
```

## License

MIT
