// Messages

type Message = {
  init: InitMessage;
  gamepad: GamePadMessage;
};

type InitMessage = {
  height: number;
  userId: string;
};

type GamePadMessage = {
  state: 'up' | 'down' | 'stop';
};

// Responses

type Response = {
  timestamp: number;
  game?: GameResponse;
  players?: { left?: PlayerResponse; right?: PlayerResponse };
  ball?: BallResponse;
  score?: ScoreResponse;
  init?: boolean;
};

type GameResponse = {
  state?: string;
  factor?: number;
};

type PlayerResponse = {
  x?: number;
  y: number;
  height?: number;
  width?: number;
  speed?: number;
  userId?: string;
};

type BallResponse = {
  x: number;
  y: number;
  diameter?: number;
  speed?: number;
  velocityX?: number;
  velocityY?: number;
};

type ScoreResponse = {
  left: number;
  right: number;
};

export {
  Message,
  Response,
  GameResponse,
  PlayerResponse,
  BallResponse,
  ScoreResponse,
};
