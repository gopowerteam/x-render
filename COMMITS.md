# Commit Message Guidelines

## 提交信息规范

- 使用约定式提交（Conventional Commits）格式
- 使用以下类型：feat、fix、docs、style、refactor、perf、test、chore、revert
- 提交信息使用中文编写
- 在提交信息中使用表情符号
- 主题保持简洁（最多 20 个字符，不加句号）
- 正文保持简洁（最多 50 个字符，不加句号）

## 格式示例

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型说明

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码格式化（不影响功能）
- **refactor**: 重构代码
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建工具、依赖更新等
- **revert**: 回滚提交

### 示例

```
feat(auth): 添加用户登录功能 ✨

实现了基于 JWT 的用户认证系统
- 添加登录表单组件
- 集成后端认证接口
- 添加 token 自动刷新机制

Closes #123
```
