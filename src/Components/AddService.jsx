import React from "react";
import Form from "./Common/Form";
import Joi from "joi-browser";

import { toast, ToastContainer } from "react-toastify";
import EditService from "./EditService";
import axios from "axios";

class AddService extends Form {
  state = {
    doctorForm: {
      serviceName: "",
      serviceOrgranization: "",
      servicePrice: "",
    },
    successMessage: "",
    services: [],
  };

  componentDidMount() {
    const { serviceData } = this.props;
    const doctorForm = { ...this.state.doctorForm };
    if (serviceData) {
      doctorForm.serviceName = serviceData.serviceName;
      doctorForm.serviceOrgranization = serviceData.serviceOrgranization;
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
      await axios.put(
        "http://localhost:3000/api/services" + "/" + serviceData._id,
        serviceData
      );
      updateService();
      return;
    }
    if (!errors) {
      const { doctorForm } = this.state;
      const service = {
        serviceName: doctorForm.serviceName,
        serviceOrgranization: doctorForm.serviceOrgranization,
        servicePrice: doctorForm.servicePrice,
      };
      try {
        await axios.post("http://localhost:3000/api/services", service);
        this.setState({ successMessage: "Service has been added" });
        toast.success("Service has been added");

        updateService();
      } catch (ex) {}
    }
  };
  schema = {
    serviceName: Joi.string().required().label("Service"),
    serviceOrgranization: Joi.string().required().label("Service Organization"),
    servicePrice: Joi.string().required().label("Price"),
  };

  render() {
    const { successMessage } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        <article className="doc-container">
          {successMessage && <ToastContainer />}
          <article className="card-signup doc-form addservice">
            <header>
              <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
                Add A Service
              </h1>
            </header>
            <article>{this.renderLabel("SERVICE NAME", "fname")}</article>
            <article>
              {this.renderInput(
                "text",
                "serviceName",
                "serviceName",
                "Service Name"
              )}
            </article>
            <article>
              {this.renderLabel("Organization", "service_organization")}
            </article>
            <article>
              {this.renderInput(
                "text",
                "serviceOrgranization",
                "serviceOrgranization",
                "Service Organization"
              )}
            </article>
            <article>{this.renderLabel("Price", "service_price")}</article>
            <article>
              {this.renderInput(
                "number",
                "servicePrice",
                "servicePrice",
                "Service Price"
              )}
            </article>
            {this.renderBtn("Add Service")}
          </article>
        </article>
      </form>
    );
  }
}

export default AddService;
