import Game from './Game';
import Client from './Client';
import { PlayerResponse } from './Messages';

class Player {
  x: number;
  y: number;
  height: number;
  width: number;
  speed: number;
  render: boolean;
  userId: string;
  position: 'left' | 'right';
  gamePad: GamePad;
  client: Client | undefined;
  toPrint: string;
  isToPrint: boolean;

  constructor(position: 'left' | 'right') {
    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 0;
    this.speed = 0;
    this.render = true;
    this.userId = '';
    this.position = position;
    this.gamePad = new GamePad();
    this.client = undefined;
    this.toPrint = '';
    this.isToPrint = false;
  }

  init(game: Game) {
    this.height = 64;
    this.width = 8;
    this.speed = 200;
    this.x =
      this.position === 'left' ? this.width : game.width - 2 * this.width;
    this.y = (game.height - this.height) / 2;
    this.gamePad = new GamePad();
    this.render = true;
  }

  update(game: Game, delta: number) {
    if (this.gamePad) {
      if (this.gamePad.state === 'stop') return;
      switch (this.gamePad.state) {
        case 'up':
          this.y -= this.speed * delta;
          break;
        case 'down':
          this.y += this.speed * delta;
          break;
      }
      this.render = true;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + this.height > game.height) {
      this.y = game.height - this.height;
    }
  }

  resetRender() {
    this.render = false;
    this.isToPrint = false;
  }

  setClient(client: Client) {
    this.client = client;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setGamePad(gamePad: GamePad) {
    this.gamePad = gamePad;
  }

  setToPrint(toPrint: string) {
    if (toPrint === this.toPrint) return;
    this.toPrint = toPrint;
    this.isToPrint = true;
  }

  genResponse(factor: number): PlayerResponse {
    return {
      x: this.x * factor,
      y: this.y * factor,
      height: this.height * factor,
      width: this.width * factor,
      speed: this.speed * factor,
      userId: this.client?.userId,
    };
  }
}

class GamePad {
  state: 'up' | 'down' | 'stop';

  constructor() {
    this.state = 'stop';
  }
}

export { Player, GamePad };
