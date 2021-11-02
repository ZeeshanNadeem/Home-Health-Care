import React from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EditModal from "./MoodleForEdit";

import BasicModal from "../AddServiceModle";
import AddService from "./AddService";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
class EditService extends React.Component {
  state = {
    services: [],
  };

  updateService = async () => {
    const { data: services } = await axios.get(
      "http://localhost:3000/api/services"
    );
    this.setState({ services });
  };

  async componentDidMount() {
    const { data: services } = await axios.get(
      "http://localhost:3000/api/services"
    );
    this.setState({ services });
  }

  deleteService = async (id) => {
    const { services } = this.state;
    const orignalServices = services;
    const newServices = services.filter((s) => s._id !== id);
    this.setState({ services: newServices });

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
      this.setState({ services: orignalServices });
    }
  };

  render() {
    const { services } = this.state;

    return (
      //editService-container classname of
      <article className="editService-container">
        <ToastContainer />
        <BasicModal updateService={this.updateService} />

        {services.length > 0 && (
          // <article className="editService-container">
          // <article className="table-container">
          // <div className="doc-table-container">
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
                          this.deleteService(data._id);
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
                        updateService={this.updateService}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          // </div>
          // </article>
          // </article>
        )}
      </article>
    );
  }
}

export default EditService;

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
