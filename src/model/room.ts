import Message from "./message";
import User from "./user";

interface Rooms {
    [room_name: string]: {
        owner_socket_id: string;
        only_owner_can_chat: boolean;
        users: User[];
        messages?: Message[];
    };
}

export default Rooms;
