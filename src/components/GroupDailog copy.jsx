import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, forwardRef, useImperativeHandle } from "react";
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
} from "@mui/material";

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

const GroupDailog = forwardRef(({ setReceiver, user }, ref) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState([
    { group_name: "", members: "", image: "" },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setText({ ...text, [name]: value });
  };
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

  console.log(text);

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
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 80, height: 80 }}
            />
          </Typography>
          <Typography className="mt-3">
            <TextField
              onChange={handleChange}
              className="text-light"
              autoFocus
              margin="dense"
              id="name"
              label="Group Name"
              type="text"
              fullWidth
              value={text.group_name}
              variant="outlined"
              inputProps={{ style: { color: "rgb(255, 255, 255, 0.7)" } }}
              InputLabelProps={{
                style: { color: "rgb(255, 255, 255, 0.7)" },
              }}
            />
          </Typography>
          <Typography className="mb-3 mt-3" fullWidth>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
              <Select
                fullWidth
                // sx={{ width: "100%" }}
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={text.members}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
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
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Invite</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
export default GroupDailog;
