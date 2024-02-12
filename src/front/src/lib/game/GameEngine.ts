import { RefObject } from "react";
import { Player } from './Player';
import Ball from './Ball';
import Score from './Score';


class GameEngine {
  matchId: string;
  userId: string;
  matches: number;
  difficulty: string;
  isLocal: boolean;
  toPrint: string;
  state: string;
  isLoop: boolean;
  height: number;
  width: number;
  players: { left: Player, right: Player };
  ball: Ball;
  score: Score;
  factor: number;
  lastTimestamp: number;
  startTimestamp: number;
  interval: NodeJS.Timeout | undefined;
  ws: WebSocket | null;
  ctx: CanvasRenderingContext2D | undefined;

  constructor() {
    this.matchId = "";
    this.userId = "";
    this.matches = 0;
    this.difficulty = "normal";
    this.isLocal = false;
    this.toPrint = "";
    this.state = "stop";
    this.isLoop = false;
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
    this.startTimestamp = Date.now();
    this.interval = undefined;
    this.ws = null;
    this.ctx = undefined;
  };

  init(gameRef: RefObject<HTMLCanvasElement>, gameParams: {rounds: number, difficulty: string, local: boolean}, matchId: string, userId: string) {

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
    this.factor = this.height / 600;
    if (matchId === "local" && gameParams) {
      this.matches = gameParams.rounds;
      this.difficulty = gameParams.difficulty;
    }
    const ctx = canvas.getContext("2d");
    if (! ctx) {
      console.log("canvas context not found");
      return ;
    }
    this.ctx = ctx;
    this.players.left.init(this);
    this.players.right.init(this);
    this.ball.init(this);
    this.matchId = matchId;
    this.userId = userId;
    this.render();
    if (this.matchId === "local")
      this.isLocal = true;
    this.initWs();
  }

  initWs() {
    if (this.isLocal)
      return;
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
      this.state = msg.game.state;
      this.factor = msg.game.factor;
      //console.log("ready: " + this.ready);
    }
  }

  update(delta: number) {
    if (this.state === "running") {
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
    // Check if players score is equal to matches
    if (this.score.left + this.score.right === this.matches) {
      // End game
      this.state = "end";
      return ;
    }
    this.reset();
    if (! this.isLocal)
      return ;
    this.start();
  };

  reset() {
    this.ball.init(this);
    for (const player of Object.values(this.players)) {
      player.init(this);
    }
    this.state = "stop";
  };

  launch() {
    this.isLoop = true;
    this.loop(this);
    this.start();
  };

  start() {
    this.state = "starting";
    this.startTimestamp = Date.now();
  };

  pause() {
    this.state = "paused";
  };

  resume() {
    this.state = "running";
  };

  toggle() {
    if (this.state === "running") {
      this.pause();
    } else {
      this.resume();
    }
  }

  loop(game: GameEngine, timestamp: number = Date.now()) {
    //if (! game.running)
    //  return ;
    let delta = (timestamp - game.lastTimestamp) / 1000;
    delta = Math.min(delta, 0.1);
    delta = Math.max(delta, 1/60);
    game.lastTimestamp = timestamp;

    if (game.state === "running")
      game.update(delta);
    game.render();

    if (game.isLoop)
      window.requestAnimationFrame((timestamp) => game.loop(game, timestamp))
  }

  render() {
    const ctx = this.ctx;
    if (! ctx) {
      console.log("canvas context not found");
      return ;
    }
    ctx.clearRect(0, 0, this.width, this.height);
    if (this.state === "starting")
      this.startingSequence();
    if (this.state === "end")
      this.won();
    this.drawText(this.toPrint);
    if (this.state === "end" || this.state === "starting")
      return ;
    this.players.left.draw(ctx);
    this.players.right.draw(ctx);
    this.ball.draw(ctx);
    this.score.draw(ctx, this);
  };

  drawText(text: string) {
    const ctx = this.ctx;
    if (! ctx) {
      console.log("canvas context not found");
      return ;
    }
    let fontSize = 100;
    let x = this.width / 2;
    let y = this.height / 2;

    ctx.font = `${fontSize}px Monospace`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }

  startingSequence() {
    // Print Ready?, 3, 2, 1, GO!
    let delta = Date.now() - this.startTimestamp;
    if (delta < 500)
      this.toPrint = "Ready?";
    else if (delta < 1000)
      this.toPrint = "3";
    else if (delta < 1500)
      this.toPrint = "2";
    else if (delta < 2000)
      this.toPrint = "1";
    else if (delta < 2500)
      this.toPrint = "GO!";
    else if (this.isLocal) {
      this.toPrint = "";
      this.state = "running";
    }
  };
  
  won() {
    if (this.score.left > this.score.right)
      this.toPrint = "Left player won!";
    else
      this.toPrint = "Right player won!";
  }

// ================== WebSocket events ==================
    
  send(data: any) {
    if (this.isLocal || ! this.ws || this.ws.readyState != 1)
      return ;
    let message = { event: 'update', data: JSON.stringify(data) };
    this.ws.send(JSON.stringify(message));
  }

  sendInitData() {
    let res = {
      init: {
        matchId: this.matchId,
        userId: this.userId,
        height: this.height,
      }
    }
    this.send(res);
  }

  sendHeight() {
    let res = {
      height: this.height,
    }
    this.send(res);
  }

// ================== Keyboard events ==================

  handleKeyUp(e: any, game: GameEngine) {
    //console.log("handleKeyUp: " + e.keyCode);
    if (! (game.state === "running"))
      return ;
    if (game.players.right.gamePad && (e.keyCode == 40 || e.keyCode == 38))
      game.players.right.gamePad.state = 'stop';
    if (! game.isLocal)
      return;
    if (game.players.left.gamePad && (e.keyCode == 83 || e.keyCode == 87))
      game.players.left.gamePad.state = 'stop';
  }
  handleKeyDown(e:any, game: GameEngine) {
    if (! (game.state === "running"))
      return ;
    if (game.players.right.gamePad) {
      if (e.keyCode == 40)
        game.players.right.gamePad.state = 'down';
      else if (e.keyCode == 38)
        game.players.right.gamePad.state = 'up';
    }
    if (! game.isLocal)
      return;
    if (game.players.left.gamePad) {
      if (e.keyCode == 83)
        game.players.left.gamePad.state = 'down';
      else if (e.keyCode == 87)
        game.players.left.gamePad.state = 'up';
    }
  }
}

export default GameEngine;
