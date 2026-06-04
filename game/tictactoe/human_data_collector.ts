import { TicTacToe } from "./board.ts";
import { Player } from "./types.ts";

export interface HumanMoveData {
  state: string; // 棋盘状态
  humanMove: number; // 人类选择的走法
  otherMoves: number[]; // 其他可能的走法
  result: Player | null; // 最终结果
  isWinningMove: boolean; // 这步是否最终导致胜利
}

export class HumanDataCollector {
  private humanMoves: HumanMoveData[] = [];

  /**
   * 直接更新 Q 表（不存储原始数据）
   * @param game 当前游戏状态
   * @param humanPosition 人类选择的走法
   * @param qTable 要更新的 Q 表
   * @param learningRate 学习率
   * @param finalResult 最终结果（赢/输/平局）
   */
  updateQTableFromHumanMove(
    game: TicTacToe,
    humanPosition: number,
    qTable: Map<string, number[]>,
    learningRate: number = 0.1,
    finalResult: Player | null = null
  ): void {
    try {
      const validMoves = game.getValidMoves();
      const state = game.getStateKey();

      // 输入验证
      if (!Array.isArray(validMoves) || validMoves.length === 0) {
        console.warn(`⚠️ 无效的 validMoves:`, validMoves);
        return;
      }

      // 处理特殊标记 -1（最终状态更新）
      if (humanPosition === -1 && finalResult !== null) {
        // 更新所有有效走法，给予相同的奖励
        let reward = 0;
        if (finalResult === Player.O) {
          reward = 10;  // 人类赢了
        } else if (finalResult === Player.X) {
          reward = -10; // AI赢了
        } else {
          reward = 2;  // 平局
        }

        // 确保 Q 表中有这个状态
        if (!qTable.has(state)) {
          const qValues: number[] = Array(9).fill(-Infinity);
          validMoves.forEach((move) => {
            if (typeof move === 'number' && move >= 0 && move <= 8) {
              qValues[move] = 0;
            }
          });
          qTable.set(state, qValues);
        }

        const stateQValues = qTable.get(state)!;

        // 更新所有有效走法
        validMoves.forEach(move => {
          if (typeof move === 'number' && move >= 0 && move <= 8) {
            const currentQ = stateQValues[move];
            const effectiveCurrentQ = currentQ === -Infinity ? 0 : currentQ;
            const newQ = effectiveCurrentQ + learningRate * (reward - effectiveCurrentQ);

            if (Number.isFinite(newQ)) {
              stateQValues[move] = newQ;
            }
          }
        });

        console.log(`📝 更新最终状态: ${state} (奖励: ${reward})`);
        return;
      }

      // 正常走法更新
      if (typeof humanPosition !== 'number' || humanPosition < 0 || humanPosition > 8) {
        console.warn(`⚠️ 无效的 humanPosition: ${humanPosition}`);
        return;
      }

      // 确保 Q 表中有这个状态
      if (!qTable.has(state)) {
        const qValues: number[] = Array(9).fill(-Infinity);
        validMoves.forEach((move) => {
          if (typeof move === 'number' && move >= 0 && move <= 8) {
            qValues[move] = 0;
          }
        });
        qTable.set(state, qValues);
      }

      const stateQValues = qTable.get(state)!;

      // 根据最终结果计算奖励
      let reward = 0;
      if (finalResult === Player.O) {
        reward = 10;  // 人类赢了
      } else if (finalResult === Player.X) {
        reward = -10; // AI赢了
      } else if (finalResult === null) {
        reward = 2;  // 平局
      }

      // 更新人类选择的走法
      const currentQ = stateQValues[humanPosition];

      // 防御性检查：如果当前Q值是 -Infinity，初始化为 0
      let effectiveCurrentQ = currentQ;
      if (currentQ === -Infinity) {
        effectiveCurrentQ = 0;
      }

      const newQ = effectiveCurrentQ + learningRate * (reward - effectiveCurrentQ);

      // 防御性检查：确保 newQ 是有限数值
      if (!Number.isFinite(newQ)) {
        console.warn(`⚠️ 无效Q值计算: state=${state}, action=${humanPosition}, currentQ=${currentQ}, effectiveCurrentQ=${effectiveCurrentQ}, reward=${reward}, newQ=${newQ}`);
        return;
      }

      stateQValues[humanPosition] = newQ;

      console.log(`📝 更新 Q 表: ${state} -> ${humanPosition} (奖励: ${reward}, 新值: ${newQ.toFixed(2)})`);
    } catch (error) {
      console.error(`❌ updateQTableFromHumanMove 出错:`, error);
    }
  }

