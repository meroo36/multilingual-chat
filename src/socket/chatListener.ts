import { Socket } from "socket.io";
import Message from "../model/message";
import Rooms from "../model/room";

const sendMessage = (socket: Socket, roomId: string, username: string, message: Message, rooms: Rooms) => {
    const room = rooms[roomId];
    if (room) {
        //sending the translated message to corresponding users
        //socket.to(roomId).emit("message:recieve", username, message);
    }
};

export { sendMessage };
