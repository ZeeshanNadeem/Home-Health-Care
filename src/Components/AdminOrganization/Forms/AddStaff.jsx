import React from "react";
import axios from "axios";
import Form from "../../Common/Form";
import Joi from "joi-browser";
import Alert from "@material-ui/lab/Alert";
import { toast, ToastContainer } from "react-toastify";
import config from "../../Api/config.json";
class NurseForm extends Form {
  state = {
    doctorForm: {
      fullName: "",
      // dateOfBirth: "",
      email: "",
      password: "",
      staffType: "",
      qualification: "",
      availabilityFrom: "",
      availabilityTo: "",
      availabileDayFrom: "",
      availabileDayTo: "",
      email: "",
      password: "",
      // email: "",
      phone: "",
    },
    qualification: [],
    days: ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"],

    serviceType: [],
  };
  schema = {
    fullName: Joi.string().min(5).max(50).required().label("FullName"),
    // dateOfBirth: Joi.string().required().label("Date of Birth"),
    email: Joi.string().min(5).max(255).required().email().label("Email"),
    password: Joi.string().min(5).max(255).required().label("Password"),
    staffType: Joi.string().required().label("Staff Type"),
    qualification: Joi.string().required().label("Qualification"),
    availabilityFrom: Joi.string().required().label("Availability From"),
    availabilityTo: Joi.string().required().label("Availability To"),
    availabileDayFrom: Joi.string().required().label("Available Day"),
    availabileDayTo: Joi.string().required().label("Available Day"),
    // email: Joi.string().required().label("Email"),
    phone: Joi.number().required().label("Phone No"),
  };

  //Editing Data
  updateStaffMember = async () => {
    const { staffMemberData, RefreshStaffMembers } = this.props;
    const { doctorForm } = this.state;
    const updateStaff = {
      fullName: doctorForm.fullName,
      // dateOfBirth: doctorForm.dateOfBirth,
      email: doctorForm.email,
      password: doctorForm.password,
      staffTypeID: doctorForm.staffType,
      qualificationID: doctorForm.qualification,
      availabilityFrom: doctorForm.availabilityFrom,
      availabilityTo: doctorForm.availabilityTo,
      availabileDayFrom: doctorForm.availabileDayFrom,
      availabileDayTo: doctorForm.availabileDayTo,
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
      // dateOfBirth: doctorForm.dateOfBirth,
      email: doctorForm.email,
      password: doctorForm.password,
      staffTypeID: doctorForm.staffType,
      qualificationID: doctorForm.qualification,
      phone: doctorForm.phone,
      availabilityFrom: doctorForm.availabilityFrom,
      availabilityTo: doctorForm.availabilityTo,
      availabileDayFrom: doctorForm.availabileDayFrom,
      availabileDayTo: doctorForm.availabileDayTo,
      // email: doctorForm.email,
    };
    //  const user = {
    //    staffTypeID: doctorForm.staffType,
    //    qualificationID: doctorForm.qualification,
    //    phone: doctorForm.phone,
    //    availabilityFrom: doctorForm.availabilityFrom,
    //    availabilityTo: doctorForm.availabilityTo,
    //    availabileDayFrom: doctorForm.availabileDayFrom,
    //    availabileDayTo: doctorForm.availabileDayTo,
    //  };
    try {
      const { data: staffAdded } = await axios.post(
        "http://localhost:3000/api/staff",
        addStaffMember
      );

      RefreshStaffMembers();
      const userObj = {};
      userObj.fullName = addStaffMember.fullName;
      userObj.email = addStaffMember.email;
      userObj.password = addStaffMember.password;
      userObj.staffMemberID = staffAdded._id;
      await axios.post(config.apiEndPoint + "/user", userObj);
    } catch (ex) {
      toast.error(ex.response.data);
      return;
    }
    toast.success("Staff member Added!");
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
    console.log("Prepoulations obj::", staffMemberData);
    if (staffMemberData) {
      doctorForm.fullName = staffMemberData.fullName;
      // doctorForm.dateOfBirth = staffMemberData.dateOfBirth;
      doctorForm.email = staffMemberData.email;
      doctorForm.password = staffMemberData.password;
      doctorForm.staffType = staffMemberData.staffType._id;
      doctorForm.qualification = staffMemberData.qualification._id;
      doctorForm.availabilityFrom = staffMemberData.availabilityFrom;
      doctorForm.availabilityTo = staffMemberData.availabilityTo;
      doctorForm.availabileDayFrom = staffMemberData.availabileDayFrom;
      doctorForm.availabileDayTo = staffMemberData.availabileDayTo;
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
          <div className="card-signup doc-form add-staff-form">
            <header>
              <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
                Add A Staff Member
              </h1>
            </header>

            <article className="addStaff-Fields-grouping add-staff-input-styling">
              <article className="one-group-first-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("FULL NAME", "fname")}
                </article>
                <article className="addStaff-input">
                  {this.renderInput("text", "fname", "fullName", "Full Name")}
                </article>
              </article>
              <article className="one-group-second-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Qualification", "qualification")}
                </article>
                <article className="input-addStaff">
                  {this.renderDropDown(
                    "Qualification",
                    qualification,
                    "docQualification",
                    "qualification"
                  )}
                </article>
              </article>
              {/* <article className="one-group-second-item addStaff-group-alignment">
                <article>{this.renderLabel("Date of Birth", "dob")}</article>
                <article className="add-staff-dob">
                  {this.renderInput(
                    "date",
                    "dob",
                    "dateOfBirth",
                    "Date of Birth"
                  )}
                </article>
              </article> */}
            </article>

