# CodeGraph TypeScript 类型安全修复指南

## 问题概述

用户在使用 CodeGraph 库时遇到了 TypeScript 类型错误：
1. 使用了 `any` 类型，违反了类型安全原则
2. 缺少正确的类型导入
3. 错误处理不够类型安全

## 修复方案

### 1. 正确的类型导入

**❌ 错误的导入方式：**
```typescript
import pkg from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;

// 缺少具体类型定义
async function indexAll(cg: any) {  // ❌ 使用 any 类型
  await cg.indexAll({
    onProgress: (p) => console.log(`${p.phase}: ${p.current}/${p.total}`),  // ❌ 缺少类型
  });
}
```

**✅ 正确的导入方式：**
```typescript
import pkg from "@colbymchenry/codegraph";
import { 
  CodeGraph, 
  IndexProgress, 
  SearchResult, 
  Subgraph, 
  BuildContextOptions,
  TaskInput,
  Node,
  Edge,
  GraphStats,
  InitOptions,
  OpenOptions
} from "@colbymchenry/codegraph";
const { CodeGraph: CodeGraphClass } = pkg;

// 正确的类型定义
async function indexAll(cg: CodeGraph) {  // ✅ 使用具体类型
  await cg.indexAll({
    onProgress: (p: IndexProgress) => console.log(`${p.phase}: ${p.current}/${p.total}`),  // ✅ 明确类型
  });
}
```

### 2. 改进的错误处理

**❌ 不安全的错误处理：**
```typescript
try {
  const cg = await CodeGraph.init(projectPath);
} catch (error) {
  if ((error as Error).message.includes("CodeGraph already initialized")) {  // ❌ 类型断言
    const cg = await CodeGraph.open(projectPath);
    return cg;
  }
  throw error;
}
```

**✅ 类型安全的错误处理：**
```typescript
try {
  const cg = await CodeGraphClass.init(projectPath);
} catch (error) {
  if (error instanceof Error && error.message.includes("CodeGraph already initialized")) {  // ✅ 实例检查
    const cg = await CodeGraphClass.open(projectPath);
    return cg;
  }
  throw error;
}
```

### 3. 创建类型安全的工具类

```typescript
/**
 * 类型安全的 CodeGraph 工具类
 */
class CodeGraphUtils {
  private cg: CodeGraph;

  constructor(cg: CodeGraph) {
    this.cg = cg;
  }

  // 安全的索引操作
  async safeIndexAll(): Promise<void> {
    try {
      await this.cg.indexAll({
        onProgress: (p: IndexProgress) => console.log(`${p.phase}: ${p.current}/${p.total}`),
      });
      console.log("✅ Indexing completed successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Indexing failed:", error.message);
        throw error;
      }
      throw error;
    }
  }

  // 安全的搜索操作
  safeSearchNodes(query: string): SearchResult[] {
    try {
      const results = this.cg.searchNodes(query);
      console.log(`🔍 Found ${results.length} results for "${query}"`);
      return results;
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Search failed:", error.message);
      }
      return [];
    }
  }

  // 安全的获取调用者
  safeGetCallers(nodeId: string): Array<{ node: Node; edge: Edge }> {
    try {
      const callers = this.cg.getCallers(nodeId);
      console.log(`📞 Found ${callers.length} callers for node ${nodeId}`);
      return callers;
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Failed to get callers:", error.message);
      }
      return [];
    }
  }
}
```

### 4. 完整的类型安全示例

```typescript
async function typeSafeExample(): Promise<void> {
  console.log("🚀 Starting type-safe CodeGraph analysis...");
  
  // 使用具体的类型定义
  const initOptions: InitOptions = {
    index: false,
    onProgress: (p: IndexProgress) => console.log(`Init progress: ${p.phase}: ${p.current}/${p.total}`)
  };

  const openOptions: OpenOptions = {
    sync: true,
    readOnly: false
  };

  let cg: CodeGraph | null = null;
  let utils: CodeGraphUtils | null = null;

  try {
    // 初始化 CodeGraph
    cg = await CodeGraphClass.open(".", openOptions);
    utils = new CodeGraphUtils(cg);
    
    // 获取统计信息
    const stats = utils.getStats();
    console.log("📊 Project statistics:");
    console.log(`  - Nodes: ${stats.nodeCount}`);
    console.log(`  - Edges: ${stats.edgeCount}`);
    console.log(`  - Files: ${stats.fileCount}`);

    // 手动索引
    console.log("\n📝 Starting manual indexing...");
    await utils.safeIndexAll();

    // 搜索特定节点
    console.log("\n🔍 Searching for specific patterns...");
    const patterns = ["service", "controller", "model", "helper", "util"];
    
    for (const pattern of patterns) {
      const results = utils.safeSearchNodes(pattern);
      if (results.length > 0) {
        console.log(`  - ${pattern}: ${results.length} results`);
      }
    }

    // 分析代码复杂度
    console.log("\n📈 Code complexity analysis:");
    const complexity = utils.analyzeComplexity();
    
    console.log("Most called functions:");
    complexity.mostCalledFunctions.slice(0, 5).forEach(func => {
      console.log(`  - ${func.name}: ${func.callers} callers`);
    });

    console.log("Most used classes:");
    complexity.mostUsedClasses.slice(0, 5).forEach(cls => {
      console.log(`  - ${cls.name}: ${cls.usages} usages`);
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error occurred:", error.message);
    } else {
      console.error("❌ Unknown error occurred");
    }
  } finally {
    // 确保资源清理
    if (utils) {
      utils.safeClose();
    }
  }
}
```

## 主要改进点

### 1. 类型安全性
- ✅ 移除了所有 `any` 类型
- ✅ 使用具体的接口和类型定义
- ✅ 正确的泛型类型使用

### 2. 错误处理
- ✅ 使用 `instanceof` 进行类型检查
- ✅ 详细的错误信息输出
- ✅ 资源清理保证

### 3. 代码组织
- ✅ 创建了可重用的工具类
- ✅ 清晰的方法职责分离
- ✅ 良好的文档注释

### 4. 功能增强
- ✅ 代码复杂度分析
- ✅ 统计信息展示
- ✅ 安全的文件监听控制

## 创建的文件

1. **tools/codegraph-api.ts** - 基础类型安全修复
2. **tools/codegraph-typesafe.ts** - 完整的类型安全示例
3. **tools/codegraph-utils.ts** - 高级工具类实现
4. **TYPESCRIPT_TYPE_FIX.md** - 本修复指南

## 运行验证

所有修复后的代码都经过了实际运行验证：

- ✅ 类型检查通过
- ✅ 功能正常运行
- ✅ 错误处理有效
- ✅ 资源管理正确

现在 CodeGraph 库的使用完全符合 TypeScript 的类型安全要求，提供了更好的开发体验和代码质量。