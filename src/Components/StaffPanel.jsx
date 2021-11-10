import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EditModal from "./MoodleForEdit";
import { Paper } from "@material-ui/core";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import BasicModal from "../AddServiceModle";
import AddService from "./AddService";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { TextField } from "@mui/material";

import Pagination from "@mui/material/Pagination";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import StaffEditModle from "./StaffEditModle";
import AddStaffModle from "./AddStaffModle";

const StaffPanel = () => {
  const [staff, setStaff] = useState([]);

  useEffect(async () => {
    const { data: staff } = await axios.get(`http://localhost:3000/api/staff`);
    setStaff(staff);
  }, []);

  const updateService = async () => {
    const { data: staff } = await axios.get(`http://localhost:3000/api/staff`);

    setStaff(staff);
  };

  return (
    <article className="ServicePanel-wrapper ">
      <article className="searchBar-wrapper">
        <input
          className="search-Bar"
          type="text"
          placeholder="Search Service"
        />
        <button className="search-btn">
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: "0.6rem" }} />
          Search
        </button>
      </article>

      <AddStaffModle />
      <article className="table-responsive">
        <table className="table">
          <thead className="table-th assign-duty-th">
            <tr>
              <th scope="col">Full Name</th>
              <th scope="col">Date Of Birth</th>
              <th scope="col">Occupation</th>
              <th scope="col">Qualification</th>
              <th scope="col">Email</th>
              <th scope="col">Phone No</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {staff.map((data) => (
              <tr key={data._id}>
                <td>{data.fullName}</td>
                <td>{data.dateOfBirth}</td>
                <td>{data.staffType.name}</td>

                <td>{data.qualification.name}</td>
                <td>{data.email}</td>
                <td>{data.phone}</td>
                <td>
                  <Button variant="contained">
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ marginRight: "0.6rem" }}
                    />
                    Delete
                  </Button>
                </td>
                <td>
                  <StaffEditModle
                    serviceData={data}
                    updateService={updateService}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </article>
  );
};
export default StaffPanel;
