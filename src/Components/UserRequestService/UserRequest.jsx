import React from "react";
import Form from "../Common/Form";
import axios from "axios";
import Joi, { ignore } from "joi-browser";
import moment from "moment";
import CheckAvailability from "./Modal/CheckAvailability";
import { toast, ToastContainer } from "react-toastify";
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
      {
        _id: "00:00-3:00",
        name: "12 AM to 3 AM",
      },
      {
        _id: "03:00-6:00",
        name: "3 AM to 6 AM",
      },

      {
        _id: "06:00-9:00",
        name: "6 AM to 9 AM",
      },
      {
        _id: "09:00-12:00",
        name: "9 AM to 12 PM",
      },
      {
        _id: "12:00-15:00",
        name: "12 PM to 3 PM",
      },
      {
        _id: "15:00-18:00",
        name: "3 PM to 6 PM",
      },
      {
        _id: "18:00-21:00",
        name: "6 PM to 9 PM",
      },
      {
        _id: "21:00-00:00",
        name: "9 PM to 12 AM",
      },
    ],
    availableSlots: [],
  };
  async componentDidMount() {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    const isUser =
      !user.isAppAdmin &&
      !user.staffMember &&
      user.isOrganizationAdmin === "false";
    if (!isUser) this.props.history.push("/");
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
    let year = date.getFullYear();
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
  //Matches it with the staff's duty date
  //Returns true or false
  //True means user has requested service at that date where
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
    if (dayNo === "0") dayNo = 7;
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

    let tempArray = [];

    for (let j = 0; j < staff.length; j++) {
      gotSlotBooked = false;
      staffOnLeave = false;
      let liesBetween = false;

      let availableFromArr = staff[j].availabilityFrom.split(":");
      let availableToArr = staff[j].availabilityTo.split(":");

      let StaffAvailableForm = availableFromArr[0];
      let StaffAvailableTo = availableToArr[0];

      let userSelectedTime = ServiceNeededFrom.split("-");
      let temp1 = userSelectedTime[0].split(":");
      let temp2 = userSelectedTime[1].split(":");

      let userSelectedTime_Form = temp1[0];
      let userSelectedTime_To = temp2[0];

      // userSelectedTime_ = userSelectedTime[0] + ":00";
      //Logic to check userSelected Time lies between
      //staff's duty or not

      //Checking if userSelected time comes in between a staff duty
      //If yes then we proceed further else check for other staff member

      // let format = "hh:mm";
      // let time = moment(userSelectedTime_, format),
      //   beforeTime = moment(StaffAvailableForm, format),
      //   afterTime = moment(StaffAvailableTo, format);

      // if (time.isAfter(beforeTime) && time.isBefore(afterTime)) {
      //   liesBetween = true;
      // } else if (time.isSame(beforeTime) && time.isBefore(afterTime)) {
      //   liesBetween = true;
      // }

      let format = "hh";
      let user_From = moment(userSelectedTime_Form, format),
        staff_From = moment(StaffAvailableForm, format),
        staff_To = moment(StaffAvailableTo, format),
        user_To = moment(userSelectedTime_To, format);

      if (
        (user_From.isBetween(staff_From, staff_To) &&
          user_To.isBetween(staff_From, staff_To)) ||
        (user_From.isAfter(staff_From) && user_To.isSame(staff_To)) ||
        (user_From.isSame(staff_From) && user_To.isSame(staff_To)) ||
        (user_From.isSame(staff_From) && user_To.isBefore(staff_To))
      ) {
        liesBetween = true;
      }

      if (liesBetween) {
        for (let i = 0; i < userRequests.length; i++) {
          if (staffOnLeave || gotSlotBooked) break;
          if (staff[j]._id === userRequests[i].staffMemberAssigned._id) {
            bookedServiceFrom = userRequests[i].ServiceNeededTime.split("-");

            let temp = bookedServiceFrom[0].split(":");
            let temp1 = bookedServiceFrom[1].split(":");
            bookedServiceTo_ = temp[0];
            bookedServiceFrom_ = temp1[0];

            bookedServiceFrom_ = bookedServiceFrom_.replace(/^(?:00:)?0?/, "");

            //Checking If staff booked service time
            //lies between user requested time

            if (userRequests[i].ServiceNeededTime === ServiceNeededFrom) {
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
                let staffLeaveDateFrom = staffLeaves[z].leaveFrom.split("-");
                let staffLeaveDateTo = staffLeaves[z].leaveTo.split("-");
                let userSelectedDate = schedule.split("-");

                let staffLeaveDateFrom_ =
                  staffLeaveDateFrom[0] +
                  "/" +
                  staffLeaveDateFrom[1] +
                  "/" +
                  staffLeaveDateFrom[2];
                let staffLeaveDateTo_ =
                  staffLeaveDateTo[0] +
                  "/" +
                  staffLeaveDateTo[1] +
                  "/" +
                  staffLeaveDateTo[2];
                let userSelectedDate_ =
                  userSelectedDate[0] +
                  "/" +
                  userSelectedDate[1] +
                  "/" +
                  userSelectedDate[2];
                const compareDate = moment(userSelectedDate_, "YYYY/MM/DD");
                const startDate = moment(staffLeaveDateFrom_, "YYYY/MM/DD");
                const endDate = moment(staffLeaveDateTo_, "YYYY/MM/DD");
                const isBetween = compareDate.isBetween(startDate, endDate);
                if (
                  isBetween ||
                  compareDate.isSame(userSelectedDate_) ||
                  compareDate.isSame(staffLeaveDateTo_)
                ) {
                  staffOnLeave = true;
                  break;
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
          userRequest.ServiceNeededTime = doctorForm.ServiceNeededFrom;

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
      userRequest.ServiceNeededTime = doctorForm.ServiceNeededFrom;

      userRequest.ServiceID = doctorForm.service;
      userRequest.Schedule = doctorForm.schedule;
      // userRequest.Recursive = doctorForm.recursive;
      userRequest.Address = doctorForm.address;
      userRequest.PhoneNo = doctorForm.phoneno;
      userRequest.city = doctorForm.city;
      userRequest.email = doctorForm.email;

      try {
        await axios.post(config.apiEndPoint + "/confirmService", userRequest);

        // toast.success("Meeting Scheduled");
      } catch (ex) {
        toast.error(ex.response.data);
      }
      this.props.history.push("/Confirm/Meeting");

      return;
    } else if (tempArray.length === 0) {
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
        <article className="wrapper-user-req">
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
                    {this.renderInput(
                      "number",
                      "phoneno",
                      "phoneno",
                      "Phone No"
                    )}
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
                        "ServiceNeededFrom",
                        "Please Select Visiting Time"
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
        </article>
      </div>
    );
  }
}

export default UserRequestService;
