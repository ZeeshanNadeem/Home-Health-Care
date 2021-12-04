import React, { Component } from "react";
import Form from "../../Common/Form";
import config from "../../Api/config.json";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Joi from "joi-browser";

class AddOrganization extends Form {
  state = {
    doctorForm: {
      name: "",
    },
  };

  componentDidMount() {
    const { organizationData, reloadOrganzations } = this.props;
    if (organizationData) {
      const doctorForm = { ...this.state.doctorForm };

      doctorForm.name = organizationData.name;
      this.setState({ doctorForm });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    const { organizationData, reloadOrganzations } = this.props;

    if (organizationData) {
      const { doctorForm } = this.state;

      try {
        await axios.put(
          "http://localhost:3000/api/organizations" +
            "/" +
            organizationData._id,
          { name: doctorForm.name }
        );
        reloadOrganzations();
        toast.success("Organization Updated");
      } catch (ex) {
        toast.error("Something went wrong");
      }

      return;
    }

    if (!errors) {
      const { name } = this.state.doctorForm;
      const { reloadOrganzations } = this.props;
      await axios.post(config.apiEndPoint + "/organizations", { name: name });
      reloadOrganzations();
      toast.success("Organization Added!");
    } else {
      toast.error("Something went wrong");
    }
  };
  schema = {
    name: Joi.string().required().label("Organization"),
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <article className="add-org-wrapper">
          <article className="card-signup doc-form addservice addOrg">
            <header>
              <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn label">
                Add An Organization
              </h1>
            </header>
            <article className="app-admin-panel-label">
              {this.renderLabel("Organization Name", "organization Name")}
            </article>
            <article>
              {this.renderInput(
                "text",
                "name",
                "name",
                "Enter Organization Name"
              )}
            </article>
            <article className="addStaff-group-alignment addStaff-btn add-org">
              {this.renderBtn("ADD Organzation")}
            </article>
          </article>
        </article>
      </form>
    );
  }
}

export default AddOrganization;
