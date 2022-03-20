import React, { useEffect, useState } from "react";
import AddOrgModal from "../Modals/AddOrganizationModal";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@mui/material/Pagination";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import EditModalOrg from "../Modals/EditOrganizationModle";
import config from "../../Api/config.json";
import axios from "axios";
import jwtDecode from "jwt-decode";

const ManageOrganizations = (props) => {
  let [organizations, setOrganizations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSelected, setPageSelected] = useState(1);
  const [searchedService, setSearchedService] = useState("");
  const [pageSize] = useState(9);
  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) props.history.push("/NotFound");
    if (jwt) {
      const user = jwtDecode(jwt);
      if (user.isAppAdmin === "false" || !user.isAppAdmin)
        props.history.push("/NotFound");
      if (user.isAppAdmin === true) fetchOrganizations();
    }
  }, [pageSelected, searchedService]);

  //Get Searched Organization Results.
  //To Be Displayed in a Table
  //Or Without any searched Value.
  const fetchOrganizations = async () => {
    props.setProgress(0);
    let page = "";

    //When Searched Value Exists.
    if (searchedService) {
      const { data } = await axios.get(
        `http://localhost:3000/api/organizations`
      );
      props.setProgress(30);
      const searchedResults = data.results.filter((d) =>
        d.name.toUpperCase().startsWith(searchedService.toUpperCase())
      );

      await getTotalDocuments();
      props.setProgress(40);
      if (searchedService) {
        page = Math.ceil(searchedResults.length / pageSize);
      } else {
        page = Math.ceil(searchedResults.length / pageSize);
      }
      setTotalPages(page);
      props.setProgress(60);
      setOrganizations(searchedResults);
      if (searchedResults.length === 0 && searchedService) {
        toast.error("No Results Found!");
      }
      props.setProgress(80);
      props.setProgress(100);
      return;
    }
    props.setProgress(10);
    const { data: organizations } = await axios.get(
      config.apiEndPoint +
        `/organizations?page=${pageSelected}&limit=${pageSize}`
    );
    props.setProgress(30);
    const totalDocuments = await getTotalDocuments();
    if (organizations.results.length > 0) {
      if (!searchedService) {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      }
      props.setProgress(40);
      setTotalPages(page);
      props.setProgress(60);
      props.setProgress(80);
      props.setProgress(100);
      setOrganizations(organizations.results);
    } else {
      props.setProgress(40);
      setTotalPages(totalPages);
      props.setProgress(60);
      props.setProgress(80);
      props.setProgress(100);
    }
  };

  const getTotalDocuments = async () => {
    const { data: totalDocuments } = await axios.get(
      config.apiEndPoint + "/organizations"
    );
    return totalDocuments;
  };

  const reloadOrganzations = async () => {
    await fetchOrganizations();
  };
  const checkPages = () => {
    if (totalPages > 1) return true;
    else return false;
  };

  //For Search Organization
  const handleChange = async (e) => {
    let page = "";
    if (!e.currentTarget.value) {
      const { data } = await axios.get(
        `http://localhost:3000/api/organizations?page=${pageSelected}&limit=${pageSize}`
      );
      setOrganizations(data.results);
      const totalDocuments = await getTotalDocuments();
      if (searchedService) {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      }
      setTotalPages(page);

      setOrganizations(data.results);
      setSearchedService("");
      return;
    }

    setSearchedService(e.currentTarget.value);
  };

  const deleteOrganization = async (id) => {
    const orignalOrganizations = organizations;
    const newOrganizations = organizations.filter((o) => o._id !== id);
    setOrganizations(newOrganizations);

    try {
      await axios.delete("http://localhost:3000/api/organizations/" + id);
      toast.success("Deleted");
      await reloadOrganzations();
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This post has already been deleted");
      }
      setOrganizations(orignalOrganizations);
    }
  };

  return (
    <article className="manage-org-wrapper">
      <AddOrgModal reloadOrganzations={reloadOrganzations} />
      <ToastContainer />
      {organizations.length>0 && <article className="searchBar-wrapper">
        <input
          className="search-Bar"
          type="text"
          placeholder="Search Service"
          value={searchedService}
          onChange={handleChange}
        />
        <button className="search-btn">
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: "0.6rem" }} />
          Search
        </button>
      </article>}
      <article className="table-responsive table-Services organizations-table">
        {organizations.length>0 && <table className="table">
          <thead className="table-th assign-duty-th">
            <tr>
              <th scope="col">Organizations</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org._id}>
                <td>{org.name}</td>
                <td>
                  <Button
                    variant="contained"
                    onClick={() => {
                      deleteOrganization(org._id);
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
                  <EditModalOrg
                    organizationData={org}
                    reloadOrganzations={reloadOrganzations}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </article>
      {checkPages() && (
        <div className="pagination">
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

export default ManageOrganizations;
