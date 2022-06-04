import React from "react";
import Form from "../../Common/Form";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import axios from "axios";
import jwtDecode from "jwt-decode";

class AddService extends Form {
  state = {
    doctorForm: {
      serviceName: "",
      serviceOrgranization: "",
      servicePrice: "",
    },
    successMessage: "",
    services: [],
    organizations: [],
  };

  async componentDidMount() {
    const { data } = await axios.get("http://localhost:3000/api/organizations");
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    const doctorForm1 = { ...this.state.doctorForm };
    doctorForm1.serviceOrgranization = user.Organization.name;
    this.setState({ doctorForm: doctorForm1 });

    this.setState({ organizations: data.results });

    const { serviceData } = this.props;
    
    const doctorForm = { ...this.state.doctorForm };
    if (serviceData) {
      doctorForm.serviceName = serviceData.serviceName;
      doctorForm.serviceOrgranization = user.Organization.name;
      doctorForm.servicePrice = serviceData.servicePrice;
      this.setState({ doctorForm });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    const { serviceData, updateService } = this.props;

    if (serviceData) {
      const { doctorForm } = this.state;
      const updateServiceObj = {
        serviceName: doctorForm.serviceName,
        serviceOrgranization: serviceData.serviceOrgranization._id,
        servicePrice: doctorForm.servicePrice,
      };
      try {
        await axios.put(
          "http://localhost:3000/api/services/" + serviceData._id,
          updateServiceObj
        );
        updateService();
        toast.success("Service Updated");
      } catch (ex) {
        toast.error(ex.response.data);
      }

      return;
    }
    if (!errors) {
      const { doctorForm } = this.state;
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      const service = {
        serviceName: doctorForm.serviceName,
        serviceOrgranization: user.Organization._id,
        servicePrice: doctorForm.servicePrice,
      };
      try {
        await axios.post("http://localhost:3000/api/services", service);
        this.setState({ successMessage: "Service has been added" });
        toast.success("Service has been added");

        updateService();
      } catch (ex) { }
    }
  };
  schema = {
    serviceName: Joi.string().required().label("Service"),
    serviceOrgranization: Joi.string().required().label("Service Organization"),
    servicePrice: Joi.string().required().label("Price"),
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        <article className="doc-container ">
          {/* {successMessage && <ToastContainer />} */}
          <article className="card-signup doc-form addservice add-service-form-wrapper">
            <header>
              <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
                Add A Service
              </h1>
            </header>
            <article>{this.renderLabel("SERVICE NAME", "fname")}</article>
            <article className="add-service-input">
              {this.renderInput(
                "text",
                "serviceName",
                "serviceName",
                "Service Name"
              )}
            </article>
            <article>
              {this.renderLabel("Organization", "serviceOrganization")}
            </article>
            <article className="add-service-input">
              {/* {this.renderDropDown(
                "serviceOrgranization",
                this.state.organizations,
                "serviceOrgranization",
                "serviceOrgranization"
              )} */}
              {this.renderInput(
                "text",
                "serviceOrgranization",
                "serviceOrgranization",
                "",
                "",
                "",
                "readonly"
              )}
            </article>
            <article>{this.renderLabel("Price", "service_price")}</article>
            <article className="add-service-input">
              {this.renderInput(
                "number",
                "servicePrice",
                "servicePrice",
                "Service Price"
              )}
            </article>
            <article className="add-service-btn">
              {this.renderBtn("Add Service")}
            </article>
          </article>
        </article>
      </form>
    );
  }
}

export default AddService;
