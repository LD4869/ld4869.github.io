import pkg from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;

async function main() {
  console.log("🚀 Starting CodeGraph analysis...");
  
  // 打开现有的 CodeGraph 项目
  const projectPath = ".";
  const cg = await CodeGraph.open(projectPath);
  console.log("✅ CodeGraph opened");
  
  // 获取项目统计信息
  const stats = cg.getStats();
  console.log("📈 Project statistics:");
  console.log(`  - Total nodes: ${stats.nodeCount}`);
  console.log(`  - Total edges: ${stats.edgeCount}`);
  console.log(`  - Total files: ${stats.fileCount}`);
  
  // 搜索特定类型的节点
  console.log("\n🔍 Searching for TypeScript files...");
  const tsFiles = cg.getNodesByKind('source_file.ts');
  console.log(`Found ${tsFiles.length} TypeScript files`);
  
  // 搜索特定名称的节点
  console.log("\n🔍 Searching for 'UserService'...");
  const userServiceResults = cg.searchNodes("UserService");
  if (userServiceResults.length > 0) {
    console.log(`✅ Found ${userServiceResults.length} UserService nodes`);
    
    const userService = userServiceResults[0];
    console.log(`  - Name: ${userService.node.name}`);
    console.log(`  - Kind: ${userService.node.kind}`);
    console.log(`  - File: ${userService.node.file}`);
    
    // 获取调用者
    const callers = cg.getCallers(userService.node.id);
    console.log(`  - Callers: ${callers.length}`);
    
    // 获取影响范围
    const impact = cg.getImpactRadius(userService.node.id, 2);
    console.log(`  - Impact radius: ${impact.nodes.length} nodes`);
    
    // 构建上下文
    const context = await cg.buildContext("fix login bug", {
      maxNodes: 20,
      includeCode: true,
      format: "markdown",
    });
    console.log(`  - Context built: ${typeof context === 'string' ? 'markdown' : 'object'}`);
    
  } else {
    console.log("❌ No 'UserService' found in the project");
  }
  
  // 搜索其他常见模式
  console.log("\n🔍 Searching for common patterns...");
  const patterns = ["service", "controller", "model", "helper", "util"];
  
  for (const pattern of patterns) {
    const results = cg.searchNodes(pattern);
    console.log(`  - ${pattern}: ${results.length} results`);
  }
  
  // 查找所有函数
  const functions = cg.getNodesByKind('function');
  console.log(`\n📝 Total functions: ${functions.length}`);
  
  // 查找所有类
  const classes = cg.getNodesByKind('class');
  console.log(`🏗️ Total classes: ${classes.length}`);
  
  // 开始监听文件变化
  console.log("\n👁️ Starting file watcher...");
  const watching = cg.watch();
  if (watching) {
    console.log("✅ File watcher started");
    
    // 等待一下然后停止监听
    await new Promise(resolve => setTimeout(resolve, 2000));
    cg.unwatch();
    console.log("⏹️ File watcher stopped");
  } else {
    console.log("❌ Failed to start file watcher");
  }
  
  // 关闭 CodeGraph
  cg.close();
  console.log("\n🎉 CodeGraph analysis completed!");
}

main().catch(console.error);