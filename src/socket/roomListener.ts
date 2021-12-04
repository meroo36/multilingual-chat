import { Socket } from "socket.io";
import Rooms from "../model/room";
import User from "../model/user";

const joinRoom = (socket: Socket, roomId: string, user: User, rooms: Rooms) => {
    const room = rooms[roomId];
    if (room) {
        let socketId = socket.id;
        user.socket_id = socketId;
        room.users.push(user);
        socket.join(roomId);
        socket.to(roomId).emit("room:userJoined", user.username);
    } else return;
};
const leaveRoom = () => {};

export { joinRoom, leaveRoom };
