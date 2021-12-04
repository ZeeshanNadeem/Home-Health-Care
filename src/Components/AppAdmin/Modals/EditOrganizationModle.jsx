import * as React from "react";
import Button from "@mui/material/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom";
import axios from "axios";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import AddOrganization from "../Forms/AddOrganization";
import { useEffect } from "react";
import Box from "@mui/material/Box";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  // bgcolor: "background.paper",
  // border: "2px solid #000",
  // boxShadow: 24,
  // p: 4,
};
export default function EditModalOrg({ organizationData, reloadOrganzations }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Link to={`/app/admin/org/${organizationData._id}`}>
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
        <Box sx={style}>
          <Container>
            <AddOrganization
              organizationData={organizationData}
              reloadOrganzations={reloadOrganzations}
            />
          </Container>
        </Box>
      </Modal>
    </div>
  );
}
