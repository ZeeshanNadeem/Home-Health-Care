import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@material-ui/core";
import jwtDecode from "jwt-decode";

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

  const jwt = localStorage.getItem("token");
  const user = jwtDecode(jwt);

  return (
    <div>
      <div>
        <div></div>
        <span className="notification" onClick={handleClick}>
          <span
            style={{
              color: "#fff",
              backgroundColor: "#dc3545",
              position: "absolute",
              marginLeft: "0.6rem",
              marginTop: "-1rem",
              borderRadius: "15px",
            }}
            className="badge badge-info"
          >
            1
          </span>
          <FontAwesomeIcon icon={faBell} />
        </span>
      </div>
      {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button> */}
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
        <Typography
          sx={{
            p: 2,
            paddingLeft: "1rem",
            paddingRight: "1rem",
            maxWidth: "35ch",
            marginBottom: "0",
          }}
        >
          <Avatar
            alt={user.fullname}
            src="."
            className="avatar"
            style={{ float: "left", marginRight: "5px" }}
          />
          Your next vaccination date is on tomorrow 20-2-2 slot 3PM to 6PM
        </Typography>
        <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
      </Popover>
    </div>
  );
}
