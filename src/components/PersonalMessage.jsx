import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../features/apiSlice";
import { io } from "socket.io-client";
import { Avatar } from "@mui/material";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
const socket = io(import.meta.env.VITE_API_URL);

export default function PersonalMessage({ receiver, receiverData }) {
  const dispatch = useDispatch();
  const { messages: messagesData } = useSelector((state) => state.api);
  const [messages, setMessages] = useState([]);
  const sender = 2;

  useEffect(() => {
    if (sender && receiver) {
      socket.emit("join", { sender, receiver });
      // dispatch(fetchMessages({ sender, receiver }));
      // if (messagesData) {
      //   setMessages(messagesData);
      // }
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

  // console.log(messages);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedTime;
  };

  return (
    <div className="">
      {/* <div className="chat-area-header">
        <div className="chat-area-title">CodePen Group</div>
        <div className="chat-area-group">
          <img
            className="chat-area-profile"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png"
            alt
          />
          <img
            className="chat-area-profile"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png"
            alt
          />
          <img
            className="chat-area-profile"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png"
            alt
          />
          <span>+4</span>
        </div>
      </div> */}{" "}
      {/* <ScrollToBottom mode="bottom" className="chat-area-main"> */}
      <div className="chat-area-main">
        {/* <ScrollToBottom mode="bottom"> */}
        {messages.length
          ? messages.map((item, index) => (
              <div
                className={`chat-msg ${+item.sender === sender && "owner"}`}
                key={index}
              >
                <div className="chat-msg-profile">
                  <Avatar
                    html
                    alt="Group icon"
                    src={receiverData?.image}
                    className="chat-msg-img"
                  />
                  {/* <img
                    className="chat-msg-img"
                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png"
                    alt
                  /> */}
                  <div className="chat-msg-date">
                    {formatTimestamp(item?.timestamp)}
                  </div>
                </div>
                <div className="chat-msg-content">
                  <div className="chat-msg-text">{item?.message}</div>
                </div>
              </div>
            ))
          : ""}
        {/* </ScrollToBottom> */}
      </div>
      <div className="chat-area-footer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-video"
        >
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-image"
        >
          <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-plus-circle"
        >
          <circle cx={12} cy={12} r={10} />
          <path d="M12 8v8M8 12h8" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-paperclip"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </svg>
        <input type="text" placeholder="Type something here..." />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-smile"
        >
          <circle cx={12} cy={12} r={10} />
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-thumbs-up"
        >
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
      </div>
    </div>
  );
}
