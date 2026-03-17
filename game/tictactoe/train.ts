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
    // /** X 的状态 */
    // let xState = "";
    // /** X 的下一步位置 */
    // let xAction = -1;
    // /** X 的下一步状态 */
    // let xNextState = "";
    // /** O 的状态 */
    // let oState = "";
    // /** O 的下一步位置 */
    // let oAction = -1;
    // /** O 的下一步状态 */
    // let oNextState = "";

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
    /*
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
*/
    const winner = game.checkWinner();
    const xReward = winner === Player.X ? 10 : winner === Player.O ? -10 : 0;
    const oReward = winner === Player.O ? 10 : winner === Player.X ? -10 : 0;

    // 遍历轨迹, 回溯更新每一步的Q表
    for (const step of gameTrajectory) {
      const { state, action, player, nextState } = step;
      const nextGame = new TicTacToe();
      nextGame.board = nextState.split("").map((c) => {
        if (c === "❓") {
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

    if ((i + 1) % 10000 === 0) {
      console.log(`✅ 已训练${i + 1}局`);
    }
  }
  console.log("🎉 训练完成!");

  return [agentX, agentO];
}
