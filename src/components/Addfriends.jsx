import {
  Autocomplete,
  Button,
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

const Addfriends = forwardRef(({ friends }, ref) => {
  const [open, setOpen] = useState(false);
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
    if (friends) {
      const labelUser = friends.map((item) => ({ ...item, label: item.name }));
      setShowUser(labelUser);
    }
  }, [friends]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Invite You Friend</DialogTitle>
      <DialogContent>
        <DialogContentText className="content">
          To Invite and Chat with you friend Enter the invite key in the below.
        </DialogContentText>
        <Autocomplete
          className="w-100 mt-3"
          disablePortal
          id="combo-box-demo"
          options={showUser}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Movie" />}
        />
      </DialogContent>
      <DialogActions>
        <Button className="mui-btn"  onClick={handleClose}>Cancel</Button>
        <Button className="mui-btn"  onClick={handleClose}>Invite</Button>
      </DialogActions>
    </Dialog>
  );
});
export { Addfriends };
