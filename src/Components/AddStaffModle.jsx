import * as React from "react";
import { Container } from "@mui/material";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import NurseFrom from "./NurseForm";
import Fab from "@mui/material/Fab";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

export default function AddStaffModle({ RefreshStaffMembers }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <article className="float-button">
        <Fab color="primary" aria-label="add">
          <AddIcon onClick={handleOpen} />
        </Fab>
      </article>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container>
          <NurseFrom RefreshStaffMembers={RefreshStaffMembers} />
        </Container>
      </Modal>
    </div>
  );
}
