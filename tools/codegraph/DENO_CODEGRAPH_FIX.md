# CodeGraph Deno 环境导入和运行问题修复

## 问题概述

用户在使用 Deno 环境运行 `@colbymchenry/codegraph` 库时遇到导入错误：
```
Import "@colbymchenry/codegraph" not a dependency
hint: If you want to use a JSR or npm package, try running `deno add jsr:@colbymchenry/codegraph` or `deno add npm:@colbymchenry/codegraph`
```

## 解决方案

### 1. 安装依赖包

使用 Deno 的包管理器添加依赖：
```bash
deno add npm:@colbymchenry/codegraph
```

这会自动：
- 安装主包：`@colbymchenry/codegraph@1.0.1`
- 安装平台特定包：`@colbymchenry/codegraph-darwin-arm64@1.0.1`

### 2. 配置 deno.jsonc

在 `deno.jsonc` 文件中添加导入映射：
```jsonc
{
  "imports": {
    "@colbymchenry/codegraph": "npm:@colbymchenry/codegraph@^1.0.1",
    "@colbymchenry/codegraph-darwin-arm64": "npm:@colbymchenry/codegraph-darwin-arm64@^1.0.1",
    "@std/assert": "jsr:@std/assert@^1.0.13",
    "@std/csv": "jsr:@std/csv@^1.0.6"
  }
}
```

### 3. 正确的导入方式

**❌ 错误的导入方式：**
```typescript
import CodeGraph from "@colbymchenry/codegraph";  // ❌
```

**✅ 正确的导入方式：**
```typescript
import pkg from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;
```

### 4. 运行权限

CodeGraph 需要以下权限：
```bash
deno run --allow-read --allow-write --allow-sys --allow-env your-script.ts
```

## 完整示例

### 基本使用示例
```typescript
import pkg from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;

async function main() {
  // 初始化 CodeGraph
  const cg = await CodeGraph.init(".");
  console.log("✅ CodeGraph initialized");
  
  // 索引项目
  await cg.indexAll({
    onProgress: (p) => console.log(`${p.phase}: ${p.current}/${p.total}`),
  });
  
  // 搜索节点
  const results = cg.searchNodes("UserService");
  console.log(`Found ${results.length} UserService nodes`);
  
  // 关闭
  cg.close();
}

main().catch(console.error);
```

### 高级分析示例
```typescript
import pkg from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;

async function analyzeProject() {
  // 打开现有项目
  const cg = await CodeGraph.open(".");
  
  // 获取统计信息
  const stats = cg.getStats();
  console.log(`Nodes: ${stats.nodeCount}, Edges: ${stats.edgeCount}`);
  
  // 查找所有函数
  const functions = cg.getNodesByKind('function');
  console.log(`Total functions: ${functions.length}`);
  
  // 查找所有类
  const classes = cg.getNodesByKind('class');
  console.log(`Total classes: ${classes.length}`);
  
  // 分析复杂度
  const complexFunctions = functions.map(func => {
    const callers = cg.getCallers(func.id);
    return { name: func.name, callers: callers.length };
  }).sort((a, b) => b.callers - a.callers);
  
  console.log("Most complex functions:", complexFunctions.slice(0, 5));
  
  cg.close();
}

analyzeProject().catch(console.error);
```

## 运行结果示例

成功运行后，你会看到类似这样的输出：

```
🚀 Starting CodeGraph analysis...
✅ CodeGraph opened
📈 Project statistics:
  - Total nodes: 248
  - Total edges: 607
  - Total files: 36

📝 Total functions in project: 40
🏗️ Total classes in project: 5
📦 Total imports in project: 58

📊 Code Complexity Analysis:
Most complex functions (by caller count):
  - snakeToCamel: 21 callers
  - camelToSnake: 13 callers
  - updateStatus: 11 callers
```

## 注意事项

1. **首次运行**：CodeGraph 首次运行时会创建 `.codegraph` 目录并索引项目文件
2. **权限要求**：需要读写权限来创建索引文件
3. **平台包**：需要安装对应平台的包（如 `@colbymchenry/codegraph-darwin-arm64`）
4. **性能**：大型项目索引可能需要一些时间
5. **文件监听**：可以使用 `cg.watch()` 来监听文件变化

## 故障排除

### 如果遇到 "CodeGraph already initialized" 错误：
```typescript
// 使用 CodeGraph.open() 而不是 CodeGraph.init()
const cg = await CodeGraph.open(".");
```

### 如果遇到只读文件系统错误：
```typescript
// 确保在可写的目录中运行
const cg = await CodeGraph.init("./my-project");
```

### 如果找不到包：
```bash
# 重新安装依赖
deno add npm:@colbymchenry/codegraph
```

现在 CodeGraph 应该可以在 Deno 环境中正常工作了！