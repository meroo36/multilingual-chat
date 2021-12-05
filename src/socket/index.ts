import { Server, Socket } from "socket.io";
import { createRoom, joinRoom, leaveRoom } from "./roomListener";
import { sendMessage } from "./chatListener";
import Rooms from "../model/rooms";
import User from "../model/user";
import Message from "../model/message";
import http from "http";

const rooms: Rooms = {
    global_room: {
        owner_socket_id: "999999",
        only_owner_can_chat: false,
        messages: [],
        lang_list: [],
        users: [],
    },
};

const attachSocketIo = (server: http.Server) => {
    const io = new Server(server);
    io.on("connection", (socket: Socket) => {
        socket.emit("rooms:get", rooms);

        //room listeners
        socket.on("room:join", (roomId: string, user: User) => joinRoom({ socket, roomId, user, rooms }));
        socket.on("room:create", (roomId: string, user: User, onlyOwnerCanChat: boolean) =>
            createRoom({ socket, roomId, user, onlyOwnerCanChat, rooms })
        );

        //message listeners
        socket.on("message:send", (roomId: string, message: Message) => sendMessage({ socket, roomId, message, rooms }));

        //disconnect listeners
        socket.on("disconnecting", () => leaveRoom(socket, rooms));
        socket.on("disconnect", () => {
            console.log("Disconnected socket rooms ", socket.id);
        });
    });
};

export default attachSocketIo;
