import { ScoreResponse } from './Messages';

class Score {
  left: number;
  right: number;
  render: boolean;

  constructor() {
    this.left = 0;
    this.right = 0;
    this.render = true;
  }

  addLeft() {
    this.left += 1;
    this.render = true;
  }

  addRight() {
    this.right += 1;
    this.render = true;
  }

  genResponse(): ScoreResponse {
    return {
      left: this.left,
      right: this.right
    }
  }
}

export default Score;
