import React, { useState } from "react";
import DoctorForm from "./DoctorForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFemale,
  faMale,
  faUserFriends,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";

import EditService from "./EditService";
import AdminUserRequest from "./AdminUserRequest";
import AssignDuty from "./AssignDuty";
import AddService from "./AddService";
import NurseForm from "./NurseForm";
import AdminNav from "./AdminNav";
import { Link } from "react-router-dom";
import "animate.css";
const Admin = () => {
  const [showDocDetials, setDocDetails] = useState("");
  const [menuBarZindex, setMenuBarZindex] = useState("");
  const DoctorDetailsHandler = (name) => {
    setDocDetails(name);
    if (name === "EditService") {
      setMenuBarZindex("MenuBarZIndex");
    }
  };
  return (
    <article className="admin-wrapper">
      <span className="admin-top">
        <span className={`admin-container`}>
          <article className={`menuBar-container ${menuBarZindex}`}>
            <ul className="menu-items">
              <h2 className="menu-title animate__heartBeat">Admin</h2>
              <Link to="/admin/doctor">
                <li className="li-add-doc admin-li">
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Add A Doctor
                </li>
              </Link>
              <Link to="/admin/Nurse">
                <li className="admin-li">
                  {" "}
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Add A Nurse
                </li>
              </Link>

              <Link to="/admin/Services">
                <li className="admin-li">
                  <FontAwesomeIcon
                    icon={faUserMd}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Services Panel
                </li>
              </Link>

              <Link to="/admin/Requests">
                <li className="admin-li">
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{ marginRight: "0.6rem" }}
                  />
                  User Requests
                </li>
              </Link>
              <Link to="/admin/Staff">
                <li className="admin-li">
                  {" "}
                  <FontAwesomeIcon
                    icon={faUserFriends}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Staff
                </li>
              </Link>
            </ul>
          </article>
        </span>
      </span>
    </article>
  );
};

export default Admin;
