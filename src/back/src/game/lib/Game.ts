import { Player } from './Player';
import Client from './Client';
import Ball from './Ball';
import Score from './Score';
import { Response, GameResponse } from './Messages';
import { Match } from 'src/match/dto/Match.entity';
import { MatchService } from 'src/match/match.service';
import { SetMatchScoreInput } from 'src/match/dto/SetMatchScore.input';
import { ScoreInput } from 'src/match/dto/Score.input';

class Game {
  state: string;
  lastState: string;
  matchId: string;
  matchService: MatchService;
  bestOf: number;
  difficulty: string;
  height: number;
  width: number;
  players: { left: Player; right: Player };
  ball: Ball;
  score: Score;
  isLoop: boolean;
  startTimestamp: number;
  lastTimestamp: number;
  interval: NodeJS.Timeout | undefined;
  full: boolean;

  constructor(match: Match, matchService: MatchService) {
    this.state = 'stop';
    this.lastState = 'stop';
    this.matchId = match.id;
    this.matchService = matchService;
    this.bestOf = match.score?.bestOf || 0;
    this.difficulty = match.difficulty;
    this.height = 600;
    this.width = 960;
    this.players = {
      left: new Player('left'),
      right: new Player('right'),
    };
    this.ball = new Ball();
    this.score = new Score();
    this.isLoop = false;
    this.startTimestamp = Date.now();
    this.lastTimestamp = Date.now();
    this.interval = undefined;
    this.full = false;
  }

  update(delta: number) {
    if (this.state === 'running') {
      this.updatePlayers(delta);
      this.ball.update(this, delta);
    }
  }

  updatePlayers(delta: number) {
    for (const player of Object.values(this.players)) {
      player.update(this, delta);
    }
  }

  registerScore() {
    const winner = this.score.left > this.score.right ? 'left' : 'right';
    const scoreInput: ScoreInput = {
      id: this.matchId,
      winnerScore: this.score[winner],
      looserScore: this.score[winner === 'left' ? 'right' : 'left'],
      matchId: this.matchId,
      bestOf: this.bestOf,
    };
    const input: SetMatchScoreInput = {
      id: this.matchId,
      score: scoreInput,
      winnerId: this.players[winner].userId,
    };

    this.matchService.setMatchScore(input);
    this.matchService.addXpPostMatch({
      userId: this.players[winner].userId,
      xp: 10,
    });
    this.matchService.addXpPostMatch({
      userId: this.players[winner === 'left' ? 'right' : 'left'].userId,
      xp: 5,
    });
    this.matchService.setMatchAsFinished(this.matchId);
  }

  nextRound() {
    if (this.score.left + this.score.right === this.bestOf && this.bestOf > 0) {
      this.state = 'end';
      this.registerScore();
      return;
    }
    this.reset();
    this.start();
  }

  reset() {
    this.ball.init(this);
    for (const player of Object.values(this.players)) {
      player.init(this);
    }
    this.state = 'stop';
    this.sendGameState();
  }

  launch() {
    this.ball.init(this);
    for (const player of Object.values(this.players)) {
      player.init(this);
    }
    this.state = 'waiting';
    this.isLoop = true;
  }

  start() {
    this.state = 'starting';
    this.startTimestamp = Date.now();
  }

  pause() {
    this.lastState = this.state;
    this.state = 'paused';
    for (const player of Object.values(this.players))
      player.gamePad.state = 'stop';
  }

  resume() {
    // wait for websocket reconnection
    if (this.lastState === 'running') {
      this.startTimestamp = Date.now();
      this.state = 'starting';
    } else
      this.state = this.lastState;
    for (const player of Object.values(this.players))
      player.setToPrint('');
    this.renderAll();
    this.sendGameState();
  }

  toggle() {
    if (this.state === 'running') {
      this.pause();
    } else {
      this.resume();
    }
  }

  loop() {
    const timestamp = Date.now();
    const delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    if (this.state === 'waiting' && this.full) {
      this.matchService.setMatchAsStarted(this.matchId);
      this.start();
    }
    if (this.state === 'paused' && this.full)
      this.resume();
    this.update(delta);
    this.updateText();
    this.sendGameState();
    if (!this.isLoop)
      clearInterval(this.interval);
  }

