import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCalendarWeek,
  faCheck,
  faClock,
  faPhone,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  p: 4,
};

export default function StaffDetails({ staffMemberDetails }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let [weekDaysAvailable, setDaysAvailable] = React.useState([]);
  let [slotsAvailable, setSlotsAvailable] = React.useState([]);

  if (
    staffMemberDetails.staffMember &&
    staffMemberDetails.staffMember.availableDays.length > 0
  ) {
    weekDaysAvailable = staffMemberDetails.staffMember.availableDays.filter(
      (day) => day.value === true
    );
  }

  if (
    staffMemberDetails.staffMember &&
    staffMemberDetails.staffMember.availableTime.length > 0
  ) {
    slotsAvailable = staffMemberDetails.staffMember.availableTime.filter(
      (day) => day.value === true
    );
  }
  return (
    <div>
      {/* <Button onClick={handleOpen} className="view-details-btn">
        VIEW
      </Button> */}
      <button onClick={handleOpen} className="view-details-btn">
        <strong style={{ letterSpacing: "0.5px" }}>VIEW</strong>
      </button>
      {weekDaysAvailable.length > 0 && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} style={{ backgroundColor: "" }}>
            <div
              className="aa"
              style={{
                textAlign: "center ",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              NO Organization ASSOCIATION
            </div>

            <article style={{ paddingTop: "1rem" }}>
              <strong>
                Days Available
                <FontAwesomeIcon
                  style={{ color: "", marginLeft: "0.5rem" }}
                  icon={faCalendarAlt}
                />
              </strong>
            </article>
            {weekDaysAvailable.map((day) => (
              <strong>
                <span style={{ color: "#1C6DD0" }}> &nbsp;{day.name}</span>
                <FontAwesomeIcon
                  style={{ color: "#1C7947", marginLeft: "0.5rem" }}
                  icon={faCheck}
                />
              </strong>
            ))}

            <article style={{ paddingTop: "0.5rem" }}>
              <strong>
                Slots Available
                <FontAwesomeIcon
                  style={{ color: "", marginLeft: "0.5rem" }}
                  icon={faClock}
                />
              </strong>
            </article>
            <strong>
              {slotsAvailable.map((day) => (
                <strong>
                  <span style={{ color: "#1C6DD0" }}> &nbsp;{day.time}</span>
                  <FontAwesomeIcon
                    style={{ color: "#1C7947", marginLeft: "0.5rem" }}
                    icon={faCheck}
                  />
                </strong>
              ))}
            </strong>

            <article style={{ paddingTop: "0.5rem" }}>
              <strong>
                Phone No
                <FontAwesomeIcon
                  style={{ color: "", marginLeft: "0.5rem" }}
                  icon={faPhone}
                />
              </strong>
              &nbsp;&nbsp;
              <span style={{ color: "#1C6DD0" }}>
                <strong>{staffMemberDetails.staffMember.phone}</strong>
              </span>
            </article>
            <article style={{ paddingTop: "0.5rem" }}>
              <strong>Service </strong>&nbsp;&nbsp;
              <span style={{ color: "#1C6DD0" }}>
                <strong>
                  {staffMemberDetails.staffMember.staffSpeciality.name}
                </strong>
              </span>
            </article>
            <article style={{ paddingTop: "0.5rem" }}>
              <strong>
                Service Price
                <FontAwesomeIcon
                  style={{ color: "", marginLeft: "0.5rem" }}
                  icon={faTag}
                />
              </strong>
              &nbsp;&nbsp;
              <span style={{ color: "#1C6DD0" }}>
                <strong>
                  {staffMemberDetails.staffMember.staffSpeciality.servicePrice}
                </strong>
              </span>
            </article>
          </Box>
        </Modal>
      )}
    </div>
  );
}
