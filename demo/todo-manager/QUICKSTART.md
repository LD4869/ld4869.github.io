# 快速开始

## 一键启动

### 方式 1：分别启动后端和前端

**终端 1 - 启动后端服务器**
```bash
cd demo/todo-manager/backend
deno run --allow-net server.ts
```

输出应显示：
```
🚀 服务器启动在 http://localhost:8000
📝 API 文档：GET/POST /api/todos, PUT/DELETE /api/todos/:id
```

**终端 2 - 启动前端**
```bash
# 方式 A：使用 Copilot 开发服务器
deno task dev

# 然后在浏览器打开
http://localhost:4507/demo/todo-manager/frontend/index.html
```

### 方式 2：直接打开前端文件

```bash
# 在浏览器中打开（需要后端同时运行）
open demo/todo-manager/frontend/index.html
```

或者在浏览器地址栏输入：
```
file:///Users/apple/git-project/ld4869.github.io/demo/todo-manager/frontend/index.html
```

## 测试 API

使用 curl 测试后端：

### 创建任务
```bash
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"完成项目"}'
```

### 获取所有任务
```bash
curl http://localhost:8000/api/todos
```

### 标记任务完成
```bash
curl -X PUT http://localhost:8000/api/todos/1712000000001 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### 删除任务
```bash
curl -X DELETE http://localhost:8000/api/todos/1712000000001
```

## 常见问题

**Q: 前端显示"❌ 无法连接服务器"？**
- 确保后端服务器正在运行（http://localhost:8000）
- 检查浏览器控制台（F12）是否有错误信息

**Q: 刷新页面后任务消失？**
- 这是正常现象，当前使用内存存储
- 服务器重启会清空所有数据
- 如需保留数据，可改为文件存储（见 README.md）

**Q: 如何修改 API 端口？**
- 编辑 `backend/server.ts` 中的 `const PORT = 8000`
- 同时更新 `frontend/app.ts` 中的 `const API_URL`

## 下一步

参见 README.md 了解更多信息。
