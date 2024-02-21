import Game from './Game';
import Client from './Client';
import { Player } from './Player';
import WebSocket from 'ws';
import { MatchService } from 'src/match/match.service';
import { Match } from 'src/match/dto/Match.entity';

export interface WebSocketWithUser extends WebSocket {
  user: string | undefined;
}

export class GameEngine {
  games: Game[];
  matchService: MatchService;

  constructor(matchService: MatchService) {
    this.games = [];
    this.matchService = matchService;
    this.matchService.findUngoingMatches().then((matches) => {
      matches.forEach((match) => {
        this.createGame(match);
      });
    });
  }

  deleteGame(game: Game) {
    clearInterval(game.interval);
    for (const player of Object.values(game.players)) {
      if (player.client) {
        player.client.ws.close();
        player.client = undefined;
      }
    }
    for (const spectator of game.spectators) {
      spectator.ws.close();
    }
    game.spectators = [];
    this.games = this.games.filter((g) => g !== game);
    if (game.state !== 'end')
      this.matchService.deleteMatch(game.matchId);
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

  async searchGame(ws: WebSocketWithUser, init: { matchId: string; userId: string }) {
    // Replace with call to DB.
    console.log('searching game...');
    let match: Match | undefined;
    let game: Game | undefined;
    if (ws.user && ws.user === init.userId) {
      const ongoingMatches: Match[] =
        await this.matchService.findUngoingMatchesForUser(init.userId);
      const unstartedMatches: Match[] =
        await this.matchService.findUnstartedMatchesForUser(init.userId);
      if (
        ws.user &&
        ongoingMatches &&
        (match = ongoingMatches.find((match) => match.id === init.matchId))
      ) {
        if (!(game = this.games.find((game) => game.matchId === init.matchId)))
          game = this.createGame(match);
        if (!this.isUserInGame(init.userId, game)) {
          console.log('ongoing match found');
          const client = new Client(ws);
          game.bindClientToPlayer(client, init.userId);
          return;
        }
      } else if ( // If the match is unstarted, create a new game and bind the client to the player.
        (match = unstartedMatches.find((match) => match.id === init.matchId))
      ) {
        if (!(game = this.games.find((game) => game.matchId === init.matchId)))
          game = this.createGame(match);
        console.log('unstarted match found');
        const client = new Client(ws);
        game.bindClientToPlayer(client, init.userId);
        return;
      }
    }
    if (
      (game = this.games.find((game) => game.matchId === init.matchId))
    ) {
      console.log('spectator found');
      const client = new Client(ws);
      game.bindClientToSpectator(client);
    } else {
      console.log('no match found with id ' + JSON.stringify(init.matchId));
    }
  }

  isUserInGame(userId: string, game: Game): boolean {
    return (
      game.players.left.userId === userId || game.players.right.userId === userId
    );
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
      for (const spectator of game.spectators) {
        if (spectator.ws === ws) return game;
      }
    }
    return undefined;
  }

  searchSpectatorByWs(ws: WebSocket): Client | undefined {
    for (const game of this.games) {
      for (const spectator of game.spectators) {
        if (spectator.ws === ws) return spectator;
      }
    }
    return undefined;
  }

  handleMessage(ws: WebSocketWithUser, message: any) {
    if (message.init) {
      // Prevent concurrent connections
      if (this.searchPlayerByWs(ws)) return;
      this.searchGame(ws, message.init);
    } else if (message.giveUp) {
      const player = this.searchPlayerByWs(ws);
      if (!player || !player.client) return;
      const game = this.searchGameByWs(ws);
      if (!game) return;
      if (
        (game.state === 'waiting' || game.state === 'paused') &&
        !game.full
      ) {
        game.toPrint = 'Game has been canceled by ' + player.username;
        game.isToPrint = true;
        game.sendGameState();
        game.isLoop = false;
        this.deleteGame(game);
      }
    } else {
      const player = this.searchPlayerByWs(ws);
      const spectator = this.searchSpectatorByWs(ws);
      if (!player) {
        if (!spectator) {
          return;
        }
      }
      const game = this.searchGameByWs(ws);
      if (!game) {
        return;
      }
      if (spectator) {
        game.handleSpectatorMessages(spectator, message);
        return;
      } else if (player)
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
    const spectator = this.searchSpectatorByWs(ws);
    const game = this.searchGameByWs(ws);
    if (!player && !spectator) return;
    if (!game) return;
    if (player && player.client) {
      game.removePlayer(player.client);
    } else if (spectator) {
      game.removeSpectator(spectator);
    }
    if (
      (game.state === 'end' || game.state === 'waiting') &&
      !game.players.left.client &&
      !game.players.right.client &&
      !game.spectators.length
    ) {
      this.deleteGame(game);
    }
  }
}
