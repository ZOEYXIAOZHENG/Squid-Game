export default function chatMessagesReducer(msgs = null, action) {
    if (action.type == "chatMessages/chatMessagesReceived") {
        msgs = action.payload.msgs;
    }
    if (action.type == "chatMessages/chatMessageReceived") {
        const msgsArr = [...msgs];
        msgsArr.unshift(action.payload.msg);
        msgs = msgsArr;
    }
    return msgs;
}

export function chatMessagesReceived(msgs) {
    console.log("receiveMsg 🟡 ");
    return {
        type: "chatMessages/chatMessagesReceived",
        payload: { msgs },
    };
}

export function chatMessageReceived(msg) {
    console.log("receiveMsgsssssss 🔴 ");
    return {
        type: "chatMessages/chatMessageReceived",
        payload: { msg },
    };
}
