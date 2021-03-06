import React from "react";
import Form from "../../Common/Form";
import "animate.css";
import NavBar from "../../HomePage/NavBar";
import login from "../Auth/auth";
import Joi from "joi-browser";
import {Row,Col} from "react-bootstrap"
class Login extends Form {
  state = {
    doctorForm: {
      email: "",
      password: "",
    },
  };

  schema = {
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().min(5).max(255).required().label("Password"),
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    const { doctorForm } = this.state;
    if (!errors) {
      try {
        const { data: jwt } = await login(
          doctorForm.email,
          doctorForm.password
        );
        localStorage.setItem("token", jwt);
        if (this.props.history.location.pathname) {
          window.location = this.props.history.location.pathname;
        } else window.location.replace = "/Home";
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
          <article className="signup-page login-wrapper login-home-pg ">
            <main className="login- card-signup card-style animate__animated animate__fadeInLeft login-card login-style-card">
              <header>
                <h1 className="sign-up-header-text animate__animated animate__zoomIn">
                  Login
                </h1>
              </header>
              <Row>
                <Col xs={12} md={12} lg={12}>
              <article>{this.renderLabel("Email", "email")}</article>
              <article>{this.renderInput("text", "email", "email")}</article>
              </Col>
              </Row>


              <Row>
                <Col xs={12} md={12} lg={12}>
              <article>{this.renderLabel("Password", "password")}</article>
              <article>
                {this.renderInput("password", "password", "password")}
              </article>
              </Col>
              </Row>

              <Row>
                <Col  xs={12} md={12} lg={12}>
              <article className="login-page-btn login-btn-styling-">
                {this.renderBtn("Login")}
              </article>
              </Col>
              </Row>
            </main>
          </article>
        </form>
      </React.Fragment>
    );
  }
}

export default Login;
