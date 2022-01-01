import React, { useEffect, useState } from "react";
// import DoctorForm from "../DoctorForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import "animate.css";
const Admin = ({ setProgress }) => {
  const [showDocDetials, setDocDetails] = useState("");
  const [menuBarZindex, setMenuBarZindex] = useState("");
  const DoctorDetailsHandler = (name) => {
    setDocDetails(name);
    if (name === "EditService") {
      setMenuBarZindex("MenuBarZIndex");
    }
  };
  useEffect(() => {
    setProgress(0);
    setProgress(10);
    setProgress(20);
    setProgress(40);
    setProgress(100);
  }, []);

  return (
    <article className="admin-wrapper">
      <span className="admin-top">
        <span className={`admin-container`}>
          <article className={`menuBar-container ${menuBarZindex}`}>
            <ul className="menu-items">
              <h2 className="menu-title animate__heartBeat">Admin</h2>

              <Link to="/admin/Services">
                <li className="admin-li frist-li">
                  <FontAwesomeIcon
                    icon={faUserMd}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Manage Services
                </li>
              </Link>

              <Link to="/admin/Nurse">
                <li className="admin-li">
                  {" "}
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Manage Staff
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
