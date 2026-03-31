import { trainAgents } from "./train.ts";

Deno.test("QLearningAgent 训练", () => {
  const [agentX, agentO] = trainAgents(2);
  console.log("训练完成后的 Q 表:");
  console.log("X 玩家:");
  agentX.printQTable();
  console.log("O 玩家:");
  agentO.printQTable();
});
