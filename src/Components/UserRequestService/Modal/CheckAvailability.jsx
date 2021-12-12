import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckAvailability from "../ModalData/CheckAvailability";

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
    <span>
      <span onMouseEnter={handleClick} className="check-availability">
        Check Availability
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
