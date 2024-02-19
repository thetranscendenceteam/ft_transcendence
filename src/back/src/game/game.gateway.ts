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
import { UserService } from 'src/user/user.service';

@Injectable()
@NestWebSocketGateway(3001, { path: '/ws/game' })
export class GameGateway implements OnGatewayConnection {
  @NestWebSocketServer() server: WebSocketServer;

  private gameEngine: GameEngine;
  private matchService: MatchService;
  private userService: UserService;
  private authService: AuthService;

  constructor(matchService: MatchService, userService: UserService, authService: AuthService) {
    this.matchService = matchService;
    this.userService = userService;
    this.authService = authService;
    this.gameEngine = new GameEngine(this.matchService);
  }

  handleConnection(client: any, req: any, res: any) {
    console.log('Client connected');
    const cookies: string[] = req.headers.cookie.split('; ');
    const jwtName = 'jwt';
    let token = cookies.find((cookie: string) => cookie.startsWith(jwtName))?.split('=')[1];
    if (!token) {
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
      res.headers.set('Set-Cookie', 'jwt=; HttpOnly; Path=/; Max-Age=0');
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
