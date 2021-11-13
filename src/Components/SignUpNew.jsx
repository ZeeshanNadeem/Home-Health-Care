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
            <article>{this.renderLabel("FULL NAME", "fname")}</article>
            <article>{this.renderInput("text", "fname", "fullname")}</article>
            <article>{this.renderLabel("Email", "email")}</article>
            <article>{this.renderInput("text", "email", "email")}</article>
            <article>{this.renderLabel("Date of Birth", "dob")}</article>
            <article>{this.renderInput("date", "dob", "dob")}</article>
            <article>{this.renderLabel("Email", "email")}</article>
            <article>{this.renderInput("text", "email", "email")}</article>
            <article>
              {this.renderCheckBox(
                "checkbox",
                "checkbox",
                "agreedUser",
                "I agree with the Privacy Policy"
              )}
            </article>
            {this.renderBtn("Sign Up")}
            <a href="#" className="google btn">
              <i className="fa fa-google fa-fw"></i> SignUp with Google
            </a>
          </main>
        </article>
      </React.Fragment>
    );
  }
}

export default SignUp;
