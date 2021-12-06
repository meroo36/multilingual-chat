import { Socket } from "socket.io";
import Rooms from "../model/rooms";
import User from "../model/user";

const joinRoom = (config: { socket: Socket; roomId: string; user: User; rooms: Rooms }) => {
    const { socket, roomId, user, rooms } = config;
    const room = rooms[roomId];
    if (room) {
        let socketId = socket.id;
        user.socket_id = socketId;

        //add user to room in memory
        room.users.push(user);

        //add language to lang_list if its not already exists
        const roomHasTheSameLanguage = !room.lang_list.includes(user.lang);
        if (roomHasTheSameLanguage) room.lang_list.push(user.lang);

        //add user to corresponding room by language
        socket.join(`${roomId}/${user.lang}`);
        //add user to roomId for non-linguistic events
        socket.join(roomId);

        //send new room to client
        socket.broadcast.emit("rooms:get", rooms);

        socket.broadcast.to(roomId).emit("room:userJoined", user.username);
    } else return;
};

const createRoom = (config: { socket: Socket; roomId: string; user: User; onlyOwnerCanChat: boolean; rooms: Rooms }) => {
    //initialize room
    const { socket, roomId, user, onlyOwnerCanChat, rooms } = config;
    user.socket_id = socket.id;
    rooms[roomId] = {
        lang_list: [user.lang],
        only_owner_can_chat: onlyOwnerCanChat,
        users: [user],
        owner_socket_id: socket.id,
    };

    //send new room to client
    socket.broadcast.emit("rooms:get", rooms);
    socket.join(`${roomId}/${user.lang}`);

    //add user to roomId for non-linguistic events
    socket.join(roomId);
};
const leaveRoom = (socket: Socket, rooms: Rooms) => {
    const socketId = socket.id;

    //search user in every chat room
    for (const [key, value] of Object.entries(rooms)) {
        const userList = value.users;
        const index = userList.findIndex((element) => element.socket_id == socketId);
        //if user is found, remove it from the room
        if (index > -1) {
            socket.broadcast.to(key).emit("room:userLeft", value.users[index].username);
            value.users.splice(index, 1);

            //if the room is empty close the room entirely
            const roomIsEmptyAndNotGlobalRoom = value.users.length === 0 && key !== "global_room";
            if (roomIsEmptyAndNotGlobalRoom) {
                delete rooms[key];
            }
        }
    }
    socket.broadcast.emit("rooms:get", rooms);
};

export { joinRoom, leaveRoom, createRoom };
