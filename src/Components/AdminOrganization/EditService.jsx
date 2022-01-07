import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EditModal from "./Modles/MoodleForEdit";
import { Paper } from "@material-ui/core";

import BasicModal from "./Modles/AddServiceModle";
import AddService from "./Forms/AddService";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { TextField } from "@mui/material";

import Pagination from "@mui/material/Pagination";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import jwtDecode from "jwt-decode";

const EditService = (props) => {
  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSelected, setPageSelected] = useState(1);
  const [searchedService, setSearchedService] = useState("");
  const [user, setUser] = React.useState([]);
  const [pageSize] = useState(9);

  const getTotalDocuments = async () => {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    setUser(user);
    const { data: totalDocuments } = await axios.get(
      `http://localhost:3000/api/services?organization=${user.Organization._id}`
    );
    return totalDocuments;
  };

  //Get Searched Service Results.
  //To Be Displayed in a Table
  //Or Without any searched Value.
  const PopulateTable = async () => {
    let page = "";
    props.setProgress(10);
    //When Searched Value Exists.
    if (searchedService) {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      const { data } = await axios.get(
        `http://localhost:3000/api/services?organization=${user.Organization._id}`
      );
      props.setProgress(30);
      const searchedResults = data.results.filter((d) =>
        d.serviceName.toUpperCase().startsWith(searchedService.toUpperCase())
      );

      const totalDocuments = await getTotalDocuments();

      if (searchedService) {
        page = Math.ceil(searchedResults.length / pageSize);
      } else {
        page = Math.ceil(searchedResults.length / pageSize);
      }
      setTotalPages(page);
      props.setProgress(70);
      setServices(searchedResults);
      if (searchedResults.length === 0 && searchedService) {
        toast.error("No Results Found!");
      }
      props.setProgress(100);
      return;
    }
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    //When Searched Value Doesn't Exist.
    const { data } = await axios.get(
      `http://localhost:3000/api/services?page=${pageSelected}&limit=${pageSize}&searchedString=${searchedService}&organization=${user.Organization._id}`
    );

    const totalDocuments = await getTotalDocuments();
    props.setProgress(70);
    if (data.results.length > 0) {
      if (searchedService) {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      }
      setTotalPages(page);

      setServices(data.results);
    }
    props.setProgress(100);
  };

  useEffect(async () => {
    const jwt = localStorage.getItem("token");
    if (!jwt) props.history.push("/NotFound");

    if (jwt) {
      const user = jwtDecode(jwt);
      if (
        user.isOrganizationAdmin === "false" ||
        user.isOrganizationAdmin === "pending"
      )
        props.history.push("/NotFound");
      if (user.isOrganizationAdmin === "Approved Admin") PopulateTable();
    }
  }, [pageSelected, searchedService]);

  const deleteService = async (id) => {
    const orignalServices = services;
    const newServices = services.filter((s) => s._id !== id);
    setServices(newServices);

    try {
      await axios.delete("http://localhost:3000/api/services" + "/" + id);
      // toast.success("Deleted");

      const { data: services } = await axios.get(
        "http://localhost:3000/api/services"
      );
      const { data: servicesPerCurrentPage } = await axios.get(
        `http://localhost:3000/api/services?page=${pageSelected}&limit=${pageSize}&organization=${user.Organization._id}`
      );
      if (servicesPerCurrentPage.results.length === 0)
        window.location = "/admin/Services";
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This post has already been deleted");
      }

      setServices(orignalServices);
    }
  };
  const updateService = async () => {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    const { data: services } = await axios.get(
      `http://localhost:3000/api/services?page=${pageSelected}&limit=${pageSize}&organization=${user.Organization._id}`
    );

    const { data: allOrganizations } = await axios.get(
      `http://localhost:3000/api/services?page=${totalPages}&limit=${pageSize}&organization=${user.Organization._id}`
    );
    if (allOrganizations.results.length === 9)
      window.location = "/admin/Services";
    setServices(services.results);
  };

  const checkPages = () => {
    if (totalPages > 1) return true;
    else return false;
  };

  const handleChange = async (e) => {
    let page = "";
    if (!e.currentTarget.value) {
      const { data } = await axios.get(
        `http://localhost:3000/api/services?page=${pageSelected}&limit=${pageSize}&Organization=${user.Organization._id}`
      );
      setServices(data.results);
      const totalDocuments = await getTotalDocuments();
      if (searchedService) {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      }
      setTotalPages(page);

      setServices(data.results);
      setSearchedService("");
      return;
    }

    setSearchedService(e.currentTarget.value);
    PopulateTable();
  };

  return (
    <article className="ServicePanel-wrapper ">
      <React.Fragment>
        {(services.length > 0 || searchedService) && (
          <article className="searchBar-wrapper">
            <input
              className="search-Bar"
              type="text"
              placeholder="Search A Service..."
              value={searchedService}
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

        <article className="editService-container editService-style">
          <ToastContainer />

          <BasicModal updateService={updateService} />
          {services.length > 0 && (
            // <article className="editService-container">
            // <article className="table-container">
            // <div className="doc-table-container">
            <React.Fragment>
              <article className="table-responsive table-Services">
                <table className="table">
                  <thead className="table-th assign-duty-th">
                    <tr>
                      <th scope="col">Service Name</th>
                      <th scope="col">Service Organization</th>
                      <th scope="col">Service Cost</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((data) => (
                      <tr key={data._id}>
                        <td>{data.serviceName}</td>
                        <td>{data.serviceOrgranization.name}</td>
                        <td>{data.servicePrice}</td>
                        <td>
                          <Button
                            variant="contained"
                            onClick={() => {
                              deleteService(data._id);
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
                          <EditModal
                            serviceData={data}
                            updateService={updateService}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            </React.Fragment>
          )}
        </article>
      </React.Fragment>

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
export default EditService;
