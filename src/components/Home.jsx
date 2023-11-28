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
import { MdOutlineDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";

const socket = io(API_URL);
export default function Home() {
  const navigate = useNavigate();
  const chatContainerRef = useRef();
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

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    handleClick();
  }, []);

  useEffect(() => {
    if (currentUser) setReceiver(+currentUser);
  }, [currentUser]);

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
        setSelectedImage(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleImageChange = (e) => {
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

  useEffect(() => {
    const fatchdata = async () => {
      await axios
        .get(`${API_URL}/user/all`)
        .then((res) => {
          const filteredUser = res.data.filter((item) => item.id !== sender);
          setUsers(filteredUser);
        })
        .catch((error) => console.error(error));
    };
    fatchdata();
  }, []);

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
  return (
    <>
      <div className="container-fluid">
        <div className="row clearfix ">
          {/* <div className="col-lg-12 m-0 p-0"> */}
          <div className="card chat-app">
            <div id="plist" className="people-list people-menu">
              <div className="d-flex justify-content-between align-items-center">
                <h2>Chats</h2>
                <div
                  className="dropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i
                    className="fa fa-ellipsis-v "
                    style={{ cursor: "pointer" }}
                    aria-hidden="true"
                  />
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item align-items-center" href="#">
                        <AiOutlineUser
                          // style={{ fontSize: "14px" }}
                          className="ico me-1"
                        />
                        Profile
                      </a>
                    </li>
                    <li onClick={() => handleDeleteMessage(item.id)}>
                      <a
                        className="dropdown-item align-items-center"
                        onClick={() => {
                          localStorage.removeItem("user");
                          navigate("/login");
                        }}
                      >
                        <FiLogOut className="ico me-1" />
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="input-group">
                <span
                  className=""
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    right: 15,
                    top: 6,
                  }}
                >
                  <i className="fa fa-search" />
                </span>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Search..."
                />
              </div>
              <ul className="list-unstyled chat-list mt-2 mb-0">
                {user.length ? (
                  user.map((item, index) => (
                    <>
                      {!index && <hr className="m-0 p-0" />}
                      <li
                        className="clearfix"
                        onClick={() => {
                          setReceiver(item.id);
                          localStorage.setItem("currentUser", item.id);
                        }}
                      >
                        <img
                          src={
                            item?.image
                              ? item.image
                              : "https://bootdey.com/img/Content/avatar/avatar2.png"
                          }
                          alt="avatar"
                        />
                        <div className="about">
                          <div className="name">{item?.name}</div>
                          <div className="status">
                            {/* <i className="fa fa-circle offline" /> */}
                            {getLastMessage(item.id)}
                          </div>
                        </div>
                      </li>
                      <hr className="m-0 p-0" />
                    </>
                  ))
                ) : (
                  <li className="clearfix">No Chats Found</li>
                )}
              </ul>
            </div>
            <div
              className="chat"
              style={receiver ? { display: "none" } : { height: "600px" }}
            ></div>
            <div
              className="chat"
              style={receiver ? { display: "block" } : { display: "none" }}
            >
              <div className="chat-header clearfix">
                <div className="row">
                  <div className="col-lg-6 ">
                    <a
                      href="javascript:void(0);"
                      data-toggle="modal"
                      data-target="#view_info"
                    >
                      <img
                        src={
                          receiverData?.image
                            ? receiverData?.image
                            : "https://bootdey.com/img/Content/avatar/avatar2.png"
                        }
                        alt="avatar"
                      />
                    </a>
                    <div className="chat-about">
                      <h6 className="m-b-0">{receiverData?.name}</h6>
                      <small>Last seen: 2 hours ago</small>
                    </div>
                  </div>
                  {/* <div className="col-lg-6 hidden-sm text-end">
                      <a
                        href="javascript:void(0);"
                        className="btn btn-outline-secondary"
                      >
                        <i className="fa fa-camera" />
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="btn btn-outline-primary"
                      >
                        <label htmlFor="image-input">
                          <i className="fa fa-image" />
                        </label>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="btn btn-outline-info"
                      >
                        <i className="fa fa-cogs" />
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="btn btn-outline-warning"
                      >
                        <i className="fa fa-question" />
                      </a>{" "}
                    </div> */}
                </div>
              </div>
              <div className="chat-history" id="style-2">
                <ul className="m-b-0" ref={chatContainerRef}>
                  {messages.length
                    ? messages.map((item, index) =>
                        +item.sender === sender ? (
                          <li className="clearfix">
                            <div>
                              <div
                                className="message other-message float-right"
                                // style={{ position: "relative", right: 0 }}
                              >
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
                                    <li
                                      onClick={() =>
                                        handleDeleteMessage(item.id)
                                      }
                                    >
                                      <a
                                        className="dropdown-item align-items-center"
                                        href="#"
                                      >
                                        <MdOutlineDeleteOutline className="ico" />
                                        Delete
                                      </a>
                                    </li>{" "}
                                    <li
                                      onClick={() => handleUpdateMessage(item)}
                                    >
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
                              <div className="message-data text-end message-data-left">
                                <span className="message-data-time ">
                                  {formatTimestamp(item.timestamp)}
                                </span>
                              </div>
                            </div>
                          </li>
                        ) : (
                          <li className="clearfix">
                            <div className="message my-message">
                              {/* <div className="dropdown">
                                  <span
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{
                                      position: "absolute",
                                      right: "-11px",
                                      top: "-17px",
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
                                  <ul className="dropdown-menu">
                                    <li>
                                      <a
                                        className="dropdown-item align-items-center"
                                        href="#"
                                      >
                                        <IoIosInformationCircleOutline /> Info
                                      </a>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleDeleteMessage(item.id)
                                      }
                                    >
                                      <a
                                        className="dropdown-item align-items-center"
                                        href="#"
                                      >
                                        <MdOutlineDeleteOutline />
                                        Delete
                                      </a>
                                    </li>
                                    <li
                                      onClick={() => handleUpdateMessage(item)}
                                    >
                                      <a
                                        className="dropdown-item align-items-center"
                                        href="#"
                                      >
                                        <MdModeEditOutline />
                                        Edit
                                      </a>
                                    </li>
                                  </ul>
                                </div> */}
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
                                  item.status === 1
                                    ? {
                                        fontStyle: "italic",
                                        color: "rgb(255,255,255,0.4)",
                                      }
                                    : {}
                                }
                              >
                                {item?.message}
                              </div>{" "}
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
                <div className="row">
                  <div className="col-1">
                    {" "}
                    <a
                      href="javascript:void(0);"
                      className="btn btn-outline-primary"
                    >
                      <label htmlFor="image-input">
                        <i className="fa fa-image" />
                      </label>
                    </a>
                  </div>
                  <div className="col-11">
                    <form onSubmit={sendMessage}>
                      <div className="input-group mb-0 col-lg-2">
                        <input
                          type="file"
                          id="image-input"
                          hidden
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <input
                          type="text"
                          className="form-control rounded-pill "
                          placeholder="Enter text here..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />{" "}
                        <div className="ms-1">
                          <button
                            className="btn rounded-circle bg-primary "
                            type="submit"
                            disabled={!newMessage.trim()}
                          >
                            <i
                              className="fa fa-send text-dark"
                              style={{ fontSize: "23px" }}
                            />
                          </button>
                        </div>
                      </div>{" "}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>

      <>
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          plugins={[Zoom, Fullscreen, Thumbnails, Captions]}
          slides={open}
        />
      </>
    </>
  );
}
