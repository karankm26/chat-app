import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import {
  MdOutlineDeleteOutline,
  MdModeEditOutline,
  MdAddBox,
  MdGroups,
} from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import { IoSearchOutline, IoSend } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RiImageAddFill } from "react-icons/ri";
import MuiDailog from "./MuiDailog";
import InputEmoji from "react-input-emoji";
import { stylesDate } from "../utils/toggleStyle";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import GroupDailog from "./GroupDailog";
import { Avatar } from "@mui/material";
const socket = io(API_URL);

export default function GroupChat({ groupId }) {
  const inputRef = useRef(null);
  const groupDialogRef = useRef(null);
  const dialogRef = useRef(null);
  const [user, setUsers] = useState([]);
  const localStorageData = localStorage.getItem("user");
  const LocalData = localStorageData ? JSON.parse(localStorageData) : null;
  const sender = LocalData?.id;
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverData, setReceiverData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const currentUser = localStorage.getItem("currentUser");
  const ref = useRef(null);
  const [displayDateRangePicker, setDisplayRangePicker] = useState(false);
  const [groups, setGroups] = useState([]);

  const randomColor = [
    "#1ed760",
    "#d7601e",
    "#f11712",
    "#34f9fe",
    "#0443f0",
    "#6cbcf7",
    "#b6891c",
    "#6cbcf7",
    "#e90035s",
    "#ea5656",
    "#18598b",
    "#0099f7",
  ];
  //   useEffect(() => {
  //     if (currentUser) setReceiver(+currentUser);
  //   }, [currentUser]);

  useEffect(() => {
    if (groupId && receiver) {
      socket.emit("join", { sender, receiver });
      axios
        .get(`${API_URL}/group/${groupId}`)
        .then((response) => setMessages(response.data.messages))
        .catch((error) => console.error(error));

      socket.on("message", (message) => {
        setMessages([...messages, message]);
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [sender, receiver, messages, groupId]);
  // console.log("messages", messages);
  // console.log("groups", groups);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", {
      sender,
      receiver,
      message: newMessage,
      GroupId: groupId,
    });
    axios
      .post(`${API_URL}/messages`, {
        sender,
        receiver,
        message: newMessage,
        GroupId: groupId,
      })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));

    setMessages([...messages, { sender, receiver, message: newMessage }]);
    setNewMessage("");
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // useEffect(() => {
  //   const fatchdata = async () => {
  //     await axios
  //       .get(`${API_URL}/group/${groupId}`)
  //       .then((res) => {
  //         setMessages(res.data.messages);
  //       })
  //       .catch((error) => console.error(error));
  //   };
  //   fatchdata();
  // }, [currentUser, groupId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsResponse = await axios.get(`${API_URL}/group`);
        const filteredGroup = groupsResponse.data.find(
          (item) => item.id === groupId
        );
        setGroups(filteredGroup);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [groupId]);

  useEffect(() => {
    if (Object.keys(groups).length) {
      const memberId = groups?.members?.split(",");
      setReceiver(+memberId[0]);
    }
  }, [groups]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedTime;
  };

  const handleImageClick = (item) => {
    const filteredImages = messages
      .filter((i) => i.image && i.id !== item.id)
      .map(({ image, message }) => ({
        src: image,
        ...(message ? { description: message } : {}),
      }));
    const clickedImage = item.message
      ? { description: item.message, src: item.image }
      : { src: item.image };
    setOpen([clickedImage, ...filteredImages]);
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

  const handleDeleteGroup = async () => {
    await axios.delete(`${API_URL}/${groupId}/${LocalData.id}`);
  };

  const handleAddUser = () => {
    if (dialogRef.current) {
      dialogRef.current.handleClickOpen();
    }
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
  // console.log(groups);
  console.log(messages);
  return (
    <div>
      <div className="chat">
        <div className="chat-header clearfix position-relative">
          <div className="align-items-center">
            <div className="">
              <div>
                <img
                  src={
                    groups?.image
                      ? groups?.image
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
              <div className="chat-about">
                <h6 className="m-0">{groups?.group_name}</h6>
                <small>Last seen: 2 hours ago</small>
              </div>
            </div>
            <div className="text-end">
              <span className="wrap" data-bs-toggle="dropdown">
                <HiOutlineDotsVertical className="ico mt-2" />
              </span>
              <div
                className="dropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <ul className="dropdown-menu">
                  <li onClick={handleDeleteGroup}>
                    <a className="dropdown-item align-items-center" href="#">
                      Delete all messages
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="chat-history" id="style-2">
          <ul className="m-b-0">
            {messages.length
              ? messages.map((item) =>
                  +item.sender === sender ? (
                    <li className="clearfix">
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
                                  // setOpen(item.image);
                                  handleImageClick(item);
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
                      <div className="d-flex">
                        <div className="me-1">
                          <Avatar
                            alt="Group icon"
                            src={
                              item?.sender_Details?.image
                                ? item?.sender_Details?.image
                                : "/static/images/avatar/1.jpg"
                            }
                            sx={{ width: 25, height: 25 }}
                          />
                        </div>
                        <div className="message my-message">
                          <div className="mb-3 mx-4">
                            <div
                              className="position-absolute top-0"
                              style={{
                                left: 5,
                                fontSize: "12px",
                                color: item?.sender_Details?.color,
                              }}
                            >
                              ~ {item?.sender_Details?.name}
                            </div>
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
                                  // setOpen(item.image);
                                  handleImageClick(item);
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
                      </div>
                      <div className="message-data" style={{ paddingLeft: 28 }}>
                        <span className="message-data-time">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                    </li>
                  )
                )
              : "Start Chating"}
          </ul>
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
                    {/* <InputEmoji
                            value={newMessage}
                            onChange={(e) => {
                              console.log(e);
                              setNewMessage(e);
                            }}
                            cleanOnEnter
                            onEnter={sendMessage}
                            placeholder="Type a message"
                            inputClass="form-control-2 rounded-pill"
                            shouldReturn
                          /> */}
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
                      disabled={!newMessage.trim()}
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
    </div>
  );
}