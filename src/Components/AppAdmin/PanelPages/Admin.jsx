import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import "animate.css";
const AppAdmin = () => {
  const [showDocDetials, setDocDetails] = useState("");
  const [menuBarZindex, setMenuBarZindex] = useState("");
  const DoctorDetailsHandler = (name) => {
    setDocDetails(name);
    if (name === "EditService") {
      setMenuBarZindex("MenuBarZIndex");
    }
  };
  return (
    <article className="admin-wrapper app-admin-wrapper">
      <span className="admin-top">
        <span className={`admin-container`}>
          <article className={`menuBar-container ${menuBarZindex}`}>
            <ul className="menu-items">
              <h2 className="menu-title animate__heartBeat "> Admin</h2>

              <Link to="/app/admin/org">
                <li className="admin-li frist-li app-admin-li">
                  <FontAwesomeIcon
                    icon={faUserMd}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Manage Organzation
                </li>
              </Link>

              <Link to="">
                <li className="admin-li app-admin-li">
                  {" "}
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Organzation
                </li>
              </Link>
            </ul>
          </article>
        </span>
      </span>
    </article>
  );
};

export default AppAdmin;
