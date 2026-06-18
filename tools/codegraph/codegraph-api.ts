import pkg from "@colbymchenry/codegraph";
import { IndexProgress } from "@colbymchenry/codegraph";
const { CodeGraph } = pkg;

/**
 * 初始化项目 `codegraph init`
 * @param projectPath 项目路径, 默认`.`
 */
async function initCodeGraph(projectPath?: string) {
  projectPath = projectPath || ".";
  try {
    const cg = await CodeGraph.init(projectPath);
    console.log("CodeGraph initialized successfully");
    return cg;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("CodeGraph already initialized")
    ) {
      const cg = await CodeGraph.open(projectPath);
      return cg;
    } else {
      throw error;
    }
  }
}

/**
 * 索引所有文件 `codegraph index`
 * @param cg CodeGraph 实例
 */
async function indexAll(cg: CodeGraph) {
  await cg.indexAll({
    onProgress: (p: IndexProgress) =>
      console.log(`${p.phase}: ${p.current}/${p.total}...`),
  });
}

async function search(cg: CodeGraph) {
  return cg.searchNodes("data");
}

Deno.test("test-indexAll-success", async () => {
  const cg = await initCodeGraph();

  await indexAll(cg);
  const res = await search(cg);
  console.log(res)
});

// const results = cg.searchNodes("UserService");
// if (results.length > 0) {
//   const callers = cg.getCallers(results[0].node.id);
//   console.log("Found callers:", callers.length);

//   const context = await cg.buildContext("fix login bug", {
//     maxNodes: 20,
//     includeCode: true,
//     format: "markdown",
//   });
//   console.log("Context built successfully");

//   const impact = cg.getImpactRadius(results[0].node.id, 2);
//   console.log("Impact radius nodes:", impact.nodes.length);
// } else {
//   console.log("No 'UserService' found in the project");
// }

// cg.watch(); // auto-sync on file changes
// cg.unwatch(); // stop watching
// cg.close();
// console.log("CodeGraph closed successfully");
