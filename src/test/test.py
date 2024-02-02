import json
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

def getUsers():
        usersData = [
                {"id": 1, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudoooooooooooooooooooooooooooooo"},
                {"id": 2, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 3, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 4, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 5, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 6, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 7, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 8, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 9, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 10, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 11, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 12, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 13, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 14, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 15, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
                {"id": 16, "avatarUrl": "https://avatars.githubusercontent.com/u/11646882", "fallback": "...", "nickname": "pseudo"},
        ]
        message = json.dumps(usersData)
        return (message)

class SimpleEcho(WebSocket):
    def handleMessage(self):
        message = ""
        print("Message received: " + str(self.data))
        if (str(self.data) == "1"):
            message = getUsers()

        self.sendMessage(message)
        print("Sent message: \n" + str(message))

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('',8000, SimpleEcho)
print("listening on 8000")
server.serveforever()
