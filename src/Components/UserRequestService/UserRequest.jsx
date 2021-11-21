import React from "react";
import Form from "../Common/Form";
import axios from "axios";
import Joi from "joi-browser";
import Button from "@mui/material/Button";
import CheckAvailability from "./Modal/CheckAvailability";
import config from "../Api/config.json";

class UserRequestService extends Form {
  state = {
    doctorForm: {
      staffMemberId: "",
      service: "",
      organization: "",
      schedule: "",
      address: "",
      phoneno: "",
      onlyOnceCheckBox: false,
      timeSchedule: "",
      address: "",
    },
    // services: [],
    organization: [],
    Conditionalservices: [],
    availabilityData: [],
    bookedSlots: [],
  };
  async componentDidMount() {
    const { data: organization } = await axios.get(
      `http://localhost:3000/api/organization`
    );
    const { data: bookedSlots } = await axios.get(
      `http://localhost:3000/api/bookedSlots`
    );
    this.setState({
      organization: organization,
      bookedSlots,
    });
  }

  schema = {
    service: Joi.string().required().label("Service"),
    organization: Joi.string().required().label("Service Organization"),
    schedule: Joi.string().required().label("Date"),
    address: Joi.string().required().label("address"),
    phoneno: Joi.number().required().label("Phone No"),
    // onlyOnceCheckBox: Joi.string().required().label("Unchecked"),
    timeSchedule: Joi.string().required().label("Time"),
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const { doctorForm } = this.state;
    const { timeSchedule } = this.state.doctorForm;
    const { availabilityData, bookedSlots } = this.state;
    console.log("Availability :", timeSchedule);
    console.log("availabilityData :", availabilityData);
    console.log("Booked Slots :", bookedSlots);
    const { data: staff } = await axios.get(config.staff);
    console.log("Staff :", staff);

    for (let i = i; i <= availabilityData; i++) {
      if (
        timeSchedule > availabilityData[i].Form &&
        timeSchedule < availabilityData[i].To
      ) {
        for (let i = i; i <= bookedSlots; i++) {
          if (
            availabilityData[i].Form >= bookedSlots.Form &&
            availabilityData[i].To <= bookedSlots.To
          ) {
            continue;
          }
        }
      } else {
        const userRequest = {};
        userRequest.OrganizationID = doctorForm.organization;
        userRequest.ServiceID = doctorForm.service;
        userRequest.Schedule = doctorForm.schedule;
        userRequest.OnlyOnce = doctorForm.onlyOnceCheckBox;
        userRequest.Address = doctorForm.address;
        userRequest.PhoneNo = doctorForm.phoneno;
        userRequest.Time = doctorForm.timeSchedule;
        const data = axios.post(config.staff);
      }
    }
    // const userRequest = {};
    // userRequest.OrganizationID = doctorForm.organization;
    // userRequest.ServiceID = doctorForm.service;
    // userRequest.Schedule = doctorForm.schedule;
    // userRequest.OnlyOnce = doctorForm.onlyOnceCheckBox;
    // userRequest.Address = doctorForm.address;
    // userRequest.PhoneNo = doctorForm.phoneno;
    // userRequest.Time = doctorForm.timeSchedule;
    // const { data } = await axios.post(
    //   "http://localhost:3iii/api/userRequests",
    //   userRequest
    // );
  };
  render() {
    const { services, organization, availabilityData } = this.state;
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
          <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
            <article>{this.renderLabel("Organization", "serviceFor")}</article>
            <article>
              {this.renderDropDown(
                "service For",
                organization,
                "serviceOrgranization",
                "organization",
                "Please Select an Organization"
              )}
            </article>
            <article>{this.renderLabel("Service", "service")}</article>
            <article>
              {this.renderConditionalDropDown(
                "service",
                "service",
                "Please Select a Service"
              )}
            </article>

            <article>{this.renderLabel("Schedule", "schedule")}</article>
            <article>
              {this.renderInput(
                "date",
                "schedule",
                "schedule",
                "Schedule a Meeting"
              )}
            </article>
            <span>
              <CheckAvailability availabilityData={availabilityData} />
            </span>

            <article>{this.renderLabel("Time", "time")}</article>
            <article>
              {this.renderInput(
                "time",
                "timeSchedule",
                "timeSchedule",
                "Time Schedule",
                "36iiiii"
              )}
            </article>

            {this.renderCheckBox(
              "onlyOnceCheckBox",
              "onlyOnceCheckBox",
              "onlyOnceCheckBox",
              "Only Once"
            )}
            <article>{this.renderLabel("Address", "Address")}</article>
            <article>
              {this.renderMultiLineTextField("3", "44", "address", "address")}
            </article>
            <article>{this.renderLabel("Phone No", "phoneno")}</article>
            <article>
              {this.renderInput("number", "phoneno", "phoneno", "Phone No")}
            </article>
            {this.renderBtn("Schedule")}
          </form>
        </div>
      </div>
    );
  }
}

export default UserRequestService;
