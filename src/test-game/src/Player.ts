import Game from "./Game";
import Client from "./Client";
import { PlayerResponse } from "./Messages";

class Player {
  x: number;
  y: number;
  height: number;
  width: number;
  speed: number;
  render: boolean;
  position: "left" | "right";
  gamePad: GamePad | undefined;
  client: Client | undefined;

  constructor(position: "left" | "right") {
    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 0;
    this.speed = 0;
    this.render = true;
    this.position = position;
    this.gamePad = undefined;
    this.client = undefined;
  }

  init(game: Game){
    this.height = 64;
    this.width = 8;
    this.speed = 200;
    this.x = this.position === "left" ? this.width : game.width - 2 * this.width;
    this.y = (game.height - this.height) / 2;
    this.gamePad = new GamePad();
  }

  update(game: Game, delta: number) {
    if (this.gamePad) {
      switch (this.gamePad.state) {
        case "up":
          this.y -= this.speed * delta;
          break;
        case "down":
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

  setClient(client: Client) {
    this.client = client;
  }

  setGamePad(gamePad: GamePad) {
    this.gamePad = gamePad;
  }

  genResponse(factor: number = 1): PlayerResponse {
    return {
      x: this.x * factor,
      y: this.y * factor,
      height: this.height * factor,
      width: this.width * factor,
      speed: this.speed * factor,
      userId: this.client?.userId,
    }
  }
}

class GamePad {
  state: "up" | "down" | "stop";

  constructor() {
    this.state = "stop";
  }
}

type User = {
  id: string;
  name: string;
}

export { Player, GamePad };
