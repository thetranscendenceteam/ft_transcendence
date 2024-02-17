import Game from './Game';
import Client from './Client';
import { Player } from './Player';
import WebSocket from 'ws';
import { MatchService } from 'src/match/match.service';
import { Match } from 'src/match/dto/Match.entity';

export class GameEngine {
  games: Game[];
  matchService: MatchService;

  constructor(matchService: MatchService) {
    this.games = [];
    this.matchService = matchService;
  }

  deleteGame(game: Game) {
    clearInterval(game.interval);
    this.games = this.games.filter((g) => g !== game);
    console.log('Game deleted');
  }

  createGame(match: Match): Game {
    const game = new Game(match, this.matchService);
    this.games.push(game);

    const dt = 1 / 60;
    game.launch();
    game.interval = setInterval(() => {
      game.loop();
    }, 1000 * dt);
    console.log('Game created');

    return game;
  }

  async searchGame(ws: WebSocket, init: { matchId: string; userId: string }) {
    // Replace with call to DB.
    console.log('searching game...');
    let match: Match | undefined;
    let game: Game | undefined;
    const ongoingMatches: Match[] =
      await this.matchService.findUngoingMatchesForUser(init.userId);
    const unstartedMatches: Match[] =
      await this.matchService.findUnstartedMatchesForUser(init.userId);
    if ( // If the match is ongoing, find the game and bind the client to the player.
      ongoingMatches &&
      ongoingMatches.find((match) => match.id === init.matchId) &&
      (game = this.games.find((game) => game.matchId === init.matchId))
    ) {
      console.log('ongoing match found');
      const client = new Client(ws);
      game.bindClientToPlayer(client, init.userId);
    } else if ( // If the match is unstarted, create a new game and bind the client to the player.
      (match = unstartedMatches.find((match) => match.id === init.matchId))
    ) {
      const game = this.createGame(match);
      console.log('unstarted match found');
      const client = new Client(ws);
      game.bindClientToPlayer(client, init.userId);
    } else {
      console.log('no match found');
    }
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

  async handleMessage(ws: WebSocket, message: any) {
    if (message.init) {
      // Prevent concurrent connections
      if (this.searchPlayerByWs(ws)) return;
      this.searchGame(ws, message.init);
    } else {
      const player = this.searchPlayerByWs(ws);
      if (!player) {
        console.log('no player found');
        return;
      }
      const game = this.searchGameByWs(ws);
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
      console.log('player with id', player.userId, 'disconnected');
      game.removePlayer(player.client);
    }
    if (
      (game.state === 'end' || game.state === 'waiting') &&
      !game.players.left.client &&
      !game.players.right.client
    ) {
      this.deleteGame(game);
    }
  }
}
