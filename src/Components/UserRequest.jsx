import React from "react";
import Form from "./Common/Form";
import axios from "axios";
class UserRequest extends Form {
  state = {
    doctorForm: {
      fullname: "",
      dateOfBirth: "",
      qualification: "",
      email: "",
      phoneNo: "",
      serviceName: "",
      serviceOrgranization: "",
      servicePrice: "",
    },
    services: [],
    organization: [
      { _id: "123191JHH1", serviceName: "Shifa" },
      { _id: "123191JHXXVV1", serviceName: "Quaid-e-Azam International" },
      { _id: "123191JHXXVV1", serviceName: "PIMS" },
    ],
    profession: [
      { _id: "102222XXX001", serviceName: "Nurse" },
      { _id: "1022229991", serviceName: "Doctor" },
    ],
  };
  async componentDidMount() {
    const { data: services } = await axios.get(
      `http://localhost:3000/api/services`
    );
    console.log("Service ::", services.results);
    this.setState({ services: services.results });
  }

  render() {
    const { services, organization, profession } = this.state;
    return (
      <div className="doc-container">
        <div className="card-signup doc-form style-User-Request">
          <header>
            <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
              Schedule A Service
            </h1>
          </header>

          <article>{this.renderLabel("Speciality", "serviceFor")}</article>
          <article>
            {this.renderDropDown("Speciality", services, "serviceFor")}
          </article>
          <article>{this.renderLabel("Organization", "serviceFor")}</article>

          <article>
            {this.renderDropDown("Profession", profession, "serviceFor")}
          </article>
          <article>{this.renderLabel("Organization", "serviceFor")}</article>

          <article>
            {this.renderDropDown("service For", organization, "serviceFor")}
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
            {this.renderMultiLineTextField("3", "44", "address")}
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
