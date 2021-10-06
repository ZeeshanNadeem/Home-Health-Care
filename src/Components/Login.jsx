import React from "react";
import Form from "./Common/Form";

class Login extends Form {
  render() {
    return (
      <React.Fragment>
        <article className="signup-page">
          <main className="card-signup card-style">
            <header>
              <h1 className="sign-up-header-text">Login</h1>
            </header>
            <article>{this.renderLabel("Email", "loginEmail")}</article>

            <article>
              {this.renderInput("text", "loginEmail", "loginEmail")}
            </article>

            <article>{this.renderLabel("Password", "password")}</article>

            <article>{this.renderInput("password", "pw", "pw")}</article>
            {this.renderCheckBox(
              "chkbox",
              "chkbox",
              "rememberMeChkBox",
              "Remember me"
            )}
            {this.renderBtn("Login")}
          </main>
        </article>
      </React.Fragment>
    );
  }
}

export default Login;
