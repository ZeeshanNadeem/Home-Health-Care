import Form from "./Common/Form";
import React from "react";
class DoctorForm extends Form {
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
              Add A Doctor
            </h1>
          </header>
          <article>{this.renderLabel("FULL NAME", "fname")}</article>
          <article>
            {this.renderInput("text", "fname", "fullname", "Full Name")}
          </article>
          <article>{this.renderLabel("Date of Birth", "dob")}</article>
          <article>
            {this.renderInput("date", "dob", "dob", "Date Of Birth")}
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
          {this.renderBtn("Save Doctor")}
        </div>
      </div>
    );
  }
}

export default DoctorForm;
