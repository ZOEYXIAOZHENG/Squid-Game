import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const msgs = useSelector((state) => state?.msgs);
    // const chatMessages = useSelector((state) => state?.chatMessages);
    const textareaRef = useRef();
    const chatContainerRef = useRef();

    useEffect(() => {
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
    }, [msgs]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            console.log("connected here!!");
            e.preventDefault();
            // socket
            // .emit("newChatMessage", {
            //     msg: e.target.value,
            // })
            // .then((resp) => resp.json())
            // .then((resp) => console.log(resp));
            socket.emit("chatMessage", e.target.value);
            textareaRef.current.value = "";
        }
    };

    var mapMessage = (msg) => {
        if (msg.is_myself) {
            return (
                <div key={msg.id} className="own-msg-box">
                    <div className="msg-inner">
                        <p>
                            {msg.created_at} {msg.first_name} {msg.last_name}:{" "}
                            {msg.message}
                        </p>
                    </div>
                    <div className="msg-inner">
                        <img className="person-list" src={msg.picture_url} />
                    </div>
                </div>
            );
        } else {
            return (
                <div key={msg.id} className="msg-box">
                    <div className="msg-inner">
                        <img className="person-list" src={msg.picture_url} />
                    </div>
                    <div className="msg-inner">
                        <p>
                            {msg.created_at} {msg.first_name} {msg.last_name}:{" "}
                            {msg.message}
                        </p>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <div id="chat-base"></div>
            <div id="extension"></div>
            <div className="chat-container" ref={chatContainerRef}>
                <h2> CHAT ROOM:</h2>
                {msgs?.map(mapMessage)}
            </div>
            <textarea
                className="input-box"
                ref={textareaRef}
                onKeyDown={keyCheck}
                placeholder="Enter your message here"
                rows="10"
                cols="100"
            />
        </>
    );
}
