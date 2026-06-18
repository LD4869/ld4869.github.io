# CodeGraph 导入错误修复总结

## 问题分析

用户在使用 `@colbymchenry/codegraph` 库时遇到了导入错误。经过分析，发现以下问题：

### 1. 模块类型问题
- 项目没有在 `package.json` 中指定 `"type": "module"`
- 这导致 Node.js 无法正确处理 ES 模块导入

### 2. 导入方式错误
- 该库是 CommonJS 模块，不能直接使用命名导入
- 需要先导入整个包，然后解构出 `CodeGraph` 类

## 修复步骤

### 1. 添加模块类型
在 `package.json` 中添加：
```json
{
  "type": "module",
  "dependencies": {
    "@colbymchenry/codegraph": "^1.0.1"
  }
}
```

### 2. 修复导入方式
**错误的导入方式：**
```typescript
import CodeGraph from "@colbymchenry/codegraph";  // ❌
```

**正确的导入方式：**
```typescript
import pkg from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;  // ✅
```

## 测试验证

创建了测试脚本验证修复效果：
```javascript
import pkg from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;

// 测试基本功能
console.log("CodeGraph class:", CodeGraph.name);
```

## 最终修复后的代码

```typescript
import pkg from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;

const cg = await CodeGraph.init("/path/to/project");
// 或者打开现有的索引
// const cg = await CodeGraph.open('/path/to/project');

await cg.indexAll({
  onProgress: (p) => console.log(`${p.phase}: ${p.current}/${p.total}`),
});

const results = cg.searchNodes("UserService");
const callers = cg.getCallers(results[0].node.id);
const context = await cg.buildContext("fix login bug", {
  maxNodes: 20,
  includeCode: true,
  format: "markdown",
});
const impact = cg.getImpactRadius(results[0].node.id, 2);

cg.watch(); // 自动同步文件变化
cg.unwatch(); // 停止监听
cg.close();
```

## 注意事项

1. 该库需要安装平台特定的依赖包（如 `@colbymchenry/codegraph-darwin-arm64`）
2. 初始化时需要提供有效的项目路径
3. 首次运行可能需要下载额外的语言包和语法文件
4. 在某些系统上可能需要 SQLite 支持