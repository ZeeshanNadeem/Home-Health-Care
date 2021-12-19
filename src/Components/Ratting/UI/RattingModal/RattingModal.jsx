import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { Avatar, Typography } from "@material-ui/core";
import ReactStars from "react-rating-stars-component";
import Stack from "@mui/material/Stack";
import RattingModelData from "../../RattingModalData/data";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function ChildModal({ row }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Rating name="size-large no-value" defaultValue={2} size="large" />
      {/* <Button onClick={handleOpen} variant="outlined">
        Confirm
      </Button> */}
      <Button onClick={handleOpen}>Confirm</Button>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <h2 id="child-modal-title">Rate Our Staff Member</h2>

          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit
          </p>

          {/* <Button onClick={handleClose}>Close Child Modal</Button> */}
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function NestedModal({ row }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Confirm Service Completed
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <RattingModelData row={row} />
        </Box>
      </Modal>
    </div>
  );
}
