import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Avatar } from "@material-ui/core";
import UserProfileMenu from "./UserProfileMenu/UserProfileMenu";

import Button from "@mui/material/Button";
import jwtDecode from "jwt-decode";

export default function AccountPopOver({ user }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const UserNameNav = () => {
    return (
      <li className="nav-li" onClick={handleClick}>
        <span className="current-user">
          <Avatar alt={user.fullName} src="." className="avatar" />
          <p className="logged-in-user">{user.fullName}</p>
        </span>
      </li>
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      {user ? UserNameNav() : ""}

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
        <UserProfileMenu />
      </Popover>
    </div>
  );
}