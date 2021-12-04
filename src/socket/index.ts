import { server } from "..";
import { Server, Socket } from "socket.io";
import { joinRoom, leaveRoom } from "./roomListener";
import { sendMessage } from "./chatListener";
import Rooms from "../model/room";
import User from "../model/user";
import Message from "../model/message";

const io = new Server(server);

const rooms: Rooms = {
    global_room: {
        owner_socket_id: "999999",
        only_owner_can_chat: false,
        messages: [],
        users: [],
    },
};

io.on("connection", (socket: Socket) => {
    socket.emit("rooms:get", rooms);
    socket.on("room:join", (roomId: string, user: User) => joinRoom(socket, roomId, user, rooms));

    socket.on("message:send", (roomId: string, username: string, message: Message) => sendMessage(socket, roomId, username, message, rooms));
    socket.on("disconnecting", leaveRoom);
    socket.on("disconnect", (data) => {
        console.log("Disconnected socket rooms ", socket.rooms);
    });
});

export default io;
