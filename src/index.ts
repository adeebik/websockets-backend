import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port:8000 })




const arina = new Map<string, Set<WebSocket>>();

 // Rooms and their members
/**
 * {
 * "room1" : "user/socket1", "user/socket2", "user/socket3"
 * "roomX" : "user/socket78", "user/socket41",
 * ...
 * }
 */

const user = new Map<WebSocket, string>(); 

// Maps each user to a room
/**
 * message: {
 * type: 'chat' | 'join'
 * text: 'any_chat_text' | 'roomName'
 * }
 */

wss.on("connection", function connection(socket: WebSocket) {

  // members.add(socket);
  // socket.send(`total no of members: ${members.size}`);

  socket.on("error", console.error);

  socket.on("message", function message(data) {

    const reqObj = JSON.parse(data.toString());
    
    if (reqObj.type === "join") {
      const roomName = reqObj.text;

      if (!arina.has(roomName)) {
        arina.set(roomName, new Set()); // Create the room if it doesn't exist
      }

      arina.get(roomName)?.add(socket);
      user.set(socket, roomName);

      socket.send(`You are added to room ${roomName} successfully`);
    } else {
      const roomName = user.get(socket); // Get the room the user is in

      if (roomName) {
        arina.get(roomName)?.forEach((member) => {
          if (member !== socket) {
            member.send(reqObj.text);
          }
        });
      }
    }
  });

  // Remove client on disconnect
  socket.on("close", () => {
    const roomName = user.get(socket);
    if (roomName) {
      arina.get(roomName)?.delete(socket);
      if (arina.get(roomName)?.size === 0) {
        arina.delete(roomName); // Remove the room if empty
      }
    }
    user.delete(socket);
  });
});
