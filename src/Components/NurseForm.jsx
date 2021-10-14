import React from "react";
import Form from "./Common/Form";

class NurseForm extends Form {
  state = {
    qualifictionOptions: ["MBBS", "BDS", "BMBS", "BM", "MBChB"],
  };
  render() {
    const { qualifictionOptions } = this.state;
    return (
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
              qualifictionOptions,
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
    );
  }
}

export default NurseForm;
