import { io } from "socket.io-client";
import {
    chatMessagesReceived,
    chatMessageReceived,
} from "../redux/messages/slice.js";

export let socket;

export const init = (store) => {
    
    if (!socket) {
        socket = io.connect();
        console.log("init runs!",socket);
        

        socket.on("chatMessages", (msgs) =>
            store.dispatch(chatMessagesReceived(msgs))
        );

        socket.on("chatMessage", (msg) =>
            store.dispatch(chatMessageReceived(msg))
        );
    }
};
