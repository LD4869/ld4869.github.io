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

/**
 * 类型安全的 CodeGraph 工具类
 */
class CodeGraphUtils {
  private cg: CodeGraph;

  constructor(cg: CodeGraph) {
    this.cg = cg;
  }

  /**
   * 获取项目统计信息
   */
  getStats(): GraphStats {
    return this.cg.getStats();
  }

  /**
   * 安全的索引操作
   */
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

  /**
   * 安全的搜索操作
   */
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

  /**
   * 安全的获取调用者
   */
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

  /**
   * 安全的构建上下文
   */
  async safeBuildContext(
    input: TaskInput, 
    options?: BuildContextOptions
  ): Promise<string | any> {
    try {
      const context = await this.cg.buildContext(input, options);
      console.log("✅ Context built successfully");
      return context;
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Failed to build context:", error.message);
      }
      throw error;
    }
  }

  /**
   * 安全的获取影响范围
   */
  safeGetImpactRadius(nodeId: string, maxDepth: number = 2): Subgraph {
    try {
      const impact = this.cg.getImpactRadius(nodeId, maxDepth);
      console.log(`💥 Impact radius: ${impact.nodes.length} nodes for node ${nodeId}`);
      return impact;
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Failed to get impact radius:", error.message);
      }
      return { nodes: [], edges: [] };
    }
  }

  /**
   * 查找所有特定类型的节点
   */
  findNodesByKind(kind: string): Node[] {
    try {
      const nodes = this.cg.getNodesByKind(kind as any);
      console.log(`📝 Found ${nodes.length} nodes of kind "${kind}"`);
      return nodes;
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Failed to find nodes by kind:", error.message);
      }
      return [];
    }
  }

  /**
   * 分析代码复杂度
   */
  analyzeComplexity(): {
    mostCalledFunctions: Array<{ name: string; callers: number }>;
    mostUsedClasses: Array<{ name: string; usages: number }>;
  } {
    const functions = this.findNodesByKind('function');
    const classes = this.findNodesByKind('class');

    const functionComplexity = functions.map(func => {
      const callers = this.safeGetCallers(func.id);
      return {
        name: func.name || 'anonymous',
        callers: callers.length
      };
    }).sort((a, b) => b.callers - a.callers);

    const classUsage = classes.map(cls => {
      const callers = this.safeGetCallers(cls.id);
      return {
        name: cls.name || 'anonymous',
        usages: callers.length
      };
    }).sort((a, b) => b.usages - a.usages);

    return {
      mostCalledFunctions: functionComplexity.slice(0, 10),
      mostUsedClasses: classUsage.slice(0, 10)
    };
  }

  /**
   * 安全的文件监听控制
   */
  controlWatcher(watch: boolean = true): boolean {
    try {
      if (watch) {
        const success = this.cg.watch();
        if (success) {
          console.log("✅ File watcher started");
        } else {
          console.log("❌ Failed to start file watcher");
        }
        return success;
      } else {
        this.cg.unwatch();
        console.log("⏹️ File watcher stopped");
        return true;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Failed to control watcher:", error.message);
      }
      return false;
    }
  }

  /**
   * 安全的关闭操作
   */
  safeClose(): void {
    try {
      this.cg.close();
      console.log("✅ CodeGraph closed successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Failed to close CodeGraph:", error.message);
      }
    }
  }
}

/**
 * 完整的类型安全示例
 */
async function typeSafeExample(): Promise<void> {
  console.log("🚀 Starting type-safe CodeGraph analysis...");
  
  // 初始化选项
  const initOptions: InitOptions = {
    index: false, // 不自动索引，手动控制
    onProgress: (p: IndexProgress) => console.log(`Init progress: ${p.phase}: ${p.current}/${p.total}`)
  };

  // 打开选项
  const openOptions: OpenOptions = {
    sync: true, // 同步文件变化
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

    // 查找所有函数和类
    const allFunctions = utils.findNodesByKind('function');
    const allClasses = utils.findNodesByKind('class');
    
    console.log(`\n📝 Total functions: ${allFunctions.length}`);
    console.log(`🏗️ Total classes: ${allClasses.length}`);

    // 测试文件监听
    console.log("\n👁️ Testing file watcher...");
    utils.controlWatcher(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    utils.controlWatcher(false);

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

// 测试函数
Deno.test("test-type-safe-operations", async () => {
  const cg = await CodeGraphClass.open(".");
  const utils = new CodeGraphUtils(cg);
  
  try {
    // 测试统计信息
    const stats = utils.getStats();
    console.log(`Nodes: ${stats.nodeCount}, Edges: ${stats.edgeCount}`);
    
    // 测试搜索
    const results = utils.safeSearchNodes("test");
    console.log(`Found ${results.length} test results`);
    
    // 测试复杂度分析
    const complexity = utils.analyzeComplexity();
    console.log(`Most called function: ${complexity.mostCalledFunctions[0]?.name || 'N/A'}`);
    
  } finally {
    utils.safeClose();
  }
});

// 如果直接运行此文件，执行示例
if (import.meta.main) {
  await typeSafeExample();
}