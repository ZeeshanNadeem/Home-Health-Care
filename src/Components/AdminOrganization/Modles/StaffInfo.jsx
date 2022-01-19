import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import config from "../../Api/config.json";
import jwtDecode from "jwt-decode";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@mui/material/Modal";

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
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ staffMember, staff }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [weekDaysAvailable] = React.useState([]);
  let [slotsAvailable] = React.useState([]);
  let [user] = React.useState([]);

  if (staff.length > 0) {
    user = staff.filter((s) => s.staffMember._id === staffMember._id);
  }

  //   const getUser = async (id) => {
  //     user = await axios.get(config.apiEndPoint + `/user?GetStaff=${id}`);
  //   };

  //   getUser();

  if (staffMember.availableDays && staffMember.availableDays.length > 0) {
    weekDaysAvailable = staffMember.availableDays.filter(
      (day) => day.value === true
    );
  }

  if (staffMember.availableTime && staffMember.availableTime.length > 0) {
    slotsAvailable = staffMember.availableTime.filter(
      (day) => day.value === true
    );
  }
  console.log("USERS", staff);
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <button onClick={handleOpen} className="view-details-btn">
        <strong style={{ letterSpacing: "0.5px" }}>VIEW</strong>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3 style={{ fontWeight: "600", letterSpacing: "0.1px" }}>
            Staff Details
          </h3>
          <article style={{ paddingTop: "0rem" }}>
            <strong>Qualification</strong>
            &nbsp;&nbsp;
            <span style={{ color: "#1C6DD0" }}>
              <strong>{staffMember.qualification.name}</strong>
            </span>
          </article>
          <article style={{ paddingTop: "0rem" }}>
            <strong>Service</strong>
            &nbsp;&nbsp;
            <span style={{ color: "#1C6DD0" }}>
              <strong>{staffMember.staffSpeciality.name}</strong>
            </span>
          </article>
          <article style={{ paddingTop: "0rem" }}>
            <strong>
              Service Price
              <FontAwesomeIcon
                style={{ color: "", marginLeft: "0.1rem" }}
                icon={faTag}
              />
            </strong>
            &nbsp;&nbsp;
            <span style={{ color: "#1C6DD0" }}>
              <strong>{staffMember.staffSpeciality.servicePrice}</strong>
            </span>
          </article>
          <article style={{ paddingTop: "0rem" }}>
            <strong>
              Phone No
              <FontAwesomeIcon
                style={{ color: "", marginLeft: "0.5rem" }}
                icon={faPhone}
              />
            </strong>
            &nbsp;&nbsp;
            <span style={{ color: "#1C6DD0" }}>
              <strong>{staffMember.phone}</strong>
            </span>
          </article>

          <article style={{ paddingTop: "0rem" }}>
            <strong>Organization</strong>
            &nbsp;&nbsp;
            <span style={{ color: "#1C6DD0" }}>
              <strong>{staffMember.Organization.name}</strong>
            </span>
          </article>

          <strong>
            <p
              style={{
                margin: "0",
                marginTop: "0.3rem",
                fontSize: "1.2rem",
                fontWeight: "600",
                letterSpacing: "0.1px",
              }}
            >
              Login Credentials
            </p>
          </strong>
          <article style={{ paddingTop: "0rem" }}>
            <strong>Email</strong>
            &nbsp;&nbsp;
            <span style={{ color: "#1C6DD0" }}>
              {user.length > 0 && <strong>{user[0].email}</strong>}
            </span>
          </article>
          <article style={{ paddingTop: "0rem" }}>
            <strong>Password</strong>
            &nbsp;&nbsp;
            <span style={{ color: "#1C6DD0" }}>
              <strong>{user[0].temp}</strong>
            </span>
          </article>
          <div>
            <strong>
              <p
                style={{
                  margin: "0",
                  marginTop: "0.3rem",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  letterSpacing: "0.1px",
                }}
              >
                Availability
              </p>
            </strong>
            <article style={{ paddingTop: "0" }}>
              <strong>
                Days Available
                <FontAwesomeIcon
                  style={{ color: "", marginLeft: "0.5rem" }}
                  icon={faCalendarAlt}
                />
              </strong>
            </article>
            {weekDaysAvailable.map((day) => (
              <strong key={day.time}>
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
                <strong key={day.time}>
                  <span style={{ color: "#1C6DD0" }}> &nbsp;{day.time}</span>
                  <FontAwesomeIcon
                    style={{ color: "#1C7947", marginLeft: "0.5rem" }}
                    icon={faCheck}
                  />
                </strong>
              ))}
            </strong>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
