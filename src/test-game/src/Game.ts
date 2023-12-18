import {Player, GamePad} from './Player';
import Client from './Client';
import Ball from './Ball';
import Score from './Score';
import { Response, GameResponse } from './Messages';
import { warn } from 'console';


class Game {
  ready: boolean;
  running: boolean;
  height: number;
  width: number;
  players: { left: Player, right: Player };
  ball: Ball;
  score: Score;
  lastTimestamp: number;
  interval: NodeJS.Timeout | undefined;
  full: boolean;

  constructor() {
    this.ready = false;
    this.running = false;
    this.height = 600;
    this.width = 960;
    this.players = {
      left: new Player("left"),
      right: new Player("right"),
    };
    this.ball = new Ball();
    this.score = new Score();
    this.lastTimestamp = Date.now();
    this.interval = undefined;
    this.full = false;
  };

  update(delta: number) {
    if (this.running) {
      this.updatePlayers(delta);
      this.ball.update(this, delta);
    }
  };

  updatePlayers(delta: number) {
    for (const player of Object.values(this.players)) {
      player.update(this, delta);
    }
  };

  nextRound() {
    this.reset();
  };

  reset() {
    this.ball.init(this);
    for (const player of Object.values(this.players)) {
      player.init(this);
    }
    this.running = false;
  };

  start() {
    this.reset();
    setTimeout(() => { this.lastTimestamp = Date.now(); this.running = true }, 3000);
  };

  pause() {
    this.running = false;
  };

  resume() {
    this.running = true;
  };

  toggle() {
    if (this.running) {
      this.pause();
    } else {
      this.resume();
    }
  }

  loop() {
    const timestamp = Date.now();
    const delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    this.update(delta);
    this.sendGameState();
    //console.log("ball", this.ball);
  }

  addPlayer(client: Client) {
    if (this.full) {
      return ;
    }

    if (this.players.left.client) {
      this.players.right.setClient(client);
      console.log("right player added");
    } else {
      this.players.left.setClient(client);
      console.log("left player added");
    }

    if (this.players.left.client && this.players.right.client) {
      this.full = true;
      this.ready = true;
      console.log("game is full !!!");
      this.start();
    }
  }

  resetRender() {
    this.players.left.render = false;
    this.players.right.render = false;
    this.ball.render = false;
    this.score.render = false;
  }

  genResponse(factor: number = 1): GameResponse {
    return {
      ready: this.ready,
      running: this.running,
      factor: factor,
    }
  }

  sendGameState() {
    for (const player of Object.values(this.players)) {
      if (player.client && ( this.players.left.render || this.players.right.render || this.ball.render || this.score.render )) {
        const response: Response = {
          timestamp: Date.now(),
          game: this.genResponse(player.client.factor),
          ...((this.players.left.render || this.players.right.render ) && { players: {
            ...(this.players.left.render && { left: this.players.left.genResponse(player.client.factor) }),
            ...(this.players.right.render && { right: this.players.right.genResponse(player.client.factor) }),
          } }),
          ...(this.ball.render && { ball: this.ball.genResponse(player.client.factor) }),
          ...(this.score.render && { score: this.score.genResponse() }),
        };
        player.client.send(response);
      }
    }
    this.resetRender();
  }

}

export default Game;
