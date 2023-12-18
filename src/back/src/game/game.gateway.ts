import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer as NestWebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer } from 'ws';

import GameEngine from './lib/GameEngine';

@NestWebSocketGateway({ path: '/ws/game' })
export class GameGateway {
  @NestWebSocketServer() server: WebSocketServer;

  private gameEngine: GameEngine;

  constructor() {
    console.log('================ GameGateway created ==============');
    this.gameEngine = new GameEngine();
  }

  @SubscribeMessage('update')
  handleMessage(client: WebSocket, payload: any) {
    let message;
    try {
      message = JSON.parse(payload);
    } catch (e) {
      console.log('Invalid JSON');
      console.log('Received message:', payload);
      return;
    }

    console.log('Received message:', message);
    this.gameEngine.handleMessage(client, message);
  }
}
