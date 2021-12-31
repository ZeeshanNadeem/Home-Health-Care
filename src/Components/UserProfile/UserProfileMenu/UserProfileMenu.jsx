import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useState } from "react";

const UserProfileMenu = () => {
  const [user, setUser] = React.useState([]);
  useEffect(() => {
    const jwt = localStorage.getItem("token");
    let userGot = "";
    if (jwt) {
      userGot = jwtDecode(jwt);
      setUser(userGot);
    }
  }, []);
  return (
    <article>
      {
        <span>
          <span className="user-account-popover">
            <article className="logout-wrapper-icon my-home-visits-icon">
              <FontAwesomeIcon
                icon={faHouseUser}
                style={{ marginTop: "0.2rem" }}
              />
            </article>
            <Link
              to="/Ratting"
              className="user-account-menu-item sheduled-visits"
            >
              <span>Scheduled Visits</span>
            </Link>
          </span>
          <div class="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
        </span>
      }

      <span className="user-account-popover">
        <article className="logout-wrapper-icon">
          <FontAwesomeIcon
            icon={faSignOutAlt}
            style={{ marginTop: "0.2rem" }}
          />
        </article>
        <Link to="/logout" className="user-account-menu-item">
          <span>Logout</span>
        </Link>
      </span>
      <div class="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
    </article>
  );
};

export default UserProfileMenu;
