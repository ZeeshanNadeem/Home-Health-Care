import React from "react";
import Form from "../../Common/Form";
import NavBar from "../../HomePage/NavBar";
import signingUp from "../SigningUp/SignUp";
import Joi from "joi-browser";
import "animate.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import config from "../../Api/config.json";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "antd/lib/form/Form";
class SignUpAsOrganization extends Form {
  state = {
    doctorForm: {
      fullName: "",
      // dateOfBirth: "",
      email: "",
      password: "",
      // price: "",
      // phone: "",
      isOrganizationAdmin: true,
      OrganizationID: "",
      serviceOrg_: "",
      qualification: "",
      // selectedFile: null,
    },
    errors: {},
    selectedFile: null,
    organizations: [],
    services: ["Nursing", "Physiotherapy", "Baby Vacination"],
    qualification: [],
    daysAvailable: [
      {
        name: "MON",
        value: false,
      },
      {
        name: "TUE",
        value: false,
      },
      {
        name: "WED",
        value: false,
      },
      {
        name: "THRU",
        value: false,
      },
      { name: "FRI", value: false },
      { name: "SAT", value: false },
      { name: "SUN", value: false },
    ],
    slotTime: [
      {
        time: "12AM to 3AM",
        name: "12 AM to 3 AM",
        value: false,
      },
      {
        time: "3AM to 6AM",
        name: "3 AM to 6 AM",
        value: false,
      },

      {
        time: "6AM to 9AM",
        value: false,
        name: "6 AM to 9 AM",
      },
      {
        time: "9AM to 12PM",
        value: false,
        name: "9 AM to 12 PM",
      },
      {
        time: "12PM to 3PM",
        value: false,
        name: "12 PM to 3 PM",
      },
      {
        time: "3PM to 6PM",
        value: false,
        name: "3 PM to 6 PM",
      },
      {
        time: "6PM to 9PM",
        value: false,
        name: "6 PM to 9 PM",
      },
      {
        time: "9PM to 12AM",
        value: false,
        name: "9 PM to 12 AM",
      },
    ],
  };

  schema = {
    fullName: Joi.string().min(5).max(50).required(),
    // dateOfBirth: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isOrganizationAdmin: Joi.boolean().required(),
    OrganizationID: Joi.string().required(),
    selectedFile:
      this.state.OrganizationID === "61d5bc5c69b35ef18754dc9a"
        ? Joi.string().required().label("Resume")
        : Joi.string(),
    // price: Joi.string().required(),

    // phone: Joi.string().required(),
    //61d5bc5c69b35ef18754dc9a
    serviceOrg_:
      this.state.OrganizationID === "61d5bc5c69b35ef18754dc9a"
        ? Joi.string().required()
        : Joi.string(),
    qualification:
      this.state.OrganizationID === "61d5bc5c69b35ef18754dc9a"
        ? Joi.string().required()
        : Joi.string(),
    price:
      this.state.OrganizationID === "61d5bc5c69b35ef18754dc9a"
        ? Joi.string().required()
        : Joi.string(),
  };

  schemaFile = yup.object().shape({
    selectedFile: yup
      .mixed()
      .required("Resume needed")
      .test("fileSize", "This file is too large", (value) => {
        return value && value[0].size <= 9000000;
      }),
  });

  async componentDidMount() {
    const { data } = await axios.get(config.apiEndPoint + "/organizations");
    const { data: qualification } = await axios.get(
      config.apiEndPoint + "/qualification"
    );
    this.setState({ organizations: data.results, qualification });
  }

  // setFile = (e) => {
  //   this.setState({ selectedFile: e.target.files[0] });
  // };

  // onChange = (e) => {
  //   // setFile(e.target.files[0]);
  //   this.setState({ selectedFile: e.target.files[0] });
  //   // setFilename(e.target.files[0].name);
  // };

