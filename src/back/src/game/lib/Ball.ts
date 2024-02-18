import Game from './Game';
import { BallResponse } from './Messages';

enum Difficulty {
  easy = 170,
  normal = 280,
  hard = 390,
}

class Ball {
  x: number;
  y: number;
  diameter: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  render: boolean;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.diameter = 0;
    this.speed = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.render = true;
  }

  init(game: Game) {
    this.diameter = 12;
    this.x = (game.width - this.diameter) / 2;
    this.y = (game.height - this.diameter) / 2;
    this.speed = game.difficulty === "easy" ? Difficulty.easy : game.difficulty === "normal" ? Difficulty.normal : Difficulty.hard;
    this.velocityX = this.speed * Math.cos(Math.PI / 4);
    this.velocityY = this.speed * Math.sin(Math.PI / 4);
    this.render = true;
  }

  update(game: Game, delta: number) {
    let x = (this.x += this.velocityX * delta);
    let y = (this.y += this.velocityY * delta);
    if (y < 0) {
      y = 0;
      this.velocityY = -this.velocityY;
      this.render = true;
    } else if (y + this.diameter > game.height) {
      y = game.height - this.diameter;
      this.velocityY = -this.velocityY;
      this.render = true;
    }

    if (x < 0) {
      game.score.addRight();
      game.nextRound();
    } else if (x + this.diameter > game.width) {
      game.score.addLeft();
      game.nextRound();
      return;
    }

    if (
      x < game.players.left.x + game.players.left.width &&
      y + this.diameter > game.players.left.y &&
      y < game.players.left.y + game.players.left.height
    ) {
      x = game.players.left.x + game.players.left.width;
      this.velocityX = -this.velocityX;
      this.render = true;
    } else if (
      x + this.diameter > game.players.right.x &&
      y + this.diameter > game.players.right.y &&
      y < game.players.right.y + game.players.right.height
    ) {
      x = game.players.right.x - this.diameter;
      this.velocityX = -this.velocityX;
      this.render = true;
    }

    //this.x += this.velocityX * delta;
    //this.y += this.velocityY * delta;
  }

  resetRender() {
    this.render = false;
  }

  genResponse(factor: number): BallResponse {
    return {
      x: this.x * factor,
      y: this.y * factor,
      diameter: this.diameter * factor,
      speed: this.speed * factor,
      velocityX: this.velocityX * factor,
      velocityY: this.velocityY * factor,
    };
  }
}

export default Ball;
