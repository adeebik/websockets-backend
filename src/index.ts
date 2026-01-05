import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, Set<WebSocket>>();

type userInfo = {
  room: string;
  name: string;
};
const users = new Map<WebSocket, userInfo>();

wss.on("connection", (webSocket) => {
  webSocket.on("error", (e) => {
    console.log("Error occurred :", e);
  });

  webSocket.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());

    if (msg.type === "join") {
      const { roomId, name } = msg.payload;

      if (!rooms.has(roomId)) {
        const data = JSON.stringify({
          type: "system",
          text: "Room does not exist, Please create",
        });
        return webSocket.send(data);
      }

      rooms.get(roomId)?.add(webSocket);
      users.set(webSocket, { room: roomId, name: name });

      const data = JSON.stringify({
        type: "system",
        text: `${name} joined the room`,
      });

      rooms.get(roomId)?.forEach((socket) => {
        socket.send(data);
      });

      return;
    }

    if (msg.type === "create") {
      const { roomId, name } = msg.payload;

      if (rooms.has(roomId)) {
        const data = JSON.stringify({
          type: "system",
          text: "Room already exist, Please join!",
        });
        return webSocket.send(data);
      }

      rooms.set(roomId, new Set());
      rooms.get(roomId)?.add(webSocket);
      users.set(webSocket, { room: roomId, name: name });

      const data = JSON.stringify({
        type: "system",
        text: `${name} joined the room`,
      });

      rooms.get(roomId)?.forEach((socket) => {
        socket.send(data);
      });

      return;
    }

    if (msg.type === "chat") {
      const msgText = msg.payload.text;
      const userInfo = users.get(webSocket);

      if (!userInfo) return;

      const { room, name } = userInfo;

      const data = JSON.stringify({
        type: "chat",
        payload: {
          name,
          text: msgText,
        },
      });

      rooms.get(room)?.forEach((member) => {
        if (member !== webSocket) {
          member.send(data);
        }
      });
    }
  });

  webSocket.on("close", () => {
    const userInfo = users.get(webSocket);
    if (userInfo) {
      const { room } = userInfo;
      rooms.get(room)?.delete(webSocket);

      if (rooms.get(room)?.size === 0) {
        rooms.delete(room);
      }
    }
    users.delete(webSocket);
  });
});
