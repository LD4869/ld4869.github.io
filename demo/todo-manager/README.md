# 待办事项管理器 Demo

## 项目概述

这是一个简单的**待办事项管理系统**，用于演示如何在项目中同时实现后端逻辑和前端展示。

该 Demo 展示了：
- ✅ **后端逻辑**：Deno + TypeScript 实现的任务管理服务
- ✅ **前端展示**：HTML/CSS/TypeScript 实现的交互式用户界面
- ✅ **类型安全**：严格的 TypeScript 类型定义
- ✅ **模块化结构**：易于扩展和复用

## 快速开始

### 1. 运行后端服务
```bash
# 进入 backend 目录
cd demo/todo-manager/backend

# 运行后端服务器
deno run --allow-net server.ts
```

服务器将在 `http://localhost:8000` 启动

### 2. 打开前端页面
```bash
# 在浏览器中打开
open demo/todo-manager/frontend/index.html
# 或者访问
http://localhost:4507/demo/todo-manager/frontend/
```

## 目录结构

```
demo/todo-manager/
├── README.md                 # 项目文档（你在看这个）
├── backend/
│   ├── server.ts            # 后端服务入口
│   ├── types.ts             # TypeScript 类型定义
│   └── handlers.ts          # API 路由处理器
├── frontend/
│   ├── index.html           # 前端页面
│   ├── styles.css           # 样式表
│   └── app.ts               # 前端应用逻辑
└── shared/
    └── types.ts             # 前后端共享类型
```

## 功能说明

### 后端 API

后端提供以下 REST API 端点：

| 方法 | 端点 | 说明 |
|------|------|------|
| `GET` | `/api/todos` | 获取所有任务 |
| `POST` | `/api/todos` | 创建新任务 |
| `PUT` | `/api/todos/:id` | 更新任务（标记完成/修改标题） |
| `DELETE` | `/api/todos/:id` | 删除任务 |

**请求/响应示例：**

创建任务：
```bash
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"完成文档"}'
```

响应：
```json
{
  "id": "1712000000001",
  "title": "完成文档",
  "completed": false,
  "createdAt": "2026-04-03T15:00:00.000Z"
}
```

### 前端功能

- 📝 **添加任务**：输入标题，按 Enter 或点击按钮添加
- ✓ **标记完成**：点击任务旁的复选框
- 🗑️ **删除任务**：点击删除按钮移除任务
- 📊 **统计信息**：显示总任务数和已完成数

## 开发指南

### 添加新的 API 端点

1. 在 `backend/types.ts` 中定义新类型
2. 在 `backend/handlers.ts` 中实现处理函数
3. 在 `backend/server.ts` 中注册路由

**示例**（添加搜索功能）：

```typescript
// handlers.ts 中
export async function handleSearch(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const todos = store.filter(t => t.title.includes(query));
  return Response.json(todos);
}

// server.ts 中
if (pathname === "/api/todos/search") {
  return await handleSearch(request);
}
```

### 修改前端样式

所有样式都在 `frontend/styles.css` 中，修改后刷新页面即可看到效果。

### 扩展数据存储

当前使用内存存储。如需持久化，可改为：
- 文件系统（`Deno.readTextFile` / `Deno.writeTextFile`）
- 数据库（PostgreSQL 等）

## 部署

### 构建为静态文件

如果需要作为 GitHub Pages 的一部分部署：

```bash
# 在项目根目录运行
deno task build:js

# 后端代码保留用于开发，前端文件会打包到 dist/
```

### 生产环境运行

```bash
# 指定数据持久化路径
deno run --allow-net --allow-read --allow-write \
  demo/todo-manager/backend/server.ts --data-file=data.json
```

## 测试

```bash
# 后端有对应的测试文件（如已添加）
deno test demo/todo-manager/backend/
```

## 下一步

这个 Demo 可以扩展为：

1. **数据持久化** - 使用文件或数据库存储
2. **用户认证** - 添加登录/注册功能
3. **分类功能** - 为任务添加标签和分类
4. **提醒功能** - 添加截止日期和提醒
5. **导出功能** - 支持 JSON/CSV 导出

## 常见问题

**Q: 为什么前端无法连接到后端？**
A: 确保后端服务器正在运行（http://localhost:8000），检查浏览器控制台错误。

**Q: 刷新页面后任务消失了？**
A: 目前是内存存储，服务器重启会清空数据。如需保留，修改后端为文件存储。

**Q: 如何改变端口？**
A: 在 `backend/server.ts` 中修改 `const PORT = 8000` 的值。

## 许可

本 Demo 代码可自由复用于项目中其他模块。
