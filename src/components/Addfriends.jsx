import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "../features/apiSlice";

const Addfriends = forwardRef(({ sender, user, userAll }, ref) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [searchItem, setSearchItem] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState({});
  const [showUser, setShowUser] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    handleOpen,
    handleClose,
  }));

  useEffect(() => {
    if (user && userAll && sender) {
      const filtered = userAll.filter(
        (friend) => !user?.friends?.includes(friend.id) && friend.id !== sender
      );
      setShowUser(filtered);
    }
  }, [user, userAll, sender]);

  useEffect(() => {
    if (searchValue) {
      const filtered = showUser.filter((item) =>
        String(item.id).includes(searchValue)
      );
      setSearchItem(filtered);
    }
  }, [searchValue]);

  const { updateUserDataLoading, updateUserDataSuccess } = useSelector(
    (state) => state.api
  );

  const handleSubmit = async () => {
    let arr = user.friends;
    arr.push(selectedOption.id);
    dispatch(
      updateUser({
        id: sender,
        body: {
          friends: arr.toString(),
        },
      })
    );
    setSearchValue("");
    setSelectedOption({});
  };

  useEffect(() => {
    if (sender && updateUserDataSuccess) dispatch(fetchUser(sender));
  }, [sender, updateUserDataSuccess]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Invite You Friend</DialogTitle>
      <DialogContent>
        <DialogContentText className="content">
          To Invite and Chat with you friend Enter the invite key in the below.
        </DialogContentText>
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          onChange={(e) => setSearchValue(e.target.value)}
          variant="standard"
          // type="number"
          value={selectedOption.name}
          placeholder="Enter Your Friend ID"
        />
        <div className={`mt-3 mui-dropdown ${!searchValue && "d-none"}`}>
          <ul>
            {searchItem.length ? (
              searchItem.map((item) => (
                <li onClick={() => setSelectedOption(item)}>{item.name}</li>
              ))
            ) : (
              <li>No result found</li>
            )}
            {/* <li>ffd</li> */}
          </ul>
        </div>
      </DialogContent>
      <DialogActions>
        <Button className="mui-btn" onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          className="mui-btn"
          onClick={handleSubmit}
          disabled={!searchValue}
        >
          {updateUserDataLoading ? <CircularProgress size={24} /> : "Invite"}
          {/* Invite */}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
export { Addfriends };
