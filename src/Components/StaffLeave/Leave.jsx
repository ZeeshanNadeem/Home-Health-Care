import React, { Component } from "react";
import Form from "../Common/Form";
import Joi from "joi-browser";
import config from "../Api/config.json";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import axios from "axios";
class Leave extends Form {
  state = {
    doctorForm: {
      leave_from: "",
      leave_to: "",
    },
    user: "",
    minDate: "",
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

  MatchUserSelected = (BookedStaffDate1) => {
    // let BookedStaffDate_ = BookedStaffDate.split("-");
    // let BookedStaffDateYear = BookedStaffDate_[0];
    // let BookedStaffDateMonth = BookedStaffDate_[1];
    // let BookedStaffDateDay = BookedStaffDate_[2];

    let BookedStaffDate = BookedStaffDate1.split("-");
    let BookedStaffDate_ =
      BookedStaffDate[0] + "/" + BookedStaffDate[1] + "/" + BookedStaffDate[2];

    // BookedStaffDateYear = BookedStaffDateYear.replace(/^(?:00:)?0?/, "");
    // BookedStaffDateMonth = BookedStaffDateMonth.replace(/^(?:00:)?0?/, "");
    // BookedStaffDateDay = BookedStaffDateDay.replace(/^(?:00:)?0?/, "");

    // let leave_from_ = this.state.doctorForm.leave_from.split("-");
    // let leave_from_year = leave_from_[0];
    // let leave_from_month = leave_from_[1];
    // let leave_from_day = leave_from_[2];

    // leave_from_year = leave_from_year.replace(/^(?:00:)?0?/, "");
    // leave_from_month = leave_from_month.replace(/^(?:00:)?0?/, "");
    // leave_from_day = leave_from_day.replace(/^(?:00:)?0?/, "");

    let leave_from = this.state.doctorForm.leave_from.split("-");
    let leave_from_ = leave_from[0] + "/" + leave_from[1] + "/" + leave_from[2];

    // let leave_to_ = this.state.doctorForm.leave_to.split("-");
    // let leave_to_year = leave_to_[0];
    // let leave_to_month = leave_to_[1];
    // let leave_to_day = leave_to_[2];

    // leave_to_year = leave_to_year.replace(/^(?:00:)?0?/, "");
    // leave_to_month = leave_to_month.replace(/^(?:00:)?0?/, "");
    // leave_to_day = leave_to_day.replace(/^(?:00:)?0?/, "");

    let leave_to = this.state.doctorForm.leave_to.split("-");
    let leave_to_ = leave_to[0] + "/" + leave_to[1] + "/" + leave_to[2];

    const compareDate = moment(BookedStaffDate_, "YYYY/MM/DD");
    const startDate = moment(leave_from_, "YYYY/MM/DD");
    const endDate = moment(leave_to_, "YYYY/MM/DD");
    const isBetween = compareDate.isBetween(startDate, endDate);
    if (
      isBetween ||
      compareDate.isSame(leave_from_) ||
      compareDate.isSame(leave_to_)
    ) {
      return true;
    } else {
      return false;
    }
    // if (
    //   BookedStaffDateYear >= leave_from_year &&
    //   BookedStaffDateYear <= leave_to_year
    // ) {
    //   if (
    //     BookedStaffDateMonth >= leave_from_month &&
    //     BookedStaffDateMonth <= leave_to_month
    //   ) {
    //     if (
    //       BookedStaffDateDay >= leave_from_day &&
    //       BookedStaffDateDay <= leave_to_day
    //     ) {
    //       return true;
    //     }
    //   }
    // } else {
    //   return false;
    // }
  };

  //This function reschedules duty of the staff member
  //who took leaves and assigns it to another staff member
  //with same organization and same designation (e.g nurse)
  AssignAutomatedStaffDuty = async (serviceDemander) => {
    const { Schedule, Service, Organization } = serviceDemander;
    const { data: userRequests } = await axios.get(
      config.apiEndPoint + `/userRequests`
    );
    const { ServiceNeededTime } = serviceDemander;
    const d = new Date();
    let day = d.getDay();

    if (day === "0") day = 7;
    // const { data: staff } = await axios.get(config.staff);

    const { data: staffGot } = await axios.get(
      config.staff +
        `/?day=${day}&service=${Service._id}&organization=${Organization._id}`
    );
    console.log(
      config.staff +
        `/?day=${day}&service=${Service._id}&organization=${Organization._id}`
    );
    const { data: staffLeaves } = await axios.get(
      config.apiEndPoint + "/staffLeave"
    );
    let bookedServiceFrom_ = null;
    let bookedServiceFrom = null;
    let bookedServiceTo_ = null;
    let bookedServiceTo = null;
    let gotSlotBooked = false;
    let staffOnLeave = false;
    let liesBetween = false;

    for (let j = 0; j < staffGot.length; j++) {
      gotSlotBooked = false;
      staffOnLeave = false;
      let liesBetween = false;

      let availableFromArr = staffGot[j].availabilityFrom.split(":");
      let availableToArr = staffGot[j].availabilityTo.split(":");

      let StaffAvailableForm = availableFromArr[0];
      let StaffAvailableTo = availableToArr[0];

      let userSelectedTime = ServiceNeededTime.split("-");

      let userSelectedTimeFrom_ = userSelectedTime[0];
      let userSelectedTimeTo_ = userSelectedTime[1];

      // userSelectedTime_ = userSelectedTime[0] + ":00";
      //Logic to check userSelected Time lies between
      //staff's duty or not

      //Checking if userSelected time comes in between a staff duty
      //If yes then we proceed further else check for other staff member

      let format = "hh:mm";
      let timeFrom = moment(userSelectedTimeFrom_, format),
        beforeTime = moment(StaffAvailableForm, format),
        afterTime = moment(StaffAvailableTo, format),
        timeTo = moment(userSelectedTimeTo_, format);

      if (
        (timeFrom.isBetween(beforeTime, afterTime) &&
          timeTo.isBetween(beforeTime, afterTime)) ||
        (timeFrom.isAfter(beforeTime) && timeTo.isSame(afterTime)) ||
        (timeFrom.isSame(beforeTime) && timeTo.isSame(afterTime)) ||
        (timeFrom.isSame(beforeTime) && timeTo.isBefore(afterTime))
      ) {
        liesBetween = true;
      }

      // gotSlotBooked = false;
      // staffOnLeave = false;
      // liesBetween = false;
      // let availableFromArr = staffGot[j].availabilityFrom.split(":");
      // let availableToArr = staffGot[j].availabilityTo.split(":");

      // let userSelectedTime = ServiceNeededFrom.split(":");
      // let availableFrom = availableFromArr[0];
      // let availabileTo = availableToArr[0];
      // let userSelectedTime_ = userSelectedTime[0];

      // if (
      //   userSelectedTime_ === "01" ||
      //   userSelectedTime_ === "02" ||
      //   userSelectedTime_ === "03" ||
      //   userSelectedTime_ === "04" ||
      //   userSelectedTime_ === "05" ||
      //   userSelectedTime_ === "06" ||
      //   userSelectedTime_ === "07" ||
      //   userSelectedTime_ === "08" ||
      //   userSelectedTime_ === "09"
      // ) {
      //   userSelectedTime_ = userSelectedTime_.replace(/^(?:00:)?0?/, "");
      // }
      // if (
      //   availableFrom === "01" ||
      //   availableFrom === "02" ||
      //   availableFrom === "03" ||
      //   availableFrom === "04" ||
      //   availableFrom === "05" ||
      //   availableFrom === "06" ||
      //   availableFrom === "07" ||
      //   availableFrom === "08" ||
      //   availableFrom === "09"
      // ) {
      //   availableFrom = availableFrom.replace(/^(?:00:)?0?/, "");
      // }

      // if (
      //   availabileTo === "01" ||
      //   availabileTo === "02" ||
      //   availabileTo === "03" ||
      //   availabileTo === "04" ||
      //   availabileTo === "05" ||
      //   availabileTo === "06" ||
      //   availabileTo === "07" ||
      //   availabileTo === "08" ||
      //   availabileTo === "09"
      // ) {
      //   availabileTo = availabileTo.replace(/^(?:00:)?0?/, "");
      // }
      // //Checking if userSelected time comes in between a staff duty
      // //If yes then we proceed further else check for other staff member
      // userSelectedTime_ = parseInt(userSelectedTime_.trim());
      // const StaffAvailableForm = parseInt(availableFrom.trim());
      // const StaffAvailableTo = parseInt(availabileTo.trim());

      // //Logic to check userSelected Time lies between
      // //staff's duty or not
      // for (let s = StaffAvailableForm; s <= StaffAvailableTo; s++) {
      //   if (s === userSelectedTime_) {
      //     liesBetween = true;
      //     break;
      //   }
      // }

      let userSelectedTime1 = ServiceNeededTime.split("-");
      let temp1 = userSelectedTime1[0];
      let temp2 = availableToArr[0];
      let userSelectedTimeFrom1_ = temp1[0];
      let userSelectedTimeTo1_ = temp2[0];

      if (liesBetween) {
        for (let i = 0; i < userRequests.length; i++) {
          if (staffOnLeave || gotSlotBooked) break;
          if (staffGot[j]._id === userRequests[i].staffMemberAssigned._id) {
            bookedServiceFrom = userRequests[i].ServiceNeededFrom.split(":");
            bookedServiceTo = userRequests[i].ServiceNeededTo.split(":");
            bookedServiceTo_ = bookedServiceTo[0];
            bookedServiceFrom_ = bookedServiceFrom[0];

            let format = "hh:mm:ss";
            let timeFrom_ = moment(userSelectedTimeFrom1_, format),
              beforeTime_ = moment(bookedServiceFrom_, format),
              afterTime_ = moment(bookedServiceTo_, format),
              timeTo_ = moment(userSelectedTimeTo1_, format);

            //Checking If staff booked service time
            //lies between user requested time
            //If time lies between then we check weather
            //its the day in between where user demands service
            //If yes then its slot is booked
            if (
              (timeFrom_.isBetween(beforeTime_, afterTime_) &&
                timeTo_.isBetween(beforeTime_, afterTime_)) ||
              (timeFrom_.isAfter(beforeTime_) && timeTo.isSame(afterTime_)) ||
              (timeFrom_.isSame(beforeTime_) && timeTo.isSame(afterTime_)) ||
              (timeFrom_.isSame(beforeTime_) && timeTo.isBefore(afterTime_))

              // userSelectedTime_ >= bookedServiceFrom_ &&
              // userSelectedTime_ <= bookedServiceTo_
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
            if (staffGot[j]._id === staffLeaves[z].staff._id) {
              if (staffLeaves[z].leaveFrom === Schedule) {
                staffOnLeave = true;
                break;
              } else {
                // const leaveFromArr = staffLeaves[z].leaveFrom.split("-");
                // const leaveToArr = staffLeaves[z].leaveTo.split("-");
                // const scheduleArr = Schedule.split("-");

                let leaveFromArr = staffLeaves[z].leaveFrom.split("-");
                let leaveToArr = staffLeaves[z].leaveTo.split("-");
                let scheduleArr = Schedule.split("-");

                // let leaveFormYear = leaveFromArr[0];
                // let leaveFormMonth = leaveFromArr[1];
                // let leaveFromDay = leaveFromArr[2];

                // let leaveToYear = leaveToArr[0];
                // let leaveToMonth = leaveToArr[1];
                // let leaveToDay = leaveToArr[2];

                // let userScheduleDateYear = scheduleArr[0];
                // let userScheduleDateMonth = scheduleArr[1];
                // let userScheduleDateDay = scheduleArr[2];

                // leaveFormYear = leaveFormYear.replace(/^(?:00:)?0?/, "");
                // leaveFormMonth = leaveFormMonth.replace(/^(?:00:)?0?/, "");
                // leaveFromDay = leaveFromDay.replace(/^(?:00:)?0?/, "");

                // leaveToYear = leaveToYear.replace(/^(?:00:)?0?/, "");
                // leaveToMonth = leaveToMonth.replace(/^(?:00:)?0?/, "");
                // leaveToDay = leaveToDay.replace(/^(?:00:)?0?/, "");

                // userScheduleDateYear = userScheduleDateYear.replace(
                //   /^(?:00:)?0?/,
                //   ""
                // );
                // userScheduleDateMonth = userScheduleDateMonth.replace(
                //   /^(?:00:)?0?/,
                //   ""
                // );
                // userScheduleDateDay = userScheduleDateDay.replace(
                //   /^(?:00:)?0?/,
                //   ""
                // );

                // if (
                //   userScheduleDateYear >= leaveFormYear &&
                //   userScheduleDateYear <= leaveToYear
                // ) {
                //   const checkBetweenMonths =
                //     leaveFormMonth - userScheduleDateMonth;
                //   const checkBetweenMonth2 =
                //     leaveToMonth - userScheduleDateMonth;

                //   if (checkBetweenMonths > 0 && checkBetweenMonth2 > 0) {
                //     staffOnLeave = true;
                //     break;
                //   }
                // }
                let leaveFrom_ =
                  leaveFromArr[0] +
                  "/" +
                  leaveFromArr[1] +
                  "/" +
                  leaveFromArr[2];

                let leaveTo_ =
                  leaveToArr[0] + "/" + leaveToArr[1] + "/" + leaveToArr[2];
                let schedule_ =
                  scheduleArr[0] + "/" + scheduleArr[1] + "/" + scheduleArr[2];

                const compareDate = moment(schedule_, "YYYY/MM/DD");
                const startDate = moment(leaveFrom_, "YYYY/MM/DD");
                const endDate = moment(leaveTo_, "YYYY/MM/DD");
                const isBetween = compareDate.isBetween(startDate, endDate);
                if (
                  isBetween ||
                  compareDate.isSame(leaveFrom_) ||
                  compareDate.isSame(leaveTo_)
                ) {
                  staffOnLeave = true;
                  break;
                }
              }
            }
          }
        }
      }
      // IF That staff is neither on leave nor got slot booked in that time
      // Assigning that staff a duty
      if (!gotSlotBooked && !staffOnLeave && liesBetween) {
        serviceDemander.staffMemberID = staffGot[j]._id;

        try {
          await axios.post(
            "http://localhost:3000/api/userRequests?assignDuty=abc",
            serviceDemander
          );
          toast.success("Leave Scheduled!");
          toast.success("Substitute Staff Member has been assigned");
        } catch (ex) {
          toast.error(ex.response.data);
        }

        // break;
        return;
      }
    }
    if (gotSlotBooked || !liesBetween || staffOnLeave) {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      serviceDemander.staffMemberID = user.staffMember._id;
      try {
        await axios.post(
          "http://localhost:3000/api/userRequests?assignDuty=abc",
          serviceDemander
        );
      } catch (ex) {
        toast.error(ex.response.data);
      }
      try {
        await axios.get(
          `http://localhost:3000/api/StaffLeave?delete=ab&id=${this.state.leaveGot._id}`
        );
      } catch (ex) {
        toast.error(ex.response.data);
      }

      toast.error("You can't take a leave on this date");
      toast.error("No Staff Member Availabile To Assign Your Shift!");
    }
  };

  //This function checks if the required staff member
  //who took leave its assigned duties need to rescheduled
  //or not
  ReScheduleDuty = async (userRequestStaff, leave_from, leave_to) => {
    let staffLeaveDateFrom = leave_from.split("-");
    let staffLeaveDateTo = leave_to.split("-");

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

    // let leave_from_ = leave_from.split("-");
    // let leave_form_year = leave_from_[0];
    // let leave_from_month = leave_from_[1];
    // let leave_from_day = leave_from_[2];

    // leave_form_year = leave_form_year.replace(/^(?:00:)?0?/, "");
    // leave_from_month = leave_from_month.replace(/^(?:00:)?0?/, "");
    // leave_from_day = leave_from_day.replace(/^(?:00:)?0?/, "");

    // let leave_to_ = leave_to.split("-");
    // let leave_to_year = leave_to_[0];
    // let leave_to_month = leave_to_[1];
    // let leave_to_day = leave_to_[2];

    // leave_to_year = leave_to_year.replace(/^(?:00:)?0?/, "");
    // leave_to_month = leave_to_month.replace(/^(?:00:)?0?/, "");
    // leave_to_day = leave_to_day.replace(/^(?:00:)?0?/, "");

    for (let i = 0; i < userRequestStaff.length; i++) {
      let userRequestDate = userRequestStaff[i].Schedule.split("-");
      let userRequestDate_ =
        userRequestDate[0] +
        "/" +
        userRequestDate[1] +
        "/" +
        userRequestDate[2];

      // let schedule = userRequestStaff[i].Schedule.split("-");
      // let scheduleYear = schedule[0];
      // let scheduleMonth = schedule[1];
      // let scheduleDay = schedule[2];

      // scheduleYear = scheduleYear.replace(/^(?:00:)?0?/, "");
      // scheduleMonth = scheduleMonth.replace(/^(?:00:)?0?/, "");
      // scheduleDay = scheduleDay.replace(/^(?:00:)?0?/, "");

      const {
        fullName,
        Organization,
        Service,
        Schedule,
        ServiceNeededTime,
        user,
        Email,
        rated,
        City,
        Address,
        PhoneNo,
      } = userRequestStaff[i];
      const customer = {
        fullName: fullName,
        Organization: Organization,
        Service: Service,
        Schedule: Schedule,
        ServiceNeededTime: ServiceNeededTime,
        userID: user._id,
        City: City,
        Email: Email,
        rated: rated,
        Address: Address,
        PhoneNo: PhoneNo,
      };

      const compareDate = moment(userRequestDate_, "YYYY/MM/DD");
      const startDate = moment(staffLeaveDateFrom_, "YYYY/MM/DD");
      const endDate = moment(staffLeaveDateTo_, "YYYY/MM/DD");
      const isBetween = compareDate.isBetween(startDate, endDate);
      if (
        isBetween ||
        compareDate.isSame(staffLeaveDateFrom_) ||
        compareDate.isSame(staffLeaveDateTo_)
      ) {
        await axios.delete(
          config.apiEndPoint + "/userRequests/" + userRequestStaff[i]._id
        );
        this.AssignAutomatedStaffDuty(customer);
      }

      // if (scheduleYear >= leave_form_year && scheduleYear <= leave_to_year) {
      //   if (leave_to_year > scheduleYear && leave_from_month <= scheduleMonth) {
      //     //leaves comes between duty

      //     if (
      //       leave_from_month === scheduleMonth &&
      //       scheduleDay >= leave_from_day
      //     ) {
      //       await axios.delete(
      //         config.apiEndPoint + "/userRequests/" + userRequestStaff[i]._id
      //       );
      //       this.AssignAutomatedStaffDuty(customer);
      //     } else {
      //       await axios.delete(
      //         config.apiEndPoint + "/userRequests/" + userRequestStaff[i]._id
      //       );
      //       this.AssignAutomatedStaffDuty(customer);
      //     }
      //   } else if (
      //     parseInt(scheduleMonth) >= parseInt(leave_from_month) &&
      //     parseInt(scheduleMonth) <= parseInt(leave_to_month)
      //   ) {
      //     if (
      //       leave_to_month === scheduleMonth &&
      //       scheduleDay >= leave_from_day &&
      //       scheduleDay <= leave_to_day
      //     ) {
      //       await axios.delete(
      //         config.apiEndPoint + "/userRequests/" + userRequestStaff[i]._id
      //       );
      //       this.AssignAutomatedStaffDuty(customer);
      //     } else if (leave_to_month !== scheduleMonth) {
      //       await axios.delete(
      //         config.apiEndPoint + "/userRequests/" + userRequestStaff[i]._id
      //       );
      //       this.AssignAutomatedStaffDuty(customer);
      //     }
      //   } else if (
      //     scheduleYear === leave_form_year &&
      //     scheduleYear === leave_to_year &&
      //     scheduleMonth === leave_from_month &&
      //     scheduleMonth === leave_to_month
      //   ) {
      //     if (scheduleDay >= leave_from_day && scheduleDay <= leave_to_day) {
      //       await axios.delete(
      //         config.apiEndPoint + "/userRequests/" + userRequestStaff[i]._id
      //       );
      //       this.AssignAutomatedStaffDuty(customer);
      //     }
      //   } else if (
      //     leave_from_month < scheduleMonth &&
      //     scheduleMonth < leave_to_month
      //   ) {
      //     await axios.delete(
      //       config.apiEndPoint + "/userRequests/" + userRequestStaff[i]._id
      //     );
      //     this.AssignAutomatedStaffDuty(customer);
      //   }
      // }
    }
  };

  AssignSubstituteStaff = async (leave_from, leave_to) => {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    const { data } = await axios.get(
      config.apiEndPoint + `/userRequests?staffMemberId=${user.staffMember._id}`
    );
    console.log(
      config.apiEndPoint + `/userRequests?staffMemberId=${user.staffMember._id}`
    );
    if (data.length === 0) toast.success("You have been granted leave ! ");
    else this.ReScheduleDuty(data, leave_from, leave_to);
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
        const { data: leaveGot } = await await axios.post(
          config.apiEndPoint + "/staffLeave",
          leave
        );

        // toast.success("Leave Scheduled!");
        this.setState({ leaveGot });
        this.AssignSubstituteStaff(leaveGot.leaveFrom, leaveGot.leaveTo);
      } catch (ex) {
        toast.error(ex.response.data);
      }
    }
  };
  render() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    let maxDate = year + "-" + month + "-" + "31";
    let minDate = year + "-" + month + "-" + day;
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        <ToastContainer />
        <div className="leave">
          <main className="card-signup staff-leave card-style animate__animated animate__fadeInLeft">
            <h2 className="leave-header">Leave</h2>

            <article>{this.renderLabel("From", "leave_from")}</article>
            <article>
              {this.renderInput(
                "date",
                "leave_from",
                "leave_from",
                "leave_from",
                minDate,
                maxDate
              )}
            </article>
            <article>{this.renderLabel("To", "leave_to")}</article>
            <article>
              {this.renderInput(
                "date",
                "leave_to",
                "leave_to",
                "leave_to",
                minDate,
                maxDate
              )}
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
