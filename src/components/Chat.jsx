import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
const socket = io("http://192.168.1.16:3000");

const Chat = ({ receiver }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef();
  const [user, setUsers] = useState([]);
  const [receiverData, setReceiverData] = useState([]);
  const sender = localStorage.getItem("userId");

  useEffect(() => {
    socket.emit("join", { sender, receiver });

    axios
      .get(`http://192.168.1.16:3000/messages/${sender}/${receiver}`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error(error));

    // Mark messages as read when the chat is opened
    // axios.patch('http://192.168.1.16:3000/messages/mark-read', { sender, receiver })
    //     .then(response => console.log(response))
    //     .catch(error => console.error(error));

    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [sender, receiver, messages]);
  useEffect(() => {
    // Scroll to the bottom of the chat container when the component mounts
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);
  const sendMessage = (e) => {
    e.preventDefault();

    socket.emit("message", { sender, receiver, message: newMessage });

    axios
      .post("http://192.168.1.16:3000/messages", {
        sender,
        receiver,
        message: newMessage,
      })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));

    setMessages([...messages, { sender, receiver, message: newMessage }]);
    setNewMessage("");
  };

  useEffect(() => {
    const fatchdata = async () => {
      await axios
        .get("http://192.168.1.16:3000/user/all")
        .then((res) => {
          const filteredUser = res.data.find((item) => item._id === receiver);
          setReceiverData(filteredUser);
        })
        .catch((error) => console.error(error));
    };
    fatchdata();
  }, [receiver]);

  console.log(sender, receiver);
  return (
    <div className="">
      <div className="chat-container">
        <div className="bg-dark py-4 w-100 text-light">
          <div className="">{receiverData?.name}</div>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === sender ? "sent" : "received"
              } ${msg.read ? "read" : "unread"}`}
            >
              <div className="message-sender">{msg.sender}</div>
              <div className="message-content">{msg.message}</div>
              <div className="message-status">{msg.read ? "Read" : "Sent"}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
