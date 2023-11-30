import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, forwardRef, useImperativeHandle } from "react";

const MuiDailog = forwardRef(({ setReceiver }, ref) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
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

  const handleSubmit = () => {
    setReceiver(text);
    handleClose();
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
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
