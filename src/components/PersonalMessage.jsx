import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../features/apiSlice";
import { io } from "socket.io-client";
import { Avatar } from "@mui/material";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import ImageContainer from "./ImageContainer";
import ImageLightbox from "./ImageLightbox";
import { useDropzone } from "react-dropzone";
import { IoSend } from "react-icons/io5";
import { messagePostApi } from "../api";
import { IoIosArrowDown } from "react-icons/io";

const socket = io(import.meta.env.VITE_API_URL);

export default function PersonalMessage({ receiver, receiverData, user }) {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const imageLightBoxRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDropped, setImageDropped] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const sender = 2;

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
      formData.append("receiver", receiver);
      formData.append("message", newMessage.trim());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      socket.emit("message", {
        sender,
        receiver,
        message: newMessage,
        image: selectedImage,
      });

      try {
        await messagePostApi(formData);
        // await axios.post(`${API_URL}/messages`, formData);
        setMessages([
          ...messages,
          { sender, receiver, message: newMessage, image: selectedImage },
        ]);
        setNewMessage("");
        // setShowSelectedImage(false);
        setSelectedImage(null);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handeSelectImage = () => {
    setSelectedImage(e.target.files[0]);
  };

  return (
    <div className="position-relative h-100">
      {(isDragActive || selectedImage || imageDropped) && (
        <div>
          <ImageContainer
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            setImageDropped={setImageDropped}
          />
        </div>
      )}

      {/* <ScrollToBottom mode="bottom" className="chat-area-main"> */}
      <div
        className="chat-area-main"
        {...getRootProps()}
        onClick={(e) => e.stopPropagation()}
      >
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
                    src={
                      +item.sender === sender
                        ? user?.image
                        : receiverData?.image
                    }
                    className="chat-msg-img"
                    sx={{ width: 30, height: 30 }}
                  />

                  <div className="chat-msg-date">
                    {formatTimestamp(item?.timestamp)}
                  </div>
                </div>
                <div className="chat-msg-content">
                  <IoIosArrowDown
                    className="position-absolute mt-1"
                    style={{ right: "65px" }}
                  />
                  <div className="chat-msg-text">
                    {item?.image ? (
                      <img
                        src={item?.image}
                        alt
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (imageLightBoxRef.current) {
                            imageLightBoxRef.current.handleImageClick(item);
                          }
                        }}
                      />
                    ) : null}
                    {item?.message}
                  </div>
                </div>
              </div>
            ))
          : ""}
        {/* </ScrollToBottom> */}
      </div>
      <input type="file" hidden onChange={handeSelectImage} />
      <form className="chat-area-footer" onSubmit={sendMessage}>
        {/* <svg
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
        </svg> */}
        <svg
          onClick={() => setImageDropped(true)}
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

        <button className="btn m-0 p-0">
          <IoSend type="submit" />
        </button>
      </form>
      <ImageLightbox messages={messages} ref={imageLightBoxRef} />
    </div>
  );
}
