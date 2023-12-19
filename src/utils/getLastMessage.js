import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URL);

function getLastMessage(sender, receiver) {
  const [lastMessage, setLastMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (sender && receiver) {
      socket.emit("join", { sender, receiver });
      axios
        .get(`${import.meta.env.VITE_API_URL}/messages/${sender}/${receiver}`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error(error));

      socket.on("message", (message) => {
        setMessages([...messages, message]);
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [sender, receiver, messages]);

  //   console.log(sender, receiver, messages);

  const userLastMsg = messages.filter((item) => +item.sender === sender);
  //   return userLastMsg[userLastMsg.length - 1]?.message;
  //   console.log(userLastMsg[userLastMsg.length - 1]);
  return userLastMsg[userLastMsg.length - 1]?.message;
}
export { getLastMessage };
