import json
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

class SimpleEcho(WebSocket):
    def handleMessage(self):
        print("Message received: " + str(self.data))
        usersData = [
                {"id": 1, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "..."},
                {"id": 2, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "..."},
                {"id": 3, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "..."},
                {"id": 4, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "..."},
                {"id": 5, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "..."},
        ]
        message = json.dumps(usersData)

        self.sendMessage(message)
        print("Sent message: \n" + str(message))

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('',8000, SimpleEcho)
print("listening on 8000")
server.serveforever()
