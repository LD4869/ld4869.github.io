import { TicTacToe } from "./board.ts";
import { Player } from "./types.ts";

Deno.test("Board.printBoard", () => {
  const board = new TicTacToe();
  board.board = [Player.X, null, null, null, null, null, null, null, null];
  board.printBoard();
  board.board = [Player.X, Player.O, null, null, null, null, null, null, null];

  board.printBoard();
});

Deno.test("Board.getStateKey", () => {
  const board = new TicTacToe();
  console.log(board.getStateKey());
  board.board = [Player.X, null, null, null, null, null, null, null, null];
  console.log(board.getStateKey());
  board.board = [Player.X, Player.O, null, null, null, null, null, null, null];
  console.log(board.getStateKey());
});
