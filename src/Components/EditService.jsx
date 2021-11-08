import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EditModal from "./MoodleForEdit";
import { Paper } from "@material-ui/core";

import BasicModal from "../AddServiceModle";
import AddService from "./AddService";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { TextField } from "@mui/material";
// import Paginating from "./Common/Paginating";
import Pagination from "@mui/material/Pagination";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const EditService = () => {
  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSelected, setPageSelected] = useState(1);
  const [searchedService, setSearchedService] = useState("");
  const [pageSize] = useState(9);

  const getTotalDocuments = async () => {
    const { data: totalDocuments } = await axios.get(
      `http://localhost:3000/api/services`
    );
    return totalDocuments;
  };

  const PopulateTable = async () => {
    console.log("POPULATE TABLE !!!");
    let page = "";

    if (searchedService) {
      console.log("Search!!!");
      console.log("Searched Service ::", searchedService);
      const { data } = await axios.get(`http://localhost:3000/api/services`);
      const searchedResults = data.results.filter((d) =>
        d.serviceName.toUpperCase().startsWith(searchedService)
      );
      console.log("Searched Results ::", searchedResults);

      const totalDocuments = await getTotalDocuments();

      if (searchedResults.length > 0) {
        if (searchedService) {
          page = Math.ceil(searchedResults.length / pageSize);
        } else {
          page = Math.ceil(searchedResults.length / pageSize);
        }
        setTotalPages(page);

        setServices(searchedResults);
        return;
      }
    }
    const { data } = await axios.get(
      `http://localhost:3000/api/services?page=${pageSelected}&limit=${pageSize}&searchedString=${searchedService}`
    );
    const totalDocuments = await getTotalDocuments();

    if (data.results.length > 0) {
      if (searchedService) {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      } else {
        page = Math.ceil(totalDocuments.results.length / pageSize);
      }
      setTotalPages(page);

      setServices(data.results);
    }
  };
  useEffect(async () => {
    PopulateTable();

    // const { data: totalDocuments } = await axios.get(
    //   `http://localhost:3000/api/services`
    // );
  }, [pageSelected]);

  const deleteService = async (id) => {
    const orignalServices = services;
    const newServices = services.filter((s) => s._id !== id);
    setServices(newServices);

    try {
      await axios.delete("http://localhost:3000/api/services" + "/" + id);
      toast.success("Deleted");
      const { data: services } = await axios.get(
        "http://localhost:3000/api/services"
      );
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This post has already been deleted");
      }
      setServices(orignalServices);
    }
  };
  const updateService = async () => {
    const { data: services } = await axios.get(
      `http://localhost:3000/api/services?page=${pageSelected}&limit=${pageSize}`
    );

    setServices(services.results);
  };

  const checkPages = () => {
    console.log("Check Pages");
    console.log("totalPages", totalPages);
    if (totalPages > 1) return true;
    else return false;
  };

  const handleChange = async (e) => {
    // const searched = e.currentTarget.value;
    let page = "";
    if (!e.currentTarget.value) {
      const { data } = await axios.get(
        `http://localhost:3000/api/services?page=${pageSelected}&limit=${pageSize}`
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
    console.log("Searched service ::", e.currentTarget.value);
    // if (!searched) {
    //   console.log("!seearch");
    //   setSearchedService("");
    //   // filterResult();
    // } else setSearchedService(searched);
    // console.log("searched service ::", searchedService);
    // if (!e.currentTarget.value) {
    //   console.log("!e.currentTarget.value");
    //   console.log("e.currentTarget.value = ", e.currentTarget.value);

    //   filterResult();
    // }
  };

  return (
    //editService-container classname of

    <article className="ServicePanel-wrapper ">
      <React.Fragment>
        <article className="searchBar-wrapper">
          <input
            className="search-Bar"
            type="text"
            placeholder="Search Service"
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

        <article className="editService-container editService-style">
          <ToastContainer />

          <BasicModal updateService={updateService} />
          {services.length > 0 && (
            // <article className="editService-container">
            // <article className="table-container">
            // <div className="doc-table-container">
            <React.Fragment>
              <article className="table-responsive">
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
                        <td>{data.serviceOrgranization}</td>
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

        {/* <Pagination
            count="10"
            // variant="outlined"
            color="secondary"
            size="large"
          /> */}
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
      {/* <Paginating count={10}
        updateService={this.updateService}
        /> */}
    </article>
  );
};
export default EditService;
