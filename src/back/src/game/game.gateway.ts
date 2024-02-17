import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer as NestWebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer } from 'ws';

import { GameEngine } from './lib/GameEngine';
import { Injectable } from '@nestjs/common';
import { MatchService } from 'src/match/match.service';

@Injectable()
@NestWebSocketGateway({ path: '/ws/game' })
export class GameGateway {
  @NestWebSocketServer() server: WebSocketServer;

  private gameEngine: GameEngine;
  private matchService: MatchService;

  constructor(matchService: MatchService) {
    console.log('================ GameGateway created ==============');
    this.matchService = matchService;
    this.gameEngine = new GameEngine(this.matchService);
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

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
    this.gameEngine.handleDisconnect(client);
  }
}
