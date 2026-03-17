import { playHumanVsAI } from "./play.ts";
import { trainAgents } from "./train.ts";

function main() {
  const count = parseInt(prompt("你想挑战训练多少次的AI呢?")!);
  // 1.训练 AI
  const [agentX] = trainAgents(count);
  // 2.开始游戏
  playHumanVsAI(agentX);
}

main();
