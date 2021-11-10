import React from "react";
import axios from "axios";
import Form from "./Common/Form";
import Joi from "joi-browser";
import Alert from "@material-ui/lab/Alert";
import { toast, ToastContainer } from "react-toastify";

class NurseForm extends Form {
  state = {
    doctorForm: {
      fullName: "",
      dateOfBirth: "",
      staffType: "",
      qualification: "",
      email: "",
      phone: "",
    },
    qualification: [],

    serviceType: [],
  };
  schema = {
    fullName: Joi.string().required().label("Full Name"),
    dateOfBirth: Joi.string().required().label("Date of Birth"),
    staffType: Joi.string().required().label("Staff Type"),
    qualification: Joi.string().required().label("Qualification"),
    email: Joi.string().required().label("Email"),
    phone: Joi.number().required().label("Phone No"),
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (!errors) {
      const { doctorForm } = this.state;
      console.log("Doctor Form:::!!", doctorForm);
      const doctorToPost = {
        fullName: doctorForm.fullName,
        dateOfBirth: doctorForm.dateOfBirth,
        staffTypeID: doctorForm.staffType,
        qualificationID: doctorForm.qualification,
        email: doctorForm.email,
        phone: doctorForm.phone,
      };

      try {
        const { updateService } = this.props;
        console.log("Nurse Form update :", updateService);
        const { data: doctorPosted } = await axios.post(
          "http://localhost:3000/api/staff",
          doctorToPost
        );
        updateService();
      } catch (ex) {
        console.log("Catch :::", ex);
        toast.error("Something went wrong..");
        return;
      }
      console.log("Error :::");
      toast.success("Staff member has been saved!");
      return;
    }
    toast.error("Something went wrong..");
  };
  async componentDidMount() {
    const { data: qualification } = await axios.get(
      "http://localhost:3000/api/qualification"
    );

    const { data: serviceType } = await axios.get(
      "http://localhost:3000/api/staffType"
    );
    const { serviceData } = this.props;

    const doctorForm = { ...this.state.doctorForm };
    if (serviceData) {
      doctorForm.fullName = serviceData.fullName;
      doctorForm.dateOfBirth = serviceData.dateOfBirth;
      doctorForm.staffType = serviceData.staffType._id;
      doctorForm.qualification = serviceData.qualification._id;
      doctorForm.email = serviceData.email;
      doctorForm.phone = serviceData.phone;
      this.setState({ doctorForm });
    }
    this.setState({ qualification, serviceType });
  }
  render() {
    const { qualification, successMessage, serviceType } = this.state;
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
              {this.renderInput("text", "fname", "fullName", "Full Name")}
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

            <article>{this.renderLabel("Email", "email")}</article>
            <article>
              {this.renderInput("text", "email", "email", "Email")}
            </article>

            <article>{this.renderLabel("Phone No", "phoneno")}</article>
            <article>
              {this.renderInput("number", "phoneno", "phone", "Phone No")}
            </article>

            {this.renderBtn("Save Staff Member")}
          </div>
        </div>
      </form>
    );
  }
}

export default NurseForm;
