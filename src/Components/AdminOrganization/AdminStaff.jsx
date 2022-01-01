import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EditModal from "./Modles/MoodleForEdit";

import BasicModal from "./Modles/AddServiceModle";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

// import Paginating from "./Common/Paginating";
import Pagination from "@mui/material/Pagination";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const AdminStaff = ({ setProgress }) => {
  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSelected, setPageSelected] = useState(1);
  const [searchedService, setSearchedService] = useState("");
  useEffect(async () => {
    async function fetchData() {
      setProgress(10);
      const { data } = await axios.get(
        `http://localhost:3000/api/services?page=${pageSelected}&limit=${4}&searchedString=${searchedService}`
      );
      setProgress(30);
      const { data: totalDocuments } = await axios.get(
        `http://localhost:3000/api/services`
      );
      let page = "";
      if (searchedService) {
        page = Math.ceil(data.results.length / 4);
      } else {
        page = Math.ceil(totalDocuments.results.length / 4);
      }
      setProgress(70);
      setTotalPages(page);

      setServices(data.results);
      setProgress(100);
    }
    fetchData();
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
      `http://localhost:3000/api/services?page=${pageSelected}&limit=${3}`
    );

    setServices(services.results);
  };

  const checkPages = () => {
    if (totalPages > 1) return true;
    else return false;
  };
  const filterResult = async () => {
    console.log(
      `http://localhost:3000/api/services?page=${pageSelected}&limit=${4}&searchedString=${searchedService}`
    );

    let page = "";
    if (searchedService) {
      const { data } = await axios.get(
        `http://localhost:3000/api/services?searchedString=${searchedService}`
      );

      page = Math.ceil(data.results.length / 4);
      if (data.results.length === 0 && searchedService) {
        toast.error("No Results Found");
      }

      setServices(data.results);
    } else {
      const { data: totalDocuments } = await axios.get(
        `http://localhost:3000/api/services`
      );
      page = Math.ceil(totalDocuments.results.length / 4);
    }

    setTotalPages(page);
  };
  const searchService = () => {
    filterResult();
  };
  const handleChange = (e) => {
    const searched = e.currentTarget.value;
    console.log("Searchedd ::", searched);
    if (!searched) setSearchedService("");
    else setSearchedService(searched);
    console.log("searched service ::", searchedService);
    if (!e.currentTarget.value) {
      console.log("!e.currentTarget.value");
      console.log("e.currentTarget.value = ", e.currentTarget.value);

      filterResult();
    }
  };

  return (
    //editService-container classname of

    <article className="ServicePanel-wrapper ">
      <article className="searchBar-wrapper">
        <input
          className="search-Bar"
          type="text"
          placeholder="Search Service"
          value={searchedService}
          onChange={handleChange}
        />
        <button className="search-btn" onClick={searchService}>
          <FontAwesomeIcon icon={faSearch} style={{ marginRight: "0.6rem" }} />
          Search
        </button>
      </article>

      <article className="editService-container editService-style">
        <ToastContainer />

        <BasicModal updateService={updateService} />

        {/* // <article className="editService-container">
            // <article className="table-container">
            // <div className="doc-table-container"> */}

        <article className="table-responsive">
          <table className="table">
            <thead className="table-th assign-duty-th">
              <tr>
                <th scope="col">Full Name</th>
                <th scope="col">Date Of Birth</th>
                <th scope="col">Qualification</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hassan Ikram</td>
                <td>7-12-1992</td>
                <td>MBBS</td>
                <td>HassanIkram22@gmail.com</td>
                <td>+923483933065</td>
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
                  <EditModal />
                </td>
              </tr>
              <tr>
                <td>Muhammad Nabeel</td>
                <td>7-12-1990</td>
                <td>BDS</td>
                <td>Nabeel9@gmail.com</td>
                <td>+923422923015</td>
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
                  <EditModal />
                </td>
              </tr>
              <tr>
                <td>Muhammad Usman</td>
                <td>7-12-1988</td>
                <td>MBBS</td>
                <td>usman2@gmail.com</td>
                <td>+923080721356</td>
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
                  <EditModal />
                </td>
              </tr>
              <tr>
                <td>Umer Ayaz</td>
                <td>7-12-1987</td>
                <td>MBBS</td>
                <td>umer19@gmail.com</td>
                <td>+923034562331</td>
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
                  <EditModal />
                </td>
              </tr>
            </tbody>
          </table>
        </article>
        {/* </article> */}
        {/* {services.map((data) => (
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
                    ))} */}

        <article />

        {/* <Pagination
            count="10"
            // variant="outlined"
            color="secondary"
            size="large"
          /> */}

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
    </article>
  );
};

export default AdminStaff;
