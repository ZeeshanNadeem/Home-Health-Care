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
  faInfoCircle,
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
          <span>
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginRight: "0.5rem", color: "green" }}
            />
            1st dose Today
          </span>
          <br></br>
          <span>
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginRight: "0.5rem", color: "green" }}
            />
            2nd dose on 6th week
          </span>
          <br></br>
          <span>
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginRight: "0.5rem", color: "green" }}
            />
            3rd dose on 10th week
          </span>
          <br></br>
          <span>
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginRight: "0.5rem", color: "green" }}
            />
            4th dose on 14th week
          </span>
          <br></br>
          <span>
            <FontAwesomeIcon
              icon={faCheck}
              style={{ marginRight: "0.5rem", color: "green" }}
            />
            Last dose at 9 months age
          </span>
          <div
            style={{
              maxWidth: "20ch",

              marginTop: "0.5rem",
            }}
          >
            <small>
              <FontAwesomeIcon
                icon={faInfoCircle}
                style={{ marginRight: "0.5rem" }}
              />
              <strong>
                You will be notified 2 days prior to next vaccination date
              </strong>
            </small>
          </div>
        </Typography>
      </Popover>
    </span>
  );
}
