import { TicTacToe } from "./board.ts";
import { QLearningAgent } from "./qagent.ts";
import { Player } from "./types.ts";

Deno.test("QLearningAgent 初始化", () => {
  const game = new TicTacToe();
  game.board = [
    Player.X,
    Player.O,
    Player.X,
    Player.O,
    Player.X,
    Player.O,
    Player.X,
    Player.O,
    Player.X,
  ];
  const agentO = new QLearningAgent(Player.O);

  const d = agentO.chooseAction(game);
  console.log(d);
});
