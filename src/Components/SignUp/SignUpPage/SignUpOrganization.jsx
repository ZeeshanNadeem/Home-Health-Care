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
class SignUpAsOrganization extends Form {
  state = {
    doctorForm: {
      fullName: "",
      dateOfBirth: "",
      email: "",
      password: "",
      isOrganizationAdmin: true,
      OrganizationID: "",
    },
    errors: {},
    organizations: [],
  };

  schema = {
    fullName: Joi.string().min(5).max(50).required(),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isOrganizationAdmin: Joi.boolean().required(),
    OrganizationID: Joi.string().required(),
  };

  async componentDidMount() {
    const { data } = await axios.get(config.apiEndPoint + "/organizations");
    this.setState({ organizations: data.results });
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (!errors) {
      try {
        const response = await signingUp(this.state.doctorForm);
        localStorage.setItem("token", response.headers["x-auth-token"]);
        window.location = "/Home";
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          const error = { ...this.state.errors };

          error.email = ex.response.data;
          toast.error(ex.response.data);
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
        <form onSubmit={this.handleSubmit}>
          <article className="signup-page signup-org-admin">
            <main className="org card-signup signup-style-org animate__animated animate__fadeInLeft">
              <header>
                <h1 className="sign-up-header-text animate__animated animate__zoomIn">
                  Sign Up
                </h1>
              </header>
              <article className="signup-label">
                {this.renderLabel("FULL NAME", "fname")}
              </article>
              <article>
                {this.renderInput("text", "fullName", "fullName")}
              </article>
              <article className="signup-dob signup-label">
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
              </article>
              <article className="signup-label">
                {this.renderLabel("Email", "email")}
              </article>
              <article>{this.renderInput("text", "email", "email")}</article>
              <article className="signup-label">
                {this.renderLabel("Password", "password")}
              </article>
              <article>
                {this.renderInput("password", "password", "password")}
              </article>
              {/* <article className="signup-label">
                  {this.renderLabel("Confirm Password", "email")}
                </article>
                <article>{this.renderInput("text", "email", "email")}</article> */}

              <article className="signup-label">
                {this.renderLabel("Organization", "organization")}
              </article>
              <article>
                {this.renderDropDown(
                  "service For",
                  this.state.organizations,
                  "OrganizationID",
                  "OrganizationID",
                  "Which Organization Do You Belong To?"
                )}
              </article>
              {this.state.doctorForm.OrganizationID ===
                "61d5bc5c69b35ef18754dc9a" && (
                <article style={{ marginTop: "1rem" }}>
                  <article className="signup-label">
                    {this.renderLabel("Upload Your Resume", "Resume")}
                  </article>
                  <input type="file" accept=".pdf,.docx"></input>
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

              <article className="org-btn signup-page-btn">
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
