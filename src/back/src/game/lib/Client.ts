import WebSocket from 'ws';
import { Response } from './Messages';

class Client {
  userId: string;
  height: number;
  width?: number;
  factor: number;
  ws: WebSocket;

  constructor(ws: WebSocket, userId: string) {
    this.userId = userId;
    this.height = 600;
    this.ws = ws;
    this.factor = 0;
  }

  setHeight(height: number) {
    this.height = height;
    this.factor = height / 600;
  }

  send(message: Response) {
    //console.log("send", message);
    const data: string = JSON.stringify(message);
    //console.log("send", data);
    this.ws.send(data);
  }
}

export default Client;
