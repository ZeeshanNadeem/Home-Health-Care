import React from "react";
import Form from "../Common/Form";
import axios from "axios";
import Joi from "joi-browser";
import moment from "moment";
import Button from "@mui/material/Button";
import CheckAvailability from "./Modal/CheckAvailability";
import config from "../Api/config.json";

class UserRequestService extends Form {
  state = {
    doctorForm: {
      fullname: "",
      staffMemberId: "",
      service: "",
      organization: "",
      schedule: "",
      address: "",
      phoneno: "",
      recursive: false,
      ServiceNeededFrom: "",
      ServiceNeededTo: "",
      address: "",
    },
    // services: [],
    organization: [],
    Conditionalservices: [],
    availabilityData: [],
    bookedSlots: [],
  };
  async componentDidMount() {
    const { data: organization } = await axios.get(config.organizations);
    const { data: bookedSlots } = await axios.get(config.userRequests);
    this.setState({
      organization: organization,
      bookedSlots,
    });
  }

  schema = {
    fullname: Joi.string().required().label("Full Name"),
    service: Joi.string().required().label("Service"),
    organization: Joi.string().required().label("Service Organization"),
    schedule: Joi.string().required().label("Date"),
    address: Joi.string().required().label("address"),
    phoneno: Joi.number().required().label("Phone No"),
    // onlyOnceCheckBox: Joi.string().required().label("Unchecked"),
    ServiceNeededFrom: Joi.string().required().label("From"),
    // ServiceNeededTo: Joi.string().required().label("To"),
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { doctorForm } = this.state;
    const { schedule } = this.state.doctorForm;
    const { availabilityData, bookedSlots } = this.state;
    const { ServiceNeededFrom } = this.state.doctorForm;
    console.log("Availability :", schedule);
    console.log("availabilityData :", availabilityData);
    console.log("Booked Slots :", bookedSlots);
    const { data: staff } = await axios.get(config.staff);
    console.log("Staff :", staff);

    for (let i = 0; i < availabilityData.length; i++) {
      console.log("For Loop Starts..");
      console.log("Availability data iteration:", availabilityData[i]);
      let availableFromArr = availabilityData[i].availabilityFrom.split(":");
      let availableToArr = availabilityData[i].availabilityTo.split(":");
      console.log("User Selected Time :", ServiceNeededFrom);
      let userSelectedTime = ServiceNeededFrom.split(":");
      let availableFrom = availableFromArr[0];
      let availabileTo = availableToArr[0];
      let userSelectedTime_ = userSelectedTime[0];
      console.log("Available Staff Availability From:", availableFrom);
      console.log("Available Staff Availability To:", availabileTo);
      console.log("User Selected Time:", userSelectedTime_);

      if (
        userSelectedTime >= availableFrom &&
        userSelectedTime < availabileTo
      ) {
        console.log("Comparison ");
        for (let i = 0; i < bookedSlots.length; i++) {
          let bookedServiceFrom = bookedSlots[i].ServiceNeededFrom.split(":");
          let bookedServiceFrom_ = bookedServiceFrom[0];
          if (userSelectedTime === bookedServiceFrom_) {
            continue;
          } else {
            const userRequest = {};
            userRequest.fullName = doctorForm.fullname;
            userRequest.staffMemberID = availabilityData[i]._id;
            userRequest.OrganizationID = doctorForm.organization;
            userRequest.ServiceNeededFrom = doctorForm.ServiceNeededFrom;

            userRequest.ServiceID = doctorForm.service;
            userRequest.Schedule = doctorForm.schedule;
            userRequest.Recursive = doctorForm.recursive;
            userRequest.Address = doctorForm.address;
            userRequest.PhoneNo = doctorForm.phoneno;
            console.log("User Request sending to Post ::", userRequest);
            const data = axios.post(config.userRequests, userRequest);
            console.log("Data Posted User Request...");
          }
        }
      } else {
        // const userRequest = {};
        // userRequest.staffMemberID = doctorForm.organization;
        // userRequest.OrganizationID = doctorForm.service;
        // userRequest.ServiceNeededFrom = doctorForm.schedule;
        // userRequest.ServiceNeededTo = doctorForm.onlyOnceCheckBox;
        // userRequest.ServiceID = doctorForm.address;
        // userRequest.Schedule = doctorForm.phoneno;
        // userRequest.OnlyOnce = doctorForm.timeSchedule;
        // userRequest.Address = doctorForm.timeSchedule;
        // userRequest.PhoneNo = doctorForm.timeSchedule;
        // const data = axios.post(config.staff);
        // console.log("Data posted !");
        // break;
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
            <article className="user-request-input-wrapper">
              <article>{this.renderLabel("Full Name", "fullName")}</article>
              <article>
                {this.renderInput("text", "fullname", "fullname", "Full Name")}
              </article>
            </article>

            <article className="user-request-input-wrapper">
              <article>
                {this.renderLabel("Organization", "serviceFor")}
              </article>
              <article>
                {this.renderDropDown(
                  "service For",
                  organization,
                  "serviceOrgranization",
                  "organization",
                  "Please Select an Organization"
                )}
              </article>
            </article>

            <article className="user-request-input-wrapper">
              <article>{this.renderLabel("Service", "service")}</article>
              <article>
                {this.renderConditionalDropDown(
                  "service",
                  "service",
                  "Please Select a Service"
                )}
              </article>
            </article>

            <article className="user-request-input-wrapper">
              <article>{this.renderLabel("Schedule", "schedule")}</article>
              <article>
                {this.renderInput(
                  "date",
                  "schedule",
                  "schedule",
                  "Schedule a Meeting"
                )}
              </article>
            </article>

            <article className="user-request-input-wrapper">
              <span>
                <CheckAvailability availabilityData={availabilityData} />
              </span>
            </article>

            <article className="user-request-input-wrapper">
              <article>{this.renderLabel("Time", "from")}</article>
              <article>
                {this.renderInput(
                  "time",
                  "ServiceNeededFrom",
                  "ServiceNeededFrom",
                  "ServiceNeededFrom",
                  "3600000"
                )}
              </article>
            </article>

            {/* <article>{this.renderLabel("To", "to")}</article>
            <article>
              {this.renderInput(
                "time",
                "ServiceNeededTo",
                "ServiceNeededTo",
                "ServiceNeededTo",
                "3600000"
              )}
            </article> */}
            <article className="user-request-input-wrapper">
              {this.renderCheckBox(
                "onlyOnceCheckBox",
                "onlyOnceCheckBox",
                "onlyOnceCheckBox",
                "Recursive"
              )}
            </article>

            <article className="user-request-input-wrapper">
              <article>{this.renderLabel("Address", "Address")}</article>
              <article>
                {this.renderMultiLineTextField("3", "44", "address", "address")}
              </article>
            </article>

            <article className="user-request-input-wrapper">
              <article>{this.renderLabel("Phone No", "phoneno")}</article>
              <article>
                {this.renderInput("number", "phoneno", "phoneno", "Phone No")}
              </article>
            </article>

            {this.renderBtn("Schedule")}
          </form>
        </div>
      </div>
    );
  }
}

export default UserRequestService;
