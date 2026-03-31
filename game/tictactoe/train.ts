import { TicTacToe } from "./board.ts";
import { QLearningAgent, TRAIN_EPISODES } from "./qagent.ts";
import { Player } from "./types.ts";

export function trainAgents(
  trainCount?: number
): [QLearningAgent, QLearningAgent] {
  const count = Number.isNaN(Number(trainCount))
    ? TRAIN_EPISODES
    : Number(trainCount);
  const agentX = new QLearningAgent(Player.X);
  const agentO = new QLearningAgent(Player.O);

  console.log(`🎮 开始训练${count}局【井字棋】...`);

  for (let i = 0; i < count; i++) {
    const game = new TicTacToe();
    /** 游戏轨迹 */
    const gameTrajectory: Array<{
      state: string;
      action: number;
      player: Player;
      nextState: string;
    }> = [];

    // 单局游戏循环
    while (!game.isGameOver()) {
      const currentPlayer = game.currentPlayer;
      const state = game.getStateKey();
      let action = -1;

      // AI 选择动作
      if (currentPlayer === Player.X) {
        action = agentX.chooseAction(game);
      } else {
        action = agentO.chooseAction(game);
      }

      // 执行操作前, 先克隆游戏, 避免修改原游戏状态
      const gameClone = game.clone();
      gameClone.makeMove(action);
      const nextState = gameClone.getStateKey();

      // 记录轨迹
      gameTrajectory.push({
        state,
        action,
        player: currentPlayer,
        nextState,
      });

      // 原来游戏执行动作(继续游戏)
      game.makeMove(action);
    }

    const winner = game.checkWinner();
    const xReward = winner === Player.X ? 10 : winner === Player.O ? -10 : 0;
    const oReward = winner === Player.O ? 10 : winner === Player.X ? -10 : 0;

    // 遍历轨迹, 回溯更新每一步的Q表
    for (const step of gameTrajectory) {
      const { state, action, player, nextState } = step;
      const nextGame = new TicTacToe();
      nextGame.board = nextState.split("").map((c) => {
        if (c === "?") {
          return null;
        }
        return c as Player;
      });

      const nextValidMoves = nextGame.getValidMoves();
      if (player === Player.X) {
        agentX.updateQTable(state, action, xReward, nextState, nextValidMoves);
      } else {
        agentO.updateQTable(state, action, oReward, nextState, nextValidMoves);
      }
    }

    if ((10 * (i + 1)) % count === 0) {
      console.log(`✅ 已训练 ${((i + 1) / count) * 100}% `);
    }
  }
  console.log("🎉 训练完成!");

  return [agentX, agentO];
}
