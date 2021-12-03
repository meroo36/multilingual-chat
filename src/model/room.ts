import Message from "./message";
import User from "./user";

interface Rooms {
    [room_name: string]: {
        owner_socket_id: string;
        users: User[];
        messages?: Message[];
    };
}

export default Rooms;
