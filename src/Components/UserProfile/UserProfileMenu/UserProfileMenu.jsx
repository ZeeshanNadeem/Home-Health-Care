import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";

const UserProfileMenu = () => {
  let [user, setUser] = React.useState([]);
  let [isUser, setIsUser] = React.useState(false);
  useEffect(() => {
    const jwt = localStorage.getItem("token");
    let userGot = "";
    if (jwt) {
      user = jwtDecode(jwt);
      // setUser(userGot);
      console.log("user:::", user);
      isUser =
        !user.isAppAdmin &&
        !user.staffMember &&
        user.isOrganizationAdmin === "false";
      setIsUser(isUser);
    }
  }, []);
  return (
    <article>
      {isUser === true && (
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
      )}

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
