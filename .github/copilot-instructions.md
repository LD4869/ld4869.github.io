# ld4869.github.io Copilot 使用指南

## 构建、测试和 Lint 命令

### Deno 任务

```bash
# 将 TypeScript 打包为 JavaScript（填充 dist/ 目录）
deno task build:js

# 在本地启动开发服务器（固定端口 4507）
deno task dev

# 直接运行井字棋游戏
deno task game-tictactoe
```

### 运行测试

```bash
# 运行所有测试
deno test

# 运行特定目录下的测试
deno test tools/

# 运行单个测试文件
deno test tools/date.test.ts

# 以详细输出运行测试
deno test --verbose
```

### 无 Linting/格式化工具

本项目未配置 ESLint、Prettier 等工具。代码遵循 TypeScript 严格模式和手动约定。

## 项目概览

这是一个**基于 Deno 的个人作品集和学习平台**，集合了：

- 静态网站（GitHub Pages 部署）
- 具有 AI 功能的交互式游戏（井字棋与 Q-Learning）
- 算法练习（LeetCode 解题）
- 工具库（日期解析、CSV 处理）
- 学习资源（包含微积分、SQL、Linux 指南的知识库）
- **Demo 框架**（完整的全栈示例项目）

## 架构设计

### 核心技术栈

- **运行时**：Deno（TypeScript 优先）
- **前端**：HTML/CSS/TypeScript（原生，无框架）
- **构建工具**：自定义 Deno 打包器（`bundle.ts`）
- **测试框架**：内置 Deno.test()，使用 @std/assert
- **托管方式**：GitHub Pages

### 目录结构

| 目录              | 说明                                               |
| ----------------- | -------------------------------------------------- |
| `src/`            | 前端应用代码（菜单、DOM 交互）                     |
| `dist/`           | 编译生成的 JavaScript 文件（由 build:js 任务生成） |
| `styles/`         | CSS 样式表                                         |
| `tools/`          | 可复用工具库（date.ts、csv.ts）及其测试            |
| `game/tictactoe/` | 井字棋 AI 游戏及训练流程                           |
| `leetcode/`       | 算法解题及测试                                     |
| `demo/`           | 完整的 Demo 项目示例（后端 + 前端）                |
| `knowledge/`      | 学习文档（中文）                                   |
| `step/`           | 配置指南（PostgreSQL、ESP32）                      |
| `question/`       | Q&A 资源                                           |

### 关键模块

**工具库** (`tools/`)：
- `date.ts` - 日期解析和格式化工具
- `csv.ts` - 使用标准库进行 CSV 读写
- 纯工具函数，经过充分测试

**游戏** (`game/tictactoe/`)：
- `board.ts` - 游戏棋盘状态管理
- `qagent.ts` - Q-Learning 智能体实现
- `train.ts` - AI 智能体训练循环
- `play.ts` - 人机对战逻辑
- 遵循关注分离原则：逻辑、AI、训练、UI 分离

**前端** (`src/`)：
- `main.ts` - 汉堡菜单和侧边栏交互
- `base-types.ts` - 共享的 TypeScript 类型定义

**Demo 项目** (`demo/`)：
- 标准化的全栈项目框架（后端 + 前端）
- 每个 Demo 包含：`backend/`（HTTP 服务器）、`frontend/`（HTML/CSS/TS）、`shared/`（共享类型）
- 当前示例：`demo/todo-manager/`（待办事项管理系统，含 CRUD API）
- 其他示例可基于此模板创建（参考 `DEMO_TEMPLATE.md`）

## 关键约定

### 文件组织

- 测试文件与实现文件放在一起，使用 `.test.ts` 后缀
- 类型定义放在 `base-types.ts` 或各模块的 `types.ts` 中
- 代码用英文编写，文档/注释用中文
- Demo 项目使用 kebab-case 命名（例：`demo/todo-manager/`）

### 类型安全

- `deno.jsonc` 中启用 TypeScript 严格模式
- 不允许隐式 any，期望完整的类型覆盖
- 尽可能使用 Deno 标准库的类型

### 测试模板

```typescript
import { assertEquals, assertThrows } from "@std/assert";

Deno.test("描述", () => {
  // 测试内容
});
```

### 模块导入

- 本地模块使用相对导入：`import { func } from "./module.ts"`
- 标准库使用 JSR 导入：`import { assert } from "@std/assert"`
- 所有导入必须包含 `.ts` 扩展名

### Demo 项目结构

每个 Demo 项目遵循标准结构：

```
demo/[name]/
├── README.md                # 项目文档（中文）
├── QUICKSTART.md            # 快速开始指南
├── backend/
│   ├── server.ts           # HTTP 服务器入口（Deno.serve）
│   ├── handlers.ts         # API 路由处理
│   └── types.ts            # 后端类型定义
├── frontend/
│   ├── index.html          # 前端页面
│   ├── app.ts              # 前端应用逻辑
│   └── styles.css          # 样式表（响应式）
└── shared/
    └── types.ts            # 前后端共享类型
```

**后端特点：**
- 使用 Deno 内置 HTTP 服务器（`Deno.serve`）
- 提供 RESTful API（GET、POST、PUT、DELETE）
- 包含 CORS 支持

**前端特点：**
- 纯 HTML/CSS/TypeScript（无框架）
- 从后端 API 获取数据
- 响应式设计

### 人工智能/机器学习

井字棋游戏采用 Q-Learning 算法：

- 智能体通过自我对战学习（train.ts）
- 状态表示：棋盘位置作为键值
- 奖励：赢得 +1，失败 -1，平手 0
- 策略以 JSON 格式存储，游戏会话间持续更新

## 重要说明

- **仅 Deno**：本项目只使用 Deno，不要添加 Node.js 依赖
- **需要构建步骤**：修改 `src/` 后，运行 `deno task build:js` 将 TypeScript 打包到 `dist/` 文件夹供网站使用
- **端口 4507**：开发服务器使用固定端口进行本地测试
- **GitHub Pages**：确保 `dist/` 中的编译文件已提交
- **Demo 后端端口**：默认为 8000（可在 `backend/server.ts` 中修改）

## Demo 项目指南

参考 `DEMO_TEMPLATE.md` 了解如何创建新的 Demo 项目。

### 快速启动现有 Demo

```bash
# 启动后端
cd demo/[name]/backend
deno run --allow-net server.ts

# 启动前端（新终端）
deno task dev

# 打开浏览器
http://localhost:4507/demo/[name]/frontend/index.html
```

### 创建新 Demo

1. 复制 `demo/todo-manager/` 目录结构
2. 修改 `backend/`、`frontend/`、`shared/` 中的代码
3. 编写 `README.md` 和 `QUICKSTART.md`
4. 确保代码通过 `deno check` 验证
