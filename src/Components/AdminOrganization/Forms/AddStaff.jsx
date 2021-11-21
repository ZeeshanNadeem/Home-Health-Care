import React from "react";
import axios from "axios";
import Form from "../../Common/Form";
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
      availabilityForm: "",
      availabilityTo: "",
      // email: "",
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
    availabilityForm: Joi.string().required().label("Availability From"),
    availabilityTo: Joi.string().required().label("Availability To"),
    // email: Joi.string().required().label("Email"),
    phone: Joi.number().required().label("Phone No"),
  };

  //Editing Data
  updateStaffMember = async () => {
    const { staffMemberData, RefreshStaffMembers } = this.props;
    const { doctorForm } = this.state;
    const updateStaff = {
      fullName: doctorForm.fullName,
      dateOfBirth: doctorForm.dateOfBirth,
      staffTypeID: doctorForm.staffType,
      qualificationID: doctorForm.qualification,
      availabilityForm: doctorForm.availabilityForm,
      availabilityTo: doctorForm.availabilityTo,
      // email: doctorForm.email,
      phone: doctorForm.phone,
    };

    try {
      await axios.put(
        "http://localhost:3000/api/staff" + "/" + staffMemberData._id,
        updateStaff
      );
      RefreshStaffMembers();
      toast.success("Staff Member Updated");
    } catch (ex) {
      toast.error("Something went wrong");
    }
  };

  addAStaffMember = async () => {
    const { doctorForm } = this.state;
    const { RefreshStaffMembers } = this.props;

    const addStaffMember = {
      fullName: doctorForm.fullName,
      dateOfBirth: doctorForm.dateOfBirth,
      staffTypeID: doctorForm.staffType,
      qualificationID: doctorForm.qualification,
      phone: doctorForm.phone,
      availabilityForm: doctorForm.availabilityForm,
      availabilityTo: doctorForm.availabilityTo,
      // email: doctorForm.email,
    };

    try {
      console.log("staff Member :", addStaffMember);
      const { data: doctorPosted } = await axios.post(
        "http://localhost:3000/api/staff",
        addStaffMember
      );
      RefreshStaffMembers();
    } catch (ex) {
      console.log("Ex:", ex);
      toast.error("Something went wrong..");
      return;
    }
    toast.success("Staff member has been added!");
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    const { staffMemberData } = this.props;
    if (staffMemberData) {
      this.updateStaffMember();
      return;
    }

    if (!errors) {
      this.addAStaffMember();
      return;
    }
    console.log("Error!!!", errors);
    toast.error("Something went wrong..");
  };
  async componentDidMount() {
    const { data: qualification } = await axios.get(
      "http://localhost:3000/api/qualification"
    );

    const { data: serviceType } = await axios.get(
      "http://localhost:3000/api/staffType"
    );
    const { staffMemberData } = this.props;

    const doctorForm = { ...this.state.doctorForm };

    //Pre-Populating Staff Form
    if (staffMemberData) {
      doctorForm.fullName = staffMemberData.fullName;
      doctorForm.dateOfBirth = staffMemberData.dateOfBirth;
      doctorForm.staffType = staffMemberData.staffType._id;
      doctorForm.qualification = staffMemberData.qualification._id;
      doctorForm.availabilityForm = staffMemberData.availabilityForm;
      doctorForm.availabilityTo = staffMemberData.availabilityTo;
      doctorForm.phone = staffMemberData.phone;
      // doctorForm.email = staffMemberData.email;

      this.setState({ doctorForm });
    }
    this.setState({ qualification, serviceType });
  }
  render() {
    const { qualification, successMessage, serviceType } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        {/* <ToastContainer /> */}

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
            <article>
              {this.renderLabel("Availability From", "availabilityForm")}
            </article>
            <article>
              {this.renderInput(
                "time",
                "availabilityForm",
                "availabilityForm",
                "availabilityForm",
                "3600000"
              )}
            </article>

            <article>
              {this.renderLabel("Availability To", "availabilityTo")}
            </article>
            <article>
              {this.renderInput(
                "time",
                "availabilityTo",
                "availabilityTo",
                "availabilityTo",
                "3600000"
              )}
            </article>

            {/* <article>{this.renderLabel("Email", "email")}</article>
            <article>
              {this.renderInput("text", "email", "email", "Email")}
            </article> */}

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
