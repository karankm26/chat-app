import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import {
  Avatar,
  Typography,
  Chip,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Box,
  FormLabel,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const GroupDailog = forwardRef(({ setReceiver, user }, ref) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState({ group_name: "", members: "", image: "" });
  const localStorageData = localStorage.getItem("user");
  const LocalData = localStorageData ? JSON.parse(localStorageData) : null;
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setText({ ...text, [name]: e.target.files });
      return;
    }
    setText({ ...text, [name]: value });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  console.log(user);
  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    handleClickOpen,
    handleClose,
  }));

  const handleSubmit = async () => {
    // setReceiver(text);
    // handleClose();

    const formData = new FormData();
    formData.append("group_name", text.group_name);
    formData.append("userId", LocalData.id);
    formData.append("members", text.members);
    if (text.image) {
      formData.append("image", text.image[0]);
    }

    try {
      const response = await axios.post(`${API_URL}/group`, formData);
    } catch (error) {
      console.error(error);
    }
  };

  const [personName, setPersonName] = useState([]);

  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;

    setPersonName(typeof value === "string" ? value.split(",") : value);
  };
  const [selectedIds, setSelectedIds] = useState([]);

  const handleClickGroupId = (item) => {
    const id = item.id;
    setSelectedIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((prevId) => prevId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  useEffect(() => {
    setText((prevText) => ({
      ...prevText,
      members: selectedIds.join(","),
    }));
  }, [selectedIds]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Make Group</DialogTitle>
        <DialogContent>
          <DialogContentText className="content">
            To Invite and Chat with you friend Enter the invite key in the
            below.
          </DialogContentText>
          <Typography className="d-flex justify-content-center mt-3">
            <FormLabel htmlFor="image">
              <Avatar
                html
                alt="Group icon"
                src={
                  text.image
                    ? URL.createObjectURL(text.image[0])
                    : "/static/images/avatar/1.jpg"
                }
                sx={{ width: 80, height: 80 }}
              />
              <span style={{ color: "rgb(255, 255, 255, 0.7)" }}>
                Group Image
              </span>
              <input
                hidden
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
              />
            </FormLabel>
          </Typography>
          <Typography className="mt-3">
            <TextField
              onChange={handleChange}
              className="text-light"
              autoFocus
              margin="dense"
              id="name"
              name="group_name"
              label="Group Name"
              type="text"
              fullWidth
              variant="outlined"
              inputProps={{ style: { color: "rgb(255, 255, 255, 0.7)" } }}
              InputLabelProps={{
                style: { color: "rgb(255, 255, 255, 0.7)" },
              }}
            />
          </Typography>
          <Typography className="mb-3 mt-3" fullWidth>
            <FormControl fullWidth>
              <InputLabel
                id="demo-multiple-chip-label"
                sx={{ color: " rgb(255, 255, 255, 0.7)}" }}
              >
                Group Member
              </InputLabel>
              <Select
                fullWidth
                // sx={{ width: "100%" }}
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={personName}
                onChange={(e) => {
                  handleChange1(e);
                  handleClickGroupId(e);
                }}
                input={
                  <OutlinedInput
                    id="select-multiple-chip"
                    label="Group Member"
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {user.length &&
                  user.map((item) => (
                    <MenuItem
                      fullWidth
                      key={item.name}
                      value={item.name}
                      onClick={() => handleClickGroupId(item)}
                      // style={getStyles(name, personName, theme)}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
export default GroupDailog;
