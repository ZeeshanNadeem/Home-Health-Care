import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EditModal from "./Modles/MoodleForEdit";
import { Paper } from "@material-ui/core";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
// import PopulateTable from "./Pagination/CreatePages";
import getTotalDocuments from "../Pagination/CreatePages";

import BasicModal from "./Modles/AddServiceModle";
import AddService from "./Forms/AddService";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { TextField } from "@mui/material";

import Pagination from "@mui/material/Pagination";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import StaffEditModle from "./Modles/StaffEditModle";
import AddStaffModle from "./Modles/AddStaffModle";

const StaffPanel = () => {
  const [staff, setStaff] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchedStaff, setSearchedStaff] = useState("");
  const [pageSelected, setPageSelected] = useState(1);

  const [pageSize] = useState(9);
  const getTotalDocuments = async () => {
    const { data: totalDocuments } = await axios.get(
      `http://localhost:3000/api/staff`
    );
    return totalDocuments;
  };

  //Get Searched Service Results.
  //To Be Displayed in a Table
  //Or Without any searched Value.
  const PopulateTable = async () => {
    let page = "";
    console.log("POP searchedStaff::", searchedStaff);
    if (searchedStaff) {
      const { data } = await axios.get(`http://localhost:3000/api/staff`);

      const searchedResults = data.results.filter((d) =>
        d.fullName.toUpperCase().startsWith(searchedStaff.toUpperCase())
      );

      const totalDocuments = await getTotalDocuments();

      if (searchedStaff) {
        page = Math.ceil(searchedResults.length / pageSize);
      } else {
        page = Math.ceil(searchedResults.length / pageSize);
      }
      setTotalPages(page);

      setStaff(searchedResults);

      console.log(
        "searchedResults.length === 0 :::",
        searchedResults.length === 0
      );
      console.log("searchedStaff:::", searchedStaff);
      if (searchedResults.length === 0 && searchedStaff) {
        toast.error("No Results Found!");
      }
      return;
    }
    const { data } = await axios.get(
      `http://localhost:3000/api/staff?page=${pageSelected}&limit=${pageSize}&searchedString=${searchedStaff}`
    );
    const totalDocuments = await getTotalDocuments();

    if (data.results.length > 0) {
      if (searchedStaff) {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      }
      setTotalPages(page);

      setStaff(data.results);
    }
  };
  useEffect(async () => {
    PopulateTable();
  }, [pageSelected, searchedStaff]);

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
  const handleChange = async (e) => {
    let page = "";
    if (!e.currentTarget.value) {
      const { data } = await axios.get(
        `http://localhost:3000/api/staff?page=${pageSelected}&limit=${pageSize}`
      );
      setStaff(data.results);
      const totalDocuments = await getTotalDocuments();
      if (searchedStaff) {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      }
      setTotalPages(page);

      setStaff(data.results);
      setSearchedStaff("");
      return;
    }

    setSearchedStaff(e.currentTarget.value);

    // PopulateTable();
  };
  return (
    <article className="ServicePanel-wrapper ">
      <article className="searchBar-wrapper">
        <ToastContainer />
        <input
          className="search-Bar"
          type="text"
          placeholder="Staff Name"
          value={searchedStaff}
          onChange={handleChange}
        />
        <button className="search-btn" onClick={PopulateTable}>
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: "0.6rem" }} />
          Search
        </button>
      </article>
      <AddStaffModle RefreshStaffMembers={RefreshStaffMembers} />
      {staff.length > 0 && (
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
      )}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: "1rem" }}>
          <Pagination
            count={totalPages}
            // variant="outlined"
            color="secondary"
            defaultPage={1}
            size="large"
            showFirstButton
            showLastButton
            onChange={(event, value) => setPageSelected(value)}
          />
        </div>
      )}
    </article>
  );
};
export default StaffPanel;
