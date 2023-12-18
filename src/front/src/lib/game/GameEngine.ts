import { RefObject } from "react";
import { Player } from './Player';
import Ball from './Ball';
import Score from './Score';


class GameEngine {
  ready: boolean;
  running: boolean;
  height: number;
  width: number;
  players: { left: Player, right: Player };
  ball: Ball;
  score: Score;
  factor: number;
  lastTimestamp: number;
  interval: NodeJS.Timeout | undefined;
  ws: WebSocket | null;
  ctx: CanvasRenderingContext2D | undefined;

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
    this.factor = 1;
    this.lastTimestamp = Date.now();
    this.interval = undefined;
    this.ws = null;
    this.ctx = undefined;
  };

  init(gameRef: RefObject<HTMLCanvasElement>) {

    let canvas = gameRef.current;
    if (! canvas || ! canvas.parentElement) {
      console.log("canvas not found");
      return ;
    }
    if (canvas?.parentElement?.clientWidth / 1.6 > canvas?.parentElement?.clientHeight) {
      canvas.height = canvas.parentElement.clientHeight;
      canvas.width = canvas.parentElement.clientHeight * 1.6;
    } else {
      canvas.height = canvas.parentElement.clientWidth / 1.6;
      canvas.width = canvas.parentElement.clientWidth;
    }
    this.height = canvas.height;
    this.width = canvas.width;
    this.height = canvas.height;
    this.width = canvas.width;
    const ctx = canvas.getContext("2d");
    if (! ctx) {
      console.log("canvas context not found");
      return ;
    }
    this.ctx = ctx;
    this.players.left.init(this);
    this.players.right.init(this);
    this.ball.init(this);
    this.render();
    this.initWs();
  }

  initWs() {
    let ws = new WebSocket('wss://localhost:8443/ws/game');
    let game = this;
    ws.onopen = function () {
      console.log('WebSocket is ready');
      game.ws = ws;
      game.sendInitData();
    };
    ws.onmessage = function(event) {

      //console.log('WebSocket message received:', event.data);
      game.handleMessage(JSON.parse(event.data));
    };
    ws.onclose = function() {
      console.log('WebSocket is closed');
    };
    ws.onerror = function(event) {
      console.log('WebSocket error:', event);
    };
    this.ws = ws;
  }

  handleMessage(msg: any) {
    if (msg.players) {
      if (msg.players.left)
        this.players.left.populate(msg.players.left);
      if (msg.players.right)
        this.players.right.populate(msg.players.right);
      //console.log("players: " + JSON.stringify(this.players));
    }
    if (msg.ball) {
      this.ball.populate(msg.ball);
      //console.log("ball: " + JSON.stringify(this.ball));
    }
    if (msg.score) {
      this.score.populate(msg.score);
      //console.log("score: " + JSON.stringify(this.score));
    }
    if (msg.game) {
      this.ready = msg.game.ready;
      this.running = msg.game.running;
      if (! msg.game.running)
        console.log("===== STOP =====");
      this.factor = msg.game.factor;
      //console.log("ready: " + this.ready);
    }
  }

  update(delta: number) {
    if (this.running) {
      this.updatePlayers();
      this.ball.update(this, delta);
    }
  };

  updatePlayers() {
    for (const player of Object.values(this.players)) {
      player.update(this);
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
    this.running = true;
    console.log("start");
    this.loop(this);
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

  loop(game: GameEngine, timestamp: number = Date.now()) {
    //if (! game.running)
    //  return ;
    if (game.ready) {
      let delta = (timestamp - game.lastTimestamp) / 1000;
      delta = Math.min(delta, 0.1);
      delta = Math.max(delta, 1/60);
      game.lastTimestamp = timestamp;

      game.update(delta);
      game.render();
    }
    window.requestAnimationFrame((timestamp) => game.loop(game, timestamp))
    //console.log("ball", this.ball);
  }

  render() {
    const ctx = this.ctx;
    if (! ctx) {
      console.log("canvas context not found");
      return ;
    }
    ctx.clearRect(0, 0, this.width, this.height);
    this.players.left.draw(ctx);
    this.players.right.draw(ctx);
    this.ball.draw(ctx);
    this.score.draw(ctx, this);
  };
    

  sendInitData() {
    let res = {
      init: {
        height: this.height,
      }
    }
    this.send(res);
  }

  send(data: any) {
    if (! this.ws || this.ws.readyState != 1)
      return ;
    let message = { event: 'update', data: JSON.stringify(data) };
    this.ws.send(JSON.stringify(message));
  }

  handleKeyUp(e: any, game: GameEngine) {
    //console.log("handleKeyUp: " + e.keyCode);
    if (game.ws?.readyState != 1 || ! game.ready)
      return ;
    let pd = game.players.right.gamePad;
    if (! pd)
      return ;
    if (e.keyCode == 40 || e.keyCode == 38)
      pd.state = 'stop';
  }
  handleKeyDown(e:any, game: GameEngine) {
    //console.log("handleKeyDown: " + e.keyCode, "game.ready: " + game.ready);
    if (game.ws?.readyState != 1 || ! game.ready)
      return ;
    let pd = game.players.right.gamePad;
    if (! pd)
      return ;
    if (e.keyCode == 40)
      pd.state = 'down';
    else if (e.keyCode == 38)
      pd.state = 'up';
  }
}

export default GameEngine;
