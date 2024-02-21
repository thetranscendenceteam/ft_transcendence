import GameEngine from "./GameEngine";

class Player {
  x: number;
  y: number;
  height: number;
  width: number;
  speed: number;
  username: string;
  position: "left" | "right";
  gamePad: GamePad | undefined;

  constructor(position: "left" | "right") {
    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 0;
    this.speed = 0;
    this.username = '';
    this.position = position;
    this.gamePad = undefined;
  }

  init(game: GameEngine){
    this.height = 64 * game.factor;
    this.width = 8 * game.factor;
    this.speed = 200 * game.factor;
    this.x = this.position === "left" ? this.width : game.width - 2 * this.width;
    this.y = (game.height - this.height) / 2;
    this.gamePad = new GamePad();
  }

  update(game: GameEngine, dt: number) {
    if (! this.gamePad || game.role === "spectator")
      return ;
    const pd = this.gamePad;
    if (pd.prevState != pd.state)
      this.gamePad.send(game);
    pd.prevState = pd.state;
    if (! game.isLocal)
      return ;
    if (pd.state == "up") {
      let y = this.y - this.speed * dt;
      if (y < 0)
        y = 0;
      this.y = y;
    }
    else if (pd.state == "down") {
      let y = this.y + this.speed * dt;
      if (y + this.height > game.height)
        y = game.height - this.height;
      this.y = y;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  populate(msg: any) {
    if (msg.x)
      this.x = msg.x;
    if (msg.y)
      this.y = msg.y;
    if (msg.username)
      this.username = msg.username;
    if (msg.height)
      this.height = msg.height;
    if (msg.width)
      this.width = msg.width;
    if (msg.speed)
      this.speed = msg.speed;
  }

  setGamePad(gamePad: GamePad) {
    this.gamePad = gamePad;
  }

}

class GamePad {
  state: "up" | "down" | "stop";
  prevState: "up" | "down" | "stop";

  constructor() {
    this.state = "stop";
    this.prevState = "stop";
  }

  send(game: GameEngine) {
    game.send({ gamepad: this });
  };
}

export { Player, GamePad };
