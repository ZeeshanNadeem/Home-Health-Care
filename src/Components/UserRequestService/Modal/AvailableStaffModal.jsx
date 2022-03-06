import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ShowAllEmployees from "../ModalData/ShowAllEmployees";
import axios from "axios";
import config from "../../Api/config.json";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  availabilityData,
  userScheduledDate,
  requestTimeLength,
  filterTimeGonePastToday,
  staffDateSelected,
  selectedSlot,
  lat,
  lng
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [userRequests, setUserRequests] = React.useState([]);
  const [leaves, setLeaves] = React.useState([]);
  React.useEffect(async () => {
    const { data } = await axios.get(config.apiEndPoint + "/userRequests");
    const { data: staffLeaves } = await axios.get(
      config.apiEndPoint + "/staffLeave"
    );
    setLeaves(staffLeaves);
    setUserRequests(data);
    console.log("CHECK AVAIALABILITY MODEL !!!");
    console.log("requestTimeLength::", requestTimeLength);
  }, []);

  return (
    <div>
      <Button onClick={handleOpen}>SHOW</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ShowAllEmployees
            availabilityData={availabilityData}
            userScheduledDate={userScheduledDate}
            staffLeaves={leaves}
            userRequests={userRequests}
            requestTimeLength={requestTimeLength}
            filterTimeGonePastToday={filterTimeGonePastToday}
            staffDateSelected={staffDateSelected}
            selectedSlot={selectedSlot}
            lat={lat}
            lng={lng}
          />
        </Box>
      </Modal>
    </div>
  );
}
