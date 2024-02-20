import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer as NestWebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer } from 'ws';

import { GameEngine } from './lib/GameEngine';
import { Injectable } from '@nestjs/common';
import { MatchService } from 'src/match/match.service';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { RequestWithUser } from 'src/user/dto/requestwithuser.interface';

@Injectable()
@NestWebSocketGateway(3001, { path: '/ws/game' })
export class GameGateway {
  @NestWebSocketServer() server: WebSocketServer;

  private gameEngine: GameEngine;
  private matchService: MatchService;
  private authService: AuthService;

  constructor(matchService: MatchService, authService: AuthService) {
    this.matchService = matchService;
    this.authService = authService;
    this.gameEngine = new GameEngine(this.matchService);
  }

  handleConnection(client: any, req: RequestWithUser, res: Response) {
    console.log('Client connected');
    const cookies: string[] = req.headers.cookie?.split('; ') || [];
    const jwtName = 'jwt';
    let token = cookies
      .find((cookie: string) => cookie.startsWith(jwtName))
      ?.split('=')[1];

    if (!token) {
      res.cookie('jwt', '', { maxAge: 0 });
      console.log('Unauthorized, no token found.');
      throw new Error('Unauthorized, no token found.');
    }

    let decodedToken;
    token = decodeURI(token);
    token = token.replace(/%3A/g, ':');
    try {
      if (token) {
        decodedToken = this.authService.verifyToken(JSON.parse(token).jwtToken);
      }
      if (!decodedToken) {
        throw new Error('Unauthorized, invalid token.');
      }
      const user = decodedToken.id;

      if (user) {
        client.user = user;
      }
    } catch (error) {
      //res.cookie('jwt', '', { maxAge: 0 });
      console.log('Error:', error);
      throw new Error(error);
    }
  }

  @SubscribeMessage('update')
  handleMessage(client: any, payload: any) {
    let message;
    try {
      message = JSON.parse(payload);
    } catch (e) {
      console.log('Invalid JSON');
      console.log('Received message:', payload);
      return;
    }

    this.gameEngine.handleMessage(client, message);
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
    this.gameEngine.handleDisconnect(client);
  }
}
