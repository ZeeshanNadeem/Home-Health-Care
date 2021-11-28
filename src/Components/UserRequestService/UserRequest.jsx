import React from "react";
import Form from "../Common/Form";
import axios from "axios";
import Joi from "joi-browser";
import moment from "moment";
import Button from "@mui/material/Button";
import CheckAvailability from "./Modal/CheckAvailability";
import { toast, ToastContainer } from "react-toastify";

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
    userRequests: [],
  };
  async componentDidMount() {
    const { data: organization } = await axios.get(config.organizations);
    const { data: userRequests } = await axios.get(config.userRequests);
    this.setState({
      organization: organization,
      userRequests,
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

  AssignAutomatedStaff = async () => {
    const { doctorForm } = this.state;
    const { schedule } = this.state.doctorForm;
    const { availabilityData, userRequests } = this.state;
    const { ServiceNeededFrom } = this.state.doctorForm;

    const { data: staff } = await axios.get(config.staff);

    for (let j = 0; j < staff.results.length; j++) {
      let availableFromArr = staff.results[j].availabilityFrom.split(":");
      let availableToArr = staff.results[j].availabilityTo.split(":");

      let userSelectedTime = ServiceNeededFrom.split(":");
      let availableFrom = availableFromArr[0];
      let availabileTo = availableToArr[0];
      let userSelectedTime_ = userSelectedTime[0];
      let bookedServiceFrom_ = null;
      let bookedServiceFrom = null;
      let gotSlotBooked = false;

      if (
        userSelectedTime_ >= availableFrom &&
        userSelectedTime_ < availabileTo
      ) {
        for (let i = 0; i < userRequests.length; i++) {
          if (
            staff.results[j]._id === userRequests[i].staffMemberAssigned._id
          ) {
            bookedServiceFrom = userRequests[i].ServiceNeededFrom.split(":");
            bookedServiceFrom_ = bookedServiceFrom[0];

            if (userSelectedTime_ !== bookedServiceFrom_) {
              continue;
            } else {
              gotSlotBooked = true;
              break;
            }
          }
        }

        if (!gotSlotBooked) {
          const userRequest = {};
          userRequest.fullName = doctorForm.fullname;
          userRequest.staffMemberID = staff.results[j]._id;
          userRequest.OrganizationID = doctorForm.organization;
          userRequest.ServiceNeededFrom = doctorForm.ServiceNeededFrom;

          userRequest.ServiceID = doctorForm.service;
          userRequest.Schedule = doctorForm.schedule;
          userRequest.Recursive = doctorForm.recursive;
          userRequest.Address = doctorForm.address;
          userRequest.PhoneNo = doctorForm.phoneno;

          await axios.post(config.userRequests, userRequest);
          toast.success("Meeting Scheduled");

          break;
        }
        if (gotSlotBooked) {
          toast.error("No Availability For the Specified Time!");
          toast.error("Please Check Availability and then Schedule!");
          break;
        }
      }
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    await this.AssignAutomatedStaff();
  };
  render() {
    const { services, organization, availabilityData } = this.state;
    return (
      <div className="doc-container user-request-wrapper">
        <ToastContainer />
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

            <article className="btn-user-request">
              {this.renderBtn("Schedule")}
            </article>
          </form>
        </div>
      </div>
    );
  }
}

export default UserRequestService;
