import WebSocket from "ws";
import { Response } from "./Messages";

class Client {
  userId: number;
  height: number;
  width?: number;
  factor?: number;
  ws: WebSocket;

  constructor(ws: WebSocket, userId: number, height: number) {
    this.userId = userId;
    this.height = height;
    this.ws = ws;
  }

  setFactor(factor: number) {
    this.factor = factor;
  }

  send(message: Response) {
    //console.log("send", message);
    const data: string = JSON.stringify(message);
    //console.log("send", data);
    this.ws.send(data);
  }
}

export default Client;
