/**
 * 🔧 Q-Learning 配置常量
 */

import { TicTacToe } from "./board.ts";
import { Player, QTable } from "./types.ts";

/** 学习率 */
export const LEARNING_RATE = 0.1;
/** 折扣因子 */
export const DISCOUNT_FACTOR = 0.9;
/** 探索率 */
export const EXPLORATION_RATE = 0.2;
/** 训练轮数 */
export const TRAIN_EPISODES = 500 * 1000;

export class QLearningAgent {
  qTable: QTable;
  player: Player;

  constructor(player: Player) {
    this.qTable = new Map();
    this.player = player;
  }

  /** 获取当前状态对应的 Q 值数组 */
  private getQValue(state: string, validMoves: number[]): number[] {
    if (!this.qTable.has(state)) {
      // 初始化: 每个有效动作价值为 0, 其他为 -Infinity
      const qValues: number[] = Array(9).fill(-Infinity);
      validMoves.forEach((move) => (qValues[move] = 0));
      this.qTable.set(state, qValues);
    }
    // 确保返回的是 number[] 类型
    return this.qTable.get(state)!;
  }

  /**
   * 选择当前状态下的最优动作
   * @param game 当前游戏状态
   * @returns 最优动作的索引(-1: 表示结束)
   * @description 基于当前状态和 Q 值选择最优动作
   *   1. 随机选择有效动作 (概率: 探索率)
   *   2. 选择 Q 值最高的有效动作
   */
  chooseAction(game: TicTacToe, showQValue?: boolean): number {
    const validMoves = game.getValidMoves();
    const state = game.getStateKey();
    const qValues = this.getQValue(state, validMoves);
    if (showQValue) {
      console.log("AI thinking...");

      console.log(state);
      console.log(qValues);
      console.log("AI thought...");
    }
    if (validMoves.length === 0) {
      return -1;
    } else if (Math.random() < EXPLORATION_RATE) {
      // 随机选择有效动作
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    } else {
      // 选择 Q 值最高的有效动作
      let bestMove = validMoves[0];
      let maxQ = qValues[bestMove];
      for (const move of validMoves) {
        if (qValues[move] > maxQ) {
          bestMove = move;
          maxQ = qValues[move];
        }
      }
      return bestMove;
    }
  }

  /**
   * 更新 Q 表
   * @param state 当前状态
   * @param action 执行的动作
   * @param reward 奖励值
   * @param nextState 下一步状态
   * @param nextValidMoves 下一步有效动作
   * @description 根据 Q-Learning 更新公式更新 Q 表
   */
  updateQTable(
    state: string,
    action: number,
    reward: number,
    nextState: string,
    nextValidMoves: number[],
  ): void {
    /** 当前状态下选择的动作价值 */
    const currentQ = this.getQValue(state, [action])[action];
    /**下一步的动作价值  */
    const nextQValues = this.getQValue(nextState, nextValidMoves);
    const finiteQValues = nextQValues.filter((v) => !Number.isNaN(v));
    const maxNextQ =
      Math.max(...finiteQValues) === -Infinity ? 0 : Math.max(...finiteQValues);

    /** Q-Learning 更新公式
     *  - 公式: Q(s, a) = Q(s, a) + α * (r + γ * max(Q(s', a')) - Q(s, a))
     *  - 解释: 新值 = 当前值 + 学习率 * (reward + 折扣因子 * 下一步最大价值 - 当前值)
     */
    const newQ =
      currentQ +
      LEARNING_RATE * (reward + DISCOUNT_FACTOR * maxNextQ - currentQ);

    /*
    console.log("---------start---------------------");

    console.log("state:", state);
    console.log("action:", action);
    console.log("reward:", reward);
    console.log("nextState:", nextState);
    console.log("nextValidMoves:", nextValidMoves);

    console.log("currentQ==>", currentQ);
    console.log("nextQValues==>", nextQValues);
    console.log("finiteQValues==>", finiteQValues);
    console.log("maxNextQ==>", maxNextQ);
    console.log("newQ==>", newQ);
    console.log("---------end---------------------");
    */
    if (Number.isNaN(newQ)) {
      throw new Error("出错了!");
    }
    // 更新Q值
    this.qTable.get(state)![action] = newQ;
  }

  printQTable(): void {
    for (const [state, qValues] of this.qTable) {
      if (
        [
          "❓❓❓❓❓❓❓❓❓",
          "❌❓❓❓❓❓❓❓❓",
          "❓❌❓❓❓❓❓❓❓",
          "❓❓❌❓❓❓❓❓❓",
          "❓❓❓❌❓❓❓❓❓",
          "❓❓❓❓❌❓❓❓❓",
          "❓❓❓❓❓❌❓❓❓",
          "❓❓❓❓❓❓❌❓❓",
          "❓❓❓❓❓❓❓❌❓",
          "❓❓❓❓❓❓❓❓❌",
        ].includes(state)
      ) {
        console.log(state, qValues.toString());
      }
    }
  }
}
