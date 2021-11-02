import * as React from "react";
import Button from "@mui/material/Button";
import AddService from "./AddService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom";
import axios from "axios";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

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

// class EditModal extends React.Component {
//   state = {
//     open: false,
//     services: [],
//   };

//   // async componentDidMount() {
//   //   const { data: services } = await axios.get(
//   //     "http://localhost:3000/api/services"
//   //   );
//   //   this.setState({ services });
//   // }

//   handleOpen = () => this.setState({ open: true });
//   handleClose = () => this.setState({ open: false });
//   render() {
//     const { serviceData, updateService } = this.props;
//     return (
//       <div>
//         <Link to={`/admin/Services/${serviceData._id}`}>
//           <Button variant="contained" onClick={this.handleOpen}>
//             <FontAwesomeIcon icon={faEdit} style={{ marginRight: "0.6rem" }} />
//             Edit
//           </Button>
//         </Link>

//         <Modal
//           open={this.state.open}
//           onClose={this.handleClose}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Container>
//             <AddService
//               serviceData={serviceData}
//               updateService={updateService}
//             />
//           </Container>
//         </Modal>
//       </div>
//     );
//   }
// }

// export default EditModal;

export default function EditModal({ serviceData, updateService }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const [services, setServices] = React.useState([]);

  // useEffect(async () => {
  //   const { data: services } = await axios.get(
  //     "http://localhost:3000/api/services"
  //   );
  //   setServices(services);
  // }, [services]);

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
