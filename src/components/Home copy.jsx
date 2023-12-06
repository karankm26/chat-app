import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io, { connect } from "socket.io-client";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { MdAddBox, MdGroups } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { IoSearchOutline, IoSend } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import MuiDailog from "./MuiDailog";
import GroupDailog from "./GroupDailog";
import SingleChat from "./SingleChat";
import GroupChat from "./GroupChat";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";

const socket = io(API_URL);
export default function Home() {
  const [section, setSection] = useState(null);
  const groupDialogRef = useRef(null);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const localStorageData = localStorage.getItem("user");
  const LocalData = localStorageData ? JSON.parse(localStorageData) : null;
  const sender = LocalData?.id;
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
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

  // console.log(groupId, receiver);

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
    // return () => {
    //   socket.disconnect();
    // };
  }, [sender, receiver, messages]);

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
        const filteredGroups = groupsResponse.data
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

        setGroups(filteredGroups);
        setUsers([...filteredUsers, ...filteredGroups]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user]);

  const getLastMessage = (id) => {
    const userLastMsg = messages.filter((item) => +item.sender === id);
    return userLastMsg[userLastMsg.length - 1]?.message;
  };

  const handleUserSearch = () => {
    const filtered = currentSubAdmin.filter(
      (item) =>
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${item?.firstName} ${item?.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
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
  console.log(users);
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
                      <li>
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
                    <React.Fragment key={index}>
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
                            <img src={item?.image} alt="avatar" />
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
                    </React.Fragment>
                  ))
                ) : (
                  <li className="clearfix">No Chats Found</li>
                )}
                {groups.length
                  ? groups.map(
                      (item, index) =>
                        (item.isMember || item.UserId === sender) && (
                          <React.Fragment key={index}>
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
                          </React.Fragment>
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
