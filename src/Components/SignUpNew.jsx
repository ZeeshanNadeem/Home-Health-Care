import React from "react";
import Form from "./Common/Form";
import NavBar from "./HomePage/NavBar";
import "animate.css";
class SignUp extends Form {
  render() {
    return (
      <React.Fragment>
        <NavBar />
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
            <article>{this.renderInput("text", "fname", "fullname")}</article>
            <article className="signup-dob signup-label">
              {this.renderLabel("Date of Birth", "dob")}
            </article>
            <article>{this.renderInput("date", "dob", "dob")}</article>
            <article className="signup-label">
              {this.renderLabel("Email", "email")}
            </article>
            <article>{this.renderInput("text", "email", "email")}</article>

            <article className="signup-label">
              {this.renderLabel("Password", "email")}
            </article>
            <article>{this.renderInput("text", "email", "email")}</article>
            <article className="signup-label">
              {this.renderLabel("Confirm Password", "email")}
            </article>
            <article>{this.renderInput("text", "email", "email")}</article>
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
      </React.Fragment>
    );
  }
}

export default SignUp;
