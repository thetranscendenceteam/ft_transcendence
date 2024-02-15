import { Player } from './Player';
import Client from './Client';
import Ball from './Ball';
import Score from './Score';
import { Response, GameResponse } from './Messages';

class Game {
  state: string;
  lastState: string;
  matchId: string;
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

  constructor() {
    this.state = 'stop';
    this.lastState = 'stop';
    this.matchId = '';
    this.bestOf = 3;
    this.difficulty = 'normal';
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

  nextRound() {
    if (this.score.left + this.score.right === this.bestOf && this.bestOf > 0) {
      this.state = 'end';
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

    if (this.state === 'waiting' && this.full)
      this.start();
    if (this.state === 'paused' && this.full)
      this.resume();
    this.update(delta);
    this.updateText();
    this.sendGameState();
    if (!this.isLoop)
      clearInterval(this.interval);
    //console.log("ball", this.ball);
  }

  addPlayer(client: Client) {
    if (this.full) {
      return;
    }

    if (this.players.left.client) {
      this.players.right.setClient(client);
      console.log('right player added');
    } else {
      this.players.left.setClient(client);
      console.log('left player added');
    }

    if (this.players.left.client && this.players.right.client) {
      this.full = true;
      console.log('game is full !!!');
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
