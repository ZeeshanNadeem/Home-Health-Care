import React from "react";
import Form from "./Common/Form";
import "animate.css";
import NavBar from "./HomePage/NavBar";
class Login extends Form {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <article className="signup-page login-wrapper">
          <main className="card-signup card-style animate__animated animate__fadeInLeft login-card">
            <header>
              <h1 className="sign-up-header-text animate__animated animate__zoomIn">
                Login
              </h1>
            </header>
            <article>{this.renderLabel("Email", "loginEmail")}</article>

            <article>
              {this.renderInput("text", "loginEmail", "loginEmail")}
            </article>

            <article>{this.renderLabel("Password", "password")}</article>

            <article>{this.renderInput("password", "pw", "pw")}</article>
            <article className="remember-me-chkBox">
              {this.renderCheckBox(
                "chkbox",
                "chkbox",
                "addCheckBox",
                "Remember Me"
              )}
            </article>
            <article className="login-page-btn">
              {this.renderBtn("Login")}
            </article>
          </main>
        </article>
      </React.Fragment>
    );
  }
}

export default Login;
