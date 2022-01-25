import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import config from "../../Api/config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@mui/material/Pagination";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import jwtDecode from "jwt-decode";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import StaffDetails from "./StaffDetails";

const OrganizationAdminRequests = (props) => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSelected, setPageSelected] = useState(1);
  const [searchedAdmin, setsearchedAdmin] = useState("");
  const [pageSize] = useState(8);

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) props.history.push("/NotFound");
    if (jwt) {
      const user = jwtDecode(jwt);
      if (user.isAppAdmin === "false" || !user.isAppAdmin)
        props.history.push("/NotFound");
      props.setProgress(0);
      props.setProgress(10);
      props.setProgress(20);

      getPendingOrganizationAdmins();
      props.setProgress(40);
      if (user.isAppAdmin) fetchOrganizations();
      props.setProgress(100);
    }
  }, [pageSelected, searchedAdmin]);

  const getPendingOrganizationAdmins = async () => {
    const { data } = await axios.get(
      config.apiEndPoint + `/user?getOrganizationAdmins=abc`
    );
    console.log("Pending Admins::", data);
    setPendingAdmins(data);
  };

  const refereshPage = async () => {
    const { data: admins } = await axios.get(
      config.apiEndPoint + `/user?page=${pageSelected}&limit=${pageSize}`
    );
    setPendingAdmins(admins.results);
  };

  const ApproveAdminRequests = async (admin) => {
    try {
      if (admin.ResumePath) {
        await axios.put(config.apiEndPoint + "/user/" + admin._id, {
          isOrganizationAdmin: "Independent Member Approved",
        });
        const { data: service } = await axios.get(
          config.apiEndPoint +
            `/services?findServiceByUser=yes&userID=${admin._id}`
        );
        await axios.patch(config.apiEndPoint + "/services", {
          serviceID: service[0]._id,
        });
      } else {
        await axios.put(config.apiEndPoint + "/user/" + admin._id, {
          isOrganizationAdmin: "Approved Admin",
        });
      }
    } catch (ex) {
      toast.error(ex.response.data);
    }
    await refereshPage();
  };

  const DeclineAdminRequests = async (admin) => {
    try {
      await axios.delete(config.apiEndPoint + "/user/" + admin._id);
      toast.success("Request For being Organization Admin Declined");
    } catch (ex) {
      toast.error(ex.response.data);
    }
    await refereshPage();
  };
  const checkPages = () => {
    if (totalPages > 1) return true;
    else return false;
  };

  const getTotalDocuments = async () => {
    const { data: totalDocuments } = await axios.get(
      config.apiEndPoint + `/user?getOrganizationAdmins=abc`
    );
    return totalDocuments;
  };

  const handleChange = async (e) => {
    let page = "";
    if (!e.currentTarget.value) {
      const { data } = await axios.get(
        `http://localhost:3000/api/user?page=${pageSelected}&limit=${pageSize}`
      );
      setPendingAdmins(data.results);
      const totalDocuments = await getTotalDocuments();
      if (searchedAdmin) {
        page = Math.ceil(totalDocuments.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.length / pageSize);
      }
      setTotalPages(page);

      setPendingAdmins(data.results);
      setsearchedAdmin("");
      return;
    }

    setsearchedAdmin(e.currentTarget.value);
  };

  //Get Searched Admin Results.
  //To Be Displayed in a Table
  //Or Without any searched Value.
  const fetchOrganizations = async () => {
    let page = "";

    //When Searched Value Exists.
    if (searchedAdmin) {
      const { data } = await axios.get(
        config.apiEndPoint + `/user?getOrganizationAdmins=abc`
      );
      const searchedResults = data.filter((d) =>
        d.fullName.toUpperCase().startsWith(searchedAdmin.toUpperCase())
      );

      await getTotalDocuments();

      if (searchedAdmin) {
        page = Math.ceil(searchedResults.length / pageSize);
      } else {
        page = Math.ceil(searchedResults.length / pageSize);
      }
      setTotalPages(page);

      setPendingAdmins(searchedResults);
      if (searchedResults.length === 0 && searchedAdmin) {
        toast.error("No Results Found!");
      }
      return;
    }
    const { data: admins } = await axios.get(
      config.apiEndPoint + `/user?page=${pageSelected}&limit=${pageSize}`
    );
    const totalDocuments = await getTotalDocuments();
    if (admins.results.length > 0) {
      if (!searchedAdmin) {
        page = Math.ceil(totalDocuments.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.length / pageSize);
      }
      setTotalPages(page);

      setPendingAdmins(admins.results);
    } else {
      setTotalPages(totalPages);
    }
  };

  return (
    <article className="ServicePanel-wrapper">
      <article className="searchBar-wrapper">
        <input
          className="search-Bar"
          type="text"
          placeholder="Search Service"
          value={searchedAdmin}
          onChange={handleChange}
        />
        <button className="search-btn">
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: "0.6rem" }} />
          Search
        </button>
      </article>
      <React.Fragment>
        <ToastContainer />
        {pendingAdmins.length > 0 && (
          <article className="table-responsive table-Services">
            <table className="table">
              <caption>
                Requests for being an Organization Admin Or working as an
                independent employee
              </caption>
              <thead className="table-th assign-duty-th">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Request For</th>
                  <th scope="col">
                    Resume
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      style={{ marginLeft: "0.5rem" }}
                    />
                    <FontAwesomeIcon
                      icon={faFileWord}
                      style={{ marginLeft: "0.5rem" }}
                    />
                  </th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {pendingAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.fullName}</td>
                    <td>{admin.email}</td>
                    {admin.ResumePath ? (
                      <td>
                        <strong>Independent Work</strong>
                      </td>
                    ) : (
                      <td>
                        <strong>{admin.Organization.name}</strong>
                      </td>
                    )}

                    <td>
                      {admin.ResumeName ? (
                        <article>
                          <a
                            href={config.server + admin.ResumePath}
                            download="resume"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {admin.ResumeName}
                          </a>
                        </article>
                      ) : (
                        "NONE"
                      )}
                    </td>

                    <td>
                      <Link to={`/app/admin/requests/${admin._id}`}>
                        <Button
                          style={{ backgroundColor: "#1E5128" }}
                          variant="contained"
                          onClick={() => ApproveAdminRequests(admin)}
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            style={{ marginRight: "0.6rem" }}
                          />
                          Approve
                        </Button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/app/admin/requests/${admin._id}`}>
                        <Button
                          variant="contained"
                          onClick={() => DeclineAdminRequests(admin)}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={{ marginRight: "0.6rem" }}
                          />
                          Decline
                        </Button>
                      </Link>
                    </td>
                    {admin.ResumePath && (
                      <td>
                        <StaffDetails staffMemberDetails={admin} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        )}
      </React.Fragment>
      {checkPages() && (
        <div className="pagination app-admin-pagination">
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

export default OrganizationAdminRequests;
