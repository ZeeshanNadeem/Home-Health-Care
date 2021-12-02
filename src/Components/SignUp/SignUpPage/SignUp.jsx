import React from "react";
import Form from "../../Common/Form";
import NavBar from "../../HomePage/NavBar";
import signingUp from "../SigningUp/SignUp";
import Joi from "joi-browser";
import "animate.css";
class SignUp extends Form {
  state = {
    doctorForm: {
      fullName: "",
      dateOfBirth: "",
      email: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    fullName: Joi.string().min(5).max(50).required(),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

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
          this.setState({ errors: error });
        }
      }
    }
  };
  render() {
    return (
      <React.Fragment>
        <NavBar />

        <form onSubmit={this.handleSubmit}>
          <article className="signup-page">
            <main className="card-signup animate__animated animate__fadeInLeft">
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
                {this.renderInput("date", "dateOfBirth", "dateOfBirth")}
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
              <article className="ChkBox-signup">
                {this.renderCheckBox(
                  "checkbox",
                  "checkbox",
                  "agreedUser",
                  "I Agree with the Privacy Policy"
                )}
              </article>
              <article className="signup-page-btn">
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

export default SignUp;
