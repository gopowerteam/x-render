# @gopowerteam/table-render

基于 Vue 3 和 Arco Design Vue 的高性能表格渲染组件，提供开箱即用的列渲染器、数据加载、分页、排序、筛选、导出等功能。

---

## 📑 目录

### 🤖 AI Agent 快速参考区（优先阅读）

- [TL;DR - 30秒快速理解](#tldr---30秒快速理解)
- [⚡ 最小化模板](#最小化模板)
- [📊 API 速查表](#api-速查表)
  - [Props 速查](#props-速查)
  - [Methods 速查](#methods-速查)
  - [Events 速查](#events-速查)
  - [Types 速查](#types-速查)
- [✅ 常见任务速查](#常见任务速查)
- [🌳 功能决策树](#功能决策树)
- [🔍 关键词索引](#关键词索引)

### 📚 详细文档区

- [✨ 特性](#特性)
- [📦 安装](#安装)
- [🚀 快速开始](#快速开始)
- [📖 核心概念](#核心概念)
- [🎨 列渲染器](#列渲染器)
  - [文本渲染器 (text)](#文本渲染器-text)
  - [字典渲染器 (dict)](#字典渲染器-dict)
  - [标签渲染器 (tag)](#标签渲染器-tag)
  - [电话渲染器 (phone)](#电话渲染器-phone)
  - [图片渲染器 (image)](#图片渲染器-image)
  - [货币渲染器 (currency)](#货币渲染器-currency)
  - [日期渲染器 (date)](#日期渲染器-date)
  - [进度条渲染器 (progress)](#进度条渲染器-progress)
  - [序号渲染器 (serial)](#序号渲染器-serial)
  - [按钮渲染器 (button)](#按钮渲染器-button)
  - [下拉菜单渲染器 (dropdown)](#下拉菜单渲染器-dropdown)
  - [自定义渲染器 (render)](#自定义渲染器-render)
- [🔧 功能特性](#功能特性)
  - [分页 (Pagination)](#分页-pagination)
  - [排序 (Sorting)](#排序-sorting)
  - [筛选 (Filtering)](#筛选-filtering)
  - [行选择 (Selection)](#行选择-selection)
  - [拖拽排序 (Draggable)](#拖拽排序-draggable)
  - [导出 (Export)](#导出-export)
  - [列折叠 (Collapsable)](#列折叠-collapsable)
  - [虚拟滚动 (Virtual List)](#虚拟滚动-virtual-list)
  - [自适应高度](#自适应高度)
- [🎓 高级用法](#高级用法)
  - [表单集成](#表单集成)
  - [预览与编辑](#预览与编辑)
  - [自定义列渲染器](#自定义列渲染器)
  - [性能优化](#性能优化)
  - [手动触发加载](#手动触发加载)
- [📚 API 参考](#api-参考)
- [💡 最佳实践](#最佳实践)
- [🔧 故障排查](#故障排查)

---

## 🎯 TL;DR - 30秒快速理解

> 💡 **给 AI Agent**: 以下是组件的核心信息，用于快速理解

### 组件定位
`@gopowerteam/table-render` 是基于 **Vue 3** 和 **Arco Design Vue** 的高性能表格渲染组件

### 核心能力矩阵

| 能力类别 | 具体功能 | 关键 API |
|---------|---------|---------|
| **数据渲染** | 12+ 列渲染器 | `render: r => r.text()` |
| **数据加载** | 同步/异步加载 | `defineTableLoad()` |
| **数据交互** | 分页、排序、筛选、选择 | `pageable`, `sortable`, `form`, `selection` |
| **数据导出** | Excel 导出 | `exportable`, `export()` |
| **数据编辑** | 预览、编辑模式 | `preview()`, `edit()` |
| **性能优化** | 虚拟滚动、自适应 | `virtualList`, `autoFill` |

### 依赖关系图

```
@gopowerteam/table-render
  ├─ vue: ^3.0.0                      (必需)
  ├─ @arco-design/web-vue: ^2.56.3    (必需)
  ├─ @gopowerteam/form-render: ^1.0.0 (可选，搜索功能)
  ├─ @gopowerteam/modal-render: ^1.0.0 (可选，预览/编辑)
  └─ exceljs: ^4.4.0                  (可选，导出功能)
```

### 快速识别关键 API

| 看到这个 | 它是 | 用途 |
|---------|------|------|
| `<TableRender>` | 组件 | 表格渲染容器 |
| `defineColumns()` | 函数 | 定义列配置 |
| `defineTableLoad()` | 函数 | 定义数据加载 |
| `useTable()` | Hook | 获取表格实例 |
| `r => r.text()` | 渲染器 | 列渲染函数 |
| `pageable` | Prop | 启用分页 |
| `selection` | Prop | 启用行选择 |

### 一句话总结
**"12+ 渲染器 + 完整数据交互 + 开箱即用"**

---

## ⚡ 最小化模板

> 💡 **给 AI Agent**: 以下是最小可运行的代码模板，可直接复制使用

### 模板1: 基础表格（10行代码）

**适用场景**: 简单数据展示

```vue
<script setup lang="ts">
import { defineColumns, defineTableLoad, TableRender } from '@gopowerteam/table-render'

// 步骤1: 定义列
const columns = defineColumns([
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' }
])

// 步骤2: 定义数据加载
const dataLoad = defineTableLoad(({ update }) => {
  update([
    { id: 1, name: '张三', age: 28 },
    { id: 2, name: '李四', age: 32 }
  ])
})
</script>

<template>
  <!-- 步骤3: 使用组件 -->
  <TableRender
    row-key="id"          <!-- 必需：数据主键 -->
    :columns="columns"     <!-- 必需：列配置 -->
    :data-load="dataLoad"  <!-- 必需：数据加载 -->
  />
</template>
```

**关键点**:
- ✅ `row-key="id"` - 必需，数据主键
- ✅ `update(data)` - 必需，更新数据
- ✅ `columns` - 必需，列配置

---

### 模板2: 带分页和搜索（20行代码）

**适用场景**: 服务端数据 + 搜索 + 分页

```vue
<script setup lang="ts">
import { defineForm } from '@gopowerteam/form-render'
import { defineColumns, defineTableLoad, TableRender } from '@gopowerteam/table-render'

// 步骤1: 定义搜索表单
const searchForm = defineForm([
  { key: 'name', title: '姓名', render: r => r.input() }
])

// 步骤2: 定义列
const columns = defineColumns([
  { key: 'name', title: '姓名', sortable: 'asc' },
  { key: 'status', title: '状态' }
])

// 步骤3: 定义数据加载（服务端分页）
const dataLoad = defineTableLoad(async ({ form, page, update }) => {
  const { data, total } = await fetchUsers({ form, page })
  if (page) page.total = total  // ← 关键：设置总数
  update(data)
})
</script>

<template>
  <TableRender
    row-key="id"
    :form="searchForm"     <!-- 搜索表单 -->
    :columns="columns"
    :data-load="dataLoad"
    pageable                <!-- 启用分页 -->
  />
</template>
```

**关键点**:
- ✅ `page.total = total` - 分页必需
- ✅ `pageable` - 启用分页
- ✅ `form` - 搜索表单

---

### 模板3: 完整功能（30行代码）

**适用场景**: 生产环境完整功能

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { defineForm } from '@gopowerteam/form-render'
import { defineColumns, defineTableLoad, TableRender, useTable } from '@gopowerteam/table-render'

const table = useTable('table')
const selectedKeys = ref<string[]>([])

const searchForm = defineForm([
  { key: 'name', title: '姓名', render: r => r.input() }
])

const columns = defineColumns([
  { key: 'serial', title: '序号', render: r => r.serial() },
  { key: 'name', title: '姓名' },
  { key: 'status', title: '状态', render: r => r.dict({ dict: statusMap, tag: 'success' }) },
  {
    key: 'actions',
    title: '操作',
    render: r => r.dropdown({
      content: '操作',
      options: [
        { content: '查看', onClick: (record) => table.value.preview({ key: record.id }) },
        { content: '删除', confirm: true, onClick: (record) => handleDelete(record) }
      ]
    })
  }
])

const dataLoad = defineTableLoad(async ({ form, page, update }) => {
  const { data, total } = await fetchUsers({ form, page })
  if (page) page.total = total
  update(data)
})
</script>

<template>
  <TableRender
    ref="table"
    row-key="id"
    :form="searchForm"
    :columns="columns"
    :data-load="dataLoad"
    pageable
    exportable
    refreshable
    selection="checkbox"
    v-model:checkbox-keys="selectedKeys"
  />
</template>
```

**关键点**:
- ✅ `useTable('table')` - 获取实例
- ✅ `ref="table"` - 绑定引用
- ✅ 完整功能配置

---

## 📊 API 速查表

> 💡 **给 AI Agent**: 这是所有 API 的快速参考表，用于快速查找

### Props 速查

#### 必需 Props

| 属性 | 类型 | 说明 | 示例 |
|------|------|------|------|
| **rowKey** | `string` | 数据主键字段名 | `row-key="id"` |
| **columns** | `TableColumnsOptions<T>` | 列配置数组 | `:columns="columns"` |
| **dataLoad** | `(params: TableLoadParams) => void \| Promise` | 数据加载函数 | `:data-load="dataLoad"` |

#### 数据 Props

| 属性 | 类型 | 默认值 | 说明 | 示例 |
|------|------|--------|------|------|
| **autoLoad** | `boolean` | `true` | 自动加载数据 | `:auto-load="false"` |
| **form** | `FormItemsOptions` | - | 搜索表单配置 | `:form="searchForm"` |
| **formOptions** | `TableFormSharedOptions` | - | 表单选项 | `:form-options="{ minWidth: 400 }"` |

#### 交互 Props

| 属性 | 类型 | 默认值 | 说明 | 示例 |
|------|------|--------|------|------|
| **pageable** | `boolean \| 'client' \| 'server' \| object` | - | 分页配置 | `pageable` |
| **sortable** | `Record<string, 'asc' \| 'desc'>` | - | 排序配置 | `:sortable="{ name: 'asc' }"` |
| **selection** | `'radio' \| 'checkbox' \| object` | - | 行选择配置 | `selection="checkbox"` |
| **draggable** | `boolean` | `false` | 拖拽排序 | `draggable` |
| **exportable** | `boolean \| { filename: string }` | `false` | 导出配置 | `exportable` |
| **refreshable** | `boolean` | `false` | 显示刷新按钮 | `refreshable` |
| **collapsable** | `boolean` | `false` | 列折叠 | `collapsable` |

#### 双向绑定 Props

| 属性 | 类型 | 说明 | 示例 |
|------|------|------|------|
| **radioKey** | `string \| number` | 单选 key | `v-model:radio-key="key"` |
| **radioRow** | `Record<string, any>` | 单选行数据 | `v-model:radio-row="row"` |
| **checkboxKeys** | `(string \| number)[]` | 多选 keys | `v-model:checkbox-keys="keys"` |
| **checkboxRows** | `Record<string, any>[]` | 多选行数据 | `v-model:checkbox-rows="rows"` |

#### 样式 Props

| 属性 | 类型 | 默认值 | 说明 | 示例 |
|------|------|--------|------|------|
| **size** | `'mini' \| 'small' \| 'medium' \| 'large'` | `'large'` | 表格尺寸 | `size="small"` |
| **bordered** | `boolean` | `false` | 显示边框 | `bordered` |
| **stripe** | `boolean` | `true` | 斑马纹 | `:stripe="false"` |
| **hoverable** | `boolean` | `false` | 悬停效果 | `hoverable` |
| **height** | `number` | - | 固定高度 | `:height="600"` |
| **autoFill** | `boolean` | `false` | 自适应高度 | `auto-fill` |
| **rowClass** | `(record: any) => string` | - | 行样式类 | `:row-class="getRowClass"` |

#### 性能 Props

| 属性 | 类型 | 默认值 | 说明 | 示例 |
|------|------|--------|------|------|
| **virtualList** | `boolean` | `false` | 虚拟滚动 | `virtual-list` |
| **grabbable** | `boolean` | `true` | 列宽拖拽 | `:grabbable="false"` |

#### 其他 Props

| 属性 | 类型 | 默认值 | 说明 | 示例 |
|------|------|--------|------|------|
| **pagePosition** | `'top' \| 'bottom' \| 'all'` | `'all'` | 分页位置 | `page-position="bottom"` |
| **actionsPosition** | `'left' \| 'right'` | `'right'` | 工具栏位置 | `actions-position="left"` |
| **columnsGroups** | `ColumnsGroup[]` | `[]` | 列分组 | `:columns-groups="groups"` |
| **expandable** | `TableExpandable` | - | 展开行配置 | `:expandable="{ ... }"` |
| **alwayShowPagination** | `boolean` | `false` | 总是显示分页 | `alway-show-pagination` |

---

### Methods 速查

#### 通过 `useTable` 获取实例

```typescript
const table = useTable('table')  // 参数是 ref 名称
```

#### 数据操作方法

| 方法 | 参数 | 返回值 | 说明 | 示例 |
|------|------|--------|------|------|
| **reload** | `{ reset?: boolean }` | `Promise<void>` | 重新加载数据 | `table.value.reload()` |
| **tableSource** | - | `DataRecord[]` | 当前表格数据（只读） | `table.value.tableSource` |
| **formSource** | - | `DataRecord` | 当前表单数据（只读） | `table.value.formSource` |

#### 预览和编辑方法

| 方法 | 参数 | 返回值 | 说明 | 示例 |
|------|------|--------|------|------|
| **preview** | `{ key?, record?, title?, mode? }` | `Promise<void>` | 预览数据 | `table.value.preview({ key: 1 })` |
| **edit** | `{ key?, record?, form, onSubmit, title?, mode? }` | `Promise<T>` | 编辑数据 | `table.value.edit({ key: 1, form, onSubmit })` |

#### 导出方法

| 方法 | 参数 | 返回值 | 说明 | 示例 |
|------|------|--------|------|------|
| **export** | `{ columns?, source?, filename? }` | `void` | 导出数据 | `table.value.export({ filename: 'data.xlsx' })` |

#### 选择方法

| 方法 | 参数 | 返回值 | 说明 | 示例 |
|------|------|--------|------|------|
| **resetSelection** | - | `void` | 重置选择状态 | `table.value.resetSelection()` |
| **reloadSelection** | - | `void` | 重新加载选择状态 | `table.value.reloadSelection()` |

#### 其他方法

| 方法 | 参数 | 返回值 | 说明 | 示例 |
|------|------|--------|------|------|
| **reloadColumns** | - | `void` | 重新加载列配置 | `table.value.reloadColumns()` |
| **formInstance** | - | `FormRenderInstance` | 表单实例 | `table.value.formInstance` |

---

### Events 速查

| 事件名 | 参数 | 说明 | 示例 |
|--------|------|------|------|
| **change** | `(data: TableData[], extra: TableChangeExtra)` | 表格数据变化（排序、筛选、拖拽） | `@change="handleChange"` |
| **update:radio-key** | `(key: string \| number)` | 单选 key 变化 | `v-model:radio-key="key"` |
| **update:radio-row** | `(row: Record<string, any>)` | 单选行数据变化 | `v-model:radio-row="row"` |
| **update:checkbox-keys** | `(keys: (string \| number)[])` | 多选 keys 变化 | `v-model:checkbox-keys="keys"` |
| **update:checkbox-rows** | `(rows: Record<string, any>[])` | 多选行数据变化 | `v-model:checkbox-rows="rows"` |

---

### Types 速查

#### TableColumnOptions

```typescript
interface TableColumnOptions<T> {
  key: string | keyof T          // 字段名（必需）
  title: string                   // 列标题（必需）
  index?: string                  // 数据索引路径
  width?: number | 'auto'         // 列宽度
  fixed?: 'left' | 'right'        // 固定列
  align?: 'left' | 'center' | 'right'
  render?: TableColumnRender<T>   // 列渲染器
  formatter?: (record: T) => string | number | Date | undefined
  ellipsis?: boolean
  sortable?: 'asc' | 'desc'
  form?: boolean | FormItemOptions
  collapsed?: boolean
  visiable?: boolean | (() => boolean)
  exportable?: ExportColumnOptions | boolean
  extraProps?: Partial<TableColumnData>
}
```

#### TableLoadParams

```typescript
interface TableLoadParams {
  form: DataRecord                          // 搜索表单数据
  page?: PageableOptions & RequestPlugin   // 分页信息
  sort?: SortableOptions & RequestPlugin   // 排序信息
  update: (data: DataRecord[]) => void     // 更新数据的函数
}
```

#### PageableOptions

```typescript
interface PageableOptions {
  pageIndex: number      // 当前页码
  pageSize: number       // 每页条数
  pageSizeOpts: number[] // 每页条数选项
  pageLayouts: Array<...> // 分页布局
  total: number          // 总数
  reset: () => void      // 重置函数
}
```

#### SelectionOptions

```typescript
interface SelectionOptions {
  type: 'radio' | 'checkbox'
  width?: number
  title?: string
  fixed?: boolean
  selectable?: (record: any) => boolean
}
```

---

## ✅ 常见任务速查

> 💡 **给 AI Agent**: 以下是常见任务的快速实现指南

### 任务导航

| 任务 | 难度 | 关键步骤 | 跳转 |
|------|:----:|---------|------|
| 创建基础表格 | ⭐ | 3步 | [查看详情](#任务1-创建基础表格) |
| 添加分页 | ⭐⭐ | 2步 | [查看详情](#任务2-添加分页) |
| 添加搜索 | ⭐⭐ | 2步 | [查看详情](#任务3-添加搜索) |
| 添加操作按钮 | ⭐⭐⭐ | 1步 | [查看详情](#任务4-添加操作按钮) |
| 导出数据 | ⭐ | 1步 | [查看详情](#任务5-导出数据) |
| 行选择 | ⭐⭐ | 2步 | [查看详情](#任务6-行选择) |
| 预览/编辑 | ⭐⭐⭐ | 2步 | [查看详情](#任务7-预览编辑) |

---

### 任务1: 创建基础表格

**步骤**:
1. 定义 `columns`
2. 定义 `dataLoad`
3. 使用 `<TableRender>`

**代码**:
```vue
<script setup lang="ts">
import { defineColumns, defineTableLoad, TableRender } from '@gopowerteam/table-render'

// 步骤1: 定义列
const columns = defineColumns([
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' }
])

// 步骤2: 定义数据加载
const dataLoad = defineTableLoad(({ update }) => {
  update([
    { id: 1, name: '张三', age: 28 },
    { id: 2, name: '李四', age: 32 }
  ])
})
</script>

<template>
  <!-- 步骤3: 使用组件 -->
  <TableRender row-key="id" :columns="columns" :data-load="dataLoad" />
</template>
```

---

### 任务2: 添加分页

**步骤**:
1. 添加 `pageable` 属性
2. 在 `dataLoad` 中设置 `page.total`

**代码**:
```vue
<script setup lang="ts">
const dataLoad = defineTableLoad(async ({ page, update }) => {
  const { data, total } = await fetchUsers(page)
  if (page) page.total = total  // ← 关键：设置总数
  update(data)
})
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    pageable  <!-- ← 关键：启用分页 -->
  />
</template>
```

---

### 任务3: 添加搜索

**步骤**:
1. 定义 `searchForm`
2. 在 `dataLoad` 中使用 `form`

**代码**:
```vue
<script setup lang="ts">
import { defineForm } from '@gopowerteam/form-render'

// 步骤1: 定义搜索表单
const searchForm = defineForm([
  { key: 'name', title: '姓名', render: r => r.input() },
  { key: 'status', title: '状态', render: r => r.select({ options: statusMap }) }
])

// 步骤2: 使用搜索条件
const dataLoad = defineTableLoad(async ({ form, update }) => {
  console.log('搜索条件：', form)  // ← 关键：获取搜索条件
  const data = await searchUsers(form)
  update(data)
})
</script>

<template>
  <TableRender
    row-key="id"
    :form="searchForm"  <!-- ← 关键：绑定搜索表单 -->
    :columns="columns"
    :data-load="dataLoad"
  />
</template>
```

---

### 任务4: 添加操作按钮

**代码**:
```typescript
const columns = defineColumns([
  { key: 'name', title: '姓名' },
  {
    key: 'actions',
    title: '操作',
    render: r => r.button([
      {
        content: '编辑',
        onClick: (record) => handleEdit(record)
      },
      {
        content: '删除',
        confirm: true,  // ← 关键：显示确认对话框
        onClick: (record) => handleDelete(record)
      }
    ])
  }
])
```

---

### 任务5: 导出数据

**代码**:
```vue
<!-- 方式1: 声明式 -->
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
  exportable  <!-- ← 关键：启用导出 -->
/>

<!-- 方式2: 编程式 -->
<script setup lang="ts">
const table = useTable('table')

function handleExport() {
  table.value.export({ filename: 'data.xlsx' })
}
</script>
```

---

### 任务6: 行选择

**单选**:
```vue
<script setup lang="ts">
const radioKey = ref<string>()
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    selection="radio"
    v-model:radio-key="radioKey"
  />
</template>
```

**多选**:
```vue
<script setup lang="ts">
const checkboxKeys = ref<string[]>([])
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    selection="checkbox"
    v-model:checkbox-keys="checkboxKeys"
  />
</template>
```

---

### 任务7: 预览/编辑

**预览**:
```typescript
const table = useTable('table')

function handlePreview(record: any) {
  table.value.preview({
    key: record.id,
    title: '用户详情',
    mode: 'drawer'  // 或 'dialog'
  })
}
```

**编辑**:
```typescript
async function handleEdit(record: any) {
  const result = await table.value.edit({
    key: record.id,
    form: editForm,
    title: '编辑用户',
    onSubmit: async (data) => {
      await updateUser(data)
      return true  // ← 关键：返回 true 关闭对话框
    }
  })
}
```

---

## 🌳 功能决策树

> 💡 **给 AI Agent**: 根据场景选择合适的功能配置

### 基础功能选择

```
场景：需要展示表格数据
│
├─ Q1: 数据来源？
│   ├─ 本地数据 → dataLoad 中直接 update(data)
│   └─ 服务端数据 → dataLoad 中 fetch + update(data)
│
├─ Q2: 需要分页？
│   ├─ 否 → 不设置 pageable
│   ├─ 是 + 服务端 → pageable 或 pageable="server"
│   └─ 是 + 客户端 → pageable="client"
│
├─ Q3: 需要搜索？
│   ├─ 简单搜索（每列一个输入框）
│   │   └─ 列配置中 form: true
│   └─ 复杂搜索（自定义布局）
│       └─ 定义 form + :form="searchForm"
│
├─ Q4: 需要排序？
│   ├─ 单列排序 → 列配置 sortable: 'asc' | 'desc'
│   └─ 多列排序 → props.sortable = { name: 'asc', age: 'desc' }
│
├─ Q5: 需要选择行？
│   ├─ 单选 → selection="radio" + v-model:radio-key
│   └─ 多选 → selection="checkbox" + v-model:checkbox-keys
│
└─ Q6: 需要操作按钮？
    ├─ 少于3个 → render: r => r.button([...])
    └─ 多于3个 → render: r => r.dropdown({...})
```

### 性能优化选择

```
场景：数据量大（>1000行）
│
├─ 方案1: 虚拟滚动
│   └─ virtual-list + :height="600"
│
├─ 方案2: 服务端分页
│   └─ pageable + dataLoad 处理分页
│
└─ 方案3: 懒加载
    └─ expandable + 子表格
```

---

## 🔍 关键词索引

> 💡 **给 AI Agent**: 通过关键词快速定位相关章节

### 功能关键词

| 关键词 | 相关章节 | API | 说明 |
|--------|---------|-----|------|
| **分页** | [功能特性 > 分页](#分页-pagination) | `pageable`, `PageableOptions` | 数据分页展示 |
| **排序** | [功能特性 > 排序](#排序-sorting) | `sortable`, `SortService` | 数据排序功能 |
| **搜索/筛选** | [功能特性 > 筛选](#筛选-filtering) | `form`, `FormItemsOptions` | 数据搜索筛选 |
| **选择** | [功能特性 > 行选择](#行选择-selection) | `selection`, `radio/checkbox` | 行选择功能 |
| **拖拽** | [功能特性 > 拖拽排序](#拖拽排序-draggable) | `draggable` | 拖拽排序 |
| **导出** | [功能特性 > 导出](#导出-export) | `exportable`, `export()` | Excel 导出 |
| **虚拟滚动** | [功能特性 > 虚拟滚动](#虚拟滚动-virtual-list) | `virtualList` | 大数据优化 |
| **预览** | [高级用法 > 预览与编辑](#预览与编辑) | `preview()` | 数据预览 |
| **编辑** | [高级用法 > 预览与编辑](#预览与编辑) | `edit()` | 数据编辑 |

### 渲染器关键词

| 渲染器 | 用途 | 章节链接 |
|--------|------|---------|
| **text** | 文本显示 | [文本渲染器](#文本渲染器-text) |
| **dict** | 字典映射 | [字典渲染器](#字典渲染器-dict) |
| **tag** | 标签显示 | [标签渲染器](#标签渲染器-tag) |
| **phone** | 电话号码 | [电话渲染器](#电话渲染器-phone) |
| **image** | 图片显示 | [图片渲染器](#图片渲染器-image) |
| **currency** | 货币金额 | [货币渲染器](#货币渲染器-currency) |
| **date** | 日期时间 | [日期渲染器](#日期渲染器-date) |
| **progress** | 进度条 | [进度条渲染器](#进度条渲染器-progress) |
| **serial** | 序号 | [序号渲染器](#序号渲染器-serial) |
| **button** | 操作按钮 | [按钮渲染器](#按钮渲染器-button) |
| **dropdown** | 下拉菜单 | [下拉菜单渲染器](#下拉菜单渲染器-dropdown) |
| **render** | 自定义渲染 | [自定义渲染器](#自定义渲染器-render) |

### API 关键词

| API | 类型 | 用途 | 速查表位置 |
|-----|------|------|-----------|
| **defineColumns** | 函数 | 定义列配置 | [API速查表](#api-速查表) |
| **defineTableLoad** | 函数 | 定义数据加载 | [API速查表](#api-速查表) |
| **useTable** | Hook | 获取表格实例 | [Methods速查](#methods-速查) |
| **TableRender** | 组件 | 表格组件 | [Props速查](#props-速查) |
| **reload** | 方法 | 重新加载数据 | [Methods速查](#methods-速查) |
| **preview** | 方法 | 预览数据 | [Methods速查](#methods-速查) |
| **edit** | 方法 | 编辑数据 | [Methods速查](#methods-速查) |
| **export** | 方法 | 导出数据 | [Methods速查](#methods-速查) |

---

═══════════════════════════════════════════════════════════════
                    📚 详细文档区
                （深入学习 + 全面理解）
═══════════════════════════════════════════════════════════════

---

## ✨ 特性

- 🎯 **12+ 开箱即用的列渲染器** - text、dict、tag、phone、image、currency、date、progress、serial、button、dropdown、render
- 📊 **强大的数据加载机制** - 支持同步/异步加载，自动管理加载状态
- 🔍 **完整的搜索表单集成** - 与 form-render 无缝集成，支持复杂搜索条件
- 📄 **智能分页** - 支持服务端分页、客户端分页，灵活配置
- 🔄 **多维度排序** - 支持单列、多列排序，服务端/客户端排序模式
- ✅ **灵活的行选择** - 支持单选、多选，双向绑定选中数据
- 🎨 **行拖拽排序** - 支持拖拽调整行顺序
- 📥 **Excel 导出** - 一键导出表格数据为 Excel 文件
- 👁️ **预览与编辑** - 内置数据预览和编辑功能
- 📱 **列折叠与展开** - 动态控制列的显示与隐藏
- ⚡ **虚拟滚动** - 大数据量场景下的性能优化
- 🎭 **自适应高度** - 自动填充容器高度
- 💪 **TypeScript 支持** - 完整的类型定义，提供优秀的开发体验

## 📦 安装

```bash
# pnpm
pnpm add @gopowerteam/table-render

# npm
npm install @gopowerteam/table-render

# yarn
yarn add @gopowerteam/table-render
```

### 依赖

确保项目中已安装以下 peer dependencies：

```json
{
  "@arco-design/web-vue": "^2.56.3",
  "@gopowerteam/form-render": "^1.0.0",
  "@gopowerteam/modal-render": "^1.0.0",
  "exceljs": "^4.4.0",
  "vue": "^3.0.0"
}
```

## 🚀 快速开始

### 基础示例

```vue
<script setup lang="ts">
import { defineColumns, defineTableLoad, TableRender } from '@gopowerteam/table-render'

// 定义列
const columns = defineColumns([
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
  { key: 'email', title: '邮箱' }
])

// 定义数据加载函数
const dataLoad = defineTableLoad(({ update }) => {
  // 模拟数据
  const data = [
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com' },
    { id: 3, name: '王五', age: 25, email: 'wangwu@example.com' }
  ]
  
  update(data)
})
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
  />
</template>
```

### 完整示例

```vue
<script setup lang="ts">
import { defineForm } from '@gopowerteam/form-render'
import { 
  defineColumns, 
  defineTableLoad, 
  TableRender,
  useTable 
} from '@gopowerteam/table-render'
import { ref } from 'vue'

// 使用 useTable 获取表格实例
const table = useTable('table')

// 定义搜索表单
const searchForm = defineForm([
  {
    key: 'name',
    title: '姓名',
    render: r => r.input({ placeholder: '请输入姓名' })
  },
  {
    key: 'status',
    title: '状态',
    render: r => r.select({
      options: new Map([
        ['active', '启用'],
        ['inactive', '禁用']
      ])
    })
  }
])

// 定义列
const columns = defineColumns([
  {
    key: 'serial',
    title: '序号',
    width: 80,
    render: r => r.serial()
  },
  {
    key: 'name',
    title: '姓名',
    width: 150,
    sortable: 'asc'
  },
  {
    key: 'age',
    title: '年龄',
    width: 100,
    sortable: 'desc'
  },
  {
    key: 'phone',
    title: '手机号',
    width: 200,
    render: r => r.phone({ safe: true, allowCopy: true })
  },
  {
    key: 'status',
    title: '状态',
    width: 120,
    render: r => r.dict({
      dict: new Map([['active', '启用'], ['inactive', '禁用']]),
      tag: 'success'
    })
  },
  {
    key: 'actions',
    title: '操作',
    width: 200,
    fixed: 'right',
    render: r => r.dropdown({
      content: '操作',
      options: [
        {
          content: '查看',
          onClick: (record) => {
            table.value.preview({ key: record.id })
          }
        },
        {
          content: '编辑',
          onClick: (record) => {
            // 编辑逻辑
          }
        },
        {
          content: '删除',
          confirm: true,
          confirmText: '确定要删除这条数据吗？',
          onClick: async (record) => {
            // 删除逻辑
          }
        }
      ]
    })
  }
])

// 定义数据加载函数
const dataLoad = defineTableLoad(async ({ form, page, sort, update }) => {
  console.log('搜索条件：', form)
  console.log('分页信息：', page)
  console.log('排序信息：', sort)
  
  // 模拟 API 调用
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ form, page, sort })
  })
  const { data, total } = await response.json()
  
  // 设置分页总数
  if (page) {
    page.total = total
  }
  
  // 更新表格数据
  update(data)
})

// 刷新表格
function handleRefresh() {
  table.value.reload()
}

// 重置并刷新
function handleReset() {
  table.value.reload({ reset: true })
}
</script>

<template>
  <div style="height: 600px;">
    <TableRender
      ref="table"
      row-key="id"
      :columns="columns"
      :form="searchForm"
      :data-load="dataLoad"
      pageable
      refreshable
      exportable
      :form-options="{
        minWidth: 300,
        columns: 3
      }"
    >
      <template #actions>
        <a-button type="primary" @click="handleRefresh">
          刷新
        </a-button>
        <a-button @click="handleReset">
          重置
        </a-button>
      </template>
    </TableRender>
  </div>
</template>
```

## 📖 核心概念

### TableRender 组件

`TableRender` 是表格渲染的核心组件，负责整合列定义、数据加载、分页、排序等功能。

#### 基本用法

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
/>
```

### 列定义 (defineColumns)

使用 `defineColumns` 函数定义表格列，支持 TypeScript 类型推断。

```typescript
import { defineColumns } from '@gopowerteam/table-render'

interface User {
  id: number
  name: string
  age: number
  email: string
}

const columns = defineColumns<User>([
  {
    key: 'id',        // 字段名
    title: 'ID',      // 列标题
    width: 100,       // 列宽度
    fixed: 'left',    // 固定列
    sortable: 'asc'   // 排序
  },
  {
    key: 'name',
    title: '姓名',
    render: r => r.text() // 使用渲染器
  }
])
```

#### 列配置选项

```typescript
interface TableColumnOptions<T> {
  key: string | keyof T          // 字段名（必需）
  title: string                   // 列标题（必需）
  index?: string                  // 数据索引路径，如 'user.name'
  width?: number | 'auto'         // 列宽度
  fixed?: 'left' | 'right'        // 固定列
  align?: 'left' | 'center' | 'right' // 对齐方式
  ellipsis?: boolean              // 文本溢出省略
  render?: TableColumnRender<T>   // 列渲染器
  formatter?: (record: T) => string | number | Date | undefined // 格式化函数
  sortable?: 'asc' | 'desc'       // 排序方式
  form?: boolean | FormItemOptions // 搜索表单配置
  collapsed?: boolean             // 是否默认折叠
  visiable?: boolean | (() => boolean) // 是否显示
  exportable?: ExportColumnOptions | boolean // 导出配置
  extraProps?: Partial<TableColumnData> // 额外的 Arco Table 列属性
}
```

### 数据加载 (defineTableLoad)

使用 `defineTableLoad` 定义数据加载函数。

```typescript
import { defineTableLoad } from '@gopowerteam/table-render'

const dataLoad = defineTableLoad(({ form, page, sort, update }) => {
  // form: 搜索表单数据
  // page: 分页信息（仅当 pageable 启用时）
  // sort: 排序信息（仅当启用排序时）
  // update: 更新表格数据的函数
  
  // 同步方式
  const data = [...]
  update(data)
  
  // 异步方式
  return fetch('/api/data').then(res => {
    const data = res.json()
    update(data)
  })
})
```

#### TableLoadParams 参数说明

```typescript
interface TableLoadParams {
  form: DataRecord                          // 搜索表单数据
  page?: PageableOptions & RequestPlugin   // 分页信息
  sort?: SortableOptions & RequestPlugin   // 排序信息
  update: (data: DataRecord[]) => void     // 更新数据的函数
}
```

### 表格实例 (useTable)

使用 `useTable` hook 获取表格实例，调用表格方法。

```typescript
import { useTable } from '@gopowerteam/table-render'
import { onMounted } from 'vue'

const table = useTable('table')

onMounted(() => {
  // 重新加载数据
  table.value.reload()
  
  // 重置并重新加载
  table.value.reload({ reset: true })
  
  // 预览数据
  table.value.preview({ key: 1, mode: 'drawer' })
  
  // 编辑数据
  table.value.edit({
    key: 1,
    form: editForm,
    onSubmit: async (data) => {
      // 提交逻辑
    }
  })
  
  // 导出数据
  table.value.export({ filename: 'data.xlsx' })
  
  // 访问表格数据
  console.log(table.value.tableSource)
  
  // 访问表单数据
  console.log(table.value.formSource)
})
```

## 🎨 列渲染器

table-render 提供了 12+ 开箱即用的列渲染器，满足大部分业务场景。

### 文本渲染器 (text)

基础文本显示，支持自定义内容和样式。

```typescript
{
  key: 'name',
  title: '姓名',
  render: r => r.text()
}
```

#### 自定义内容

```typescript
{
  key: 'fullName',
  title: '全名',
  render: r => r.text({
    content: record => `${record.firstName} ${record.lastName}`
  })
}
```

#### 自定义样式

```typescript
{
  key: 'status',
  title: '状态',
  render: r => r.text({
    color: record => record.status === 'active' ? 'green' : 'red',
    size: record => record.important ? 16 : 14
  })
}
```

#### API

```typescript
interface TextColumnOptions<T> {
  content?: string | ((record: T) => string | number | undefined) // 内容
  color?: string | ((record: T) => string)                        // 颜色
  size?: string | number | ((record: T) => string | number)      // 字号
}
```

### 字典渲染器 (dict)

将数据值映射为可读文本，支持标签显示。

```typescript
{
  key: 'status',
  title: '状态',
  render: r => r.dict({
    dict: new Map([
      ['active', '启用'],
      ['inactive', '禁用']
    ])
  })
}
```

#### 标签模式

```typescript
{
  key: 'status',
  title: '状态',
  render: r => r.dict({
    dict: new Map([
      ['active', '启用'],
      ['inactive', '禁用']
    ]),
    tag: 'success' // 或 true
  })
}
```

#### 标签颜色

```typescript
{
  key: 'level',
  title: '等级',
  render: r => r.dict({
    dict: new Map([
      ['high', '高'],
      ['medium', '中'],
      ['low', '低']
    ]),
    tag: 'warning' // success | warning | error
  })
}
```

#### API

```typescript
type DictColumnOptions = 
  | Map<string | number | boolean, string | number | boolean>
  | {
      dict: Map<string | number | boolean, string | number | boolean>
      tag: boolean | 'success' | 'warning' | 'error'
    }
```

### 标签渲染器 (tag)

显示多个标签，支持自定义样式。

```typescript
{
  key: 'tags',
  title: '标签',
  render: r => r.tag({
    formatter: record => record.tags // 返回字符串数组
  })
}
```

#### 自定义颜色

```typescript
{
  key: 'skills',
  title: '技能',
  render: r => r.tag({
    formatter: record => record.skills,
    textColors: ['#F87335', '#1890FF', '#52C41A'],
    backgroundColors: ['#FFF4E8', '#E6F7FF', '#F6FFED'],
    border: true,
    radius: 4
  })
}
```

#### 限制显示数量

```typescript
{
  key: 'tags',
  title: '标签',
  render: r => r.tag({
    formatter: record => record.tags,
    maxCount: 3 // 最多显示3个，超出显示...
  })
}
```

#### API

```typescript
interface TagColumnOptions<T> {
  formatter?: (record: T) => string[]                    // 格式化函数
  textColors?: string[] | ((tag: any, index: number) => string) // 文本颜色
  backgroundColors?: string[] | ((tag: any, index: number) => string) // 背景色
  border?: boolean                                       // 是否显示边框
  radius?: number                                        // 圆角
  maxCount?: number                                      // 最大显示数量
  minWidth?: number                                      // 最小宽度
}
```

### 电话渲染器 (phone)

格式化显示电话号码，支持脱敏、复制、拨号等功能。

```typescript
{
  key: 'phone',
  title: '手机号',
  render: r => r.phone()
}
```

#### 脱敏显示

```typescript
{
  key: 'phone',
  title: '手机号',
  render: r => r.phone({
    safe: true,           // 脱敏显示：180****1234
    allowPreview: true,   // 允许查看完整号码
    allowCopy: true,      // 允许复制
    allowDial: true       // 允许拨号
  })
}
```

#### 自定义分隔符

```typescript
{
  key: 'phone',
  title: '手机号',
  render: r => r.phone({
    separator: '-' // 180-1234-5678
  })
}
```

#### API

```typescript
interface PhoneColumnOptions {
  safe?: boolean              // 脱敏模式
  allowPreview?: boolean      // 允许预览完整号码
  allowDial?: boolean         // 允许拨号
  allowCopy?: boolean         // 允许复制
  separator?: string          // 分隔符
  onDial?: (phone: string) => void // 拨号回调
}
```

### 图片渲染器 (image)

显示图片，支持预览和自定义尺寸。

```typescript
{
  key: 'avatar',
  title: '头像',
  render: r => r.image({
    preview: true,
    size: 50
  })
}
```

#### 自定义尺寸

```typescript
{
  key: 'thumbnail',
  title: '缩略图',
  render: r => r.image({
    width: '100px',
    height: '80px',
    radius: '4px',
    preview: true
  })
}
```

#### 图片转换

```typescript
{
  key: 'imageKey',
  title: '图片',
  render: r => r.image({
    size: 100,
    preview: true,
    parse: async (key, record) => {
      // 异步获取图片URL
      const url = await fetchImageUrl(key)
      return url
    }
  })
}
```

#### API

```typescript
interface ImageColumnOptions<T> {
  width?: string                                    // 宽度
  height?: string                                   // 高度
  size?: number                                     // 尺寸（宽高相等）
  radius?: string                                   // 圆角
  preview?: boolean                                 // 是否支持预览
  rotate?: number                                   // 旋转角度
  parse?: (key: string, record: T) => Promise<string> | string // 图片URL转换
}
```

### 货币渲染器 (currency)

格式化显示货币金额，支持单位转换和千分位。

```typescript
{
  key: 'price',
  title: '价格',
  render: r => r.currency()
}
```

#### 单位转换

```typescript
{
  key: 'amount',
  title: '金额',
  render: r => r.currency({
    inputUnit: '分',      // 输入单位：分
    outputUnit: '元',     // 输出单位：元
    precision: 2,         // 精度
    thousands: true       // 千分位显示
  })
}
```

#### 自定义前后缀

```typescript
{
  key: 'price',
  title: '价格',
  render: r => r.currency({
    prefix: '¥',
    suffix: '元',
    precision: 2
  })
}
```

#### 特殊值处理

```typescript
{
  key: 'balance',
  title: '余额',
  render: r => r.currency({
    zeroString: '-',      // 值为0时显示
    nullString: 'N/A'     // 值为null时显示
  })
}
```

#### API

```typescript
interface CurrencyColumnOptions {
  prefix?: string | (() => JSX.Element)    // 前缀
  suffix?: string | (() => JSX.Element)    // 后缀
  precision?: number                       // 精度
  inputUnit?: '分' | '元' | '万'           // 输入单位
  outputUnit?: '分' | '元' | '万'          // 输出单位
  thousands?: boolean                      // 千分位显示
  zeroString?: string                      // 值为0时的显示文本
  nullString?: string                      // 值为null时的显示文本
}
```

### 日期渲染器 (date)

格式化显示日期时间。

```typescript
{
  key: 'createdAt',
  title: '创建时间',
  render: r => r.date()
}
```

#### 预设格式

```typescript
{
  key: 'createdAt',
  title: '创建时间',
  render: r => r.date({
    format: 'datetime' // date | datetime | time | week
  })
}
```

#### 自定义格式

```typescript
{
  key: 'birthday',
  title: '生日',
  render: r => r.date({
    format: () => 'YYYY年MM月DD日'
  })
}
```

#### API

```typescript
interface DateColumnOptions {
  format?: 'date' | 'datetime' | 'time' | 'week' | (() => string)
}
```

### 进度条渲染器 (progress)

显示进度条。

```typescript
{
  key: 'progress',
  title: '进度',
  render: r => r.progress()
}
```

#### 自定义样式

```typescript
{
  key: 'completion',
  title: '完成度',
  render: r => r.progress({
    showText: true,              // 显示百分比文本
    backgroundColor: '#f0f0f0',  // 背景色
    foregroundColor: '#52c41a',  // 前景色
    textColor: '#333',           // 文本颜色
    precision: 1                 // 精度
  })
}
```

#### 自定义计算

```typescript
{
  key: 'task',
  title: '任务进度',
  render: r => r.progress({
    format: (record) => {
      return record.completed / record.total
    }
  })
}
```

#### API

```typescript
interface ProgressColumnOptions {
  showText?: boolean                      // 是否显示文本
  backgroundColor?: string                // 背景色
  foregroundColor?: string                // 前景色
  textColor?: string                      // 文本颜色
  precision?: number                      // 精度
  format?: (value: DataRecord) => number  // 格式化函数
}
```

### 序号渲染器 (serial)

显示行序号。

```typescript
{
  key: 'serial',
  title: '序号',
  width: 80,
  render: r => r.serial()
}
```

#### 自定义样式

```typescript
{
  key: 'serial',
  title: '序号',
  render: r => r.serial({
    color: '#1890ff',
    weight: 'bold' // bold | normal | lighter | bolder
  })
}
```

#### API

```typescript
interface SerialColumnOptions<T> {
  color?: string | ((record: T) => string)
  weight?: 'bold' | 'normal' | 'lighter' | 'bolder'
}
```

### 按钮渲染器 (button)

显示操作按钮。

```typescript
{
  key: 'actions',
  title: '操作',
  render: r => r.button([
    {
      content: '编辑',
      onClick: (record) => {
        console.log('编辑', record)
      }
    },
    {
      content: '删除',
      type: 'primary',
      onClick: (record) => {
        console.log('删除', record)
      }
    }
  ])
}
```

#### 确认对话框

```typescript
{
  key: 'actions',
  title: '操作',
  render: r => r.button([
    {
      content: '删除',
      confirm: true,
      confirmText: '确定要删除吗？',
      onClick: async (record) => {
        await deleteRecord(record.id)
      }
    }
  ])
}
```

#### 自动刷新

```typescript
{
  key: 'actions',
  title: '操作',
  render: r => r.button([
    {
      content: '删除',
      confirm: true,
      autoReload: true, // 操作成功后自动刷新表格
      onClick: async (record) => {
        await deleteRecord(record.id)
      }
    }
  ])
}
```

#### 条件显示

```typescript
{
  key: 'actions',
  title: '操作',
  render: r => r.button([
    {
      content: '编辑',
      visiable: (record) => record.editable,
      onClick: (record) => { }
    },
    {
      content: '删除',
      disabled: (record) => record.deletable === false,
      onClick: (record) => { }
    }
  ])
}
```

#### API

```typescript
interface RenderSingleButtonColumnOptions<T> {
  content?: string | ((record: T) => string | number | undefined) // 按钮文本
  onClick?: (record: T) => Promise<void> | void                   // 点击事件
  autoReload?: boolean                                            // 自动刷新
  type?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text' // 按钮类型
  shape?: 'square' | 'round' | 'circle'                          // 按钮形状
  visiable?: boolean | ((record: T) => boolean)                  // 是否显示
  disabled?: boolean | ((record: T) => boolean)                  // 是否禁用
  confirm?: boolean                                               // 是否显示确认框
  confirmText?: string                                            // 确认框文本
  icon?: (record: T) => JSX.Element                              // 图标
}
```

### 下拉菜单渲染器 (dropdown)

显示下拉菜单操作。

```typescript
{
  key: 'actions',
  title: '操作',
  render: r => r.dropdown({
    content: '更多操作',
    options: [
      {
        content: '查看',
        onClick: (record) => {
          console.log('查看', record)
        }
      },
      {
        content: '编辑',
        onClick: (record) => {
          console.log('编辑', record)
        }
      }
    ]
  })
}
```

#### 确认对话框

```typescript
{
  key: 'actions',
  title: '操作',
  render: r => r.dropdown({
    content: '操作',
    options: [
      {
        content: '删除',
        confirm: true,
        confirmText: '确定要删除吗？',
        onClick: async (record) => {
          await deleteRecord(record.id)
        }
      }
    ]
  })
}
```

#### 条件显示

```typescript
{
  key: 'actions',
  title: '操作',
  render: r => r.dropdown({
    content: '操作',
    options: [
      {
        content: '审核',
        visiable: (record) => record.status === 'pending',
        onClick: (record) => { }
      },
      {
        content: '发布',
        visiable: (record) => record.status === 'draft',
        disabled: (record) => !record.canPublish,
        onClick: (record) => { }
      }
    ]
  })
}
```

#### API

```typescript
interface DropdownColumnOptions<T> {
  trigger?: TriggerEvent                        // 触发方式
  content?: string                              // 按钮文本
  options: DropdownOptionItemOptions<T>[]       // 菜单选项
}

interface DropdownOptionItemOptions<T> {
  content: string | ((record: T) => string | number | undefined) // 菜单项文本
  onClick: (record: T) => Promise<void> | void                   // 点击事件
  visiable?: boolean | ((record: T) => boolean)                 // 是否显示
  disabled?: boolean | ((record: T) => boolean)                 // 是否禁用
  confirm?: boolean                                              // 是否显示确认框
  confirmText?: string                                           // 确认框文本
}
```

### 自定义渲染器 (render)

完全自定义列渲染。

```tsx
{
  key: 'custom',
  title: '自定义',
  render: r => r.render((record) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={record.avatar} style={{ width: 30, height: 30, borderRadius: '50%' }} />
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
        </div>
      </div>
    )
  })
}
```

## 🔧 功能特性

### 分页 (Pagination)

#### 服务端分页

```vue
<script setup lang="ts">
const dataLoad = defineTableLoad(async ({ form, page, update }) => {
  const response = await fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify({
      ...form,
      pageIndex: page?.pageIndex,
      pageSize: page?.pageSize
    })
  })
  
  const { data, total } = await response.json()
  
  // 设置总数
  if (page) {
    page.total = total
  }
  
  update(data)
})
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    pageable
  />
</template>
```

#### 客户端分页

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
  pageable="client"
/>
```

#### 自定义分页配置

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
  :pageable="{ index: 1, size: 20 }"
/>
```

#### 分页位置

```vue
<!-- 顶部 -->
<TableRender page-position="top" />

<!-- 底部 -->
<TableRender page-position="bottom" />

<!-- 顶部和底部 -->
<TableRender page-position="all" />
```

#### PageableOptions API

```typescript
interface PageableOptions {
  pageIndex: number      // 当前页码
  pageSize: number       // 每页条数
  pageSizeOpts: number[] // 每页条数选项
  pageLayouts: Array<...> // 分页布局
  total: number          // 总数
  reset: () => void      // 重置函数
}
```

### 排序 (Sorting)

#### 单列排序

```typescript
const columns = defineColumns([
  {
    key: 'name',
    title: '姓名',
    sortable: 'asc' // 'asc' | 'desc'
  }
])
```

#### 客户端排序

客户端排序会自动处理数据，无需在 `dataLoad` 中处理：

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
/>
```

#### 服务端排序

```typescript
const dataLoad = defineTableLoad(async ({ form, page, sort, update }) => {
  console.log('排序字段：', sort)
  // { name: 'asc', age: 'desc' }
  
  const response = await fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify({
      ...form,
      sort
    })
  })
  
  const data = await response.json()
  update(data)
})
```

#### 多列排序

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
  :sortable="{ name: 'asc', age: 'desc' }"
/>
```

### 筛选 (Filtering)

#### 自动生成搜索表单

根据列配置自动生成搜索表单：

```typescript
const columns = defineColumns([
  {
    key: 'name',
    title: '姓名',
    form: true // 自动生成表单字段
  },
  {
    key: 'status',
    title: '状态',
    form: {
      render: r => r.select({
        options: new Map([['active', '启用'], ['inactive', '禁用']])
      })
    }
  }
])
```

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
/>
```

#### 自定义搜索表单

使用 `form-render` 完全自定义搜索表单：

```vue
<script setup lang="ts">
import { defineForm } from '@gopowerteam/form-render'

const searchForm = defineForm([
  {
    key: 'name',
    title: '姓名',
    render: r => r.input({ placeholder: '请输入姓名' })
  },
  {
    key: 'status',
    title: '状态',
    render: r => r.select({
      options: new Map([['active', '启用'], ['inactive', '禁用']])
    })
  },
  {
    key: 'dateRange',
    title: '日期范围',
    render: r => r.dateRange()
  }
])

const dataLoad = defineTableLoad(async ({ form, update }) => {
  console.log('搜索条件：', form)
  // { name: 'xxx', status: 'active', dateRange: [...] }
  
  const data = await fetchData(form)
  update(data)
})
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :form="searchForm"
    :data-load="dataLoad"
    :form-options="{
      minWidth: 300,
      columns: 3,
      collapsedMode: 'dialog',
      submitable: true,
      resetable: true
    }"
  />
</template>
```

#### 表单选项

```typescript
interface TableFormSharedOptions {
  minWidth?: number          // 最小宽度
  columns?: number           // 列数
  collapsedMode?: 'append' | 'dialog' // 折叠模式
  showFormResult?: boolean   // 显示表单结果
  submitable?: boolean       // 是否显示提交按钮
  searchable?: boolean       // 是否可搜索
  resetable?: boolean        // 是否显示重置按钮
}
```

### 行选择 (Selection)

#### 单选

```vue
<script setup lang="ts">
import { ref } from 'vue'

const radioKey = ref<string>()
const radioRow = ref<any>()
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    selection="radio"
    v-model:radio-key="radioKey"
    v-model:radio-row="radioRow"
  />
  
  <div>选中：{{ radioKey }}</div>
  <div>选中行：{{ radioRow }}</div>
</template>
```

#### 多选

```vue
<script setup lang="ts">
import { ref } from 'vue'

const checkboxKeys = ref<string[]>([])
const checkboxRows = ref<any[]>([])
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    selection="checkbox"
    v-model:checkbox-keys="checkboxKeys"
    v-model:checkbox-rows="checkboxRows"
  />
  
  <div>选中：{{ checkboxKeys }}</div>
</template>
```

#### 高级配置

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
  :selection="{
    type: 'checkbox',
    width: 60,
    title: '选择',
    fixed: true,
    selectable: (record) => record.selectable !== false
  }"
/>
```

#### 编程式控制

```typescript
const table = useTable('table')

// 重置选择
table.value.resetSelection()

// 重新加载选择状态
table.value.reloadSelection()
```

### 拖拽排序 (Draggable)

```vue
<script setup lang="ts">
const columns = defineColumns([
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' }
])

const dataLoad = defineTableLoad(({ update }) => {
  update([...data])
})

function handleChange(data: any[]) {
  console.log('新顺序：', data)
  // 保存新顺序到服务器
}
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    draggable
    @change="handleChange"
  />
</template>
```

### 导出 (Export)

#### 基础导出

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
  exportable
/>
```

#### 自定义文件名

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
  :exportable="{ filename: '用户数据.xlsx' }"
/>
```

#### 列导出配置

```typescript
const columns = defineColumns([
  {
    key: 'name',
    title: '姓名',
    exportable: {
      header: '用户名',
      width: 20
    }
  },
  {
    key: 'status',
    title: '状态',
    exportable: {
      header: '状态',
      content: (record) => record.status === 'active' ? '启用' : '禁用'
    }
  }
])
```

#### 编程式导出

```typescript
const table = useTable('table')

function handleExport() {
  table.value.export({
    filename: 'data.xlsx',
    columns: customColumns,  // 可选：自定义导出列
    source: customData       // 可选：自定义导出数据
  })
}
```

### 列折叠 (Collapsable)

```vue
<script setup lang="ts">
const columns = defineColumns([
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', collapsed: true }, // 默认折叠
  { key: 'email', title: '邮箱', collapsed: true }
])
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    collapsable
  />
</template>
```

用户可以通过工具栏按钮动态控制列的显示与隐藏。

### 虚拟滚动 (Virtual List)

大数据量场景下启用虚拟滚动以提升性能：

```vue
<TableRender
  row-key="id"
  :columns="columns"
  :data-load="dataLoad"
  :height="600"
  virtual-list
/>
```

### 自适应高度

表格自动填充父容器高度：

```vue
<div style="height: 100vh;">
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    auto-fill
  />
</div>
```

## 🎓 高级用法

### 表单集成

table-render 与 form-render 深度集成，提供强大的搜索功能：

```vue
<script setup lang="ts">
import { defineForm } from '@gopowerteam/form-render'

const searchForm = defineForm([
  {
    key: 'keyword',
    title: '关键词',
    render: r => r.input({ placeholder: '搜索姓名或邮箱' })
  },
  {
    key: 'status',
    title: '状态',
    render: r => r.select({
      options: new Map([
        ['', '全部'],
        ['active', '启用'],
        ['inactive', '禁用']
      ])
    })
  },
  {
    key: 'department',
    title: '部门',
    render: r => r.treeSelect({
      options: departmentTree,
      cache: true
    })
  },
  {
    key: 'dateRange',
    title: '创建时间',
    render: r => r.dateRange()
  }
])
</script>

<template>
  <TableRender
    row-key="id"
    :form="searchForm"
    :columns="columns"
    :data-load="dataLoad"
  />
</template>
```

### 预览与编辑

#### 数据预览

```typescript
const table = useTable('table')

// 预览数据（对话框模式）
table.value.preview({
  key: 1,
  title: '用户详情',
  mode: 'dialog'
})

// 预览数据（抽屉模式）
table.value.preview({
  key: 1,
  title: '用户详情',
  mode: 'drawer'
})

// 直接传入数据
table.value.preview({
  record: { id: 1, name: '张三' },
  title: '用户详情'
})
```

#### 数据编辑

```typescript
import { defineForm } from '@gopowerteam/form-render'

const editForm = defineForm([
  {
    key: 'name',
    title: '姓名',
    render: r => r.input(),
    rule: [{ required: true, message: '请输入姓名' }]
  },
  {
    key: 'email',
    title: '邮箱',
    render: r => r.input({ type: 'email' }),
    rule: [{ required: true, message: '请输入邮箱' }]
  }
])

// 编辑数据
async function handleEdit(record: any) {
  const result = await table.value.edit({
    key: record.id,
    form: editForm,
    title: '编辑用户',
    mode: 'dialog',
    onSubmit: async (data) => {
      await updateUser(data)
      return true // 返回 true 关闭对话框
    }
  })
  
  console.log('编辑结果：', result)
}
```

### 自定义列渲染器

创建自定义列渲染器：

```typescript
// utils/custom-render.ts
import { createColumnRender, getColumnValue } from '@gopowerteam/table-render'

export interface CustomColumnOptions {
  color?: string
  icon?: string
}

export function renderCustomColumn<T>(options?: CustomColumnOptions) {
  const render = (record: T, column: TableColumnOptions<T>) => {
    const value = getColumnValue(record, column)
    
    return (
      <div style={{ color: options?.color }}>
        {options?.icon && <i class={options.icon} />}
        {value}
      </div>
    )
  }
  
  return createColumnRender<T>('custom', render)
}
```

使用自定义渲染器：

```typescript
import { renderCustomColumn } from './utils/custom-render'

const columns = defineColumns([
  {
    key: 'status',
    title: '状态',
    render: r => renderCustomColumn({
      color: 'red',
      icon: 'icon-check'
    })
  }
])
```

### 性能优化

#### 1. 使用虚拟滚动

```vue
<TableRender
  :height="600"
  virtual-list
/>
```

#### 2. 避免不必要的重新渲染

```typescript
// ❌ 错误：每次渲染都创建新对象
const columns = computed(() => defineColumns([...]))

// ✅ 正确：使用稳定的引用
const columns = defineColumns([...])
```

#### 3. 合理设置列宽

```typescript
const columns = defineColumns([
  { key: 'name', title: '姓名', width: 150 }, // 固定宽度
  { key: 'desc', title: '描述', width: 'auto' } // 自动宽度
])
```

#### 4. 数据分页

```vue
<!-- 服务端分页 -->
<TableRender pageable />

<!-- 客户端分页（数据量大时不推荐） -->
<TableRender pageable="client" />
```

### 手动触发加载

```vue
<script setup lang="ts">
const table = useTable('table')

function handleSearch() {
  // 手动触发加载
  table.value.reload()
}

function handleReset() {
  // 重置分页和排序，然后加载
  table.value.reload({ reset: true })
}
</script>

<template>
  <TableRender
    ref="table"
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    :auto-load="false"
  />
</template>
```

## 📚 API 参考

### Props

| 属性 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| rowKey | `string` | ✅ | - | 数据主键字段名 |
| columns | `TableColumnsOptions` | ✅ | - | 列配置 |
| dataLoad | `(params: TableLoadParams) => void \| Promise` | ❌ | - | 数据加载函数 |
| autoLoad | `boolean` | ❌ | `true` | 是否自动加载数据 |
| form | `FormItemsOptions` | ❌ | - | 搜索表单配置 |
| formOptions | `TableFormSharedOptions` | ❌ | - | 表单选项 |
| pageable | `boolean \| 'client' \| 'server' \| PageableOptions` | ❌ | - | 分页配置 |
| sortable | `Record<string, 'asc' \| 'desc'>` | ❌ | - | 排序配置 |
| selection | `'radio' \| 'checkbox' \| SelectionOptions` | ❌ | - | 选择配置 |
| radioKey | `string \| number` | ❌ | - | 单选绑定值（key） |
| radioRow | `Record<string, any>` | ❌ | - | 单选绑定值（行数据） |
| checkboxKeys | `(string \| number)[]` | ❌ | - | 多选绑定值（keys） |
| checkboxRows | `Record<string, any>[]` | ❌ | - | 多选绑定值（行数据） |
| exportable | `boolean \| { filename: string }` | ❌ | `false` | 导出配置 |
| refreshable | `boolean` | ❌ | `false` | 是否显示刷新按钮 |
| draggable | `boolean` | ❌ | `false` | 是否支持拖拽 |
| collapsable | `boolean` | ❌ | `false` | 是否支持列折叠 |
| size | `'mini' \| 'small' \| 'medium' \| 'large'` | ❌ | `'large'` | 表格尺寸 |
| bordered | `boolean` | ❌ | `false` | 是否显示边框 |
| stripe | `boolean` | ❌ | `true` | 是否显示斑马纹 |
| hoverable | `boolean` | ❌ | `false` | 是否显示悬停效果 |
| height | `number` | ❌ | - | 表格高度 |
| autoFill | `boolean` | ❌ | `false` | 是否自适应高度 |
| virtualList | `boolean` | ❌ | `false` | 是否启用虚拟滚动 |
| pagePosition | `'top' \| 'bottom' \| 'all'` | ❌ | `'all'` | 分页器位置 |
| actionsPosition | `'left' \| 'right'` | ❌ | `'right'` | 工具栏位置 |
| columnsGroups | `ColumnsGroup[]` | ❌ | `[]` | 列分组配置 |
| rowClass | `(record: any) => string` | ❌ | - | 行样式类名 |
| expandable | `TableExpandable` | ❌ | - | 展开行配置 |
| grabbable | `boolean` | ❌ | `true` | 是否支持列宽拖拽 |
| alwayShowPagination | `boolean` | ❌ | `false` | 是否总是显示分页 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | `(data: TableData[], extra: TableChangeExtra) => void` | 表格数据变化（排序、筛选、拖拽等） |
| update:radio-key | `(key: string \| number) => void` | 单选 key 变化 |
| update:radio-row | `(row: Record<string, any>) => void` | 单选行数据变化 |
| update:checkbox-keys | `(keys: (string \| number)[]) => void` | 多选 keys 变化 |
| update:checkbox-rows | `(rows: Record<string, any>[]) => void` | 多选行数据变化 |

### Methods (通过 useTable)

```typescript
interface TableRenderMethods {
  // 重新加载数据
  reload: (options?: { reset?: boolean }) => Promise<void>
  
  // 预览数据
  preview: (options: {
    key?: string | number
    record?: Record<string, any>
    title?: string
    mode?: 'dialog' | 'drawer'
  }) => Promise<void>
  
  // 编辑数据
  edit: <T = DataRecord>(options: {
    key?: string | number
    record?: T
    form: FormItemsOptions
    onSubmit: (data: T) => Promise<boolean | void>
    title?: string
    mode?: 'dialog' | 'drawer'
  }) => Promise<T>
  
  // 导出数据
  export: (options?: {
    columns?: TableColumnOptions[]
    source?: DataRecord[]
    filename?: string
  }) => void
  
  // 重置选择
  resetSelection: () => void
  
  // 重新加载选择状态
  reloadSelection: () => void
  
  // 重新加载列配置
  reloadColumns: () => void
  
  // 当前表格数据（只读）
  readonly tableSource: DataRecord[]
  
  // 当前表单数据（只读）
  readonly formSource: DataRecord
  
  // 表单实例
  readonly formInstance: FormRenderInstance
}
```

### Types

#### TableColumnOptions

```typescript
interface TableColumnOptions<T> {
  key: string | keyof T          // 字段名
  title: string                   // 列标题
  index?: string                  // 数据索引路径
  fixed?: 'left' | 'right'        // 固定列
  align?: 'left' | 'center' | 'right' // 对齐方式
  width?: number | 'auto'         // 列宽度
  render?: TableColumnRender<T>   // 列渲染器
  formatter?: (record: T) => string | number | Date | undefined // 格式化函数
  ellipsis?: boolean              // 文本溢出省略
  sortable?: 'asc' | 'desc'       // 排序方式
  form?: boolean | FormItemOptions // 搜索表单配置
  collapsed?: boolean             // 是否默认折叠
  visiable?: boolean | (() => boolean) // 是否显示
  exportable?: ExportColumnOptions | boolean // 导出配置
  preview?: TableColumnPreviewOptions // 预览配置
  treeNode?: boolean              // 是否为树节点
  extraProps?: Partial<TableColumnData> // 额外的 Arco Table 列属性
}
```

#### TableLoadParams

```typescript
interface TableLoadParams {
  form: DataRecord                          // 搜索表单数据
  page?: PageableOptions & RequestPlugin   // 分页信息
  sort?: SortableOptions & RequestPlugin   // 排序信息
  update: (data: DataRecord[]) => void     // 更新数据的函数
}
```

#### PageableOptions

```typescript
interface PageableOptions {
  pageIndex: number      // 当前页码
  pageSize: number       // 每页条数
  pageSizeOpts: number[] // 每页条数选项
  pageLayouts: Array<'PrevJump' | 'PrevPage' | 'JumpNumber' | 'NextPage' | 'NextJump' | 'Sizes' | 'FullJump' | 'Total'> // 分页布局
  total: number          // 总数
  reset: () => void      // 重置函数
}
```

#### SelectionOptions

```typescript
interface SelectionOptions {
  type: 'radio' | 'checkbox'  // 选择类型
  width?: number               // 选择列宽度
  title?: string               // 选择列标题
  fixed?: boolean              // 是否固定
  selectable?: (record: any) => boolean // 是否可选
}
```

## 💡 最佳实践

### 场景1：基础数据展示

```vue
<script setup lang="ts">
const columns = defineColumns([
  { key: 'serial', title: '序号', width: 80, render: r => r.serial() },
  { key: 'name', title: '姓名', width: 150 },
  { key: 'age', title: '年龄', width: 100 },
  { key: 'email', title: '邮箱', width: 200 }
])

const dataLoad = defineTableLoad(({ update }) => {
  update([
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com' }
  ])
})
</script>

<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
  />
</template>
```

### 场景2：带搜索的表格

```vue
<script setup lang="ts">
import { defineForm } from '@gopowerteam/form-render'

const searchForm = defineForm([
  {
    key: 'keyword',
    title: '关键词',
    render: r => r.input({ placeholder: '搜索' })
  },
  {
    key: 'status',
    title: '状态',
    render: r => r.select({
      options: new Map([['', '全部'], ['active', '启用']])
    })
  }
])

const dataLoad = defineTableLoad(async ({ form, page, update }) => {
  const { data, total } = await searchUsers(form, page)
  if (page) page.total = total
  update(data)
})
</script>

<template>
  <TableRender
    row-key="id"
    :form="searchForm"
    :columns="columns"
    :data-load="dataLoad"
    pageable
  />
</template>
```

### 场景3：完整功能表格

```vue
<script setup lang="ts">
import { ref } from 'vue'

const table = useTable('table')
const selectedKeys = ref<string[]>([])

const columns = defineColumns([
  { key: 'serial', title: '序号', width: 80, render: r => r.serial() },
  { key: 'name', title: '姓名', sortable: 'asc' },
  { key: 'status', title: '状态', render: r => r.dict({ dict: statusMap, tag: 'success' }) },
  {
    key: 'actions',
    title: '操作',
    fixed: 'right',
    render: r => r.dropdown({
      content: '操作',
      options: [
        { content: '查看', onClick: (record) => table.value.preview({ key: record.id }) },
        { content: '编辑', onClick: (record) => handleEdit(record) },
        { content: '删除', confirm: true, onClick: (record) => handleDelete(record) }
      ]
    })
  }
])

const dataLoad = defineTableLoad(async ({ form, page, sort, update }) => {
  const { data, total } = await fetchUsers({ form, page, sort })
  if (page) page.total = total
  update(data)
})
</script>

<template>
  <TableRender
    ref="table"
    row-key="id"
    :form="searchForm"
    :columns="columns"
    :data-load="dataLoad"
    pageable
    exportable
    refreshable
    selection="checkbox"
    v-model:checkbox-keys="selectedKeys"
  >
    <template #actions>
      <a-button type="primary" @click="handleAdd">
        新增
      </a-button>
      <a-button @click="table.value.export()">
        导出
      </a-button>
    </template>
  </TableRender>
</template>
```

### 场景4：大数据量表格

```vue
<template>
  <TableRender
    row-key="id"
    :columns="columns"
    :data-load="dataLoad"
    :height="600"
    virtual-list
    pageable
  />
</template>
```

## 🔧 故障排查

### 问题1：数据不显示

**原因：**
- `row-key` 未设置或设置错误
- `dataLoad` 函数未调用 `update`
- 数据格式不正确

**解决方案：**

```typescript
// ✅ 正确
const dataLoad = defineTableLoad(({ update }) => {
  const data = [...]
  update(data) // 必须调用 update
})

// ❌ 错误
const dataLoad = defineTableLoad(() => {
  return [...] // 缺少 update 调用
})
```

### 问题2：分页不工作

**原因：**
- 未设置 `page.total`
- 使用了客户端分页但期望服务端分页

**解决方案：**

```typescript
const dataLoad = defineTableLoad(async ({ page, update }) => {
  const { data, total } = await fetchData()
  
  // ✅ 设置总数
  if (page) {
    page.total = total
  }
  
  update(data)
})
```

### 问题3：排序异常

**原因：**
- 列未设置 `sortable` 属性
- 服务端排序但未处理 `sort` 参数

**解决方案：**

```typescript
// 1. 设置 sortable
const columns = defineColumns([
  { key: 'name', title: '姓名', sortable: 'asc' }
])

// 2. 处理 sort 参数
const dataLoad = defineTableLoad(async ({ sort, update }) => {
  console.log('排序：', sort) // { name: 'asc' }
  const data = await fetchData({ sort })
  update(data)
})
```

### 问题4：选择状态不同步

**原因：**
- `row-key` 设置错误
- 数据更新后未重新加载选择状态

**解决方案：**

```typescript
// 确保每条数据都有唯一标识
const data = [
  { id: 1, name: '张三' }, // id 是唯一的
  { id: 2, name: '李四' }
]

// 数据更新后重新加载选择
table.value.reloadSelection()
```

### 问题5：导出失败

**原因：**
- 未安装 `exceljs` 依赖
- 列配置中 `exportable` 设置错误

**解决方案：**

```bash
# 安装依赖
pnpm add exceljs
```

```typescript
// 正确配置导出
const columns = defineColumns([
  {
    key: 'name',
    title: '姓名',
    exportable: true // 或详细配置
  }
])
```

## 📄 License

MIT License © 2024-present GoPowerTeam

## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](../../CONTRIBUTING.md)。

## 📮 反馈

如有问题或建议，请提交 [Issue](https://github.com/gopowerteam/x-render/issues)。
