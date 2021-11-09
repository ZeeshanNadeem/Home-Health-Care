import React from "react";
import axios from "axios";
import Form from "./Common/Form";
import Joi from "joi-browser";
import Alert from "@material-ui/lab/Alert";
import { toast, ToastContainer } from "react-toastify";

class NurseForm extends Form {
  state = {
    doctorForm: {
      fullname: "",
      dateOfBirth: "",
      staffType: "",
      organization: "",
      qualification: "",

      phoneNo: "",
    },
    qualification: [],
    organization: [],
    serviceType: [],
  };
  schema = {
    fullname: Joi.string().required().label("Full Name"),
    dateOfBirth: Joi.string().required().label("Date of Birth"),
    staffType: Joi.string().required().label("Staff Type"),
    organization: Joi.string().required().label("Organizaton"),
    qualification: Joi.string().required().label("Qualification"),

    phoneNo: Joi.number().required().label("Phone No"),
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (!errors) {
      const { doctorForm } = this.state;
      const doctorToPost = {
        fullName: doctorForm.fullname,
        dateOfBirth: doctorForm.dateOfBirth,
        staffTypeID: doctorForm.staffType,
        organizationID: doctorForm.organization,
        qualificationID: doctorForm.qualification,
        phone: doctorForm.phoneNo,
      };

      const { data: doctorPosted } = await axios.post(
        "http://localhost:3000/api/staff",
        doctorToPost
      );
      toast.success("Staff member has been saved!");
      return;
    }
    toast.error("Something went wrong..");
  };
  async componentDidMount() {
    const { data: qualification } = await axios.get(
      "http://localhost:3000/api/qualification"
    );
    const { data: organization } = await axios.get(
      "http://localhost:3000/api/organization"
    );
    const { data: serviceType } = await axios.get(
      "http://localhost:3000/api/staffType"
    );
    this.setState({ qualification, organization, serviceType });
  }
  render() {
    const { qualification, successMessage, organization, serviceType } =
      this.state;
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        <ToastContainer />

        <div className="doc-container">
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <div className="card-signup doc-form">
            <header>
              <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
                Add A Staff Member
              </h1>
            </header>
            <article>{this.renderLabel("FULL NAME", "fname")}</article>
            <article>
              {this.renderInput("text", "fname", "fullname", "Full Name")}
            </article>
            <article>{this.renderLabel("Date of Birth", "dob")}</article>
            <article>
              {this.renderInput("date", "dob", "dateOfBirth", "Date of Birth")}
            </article>

            <article>{this.renderLabel("Staff Type", "staff")}</article>
            <article>
              {this.renderDropDown("Staff", serviceType, "staff", "staffType")}
            </article>

            <article>
              {this.renderLabel("Organization", "organization")}
            </article>
            <article>
              {this.renderDropDown(
                "Organization",
                organization,
                "organization",
                "organization"
              )}
            </article>

            <article>
              {this.renderLabel("Qualification", "qualification")}
            </article>
            <article>
              {this.renderDropDown(
                "Qualification",
                qualification,
                "docQualification",
                "qualification"
              )}
            </article>

            <article>{this.renderLabel("Phone No", "phoneno")}</article>
            <article>
              {this.renderInput("number", "phoneno", "phoneNo", "Phone No")}
            </article>

            {this.renderBtn("Save Staff Member")}
          </div>
        </div>
      </form>
    );
  }
}

export default NurseForm;
