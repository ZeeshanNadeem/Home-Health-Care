import React from "react";
import Joi from "joi-browser";
import axios from "axios";
import moment from "moment";
import config from "../Api/config.json";
import jwtDecode from "jwt-decode";
import "../UserRequestService/ModalData/CheckAvailability";

class Form extends React.Component {
  state = {
    doctorForm: {
      // fullName: "",
      // dateOfBirth: "",
      // staffType: "",
      // qualification: "",
      // email: "",
      // phone: "",
      // serviceName: "",
      // serviceOrgranization: "",
      // servicePrice: "",
      // //User Request
      // service: "",
      // organization: "",
      // schedule: "",
      // address: "",
      // phoneno: "",
      // addressCheckBox: "",
    },
    errors: {},
    availabilityData: [],
  };

  validateProperty = ({ value, name }) => {
    let dataProperty = { [name]: value };
    let subSchema = { [name]: this.schema[name] };

    const { error } = Joi.validate(dataProperty, subSchema);

    return error ? error.details[0].message : null;
  };

  validate = () => {
    const { error } = Joi.validate(this.state.doctorForm, this.schema, {
      abortEarly: false,
    });
    if (!error) return null;
    let errors = {};
    if (error) {
      for (let item of error.details) {
        errors[item.path] = item.message;
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  //Deleting those staff members who are on Leave.
  //When staff member leave comes in between user required service date.
  //Those staff members shouldn't be displayed in check availability
  StaffLeaves = async (staff) => {
    const { data: staffLeaves } = await axios.get(
      config.apiEndPoint + "/staffLeave"
    );

    const { schedule } = this.state.doctorForm;
    let filteredStaff = staff;

    for (let i = 0; i < staff.length; i++) {
      let staffOnLeave = false;
      for (let j = 0; j < staffLeaves.length; j++) {
        if (staff[i]._id === staffLeaves[j].staff._id) {
          if (staffLeaves[j].leaveFrom === schedule) {
            staffOnLeave = true;

            filteredStaff = filteredStaff.filter(
              (s) => s._id !== staffLeaves[j].staff._id
            );
          } else {
            let staffLeaveDateFrom = staffLeaves[j].leaveFrom.split("-");
            let staffLeaveDateTo = staffLeaves[j].leaveTo.split("-");
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
              compareDate.isSame(startDate) ||
              compareDate.isSame(endDate)
            ) {
              staffOnLeave = true;
              filteredStaff = filteredStaff.filter(
                (s) => s._id !== staffLeaves[j].staff._id
              );
            }
          }
        }
      }
    }
    return filteredStaff;
  };

  //Deleting those staff members who are currently on bookedSlots Leave.
  //When user requests a service on a date
  //When staff member's booked Slot comes in between user required service date.
  //Those staff members shouldn't be displayed in availableSlots
  StaffBookedSlots = async (staff) => {
    const { data: userRequests } = await axios.get(
      config.apiEndPoint + "/userRequests"
    );
    const { schedule } = this.state.doctorForm;

    for (let i = 0; i < staff.length; i++) {
      for (let j = 0; j < userRequests.length; j++) {
        if (staff[i]._id === userRequests[j].staffMemberAssigned._id) {
          if (userRequests[j].Schedule === schedule) {
            // let userSelectedTime = ServiceNeededFrom.split(":");
            // let userSelectedTime_ = userSelectedTime[0];
            // userSelectedTime_ = userSelectedTime_.replace(/^(?:)?0?/, "");
            // let userRequestsArr = userRequests[i].ServiceNeededFrom.split(":");
            // let userRequestServiceNeededFrom = userRequestsArr[0];
            // userRequestServiceNeededFrom = userRequestServiceNeededFrom.replace(
            //   /^(?:)?0?/,
            //   ""
            // );
            // let userRequestsToArr = userRequests[i].ServiceNeededTo.split(":");
            // let userRequestServiceNeededTo = userRequestsToArr[0];
            // userRequestServiceNeededTo = userRequestServiceNeededTo.replace(
            //   /^(?:)?0?/,
            //   ""
            // );
            // if (
            //   userSelectedTime_ >= userRequestServiceNeededFrom &&
            //   userSelectedTime_ <= userRequestServiceNeededTo
            // ) {
            //   if (staff.length === 0) {
            //     return staff;
            //   }
            //   staff = staff.filter(
            //     (s) => s._id !== userRequests[i].staffMemberAssigned._id
            //   );
            // }
          }
        }
      }
    }
    return staff;
  };

  //Checks whats slots of a staff member are available
  CheckAvailableStaff = () => {
    //Once there is a paticular staff member available at
    // a paticular time slot.No need to check other staff members
    // on that time slot.That slotTime  is being pushed in an array.
    // Skipping
    let slotTime = [
      "12AM to 3AM",
      "3AM to 6AM",
      "6AM to 9AM",
      "9AM to 12PM",
      "12PM to 3PM",
      "3PM to 6PM",
      "6PM to 9PM",
      "9PM to 12AM",
    ];
    const { availableSlots } = this.state;
    const { availabilityData: staffMember } = this.state.doctorForm;
    for (let i = 0; i < staffMember; i++) {
      for (let j = 0; j < slotTime; j++) {
        let checkSlot = availableSlots.some(
          (x) => x.timeSlot === slotTime && x.BookedSlot === false
        );
        if (checkSlot) return;

        let tempSlotTime = slotTime[j];
        let slotTimeFrom = "";
        let slotTimeTo = "";
        let slotTimeArr = slotTime[j].split("to");
        if (slotTimeArr[0].includes("AM")) {
          slotTimeFrom = slotTimeArr[0].split("AM");
          slotTimeFrom = slotTimeFrom[0];
          slotTimeFrom = slotTimeFrom.replace(/ /g, "");
          if (slotTimeFrom === "12") {
            slotTimeFrom = "00";
          }
          if (slotTimeFrom < 10 && slotTimeFrom !== "00")
            slotTimeFrom = "0" + slotTimeFrom.trim();
        } else {
          slotTimeFrom = slotTimeArr[0].split("PM");
          slotTimeFrom = slotTimeFrom[0];
          if (slotTimeFrom.trim() !== "12")
            slotTimeFrom = parseInt(slotTimeFrom.trim()) + 12;
          if (slotTimeFrom < 10 && slotTimeFrom !== "00")
            slotTimeFrom = "0" + slotTimeFrom.trim();
        }

        if (slotTimeArr[1].includes("AM")) {
          slotTimeTo = slotTimeArr[1].split("AM");
          slotTimeTo = slotTimeTo[0];
          if (slotTimeTo.trim() === "12") slotTimeTo = "00";

          if (slotTimeTo < 10 && slotTimeTo !== "00")
            slotTimeTo = "0" + slotTimeTo.trim();
        } else {
          slotTimeTo = slotTimeArr[1].split("PM");
          let temp = slotTimeTo[0];
          slotTime = "";
          slotTimeTo = temp;
          if (slotTimeTo.trim() !== "12") {
            let temp1 = parseInt(slotTimeTo.trim()) + 12;
            slotTimeTo = temp1;
          }
          if (slotTimeTo < 10 && slotTimeTo !== "00")
            slotTimeTo = "0" + slotTimeTo.trim();
        }

        if (typeof slotTimeFrom === "string") {
          slotTimeFrom = slotTimeFrom.trim();
        }

        if (typeof slotTimeTo === "string") slotTimeTo = slotTimeTo.trim();

        //Getting userRequests that have  been assigned a staff member each
        // const { data: userRequests } = await axios.get(config.userRequests);

        //Slots are predefined checking whether a
        //staff member's slot is free or busy
        // for (let i = 0; i < 8; i++) {
        // let availableFromStaff = staffMember.availabilityFrom.split(":");
        // let availableToStaff = staffMember.availabilityTo.split(":");
        // availableFromStaff[0] = availableFromStaff[0].replace(/^0+/, "");
        // availableToStaff[0] = availableToStaff[0].replace(/^0+/, "");

        let staffAvailableFrom = staffMember[i].availabilityFrom.split(":");
        let staffAvailableTo = staffMember[i].availabilityTo.split(":");

        let slotBooked = false;
        let liesBetween = false;
        // let check1 = false;
        // let check2 = false;

        //Checking if a slot lies between a staff member's duty
        //staff 3PM-9PM (15-21)
        // slotTime 12AM-3AM (24-3)

        let format = "hh";
        let staff_From = moment(staffAvailableFrom[0], format),
          slot_From = moment(slotTimeFrom, format),
          slot_To = moment(slotTimeTo, format),
          staff_To = moment(staffAvailableTo[0], format);

        if (
          (slot_From.isBetween(staff_From, staff_To) &&
            slot_To.isBetween(staff_From, staff_To)) ||
          (slot_From.isAfter(staff_From) && slot_To.isSame(staff_To)) ||
          (slot_From.isSame(staff_From) && slot_To.isSame(staff_To)) ||
          (slot_From.isSame(staff_From) && slot_To.isBefore(staff_To))
        ) {
          liesBetween = true;
        }

        // for (
        //   let count = parseInt(availableFromStaff[0]);
        //   count <= parseInt(availableToStaff[0]);
        //   count++
        // ) {
        //   if (parseInt(count) === parseInt(slotTimeFrom)) {
        //     check1 = true;
        //   }
        //   if (parseInt(count) === parseInt(slotTimeTo)) {
        //     check2 = true;
        //   }
        //   if (check1 && check2) {
        //     liesBetween = true;
        //     break;
        //   }
        // }
        if (liesBetween) {
          //Checking staff member's duty booked
          //On a slot or not.Slots are predefined
          //Staff members are sent to this function one by one
          // for (let j = 0; j < userRequests.length; j++) {
          // let staffTimeForm1 = slotTimeFrom.replace(/^0+/, "");
          // let staffTimeForm1 = slotTimeFrom.replace(/^0+/, "");
          const slotBookedOfStaffMember = this.getBookedSlots(
            staffMember[i],
            slotTimeFrom,
            slotTimeTo
          );

          if (slotBookedOfStaffMember) {
            //Slot is booked
            //We send false here
            //So on that basis cross could be represented

            //Checking if this timeSlot exists and tick is there
            let check = availableSlots.some(
              (x) => x.timeSlot === tempSlotTime && x.BookedSlot === false
            );

            //Checking if timeSlots exists and slot is booked means cross
            let check1 = availableSlots.some(
              (x) => x.timeSlot === tempSlotTime && x.BookedSlot === true
            );
            if (!check && !check1) {
              availableSlots.push({
                timeSlot: tempSlotTime,
                BookedSlot: true,
              });
            }
            slotBooked = true;
          }

          if (!slotBooked) {
            //Slot is not booked
            //We send true here
            //So on that basis tick could be represented
            //If any staff member is avaialable at a paticular slot
            //we just show tick as available there and push that time slot
            //in an array.Next time we don't need a check on that slot

            let check = availableSlots.some(
              (x) => x.timeSlot === tempSlotTime && x.BookedSlot === false
            );

            let check1 = availableSlots.some(
              (x) => x.timeSlot === tempSlotTime && x.BookedSlot === true
            );
            if (!check && !check1) {
              availableSlots.push({
                timeSlot: tempSlotTime,
                BookedSlot: false,
              });
            }
            if (check1) {
              if (availableSlots.length > 0) {
                for (let t = 0; t < availableSlots.length; t++) {
                  if (
                    availableSlots[t].timeSlot === tempSlotTime &&
                    availableSlots[t].BookedSlot === true
                  ) {
                    availableSlots[t].timeSlot = tempSlotTime;
                    availableSlots[t].BookedSlot = false;
                  }
                }
              }
            }

            return true;
          }
        } else {
          //Slot doesn't lie between staff member timing
          //We send false here
          //So on that basis cross could be represented

          let check = availableSlots.some(
            (x) => x.timeSlot === tempSlotTime && x.BookedSlot === false
          );

          let check1 = availableSlots.some(
            (x) => x.timeSlot === tempSlotTime && x.BookedSlot === true
          );
          if (!check && !check1) {
            availableSlots.push({
              timeSlot: tempSlotTime,
              BookedSlot: true,
            });
          }

          return false;
        }

        if (slotTime[j] === "9PM to 12AM") {
          // setTrack(av);
        }
      }
    }
  };

  //Checking booked slots of a staff
  //checking if a staff has got slots booked or not
  getBookedSlots = async (staff, slotTime) => {
    const { data: userRequests } = await axios.get(config.userRequests);
    let GotSlotBooked = false;
    for (let i = 0; i < userRequests.length; i++) {
      if (
        userRequests[i].staffMemberAssigned._id === staff._id &&
        userRequests[i].Schedule === this.state.doctorForm.schedule
      ) {
        if (userRequests[i].ServiceNeededTime === slotTime) {
          GotSlotBooked = true;
          break;
        }

        // let staffContainsSlot = userRequests.some(
        //   (req) =>
        //     req.ServiceNeededTime === slotTime &&
        //     req._id === staff._id &&
        //     req.Schedule === this.state.doctorForm.schedule
        // );
        // if (GotSlotBooked) {
        //   return true;
        // };
      }
    }
    return GotSlotBooked;
  };

  //when service,organization,date has been
  //selected if user has selected today's
  //date we filter time that has gone past
  filterTimeGonePastToday = (schedule, requestTime) => {
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getUTCFullYear();
    let TodayDate = year + "-" + month + "-" + day;

    // let requestTime = [...this.state.requestTime];

    let slotsToFilter = [];
    if (TodayDate === schedule) {
      for (let i = 0; i < requestTime.length; i++) {
        let currentHour = date.getHours();
        // let temp1 = requestTime[i]._id.split("-");
        // let slotFrom = temp1[0];
        // let slotTo = temp1[1];
        let currentMintues = date.getMinutes();
        if (currentMintues < 10) currentMintues = "0" + currentMintues;
        let format = "hh:mm";
        if (currentHour < 10) currentHour = "0" + currentHour;
        currentHour = currentHour + ":" + currentMintues;

        let slots = requestTime[i]._id.split("to");
        slots[0] = slots[0].trim();
        slots[1] = slots[1].trim();

        let slotFromConverted = "";
        if (slots[0].includes("PM")) {
          let temp1 = slots[0].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          slotFromConverted = temp1[0];
        } else {
          let temp1 = slots[0].split("AM");

          if (temp1[0] === "12") temp1[0] = "00";
          slotFromConverted = temp1[0];
        }

        let slotToConverted = "";
        if (slots[0].includes("PM")) {
          let temp1 = slots[1].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          slotToConverted = temp1[0];
        } else {
          let temp1 = slots[1].split("AM");

          if (temp1[0] === "12") temp1[0] = "00";
          slotToConverted = temp1[0];
        }

        slotFromConverted += ":00";
        slotToConverted += ":00";
        let currentHour_ = moment(currentHour, format),
          beforeTime = moment(slotFromConverted, format),
          afterTime = moment(slotToConverted, format);

        if (
          // currentHour_.isBetween(beforeTime, afterTime) ||
          currentHour_.isBefore(beforeTime, afterTime) ||
          currentHour_.isSame(beforeTime)
        ) {
        } else {
          slotsToFilter.push(requestTime[i]);
          // requestTime = requestTime.filter((x) => x !== requestTime[i]);
        }
      }

      if (slotsToFilter.length > 0) {
        for (let j = 0; j < slotsToFilter.length; j++) {
          requestTime = requestTime.filter((x) => x !== slotsToFilter[j]);
        }
      }
      // let format = "hh:mm";
      // let time = moment("02:00", format),
      //   beforeTime = moment("00:00", format),
      //   afterTime = moment("03:00", format);

      // if (time.isBetween(beforeTime, afterTime)) {
      //   console.log("is between");
      // } else {
      //   console.log("is not between");
      // }

      this.setState({ requestTime });
    } else this.setState({ requestTime });
   
  };

  //when service,organization,date has been
  //selected if user has selected today's
  //date we filter time that has gone past
  filterTimeGonePastTodayAvailability = (schedule, requestTime) => {
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getUTCFullYear();
    let TodayDate = year + "-" + month + "-" + day;

    // let requestTime = [...this.state.requestTime];

    let slotsToFilter = [];
    if (TodayDate === schedule) {
      for (let i = 0; i < requestTime.length; i++) {
        let currentHour = date.getHours();
        let currentMintues = date.getMinutes();
        if (currentMintues < 10) currentMintues = "0" + currentMintues;
        // let temp1 = requestTime[i]._id.split("-");
        // let slotFrom = temp1[0];
        // let slotTo = temp1[1];
        let format = "hh:mm";
        if (currentHour < 10) currentHour = "0" + currentHour;
        currentHour = currentHour + ":00";

        let slots = requestTime[i]._id.split("to");
        slots[0] = slots[0].trim();
        slots[1] = slots[1].trim();

        let slotFromConverted = "";
        if (slots[0].includes("PM")) {
          let temp1 = slots[0].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          slotFromConverted = temp1[0];
        } else {
          let temp1 = slots[0].split("AM");

          if (temp1[0] === "12") temp1[0] = "00";
          slotFromConverted = temp1[0];
        }

        let slotToConverted = "";
        if (slots[0].includes("PM")) {
          let temp1 = slots[1].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          slotToConverted = temp1[0];
        } else {
          let temp1 = slots[1].split("AM");

          if (temp1[0] === "12") temp1[0] = "00";
          slotToConverted = temp1[0];
        }

        slotFromConverted += currentMintues;
        slotToConverted += currentMintues;
        let currentHour_ = moment(currentHour, format),
          beforeTime = moment(slotFromConverted, format),
          afterTime = moment(slotToConverted, format);

        if (
          // currentHour_.isBetween(beforeTime, afterTime) ||
          currentHour_.isBefore(beforeTime, afterTime) ||
          currentHour_.isSame(beforeTime)
        ) {
        } else {
          slotsToFilter.push(requestTime[i]);
          // requestTime = requestTime.filter((x) => x !== requestTime[i]);
        }
      }

      if (slotsToFilter.length > 0) {
        for (let j = 0; j < slotsToFilter.length; j++) {
          requestTime = requestTime.filter((x) => x !== slotsToFilter[j]);
        }
      }

      return requestTime;
    }
    return requestTime;
  };

  //This function filters time slots whenever the staffAvailable is
  //determined.we show only that time slots in time dropdown on
  //which staff is available.Unavailable slot get filtered (booked slots)
  FilterNotAvailableSlots = async (schedule, serviceSelected) => {
    let track = [];

    let slotTime = [
      "12AM to 3AM",
      "3AM to 6AM",
      "6AM to 9AM",
      "9AM to 12PM",
      "12PM to 3PM",
      "3PM to 6PM",
      "6PM to 9PM",
      "9PM to 12AM",
    ];

    //62090281cb9bf2316c5853f8
    const doctorForm = { ...this.state.doctorForm };
    let { organization, service } = doctorForm;
    if (!service) service = serviceSelected;

    const m = moment(schedule);
    let dayNo = m.day();
    if (dayNo === 0) dayNo = "SUN";
    else if (dayNo === 1) dayNo = "MON";
    else if (dayNo === 2) dayNo = "TUE";
    else if (dayNo === 3) dayNo = "WED";
    else if (dayNo === 4) dayNo = "THRU";
    else if (dayNo === 5) dayNo = "FRI";
    else if (dayNo === 6) dayNo = "SAT";

    const lat= localStorage.getItem("lat")
    const lng= localStorage.getItem("lng")

    if(lat && lng){
    
      
    let { data: availabilityData } = await axios.get(
      config.staff +
        `/?day=${dayNo}&service=${serviceSelected}&organization=${organization}&city=${this.state.doctorForm.city}&lat=${lat}&lng=${lng}`
    );

   
    let { data: allStaff } = await axios.get(
      config.staff +
        `/?day=${dayNo}&service=${serviceSelected}&organization=${organization}&city=${this.state.doctorForm.city}&allStaff=true`
    );
    this.setState({ allStaff });
    availabilityData = await this.StaffLeaves(availabilityData);

    // const { availableSlots } = this.state;
    for (let i = 0; i < availabilityData.length; i++) {
      for (let j = 0; j < slotTime.length; j++) {
        let checkSlot = track.some(
          (x) => x.timeSlot === slotTime[j] && x.BookedSlot === false
        );
        if (checkSlot) continue;

        let staffContainsSlot = availabilityData[i].availableTime.some(
          (staff) => staff.time === slotTime[j] && staff.value === true
        );
        let slotBooked = false;
        if (staffContainsSlot) {
          //   //Checking staff member's duty booked
          //   //On a slot or not.Slots are predefined
          //   //Staff members are sent to this function one by one

          const slotBookedOfStaffMember = await this.getBookedSlots(
            availabilityData[i],
            slotTime[j]
          );

          if (slotBookedOfStaffMember) {
            //Slot is booked
            //We send false here
            //So on that basis cross could be represented

            //Checking if this timeSlot exists and tick is there
            let check = track.some(
              (x) => x.timeSlot === slotTime[j] && x.BookedSlot === false
            );

            //Checking if timeSlots exists and slot is booked means cross
            let check1 = track.some(
              (x) => x.timeSlot === slotTime[j] && x.BookedSlot === true
            );
            if (!check && !check1) {
              track.push({
                timeSlot: slotTime[j],
                BookedSlot: true,
              });
            }
            slotBooked = true;
          }

          if (!slotBooked) {
            //Slot is not booked
            //We send true here
            //So on that basis tick could be represented
            //If any staff member is avaialable at a paticular slot
            //we just show tick as available there and push that time slot
            //in an array.Next time we don't need a check on that slot

            let check = track.some(
              (x) => x.timeSlot === slotTime[j] && x.BookedSlot === false
            );

            let check1 = track.some(
              (x) => x.timeSlot === slotTime[j] && x.BookedSlot === true
            );
            if (!check && !check1) {
              track.push({
                timeSlot: slotTime[j],
                BookedSlot: false,
              });
            }
            if (check1) {
              if (track.length > 0) {
                for (let t = 0; t < track.length; t++) {
                  if (
                    track[t].timeSlot === slotTime[j] &&
                    track[t].BookedSlot === true
                  ) {
                    track[t].timeSlot = slotTime[j];
                    track[t].BookedSlot = false;
                    break;
                  }
                }
              }
            }
          }
        } else {
          //Slot doesn't lie between staff member timing
          //We send false here
          //So on that basis cross could be represented

          let check = track.some(
            (x) => x.timeSlot === slotTime[j] && x.BookedSlot === false
          );

          let check1 = track.some(
            (x) => x.timeSlot === slotTime[j] && x.BookedSlot === true
          );
          if (!check && !check1) {
            track.push({
              timeSlot: slotTime[j],
              BookedSlot: true,
            });
          }
        }
      }
    }

    if (track.length > 0) {
      const timeSlots = track.filter((time) => time.BookedSlot === false);
      let requestTime = [
        {
          _id: "12AM to 3AM",
          name: "12 AM to 3 AM",
        },
        {
          _id: "3AM to 6AM",
          name: "3 AM to 6 AM",
        },

        {
          _id: "6AM to 9AM",
          name: "6 AM to 9 AM",
        },
        {
          _id: "9AM to 12PM",
          name: "9 AM to 12 PM",
        },
        {
          _id: "12PM to 3PM",
          name: "12 PM to 3 PM",
        },
        {
          _id: "3PM to 6PM",
          name: "3 PM to 6 PM",
        },
        {
          _id: "6PM to 9PM",
          name: "6 PM to 9 PM",
        },
        {
          _id: "9PM to 12AM",
          name: "9 PM to 12 AM",
        },
      ];
      let filterReqTime = [];
      for (let i = 0; i < timeSlots.length; i++) {
        for (let j = 0; j < requestTime.length; j++) {
          if (timeSlots[i].timeSlot === requestTime[j]._id)
            filterReqTime.push(requestTime[j]);
        }
      }
      global.availableSlots = filterReqTime;

      // for (let i = 0; i < filterReqTime; i++) {}

      console.log("calling time gone past with ...", filterReqTime);
      // this.setState({ requestTime: filterReqTime });
      this.filterTimeGonePastToday(schedule, filterReqTime);

      // this.setState({ requestTime: filterReqTime });
    } else this.setState({ requestTime: availabilityData });

  }
  };

  //Task
  //Filter all Independent employees available
  async FilterAllIndependentEmployees(schedule, serviceSelected) {
    const jwt = localStorage.getItem("token");
    let user = "";
    if (jwt) {
      user = jwtDecode(jwt);
    }

    console.log("filter all employees:::user.city:::", user.city);
    let track = [];

    let slotTime = [
      "12AM to 3AM",
      "3AM to 6AM",
      "6AM to 9AM",
      "9AM to 12PM",
      "12PM to 3PM",
      "3PM to 6PM",
      "6PM to 9PM",
      "9PM to 12AM",
    ];

    //62090281cb9bf2316c5853f8
    const doctorForm = { ...this.state.doctorForm };
    let { organization, service } = doctorForm;
    if (!service) service = serviceSelected;

    const m = moment(schedule);
    let dayNo = m.day();
    if (dayNo === 0) dayNo = "SUN";
    else if (dayNo === 1) dayNo = "MON";
    else if (dayNo === 2) dayNo = "TUE";
    else if (dayNo === 3) dayNo = "WED";
    else if (dayNo === 4) dayNo = "THRU";
    else if (dayNo === 5) dayNo = "FRI";
    else if (dayNo === 6) dayNo = "SAT";
    let { data: availabilityData } = await axios.get(
      config.staff +
        `/?day=${dayNo}&service=${serviceSelected}&organization=${organization}`
    );

    availabilityData = await this.StaffLeaves(availabilityData);

    // const { availableSlots } = this.state;
    for (let i = 0; i < availabilityData.length; i++) {
      for (let j = 0; j < slotTime.length; j++) {
        let checkSlot = track.some(
          (x) => x.timeSlot === slotTime[j] && x.BookedSlot === false
        );
        if (checkSlot) continue;

        let staffContainsSlot = availabilityData[i].availableTime.some(
          (staff) => staff.time === slotTime[j] && staff.value === true
        );
        let slotBooked = false;
        if (staffContainsSlot) {
          //   //Checking staff member's duty booked
          //   //On a slot or not.Slots are predefined
          //   //Staff members are sent to this function one by one

          const slotBookedOfStaffMember = await this.getBookedSlots(
            availabilityData[i],
            slotTime[j]
          );

          if (slotBookedOfStaffMember) {
            //Slot is booked
            //We send false here
            //So on that basis cross could be represented

            //Checking if this timeSlot exists and tick is there
            let check = track.some(
              (x) => x.timeSlot === slotTime[j] && x.BookedSlot === false
            );

            //Checking if timeSlots exists and slot is booked means cross
            let check1 = track.some(
              (x) => x.timeSlot === slotTime[j] && x.BookedSlot === true
            );
            if (!check && !check1) {
              track.push({
                timeSlot: slotTime[j],
                name: availabilityData[i].fullname,
                rating: availabilityData[i].rating,
                distance: "1KM",
                BookedSlot: true,
              });
            }
            slotBooked = true;
          }

          if (!slotBooked) {
            //Slot is not booked
            //We send true here
            //So on that basis tick could be represented
            //If any staff member is avaialable at a paticular slot
            //we just show tick as available there and push that time slot
            //in an array.Next time we don't need a check on that slot

            let check = track.some(
              (x) => x.timeSlot === slotTime[j] && x.BookedSlot === false
            );

            let check1 = track.some(
              (x) => x.timeSlot === slotTime[j] && x.BookedSlot === true
            );
            if (!check && !check1) {
              track.push({
                timeSlot: slotTime[j],
                BookedSlot: false,
                free: "free",
                name: availabilityData[i].fullname,
                rating: availabilityData[i].rating,
                distance: "1KM",

                BookedSlot: true,
              });
            }
            if (check1) {
              if (track.length > 0) {
                for (let t = 0; t < track.length; t++) {
                  if (
                    track[t].timeSlot === slotTime[j] &&
                    track[t].BookedSlot === true
                  ) {
                    track[t].timeSlot = slotTime[j];
                    track[t].BookedSlot = false;
                    break;
                  }
                }
              }
            }
          }
        } else {
          //Slot doesn't lie between staff member timing
          //We send false here
          //So on that basis cross could be represented

          let check = track.some(
            (x) => x.timeSlot === slotTime[j] && x.BookedSlot === false
          );

          let check1 = track.some(
            (x) => x.timeSlot === slotTime[j] && x.BookedSlot === true
          );
          if (!check && !check1) {
            track.push({
              timeSlot: slotTime[j],
              BookedSlot: true,
              name: availabilityData[i].fullname,
              rating: availabilityData[i].rating,
              distance: "1KM",
            });
          }
        }
      }
    }

    if (track.length > 0) {
      const timeSlots = track.filter((time) => time.BookedSlot === false);
      let requestTime = [
        {
          _id: "12AM to 3AM",
          name: "12 AM to 3 AM",
        },
        {
          _id: "3AM to 6AM",
          name: "3 AM to 6 AM",
        },

        {
          _id: "6AM to 9AM",
          name: "6 AM to 9 AM",
        },
        {
          _id: "9AM to 12PM",
          name: "9 AM to 12 PM",
        },
        {
          _id: "12PM to 3PM",
          name: "12 PM to 3 PM",
        },
        {
          _id: "3PM to 6PM",
          name: "3 PM to 6 PM",
        },
        {
          _id: "6PM to 9PM",
          name: "6 PM to 9 PM",
        },
        {
          _id: "9PM to 12AM",
          name: "9 PM to 12 AM",
        },
      ];
      let filterReqTime = [];
      for (let i = 0; i < timeSlots.length; i++) {
        for (let j = 0; j < requestTime.length; j++) {
          if (timeSlots[i].timeSlot === requestTime[j]._id)
            filterReqTime.push(requestTime[j]);
        }
      }
      global.availableSlots = filterReqTime;

      // for (let i = 0; i < filterReqTime; i++) {}

      console.log("task!! ...");
      console.log("available staff:::", filterReqTime);
      // this.setState({ requestTime: filterReqTime });
      this.filterTimeGonePastToday(schedule, filterReqTime);

      // this.setState({ requestTime: filterReqTime });
    } else this.setState({ availabeIndependentStaff: availabilityData });
  }

  //Sets avaialable Staff in check availability popover
  // based on organization and service asked.
  //At schedule a service page
  scheduleTime = async (date, doctorForm) => {
    // const { service, organization } = this.state.doctorForm;
    if (doctorForm.service && doctorForm.organization) {
      const m = moment(doctorForm.schedule);

      const d = new Date();
      let dayNo = m.day();

      if (dayNo === 0) dayNo = "SUN";
      else if (dayNo === 1) dayNo = "MON";
      else if (dayNo === 2) dayNo = "TUE";
      else if (dayNo === 3) dayNo = "WED";
      else if (dayNo === 4) dayNo = "THRU";
      else if (dayNo === 5) dayNo = "FRI";
      else if (dayNo === 6) dayNo = "SAT";
      const { service: serviceGot } = doctorForm;
      const { organization: orgGot } = doctorForm;
      const { city } = doctorForm;
      const lat= localStorage.getItem("lat")
      const lng= localStorage.getItem("lng")
      if(lat && lng){
      const { data } = await axios.get(
        config.staff +
          `?day=${dayNo}&service=${serviceGot}&organization=${orgGot}&city=${city}&lat=${lat}&lng=${lng}`
      );

      // let filteredStaff_ = [];
      const filteredStaff = await this.StaffLeaves(data);

      // const filteredStaff_ = await this.filterTimeGonePastToday(filteredStaff);
      // filteredStaff_ = await this.StaffBookedSlots(filteredStaff);

      this.setState({ availabilityData: filteredStaff });
      }
      // if (filteredStaff.length > 0)
      //   this.setState({ availabilityData: filteredStaff });
      // else this.setState({ availabilityData: data });
    }
  };

  //When user selects an organization on a drop down on userRequest Page
  //Populating the current organization's services in the next dropdown that
  // is named service
  populateServices = async (inputValue) => {
    let { data } = await axios.get(
      `http://localhost:3000/api/services?organization=${inputValue}`
    );

    if (this.state.doctorForm.organization === "61d5bc5c69b35ef18754dc9a") {
      data.results = data.results.filter(
        (req) => req.user.isOrganizationAdmin === "Approved Independent Member"
      );
      let temp = [];
      let temp1 = [];
      for (let i = 0; i < data.results.length; i++) {
        temp.push({
          _id: data.results[i].IndependentService._id,
          serviceName: data.results[i].serviceName,
          servicePrice: data.results[i].servicePrice,
          serviceOrgranization: data.results[i].serviceOrgranization,
        });
      }
      temp1.push(temp[0]);
      for (let i = 0; i < temp.length; i++) {
        let foundDup = false;
        for (let j = 0; j < temp1.length; j++) {
          if (temp1[j].serviceName === temp[i].serviceName) {
            foundDup = true;
            break;
          }
        }
        if (!foundDup) temp1.push(temp[i]);
      }

      this.setState({ Conditionalservices: temp1 });
    } else this.setState({ Conditionalservices: data.results });
  };

  //This function puts all the available time in
  //time slot dropdown in userRequest Page
  filterTime = (schedule) => {
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getUTCFullYear();
    let TodayDate = year + "-" + month + "-" + day;

    let requestTime = [...this.state.requestTime];

    if (TodayDate === schedule) {
      for (let i = 0; i < requestTime.length; i++) {
        let currentHour = date.getHours();
        // let temp1 = requestTime[i]._id.split("-");
        // let slotFrom = temp1[0];
        // let slotTo = temp1[1];
        let format = "hh:mm";
        if (currentHour < 10) currentHour = "0" + currentHour;
        currentHour = currentHour + ":00";

        let slots = requestTime[i]._id.split("to");
        slots[0] = slots[0].trim();
        slots[1] = slots[1].trim();

        let slotFromConverted = "";
        if (slots[0].includes("PM")) {
          let temp1 = slots[0].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          slotFromConverted = temp1[0];
        } else {
          let temp1 = slots[0].split("AM");

          if (temp1[0] !== "12") temp1[0] = "00";
          slotFromConverted = temp1[0];
        }

        let slotToConverted = "";
        if (slots[0].includes("PM")) {
          let temp1 = slots[1].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          slotToConverted = temp1[0];
        } else {
          let temp1 = slots[1].split("AM");

          if (temp1[0] !== "12") temp1[0] = "00";
          slotToConverted = temp1[0];
        }

        slotFromConverted += ":00";
        slotToConverted += ":00";
        let currentHour_ = moment(currentHour, format),
          beforeTime = moment(slotFromConverted, format),
          afterTime = moment(slotToConverted, format);

        if (
          // currentHour_.isBetween(beforeTime, afterTime) ||
          currentHour_.isBefore(beforeTime, afterTime) ||
          currentHour_.isSame(beforeTime)
        ) {
        } else {
          delete requestTime[i];
        }
      }

      // let format = "hh:mm";
      // let time = moment("02:00", format),
      //   beforeTime = moment("00:00", format),
      //   afterTime = moment("03:00", format);

      // if (time.isBetween(beforeTime, afterTime)) {
      //   console.log("is between");
      // } else {
      //   console.log("is not between");
      // }

      this.setState({ requestTime });
    } else this.setState({ requestTime });
  };


  //This function checks if lon lat has changed
  //If Yes,It filter slots according to the location
  //specified by service taker
  myInterval= setInterval(()=>{
  
    const locationChanged=localStorage.getItem("locationChanged");
    if(locationChanged==="true"){
      const { service, organization, schedule, city } = this.state.doctorForm;
      if(locationChanged==="true" && service && organization && city){

        this.FilterNotAvailableSlots(schedule, service);
        this.filterTime(schedule);
        localStorage.setItem("locationChanged","false")
      }
    }
  
  }, 1000);

  handleChange = ({ currentTarget: input }) => {
    const errorMessage = this.validateProperty(input);
    const errors = { ...this.state.errors };
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    let requestTime = [
      {
        _id: "12AM to 3AM",
        name: "12 AM to 3 AM",
      },
      {
        _id: "3AM to 6AM",
        name: "3 AM to 6 AM",
      },

      {
        _id: "6AM to 9AM",
        name: "6 AM to 9 AM",
      },
      {
        _id: "9AM to 12PM",
        name: "9 AM to 12 PM",
      },
      {
        _id: "12PM to 3PM",
        name: "12 PM to 3 PM",
      },
      {
        _id: "3PM to 6PM",
        name: "3 PM to 6 PM",
      },
      {
        _id: "6PM to 9PM",
        name: "6 PM to 9 PM",
      },
      {
        _id: "9PM to 12AM",
        name: "9 PM to 12 AM",
      },
    ];
    if (input.name === "service") {
      const service = this.state.Conditionalservices.filter(
        (s) => s._id === input.value
      );

      console.log(service[0].serviceName.trim().toUpperCase())
      if (
        service.length > 0 &&
        service[0].serviceName.trim().toUpperCase() === "BABY VACINATION" ||
        service[0].serviceName.toUpperCase().includes("BABY VACCINATION")  ||
        service[0].serviceName.toUpperCase().includes("BABY VACINATION")  ||
        service[0].serviceName.toUpperCase().includes("VACINATION BABY") ||
        service[0].serviceName.toUpperCase().includes("BABY'S VACINATION")
      ) {
        this.setState({ vaccinationSelected: true });
      } else this.setState({ vaccinationSelected: false });
    }

   

    if (input.name === "phoneno" || input.name === "phone") {
      let phoneNo = input.value;
      if (phoneNo[0] !== "0" || phoneNo[1] !== "3" || phoneNo.length !== 11) {
        errors[input.name] = "Please Enter A Valid Phone No";
      }
    }
    //62090281cb9bf2316c5853f8
    const doctorForm = { ...this.state.doctorForm };
    doctorForm[input.name] = input.value;

    this.setState({ doctorForm, errors });

    const { service, organization, schedule, city } = doctorForm;

  
    if (
      (input.name === "schedule" && service && organization && city) ||
      (input.name === "service" && schedule && organization && city) ||
      (input.name === "organization" && service && schedule && city) ||
      (input.name === "city" && service && organization && schedule)
    ) {
      this.FilterNotAvailableSlots(schedule, service);
      this.filterTime(schedule);
    }
    if (input.name === "organization") {
      this.populateServices(input.value);
    } else if (service && organization) {
      this.scheduleTime(input.value, doctorForm);
    }
  };

  handleChangeForCheckBox = (e) => {
    const doctorForm = { ...this.state.doctorForm };
    doctorForm[e.currentTarget.name] = e.target.checked;
    this.setState({ doctorForm });
  };

  renderInput = (
    type,
    id,
    name,
    placeholder = "",
    minDate = "",
    maxDate = "",
    readonly = ""
  ) => {
    const { doctorForm, errors } = this.state;
    return (
      <article>
        <input
          name={name}
          value={doctorForm[name]}
          placeholder={placeholder}
          className="input"
          type={type}
          id={id}
          onChange={this.handleChange}
          min={minDate}
          max={maxDate}
          readOnly={readonly}
        />
        {errors && errors[name] && <p className="error">{errors[name]}</p>}
      </article>
    );
  };

  handleChangeForRadioBtn1 = () => {
    this.setState({ servicePlan: "Daily" });
  };

  renderRadioBtn1 = (id, name, label) => {
    return (
      <span>
        <input
          name={name}
          value={this.state.servicePlan}
          type="radio"
          id={id}
          onChange={this.handleChangeForRadioBtn1}
        />
        <label style={{ marginLeft: "0.2rem" }} htmlFor={id}>
          {label}
        </label>
      </span>
    );
  };

  handleChangeForRadioBtn2 = () => {
    this.setState({ servicePlan: "Weekly" });
  };

  renderRadioBtn2 = (id, name, label) => {
    return (
      <span>
        <input
          name={name}
          value={this.state.servicePlan}
          type="radio"
          id={id}
          onChange={this.handleChangeForRadioBtn2}
        />
        <label style={{ marginLeft: "0.2rem" }} htmlFor={id}>
          {label}
        </label>
      </span>
    );
  };

  handleChangeForRadioBtn3 = () => {
    this.setState({ servicePlan: "Weekly" });
  };

  renderRadioBtn3 = (id, name, label, checkedStatus) => {
    // if (!checkedStatus) {
    return (
      <span>
        <input
          name={name}
          value={this.state.servicePlan}
          type="radio"
          id={id}
          onChange={this.handleChangeForRadioBtn3}
          checked={checkedStatus}
        />
        <label style={{ marginLeft: "0.2rem" }} htmlFor={id}>
          {label}
        </label>
      </span>
    );
    // } else {
    //   return (
    //     <span>
    //       <input
    //         name={name}
    //         value={this.state.servicePlan}
    //         type="radio"
    //         id={id}
    //         checked
    //         onChange={this.handleChangeForRadioBtn3}
    //       />
    //       <label style={{ marginLeft: "0.2rem" }} htmlFor={id}>
    //         {label}
    //       </label>
    //     </span>
    //   );
    // }
  };

  onChangeFile = (e) => {
    // setFile(e.target.files[0]);
    const doctorForm = { ...this.state.doctorForm };
    doctorForm.selectedFile = e.target.files[0];
    this.setState({ doctorForm });
    // setFilename(e.target.files[0].name);
  };

  renderFile = (type, id, name, acceptFileType) => {
    const { doctorForm, errors } = this.state;

    return (
      <article>
        <input
          name={name}
          value={doctorForm[name]}
          className="txt-upload"
          type={type}
          accept={acceptFileType}
          id={id}
          onChange={this.onChangeFile}
        />
        {errors && errors[name] && <p className="error">{errors[name]}</p>}
      </article>
    );
  };

  renderLabel = (labelName, ForHtml) => {
    return <label htmlFor={ForHtml}>{labelName}</label>;
  };

  renderCheckBox = (id, name, value, msg) => {
    return (
      <article>
        <input
          type="checkbox"
          // checked="Only Once"
          id={id}
          name={name}
          // value={doctorForm[name]}
          onChange={this.handleChangeForCheckBox}
        />
        <label className="chkBox-Msg" htmlFor={id}>
          {msg}
        </label>
      </article>
    );
  };

  renderCheckBox2 = (id, name, value, msg) => {
    return (
      <span>
        <input
          type="checkbox"
          // checked="Only Once"
          id={id}
          name={name}
          // value={doctorForm[name]}
          onChange={this.handleChangeForCheckBox}
        />
        <label className="chkBox-Msg" htmlFor={id}>
          {msg}
        </label>
      </span>
    );
  };

  onChangeCheckBoxForDays = (e) => {
    const days = [...this.state.daysAvailable];

    const index = days.findIndex((day) => day.name === e.currentTarget.name);
    days[index].value = e.target.checked;

    let hasSelectedDay = this.state.daysAvailable.some(
      (day) => day.value === true
    );
    if (hasSelectedDay) this.setState({ days, hasSelectedDay: true });
    else if (!hasSelectedDay) this.setState({ days, hasSelectedDay: false });
    else this.setState({ days });
  };

  onChangeCheckBoxForSlots = (e) => {
    const slots = [...this.state.slotTime];

    const index = slots.findIndex((slot) => slot.name === e.currentTarget.name);
    slots[index].value = e.target.checked;

    let hasSelectedSlot = this.state.slotTime.some((day) => day.value === true);

    if (hasSelectedSlot) this.setState({ slots, hasSelectedSlot: true });
    else if (!hasSelectedSlot) this.setState({ slots, hasSelectedSlot: false });
    else this.setState({ slots });
  };

  renderCheckBoxForSlots = (id, name, value, msg) => {
    return (
      <article>
        <input
          type="checkbox"
          // checked="Only Once"
          id={id}
          name={name}
          // value={value}
          checked={value}
          onChange={this.onChangeCheckBoxForSlots}
        />
        <label className="chkBox-Msg" htmlFor={id}>
          {msg}
        </label>
      </article>
    );
  };

  renderCheckBoxForDays = (id, name, value, msg) => {
    return (
      <article>
        <input
          type="checkbox"
          // checked="Only Once"
          id={id}
          name={name}
          checked={value}
          onChange={this.onChangeCheckBoxForDays}
        />
        <label className="chkBox-Msg" htmlFor={id}>
          {msg}
        </label>
      </article>
    );
  };

  renderBtn = (label) => {
    return <button className="btns">{label}</button>;
  };

  renderConditionalDropDown = (id, name, label) => {
    const { doctorForm, errors, Conditionalservices } = this.state;

    return (
      <article>
        <select
          value={doctorForm[name]}
          name={name}
          id={id}
          className="form-select dropdown"
          aria-label="Default select example"
          onChange={this.handleChange}
        >
          {Conditionalservices.length > 0 ? (
            <option value="" key={label}>
              {label}
            </option>
          ) : (
            <option value="" key="">
              Choose An Organization First
            </option>
          )}
          {Conditionalservices ? (
            Conditionalservices.map((option) => (
              <option value={option._id} key={option._id}>
                {option.serviceName}
              </option>
            ))
          ) : (
            <option value="" key=""></option>
          )}
        </select>
        {errors && errors[name] && <p className="error">{errors[name]}</p>}
      </article>
    );
  };

  renderDropDown = (label, optionsArray, id, name, dropDownLabel = "") => {
    const { doctorForm, errors } = this.state;

    return (
      <article>
        {optionsArray.length > 0 ? (
          <select
            value={doctorForm[name]}
            name={name}
            id={id}
            className="form-select dropdown"
            aria-label="Default select example"
            onChange={this.handleChange}
          >
            <option value="">{dropDownLabel}</option>

            {optionsArray.length > 0 &&
              optionsArray.map((option) => (
                <option value={option._id || option} key={option._id || option}>
                  {option.serviceName || option.name || option}
                </option>
              ))}
          </select>
        ) : (
          <select
            value={doctorForm[name]}
            name={name}
            id={id}
            className="form-select dropdown"
            aria-label="Default select example"
            onChange={this.handleChange}
          >
            {name === "ServiceNeededFrom" && (
              <option value="">No Slot Available</option>
            )}
          </select>
        )}
        {errors && errors[name] && <p className="error">{errors[name]}</p>}
      </article>
    );
  };

  SmallDropDown = (optionsArray) => {
    return (
      <article>
        <select
          id=""
          className="small-dropdown"
          aria-label="Default select example"
        >
          {optionsArray.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </article>
    );
  };

  renderSmallButton = (btnName) => {
    return <button className="btns small-btn">{btnName}</button>;
  };

  renderMultiLineTextField = (rows, cols, id, name) => {
    const { doctorForm, errors } = this.state;
    return (
      <article>
        <textarea
          rows={rows}
          cols={cols}
          id={id}
          name={name}
          value={doctorForm[name]}
          onChange={this.handleChange}
        ></textarea>
        {errors && errors[name] && <p className="error er">{errors[name]}</p>}
      </article>
    );
  };
}

export default Form;
