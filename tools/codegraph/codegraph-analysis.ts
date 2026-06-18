import pkg from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;

async function analyzeCode() {
  console.log("🔍 Code Analysis with CodeGraph");
  
  // 打开现有的 CodeGraph 项目
  const cg = await CodeGraph.open(".");
  
  // 查找所有 TypeScript 文件节点
  const sourceFiles = cg.getNodesByKind('source_file');
  console.log(`📁 Found ${sourceFiles.length} source files`);
  
  // 分析每个文件
  for (const fileNode of sourceFiles.slice(0, 5)) { // 只分析前5个文件
    console.log(`\n📄 Analyzing: ${fileNode.name}`);
    
    // 获取文件中的所有节点
    const nodesInFile = cg.getNodesInFile(fileNode.id);
    console.log(`  - Nodes in file: ${nodesInFile.length}`);
    
    // 统计节点类型
    const nodeTypes = {};
    nodesInFile.forEach(node => {
      nodeTypes[node.kind] = (nodeTypes[node.kind] || 0) + 1;
    });
    
    console.log("  - Node types:", nodeTypes);
    
    // 查找函数
    const functions = nodesInFile.filter(n => n.kind === 'function');
    if (functions.length > 0) {
      console.log(`  - Functions: ${functions.map(f => f.name).join(', ')}`);
    }
    
    // 查找类
    const classes = nodesInFile.filter(n => n.kind === 'class');
    if (classes.length > 0) {
      console.log(`  - Classes: ${classes.map(c => c.name).join(', ')}`);
    }
  }
  
  // 查找所有函数
  const allFunctions = cg.getNodesByKind('function');
  console.log(`\n📝 Total functions in project: ${allFunctions.length}`);
  
  // 查找所有类
  const allClasses = cg.getNodesByKind('class');
  console.log(`🏗️ Total classes in project: ${allClasses.length}`);
  
  // 查找所有导入
  const allImports = cg.getNodesByKind('import');
  console.log(`📦 Total imports in project: ${allImports.length}`);
  
  // 查找特定的函数模式
  const commonFunctions = ['main', 'init', 'start', 'stop', 'run'];
  for (const funcName of commonFunctions) {
    const results = cg.searchNodes(funcName);
    console.log(`\n🔍 Functions named '${funcName}': ${results.length}`);
    
    if (results.length > 0) {
      results.forEach(result => {
        console.log(`  - ${result.node.name} in ${result.node.file || 'unknown file'}`);
      });
    }
  }
  
  // 分析代码复杂度
  console.log("\n📊 Code Complexity Analysis:");
  
  // 查找最复杂的函数（最多调用者）
  const functionComplexity = allFunctions.map(func => {
    const callers = cg.getCallers(func.id);
    return {
      name: func.name,
      callers: callers.length,
      file: func.file
    };
  });
  
  functionComplexity.sort((a, b) => b.callers - a.callers);
  
  console.log("Most complex functions (by caller count):");
  functionComplexity.slice(0, 5).forEach(func => {
    console.log(`  - ${func.name}: ${func.callers} callers (${func.file || 'unknown file'})`);
  });
  
  // 查找最常用的类
  const classUsage = allClasses.map(cls => {
    const callers = cg.getCallers(cls.id);
    return {
      name: cls.name,
      callers: callers.length,
      file: cls.file
    };
  });
  
  classUsage.sort((a, b) => b.callers - a.callers);
  
  console.log("\nMost used classes:");
  classUsage.slice(0, 5).forEach(cls => {
    console.log(`  - ${cls.name}: ${cls.callers} usages (${cls.file || 'unknown file'})`);
  });
  
  // 关闭 CodeGraph
  cg.close();
  console.log("\n✅ Analysis completed!");
}

analyzeCode().catch(console.error);