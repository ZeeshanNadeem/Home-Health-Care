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
  useEffect(async () => {
    const { data } = await axios.get(
      `http://localhost:3000/api/services?page=${pageSelected}&limit=${4}&searchedString=${searchedService}`
    );
    const { data: totalDocuments } = await axios.get(
      `http://localhost:3000/api/services`
    );
    let page = "";
    if (searchedService) {
      page = Math.ceil(data.results.length / 4);
    } else {
      page = Math.ceil(totalDocuments.results.length / 4);
    }

    setTotalPages(page);

    setServices(data.results);
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
      <React.Fragment>
        <article className="searchBar-wrapper">
          <input
            className="search-Bar"
            type="text"
            placeholder="Search Service"
            value={searchedService}
            onChange={handleChange}
          />
          <button className="search-btn" onClick={searchService}>
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

// class EditService extends React.Component {
//   state = {
//     services: [],
//     Totalpages: 1,
//     pageSelected: 1,
//   };

//   updateService = async () => {
//     const { data: services } = await axios.get(
//       "http://localhost:3000/api/services"
//     );
//     this.setState({ services });
//   };

//   async componentDidMount() {
//     const { pageSelected } = this.state;
//     const { data } = await axios.get(`http://localhost:3000/api/services?
//     page=${pageSelected}&limit=${3}`);
//     const page = Math.ceil(data.results.length / 3);
//     console.log("Total Pages ::: ", page);
//     if (page > 1) {
//       this.setState({ Totalpages: page });
//     }

//     this.setState({ services: data.results });
//     // console.log("Next", response.data.next);
//   }

//   // async componentDidUpdate() {
//   //   console.log("Page Selected ::", this.state.pageSelected);
//   //   const { pageSelected } = this.state;
//   //   const { data } = await axios.get(`http://localhost:3000/api/services?
//   //   page=${pageSelected}&limit=${3}`);
//   //   this.setState({ services: data.results });
//   // }

//   deleteService = async (id) => {
//     const { services } = this.state;
//     const orignalServices = services;
//     const newServices = services.filter((s) => s._id !== id);
//     this.setState({ services: newServices });

//     try {
//       await axios.delete("http://localhost:3000/api/services" + "/" + id);
//       toast.success("Deleted");
//       const { data: services } = await axios.get(
//         "http://localhost:3000/api/services"
//       );
//     } catch (ex) {
//       if (ex.response && ex.response.status === 404) {
//         toast.error("This post has already been deleted");
//       }
//       this.setState({ services: orignalServices });
//     }
//   };

//   render() {
//     const { services } = this.state;

//     return (
//       //editService-container classname of
//       <article className="ServicePanel-wrapper ">
//         <React.Fragment>
//           <article className="editService-container editService-style">
//             <ToastContainer />
//             <BasicModal updateService={this.updateService} />
//             {services.length > 0 && (
//               // <article className="editService-container">
//               // <article className="table-container">
//               // <div className="doc-table-container">
//               <React.Fragment>
//                 <article className="table-responsive">
//                   <table className="table">
//                     <thead className="table-th assign-duty-th">
//                       <tr>
//                         <th scope="col">Service Name</th>
//                         <th scope="col">Service Organization</th>
//                         <th scope="col">Service Cost</th>
//                         <th scope="col"></th>
//                         <th scope="col"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {services.map((data) => (
//                         <tr key={data._id}>
//                           <td>{data.serviceName}</td>
//                           <td>{data.serviceOrgranization}</td>
//                           <td>{data.servicePrice}</td>
//                           <td>
//                             <Button
//                               variant="contained"
//                               onClick={() => {
//                                 this.deleteService(data._id);
//                               }}
//                             >
//                               <FontAwesomeIcon
//                                 icon={faTrash}
//                                 style={{ marginRight: "0.6rem" }}
//                               />
//                               Delete
//                             </Button>
//                           </td>
//                           <td>
//                             <EditModal
//                               serviceData={data}
//                               updateService={this.updateService}
//                             />
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </article>
//               </React.Fragment>
//             )}
//           </article>

//           {/* <Pagination
//             count="10"
//             // variant="outlined"
//             color="secondary"
//             size="large"
//           /> */}
//         </React.Fragment>
//         <div className="pagination">
//           <Pagination
//             count={this.state.Totalpages}
//             // variant="outlined"
//             color="secondary"
//             defaultPage={1}
//             size="large"
//             showFirstButton
//             showLastButton
//             onChange={(event, value) => this.setState({ pageSelected: value })}
//           />
//         </div>
//         {/* <Paginating count={10}
//         updateService={this.updateService}
//         /> */}
//       </article>
//     );
//   }
// }

// export default EditService;

// const EditService = () => {
//   const [services, setServices] = useState([]);
//   useEffect(async () => {
//     const { data: services } = await axios.get(
//       "http://localhost:3000/api/services"
//     );
//     setServices({ services });
//     console.log("Services got ", services);
//   }, []);
//   return (
//     <article className="editService-container">
//       <article className="editService-container">
//         <article className="table-container">
//           <div className="doc-table-container">
//             <table className="table doc-table">
//               <thead className="table-th assign-duty-th">
//                 <tr>
//                   <th scope="col">#</th>
//                   <th scope="col">Service Name</th>

//                   <th>Service Organization</th>
//                   <th>Service Cost</th>
//                   <th></th>
//                   <th></th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {services.map((data) => (
//                   <tr>
//                     <td>{data.serviceName}</td>
//                     <td>{data.serviceOrganization}</td>
//                     <td>{data.servicePrice}</td>
//                     <td>
//                       <BasicModal />
//                     </td>
//                     <td>
//                       <Button variant="contained">
//                         <FontAwesomeIcon
//                           icon={faTrash}
//                           style={{ marginRight: "0.6rem" }}
//                         />
//                         Delete
//                       </Button>
//                     </td>
//                     <td>
//                       <Button variant="contained">
//                         <FontAwesomeIcon
//                           icon={faEdit}
//                           style={{ marginRight: "0.6rem" }}
//                         />
//                         Edit
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </article>
//       </article>
//     </article>
//   );
// };

// export default EditService;
