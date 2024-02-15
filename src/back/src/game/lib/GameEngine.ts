import Game from './Game';
import Client from './Client';
import { Player } from './Player';
import WebSocket from 'ws';
import { Message } from './Messages';

class GameEngine {
  games: Game[];

  constructor() {
    this.games = [];
  }

  deleteGame(game: Game) {
    clearInterval(game.interval);
    this.games = this.games.filter((g) => g !== game);
    console.log('Game deleted');
  }

  createGame(): Game {
    const game = new Game();
    this.games.push(game);

    const dt = 1 / 60;
    game.launch();
    game.interval = setInterval(() => {
      game.loop();
    }, 1000 * dt);
    console.log('Game created');

    return game;
  }

  searchGame(ws: WebSocket, initMessage: any) {
    // Replace with call to DB.
    console.log('searching game...');
    let game = this.games.find((game) => !game.full);
    if (!game) {
      console.log('no game found, creating one');
      game = this.createGame();
    } else console.log('game found');

    const client = new Client(ws, initMessage.userId);
    game.addPlayer(client);
  }

  searchPlayerByWs(ws: WebSocket): Player | undefined {
    for (const game of this.games) {
      for (const player of Object.values(game.players)) {
        if (player.client && player.client.ws === ws) return player;
      }
    }
    return undefined;
  }

  searchGameByWs(ws: WebSocket): Game | undefined {
    for (const game of this.games) {
      for (const player of Object.values(game.players)) {
        if (player.client && player.client.ws === ws) return game;
      }
    }
    return undefined;
  }

  handleMessage(ws: WebSocket, message: Message) {
    console.log('message', message);
    if (message.init) {
      // Prevent concurrent connections
      if (this.searchPlayerByWs(ws)) return;
      this.searchGame(ws, message.init);
    } else {
      console.log('handling message');
      const player = this.searchPlayerByWs(ws);
      const game = this.searchGameByWs(ws);
      if (!player) {
        console.log('no player found');
        return;
      }
      if (!game) {
        console.log('no game found');
        return;
      }
      game.handleMessages(player, message);
      if (
        game.state === 'end' &&
        !game.players.left.client &&
        !game.players.right.client
      ) {
        this.deleteGame(game);
      }
    }
  }

  handleDisconnect(ws: WebSocket) {
    const player = this.searchPlayerByWs(ws);
    const game = this.searchGameByWs(ws);
    if (!player) return;
    if (!game) return;
    if (player.client) {
      console.log('player with id', player.client.userId, 'disconnected');
      game.removePlayer(player.client);
    }
    if (
      game.state === 'end' &&
      !game.players.left.client &&
      !game.players.right.client
    ) {
      this.deleteGame(game);
    }
  }
}

export default GameEngine;
