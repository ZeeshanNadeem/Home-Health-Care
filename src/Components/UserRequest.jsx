import React from "react";
import Form from "./Common/Form";
class UserRequest extends Form {
  state = {
    serviceFor: [
      "Nursing Care",
      "Doctor Care",
      "Physical Therapy",
      "Vaccination",
      "Urine Sample",
    ],
  };
  render() {
    const { serviceFor } = this.state;
    return (
      <div className="doc-container">
        <div className="card-signup doc-form style-User-Request">
          <header>
            <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
              Schedule A Service
            </h1>
          </header>

          <article>{this.renderLabel("Service For", "serviceFor")}</article>
          <article>
            {this.renderDropDown("service For", serviceFor, "serviceFor")}
          </article>

          <article>{this.renderLabel("Schedule", "schedule")}</article>
          <article>
            {this.renderInput(
              "datetime-local",
              "schedule",
              "schedule",
              "Schedule a Meeting"
            )}
          </article>

          {this.renderCheckBox(
            "addressCheckBox",
            "addressCheckBox",
            "rememberMeChkBox",
            "Only Once"
          )}
          <article>{this.renderLabel("Address", "Address")}</article>
          <article>
            {this.renderMultiLineTextField("5", "49", "address")}
          </article>
          <article>{this.renderLabel("Phone No", "phoneno")}</article>
          <article>
            {this.renderInput("number", "phoneno", "phoneno", "Phone No")}
          </article>
          {this.renderBtn("Schedule")}
        </div>
      </div>
    );
  }
}

export default UserRequest;
