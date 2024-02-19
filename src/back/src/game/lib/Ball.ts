import Game from './Game';
import { Player } from './Player';
import { BallResponse } from './Messages';

enum Difficulty {
  easy = 250,
  normal = 320,
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
    let angle = Math.random() * Math.PI * 2;
    while (Math.PI * 11/6 < angle || angle < Math.PI * 1/6 || (Math.PI * 7/6 > angle && angle > Math.PI * 5/6)) {
      angle = Math.random() * Math.PI * 2;
    }
    this.velocityX = this.speed * Math.sin(angle);
    this.velocityY = this.speed * Math.cos(angle);
    this.render = true;
  }

  handlePlayerCollision(player: Player) {
    const relativeIntersectY = -(this.y + (this.diameter / 2) - (player.y + player.height / 2));
    const normalizedRelativeIntersectY = relativeIntersectY / (player.height / 2);
    const bounceAngle = normalizedRelativeIntersectY * (Math.PI / 4);

    if (player.position === 'right') {
      this.velocityX = -Math.cos(bounceAngle) * this.speed;
      this.velocityY = -Math.sin(bounceAngle) * this.speed;
    } else {
      this.velocityX = Math.cos(bounceAngle) * this.speed;
      this.velocityY = -Math.sin(bounceAngle) * this.speed;
    }
  }

  detectPlayerColision(player: Player) {
    const playerLeft = player.x;
    const playerRight = player.x + player.width;
    const playerTop = player.y;
    const playerBottom = player.y + player.height;

    if (
      this.x - this.diameter / 2 < playerRight &&
      this.x + this.diameter / 2 > playerLeft &&
      this.y - this.diameter / 2 < playerBottom &&
      this.y + this.diameter / 2 > playerTop
    ) {
      this.render = true;
      return true;
    }

    return false;
  }

  handleWallCollision(game: Game) {
    if (this.y - this.diameter / 2 <= 0 || this.y + this.diameter / 2 >= game.height) {
      this.velocityY = -this.velocityY;
      this.render = true;
    }

    if (this.x - this.diameter / 2 <= 0) {
      game.score.addRight();
      game.nextRound();
    } else if (this.x + this.diameter / 2 >= game.width) {
      game.score.addLeft();
      game.nextRound();
    }
  }

  update(game: Game, delta: number) {
    this.x += this.velocityX * delta;
    this.y += this.velocityY * delta;

    for (const player of Object.values(game.players)) {
      if (this.detectPlayerColision(player))
        this.handlePlayerCollision(player);
    }

    this.handleWallCollision(game);
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
