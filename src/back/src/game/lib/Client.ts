import WebSocket from 'ws';
import { Response } from './Messages';

class Client {
  userId: string;
  height: number;
  width?: number;
  factor: number;
  ws: WebSocket;

  constructor(ws: WebSocket) {
    this.height = 600;
    this.ws = ws;
    this.factor = 0;
    this.sendInitOk();
  }

  setHeight(height: number) {
    this.height = height;
    this.factor = height / 600;
  }

  sendInitOk() {
    const message: Response = {
      timestamp: Date.now(),
      init: true,
    };
    this.send(message);
  }

  send(message: Response) {
    const data: string = JSON.stringify(message);
    this.ws.send(data);
  }
}

export default Client;
