import translate, { DeeplLanguages } from "deepl";
import { Socket } from "socket.io";
import Message from "../model/message";
import Rooms from "../model/rooms";

const sendMessage = async (config: { socket: Socket; roomId: string; message: Message; rooms: Rooms }) => {
    const { socket, roomId, message, rooms } = config;
    const room = rooms[roomId];
    if (room) {
        const isNotOwnerAndRoomIsOnlyOwnerChat = socket.id !== room.owner_socket_id && room.only_owner_can_chat;
        if (isNotOwnerAndRoomIsOnlyOwnerChat) return;
        const langs = room.lang_list;
        for (const lang of langs) {
            if (lang === message.original_lang) {
                socket.to(`${roomId}/${lang}`).emit("message:receive", message.username, message.text);
            } else {
                const translatedText = await translate({
                    free_api: true,
                    text: message.text,
                    target_lang: lang as DeeplLanguages,
                    auth_key: `${process.env.DEEPL_API_KEY}`,
                });
                socket.to(`${roomId}/${lang}`).emit("message:receive", message.username, translatedText.data.translations[0].text);
            }
        }
    }
};

export { sendMessage };
