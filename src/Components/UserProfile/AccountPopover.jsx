import * as React from "react";
import Popover from "@mui/material/Popover";
import { Avatar } from "@material-ui/core";
import UserProfileMenu from "./UserProfileMenu/UserProfileMenu";

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
      <ul>
        <li className="nav-li" onClick={handleClick}>
          <span className="current-user">
            {console.log("user:=>:",user)}
            <Avatar

              alt={user.fullName || user.username}
              src="."
              className="avatar"
            />
            <p className="logged-in-user">{user.fullName || user.username}</p>
          </span>
        </li>
      </ul>
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <span>
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
    </span>
  );
}
