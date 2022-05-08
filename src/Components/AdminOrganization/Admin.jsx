import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import "animate.css";
const Admin = (props) => {
  useEffect(() => {
    // const jwt = localStorage.getItem("token");
    // if (!jwt) props.history.push("/NotFound");
    // if (jwt) {
      // const user = jwtDecode(jwt);
      // if (
      //   user.isOrganizationAdmin === "false" ||
      //   user.isOrganizationAdmin === "pending"
      // )
      //   props.history.push("/NotFound");
      props.setProgress(0);
      props.setProgress(10);
      props.setProgress(20);
      props.setProgress(40);
      props.setProgress(100);
    // }
  }, []);

  return (
    <article className="admin-wrapper">
      <span className="admin-top">
        <span className={`admin-container`}>
          <article className={`menuBar-container`}>
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
