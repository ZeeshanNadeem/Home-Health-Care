import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "animate.css";
const AppAdmin = (props) => {
  React.useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) props.history.push("/NotFound");
    if (jwt) {
      const user = jwtDecode(jwt);
      if (user.isAppAdmin === "false" || !user.isAppAdmin)
        props.history.push("/NotFound");
      props.setProgress(0);
      props.setProgress(10);
      props.setProgress(20);
      props.setProgress(40);
      props.setProgress(100);
    }
  }, []);
  return (
    <article className="admin-wrapper app-admin-wrapper">
      <span className="admin-top">
        <span className={`admin-container`}>
          <article className={`menuBar-container`}>
            <ul className="menu-items">
              <h2 className="menu-title animate__heartBeat "> Admin</h2>

              <Link to="/app/admin/org">
                <li className="admin-li frist-li app-admin-li">
                  <FontAwesomeIcon
                    icon={faUserMd}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Manage Organizations
                </li>
              </Link>

              <Link to="/app/admin/requests">
                <li className="admin-li app-admin-li">
                  {" "}
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{ marginRight: "0.6rem" }}
                  />
                  Admin Requests
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
