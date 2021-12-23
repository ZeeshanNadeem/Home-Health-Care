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

  return (
    <span className="availability-style">
      <span onMouseEnter={handleClick} className="check-availability">
        Check-Today's-Availability
        {availabilityData.length > 0 && (
          <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#4E9F3D" }} />
        )}
      </span>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onMouseOut={handleClose}
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
    </span>
  );
}