  async bindClientToPlayer(client: Client, userId: string) {
    if (this.full)
      return;
    let playerFound = false;
    for (const player of Object.values(this.players)) {
      if (!player.client && player.userId === userId) {
        player.setClient(client);
        playerFound = true;
        console.log('userId' + userId + ' already binded to ' + player.position);
        break;
      }
    }
    if (!playerFound) {
      for (const player of Object.values(this.players)) {
        if (!player.client && player.userId === '') {
          player.setClient(client);
          player.setUserId(userId);
          console.log('userId' + userId + ' binded to ' + player.position);
          break;
        }
      }
    }
    if (this.players.left.client && this.players.right.client) {
      const users = await this.matchService.findUsersInMatch(this.matchId);
      for (const user of users) {
        if (user.userId === this.players.left.userId) {
          this.players.left.username = user.username;
        }
        if (user.userId === this.players.right.userId) {
          this.players.right.username = user.username;
        }
      }
      this.full = true;
    }
    this.renderAll();
    this.sendGameState();
  }

  removePlayer(client: Client) {
    if (this.players.left.client === client) {
      this.players.left.client = undefined;
      this.players.left.render = true;
    } else if (this.players.right.client === client) {
      this.players.right.client = undefined;
      this.players.right.render = true;
    }
    this.full = false;
    if (this.state === 'running')
      this.pause();
    this.updateText();
    this.sendGameState();
  }

  renderAll() {
    for (const player of Object.values(this.players)) {
      player.render = true;
      player.isToPrint = true;
    }
    this.ball.render = true;
    this.score.render = true;
  }

  resetRender() {
    for (const player of Object.values(this.players)) {
      player.resetRender();
    }
    this.ball.resetRender();
    this.score.resetRender();
  }

  genResponse(factor: number): GameResponse {
    const response: GameResponse = {
      state: this.state,
      ...(factor != 0 && {
        factor: factor,
      }),
    };
    return response;
  }

  updateText() {
    if (this.state === 'running')
      return;
    let text = '';
    if (this.state === 'waiting')
      text = 'Waiting for players';
    if (this.state === 'starting')
      text = this.startingSequence();
    if (this.state === 'paused')
      text = 'Player disconnected\nWaiting for reconnection...';
    for (const player of Object.values(this.players)) {
      if (this.state === 'end')
        player.setToPrint(this.won(player));
      else
        player.setToPrint(text);
    }
  }

  startingSequence(): string {
    const delta = (Date.now() - this.startTimestamp) / 1000;
    if (delta < 0.5)
      return 'Ready ?';
    else if (delta < 1)
      return '3';
    else if (delta < 1.5)
      return '2';
    else if (delta < 2)
      return '1';
    else if (delta < 2.5)
      return 'GO !';
    else {
      this.state = 'running';
      this.renderAll();
      return '';
    }
  }

  won(player: Player): string {
    if (player.position === 'left')
      return this.score.left > this.score.right ? 'You won' : 'You lose';
    else if (player.position === 'right')
      return this.score.right > this.score.left ? 'You won' : 'You lose';
    return '';
  }

  sendGameState() {
    for (const player of Object.values(this.players)) {
      if (
        player.client &&
        (player.isToPrint ||
          this.players.left.render ||
          this.players.right.render ||
          this.ball.render ||
          this.score.render)
      ) {
        const response: Response = {
          timestamp: Date.now(),
          game: this.genResponse(player.client.factor),
          ...(player.isToPrint && {
            toPrint: player.toPrint,
          }),
          ...((this.players.left.render || this.players.right.render) && {
            players: {
              ...(this.players.left.render && {
                left: this.players.left.genResponse(player.client.factor),
              }),
              ...(this.players.right.render && {
                right: this.players.right.genResponse(player.client.factor),
              }),
            },
          }),
          ...(this.ball.render && {
            ball: this.ball.genResponse(player.client.factor),
          }),
          ...(this.score.render && {
            score: this.score.genResponse(),
          }),
        };
        player.client.send(response);
      }
    }
    this.resetRender();
  }

  handleMessages(player: Player, message: any) {
    if (message.gamepad) {
      player.gamePad.state = message.gamepad.state;
    }
    if (message.height && player.client) {
      player.client.setHeight(message.height);
      player.render = true;
    }
  }
}

export default Game;
