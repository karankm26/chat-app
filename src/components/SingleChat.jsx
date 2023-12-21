import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { API_URL } from "../config";
import { MdOutlineDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RiImageAddFill } from "react-icons/ri";
import { stylesDate } from "../utils/toggleStyle";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import ImageLightbox from "../utils/ImageLightbox";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { Card, CardMedia, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ScrollToBottom from "react-scroll-to-bottom";

const socket = io(API_URL);

export default function SingleChat({ receiver }) {
  const inputRef = useRef(null);
  const imageLightBoxRef = useRef(null);
  const localStorageData = localStorage.getItem("user");
  const LocalData = localStorageData ? JSON.parse(localStorageData) : null;
  const sender = LocalData?.id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverData, setReceiverData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const currentUser = localStorage.getItem("currentUser");
  const ref = useRef(null);
  const [displayDateRangePicker, setDisplayRangePicker] = useState(false);
  const [showSelectedImage, setShowSelectedImage] = useState(false);

  useEffect(() => {
    if (sender && receiver) {
      socket.emit("join", { sender, receiver });
      axios
        .get(`${API_URL}/messages/${sender}/${receiver}`)
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
        const response = await axios.post(`${API_URL}/messages`, formData);
        setMessages([
          ...messages,
          { sender, receiver, message: newMessage, image: selectedImage },
        ]);
        setNewMessage("");
        setShowSelectedImage(false);
        setSelectedImage(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleImageChange = (e) => {
    setShowSelectedImage(true);

    setSelectedImage(e.target.files[0]);
  };

  useEffect(() => {
    const fatchdata = async () => {
      await axios
        .get(`${API_URL}/user/all`)
        .then((res) => {
          const filteredUser = res.data.find((item) => item.id === receiver);
          setReceiverData(filteredUser);
        })
        .catch((error) => console.error(error));
    };
    fatchdata();
  }, [receiver, currentUser]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedTime;
  };

  const handleDeleteMessage = async (id) => {
    await axios.delete(`${API_URL}/messages/${id}`);
  };
  const handleUpdateMessage = async (item) => {
    setEditMessageId(item.id);
    setNewMessage(item.message);
  };

  const getLastMessage = (id) => {
    const userLastMsg = messages.filter((item) => +item.sender === id);
    return userLastMsg[userLastMsg.length - 1]?.message;
  };

  const handleDeleteAllMesseges = async () => {
    await axios.delete(`${API_URL}/messages/${sender}/${receiver}`);
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
  const scrollId = useRef(null);

  useEffect(() => {
    if (scrollId.current) {
      console.log(scrollId.current);
    }
  }, [scrollId]);

  return (
    <div>
      <div className="chat">
        <div className="chat-header clearfix position-relative">
          <div className=" d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <div className="">
                {receiverData?.image ? (
                  <div>
                    <img
                      src={
                        receiverData?.image
                          ? receiverData?.image
                          : "https://bootdey.com/img/Content/avatar/avatar2.png"
                      }
                      alt="avatar"
                      style={{
                        width: "43px",
                        height: "43px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    {receiverData?.name && (
                      <InitialsAvatar name={receiverData?.name} />
                    )}
                  </div>
                )}
              </div>
              <div className="chat-about">
                <h6 className="m-0">{receiverData?.name}</h6>
                <small>Last seen: 2 hours ago</small>
              </div>
            </div>
            <div className="">
              <span className="wrap" data-bs-toggle="dropdown">
                <HiOutlineDotsVertical className="ico mt-2" />
              </span>
              <div
                className="dropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <ul className="dropdown-menu">
                  <li onClick={handleDeleteAllMesseges}>
                    <a className="dropdown-item align-items-center" href="#">
                      Delete all messages
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <ScrollToBottom className="chat-history" mode="bottom">
          <ul className="m-b-0 px-2 pt-3">
            {messages.length
              ? messages.map((item, index) =>
                  +item.sender === sender ? (
                    <li className="clearfix" key={index}>
                      <div className="text-end">
                        <div className="message other-message ">
                          <div className="dropdown">
                            <span
                              hidden={item.status === 3}
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              style={{
                                position: "absolute",
                                right: "-4px",
                                top: "-12px",
                                cursor: "pointer",
                              }}
                            >
                              <i
                                className="fa fa-angle-down"
                                style={{
                                  fontSize: "13px",
                                }}
                              />
                            </span>
                            <ul className="dropdown-menu py-2">
                              <li onClick={() => handleDeleteMessage(item.id)}>
                                <a
                                  className="dropdown-item align-items-center"
                                  href="#"
                                >
                                  <MdOutlineDeleteOutline className="ico" />
                                  Delete
                                </a>
                              </li>{" "}
                              <li onClick={() => handleUpdateMessage(item)}>
                                <a
                                  className="dropdown-item align-items-center"
                                  href="#"
                                >
                                  <MdModeEditOutline className="ico" />
                                  Edit
                                </a>
                              </li>
                            </ul>
                          </div>

                          <div>
                            {item.image ? (
                              <img
                                style={{ cursor: "pointer" }}
                                src={item.image}
                                alt="tushar"
                                height={150}
                                width={150}
                                className="rounded"
                                onClick={() => {
                                  if (imageLightBoxRef.current) {
                                    imageLightBoxRef.current.handleImageClick(
                                      item
                                    );
                                  }
                                }}
                              />
                            ) : null}
                          </div>
                          <div
                            style={
                              item.message === "message deleted"
                                ? {
                                    fontStyle: "italic",
                                    color: "rgb(255,255,255,0.4)",
                                  }
                                : {}
                            }
                          >
                            {item?.message}
                          </div>
                          {item?.status === 1 ? (
                            <div
                              className="m-0 p-0"
                              style={{
                                fontSize: "10px",
                                color: "rgb(255,255,255,0.4)",
                              }}
                            >
                              Edited
                            </div>
                          ) : null}
                        </div>
                        <div className="message-data ">
                          <span className="message-data-time ">
                            {formatTimestamp(item.timestamp)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li className="clearfix">
                      <div className="message my-message">
                        <div>
                          {item.image ? (
                            <img
                              style={{ cursor: "pointer" }}
                              src={item.image}
                              alt="tushar"
                              height={150}
                              width={150}
                              className="rounded"
                              onClick={() => {
                                if (imageLightBoxRef.current) {
                                  imageLightBoxRef.current.handleImageClick(
                                    item
                                  );
                                }
                              }}
                            />
                          ) : null}
                        </div>
                        <div
                          style={
                            item.status === 3
                              ? {
                                  fontStyle: "italic",
                                  color: "rgb(255,255,255,0.4)",
                                }
                              : {}
                          }
                        >
                          {item?.message}
                        </div>
                        {item?.status === 1 ? (
                          <div
                            className="m-0 p-0"
                            style={{
                              fontSize: "10px",
                              color: "rgb(255,255,255,0.4)",
                            }}
                          >
                            Edited
                          </div>
                        ) : null}
                      </div>
                      <div className="message-data">
                        <span className="message-data-time">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                    </li>
                  )
                )
              : "Start Chating"}
          </ul>
        </ScrollToBottom>
        <div className="position-relative">
          {showSelectedImage ? (
            <div>
              <div className="position-absolute selected-image ">
                <Card
                  sx={{ maxWidth: 300, bgcolor: "rgb(34,52,64),", p: 1 }}
                  className="shadow "
                >
                  <div className="text-end">
                    <IconButton
                      aria-label="settings"
                      sx={{ p: 0 }}
                      onClick={() => {
                        setSelectedImage(null);
                        setShowSelectedImage(false);
                      }}
                    >
                      <CloseIcon sx={{ color: "rgb(255, 255, 255, 0.3)" }} />
                    </IconButton>
                  </div>
                  <CardMedia
                    component="img"
                    height="190"
                    image={selectedImage && URL.createObjectURL(selectedImage)}
                    alt="Paella dish"
                  />
                </Card>
              </div>
            </div>
          ) : null}
        </div>
        <div className="chat-message clearfix ">
          <div className="">
            <form onSubmit={sendMessage}>
              <div className="mb-0 position-relative">
                <input
                  type="file"
                  id="image-input"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />{" "}
                <div className="input-bottom-sender">
                  {displayDateRangePicker ? (
                    <div style={stylesDate.popover}>
                      <div
                        style={stylesDate.cover}
                        onClick={() => setDisplayRangePicker(false)}
                      />

                      <EmojiPicker
                        theme="dark"
                        onEmojiClick={handleEmojiClick}
                      />
                    </div>
                  ) : null}
                  <div className="">
                    <a className="btn">
                      <label htmlFor="image-input">
                        <RiImageAddFill className="ico" />
                      </label>
                    </a>
                  </div>
                  <div className="d-flex align-items-center">
                    <BsEmojiSmile
                      className="ico"
                      onClick={() =>
                        setDisplayRangePicker(!displayDateRangePicker)
                      }
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control rounded-pill form-control-2"
                      placeholder="Enter text here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      ref={inputRef}
                    />
                  </div>
                  <div>
                    <button
                      className="btn send-button rounded-circle"
                      type="submit"
                      disabled={!selectedImage && !newMessage.trim()}
                    >
                      <IoSend
                        className="text-light"
                        style={{
                          fontSize: "23px",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ImageLightbox ref={imageLightBoxRef} messages={messages} />
    </div>
  );
}
