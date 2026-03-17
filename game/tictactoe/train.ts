import { TicTacToe } from "./board.ts";
import { QLearningAgent, TRAIN_EPISODES } from "./qagent.ts";
import { Player } from "./types.ts";

export function trainAgents(
  trainCount?: number,
): [QLearningAgent, QLearningAgent] {
  const count = Number.isNaN(Number(trainCount))
    ? TRAIN_EPISODES
    : Number(trainCount);
  const agentX = new QLearningAgent(Player.X);
  const agentO = new QLearningAgent(Player.O);

  console.log(`🎮 开始训练${count}局【井字棋】...`);

  for (let i = 0; i < count; i++) {
    const game = new TicTacToe();
    /** X 的状态 */
    let xState = "";
    /** X 的下一步位置 */
    let xAction = -1;
    /** X 的下一步状态 */
    let xNextState = "";
    /** O 的状态 */
    let oState = "";
    /** O 的下一步位置 */
    let oAction = -1;
    /** O 的下一步状态 */
    let oNextState = "";

    // 单局游戏循环
    while (!game.isGameOver()) {
      /** 当前下棋的人 */
      const currentPlayer = game.currentPlayer;
      /** 当前的棋盘状态 */
      const state = game.getStateKey();

      // X 玩家 (AI) 走棋
      if (currentPlayer === Player.X) {
        xState = state;
        xAction = agentX.chooseAction(game);

        game.makeMove(xAction);
        xNextState = game.getStateKey();
      }
      // O 玩家 (AI) 走棋
      else {
        oState = state;
        oAction = agentO.chooseAction(game);

        game.makeMove(oAction);
        oNextState = game.getStateKey();
      }

      if (game.isGameOver()) {
        const winner = game.checkWinner();
        let xReward = 0;
        let oReward = 0;

        if (winner === Player.X) {
          xReward = 10;
          oReward = -10;
        } else if (winner === Player.O) {
          xReward = -10;
          oReward = 10;
        }

        // 更新两个AI的学习记忆
        agentX.updateQTable(
          xState,
          xAction,
          xReward,
          xNextState,
          game.getValidMoves(),
        );
        if (oState && oAction !== -1) {
          agentO.updateQTable(
            oState,
            oAction,
            oReward,
            oNextState,
            game.getValidMoves(),
          );
        }
      }
    }
    if ((i + 1) % 10000 === 0) {
      console.log(`✅ 已训练${i + 1}局`);
    }
  }
  console.log("🎉 训练完成!");

  return [agentX, agentO];
}
