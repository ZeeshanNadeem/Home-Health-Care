import * as React from "react";
import Button from "@mui/material/Button";
import AddService from "./AddService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom";
import axios from "axios";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EditModal({ serviceData, updateService }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [services, setServices] = React.useState([]);

  React.useEffect = async () => {
    const { data: services } = await axios.get(
      "http://localhost:3000/api/services"
    );
    setServices(services);
  };

  return (
    <div>
      <Link to={`/admin/Panel/${serviceData._id}`}>
        <Button variant="contained" onClick={handleOpen}>
          <FontAwesomeIcon icon={faEdit} style={{ marginRight: "0.6rem" }} />
          Edit
        </Button>
      </Link>
      {/* <Link to={`/admin/Panel/${serviceData._id}`}>
        <Button variant="contained" onClick={handleOpen}>
          <FontAwesomeIcon icon={faEdit} style={{ marginRight: "0.6rem" }} />
          Edit
        </Button>
      </Link> */}

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
