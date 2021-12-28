import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckAvailability from "../ModalData/CheckAvailability";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function CheckAvailabilityPopover({
  availabilityData,
  userScheduledDate,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
          {availabilityData.length > 0 && (
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "#4E9F3D" }}
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
          {availabilityData.length > 0 && (
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "#4E9F3D" }}
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
          />
        </Popover>
      )}
    </span>
  );
}
