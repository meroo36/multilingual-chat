import { server } from "..";
import { Server, Socket } from "socket.io";
import { joinRoom, leaveRoom } from "./roomListener";
import Rooms from "../model/room";

const io = new Server(server);

const rooms: Rooms = {
    asdasd: {
        owner_socket_id: "123213",
        messages: [],
        users: [],
    },
};

io.on("connection", (socket: Socket) => {
    socket.on("room:join", (roomId, username) => joinRoom(socket, roomId, username, rooms));

    socket.on("disconnecting", leaveRoom);
    socket.on("disconnect", (data) => {
        console.log("Disconnected socket rooms ", socket.rooms);
    });
});

export default io;
