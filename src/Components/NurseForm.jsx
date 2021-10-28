import React from "react";
import axios from "axios";
import Form from "./Common/Form";
import Joi from "joi-browser";

class NurseForm extends Form {
  state = {
    doctorForm: {
      fullname: "",
      dateOfBirth: "",
      qualification: "",
      email: "",
      phoneNo: "",
    },
    qualification: [],
  };
  schema = {
    fullname: Joi.string().required().label("Full Name"),
    dateOfBirth: Joi.string().required().label("Date of Birth"),
    qualification: Joi.string().required(),
    email: Joi.string().required().label("Email"),
    phoneNo: Joi.number().required().label("Phone No"),
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    //call the server
    // const { doctorForm } = this.state;
    // const obj = { title: "zeeshan", body: "ahha" };
    // const { data: post } = await http.post(
    //   "http://localhost:3000/api/services",
    //   doctorForm
    // );

    // const posts = [post, ...this.state.posts];
    // this.setState({ posts });

    console.log("Submitted");
  };
  async componentDidMount() {
    const { data: qualification } = await axios.get(
      "http://localhost:3000/api/qualification"
    );
    this.setState({ qualification });
  }
  render() {
    const { qualification } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        <div className="doc-container">
          <div className="card-signup doc-form">
            <header>
              <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
                Add A Nurse
              </h1>
            </header>
            <article>{this.renderLabel("FULL NAME", "fname")}</article>
            <article>
              {this.renderInput("text", "fname", "fullname", "Full Name")}
            </article>
            <article>{this.renderLabel("Date of Birth", "dob")}</article>
            <article>
              {this.renderInput("date", "dob", "dob", "Date of Birth")}
            </article>
            <article>
              {this.renderLabel("Qualification", "qualification")}
            </article>
            <article>
              {this.renderDropDown(
                "Qualification",
                qualification,
                "docQualification"
              )}
            </article>
            <article>{this.renderLabel("Email Address", "email")}</article>
            <article>
              {this.renderInput("email", "email", "email", "Email")}
            </article>
            <article>{this.renderLabel("Phone No", "phoneno")}</article>
            <article>
              {this.renderInput("number", "phoneno", "phoneno", "Phone No")}
            </article>
            {this.renderBtn("Save Nurse")}
          </div>
        </div>
      </form>
    );
  }
}

export default NurseForm;
