import React from "react";
import Form from "./Common/Form";
import axios from "axios";
import Joi from "joi-browser";

class UserRequest extends Form {
  state = {
    doctorForm: {
      service: "",
      serviceOrganization: "",
      schedule: "",
      address: "",
      phoneno: "",
      addressCheckBox: "",
    },
    services: [],
    organization: [],
  };
  async componentDidMount() {
    const { data: services } = await axios.get(
      `http://localhost:3000/api/services`
    );

    const { data: organization } = await axios.get(
      `http://localhost:3000/api/organization`
    );
    this.setState({
      services: services.results,
      organization: organization,
    });
  }
  schema = {
    service: Joi.string().required().label("Service"),
    serviceOrganization: Joi.string().required().label("Service Organization"),
    schedule: Joi.string().required().label("Service Organization"),
    address: Joi.string().required().label("Service Organization"),
    phoneno: Joi.number().required().label("Service Organization"),
    addressCheckBox: Joi.string().required().label("Service Organization"),
  };
  render() {
    const { services, organization, profession } = this.state;
    return (
      <div className="doc-container user-request-wrapper">
        <div className="card-signup doc-form style-User-Request">
          <header>
            <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
              Schedule A Service
            </h1>
          </header>

          {/* <article>{this.renderLabel("Organization", "serviceFor")}</article>
          <article>
            {this.renderDropDown("Profession", profession, "serviceFor")}
          </article> */}

          <article>{this.renderLabel("Organization", "serviceFor")}</article>
          <article>
            {this.renderDropDown(
              "service For",
              organization,
              "serviceOrgranization",
              "serviceOrganization"
            )}
          </article>
          <article>{this.renderLabel("Service", "service")}</article>
          <article>
            {this.renderDropDown("service", services, "service", "service")}
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
