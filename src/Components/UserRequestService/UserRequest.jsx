import React from "react";
import Form from "../Common/Form";
import axios from "axios";
import Joi from "joi-browser";
import moment from "moment";
import Button from "@mui/material/Button";
import CheckAvailability from "./Modal/CheckAvailability";
import { toast, ToastContainer } from "react-toastify";
import UserRequestContext from "./Context/UserContext";

import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";

import config from "../Api/config.json";

class UserRequestService extends Form {
  state = {
    doctorForm: {
      fullname: "",
      // staffMemberId: "",
      service: "",
      organization: "",
      schedule: "",
      address: "",
      phoneno: "",
      // recursive: false,
      ServiceNeededFrom: "",
      email: "",
      city: "",
      // ServiceNeededTo: "",
      // address: "",
    },
    // services: [],
    organization: [],
    Conditionalservices: [],
    availabilityData: [],
    userRequests: [],
    errors: [],
    staffLeaves: [],
    cites: ["Islamabad", "Rawalpindi"],
    timeArr: [
      "1:00",
      "2:00",
      "3:00",
      "4:00",
      "5:00",
      "6:00",
      "7:00",
      "8:00",
      "9:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "24:00",
    ],
  };
  async componentDidMount() {
    this.props.setProgress(0);
    const { data: organization } = await axios.get(config.organizations);
    const { data: userRequests } = await axios.get(config.userRequests);
    const { data: staffLeaves } = await axios.get(
      config.apiEndPoint + "/staffLeave"
    );
    this.setState({
      organization: organization.results,
      userRequests,
      staffLeaves,
    });
    this.props.setProgress(20);
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getUTCFullYear();
    if (month < 10) month = "0" + month;
    let maxDate = year + "-" + month + "-" + "31";
    let minDate = year + "-" + month + "-" + day;
    this.setState({ maxDate, minDate });
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      this.setState({ user });
      this.props.setProgress(50);
      this.props.setProgress(100);
    } catch (ex) {}
  }

  schema = {
    fullname: Joi.string().required().label("Full Name"),
    service: Joi.string().required().label("Service"),
    organization: Joi.string().required().label("Service Organization"),
    schedule: Joi.string().required().label("Date"),
    address: Joi.string().required().label("Address"),
    phoneno: Joi.number().required().label("Phone No"),
    ServiceNeededFrom: Joi.string().required().label("Time"),
    city: Joi.string().required().label("City"),
    email: Joi.string().required().label("Email"),
  };

  //This function takes userSelected Date
  //Matches it with the staff's
  //Returns true or false
  //True means user has selected Date at that date where
  //that staff is booked
  MatchUserSelected = (BookedStaffDate) => {
    if (BookedStaffDate === this.state.doctorForm.schedule) {
      return true;
    } else {
      return false;
    }
  };

  AssignAutomatedStaff = async () => {
    const { doctorForm } = this.state;
    const { schedule } = this.state.doctorForm;
    const { availabilityData, userRequests } = this.state;
    const { ServiceNeededFrom } = this.state.doctorForm;
    const { organization, service } = this.state.doctorForm;
    const m = moment(this.state.doctorForm.schedule);
    const dayNo = m.day();
    const { data: staff } = await axios.get(
      config.staff +
        `/?day=${dayNo}&service=${service}&organization=${organization}`
    );

    // const { data: staff } = await axios.get(config.staff);

    const { staffLeaves } = this.state;
    let bookedServiceFrom_ = null;
    let bookedServiceFrom = null;
    let bookedServiceTo_ = null;
    let bookedServiceTo = null;
    let gotSlotBooked = false;
    let staffOnLeave = false;
    let liesBetween = false;
    let tempArray = [];

    for (let j = 0; j < staff.length; j++) {
      gotSlotBooked = false;
      staffOnLeave = false;
      liesBetween = false;
      let availableFromArr = staff[j].availabilityFrom.split(":");
      let availableToArr = staff[j].availabilityTo.split(":");

      let userSelectedTime = ServiceNeededFrom.split(":");
      let availableFrom = availableFromArr[0];
      let availabileTo = availableToArr[0];
      let userSelectedTime_ = userSelectedTime[0];

      if (
        userSelectedTime_ === "01" ||
        userSelectedTime_ === "02" ||
        userSelectedTime_ === "03" ||
        userSelectedTime_ === "04" ||
        userSelectedTime_ === "05" ||
        userSelectedTime_ === "06" ||
        userSelectedTime_ === "07" ||
        userSelectedTime_ === "08" ||
        userSelectedTime_ === "09"
      ) {
        userSelectedTime_ = userSelectedTime_.replace(/^(?:00:)?0?/, "");
      }
      if (
        availableFrom === "01" ||
        availableFrom === "02" ||
        availableFrom === "03" ||
        availableFrom === "04" ||
        availableFrom === "05" ||
        availableFrom === "06" ||
        availableFrom === "07" ||
        availableFrom === "08" ||
        availableFrom === "09"
      ) {
        availableFrom = availableFrom.replace(/^(?:00:)?0?/, "");
      }

      if (
        availabileTo === "01" ||
        availabileTo === "02" ||
        availabileTo === "03" ||
        availabileTo === "04" ||
        availabileTo === "05" ||
        availabileTo === "06" ||
        availabileTo === "07" ||
        availabileTo === "08" ||
        availabileTo === "09"
      ) {
        availabileTo = availabileTo.replace(/^(?:00:)?0?/, "");
      }
      //Checking if userSelected time comes in between a staff duty
      //If yes then we proceed further else check for other staff member
      userSelectedTime_ = parseInt(userSelectedTime_.trim());
      const StaffAvailableForm = parseInt(availableFrom.trim());
      const StaffAvailableTo = parseInt(availabileTo.trim());

      //Logic to check userSelected Time lies between
      //staff's duty or not
      for (let s = StaffAvailableForm; s <= StaffAvailableTo; s++) {
        if (s === userSelectedTime_) {
          liesBetween = true;
          break;
        }
      }

      if (liesBetween) {
        for (let i = 0; i < userRequests.length; i++) {
          if (staffOnLeave || gotSlotBooked) break;
          if (staff[j]._id === userRequests[i].staffMemberAssigned._id) {
            bookedServiceFrom = userRequests[i].ServiceNeededFrom.split(":");
            bookedServiceTo = userRequests[i].ServiceNeededTo.split(":");
            bookedServiceTo_ = bookedServiceTo[0];
            bookedServiceFrom_ = bookedServiceFrom[0];
            if (
              bookedServiceFrom_ === "01" ||
              bookedServiceFrom_ === "02" ||
              bookedServiceFrom_ === "03" ||
              bookedServiceFrom_ === "04" ||
              bookedServiceFrom_ === "05" ||
              bookedServiceFrom_ === "06" ||
              bookedServiceFrom_ === "07" ||
              bookedServiceFrom_ === "08" ||
              bookedServiceFrom_ === "09"
            ) {
              bookedServiceFrom_ = bookedServiceFrom_.replace(
                /^(?:00:)?0?/,
                ""
              );
            }
            //Checking If staff booked service time
            //lies between user requested time
            if (
              userSelectedTime_ >= bookedServiceFrom_ &&
              userSelectedTime_ <= bookedServiceTo_
            ) {
              const staffDutyOnSameDay = this.MatchUserSelected(
                userRequests[i].Schedule
              );
              if (staffDutyOnSameDay) {
                gotSlotBooked = true;
                break;
              }
            } else {
              continue;
            }
          }
        }
        // If that staff hasn't gotten any slot booked at user Selected Service Time
        // Then Checking whether is on leave at user selected date for service
        if (!gotSlotBooked) {
          for (let z = 0; z < staffLeaves.length; z++) {
            if (staff[j]._id === staffLeaves[z].staff._id) {
              if (staffLeaves[z].leaveFrom === schedule) {
                staffOnLeave = true;
                break;
              } else {
                const leaveFromArr = staffLeaves[z].leaveFrom.split("-");
                const leaveToArr = staffLeaves[z].leaveTo.split("-");
                const scheduleArr = schedule.split("-");

                let leaveFormYear = leaveFromArr[0];
                let leaveFormMonth = leaveFromArr[1];
                let leaveFromDay = leaveFromArr[2];

                let leaveToYear = leaveToArr[0];
                let leaveToMonth = leaveToArr[1];
                let leaveToDay = leaveToArr[2];

                let userScheduleDateYear = scheduleArr[0];
                let userScheduleDateMonth = scheduleArr[1];
                let userScheduleDateDay = scheduleArr[2];

                leaveFormYear = leaveFormYear.replace(/^(?:00:)?0?/, "");
                leaveFormMonth = leaveFormMonth.replace(/^(?:00:)?0?/, "");
                leaveFromDay = leaveFromDay.replace(/^(?:00:)?0?/, "");

                leaveToYear = leaveToYear.replace(/^(?:00:)?0?/, "");
                leaveToMonth = leaveToMonth.replace(/^(?:00:)?0?/, "");
                leaveToDay = leaveToDay.replace(/^(?:00:)?0?/, "");

                userScheduleDateYear = userScheduleDateYear.replace(
                  /^(?:00:)?0?/,
                  ""
                );
                userScheduleDateMonth = userScheduleDateMonth.replace(
                  /^(?:00:)?0?/,
                  ""
                );
                userScheduleDateDay = userScheduleDateDay.replace(
                  /^(?:00:)?0?/,
                  ""
                );

                if (
                  userScheduleDateYear >= leaveFormYear &&
                  userScheduleDateYear <= leaveToYear
                ) {
                  const checkBetweenMonths =
                    leaveFormMonth - userScheduleDateMonth;
                  const checkBetweenMonth2 =
                    leaveToMonth - userScheduleDateMonth;

                  if (checkBetweenMonths > 0 && checkBetweenMonth2 > 0) {
                    staffOnLeave = true;
                    break;
                  }
                }
              }
            }
          }
        }
      }
      if (!gotSlotBooked && !staffOnLeave && liesBetween) {
        tempArray.push(staff[j]);
      }

      // IF That staff is neither on leave nor got slot booked in that time
      // Assigning that staff a duty
      if (
        !gotSlotBooked &&
        !staffOnLeave &&
        liesBetween &&
        j === staff.length - 1
      ) {
        //Assigning duty on the basis of rating
        if (tempArray.length > 0) {
          let maxIndex = null;
          for (let c = 0; c < tempArray.length - 1; c++) {
            for (let k = 1; k < tempArray.length; k++) {
              if (tempArray[c].Rating > tempArray[k].Rating) {
                maxIndex = c;
              } else maxIndex = k;
            }
          }
          if (!maxIndex) maxIndex = 0;
          const userRequest = {};
          userRequest.fullName = doctorForm.fullname;
          userRequest.userID = this.state.user._id;
          userRequest.staffMemberID = tempArray[maxIndex]._id;
          userRequest.OrganizationID = doctorForm.organization;
          userRequest.ServiceNeededFrom = doctorForm.ServiceNeededFrom;

          userRequest.ServiceID = doctorForm.service;
          userRequest.Schedule = doctorForm.schedule;
          // userRequest.Recursive = doctorForm.recursive;
          userRequest.Address = doctorForm.address;
          userRequest.PhoneNo = doctorForm.phoneno;
          userRequest.city = doctorForm.city;
          userRequest.email = doctorForm.email;

          try {
            await axios.post(
              config.apiEndPoint + "/confirmService",
              userRequest
            );

            // toast.success("Meeting Scheduled");
          } catch (ex) {
            toast.error(ex.response.data);
          }
          this.props.history.push("/Confirm/Meeting");

          return;
        }

        // const userRequest = {};
        // userRequest.fullName = doctorForm.fullname;
        // userRequest.userID = this.state.user._id;
        // userRequest.staffMemberID = staff[j]._id;
        // userRequest.OrganizationID = doctorForm.organization;
        // userRequest.ServiceNeededFrom = doctorForm.ServiceNeededFrom;

        // userRequest.ServiceID = doctorForm.service;
        // userRequest.Schedule = doctorForm.schedule;
        // // userRequest.Recursive = doctorForm.recursive;
        // userRequest.Address = doctorForm.address;
        // userRequest.PhoneNo = doctorForm.phoneno;

        // try {
        //   await axios.post(config.userRequest, userRequest);
        //   toast.success("Meeting Scheduled");
        // } catch (ex) {
        //   toast.error(ex.response.data);
        // }

        // return;
      }
    }
    if (tempArray.length === 0) {
      toast.error("No Availability For the Specified Time!");
      toast.error("Please Check Availability and then Schedule!");
    }
    // if (gotSlotBooked || !liesBetween || staffOnLeave ) {
    //   toast.error("No Availability For the Specified Time!");
    //   toast.error("Please Check Availability and then Schedule!");
    // }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    const errorClass = errors ? "errorClass" : "";
    this.setState({ errorClass });
    if (!errors) await this.AssignAutomatedStaff();
  };
  render() {
    const { services, organization, availabilityData } = this.state;
    const { schedule } = this.state.doctorForm;

    return (
      <div className="doc-container user-request-wrapper user-req">
        <ToastContainer />
        <div className="card-signup doc-form style-User-Request user-req-card user-req-layout">
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
            <article className="row row-grid">
              <article
                className={`user-request-input-wrapper ${this.state.errorClass}`}
              >
                <article>{this.renderLabel("Full Name", "fullName")}</article>
                <article>
                  {this.renderInput(
                    "text",
                    "fullname",
                    "fullname",
                    "Full Name"
                  )}
                </article>
              </article>
              <article
                className={`user-request-input-wrapper ${this.state.errorClass}`}
              >
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
            </article>

            <article className="row">
              <article
                className={`user-request-input-wrapper ${this.state.errorClass}`}
              >
                <article>{this.renderLabel("Service", "service")}</article>
                <article>
                  {this.renderConditionalDropDown(
                    "service",
                    "service",
                    "Please Select a Service"
                  )}
                </article>
              </article>
              <article
                className={`user-request-input-wrapper ${this.state.errorClass}`}
              >
                <article>{this.renderLabel("Schedule", "schedule")}</article>
                <article>
                  {this.renderInput(
                    "date",
                    "schedule",
                    "schedule",
                    "Schedule a Meeting",
                    this.state.minDate,
                    this.state.maxDate
                  )}
                </article>
                <article
                  className={`user-request-input-wrapper ${this.state.errorClass}`}
                >
                  <div>
                    <CheckAvailability
                      availabilityData={availabilityData}
                      userScheduledDate={schedule}
                    />
                  </div>
                </article>
              </article>
            </article>

            <article className="row row-grid email-txt">
              <article className="email-label">
                <article>{this.renderLabel("Email", "Email")}</article>
                <article>
                  {this.renderInput("email", "email", "email", "Email")}
                </article>
              </article>

              <article>
                <article>{this.renderLabel("Phone No", "phoneno")}</article>
                <article>
                  {this.renderInput("number", "phoneno", "phoneno", "Phone No")}
                </article>
              </article>
            </article>

            <article className="row row-grid">
              <article>
                <article
                  className={`user-request-input-wrapper ${this.state.errorClass}`}
                >
                  <article>{this.renderLabel("Time", "from")}</article>
                  {/* <article>
                      {this.renderInput(
                        "time",
                        "ServiceNeededFrom",
                        "ServiceNeededFrom",
                        "ServiceNeededFrom",
                        "3600000"
                      )}
                    </article> */}

                  <article>
                    {this.renderDropDown(
                      "time",
                      this.state.timeArr,
                      "ServiceNeededFrom",
                      "ServiceNeededFrom"
                    )}
                  </article>
                </article>
              </article>
              <article>
                <article>{this.renderLabel("City", "city")}</article>
                <article>
                  {this.renderDropDown(
                    "City",
                    this.state.cites,
                    "city",
                    "city",
                    "Please Select Your City"
                  )}
                </article>
              </article>
            </article>

            <article
              className={`user-request-input-wrapper ${this.state.errorClass} address-grid`}
            >
              <article>
                <article>{this.renderLabel("Address", "Address")}</article>
                <article className="address-txt">
                  {this.renderMultiLineTextField(
                    this.state.height,
                    this.state.adressWidth,
                    "address",
                    "address"
                  )}
                </article>
              </article>
            </article>

            <article
              className={`btn-user-request ${this.state.errorClass} schedule-btn`}
            >
              {this.renderBtn("Schedule")}
            </article>
          </form>
        </div>
      </div>
    );
  }
}

export default UserRequestService;
