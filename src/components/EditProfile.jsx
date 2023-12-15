import { Avatar, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import Loader from "./Loader";
import { API_URL } from "../config";

export default function EditProfile({ setEditProfile, user }) {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [loader, setLoader] = useState("");

  useEffect(() => {
    if (user) {
      setName(user?.name);
    }
  }, [user]);

  const handleSubmit = async () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }
    const res = await axios
      .put(`${API_URL}/user/${user?.id}`, formData)
      .then((response) => {
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
    console.log("dffffffffffffffff");
    // if (res) {
    //   setLoader(false);
    // }
  };

  return (
    <>
      {loader && <Loader />}
      <div id="plist" className="people-list people-menu">
        <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
          <div id="headers-icons-group">
            <span className="wrap">
              <IoMdArrowBack
                className="ico"
                onClick={() => setEditProfile(false)}
              />
            </span>
          </div>
        </div>
        <h6 className="text-center">Edit Profile</h6>
        <div>
          <div className="d-flex justify-content-center">
            <div className="mt-3">
              <label htmlFor="image">
                <Avatar
                  html
                  alt="Group icon"
                  src={
                    user?.image && image === ""
                      ? user?.image
                      : image
                      ? URL.createObjectURL(image)
                      : ""
                  }
                  sx={{ width: 120, height: 120 }}
                />
              </label>
              <input
                id="image"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                hidden
              />
            </div>
          </div>
        </div>
        <div>
          <Typography className="mt-3">
            <TextField
              onChange={(e) => setName(e.target.value)}
              className="text-light"
              autoFocus
              margin="dense"
              id="name"
              name="group_name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              inputProps={{ style: { color: "rgb(255, 255, 255, 0.7)" } }}
              InputLabelProps={{
                style: { color: "rgb(255, 255, 255, 0.7)" },
              }}
            />
          </Typography>
          <Typography className="mt-3">
            <Button onClick={handleSubmit} variant="contained">
              Update
            </Button>
          </Typography>
        </div>
      </div>{" "}
    </>
  );
}
