import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { CgProfile } from "react-icons/cg";

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
      <div className="container-fluid">
        <div className="row min-vh-100 flex-column flex-md-row">
          <aside className="col-12 col-md-3 p-0 bg-dark flex-shrink-1">
            <nav className="navbar navbar-expand navbar-dark bg-dark flex-md-column flex-row align-items-start py-2">
              <div className="collapse navbar-collapse w-100 px-2">
                <ul className="flex-md-column flex-row navbar-nav w-100 justify-content-between">
                  <li className="nav-item">
                    <a className="nav-link pl-0 text-nowrap" href="#">
                      <i className="fa fa-bullseye fa-fw" />

                      <span className="font-weight-bold">Chats</span>
                    </a>
                  </li>
                  <li>
                    <div className="input-group">
                      <input
                        className="form-control border-end-0 border rounded-pill"
                        type="text"
                        defaultValue="search"
                        id="example-search-input"
                      />
                      <span className="input-group-append">
                        <button
                          className="btn btn-outline-secondary bg-white border-start-0 border rounded-pill ms-n3"
                          type="button"
                        >
                          <i className="fa fa-search" />
                        </button>
                      </span>
                    </div>

                    <input
                      type="text"
                      placeholder="search"
                      className="form-control"
                    />
                  </li>

                  {user.length
                    ? user.map((item, index) => (
                        <>
                          <hr class="bg-muted border-2 border-top border-muted m-0" />
                          <li
                            className=" d-none d-lg-block d-md-block py-3 user-list"
                            key={index}
                            onClick={() => setReceiver(item?._id)}
                            style={{
                              cursor: "pointer",
                              color: "rgba(255, 255, 255, 0.55)",
                            }}
                          >
                            <div className="d-flex align-items-center px-2">
                              <img
                                src={item.image}
                                width={"40px"}
                                height={"40px"}
                                className="rounded-circle"
                              />
                              &ensp;
                              {item?.name}
                            </div>
                          </li>
                          {user.length - 1 === index && (
                            <hr class="bg-light border-2 border-top border-light m-0" />
                          )}
                        </>
                      ))
                    : "No Data"}
                </ul>
              </div>
            </nav>
          </aside>
          <main className="col bg-faded  flex-grow-1 m-0 p-0">
            <Chat receiver={receiver} />
          </main>
        </div>
      </div>
    </div>
  );
}
