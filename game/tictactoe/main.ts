import { playHumanVsAI } from "./play.ts";
import { trainAgents } from "./train.ts";

function main() {
  // 1.训练 AI
  const [agentX] = trainAgents();
  playHumanVsAI(agentX);
}

main();
