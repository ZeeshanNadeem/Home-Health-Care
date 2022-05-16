import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";

import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import { faUserNurse } from "@fortawesome/free-solid-svg-icons";
import {calender} from "react-feather";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";

const UserProfileMenu = () => {
  const [user, setUser] = React.useState([]);
  let [isUser, setIsUser] = React.useState(false);
  useEffect(() => {
    const jwt = localStorage.getItem("token");

    if (jwt) {
      let user = jwtDecode(jwt);
      console.log("userprofile::",user);
      setUser(user);

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
        <>
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
          <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
        </span>
        <span>
          <span className="user-account-popover">
            <article className="logout-wrapper-icon my-home-visits-icon">
              <FontAwesomeIcon
                icon={faHouseUser}
                style={{ marginTop: "0.2rem" }}
              />
            </article>
            <Link
              to="/patient/location"
              className="user-account-menu-item sheduled-visits"
              target="_blank"
            >
              <span>Set Location</span>
            </Link>
          </span>
          <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
        </span>
        </>
      )}
      {user.isOrganizationAdmin === "Approved Admin" && (
        <span>
          <span className="user-account-popover">
            <article className="logout-wrapper-icon my-home-visits-icon">
              <FontAwesomeIcon
                icon={faHouseUser}
                style={{ marginTop: "0.2rem" }}
              />
            </article>
            <Link
              to="/admin"
              className="user-account-menu-item sheduled-visits"
            >
              <span style={{ marginLeft: "1rem" }}>Admin</span>
            </Link>
          </span>
          <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
        </span>
      )}

      {user.isAppAdmin && (
        <span>
          <span>
            <span className="user-account-popover">
              <article className="logout-wrapper-icon my-home-visits-icon">
                <FontAwesomeIcon
                  icon={faHouseUser}
                  style={{ marginTop: "0.2rem" }}
                />
              </article>
              <Link
                to="/app/admin"
                className="user-account-menu-item sheduled-visits"
              >
                <span style={{ marginLeft: "0.2rem" }}>App Admin</span>
              </Link>
            </span>
            <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
          </span>
        </span>
      )}

    {user.isOrganizationAdmin==="Independent Member Approved" && (
        <span>
          <span>
            <span className="user-account-popover">
              <article className="logout-wrapper-icon my-home-visits-icon"
           
              >
                <FontAwesomeIcon
                  icon={faCalendarDay}
                  style={{ marginTop: "0.2rem",textAlign:"center",marginLeft:"2px"}}
                />
              
              </article>
              <Link
                to="/staff/availability"
                className="user-account-menu-item sheduled-visits"
              >
                <span style={{ marginLeft: "0.2rem" }}>My Availability</span>
              </Link>
            </span>
            <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
          </span>
        </span>
      )}



      {user.staffMember && (
        <span>
          <span>
            <span className="user-account-popover">
              <article className="logout-wrapper-icon my-home-visits-icon">
                <FontAwesomeIcon
                  icon={faUserLock}
                  style={{ marginTop: "0.2rem" }}
                />
              </article>
              <Link
                to="/staff/leave"
                className="user-account-menu-item sheduled-visits"
              >
                <span style={{ marginLeft: "0rem" }}>Apply For Leave</span>
              </Link>
            </span>
            <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
          </span>
          <span>
          <span className="user-account-popover">
              <article className="logout-wrapper-icon my-home-visits-icon">
              <FontAwesomeIcon
                  icon={faUserLock}
                  style={{ marginTop: "0.2rem" }}
                />
              </article>
              <Link
                to="/staff/leaves"
                className="user-account-menu-item sheduled-visits"
              >
                <span style={{ marginLeft: "0.7rem" }}>My Leaves</span>
              </Link>
              
            </span>
            <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
            <span className="user-account-popover">
              <article className="logout-wrapper-icon my-home-visits-icon">
                <FontAwesomeIcon
                  icon={faUserNurse}
                  style={{ marginTop: "0.2rem",marginLeft:"2px" }}
                />
              </article>
              <Link
                to="/staff/schedule"
                className="user-account-menu-item sheduled-visits"
              >
                <span style={{ marginLeft: "0.7rem" }}>My Duties</span>
              </Link>
              
            </span>
            
          
            <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
          </span>
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
      <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
    </article>
  );
};

export default UserProfileMenu;
