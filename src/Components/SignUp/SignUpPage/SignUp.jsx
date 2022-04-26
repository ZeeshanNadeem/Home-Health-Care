import React from "react";
import Form from "../../Common/Form";
import NavBar from "../../HomePage/NavBar";
import signingUp from "../SigningUp/SignUp";
import Joi from "joi-browser";
import "animate.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospitalAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {Row,Col} from "react-bootstrap";
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';

class SignUp extends Form {
  state = {
    doctorForm: {
      fullName: "",
      // lastName: "",
      // username: "",
      email: "",
      password: "",
      isOrganizationAdmin: false,
    },
    errors: {},
  };

  schema = {
    fullName: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isOrganizationAdmin: Joi.boolean().required(),
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
    const year = new Date().getFullYear();
    const dobSignUpMaxDate = year + "-12-31";
    console.log();
    return (
      <React.Fragment>
        <NavBar />
        <ToastContainer />
        <form onSubmit={this.handleSubmit}>
          <article className="signup-page">
            <main className="card-signup signup-style animate__animated animate__fadeInLeft">
              <header>
                <h1 className="sign-up-header-text animate__animated animate__zoomIn">
                  Sign Up
                </h1>
              </header>

              <Row>
                <Col md={12} xs={12} lg={12}>
              <article className="signup-label">
                {this.renderLabel("Full Name", "fname")}
              </article>
              <article>
                {this.renderInput("text", "fullName", "fullName")}
              </article>
              </Col>
              </Row>
              {/* <article className="signup-label">
                {this.renderLabel("Last Name", "lname")}
              </article>
              <article>
                {this.renderInput("text", "lastName", "lastName")}
              </article>
              <article className="signup-dob signup-label">
                {this.renderLabel("UserName", "username")}
              </article>
              <article>
                {this.renderInput(
                  "text",
                  "username",
                  "username",
                  "",
                  "",
                  dobSignUpMaxDate
                )}
              </article> */}
              <Row>
                <Col md={12} xs={12} lg={12}>
              <article className="signup-label">
                {this.renderLabel("Email", "email")}
              </article>
              <article>{this.renderInput("text", "email", "email")}</article>
              </Col>
              </Row>

              <Row>
                <Col md={12} xs={12} lg={12}>
              <article className="signup-label">
                {this.renderLabel("Password", "password")}
              </article>
              <article>
                {this.renderInput("password", "password", "password")}
              </article>
              </Col>
              </Row>
              {/* <article className="signup-label">
                  {this.renderLabel("Confirm Password", "email")}
                </article>
                <article>{this.renderInput("text", "email", "email")}</article> */}

              {/* <article className="ChkBox-signup">
                {this.renderCheckBox(
                  "checkbox",
                  "isOrganizationAdmin",
                  "isOrganizationAdmin",
                  "Request To Be an Organization Admin"
                )}
              </article> */}

              <Row>
                <Col md={12} xs={12} lg={12}>
              <article
                style={{
                  // textAlign: "center",
                  marginTop: "0.3rem",
                  fontWeight: "600",
                  color: "#142F43",
                }}
              >
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  style={{ marginRight: "0.3rem" }}
                />
                <Link to="/SignUp/Organization">
                  <span className="signup-org" style={{ color: "#142F43" }}>
                    <strong>SignUp As An Organization Admin?</strong>
                  </span>
                </Link>
              </article>
              </Col>
              </Row>

              <Col md={12} xs={12} lg={12}>
              <Row>
              <article className="signup-page-btn">
                {this.renderBtn("Sign Up")}
              </article>
              </Row>
              </Col>
            </main>
          </article>
        </form>
      </React.Fragment>
    );
  }
}

export default SignUp;
