import React, { useState } from "react";
import DoctorForm from "./DoctorForm";
import SignUp from "./SignUpNew";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import EditService from "./EditService";
import AddService from "./AddService";
import NurseForm from "./NurseForm";
import "animate.css";
const Admin = () => {
  const [showDocDetials, setDocDetails] = useState("");
  const DoctorDetailsHandler = (name) => {
    setDocDetails(name);
    console.log("name saved :", name);
  };
  return (
    <article className="admin-container">
      <article className="menuBar-container">
        <ul className="menu-items">
          <h2 className="menu-title animate__heartBeat">Admin</h2>
          <li onClick={() => DoctorDetailsHandler("docDetails")}>
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
          <li>
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: "0.6rem" }} />
            Edit Service
          </li>
          <li>
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: "0.6rem" }} />
            Delete Service
          </li>
          <li onClick={() => DoctorDetailsHandler("AssignDuty")}>
            <FontAwesomeIcon
              icon={faUserTie}
              style={{ marginRight: "0.6rem" }}
            />
            Assign Duty
          </li>
          <li>
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.6rem" }} />
            User Requests
          </li>
        </ul>
      </article>
      {(showDocDetials === "docDetails" && <DoctorForm />) ||
        (showDocDetials === "nurseDetails" && <NurseForm />) ||
        (showDocDetials === "addService" && <AddService />) ||
        (showDocDetials === "AssignDuty" && <EditService />)}
    </article>
  );
};

export default Admin;
