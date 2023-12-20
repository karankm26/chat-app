import { Avatar } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";

export default function UserDetails({ groups, groupId, friends, receiver }) {
  const [receiverData, setReceiverData] = useState({});
  const [groupData, setGroupData] = useState({});
  const [selected, setSelected] = useState("blue");

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

  const handleModeChange = (item) => {
    document.body.setAttribute("data-theme", item);
  };

  return (
    <div className="detail-area">
      <div className="detail-area-header">
        <div className="msg-profile group">
          {/* <img src={groupId ? groupData?.image : receiverData?.image} /> */}
          <Avatar
            sx={{ width: 66, height: 66 }}
            src={groupId ? groupData?.image : receiverData?.image}
          />
        </div>
        <div className="detail-title">
          {groupId ? groupData?.group_name : receiverData?.name}
        </div>
        <div className="detail-subtitle">
          {groupId
            ? `Created by ${groupData?.User?.name}, ${moment(
                groupData?.createdAt
              ).format("lll")}`
            : "fff"}
        </div>
        {/* 1 May 2020 */}
        <div className="detail-buttons">
          <button className="detail-button">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={0}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-phone"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            Call Group
          </button>
          <button className="detail-button">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={0}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-video"
            >
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
            </svg>
            Video Chat
          </button>
        </div>
      </div>
      <div className="detail-changes">
        <input type="text" placeholder="Search in Conversation" />
        <div className="detail-change">
          Change Color
          <div className="colors">
            <div
              className="color blue selected"
              data-color="blue"
              onClick={() => handleModeChange("blue")}
            />
            <div
              className="color purple "
              data-color="purple"
              onClick={() => handleModeChange("purple")}
            />
            <div
              className="color green"
              data-color="green"
              onClick={() => handleModeChange("green")}
            />
            <div
              className="color orange"
              data-color="orange"
              onClick={() => handleModeChange("orange")}
            />
          </div>
        </div>
        <div className="detail-change">
          Change Emoji
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-thumbs-up"
          >
            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
          </svg>
        </div>
      </div>
      <div className="detail-photos">
        <div className="detail-photo-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-image"
          >
            <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          Shared photos
        </div>
        <div className="detail-photo-grid">
          <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80" />
          <img src="https://images.unsplash.com/photo-1516085216930-c93a002a8b01?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
          <img src="https://images.unsplash.com/photo-1458819714733-e5ab3d536722?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=933&q=80" />
          <img src="https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2287&q=80" />
          <img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2247&q=80" />
          <img src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80" />
          <img src="https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1301&q=80" />
          <img src="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2249&q=80" />
          <img src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2309&q=80" />
          <img src="https://images.unsplash.com/photo-1473170611423-22489201d919?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80" />
          <img src="https://images.unsplash.com/photo-1579613832111-ac7dfcc7723f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2189&q=80" />
        </div>
        <div className="view-more">View More</div>
      </div>
      <a
        href="https://twitter.com/AysnrTrkk"
        className="follow-me"
        target="_blank"
      >
        <span className="follow-text">
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="css-i6dzq1"
          >
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
          </svg>
          Follow me on Twitter
        </span>
        <span className="developer">
          <img src="https://pbs.twimg.com/profile_images/1253782473953157124/x56UURmt_400x400.jpg" />
          Aysenur Turk — @AysnrTrkk
        </span>
      </a>
    </div>
  );
}
