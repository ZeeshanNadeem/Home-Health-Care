import * as React from "react";
import Popover from "@mui/material/Popover";

import CheckAvailability from "../ModalData/CheckAvailability";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import config from "../../Api/config.json";
export default function CheckAvailabilityPopover({
  availabilityData,
  userScheduledDate,
  requestTimeLength,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const width = window.innerWidth;

  let tabMode = false;
  if (width < 1000) {
    tabMode = true;
  }

  return (
    <span className="availability-style">
      {tabMode ? (
        <span onClick={handleClick} className="check-availability">
          Check-Today's-Availability
          {requestTimeLength > 0 ? (
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "#4E9F3D" }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faTimesCircle}
              style={{ color: "#FF1700" }}
            />
          )}
        </span>
      ) : (
        <span
          // onMouseEnter={handleClick}
          onClick={handleClick}
          className="check-availability"
        >
          Check-Today's-Availability
          {requestTimeLength > 0 ? (
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "#4E9F3D" }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faTimesCircle}
              style={{ color: "#FF1700" }}
            />
          )}
        </span>
      )}
      {tabMode ? (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClick={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <CheckAvailability
            availabilityData={availabilityData}
            userScheduledDate={userScheduledDate}
            staffLeaves={leaves}
            userRequests={userRequests}
            requestTimeLength={requestTimeLength}
          />
        </Popover>
      ) : (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          // onMouseOut={handleClose}
          onClick={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <CheckAvailability
            availabilityData={availabilityData}
            userScheduledDate={userScheduledDate}
            staffLeaves={leaves}
            userRequests={userRequests}
            requestTimeLength={requestTimeLength}
          />
        </Popover>
      )}
    </span>
  );
}
