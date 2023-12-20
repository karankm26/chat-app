import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../features/apiSlice";
import { io } from "socket.io-client";
import { Avatar } from "@mui/material";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import { formatDateTime } from "../utils/timeFormat";
import EmojiPicker from "emoji-picker-react";
import { useDropzone } from "react-dropzone";
import { IoSend } from "react-icons/io5";
import { stylesDate } from "../utils/toggleStyle";
import ImageContainer from "./ImageContainer";
import { messagePostApi } from "../api";
import ImageLightbox from "./ImageLightbox";

const socket = io(import.meta.env.VITE_API_URL);
export default function GroupMessage({ groupId, groupData, groups }) {
  const [messages, setMessages] = useState([]);
  const [groupReceiver, setGroupReceiver] = useState("");
  const inputRef = useRef(null);
  const imageLightBoxRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDropped, setImageDropped] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [emojiPicker, setEmojiPicker] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  const sender = 2;

  // const receiver = groupReceiver;

  useEffect(() => {
    if (sender && groupReceiver) {
      socket.emit("join", { sender, groupReceiver });
      axios
        .get(`${import.meta.env.VITE_API_URL}/group/${groupId}`)
        .then((response) => setMessages(response.data.messages))
        .catch((error) => console.error(error));

      socket.on("message", (message) => {
        setMessages([...messages, message]);
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [sender, groupReceiver, messages]);

  useEffect(() => {
    if (groupData) {
      setGroupReceiver(groupData?.members?.[0]);
    }
  }, [groupData]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedTime;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const findMessage =
      messages.length && messages.find((item) => item.id === editMessageId);
    if (findMessage) {
      await axios.put(`${API_URL}/messages/${editMessageId}`, {
        message: newMessage,
      });
      setEditMessageId(null);
      setNewMessage("");
    } else {
      const formData = new FormData();
      formData.append("sender", sender);
      formData.append("receiver", groupReceiver);
      formData.append("message", newMessage.trim());
      formData.append("GroupId", groupId);

      if (selectedImage) {
        formData.append("image", selectedImage[0]);
      }
      socket.emit("message", {
        sender,
        receiver: groupReceiver,
        message: newMessage,
        GroupId: groupId,
        ...(selectedImage ? { image: selectedImage[0] } : {}),
      });

      try {
        await messagePostApi(formData);
        setMessages([
          ...messages,
          {
            sender,
            receiver: groupReceiver,
            message: newMessage,
            ...(selectedImage ? { image: selectedImage[0] } : {}),
          },
        ]);
        setNewMessage("");
        setImageDropped(false);
        setSelectedImage(null);
      } catch (error) {}
    }
  };
  const handeSelectImage = () => {
    setSelectedImage(e.target.files[0]);
  };

  const handleEmojiClick = (e) => {
    const emoji = e.emoji;
    const cursorPosition = inputRef.current.selectionStart;
    const beforeCursor = newMessage.slice(0, cursorPosition);
    const afterCursor = newMessage.slice(cursorPosition);
    const updatedMessage = beforeCursor + emoji + afterCursor;
    setNewMessage(updatedMessage);
    const newCursorPosition = cursorPosition + emoji.length;
    inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
  };

  return (
    <div
      className="position-relative h-100"
      style={imageDropped ? { overflow: "hidden" } : {}}
    >
      {(isDragActive || selectedImage || imageDropped) && (
        <ImageContainer
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setImageDropped={setImageDropped}
        />
      )}
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
      </div> */}
      <div className="chat-area-main mt-2">
        {messages.length
          ? messages.map((item, index) => (
              <div
                className={`chat-msg ${+item.sender === sender && "owner"}`}
                key={index}
              >
                {/* <div className="">{formatDateTime(item?.timestamp)}</div> */}
                <div className="chat-msg-profile">
                  <Avatar
                    html
                    alt="Group icon"
                    src={item?.sender_Details?.image}
                    className="chat-msg-img"
                  />

                  <div className="chat-msg-date">
                    {formatTimestamp(item?.timestamp)}
                  </div>
                </div>
                <div className="chat-msg-content">
                  <div className="chat-msg-text position-relative">
                    <span
                      className="position-absolute"
                      style={{
                        fontSize: "11px",
                        top: 3,
                        ...(+item.sender === sender
                          ? {}
                          : { color: item?.sender_Details?.color }),
                      }}
                    >
                      ~ {item?.sender_Details?.name?.split(" ")[0]}
                    </span>
                    <div className="mt-2">
                      {item?.image ? (
                        <img
                          src={item?.image}
                          alt={item?.name}
                          className="rounded"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (imageLightBoxRef.current) {
                              imageLightBoxRef.current.handleImageClick(item);
                            }
                          }}
                        />
                      ) : null}
                      <div>{item?.message}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : ""}
      </div>
      <form
        className="chat-area-footer"
        onSubmit={sendMessage}
        style={messages.length ? {} : { position: "absolute" }}
      >
        {emojiPicker ? (
          <div style={stylesDate.popover}>
            <div
              style={stylesDate.cover}
              onClick={() => setEmojiPicker(false)}
            />

            <EmojiPicker theme="dark" onEmojiClick={handleEmojiClick} />
          </div>
        ) : null}
        <svg
          onClick={() => setImageDropped(!imageDropped)}
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
          onClick={() => setEmojiPicker(!emojiPicker)}
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

        <input
          type="text"
          placeholder="Type something here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          ref={inputRef}
        />

        <button
          className="btn m-0 p-0 border-0"
          disabled={!selectedImage && !newMessage.trim()}
          type="submit"
        >
          <IoSend type="submit" />
        </button>
      </form>
      <ImageLightbox messages={messages} ref={imageLightBoxRef} />
    </div>
  );
}
