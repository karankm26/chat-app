import React, { useEffect, useState } from "react";
import PersonalMessage from "./PersonalMessage";
import GroupMessage from "./GroupMessage";

export default function Chat({ receiver, groupId, friends, groups, user }) {
  const [receiverData, setReceiverData] = useState({});
  const [groupData, setGroupData] = useState({});

  useEffect(() => {
    if (receiver && friends) {
      const filterReceiver = friends.find((item) => item.id === receiver);
      setReceiverData(filterReceiver);
    }
  }, [friends, receiver]);

  useEffect(() => {
    if (groupId && groups) {
      const filterReceiver = groups.find((item) => item.id === groupId);
      setGroupData(filterReceiver);
    }
  }, [groups, groupId]);

  return (
    <div className="chat-area">
      {receiver ? (
        <PersonalMessage
          receiver={receiver}
          receiverData={receiverData}
          user={user}
        />
      ) : groupId ? (
        <GroupMessage groupId={groupId} groupData={groupData} groups={groups} />
      ) : (
        <div>Get Started</div>
      )}
    </div>
  );
}
