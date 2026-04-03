# Demo 框架模板说明

这个项目采用了一个标准的 Demo 框架模板。每个 Demo 都包含以下结构：

## 标准项目结构

```
demo/[demo-name]/
├── README.md                      # 项目详细文档
├── QUICKSTART.md                  # 快速开始指南
├── backend/
│   ├── server.ts                  # 后端入口（HTTP 服务器）
│   ├── handlers.ts                # API 路由处理
│   └── types.ts                   # 后端类型定义
├── frontend/
│   ├── index.html                 # 前端 HTML 页面
│   ├── app.ts                     # 前端应用逻辑
│   └── styles.css                 # 前端样式
└── shared/
    └── types.ts                   # 前后端共享类型
```

## 模板特点

✅ **完整的全栈实现**
- 后端：Deno + TypeScript HTTP 服务器
- 前端：HTML + CSS + TypeScript
- 共享类型：保证前后端数据一致

✅ **开箱即用**
- 无需额外配置
- 包含完整示例代码
- 提供 CORS 支持

✅ **易于扩展**
- 清晰的文件组织
- 模块化的代码结构
- 明确的接口定义

✅ **完整文档**
- README.md - 详细功能说明
- QUICKSTART.md - 快速开始指南
- API 文档 - 清晰的接口说明

## 当前示例：待办事项管理器

已在 `demo/todo-manager/` 中实现了完整示例：

**后端功能**：
- ✅ CRUD API 操作
- ✅ CORS 支持
- ✅ 错误处理
- ✅ 内存存储

**前端功能**：
- ✅ 任务列表展示
- ✅ 添加/删除/编辑
- ✅ 实时统计
- ✅ 响应式设计

## 快速启动示例 Demo

```bash
# 1. 启动后端
cd demo/todo-manager/backend
deno run --allow-net server.ts

# 2. 在另一个终端启动前端
deno task dev

# 3. 打开浏览器
http://localhost:4507/demo/todo-manager/frontend/index.html
```

## 创建新的 Demo

按照此步骤创建新 Demo（基于 todo-manager 模板）：

### 1. 创建目录结构
```bash
mkdir -p demo/[your-demo]/backend
mkdir -p demo/[your-demo]/frontend
mkdir -p demo/[your-demo]/shared
```

### 2. 复制模板文件

从 `demo/todo-manager/` 复制以下文件到新 Demo：

- `backend/server.ts` → 修改路由
- `backend/types.ts` → 修改数据结构
- `backend/handlers.ts` → 修改业务逻辑
- `frontend/index.html` → 修改 UI
- `frontend/app.ts` → 修改前端逻辑
- `frontend/styles.css` → 自定义样式
- `shared/types.ts` → 定义共享类型
- `README.md` → 编写文档
- `QUICKSTART.md` → 编写启动指南

### 3. 更新类型和逻辑

修改各文件中的数据结构和业务逻辑以适配新功能。

### 4. 测试

```bash
deno check demo/[your-demo]/backend/server.ts
deno check demo/[your-demo]/frontend/app.ts
```

## Demo 命名约定

- 使用 kebab-case：`demo/todo-manager/` ✅
- 避免大写字母：`demo/TodoManager/` ❌
- 简洁明确：`demo/calculator/` ✅
- 过于简洁：`demo/app/` ❌

## 典型使用场景

这个模板适用于各种 Demo：

| Demo | 说明 |
|------|------|
| `todo-manager` | 任务管理系统（完整示例）|
| `calculator` | 计算器应用 |
| `weather-app` | 天气查询应用 |
| `markdown-preview` | Markdown 预览器 |
| `chat-app` | 简单聊天应用 |
| `file-uploader` | 文件上传工具 |
| `color-picker` | 配色工具 |

## 常见问题

**Q: 为什么前端和后端分开？**
A: 这样可以清晰地展示前后端分离架构，便于理解和维护。

**Q: 可以使用其他框架吗？**
A: 可以，但推荐保持简洁，使用原生 HTML/CSS/TypeScript。

**Q: 如何处理数据持久化？**
A: 见各 Demo 的 README.md，通常支持文件存储或数据库。

**Q: 能在 GitHub Pages 上部署吗？**
A: 前端可以，后端需要单独部署或使用 Deno Deploy。

## 下一步

- 查看 `demo/todo-manager/` 了解完整实现
- 阅读 `demo/todo-manager/README.md` 学习更多功能
- 按照模板创建新的 Demo
