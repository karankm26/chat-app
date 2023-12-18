import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import UserList from "./UserList";
import Chat from "./Chat";
import UserDetails from "./UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroup, fetchUser, fetchUserAll } from "../features/apiSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { userAll, group, user: userData } = useSelector((state) => state.api);
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [receiver, setReceiver] = useState("");
  const currentUser = localStorage.getItem("currentUser");
  const id = 2;
  const sender = 2;

  useEffect(() => {
    dispatch(fetchUserAll());
    dispatch(fetchGroup());
    if (id) dispatch(fetchUser(id));
  }, [id]);

  useEffect(() => {
    if (id && userData) {
      setUser({
        ...userData,
        friends: userData.friends
          ? userData.friends.split(",").map((item1) => +item1)
          : [],
      });
    }
  }, [id, userData]);

  useEffect(() => {
    if (user && group) {
      const filteredUsers = userAll.filter(
        (item) =>
          user.friends && user.friends.some((friendId) => friendId === item.id)
      );
      setFriends(filteredUsers);
      const filteredGroups = group
        .map(({ members, ...rest }) => ({
          ...rest,
          members: members
            .split(",")
            .map((item) => (item.trim() !== "" && !isNaN(item) ? +item : null))
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
    }
  }, [user, group]);

  useEffect(() => {
    if (currentUser) {
      if (isNaN(currentUser)) {
        const gId = +currentUser.split(",")[0];
        setGroupId(gId);
      } else {
        setReceiver(+currentUser);
      }
    }
  }, [currentUser]);

  return (
    <div>
      <div className="app">
        <Navbar user={user} />
        <div className="wrapper">
          <UserList
            users={users}
            setGroupId={setGroupId}
            setReceiver={setReceiver}
          />
          <Chat
            groupId={groupId}
            receiver={receiver}
            friends={friends}
            groups={groups}
            user={user}
          />
          <UserDetails />
        </div>
      </div>
    </div>
  );
}
