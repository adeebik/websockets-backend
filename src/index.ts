import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8000 });

const allRooms = new Map<string, Set<WebSocket>>();
const user = new Map<WebSocket, string>();

wss.on("connection", (socket) => {
  socket.on("error", console.error);

  socket.on("message", (msg) => {
    const parsedmsg = JSON.parse(msg.toString());

    if (parsedmsg.type === "join") {
      const roomName = parsedmsg.payload.roomId;
      if (!allRooms.has(roomName)) {
        allRooms.set(roomName, new Set());
      }

      allRooms.get(roomName)?.add(socket);
      user.set(socket, roomName);
    }

    if (parsedmsg.type === "chat") {
      const messgae = parsedmsg.payload.text;
      const roomName = user.get(socket);
      if (roomName) {
        allRooms.get(roomName)?.forEach((members) => {
          if (members !== socket) {
            members.send(messgae);
          }
        });
      }
    }
  });

  socket.on("close", () => {
    const roomName = user.get(socket);
    if (roomName) {
      allRooms.get(roomName)?.delete(socket);
      if (allRooms.get(roomName)?.size === 0) {
        allRooms.delete(roomName);
      }
    }
    user.delete(socket);
  });
});
