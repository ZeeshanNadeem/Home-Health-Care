import React, { Component } from "react";
import Form from "../Common/Form";
import Joi from "joi-browser";
import config from "../Api/config.json";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
class Leave extends Form {
  state = {
    doctorForm: {
      leave_from: "",
      leave_to: "",
    },
    user: "",
  };
  componentDidMount() {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    this.setState({ user });
  }

  schema = {
    leave_from: Joi.string().required().label("Leave From"),
    leave_to: Joi.string().required().label("Leave To"),
  };

  AssignAutomatedStaff = async (staffTookLeave) => {
    const { doctorForm } = this.state;
    const { schedule } = this.state.doctorForm;
    const { availabilityData, userRequests } = this.state;
    const { ServiceNeededFrom } = this.state.doctorForm;

    const { data: staff } = await axios.get(config.staff);
    const { staffLeaves } = this.state;
    let bookedServiceFrom_ = null;
    let bookedServiceFrom = null;
    let bookedServiceTo_ = null;
    let bookedServiceTo = null;
    let gotSlotBooked = false;
    let staffOnLeave = false;
    let liesBetween = false;

    for (let j = 0; j < staff.results.length; j++) {
      gotSlotBooked = false;
      staffOnLeave = false;
      liesBetween = false;
      let availableFromArr = staff.results[j].availabilityFrom.split(":");
      let availableToArr = staff.results[j].availabilityTo.split(":");

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
          if (
            staff.results[j]._id === userRequests[i].staffMemberAssigned._id
          ) {
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
            if (staff.results[j]._id === staffLeaves[z].staff._id) {
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
      // IF That staff is neither on leave nor got slot booked in that time
      // Assigning that staff a duty
      if (!gotSlotBooked && !staffOnLeave && liesBetween) {
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

        try {
          await axios.post(config.userRequest, userRequest);
          toast.success("Meeting Scheduled");
        } catch (ex) {
          toast.error(ex.response.data);
        }

        // break;
        return;
      }
    }
    if (gotSlotBooked || !liesBetween || staffOnLeave) {
      toast.error("No Availability For the Specified Time!");
      toast.error("Please Check Availability and then Schedule!");
    }
  };

  AssignSubstituteStaff = async () => {
    const { data } = await axios.get(
      config.apiEndPoint + `?staffMemberId=${user.staffMemberId}`
    );

    this.AssignAutomatedStaff(data);
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (!errors) {
      const leave = {
        leave_from: this.state.doctorForm.leave_from,
        leave_to: this.state.doctorForm.leave_to,
        staffID: this.state.user.staffMember._id,
      };
      try {
        await axios.post(config.apiEndPoint + "/staffLeave", leave);
        toast.success("Leave Scheduled!");
        this.AssignSubstituteStaff();
      } catch (ex) {
        toast.error(ex.response.data);
      }
    }
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        <ToastContainer />
        <div className="leave">
          <main className="card-signup staff-leave card-style animate__animated animate__fadeInLeft">
            <article>{this.renderLabel("From", "leave_from")}</article>
            <article>
              {this.renderInput(
                "date",
                "leave_from",
                "leave_from",
                "leave_from"
              )}
            </article>
            <article>{this.renderLabel("To", "leave_to")}</article>
            <article>
              {this.renderInput("date", "leave_to", "leave_to", "leave_to")}
            </article>
            <article className="staff-leave-btn">
              {this.renderBtn("Apply For Leave")}
            </article>
          </main>
        </div>
      </form>
    );
  }
}

export default Leave;
