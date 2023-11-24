import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { CgProfile } from "react-icons/cg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCircle,
  faCogs,
  faImage,
  faQuestion,
  faSearch,
  faShareNodes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [user, setUsers] = useState([]);
  const sender = localStorage.getItem("userId");
  const [receiver, setReceiver] = useState("");

  useEffect(() => {
    const fatchdata = async () => {
      await axios
        .get("http://192.168.1.16:3000/user/all")
        .then((res) => {
          const filteredUser = res.data.filter((item) => item._id !== sender);
          setUsers(filteredUser);
        })
        .catch((error) => console.error(error));
    };
    fatchdata();
  }, []);

  return (
    <div>
      <div className="container">
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              <div id="plist" className="people-list">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FontAwesomeIcon
                        icon={faSearch}
                        // className="fa fa-search"
                      />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  />
                </div>
                <ul className="list-unstyled chat-list mt-2 mb-0">
                  <li className="clearfix">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar1.png"
                      alt="avatar"
                    />
                    <div className="about">
                      <div className="name">Vincent Porter</div>
                      <div className="status">
                        {" "}
                        <FontAwesomeIcon icon={faCircle} className="offline" />
                        left 7 mins ago{" "}
                      </div>
                    </div>
                  </li>
                  <li className="clearfix active">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar2.png"
                      alt="avatar"
                    />
                    <div className="about">
                      <div className="name">Aiden Chavez</div>
                      <div className="status">
                        {" "}
                        <i className="fa fa-circle online" /> online{" "}
                      </div>
                    </div>
                  </li>
                  {/* <li className="clearfix">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar3.png"
                      alt="avatar"
                    />
                    <div className="about">
                      <div className="name">Mike Thomas</div>
                      <div className="status">
                        {" "}
                        <i className="fa fa-circle online" /> online{" "}
                      </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar7.png"
                      alt="avatar"
                    />
                    <div className="about">
                      <div className="name">Christian Kelly</div>
                      <div className="status">
                        {" "}
                        <i className="fa fa-circle offline" /> left 10 hours ago{" "}
                      </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar8.png"
                      alt="avatar"
                    />
                    <div className="about">
                      <div className="name">Monica Ward</div>
                      <div className="status">
                        {" "}
                        <i className="fa fa-circle online" /> online{" "}
                      </div>
                    </div>
                  </li>
                  <li className="clearfix">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar3.png"
                      alt="avatar"
                    />
                    <div className="about">
                      <div className="name">Dean Henry</div>
                      <div className="status">
                        {" "}
                        <i className="fa fa-circle offline" /> offline since Oct
                        28{" "}
                      </div>
                    </div>
                  </li> */}
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
                          src="https://bootdey.com/img/Content/avatar/avatar2.png"
                          alt="avatar"
                        />
                      </a>
                      <div className="chat-about">
                        <h6 className="m-b-0">Aiden Chavez</h6>
                        <small>Last seen: 2 hours ago</small>
                      </div>
                    </div>
                    <div className="col-lg-6 hidden-sm text-right">
                      <a
                        href="javascript:void(0);"
                        className="btn btn-outline-secondary"
                      >
                        {" "}
                        <FontAwesomeIcon icon={faCamera} />
                        <i className="fa fa-camera" />
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="btn btn-outline-primary"
                      >
                        {" "}
                        <FontAwesomeIcon icon={faImage} />
                        {/* <i className="fa fa-image" /> */}
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="btn btn-outline-info"
                      >
                        {" "}
                        <FontAwesomeIcon icon={faCogs} />
                        <i className="fa fa-cogs" />
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="btn btn-outline-warning"
                      >
                        {" "}
                        <FontAwesomeIcon icon={faQuestion} />
                        {/* <i className="fa fa-question" /> */}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="chat-history">
                  <ul className="m-b-0">
                    <li className="clearfix">
                      <div className="message-data text-right">
                        <span className="message-data-time">
                          10:10 AM, Today
                        </span>
                        <img
                          src="https://bootdey.com/img/Content/avatar/avatar7.png"
                          alt="avatar"
                        />
                      </div>
                      <div className="message other-message float-right">
                        {" "}
                        Hi Aiden, how are you? How is the project coming along?{" "}
                      </div>
                    </li>
                    <li className="clearfix">
                      <div className="message-data">
                        <span className="message-data-time">
                          10:12 AM, Today
                        </span>
                      </div>
                      <div className="message my-message">
                        Are we meeting today?
                      </div>
                    </li>
                    <li className="clearfix">
                      <div className="message-data">
                        <span className="message-data-time">
                          10:15 AM, Today
                        </span>
                      </div>
                      <div className="message my-message">
                        Project has been already finished and I have results to
                        show you.
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="chat-message clearfix">
                  <div className="input-group mb-0">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <FontAwesomeIcon icon={faShareNodes} />

                        <i className="fa fa-send" />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter text here..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
