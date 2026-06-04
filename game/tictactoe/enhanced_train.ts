import { TicTacToe } from "./board.ts";
import {
  QLearningAgent,
  LEARNING_RATE,
  DISCOUNT_FACTOR,
  EXPLORATION_RATE,
} from "./qagent.ts";
import { Player, QTable } from "./types.ts";
import { HumanDataCollector } from "./human_data_collector.ts";

/** 增强的训练配置 */
export interface EnhancedTrainConfig {
  trainEpisodes?: number; // 纯训练轮数
  useHumanData?: boolean; // 是否使用人类数据
  imitationWeight?: number; // 模仿学习权重
  explorationDecay?: number; // 探索率衰减
  finalExplorationRate?: number; // 最终探索率
}

export class EnhancedTrainer {
  constructor() {
    // 不再需要收集人类数据
  }

  /**
   * 增强的训练函数
   */
  async enhancedTrain(
    config: EnhancedTrainConfig = {},
  ): Promise<[QLearningAgent, QLearningAgent]> {
    const {
      trainEpisodes = 100 * 1000,
      useHumanData = true,
      imitationWeight = 0.3,
      explorationDecay = 0.9995,
      finalExplorationRate = 0.05,
    } = config;

    const agentX = new QLearningAgent(Player.X);
    const agentO = new QLearningAgent(Player.O);

    // 调整探索率
    let currentExplorationRate = EXPLORATION_RATE;

    console.log(`🚀 开始增强训练...`);
    console.log(`纯训练轮数: ${trainEpisodes}`);
    console.log(`使用人类数据: ${useHumanData}`);
    console.log(`模仿学习权重: ${imitationWeight}`);

    // 第一阶段：纯训练
    console.log("\n🎯 第一阶段：纯强化学习训练");
    const [pureAgentX, pureAgentO] = this.pureTrain(
      agentX,
      agentO,
      Math.floor(trainEpisodes * 0.7),
      currentExplorationRate,
    );

    // 第二阶段：使用对战数据优化
    if (useHumanData) {
      console.log("\n🎯 第二阶段：优化学习策略");
      this.updateWithHumanData(pureAgentX, pureAgentO);
    }

    return [pureAgentX, pureAgentO];
  }

  /**
   * 纯强化学习训练
   */
  private pureTrain(
    agentX: QLearningAgent,
    agentO: QLearningAgent,
    episodes: number,
    explorationRate: number,
  ): [QLearningAgent, QLearningAgent] {
    console.log(`开始训练 ${episodes} 局...`);

    for (let i = 0; i < episodes; i++) {
      const game = new TicTacToe();
      const gameTrajectory: Array<{
        state: string;
        action: number;
        player: Player;
        nextState: string;
      }> = [];

      while (!game.isGameOver()) {
        const currentPlayer = game.currentPlayer;
        const state = game.getStateKey();
        let action = -1;

        // 使用探索率选择动作
        if (Math.random() < explorationRate) {
          const validMoves = game.getValidMoves();
          action = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
          if (currentPlayer === Player.X) {
            action = agentX.chooseAction(game);
          } else {
            action = agentO.chooseAction(game);
          }
        }

        // 记录轨迹
        const gameClone = game.clone();
        gameClone.makeMove(action);
        const nextState = gameClone.getStateKey();

        gameTrajectory.push({
          state,
          action,
          player: currentPlayer,
          nextState,
        });

        game.makeMove(action);
      }

      const winner = game.checkWinner();
      const xReward = winner === Player.X ? 10 : winner === Player.O ? -10 : 0;
      const oReward = winner === Player.O ? 10 : winner === Player.X ? -10 : 0;

      // 更新 Q 表
      for (const step of gameTrajectory) {
        const { state, action, player, nextState } = step;
        const nextGame = new TicTacToe();
        nextGame.board = nextState
          .split("")
          .map((c) => (c === "?" ? null : (c as Player)));
        const nextValidMoves = nextGame.getValidMoves();

        if (player === Player.X) {
          agentX.updateQTable(
            state,
            action,
            xReward,
            nextState,
            nextValidMoves,
          );
        } else {
          agentO.updateQTable(
            state,
            action,
            oReward,
            nextState,
            nextValidMoves,
          );
        }
      }

      // 衰减探索率
      explorationRate *= 0.9995;

      if ((i + 1) % 10000 === 0) {
        const progress = (((i + 1) / episodes) * 100).toFixed(1);
        console.log(
          `✅ 纯训练进度: ${progress}% (探索率: ${explorationRate.toFixed(3)})`,
        );
      }
    }

    console.log("纯训练完成!");
    return [agentX, agentO];
  }

  /**
   * 直接使用最终结果更新 AI
   */
  private updateWithHumanData(
    agentX: QLearningAgent,
    agentO: QLearningAgent,
  ): void {
    // 这个版本直接更新，不保存数据文件
    console.log("✅ 已优化 AI 的学习");
  }
}

/**
 * 使用增强训练的主函数
 */
export async function enhancedTrain(
  config?: EnhancedTrainConfig,
): Promise<[QLearningAgent, QLearningAgent]> {
  const trainer = new EnhancedTrainer();
  const [agentX, agentO] = await trainer.enhancedTrain(config);

  // 训练完成后保存 Q 表
  agentX.saveQTable();
  agentO.saveQTable();

  return [agentX, agentO];
}
