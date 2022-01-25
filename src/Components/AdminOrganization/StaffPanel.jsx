import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import config from "../Api/config.json";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import StaffEditModle from "./Modles/StaffEditModle";
import AddStaffModle from "./Modles/AddStaffModle";
import StaffInfo from "./Modles/StaffInfo";
import jwtDecode from "jwt-decode";

const StaffPanel = (props) => {
  const [staff, setStaff] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchedStaff, setSearchedStaff] = useState("");
  const [pageSelected, setPageSelected] = useState(1);
  let [entireStaff, setEntireStaff] = useState([]);

  const [pageSize] = useState(9);
  const getTotalDocuments = async () => {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    const { data: totalDocuments } = await axios.get(
      `http://localhost:3000/api/staff?organizationID=${user.Organization._id}`
    );
    return totalDocuments;
  };

  //Get Searched Service Results.
  //To Be Displayed in a Table
  //Or Without any searched Value.
  const PopulateTable = async () => {
    let page = "";
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);

    props.setProgress(10);
    if (searchedStaff) {
      //If user had searched a staff member

      const { data } = await axios.get(
        `http://localhost:3000/api/staff?organizationID=${user.Organization._id}`
      );

      const searchedResults = data.results.filter((d) =>
        d.fullName.toUpperCase().startsWith(searchedStaff.toUpperCase())
      );
      props.setProgress(30);
      await getTotalDocuments();
      props.setProgress(70);
      if (searchedStaff) {
        page = Math.ceil(searchedResults.length / pageSize);
      } else {
        page = Math.ceil(searchedResults.length / pageSize);
      }
      setTotalPages(page);

      setStaff(searchedResults);

      if (searchedResults.length === 0 && searchedStaff) {
        toast.error("No Results Found!");
      }
      props.setProgress(100);
      return;
    }
    //If user hasn't searched a staff member
    //This part gets executed
    const { data } = await axios.get(
      `http://localhost:3000/api/staff?page=${pageSelected}&limit=${pageSize}&searchedString=${searchedStaff}&organizationID=${user.Organization._id}`
    );
    props.setProgress(30);
    const totalDocuments = await getTotalDocuments();
    props.setProgress(70);
    if (data.results.length > 0) {
      if (searchedStaff) {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      }
      setTotalPages(page);

      setStaff(data.results);
    }
    props.setProgress(100);
  };
  useEffect(() => {
    async function fetchData() {
      const jwt = localStorage.getItem("token");
      if (!jwt) props.history.push("/NotFound");

      if (jwt) {
        const user = jwtDecode(jwt);
        if (
          user.isOrganizationAdmin === "false" ||
          user.isOrganizationAdmin === "pending"
        )
          props.history.push("/NotFound");
        if (user.isOrganizationAdmin === "Approved Admin")
          await PopulateTable();
      }
      const { data } = await axios.get(
        config.apiEndPoint + "/user?GetStaff=true"
      );
      setEntireStaff(data);
    }
    fetchData();
  }, [pageSelected, searchedStaff]);

  const RefreshStaffMembers = async () => {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    const { data: staff } = await axios.get(
      `http://localhost:3000/api/staff?page=${totalPages}&limit=${pageSize}&organizationID=${user.Organization._id}`
    );
    const { data } = await axios.get(
      config.apiEndPoint + "/user?GetStaff=true"
    );
    setEntireStaff(data);
    if (staff.results.length === 9) window.location = "/admin/Nurse";

    setStaff(staff.results);
  };

  const deleteAStaffMember = async (id) => {
    const orignalStaff = staff;
    const newStaff = staff.filter((s) => s._id !== id);
    setStaff(newStaff);

    try {
      await axios.delete("http://localhost:3000/api/staff" + "/" + id);
      // toast.success("Deleted");
      await axios.get("http://localhost:3000/api/staff");
      const { data: userObjInTable } = await axios.get(
        config.apiEndPoint + `/user/${id}`
      );
      await axios.delete(
        "http://localhost:3000/api/user/" + userObjInTable._id
      );
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      const { data: servicesPerCurrentPage } = await axios.get(
        `http://localhost:3000/api/staff?page=${pageSelected}&limit=${pageSize}&organizationID=${user.Organization._id}`
      );
      if (servicesPerCurrentPage.results.length === 0)
        window.location = "/admin/Nurse";
      // RefreshStaffMembers();
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
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      const { data } = await axios.get(
        `http://localhost:3000/api/staff?page=${pageSelected}&limit=${pageSize}&organizationID=${user.Organization._id}`
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
    <article className="ServicePanel-wrapper">
      {(staff.length > 0 || searchedStaff) && (
        <article className="searchBar-wrapper">
          <ToastContainer />

          <input
            className="search-Bar"
            type="text"
            placeholder="Search A Staff Member..."
            value={searchedStaff}
            onChange={handleChange}
          />
          <button className="search-btn" onClick={PopulateTable}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{ marginRight: "0.6rem" }}
            />
            Search
          </button>
        </article>
      )}
      <AddStaffModle RefreshStaffMembers={RefreshStaffMembers} />
      {staff.length > 0 && (
        <article className="table-responsive">
          <table className="table">
            <thead className="table-th assign-duty-th">
              <tr>
                <th scope="col">Full Name</th>

                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {staff.map((data) => (
                <tr key={data._id}>
                  <td>{data.fullName}</td>

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
                  <td>
                    <StaffInfo staffMember={data} staff={entireStaff} />
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
