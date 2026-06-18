import pkg from "@colbymchenry/codegraph";
import { 
  CodeGraph, 
  IndexProgress, 
  SearchResult, 
  Subgraph, 
  BuildContextOptions,
  TaskInput 
} from "@colbymchenry/codegraph";
const { CodeGraph: CodeGraphClass } = pkg;

/**
 * 初始化项目
 * @param projectPath 项目路径, 默认`.`
 */
async function initCodeGraph(projectPath?: string): Promise<CodeGraph> {
  projectPath = projectPath || ".";
  try {
    const cg = await CodeGraphClass.init(projectPath);
    console.log("CodeGraph initialized successfully");
    return cg;
  } catch (error) {
    if (error instanceof Error && error.message.includes("CodeGraph already initialized")) {
      const cg = await CodeGraphClass.open(projectPath);
      return cg;
    } else {
      throw error;
    }
  }
}

/**
 * 索引所有文件
 * @param cg CodeGraph 实例
 */
async function indexAll(cg: CodeGraph): Promise<void> {
  await cg.indexAll({
    onProgress: (p: IndexProgress) => console.log(`${p.phase}: ${p.current}/${p.total}`),
  });
}

/**
 * 搜索节点
 * @param cg CodeGraph 实例
 * @param query 搜索查询
 */
async function searchNodes(cg: CodeGraph, query: string): Promise<SearchResult[]> {
  return cg.searchNodes(query);
}

/**
 * 获取调用者
 * @param cg CodeGraph 实例
 * @param nodeId 节点ID
 */
function getCallers(cg: CodeGraph, nodeId: string) {
  return cg.getCallers(nodeId);
}

/**
 * 构建上下文
 * @param cg CodeGraph 实例
 * @param input 任务输入
 * @param options 构建选项
 */
async function buildContext(
  cg: CodeGraph, 
  input: TaskInput, 
  options?: BuildContextOptions
): Promise<string | any> {
  return cg.buildContext(input, options);
}

/**
 * 获取影响范围
 * @param cg CodeGraph 实例
 * @param nodeId 节点ID
 * @param maxDepth 最大深度
 */
function getImpactRadius(cg: CodeGraph, nodeId: string, maxDepth: number = 2): Subgraph {
  return cg.getImpactRadius(nodeId, maxDepth);
}

/**
 * 文件监听控制
 * @param cg CodeGraph 实例
 * @param watch 是否监听
 */
function controlFileWatcher(cg: CodeGraph, watch: boolean = true): void {
  if (watch) {
    cg.watch();
    console.log("File watcher started");
  } else {
    cg.unwatch();
    console.log("File watcher stopped");
  }
}

/**
 * 关闭 CodeGraph
 * @param cg CodeGraph 实例
 */
function closeCodeGraph(cg: CodeGraph): void {
  cg.close();
  console.log("CodeGraph closed successfully");
}

/**
 * 完整的 CodeGraph 使用示例
 */
async function codeGraphExample(): Promise<void> {
  console.log("🚀 Starting CodeGraph analysis...");
  
  // 初始化
  const cg = await initCodeGraph();
  
  try {
    // 索引所有文件
    console.log("📊 Indexing project files...");
    await indexAll(cg);
    
    // 搜索特定节点
    console.log("🔍 Searching for 'UserService'...");
    const results = await searchNodes(cg, "UserService");
    
    if (results.length > 0) {
      const userService = results[0];
      console.log(`✅ Found UserService: ${userService.node.name}`);
      
      // 获取调用者
      const callers = getCallers(cg, userService.node.id);
      console.log(`📞 Found callers: ${callers.length}`);
      
      // 构建上下文
      console.log("🏗️ Building context...");
      const context = await buildContext(cg, "fix login bug", {
        maxNodes: 20,
        includeCode: true,
        format: "markdown",
      });
      console.log("✅ Context built successfully");
      
      // 获取影响范围
      const impact = getImpactRadius(cg, userService.node.id, 2);
      console.log(`💥 Impact radius: ${impact.nodes.length} nodes`);
      
    } else {
      console.log("❌ No 'UserService' found in the project");
    }
    
    // 启动文件监听（短暂测试）
    console.log("👁️ Testing file watcher...");
    controlFileWatcher(cg, true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    controlFileWatcher(cg, false);
    
  } finally {
    // 确保关闭
    closeCodeGraph(cg);
  }
}

// 测试函数
Deno.test("test-indexAll-success", async () => {
  const cg = await initCodeGraph();
  console.log("CodeGraph instance:", cg.constructor.name);
  await indexAll(cg);
  closeCodeGraph(cg);
});

Deno.test("test-searchNodes", async () => {
  const cg = await initCodeGraph();
  const results = await searchNodes(cg, "UserService");
  console.log(`Found ${results.length} UserService nodes`);
  closeCodeGraph(cg);
});

// 如果直接运行此文件，执行示例
if (import.meta.main) {
  await codeGraphExample();
}