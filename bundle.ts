// bundle.ts - Deno 打包脚本，自动过滤空文件
import { walk, existsSync } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { join, basename } from "https://deno.land/std@0.224.0/path/mod.ts";

// 配置项（可根据项目修改）
const SRC_DIR = "src";
const DIST_DIR = "dist";
const TS_PATTERN = ".*\\.ts";

// 检查并创建dist目录
if (!existsSync(DIST_DIR)) Deno.mkdirSync(DIST_DIR, { recursive: true });
const d = new RegExp(TS_PATTERN);

// 遍历src目录下的所有ts文件
for await (const entry of walk(SRC_DIR, { match: [d] })) {
  // 1. 过滤空文件（文件大小为0）
  const fileInfo = await Deno.stat(entry.path);
  if (fileInfo.size === 0) {
    console.log(`[过滤] 空文件: ${entry.path}`);
    continue;
  }

  // 2. 过滤仅含空白/注释的文件（可选，按需开启）
  const content = await Deno.readTextFile(entry.path);
  const pureContent = content
    .replace(/\/\/.*$/gm, "") // 移除单行注释
    .replace(/\/\*[\s\S]*?\*\//g, "") // 移除多行注释
    .replace(/\s+/g, ""); // 移除所有空白字符
  if (pureContent === "") {
    console.log(`[过滤] 仅含注释/空白的文件: ${entry.path}`);
    continue;
  }

  // 3. 对有效文件执行打包
  const outFile = join(DIST_DIR, basename(entry.path).replace(".ts", ".js"));

  // 执行deno bundle命令
  const process = new Deno.Command(Deno.execPath(), {
    args: [
      "bundle",
      "--config",
      "deno.jsonc",
      "--outdir",
      DIST_DIR, // 使用--outdir指定输出目录
      entry.path,
    ],
    stdin: "inherit",
    stderr: "null",
  });
  await process.spawn().status;

  // 检查生成的JS文件大小，如果为0则删除
  if (existsSync(outFile)) {
    const jsFileInfo = await Deno.stat(outFile);
    if (jsFileInfo.size === 0) {
      await Deno.remove(outFile);
    } else {
      console.log(`📦 ${entry.path} -> ${outFile}`);
    }
  }
}

console.log(`\n✅ %c打包完成! `, "color: #4caf5010;");
