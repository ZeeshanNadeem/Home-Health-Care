import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCalendarAlt,
  faCalendarCheck,
  faCheck,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function BasicPopover() {
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
      <span
        className="vaccination-plan"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        Vaccination Plan
        <FontAwesomeIcon
          icon={faCalendarAlt}
          style={{ marginLeft: "0.5rem" }}
        />
      </span>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <strong>
            1st dose Today
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginLeft: "0.5rem", color: "green" }}
            />
          </strong>
          <br></br>
          <strong>
            2nd dose on 6th week
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginLeft: "0.5rem", color: "green" }}
            />
          </strong>
          <br></br>
          <strong>
            3rd dose on 10th week
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginLeft: "0.5rem", color: "green" }}
            />
          </strong>
          <br></br>
          <strong>
            4th dose on 14th week
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginLeft: "0.5rem", color: "green" }}
            />
          </strong>
          <br></br>
          <strong>
            Last dose at 9 months age
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginLeft: "0.5rem", color: "green" }}
            />
          </strong>
        </Typography>
      </Popover>
    </span>
  );
}
