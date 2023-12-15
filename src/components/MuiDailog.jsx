import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import toast from "react-hot-toast";

const MuiDailog = forwardRef(({ setReceiver, setRefresh }, ref) => {
  const localStorageData = localStorage.getItem("user");
  const LocalData = localStorageData ? JSON.parse(localStorageData) : null;
  const id = LocalData?.id;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [user, setUser] = useState([]);

  const handleClickOpen = () => {
    console.log(open, "open");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    handleClickOpen,
    handleClose,
  }));

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

  const handleSubmit = async () => {
    let arr = user.friends;
    arr.push(text);
    // setReceiver(text);
    const res = await axios
      .put(`${API_URL}/user/${id}`, {
        friends: arr.toString(),
      })
      .then((response) => {
        setRefresh(true);
        handleClose();
        toast.success("Friend Added", {
          duration: 4000,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.error, {
          duration: 4000,
        });
        handleClose();
      });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        // sx={{ backgroundColor: "#223440 " }}
      >
        <DialogTitle>Invite You Friend</DialogTitle>
        <DialogContent>
          <DialogContentText className="content">
            To Invite and Chat with you friend Enter the invite key in the
            below.
          </DialogContentText>
          <TextField
            onChange={(e) => setText(e.target.value)}
            className="text-light"
            autoFocus
            margin="dense"
            id="name"
            label="Enter Invite Code "
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ style: { color: "rgb(255, 255, 255, 0.7)" } }}
            InputLabelProps={{
              style: { color: "rgb(255, 255, 255, 0.7)" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Invite</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
export default MuiDailog;
