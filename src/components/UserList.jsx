import { Avatar } from "@mui/material";

export default function UserList({ users, setGroupId, setReceiver }) {
  const currentUser = localStorage.getItem("currentUser");
  return (
    <div className="conversation-area">
      {/* msg active , msg online   */}
      {users.length ? (
        users.map((item, index) => (
          <div
            key={index}
            className={`msg online ${
              currentUser === item.id + ",g" || +currentUser === item.id
                ? "msg active"
                : null
            }`}
            onClick={() => {
              if (item?.group_name) {
                setGroupId(item.id);
                setReceiver("");
                localStorage.setItem("currentUser", item.id + ",g");
              } else {
                setReceiver(item.id);
                setGroupId("");
                localStorage.setItem("currentUser", item.id);
              }
            }}
          >
            <Avatar
              html
              alt="Group icon"
              src={item?.image ? item?.image : ""}
              sx={{ width: 44, height: 44 }}
              className="msg-profile"
            />
            <div className="msg-detail">
              <div className="msg-username">
                {item?.name ? item?.name : item?.group_name}
              </div>
              <div className="msg-content">
                <span className="msg-message">What time was our meet</span>
                <span className="msg-date">20m</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="msg">No Chat Found</div>
      )}

      <button className="add" />
      <div className="overlay" />
    </div>
  );
}
