# x-render

<p align="center">
  <strong>基于 Vue 3 + Arco Design 的企业级 UI 渲染组件库</strong>
</p>

<p align="center">
  <!-- Version Badges -->
  <a href="https://www.npmjs.com/package/@gopowerteam/modal-render">
    <img src="https://img.shields.io/npm/v/@gopowerteam/modal-render.svg?logo=npm&label=modal-render" alt="modal-render version">
  </a>
  <a href="https://www.npmjs.com/package/@gopowerteam/form-render">
    <img src="https://img.shields.io/npm/v/@gopowerteam/form-render.svg?logo=npm&label=form-render" alt="form-render version">
  </a>
  <a href="https://www.npmjs.com/package/@gopowerteam/table-render">
    <img src="https://img.shields.io/npm/v/@gopowerteam/table-render.svg?logo=npm&label=table-render" alt="table-render version">
  </a>
  <br>
  <!-- Download Badges -->
  <a href="https://www.npmjs.com/package/@gopowerteam/modal-render">
    <img src="https://img.shields.io/npm/dm/@gopowerteam/modal-render.svg?logo=npm&label=modal-render%20downloads" alt="modal-render downloads">
  </a>
  <a href="https://www.npmjs.com/package/@gopowerteam/form-render">
    <img src="https://img.shields.io/npm/dm/@gopowerteam/form-render.svg?logo=npm&label=form-render%20downloads" alt="form-render downloads">
  </a>
  <a href="https://www.npmjs.com/package/@gopowerteam/table-render">
    <img src="https://img.shields.io/npm/dm/@gopowerteam/table-render.svg?logo=npm&label=table-render%20downloads" alt="table-render downloads">
  </a>
  <br>
  <!-- License Badge -->
  <a href="https://github.com/gopowerteam/x-render/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@gopowerteam/modal-render.svg" alt="license">
  </a>
</p>

---

## 📦 包概览

### @gopowerteam/modal-render

Vue 3 模态框/抽屉渲染组件库，基于 Promise 风格 API。

**核心特性：**
- ✅ Dialog 和 Drawer 两种模式
- ✅ Promise 风格 API，支持 async/await
- ✅ 预设对话框：confirm、info、warning、error、success
- ✅ 可拖拽、全屏、自定义尺寸
- ✅ 支持嵌套模态框

**[📚 查看完整文档 →](./packages/modal-render/README.md)**

---

### @gopowerteam/form-render

基于 Vue 3 + Arco Design 的声明式表单渲染库。

**核心特性：**
- ✅ 配置化表单构建
- ✅ 12+ 字段类型（Input、Select、Date、Cascader 等）
- ✅ 响应式布局和折叠模式
- ✅ 完整的表单验证
- ✅ 异步选项加载

**[📚 查看完整文档 →](./packages/form-render/README.md)**

---

### @gopowerteam/table-render

基于 Vue 3 和 Arco Design Vue 的高性能表格渲染组件。

**核心特性：**
- ✅ 12+ 开箱即用的列渲染器
- ✅ 分页、排序、筛选
- ✅ 行选择（单选/多选）和拖拽排序
- ✅ Excel 导出
- ✅ 虚拟滚动和自适应高度

**[📚 查看完整文档 →](./packages/table-render/README.md)**

---

## 🔗 依赖关系

```mermaid
graph TD
    A[@gopowerteam/modal-render] --> B[@gopowerteam/form-render]
    A --> C[@gopowerteam/table-render]
    B --> C
    D[Vue 3] --> A
    D --> B
    D --> C
    E[Arco Design Vue] --> B
    E --> C
    F[exceljs] -.-> C

    style A fill:#e1f5ff
    style B fill:#fff4e6
    style C fill:#f3e5f5
```

**包依赖说明：**
- `modal-render` - 独立使用，无其他包依赖
- `form-render` - 可选依赖 `modal-render`（用于 dialog 模式）
- `table-render` - 依赖 `form-render` 和 `modal-render`（搜索和预览/编辑功能）

---

## 🚀 快速开始

### 安装

```bash
# 使用 pnpm（推荐）
pnpm add @gopowerteam/modal-render
pnpm add @gopowerteam/form-render
pnpm add @gopowerteam/table-render

# 或使用 npm
npm install @gopowerteam/modal-render
npm install @gopowerteam/form-render
npm install @gopowerteam/table-render
```

### 环境要求

- **Node.js**: >= 18.0.0
- **Vue**: ^3.0.0
- **Arco Design Vue**: ^2.56.3（form-render 和 table-render 需要）

---

## 📖 文档

| 包名 | 文档链接 | 版本 |
|------|---------|------|
| **@gopowerteam/modal-render** | [查看文档 →](./packages/modal-render/README.md) | v1.0.0 |
| **@gopowerteam/form-render** | [查看文档 →](./packages/form-render/README.md) | v1.0.0 |
| **@gopowerteam/table-render** | [查看文档 →](./packages/table-render/README.md) | v1.0.0 |

---

## 🛠️ 开发指南

### 环境要求

- **Node.js**: >= 24.0.0
- **pnpm**: >= 10.24.0

### 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm run dev

# 构建所有包
pnpm run build

# 代码检查
pnpm run lint

# 清理依赖
pnpm run clean
```

### 项目结构

```
x-render/
├── packages/              # 组件包
│   ├── modal-render/     # 模态框组件
│   ├── form-render/      # 表单组件
│   └── table-render/     # 表格组件
├── apps/                 # 应用
│   └── playground/       # 开发测试环境
├── turbo.json            # Turborepo 配置
└── package.json          # Monorepo 根配置
```

### 发布流程

本项目使用 [Changesets](https://github.com/changesets/changesets) 管理版本和发布。

```bash
# 1. 创建 changeset
pnpm run cs

# 2. 版本更新
pnpm run cs

# 3. 发布到 npm
pnpm run publish-packages
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交规范

本项目使用 [Commitizen](https://github.com/commitizen/cz-cli) 规范化提交信息。

```bash
# 使用交互式提交
pnpm run commit
```

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`pnpm run commit`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 License

[MIT](./LICENSE) © 2024-present

---

## 🔗 相关链接

- [GitHub](https://github.com/gopowerteam/x-render)
- [Issues](https://github.com/gopowerteam/x-render/issues)
- [作者](mailto:2037630@gmail.com)
