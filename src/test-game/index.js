"use strict";
import WebSocketServer from 'ws';

Object.defineProperty(exports, "__esModule", { value: true });

const wss = new WebSocketServer({ port: 8080 });
function handleMessage(message) {
    if (message.gamepad) {
        ws.send(JSON.stringify({ timestamp: Date.now(), player: 1, y: player1 }));
    }
    else if (message.player) {
        console.log('player');
    }
}
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s');
        try {
            var message = JSON.parse(data);
        }
        catch (e) {
            console.log('Invalid JSON');
            return;
        }
        console.log(message);
        handleMessage(message);
        if (message.gamepad) {
            ws.send(JSON.stringify({ timestamp: Date.now(), player: 1, y: player1 }));
        }
        if (message.player == 2) {
            if (message.move == 'up') {
                player1 -= 7;
            }
            else if (message.move == 'down') {
                player1 += 7;
            }
            ws.send(JSON.stringify({ timestamp: Date.now(), player: 1, y: player1 }));
        }
    });
});
