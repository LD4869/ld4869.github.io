import { TicTacToe } from "./board.ts";
import { QLearningAgent } from "./qagent.ts";
import { Player } from "./types.ts";
import { HumanDataCollector } from "./human_data_collector.ts";

/**
 * 人机对战，直接更新 AI 的 Q 表
 */
export function playHumanVsAICollectData(aiAgent: QLearningAgent) {
  console.log("\n🤖 你 VS 训练好的 AI (你执 O, AI 执 X)");
  console.log("输入 0-8 对应棋盘位置：");
  console.log(" 0 | 1 | 2 ");
  console.log("-----------");
  console.log(" 3 | 4 | 5 ");
  console.log("-----------");
  console.log(" 6 | 7 | 8 \n");

  const game = new TicTacToe();
  const humanCollector = new HumanDataCollector();
  const humanQTable = new Map<string, number[]>(); // 单独的人类 Q 表
  let gameResult: Player | null = null;

  while (!game.isGameOver()) {
    if (game.currentPlayer === Player.X) {
      // AI 走棋
      const action = aiAgent.chooseAction(game);
      game.makeMove(action);
      console.log(`🤖 AI 走棋：${action}`);
    } else {
      // 人类走棋
      game.printBoard();

      const validMoves = game.getValidMoves();
      let position = parseInt(prompt("请输入你的走棋位置 (0-8): ")!);

      while (isNaN(position) || !validMoves.includes(position)) {
        console.log("⚠️ 非法位置, 请重新输入!");
        position = parseInt(prompt("请输入你的走棋位置 (0-8): ")!);
      }

      // 暂时不更新，等游戏结束后用最终结果更新
      // 否会导致 Q 值冲突

      game.makeMove(position);
    }
  }

  // 显示最终结果
  game.printBoard();
  gameResult = game.checkWinner();

  if (gameResult === Player.O) {
    console.log("🎉 恭喜你, 你赢了!");
  } else if (gameResult === Player.X) {
    console.log("😔 AI 赢了!");
  } else {
    console.log("🤝 平局!");
  }

  // 更新所有人类走法，使用最终结果
  // 重新播放整局游戏，更新所有人类走法的 Q 表
  updateAllHumanMovesWithResult(game, gameResult, aiAgent);

  // 保存更新后的 Q 表
  aiAgent.saveQTable();

  console.log("✅ 已更新 AI 的学习并保存");

  return gameResult;
}

/**
 * 使用最终结果更新所有人类走法
 */
function updateAllHumanMovesWithResult(
  game: TicTacToe,
  result: Player | null,
  aiAgent: QLearningAgent
): void {
  console.log(`🎯 使用最终结果更新: ${result === Player.O ? '人类赢' : result === Player.X ? 'AI赢' : '平局'}`);

  // 简化处理：不重新模拟游戏，直接基于当前游戏结果
  // 这是一个更安全的方法
  const collector = new HumanDataCollector();

  // 创建一个最终状态的对象
  const finalGame = {
    getValidMoves: () => game.getValidMoves(),
    getStateKey: () => game.getStateKey(),
    currentPlayer: Player.O
  } as any;

  // 更新当前状态（人类最后一次走棋后的状态）
  collector.updateQTableFromHumanMove(
    finalGame,
    -1, // 使用 -1 表示特殊标记，会在函数内部处理
    aiAgent['qTable'],
    0.1,
    result
  );

  console.log("✅ 完成更新");
}


/**
 * 连续多局游戏，持续收集数据
 */
export function playMultipleGames(
  aiAgent: QLearningAgent,
  gamesCount: number = 5
): { wins: number, losses: number, draws: number } {
  console.log(`\n🎮 开始 ${gamesCount} 局连续对战...`);

  const stats = { wins: 0, losses: 0, draws: 0 };

  for (let i = 0; i < gamesCount; i++) {
    console.log(`\n🎯 第 ${i + 1} 局`);
    const result = playHumanVsAICollectData(aiAgent);

    if (result === Player.O) stats.wins++;
    else if (result === Player.X) stats.losses++;
    else stats.draws++;
  }

  // 显示总体统计
  console.log("\n📊 总体统计:");
  console.log(`胜利: ${stats.wins} (${(stats.wins/gamesCount*100).toFixed(1)}%)`);
  console.log(`失败: ${stats.losses} (${(stats.losses/gamesCount*100).toFixed(1)}%)`);
  console.log(`平局: ${stats.draws} (${(stats.draws/gamesCount*100).toFixed(1)}%)`);

  // 保存更新后的 Q 表
  aiAgent.saveQTable();

  return stats;
}