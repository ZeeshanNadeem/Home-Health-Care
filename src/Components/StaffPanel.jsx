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
  const [totalPages, setTotalPages] = useState(1);
  const [pageSelected, setPageSelected] = useState(1);
  const [pageSize] = useState(9);

  useEffect(async () => {
    const { data: staff } = await axios.get(`http://localhost:3000/api/staff`);
    setStaff(staff);
  }, []);

  const RefreshStaffMembers = async () => {
    const { data: staff } = await axios.get(`http://localhost:3000/api/staff`);

    setStaff(staff);
  };

  const deleteAStaffMember = async (id) => {
    const orignalStaff = staff;
    const newStaff = staff.filter((s) => s._id !== id);
    setStaff(newStaff);

    try {
      await axios.delete("http://localhost:3000/api/staff" + "/" + id);
      toast.success("Deleted");
      const { data: services } = await axios.get(
        "http://localhost:3000/api/staff"
      );
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This post has already been deleted");
      }
      setStaff(orignalStaff);
    }
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

      <AddStaffModle RefreshStaffMembers={RefreshStaffMembers} />
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
                  <Button
                    variant="contained"
                    onClick={() => {
                      deleteAStaffMember(data._id);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ marginRight: "0.6rem" }}
                    />
                    Delete
                  </Button>
                </td>
                <td>
                  <StaffEditModle
                    staffMemberData={data}
                    RefreshStaffMembers={RefreshStaffMembers}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      {
        <div className="pagination" style={{ marginTop: "1rem" }}>
          <Pagination
            count={4}
            // variant="outlined"
            color="secondary"
            defaultPage={1}
            size="large"
            showFirstButton
            showLastButton
          />
        </div>
      }
    </article>
  );
};
export default StaffPanel;
