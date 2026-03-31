/** 玩家：X 或 O */
export enum Player {
  X = "X",
  O = "O",
}

/** 格子: 玩家 或 空 */
export type Cell = Player | null;

/** 棋盘: 9 个格子 */
export type Board = Cell[];

/** Q表: 存储状态 -> 动作价值 */
export type QTable = Map<string, number[]>;
