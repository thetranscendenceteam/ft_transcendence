import Game from "./Game";
import Client from "./Client";
import { Player } from "./Player";
import WebSocket from "ws";
import { Message } from "./Messages";

class GameEngine {
  games: Game[];

  constructor() {
    this.games = [];
  }

  createGame(): Game {
    let game = new Game();
    this.games.push(game);

    const dt = 1 / 60;
    game.reset();
    game.interval = setInterval(() => {game.loop()}, 1000 * dt);
    console.log("Game created");

    return game;
  }

  searchGame(ws: WebSocket, userId: number, height: number) {
    console.log("searching game...");
    let game = this.games.find(game => !game.full);
    if (!game) {
      console.log("no game found, creating one");
      game = this.createGame();
    }
    else
      console.log("game found");
    
    let client = new Client(ws, userId, height);
    let factor = height / game.height;
    client.setFactor(factor);
    game.addPlayer(client);
  }

  searchPlayerByWs(ws: WebSocket): Player | undefined {
    for (const game of this.games) {
      for (const player of Object.values(game.players)) {
        if (player.client && player.client.ws === ws)
          return player;
      }
    }
    return undefined;
  }

  searchGameByWs(ws: WebSocket): Game | undefined {
    for (const game of this.games) {
      for (const player of Object.values(game.players)) {
        if (player.client && player.client.ws === ws)
          return game;
      }
    }
    return undefined;
  }


  handleMessage(ws: WebSocket, message: Message) {
    console.log("message", message);
    if (message.init) {
      if (this.searchPlayerByWs(ws))
        return;
      this.searchGame(ws, message.init.userId, message.init.height);
    }
    if (message.gamepad) {
      console.log(message.gamepad);
      const player = this.searchPlayerByWs(ws);
      if (!player) {
        console.log("no player found");
        return;
      }  
      player.setGamePad(message.gamepad);
      console.log("gamepad", message.gamepad, "set for player", player.position);
    }
  }
}

export default GameEngine;
