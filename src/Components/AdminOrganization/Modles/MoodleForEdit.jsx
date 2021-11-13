import * as React from "react";
import Button from "@mui/material/Button";
import AddService from "../Forms/AddService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom";
import axios from "axios";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

export default function EditModal({ serviceData, updateService }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Link to={`/admin/Services/${serviceData._id}`}>
        <Button variant="contained" onClick={handleOpen}>
          <FontAwesomeIcon icon={faEdit} style={{ marginRight: "0.6rem" }} />
          Edit
        </Button>
      </Link>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container>
          <AddService serviceData={serviceData} updateService={updateService} />
        </Container>
      </Modal>
    </div>
  );
}
