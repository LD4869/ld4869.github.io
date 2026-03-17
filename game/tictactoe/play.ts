import { TicTacToe } from "./board.ts";
import { QLearningAgent } from "./qagent.ts";
import { Player } from "./types.ts";

export function playHumanVsAI(aiAgent: QLearningAgent) {
  console.log("\n🤖 你 VS 训练好的 AI (你执 O, AI 执 X)");
  console.log("输入 0-8 对应棋盘位置：");
  console.log(" 0 | 1 | 2 ");
  console.log("-----------");
  console.log(" 3 | 4 | 5 ");
  console.log("-----------");
  console.log(" 6 | 7 | 8 \n");

  const game = new TicTacToe();

  while (!game.isGameOver()) {
    if (game.currentPlayer === Player.X) {
      // AI 走棋
      const action = aiAgent.chooseAction(game);
      game.makeMove(action);
      console.log(`AI 走棋：${action}`);
    } else {
      // 人类走棋
      game.printBoard();
      let position = parseInt(prompt("请输入你的走棋位置 (0-8): ")!);
      while (isNaN(position) || !game.getValidMoves().includes(position)) {
        console.log("⚠️ 非法位置, 请重新输入!");
        position = parseInt(prompt("请输入你的走棋位置 (0-8): ")!);
      }
      game.makeMove(position);
    }
  }
  // 显示最终结果
  game.printBoard();
  const result = game.checkWinner();
  if (result === Player.O) {
    console.log("恭喜你, 你赢了!");
  } else if (result === Player.X) {
    console.log("AI 赢了!");
  } else {
    console.log("平局!");
  }
  // 打印 Q 表
  console.log("\nAI 训练完成后的 Q 表:");
  aiAgent.printQTable();
}
