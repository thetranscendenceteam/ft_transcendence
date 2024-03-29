import GameEngine from "./GameEngine";

class Score {
  left: number;
  right: number;

  constructor() {
    this.left = 0;
    this.right = 0;
  }

  addLeft() {
    this.left += 1;
  }

  addRight() {
    this.right += 1;
  }

  draw(ctx: CanvasRenderingContext2D, game: GameEngine) {
    let fontSize = 48 * game.factor;
    ctx.font = fontSize + "px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(game.players.left.username, game.width / 4, 50);
    ctx.fillText(this.left.toString(), game.width / 4, 100);
    ctx.fillText(game.players.right.username, game.width * 3 / 4, 50);
    ctx.fillText(this.right.toString(), game.width * 3 / 4, 100);
  }

  populate(msg: any) {
    if (msg.left)
      this.left = msg.left;
    if (msg.right)
      this.right = msg.right;
  }
}

export default Score;
