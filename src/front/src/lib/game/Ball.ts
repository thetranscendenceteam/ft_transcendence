import GameEngine from "./GameEngine";

enum Difficulty {
  easy = 170,
  normal = 280,
  hard = 350,
}

class Ball {
  x: number;
  y: number;
  diameter: number;
  speed: number;
  velocityX: number;
  velocityY: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.diameter = 0;
    this.speed = 0;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  init(game: GameEngine) {
    this.diameter = 12 * game.factor;
    this.x = (game.width - this.diameter) / 2;
    this.y = (game.height - this.diameter) / 2;
    this.speed = game.difficulty === "easy" ? Difficulty.easy : game.difficulty === "normal" ? Difficulty.normal : Difficulty.hard;
    this.velocityX = this.speed * Math.cos(Math.PI / 4);
    this.velocityY = this.speed * Math.sin(Math.PI / 4);
  }

  update(game: GameEngine, delta: number) {
    let x = this.x += this.velocityX * delta;
    let y = this.y += this.velocityY * delta;
    if (y < 0) {
      y = 0;
      this.velocityY = -this.velocityY;
    } else if (y + this.diameter > game.height) {
      y = game.height - this.diameter;
      this.velocityY = -this.velocityY;
    }

    for (const player of Object.values(game.players)) {
      if (x + this.diameter > player.x &&
        x < player.x + player.width &&
        y + this.diameter > player.y &&
        y < player.y + player.height) {
        if (this.velocityX < 0) {
          x = player.x + player.width;
        } else {
          x = player.x - this.diameter;
        }
        this.velocityX = -this.velocityX;
      }
    }
    
    // Check for player collision in Y axis
    if (x < game.players.left.x + game.players.left.width &&
      y + this.diameter > game.players.left.y &&
      y < game.players.left.y + game.players.left.height) {
      x = game.players.left.x + game.players.left.width;
      this.velocityX = -this.velocityX;
    } else if (x + this.diameter > game.players.right.x &&
      y + this.diameter > game.players.right.y &&
      y < game.players.right.y + game.players.right.height) {
      x = game.players.right.x - this.diameter;
      this.velocityX = -this.velocityX;
    }


    if (! game.isLocal)
      return;

    if (x < 0) {
      game.score.addRight();
      game.nextRound();
    } else if (x + this.diameter > game.width) {
      game.score.addLeft();
      game.nextRound();
      return;
    }

    //this.x += this.velocityX * delta;
    //this.y += this.velocityY * delta;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.diameter, this.diameter);
  }

  populate(msg: any) {
    if (msg.x)
      this.x = msg.x;
    if (msg.y)
      this.y = msg.y;
    if (msg.diameter)
      this.diameter = msg.diameter;
    if (msg.speed)
      this.speed = msg.speed;
    if (msg.velocityX)
      this.velocityX = msg.velocityX;
    if (msg.velocityY)
      this.velocityY = msg.velocityY;
  }
}

export default Ball;