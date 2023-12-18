import { WebSocketServer, WebSocket } from 'ws';
import GameEngine from './GameEngine';

let interval: NodeJS.Timeout;

main();

function main() {

  const gameEngine = new GameEngine();

  let wss: WebSocketServer = new WebSocketServer({ port: 9000 });

  wss.on('connection', function connection(ws: WebSocket) {
    ws.on('message', function message(data: string) {
      try {
        var message = JSON.parse(data);
      }
      catch (e) {
        console.log('Invalid JSON');
        return;
      }
  
      gameEngine.handleMessage(ws, message);
    });
    ws.on('close', function close(e: CloseEvent) {
      console.log('disconnect', e);
    })
    ws.on('error', function error(err) {
      console.log('error', err);
    })
  });

}

//let game: Game = {
//  ready: false,
//  running: false,
//  height: 600,
//  width: 960,
//  factor: 1,
//  players: {
//    1: {x: 0, y: 0, height: 0, width: 0, speed: 0, gamePad: null },
//    2: {x: 0, y: 0, height: 0, width: 0, speed: 0, gamePad: null }
//  },
//  ball: {
//    x: 0,
//    y: 0,
//    diameter: 0,
//    speed: 0,
//    velocityX: 0,
//    velocityY: 0
//  },
//  score: {
//    left: 0,
//    right: 0
//  },
//}
//
//function initGame(message: initMessage) {
//  const dt = 1 / 60;
//  game.factor = message.init.height / 600;
//  initPlayer(1);
//  initPlayer(2);
//  initBall();
//  //sendGameState();
//  setTimeout(() => { game.ready = true; sendGameState(); }, 3000);
//  interval = setInterval(gameLoop, 1000 * dt)
//}
//
//
//  
//function initPlayer(playerId: number) {
//  const player = game.players[playerId];
//  player.height = 64;
//  player.width = 8;
//  player.x = playerId == 1 ? player.width : game.width - 2 * player.width;
//  player.y = (game.height - player.height) / 2;
//  player.speed = 60;
//  if (playerId == 2)
//    player.gamePad = { state: 'stop' };
//  
//  game.players[playerId] = player;
//}
//
//function initBall() {
//  const ball = game.ball;
//  ball.diameter = 12;
//  ball.x = (game.width - ball.diameter) / 2;
//  ball.y = (game.height - ball.diameter) / 2;
//  ball.speed = 50;
//  ball.velocityX = ball.speed * Math.cos(Math.PI / 4);
//  ball.velocityY = ball.speed * Math.sin(Math.PI / 4);
//  game.ball = ball;
//}
//
//function gameLoop() {
//  if (! game.running) {
//    console.log('Game over');
//    clearInterval(interval);
//    return ;
//  }
//  const dt = 1 / 60;
//  updateGame(dt);
//  updatePlayers(dt);
//  sendGameState();
//}
//
//function sendGameState() {
//  const message: GameMessage = {
//    players: {
//      1: { x: game.players[1].x * game.factor, y: game.players[1].y * game.factor, height: game.players[1].height * game.factor, width: game.players[1].width * game.factor, speed: game.players[1].speed * game.factor },
//      2: { x: game.players[2].x * game.factor, y: game.players[2].y * game.factor, height: game.players[2].height * game.factor, width: game.players[2].width * game.factor, speed: game.players[2].speed * game.factor },
//    },
//    ball: { x: game.ball.x * game.factor, y: game.ball.y * game.factor, diameter: game.ball.diameter * game.factor, speed: game.ball.speed * game.factor, velocityX: game.ball.velocityX * game.factor, velocityY: game.ball.velocityY * game.factor },
//    score: game.score,
//    ready: game.ready,
//  }
//  const data = JSON.stringify(message);
//  wss.clients.forEach(function each(client) {
//    if (client.readyState === WebSocket.OPEN) {
//      client.send(data);
//    }
//  });
//}
//
//function updateGame(dt: number) {
//  for (let playerId in game.players) {
//    const player = game.players[playerId];
//    if (player.gamePad)
//      updatePlayer(player, dt);
//  }
//  updateBall(dt);
//}
//
//function updatePlayers(dt: number) {
//  for (let playerId in game.players) {
//    const player = game.players[playerId];
//    if (player.gamePad)
//      updatePlayer(player, dt);
//  }
//}
//
//function updatePlayer(player: Player, dt: number) {
//  if (! player.gamePad)
//    return ;
//  const pd = player.gamePad;
//  if (pd.state == 'up')
//    player.y -= player.speed * dt;
//  else if (pd.state == 'down')
//    player.y += player.speed * dt;
//  if (player.y < 0)
//    player.y = 0;
//  else if (player.y + player.height > game.height)
//    player.y = game.height - player.height;
//}
//
//// Check collision between ball and player
//function updateBall(dt: number) {
//  const ball = game.ball;
//  const player1 = game.players[1];
//  const player2 = game.players[2];
//  if (ball.x + ball.diameter + ball.velocityX * dt >= player2.x
//      && ball.y + ball.diameter + ball.velocityY * dt > player2.y
//      && ball.y + ball.velocityY * dt < player2.y + player2.height) {
//    ball.velocityX = -ball.velocityX;
//    //ball.velocityY = -ball.velocityY;
//  }
//  else if (ball.x + ball.velocityX * dt <= player1.x + player1.width
//      && ball.y + ball.diameter + ball.velocityY * dt > player1.y
//      && ball.y + ball.velocityY * dt < player1.y + player1.height) {
//    ball.velocityX = -ball.velocityX;
//    //ball.velocityY = -ball.velocityY;
//  }
//  if (ball.y + ball.velocityY * dt < 0
//      || ball.y + ball.diameter + ball.velocityY * dt > game.height)
//    ball.velocityY = -ball.velocityY;
//  ball.x += ball.velocityX * dt;
//  ball.y += ball.velocityY * dt;
//
//  if (ball.x < 0 || ball.x + ball.diameter > game.width)
//    game.running = false;
//
//  game.ball = ball;
//}


