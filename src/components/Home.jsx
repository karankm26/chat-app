import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { MdAddBox, MdGroups } from "react-icons/md";
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
import SingleChat from "./SingleChat";
import GroupChat from "./GroupChat";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";

const socket = io(API_URL);
export default function Home() {
  const [section, setSection] = useState(null);
  const inputRef = useRef(null);
  const groupDialogRef = useRef(null);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const chatContainerRef = useRef();
  const [friends, setFriends] = useState([]);
  const localStorageData = localStorage.getItem("user");
  const LocalData = localStorageData ? JSON.parse(localStorageData) : null;
  const sender = LocalData?.id;
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState([]);
  const [receiverData, setReceiverData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const currentUser = localStorage.getItem("currentUser");
  const [groupId, setGroupId] = useState("");
  const ref = useRef(null);
  const [groups, setGroups] = useState([]);
  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    handleClick();
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (isNaN(currentUser)) {
        const gId = +currentUser.split(",")[0];
        setGroupId(gId);
        setSection("group");
      } else {
        setReceiver(+currentUser);
        setSection("single");
      }
    }
  }, [currentUser]);

  console.log(groupId, receiver);

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
    if (LocalData.id) {
      const fatchdata = async () => {
        await axios
          .get(`${API_URL}/user/${LocalData.id}`)
          .then((res) => {
            setUser({
              ...res.data,
              friends: res.data.friends
                ? res.data.friends.split(",").map((item1) => +item1)
                : [],
            });
          })
          .catch((error) => console.error(error));
      };
      fatchdata();
    }
  }, [LocalData.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${API_URL}/user/all`);
        const filteredUsers = usersResponse.data.filter(
          (item) =>
            user.friends &&
            user.friends.some((friendId) => friendId === item.id)
        );
        setFriends(filteredUsers);

        const groupsResponse = await axios.get(`${API_URL}/group`);
        const filtered = groupsResponse.data
          .map(({ members, ...rest }) => ({
            ...rest,
            members: members
              .split(",")
              .map((item) =>
                item.trim() !== "" && !isNaN(item) ? +item : null
              )
              .filter((item) => item !== null),
          }))
          .map((item) => {
            return {
              ...item,
              isMember: item.members.some((member) => member === sender),
            };
          });

        setGroups(filtered);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user]);

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

  const handleDeleteAllMesseges = async () => {
    await axios.delete(`${API_URL}/messages/${sender}/${receiver}`);
  };
  const handleUserSearch = () => {
    // const searchedUser = user
  };

  const handleAddUser = () => {
    if (dialogRef.current) {
      dialogRef.current.handleClickOpen();
    }
  };

  const handleAddGroup = () => {
    if (groupDialogRef.current) {
      groupDialogRef.current.handleClickOpen();
    }
  };

  // console.log(messages);

  // const handleEmojiClick = (e) => {
  //   console.log(e.emoji);
  //   setNewMessage(newMessage + e.emoji);
  // };

  const handleEmojiClick = (e) => {
    const emoji = e.emoji;

    // Get the current cursor position
    const cursorPosition = inputRef.current.selectionStart;
    console.log("Cursor Position:", cursorPosition);

    // Split the message into two parts
    const beforeCursor = newMessage.slice(0, cursorPosition);
    const afterCursor = newMessage.slice(cursorPosition);

    // Insert the emoji between the two parts
    const updatedMessage = beforeCursor + emoji + afterCursor;

    // Log intermediate information for debugging
    console.log("Before Cursor:", beforeCursor);
    console.log("After Cursor:", afterCursor);
    console.log("Updated Message:", updatedMessage);

    // Update the state with the new message
    setNewMessage(updatedMessage);

    // Set the cursor position after the inserted emoji
    const newCursorPosition = cursorPosition + emoji.length;
    inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
  };

  // const [groupMembers, setGroupMembers] = useState([]);
  // useEffect(() => {
  //   if (Object.keys(groups).length) {
  //     const memberId = groups?.members?.split(",");
  //     setGroupMembers(memberId);
  //     setReceiver(+memberId[0]);
  //   }
  // }, [groups]);

  // console.log(friends, groups);
  return (
    <>
      <div className="container-fluid">
        <div className="row clearfix ">
          {/* <div className="col-lg-12 m-0 p-0"> */}
          <div className="card chat-app">
            <div id="plist" className="people-list people-menu">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <img
                    src={LocalData?.image}
                    className="img-fluid rounded-circle"
                    style={{ width: "50px" }}
                  />
                </div>
                <div className="headers-icons-group" id="headers-icons-group">
                  <span className="wrap">
                    <MdGroups className="ico" onClick={handleAddGroup} />
                  </span>
                  <span className="wrap" onClick={handleAddUser}>
                    <MdAddBox className="ico" />
                  </span>
                  <span className="wrap" data-bs-toggle="dropdown">
                    <HiOutlineDotsVertical className="ico" />
                  </span>
                  <div
                    className="dropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item align-items-center"
                          href="#"
                        >
                          <AiOutlineUser className="ico me-1" />
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
              </div>

              <div className="input-group">
                <span className="search-ico-parent">
                  <IoSearchOutline
                    className="search-ico"
                    style={{ cursor: "pointer" }}
                  />
                </span>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Search..."
                />
              </div>
              <ul className="list-unstyled chat-list mt-2 mb-0">
                {friends.length ? (
                  friends.map((item, index) => (
                    <>
                      {!index && <hr className="m-0 p-0" />}
                      <li
                        className="clearfix d-flex"
                        onClick={() => {
                          setReceiver(item.id);
                          setSection("single");
                          localStorage.setItem("currentUser", item.id);
                        }}
                      >
                        <div>
                          {item?.image ? (
                            <img
                              src={
                                item?.image
                                  ? item.image
                                  : "https://bootdey.com/img/Content/avatar/avatar2.png"
                              }
                              alt="avatar"
                            />
                          ) : (
                            <div>
                              <InitialsAvatar name={item?.name} />
                            </div>
                          )}
                        </div>
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
                {groups.length
                  ? groups.map(
                      (item, index) =>
                        (item.isMember || item.UserId === sender) && (
                          <>
                            {/* {!index && <hr className="m-0 p-0" />} */}
                            <li
                              className="clearfix"
                              onClick={() => {
                                setGroupId(item.id);
                                setSection("group");
                                localStorage.setItem(
                                  "currentUser",
                                  item.id + ",g"
                                );
                              }}
                            >
                              {" "}
                              <img
                                src={
                                  item?.image
                                    ? item.image
                                    : "https://pngtree.com/free-png-vectors/group-icon"
                                }
                                alt="avatar"
                              />
                              <div className="about">
                                <div className="name">{item?.group_name}</div>
                                <div className="status">
                                  {/* <i className="fa fa-circle offline" /> */}
                                  {getLastMessage(item.id)}
                                </div>
                              </div>
                            </li>
                            <hr className="m-0 p-0" />
                          </>
                        )
                    )
                  : null}
              </ul>
            </div>
            <>
              {section === "single" ? (
                <SingleChat receiver={receiver} />
              ) : section === "group" ? (
                <GroupChat groupId={groupId} />
              ) : (
                <div
                  className="chat text-light text-center top-50"
                  style={{ height: "100vh" }}
                >
                  Get Started
                </div>
              )}
            </>
          </div>
        </div>
      </div>

      <>
        {/* MUI Dialog */}
        <MuiDailog ref={dialogRef} setReceiver={setReceiver} />
        <GroupDailog
          ref={groupDialogRef}
          setReceiver={setReceiver}
          user={friends}
        />
      </>
    </>
  );
}