            <article className="addStaff-Fields-grouping add-staff-input-styling">
              <article className="one-group-first-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Email", "Email")}
                </article>
                <article className="addStaff-input">
                  {this.renderInput("text", "email", "email", "email")}
                </article>
              </article>

              <article className="one-group-second-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Password", "Password")}
                </article>
                <article className="input-addStaff">
                  {this.renderInput(
                    "password",
                    "password",
                    "password",
                    "password"
                  )}
                </article>
              </article>
            </article>

            <article className="addStaff-Fields-grouping">
              <article className="one-group-first-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Staff Type", "staff")}
                </article>
                <article className="input-addStaff">
                  {this.renderDropDown(
                    "Staff",
                    serviceType,
                    "staff",
                    "staffType"
                  )}
                </article>
              </article>
              <article className="one-group-second-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Phone No", "phoneno")}
                </article>
                <article className="input-addStaff">
                  {this.renderInput("number", "phoneno", "phone", "Phone No")}
                </article>
              </article>
            </article>

            <article className="addStaff-Fields-grouping">
              <article className="one-group-first-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Available From", "availabilityFrom")}
                </article>
                <article className="addStaff-special-fields">
                  {this.renderInput(
                    "time",
                    "availabilityFrom",
                    "availabilityFrom",
                    "availabilityFrom"
                  )}
                </article>
              </article>

              <article className="one-group-second-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Available To", "availabilityTo")}
                </article>
                <article className="addStaff-special-fields">
                  {this.renderInput(
                    "time",
                    "availabilityTo",
                    "availabilityTo",
                    "availabilityTo"
                  )}
                </article>
              </article>
            </article>

            <article className="addStaff-Fields-grouping">
              <article className="addStaff-input addStaff-group-alignment one-group-first-item">
                <article className="label-addStaff">
                  {this.renderLabel(
                    "Availabile Day From",
                    "availabilityweekFrom"
                  )}
                </article>
                <article className="addStaff-special-fields">
                  {this.renderDropDown(
                    "availabileDayFrom",
                    this.state.days,
                    "availabileDayFrom",
                    "availabileDayFrom"
                  )}
                </article>
              </article>

              <article className="addStaff-input addStaff-group-alignment one-group-second-item">
                <article className="label-addStaff">
                  {this.renderLabel("Available Day To", "availabilityweekTo")}
                </article>
                <article className="addStaff-special-fields">
                  {this.renderDropDown(
                    "availabileDayTo",
                    this.state.days,
                    "availabileDayTo",
                    "availabileDayTo"
                  )}
                </article>
              </article>
            </article>

            {/* <article>{this.renderLabel("Email", "email")}</article>
            <article>
              {this.renderInput("text", "email", "email", "Email")}
            </article> */}

            <article className="addStaff-group-alignment addStaff-btn">
              {this.renderBtn("Save Staff Member")}
            </article>
          </div>
        </div>
      </form>
    );
  }
}

export default NurseForm;
