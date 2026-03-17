import { Board, Player } from "./types.ts";

export class TicTacToe {
  board: Board;
  currentPlayer: Player;

  /** 初始化棋盘 */
  constructor() {
    /** 棋盘: 9 个格子 */
    this.board = Array(9).fill(null);
    /** 当前玩家：X 先开始 */
    this.currentPlayer = Player.X;
  }

  /** 复制棋盘 (训练用) */
  clone(): TicTacToe {
    const game = new TicTacToe();
    game.board = [...this.board];
    game.currentPlayer = this.currentPlayer;
    return game;
  }

  /** 获取所有合法的可落子位置 */
  getValidMoves(): number[] {
    return this.board
      .map((cell, idx) => (cell === null ? idx : -1))
      .filter((idx) => idx !== -1);
  }

  /** 落子 */
  makeMove(position: number): boolean {
    if (this.board[position] !== null) {
      return false;
    }
    this.board[position] = this.currentPlayer;
    // 切换当前玩家
    this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
    return true;
  }

  /** 检查是否有玩家赢 */
  checkWinner(): Player | null {
    const winPatterns = [
      [0, 1, 2], // 行
      [3, 4, 5], // 行
      [6, 7, 8], // 行
      [0, 3, 6], // 列
      [1, 4, 7], // 列
      [2, 5, 8], // 列
      [0, 4, 8], // 对角线
      [2, 4, 6], // 对角线
    ];
    for (const [a, b, c] of winPatterns) {
      if (
        this.board[a] && // a 位置有玩家落子
        this.board[a] === this.board[b] && // a,b 位置玩家相同
        this.board[a] === this.board[c] // a,c 位置玩家相同
      ) {
        return this.board[a];
      }
    }
    // 没有玩家赢，返回 null
    return null;
  }

  /**
   * 检查游戏是否结束
   * 1. 有玩家赢
   * 2. 棋盘已满（平局）
   */
  isGameOver(): boolean {
    return this.checkWinner() !== null || this.getValidMoves().length === 0;
  }
  /**
   * 获取当前棋盘状态的唯一键值
   * 用于 Q 表的状态表示
   */
  getStateKey(): string {
    return this.board.map((cell) => cell || "❓").join("");
  }

  printBoard(): void {
    const splitLine = "+----+----+----+";
    console.log(`当前玩家: ${this.currentPlayer}`);

    console.log(splitLine);

    for (let idx = 0; idx < 9; idx += 3) {
      const row = this.board.slice(idx, idx + 3);
      console.log(
        "|",
        row.map((cell, i) => cell || `${i + idx} `).join(" | "),
        "|",
      );
      if (idx < 6) {
        console.log(splitLine);
      }
    }
    console.log(splitLine);
  }
}
