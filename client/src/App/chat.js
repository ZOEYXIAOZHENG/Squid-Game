import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const chatMessages = useSelector((state) => state?.chatMessages);
    const textareaRef = useRef();
    const chatContainerRef = useRef();

    useEffect(() => {
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
    }, [chatMessages]);

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

                console.log("oli is here!", e.target.value);
            socket.emit("newChatMessage", e.target.value);
            textareaRef.current.value = "";
        }
    };

    return (
        <>
            <div className="chat-container" ref={chatContainerRef}>
                <p>～～～～MESSAGES RECORD～～～～</p>
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
