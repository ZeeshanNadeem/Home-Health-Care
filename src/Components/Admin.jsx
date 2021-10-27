import React, { useState } from "react";
import DoctorForm from "./DoctorForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import EditService from "./EditService";
import AdminUserRequest from "./AdminUserRequest";
import AssignDuty from "./AssignDuty";
import AddService from "./AddService";
import NurseForm from "./NurseForm";
import AdminNav from "./AdminNav";
import "animate.css";
const Admin = () => {
  const [showDocDetials, setDocDetails] = useState("");
  const DoctorDetailsHandler = (name) => {
    setDocDetails(name);
    console.log("name saved :", name);
  };
  return (
    <React.Fragment>
      <article className="admin-top">
        <AdminNav />
        <article className="admin-container">
          <article className="menuBar-container">
            <ul className="menu-items">
              <h2 className="menu-title animate__heartBeat">Admin</h2>
              <li
                onClick={() => DoctorDetailsHandler("docDetails")}
                className="li-add-doc"
              >
                <FontAwesomeIcon
                  icon={faUserPlus}
                  style={{ marginRight: "0.6rem" }}
                />
                Add A Doctor
              </li>
              <li onClick={() => DoctorDetailsHandler("nurseDetails")}>
                {" "}
                <FontAwesomeIcon
                  icon={faUserPlus}
                  style={{ marginRight: "0.6rem" }}
                />
                Add A Nurse
              </li>
              <li onClick={() => DoctorDetailsHandler("addService")}>
                <FontAwesomeIcon
                  icon={faUserPlus}
                  style={{ marginRight: "0.6rem" }}
                />
                Add A Service
              </li>
              <li onClick={() => DoctorDetailsHandler("EditService")}>
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ marginRight: "0.6rem" }}
                />
                Edit Service
              </li>
              {/* <li>
                <FontAwesomeIcon icon={faTrash} style={{ marginRight: "0.6rem" }} />
                Delete Service
              </li> */}
              {/* <li onClick={() => DoctorDetailsHandler("AssignDuty")}>
                <FontAwesomeIcon
                  icon={faUserTie}
                  style={{ marginRight: "0.6rem" }}
                />
                Assign Duty
              </li> */}
              <li onClick={() => DoctorDetailsHandler("AdminUserRequests")}>
                <FontAwesomeIcon
                  icon={faUsers}
                  style={{ marginRight: "0.6rem" }}
                />
                User Requests
              </li>
            </ul>
          </article>
          {(showDocDetials === "docDetails" && <DoctorForm />) ||
            (showDocDetials === "nurseDetails" && <NurseForm />) ||
            (showDocDetials === "addService" && <AddService />) ||
            (showDocDetials === "AssignDuty" && <AssignDuty />) ||
            (showDocDetials === "AdminUserRequests" && <AdminUserRequest />) ||
            (showDocDetials === "EditService" && <EditService />)}
        </article>
      </article>
    </React.Fragment>
  );
};

export default Admin;