  /**
   * 检查某个走法是否会导致胜利
   */
  private checkIfWinningMove(game: TicTacToe, position: number): boolean {
    const gameClone = game.clone();
    gameClone.makeMove(position);
    return gameClone.checkWinner() === game.currentPlayer;
  }

  /**
   * 更新所有历史记录的结果
   */
  private updateResults(
    finalResult: Player | null,
    isWinningMove: boolean,
  ): void {
    for (let i = 0; i < this.humanMoves.length; i++) {
      const move = this.humanMoves[i];
      if (move.result === null) {
        // 如果是人类赢了，所有正确的走法都标记为胜利
        if (finalResult === Player.O && isWinningMove) {
          move.isWinningMove = true;
        }
        // 如果是平局，所有走法都不是胜利
        if (finalResult === null) {
          move.isWinningMove = false;
        }
        move.result = finalResult;
      }
    }
  }

  /**
   * 获取人类玩家的偏好走法统计
   */
  getMovePreferences(): Map<string, number[]> {
    const preferences = new Map<string, number[]>();

    // 按状态分组
    const stateGroups = new Map<string, number[]>();

    this.humanMoves.forEach((move) => {
      if (!move.result) return; // 只记录已完成的游戏

      if (!stateGroups.has(move.state)) {
        stateGroups.set(move.state, []);
      }
      stateGroups.get(move.state)!.push(move.humanMove);
    });

    // 统计每个状态下人类选择的走法频率
    stateGroups.forEach((moves, state) => {
      const moveCounts = new Array(9).fill(0);
      moves.forEach((move) => moveCounts[move]++);
      preferences.set(state, moveCounts);
    });

    return preferences;
  }

  /**
   * 生成模仿学习的奖励信号
   */
  generateImitationRewards(): Map<string, number[]> {
    const rewards = new Map<string, number[]>();

    this.humanMoves.forEach((move) => {
      if (!move.result) return;

      const state = move.state;
      if (!rewards.has(state)) {
        rewards.set(state, new Array(9).fill(-1)); // 默认奖励 -1
      }

      const stateRewards = rewards.get(state)!;

      // 人类选择的走法获得高奖励
      if (move.result === Player.O) {
        // 赢了，选中的走法 +10
        stateRewards[move.humanMove] += 10;
      } else if (move.result === null) {
        // 平局，选中的走法 +2
        stateRewards[move.humanMove] += 2;
      } else {
        // 输了，选中的走法 -5
        stateRewards[move.humanMove] -= 5;
      }

      // 其他可能的走法获得较低奖励
      move.otherMoves.forEach((otherMove) => {
        if (move.result === Player.O) {
          stateRewards[otherMove] += 1; // 赢了时其他走法也有小奖励
        }
      });
    });

    return rewards;
  }


  /**
   * 显示统计信息
   */
  showStats(): void {
    const totalMoves = this.humanMoves.length;
    const completedGames =
      this.humanMoves.filter((m) => m.result !== null).length / 9; // 每局9步

    if (completedGames === 0) {
      console.log("📊 还没有完成的游戏数据");
      return;
    }

    // 计算胜负统计
    const wins =
      this.humanMoves.filter((m) => m.result === Player.O).length / 9;
    const losses =
      this.humanMoves.filter((m) => m.result === Player.X).length / 9;
    const draws = this.humanMoves.filter((m) => m.result === null).length / 9;

    // 计算平均每步考虑的选项数
    const avgOptions =
      this.humanMoves.reduce((sum, move) => sum + move.otherMoves.length, 0) /
      totalMoves;

    console.log("\n📊 人类玩家行为统计:");
    console.log(`总走法数: ${totalMoves}`);
    console.log(`完成游戏数: ${completedGames}`);
    console.log(`胜率: ${((wins / completedGames) * 100).toFixed(1)}%`);
    console.log(`败率: ${((losses / completedGames) * 100).toFixed(1)}%`);
    console.log(`平局率: ${((draws / completedGames) * 100).toFixed(1)}%`);
    console.log(`平均可选走法数: ${avgOptions.toFixed(1)}`);
  }
}
