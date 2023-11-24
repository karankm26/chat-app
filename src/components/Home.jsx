import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { styled } from "@mui/material/styles";
import { DialogTitle, Dialog, Button, DialogContent } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { API_URL } from "../config";
import { Navigate, useNavigate } from "react-router-dom";
const socket = io(API_URL);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Home() {
  const navigate = useNavigate();
  const [user, setUsers] = useState([]);
  const localStorageData = localStorage.getItem("user");
  const LocalData = localStorageData ? JSON.parse(localStorageData) : null;
  const sender = LocalData?.id;
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef();
  const [receiverData, setReceiverData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    socket.emit("join", { sender, receiver });

    axios
      .get(`${API_URL}/messages/${sender}/${receiver}`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error(error));

    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [sender, receiver, messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  const sendMessage = async (e) => {
    console.log("submit");
    e.preventDefault();
    const formData = new FormData();
    formData.append("sender", sender);
    formData.append("receiver", receiver);
    formData.append("message", newMessage);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Emit message through socket
    socket.emit("message", {
      sender,
      receiver,
      message: newMessage,
      image: selectedImage,
    });

    try {
      // Send the message with image using FormData
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
  }, [receiver]);

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
  const [open, setOpen] = useState(false);
  console.log(messages);
  return (
    <>
      <div className="container">
        <div className="row clearfix mt-1">
          <div className="col-lg-12">
            <div className="card chat-app">
              <div id="plist" className="people-list">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-search" />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  />
                </div>
                <ul className="list-unstyled chat-list mt-2 mb-0">
                  {user.length ? (
                    user.map((item) => (
                      <li
                        className="clearfix"
                        onClick={() => setReceiver(item.id)}
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
                            <i className="fa fa-circle offline" /> left 7 mins
                            ago
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="clearfix">No Chats Found</li>
                  )}
                </ul>
              </div>
              <div className="chat">
                <div className="chat-header clearfix">
                  <div className="row">
                    <div className="col-lg-6">
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
                    <div className="col-lg-6 hidden-sm text-end">
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
                      <a
                        className="btn btn-outline-danger"
                        onClick={() => {
                          localStorage.removeItem("user");
                          navigate("/login");
                        }}
                      >
                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="chat-history">
                  <ul className="m-b-0">
                    {messages.length
                      ? messages.map((item) =>
                          +item.sender === sender ? (
                            <li className="clearfix">
                              <div className="message-data">
                                <span className="message-data-time">
                                  {formatTimestamp(item.timestamp)}
                                </span>
                              </div>
                              <div className="message my-message">
                                <div>
                                  {item.image ? (
                                    <img
                                      style={{ cursor: "pointer" }}
                                      src={item.image}
                                      alt="tushar"
                                      height={150}
                                      width={150}
                                      onClick={() => setOpen(item.image)}
                                    />
                                  ) : null}
                                </div>
                                <span>{item?.message}</span>
                              </div>
                            </li>
                          ) : (
                            <li className="clearfix">
                              <div className="message-data text-end">
                                <span className="message-data-time ">
                                  {formatTimestamp(item.timestamp)}
                                </span>
                              </div>
                              <div className="message other-message float-right">
                                <div>
                                  {item.image ? (
                                    <img
                                      style={{ cursor: "pointer" }}
                                      src={item.image}
                                      alt="tushar"
                                      height={150}
                                      width={150}
                                      onClick={() => setOpen(item.image)}
                                    />
                                  ) : null}
                                </div>
                                <span>{item?.message}</span>
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
                            className="form-control"
                            placeholder="Enter text here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />{" "}
                          <div className="input-group-prepend">
                            <button className="input-group-text" type="submit">
                              <i
                                className="fa fa-send"
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
          </div>
        </div>
      </div>
      <>
        <BootstrapDialog
          onClose={() => setOpen(false)}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle sx={{ m: 0, p: 0 }} id="customized-dialog-title">
            &nbsp;
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <img src={open} height={450} width={450} />
          </DialogContent>
        </BootstrapDialog>
      </>
    </>
  );
}
