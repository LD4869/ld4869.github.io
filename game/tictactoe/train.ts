import { TicTacToe } from "./board.ts";
import { QLearningAgent, TRAIN_EPISODES } from "./qagent.ts";
import { Player } from "./types.ts";

export function trainAgents(): [QLearningAgent, QLearningAgent] {
  const agentX = new QLearningAgent(Player.X);
  const agentO = new QLearningAgent(Player.O);

  console.log(`🎮 开始训练${TRAIN_EPISODES}局【井字棋】...`);

  for (let i = 0; i < TRAIN_EPISODES; i++) {
    const game = new TicTacToe();
    let xState = "";
    let xAction = -1;
    let xNextState = "";
    let oState = "";
    let oAction = -1;
    let oNextState = "";

    // 单局游戏循环
    while (!game.isGameOver()) {
      const currentPlayer = game.currentPlayer;
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