  handleSubmit = async (e) => {
    e.preventDefault();

    global.staffDetails = this.state.doctorForm;

    const formData = new FormData();
    formData.append("CV", this.state.selectedFile);
    formData.append("fullName", this.state.doctorForm.fullName);
    formData.append("email", this.state.doctorForm.email);
    formData.append("password", this.state.doctorForm.password);
    formData.append(
      "isOrganizationAdmin",
      this.state.doctorForm.isOrganizationAdmin
    );
    formData.append("OrganizationID", this.state.OrganizationID);

    global.selectedFile = this.state.doctorForm.selectedFile;

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (!errors) {
      try {
        // global.formData = formData;
        // global.staffDetails = this.state.doctorForm;
        // this.state.doctorForm = formData;
        // const response = await signingUp(this.state.doctorForm);
        // global.data = this.state.doctorForm;

        const response = await signingUp(formData);
        localStorage.setItem("token", response.headers["x-auth-token"]);

        global.userID = response.data._id;
        global.formData = formData;
        global.staffDetails = this.state.doctorForm;
        this.props.history.push("/signUp/details");

        // window.location = "/Home";
        // const { serviceOrg_, qualification, OrganizationID } =
        //   this.state.doctorForm;
        // if (serviceOrg_ && qualification) {
        //   const obj = {};
        //   obj.serviceName = serviceOrg_;
        //   obj.serviceOrgranization = OrganizationID;
        //   // obj.servicePrice = price;
        //   // obj.userID = response.data._id;
        //   // await axios.post(config.apiEndPoint + "/services", obj);
        //   global.serviceObj = obj;
        //   global.staffDetails = this.state.doctorForm;
        //   this.props.history.push("/signUp/details");
        // }
        // if (!price && !serviceOrg_ && !qualification) window.location = "/Home";
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          const error = { ...this.state.errors };

          error.email = ex.response.data;

          this.setState({ errors: error });
        }
      }
    }
  };
  render() {
    const year = new Date().getFullYear();
    const dobSignUpMaxDate = year + "-12-31";

    return (
      <React.Fragment>
        <NavBar />
        <ToastContainer />
        <form onSubmit={this.handleSubmit} enctype="multipart/form-data">
          <article className="signup-page signup-org-admin ">
            <main className="org-signup org card-signup signup-style-org animate__animated animate__fadeInLeft">
              <header>
                <h1
                  className="label-signup-org sign-up-header-text animate__animated animate__zoomIn"
                  style={{ margin: "0" }}
                >
                  Sign Up
                </h1>
              </header>
              <article className="signup-org-group">
                <article>
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("FULL NAME", "fname")}
                  </article>
                  <article className="txtField-signup-org">
                    {this.renderInput("text", "fullName", "fullName")}
                  </article>
                </article>
                <article className="second-item">
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("Email", "email")}
                  </article>
                  <article className="txtField-signup-org">
                    {this.renderInput("text", "email", "email")}
                  </article>
                </article>
              </article>
              {/* <article
                className="signup-dob signup-label"
                style={{ margin: "0" }}
              >
                {this.renderLabel("Date of Birth", "dob")}
              </article>
              <article>
                {this.renderInput(
                  "date",
                  "dateOfBirth",
                  "dateOfBirth",
                  "",
                  "",
                  dobSignUpMaxDate
                )}
              </article> */}

              <article className="signup-org-group">
                <article>
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("Password", "password")}
                  </article>
                  <article className="txtField-signup-org">
                    {this.renderInput("password", "password", "password")}
                  </article>
                </article>
                {/* <article className="signup-label">
                    {this.renderLabel("Confirm Password", "email")}
                  </article>
                  <article>{this.renderInput("text", "email", "email")}</article> */}
                <article className="second-item dropdown-second-item">
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("Organization", "organization")}
                  </article>
                  <article className="txtField-signup-org">
                    {this.renderDropDown(
                      "service For",
                      this.state.organizations,
                      "OrganizationID",
                      "OrganizationID",
                      "Select Your Organization"
                    )}
                  </article>
                </article>
              </article>
              {this.state.doctorForm.OrganizationID ===
                "61d5bc5c69b35ef18754dc9a" && (
                <article
                  // style={{ marginTop: "0.5rem" }}
                  className="signup-org-group servies-org"
                >
                  <article>
                    <article style={{ margin: "0" }}>
                      {this.renderLabel("Service", "service")}
                    </article>
                    <article>
                      {this.renderDropDown(
                        "",
                        this.state.services,
                        "serviceOrg_",
                        "serviceOrg_",
                        "Please Select a Service"
                      )}
                    </article>
                  </article>
                  <article>
                    <article
                      className="second-item"
                      // style={{ marginTop: "1rem" }}
                    ></article>
                  </article>
                  <article>
                    <article className="signup-label" style={{ margin: "0" }}>
                      {this.renderLabel("Qualification", "Qualification")}
                    </article>
                    <article className="txtField-signup-org">
                      {this.renderDropDown(
                        "service For",
                        this.state.qualification,
                        "qualification",
                        "qualification",
                        "Your Qualification?"
                      )}
                    </article>
                  </article>
                </article>
              )}

              {this.state.doctorForm.OrganizationID ===
                "61d5bc5c69b35ef18754dc9a" && (
                <article>
                  <article
                    className="txt-upload-label signup-label"
                    style={{ margin: "0" }}
                  >
                    {this.renderLabel("Upload Your Resume", "Resume")}
                  </article>
                  <input
                    className="txt-upload"
                    name="selectedFile"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={this.onChange}
                  ></input>

                  {/* {this.renderFile(
                    "file",
                    "selectedFile",
                    "selectedFile",
                    ".pdf,.docx"
                  )} */}
                </article>
              )}
              {/* <article className="ChkBox-signup">
                {this.renderCheckBox(
                  "checkbox",
                  "isOrganizationAdmin",
                  "isOrganizationAdmin",
                  "Request To Be an Organization Admin"
                )}
              </article> */}

              <article className="btn-orgSignUp org-btn signup-page-btn">
                {this.renderBtn("Sign Up")}
              </article>
              {/* <a href="#" className="google btn">
                  <i className="fa fa-google fa-fw"></i> SignUp with Google
                </a> */}
            </main>
          </article>
        </form>
      </React.Fragment>
    );
  }
}

export default SignUpAsOrganization;
