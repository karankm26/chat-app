import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${API_URL}/user/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (res) {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="text-center text-dark mt-2">Login</h2>

          <div className="card my-4">
            <form
              className="card-body cardbody-color p-lg-5"
              onSubmit={handleSubmit}
            >
              <div className="text-center">
                <img
                  src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295397__340.png"
                  className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                  alt="profile"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="Username"
                  aria-describedby="emailHelp"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-color px-5 mb-2 w-100">
                  Login
                </button>
              </div>
              <div
                id="emailHelp"
                className="form-text text-center mb-2 text-dark"
              >
                Not Registered?{" "}
                <Link to={"/register"} className="text-dark fw-bold">
                  {" "}
                  Create an Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
