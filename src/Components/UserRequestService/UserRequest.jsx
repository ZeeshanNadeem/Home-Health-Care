import React from "react";
import Form from "../Common/Form";
import axios from "axios";
import Joi, { errors } from "joi-browser";
import moment from "moment";
import CheckAvailability from "./Modal/CheckAvailability";
import { toast, ToastContainer } from "react-toastify";
import jwtDecode from "jwt-decode";
import config from "../Api/config.json";
import VaccinationPlan from "./Modal/VaccinationPlan";
import BasicModal from "./Modal/AvailableStaffModal";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Button } from "react-bootstrap";
import { MapPin } from "react-feather";
import swal from "sweetalert";
import GetCurrentUser from "../CurrentUser/GetCurrentUser";
import Geocode from "react-geocode";

import MultiSelect from "../ReactMultiSelect/MultiSelect";

class UserRequestService extends Form {
  state = {
    doctorForm: {
      fullname: "",
      service: "",
      organization: "",
      schedule: "",
      address: "",
      phoneno: "",
      ServiceNeededFrom: "",
      noOfMeetings: "",
      email: "",
      // city: "",

      vaccination: false,
    },
    servicePlan: "None",
    staffUnavailable: false,
    organization: [],
    Conditionalservices: [],
    availabilityData: [],
    userRequests: [],
    errors: [],
    staffLeaves: [],
    cites: ["Islamabad", "Rawalpindi"],
    meetings: [3, 4, 5, 6, 7],
    requestTime: [
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
    ],
    serviceLocalityError: "",
    availableSlots: [],
    lat: "",
    lng: "",
    locationChanged: false,
    reschedule: false,
    patientLat: "",
    patientLng: "",
    selectedDay: [],
  };

  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    //current location
    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.setState({ lat: position.coords.latitude });
    //   this.setState({ lng: position.coords.longitude });
    // });

    //Conditionalservices
    //http://localhost:3000/api/services?UniqueService=true

    const { data } = await axios.get(
      config.apiEndPoint + "/services?UniqueService=true"
    );
    const current_user = GetCurrentUser();
    const { data: CurrentUser } = await axios.get(
      config.apiEndPoint + `/user?findUser_=${current_user._id}`
    );
    console.log("services!!!:", CurrentUser);
    this.setState({
      Conditionalservices: data,
      patientLat: CurrentUser.lat,
      patientLng: CurrentUser.lng,
      user: current_user,
    });

    const { data: meetingDetials } = await axios.get(
      config.apiEndPoint + "/confirmService"
    );

    if (meetingDetials.length >= 1) {
      for (let i = 0; i < meetingDetials.length; i++) {
        await axios.delete(
          config.apiEndPoint + "/confirmService/" + meetingDetials[i]._id
        );
      }
    }

    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);

    const rescheduleData = this.props.location.state;
    if (rescheduleData) {
      await axios.patch(
        config.apiEndPoint +
          `/userRequests?id=${rescheduleData._id}&rescheduleAppointment=true`,
        {
          status: true,
        }
      );
      const doctorForm = { ...this.state.doctorForm };
      doctorForm.fullname = rescheduleData.fullName;
      doctorForm.address = rescheduleData.Address;
      doctorForm.phoneno = rescheduleData.PhoneNo;
      doctorForm.city = rescheduleData.City;
      doctorForm.email = rescheduleData.Email;
      doctorForm.service = rescheduleData.Service._id;
      doctorForm.ServiceNeededFrom = rescheduleData.ServiceNeededTime;
      doctorForm.schedule = rescheduleData.Schedule;

      doctorForm.organization = rescheduleData.Organization._id;
      this.setState({ doctorForm, reschedule: true });
      localStorage.setItem("lat", rescheduleData.lat);
      localStorage.setItem("lng", rescheduleData.lng);
      localStorage.setItem("markers", JSON.stringify(rescheduleData.markers));

      this.populateServices(rescheduleData.Organization._id);

      this.FilterNotAvailableSlots(
        rescheduleData.Schedule,
        rescheduleData.Service._id
      );
      this.filterTime(rescheduleData.Schedule);
    } else {
      try {
        const { data } = await axios.get(
          config.apiEndPoint + `/userRequests?userID=${user._id}`
        );
        if (data[data.length - 1].VaccinationPlan !== true) {
          if (data.length > 0) {
            const doctorForm = { ...this.state.doctorForm };
            doctorForm.fullname = data[data.length - 1].fullName;
            doctorForm.address = data[data.length - 1].Address;
            doctorForm.phoneno = data[data.length - 1].PhoneNo;
            // doctorForm.city=data[data.length-1].City;
            doctorForm.email = data[data.length - 1].Email;
            doctorForm.service = data[data.length - 1].Service.serviceName;
            doctorForm.ServiceNeededFrom =
              data[data.length - 1].ServiceNeededTime;
            doctorForm.schedule = data[data.length - 1].Schedule;

            doctorForm.organization = data[data.length - 1].Organization._id;
            this.setState({ doctorForm });
            localStorage.setItem("lat", data[data.length - 1].lat);
            localStorage.setItem("lng", data[data.length - 1].lng);
            localStorage.setItem(
              "markers",
              JSON.stringify(data[data.length - 1].markers)
            );

            this.PopulateOrganizations();

            this.FilterNotAvailableSlots(
              data[data.length - 1].Schedule,
              data[data.length - 1].Service.serviceName
            );
            this.filterTime(data[data.length - 1].Schedule);
          }
        }
      } catch (ex) {
        console.log("ex::", ex);
      }
    }
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
    let isNotUndefined = false;
    for (let i = 0; i < this.state.requestTime; i++) {
      if (this.state.requestTime[i]._id & this.state.requestTime[i]._id) {
        isNotUndefined = true;
        break;
      }
    }
    if (!isNotUndefined) {
      this.setState({ requestTime: [] });
    }

    this.setState({
      // organization: organization.results,
      organization: [],
      userRequests,
      staffLeaves,
    });
    this.props.setProgress(20);
    let date = new Date();
    let month = date.getMonth() + 1;
    var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    let maxDate = year + "-" + month + "-" + lastDayOfMonth.getDate();
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
    vaccination: Joi.boolean(),
    schedule: Joi.string().required().label("Date"),
    address: Joi.string().required().label("Address"),
    phoneno: Joi.number().required().label("Phone No"),
    ServiceNeededFrom: Joi.string().required().label("Time"),
    email: Joi.string().required().email().label("Email"),
    noOfMeetings: Joi.string().required().label("Meetings Plan"),
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

  assignDutyOnServicePlan = async () => {
    const { doctorForm } = this.state;
    const { userRequests } = this.state;
    const { ServiceNeededFrom } = this.state.doctorForm;
    const { organization, service } = this.state.doctorForm;
    const m = moment(this.state.doctorForm.schedule);

    let dayNo = m.day();
    if (dayNo === 0) dayNo = "SUN";
    else if (dayNo === 1) dayNo = "MON";
    else if (dayNo === 2) dayNo = "TUE";
    else if (dayNo === 3) dayNo = "WED";
    else if (dayNo === 4) dayNo = "THRU";
    else if (dayNo === 5) dayNo = "FRI";
    else if (dayNo === 6) dayNo = "SAT";
    // const { data: staff } = await axios.get(
    //   config.staff +
    //     `/?day=${dayNo}&service=${service}&organization=${organization}`
    // );

    const { data: staff } = await axios.get(
      config.staff +
        `/?service=${service}&organization=${organization}&findStaffOnOrg=true`
    );
    // const { data: staff } = await axios.get(config.staff);

    const { staffLeaves } = this.state;

    let gotSlotBooked = false;
    let staffOnLeave = false;

    let tempArray = [];
    const { noOfMeetings: totalMeetings } = this.state.doctorForm;

    let FullDate1 = new Date(this.state.doctorForm.schedule);

    let day_ = FullDate1.getDate();
    let month_ = FullDate1.getMonth() + 1;
    const year_ = FullDate1.getFullYear();
    if (month_ < 10) month_ = "0" + month_;
    if (day_ < 10) day_ = "0" + day_;
    let FristDayServiceDate = year_ + "-" + month_ + "-" + day_;
    const days = JSON.parse(localStorage.getItem("daysSelectedWeekly"));
    // let noOfStaffMembersChosen = [];

    if (this.state.doctorForm.vaccination) {
      let furtherDates = [];
      furtherDates.push(37);
      furtherDates.push(65);
      furtherDates.push(85);
      furtherDates.push(289);

      for (let j = 0; j < staff.length; j++) {
        for (let meetings = 0; meetings < 5; meetings++) {
          gotSlotBooked = false;
          staffOnLeave = false;
          // let liesBetween = false;

          let dayAvailable = new Date(FristDayServiceDate);
          let d = dayAvailable.getDay();
          if (d === 0) d = "SUN";
          else if (d === 1) d = "MON";
          else if (d === 2) d = "TUE";
          else if (d === 3) d = "WED";
          else if (d === 4) d = "THRU";
          else if (d === 5) d = "FRI";
          else if (d === 6) d = "SAT";

          let checkDayAvailability = staff[j].availableDays.some(
            (staff) => staff.name === d && staff.value === true
          );
          if (!checkDayAvailability) continue;

          let staffContainsSlot = staff[j].availableTime.some(
            (staff) => staff.time === ServiceNeededFrom && staff.value === true
          );

          if (staffContainsSlot) {
            for (let i = 0; i < userRequests.length; i++) {
              if (staffOnLeave || gotSlotBooked) continue;
              if (staff[j]._id === userRequests[i].staffMemberAssigned._id) {
                //Checking If staff booked service time
                //lies between user requested time

                if (userRequests[i].ServiceNeededTime === ServiceNeededFrom) {
                  const staffDutyOnSameDay =
                    this.MatchUserSelected(FristDayServiceDate);
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
                  if (staffLeaves[z].leaveFrom === FristDayServiceDate) {
                    staffOnLeave = true;
                    break;
                  } else {
                    let staffLeaveDateFrom =
                      staffLeaves[z].leaveFrom.split("-");
                    let staffLeaveDateTo = staffLeaves[z].leaveTo.split("-");
                    let userSelectedDate = FristDayServiceDate.split("-");

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
                      break;
                    }
                  }
                }
              }
            }
          }
          if (!gotSlotBooked && !staffOnLeave && staffContainsSlot) {
            tempArray.push(staff[j]);

            // let temp = noOfStaffMembersChosen.filter(
            //   (s) => s._id === staff[j]._id
            // );
            // if (temp.length === 0) noOfStaffMembersChosen.push(staff[j]);

            let temp = new Date(FristDayServiceDate);
            // const FullDate1 = new Date(new Date().setDate(date.getDate() + 42));
            let FullDate1 = null;
            FullDate1 = new Date(
              new Date(FristDayServiceDate).setDate(
                temp.getDate() + furtherDates[meetings]
              )
            );

            let day_ = FullDate1.getDate();
            let month_ = FullDate1.getMonth() + 1;
            const year_ = FullDate1.getFullYear();
            if (month_ < 10) month_ = "0" + month_;
            if (day_ < 10) day_ = "0" + day_;
            FristDayServiceDate = year_ + "-" + month_ + "-" + day_;
          }
        }
        // IF That staff is neither on leave nor got slot booked in that time
        //Assigning that staff a duty
        if (j === staff.length - 1) {
          //Assigning duty on the basis of rating
          if (tempArray.length > 0) {
            const userRequest = {};

            tempArray.sort((a, b) =>
              parseInt(a.Rating) > parseInt(b.Rating) ? -1 : 1
            );

            for (let i = 0; i < 5; i++) {
              if (i === tempArray.length) {
                break;
              }
              let fristDayDateService = "";

              //  let FullDate1 = new Date(
              //    new Date(FristDayServiceDate).setDate(temp.getDate() + 1)
              //  );
              let FullDate1 = null;
              if (i === 0) {
                FullDate1 = new Date(this.state.doctorForm.schedule);
              } else {
                let temp = new Date(this.state.doctorForm.schedule);
                FullDate1 = new Date(
                  new Date().setDate(temp.getDate() + furtherDates[i - 1])
                );
              }
              let day_ = FullDate1.getDate();
              let month_ = FullDate1.getMonth() + 1;
              const year_ = FullDate1.getFullYear();
              if (month_ < 10) month_ = "0" + month_;
              if (day_ < 10) day_ = "0" + day_;

              fristDayDateService = year_ + "-" + month_ + "-" + day_;

              userRequest.fullName = doctorForm.fullname;
              userRequest.userID = this.state.user._id;
              userRequest.staffMemberID = tempArray[i]._id;
              userRequest.OrganizationID = doctorForm.organization;
              userRequest.vaccination = doctorForm.vaccination;
              userRequest.ServiceNeededTime = doctorForm.ServiceNeededFrom;

              userRequest.ServiceID = doctorForm.service;

              userRequest.Schedule = fristDayDateService;

              userRequest.Address = doctorForm.address;
              userRequest.PhoneNo = doctorForm.phoneno;
              userRequest.city = doctorForm.city;
              userRequest.email = doctorForm.email;
              userRequest.totalMeetingsRequested = 5;

              try {
                await axios.post(
                  config.apiEndPoint + "/confirmService",
                  userRequest
                );

                // toast.success("Meeting Scheduled");
              } catch (ex) {
                toast.error(ex.response.data);
              }
              // this.props.history.push("/Confirm/Meeting");
              // }
              // return;
            }
          }
        }
      }
    } else {
      //Weekly And Daily Code

      const { doctorForm, servicePlan } = this.state;

      if (servicePlan === "Weekly" || servicePlan === "Daily") {
        let userRequest = {};

        const { data: serviceCost } = await axios.get(
          config.apiEndPoint +
            `/services?service=${doctorForm.service}&organizationID=${doctorForm.organization}&getServiceCost=true`
        );

        const org = this.state.organization.filter(
          (x) => x._id === doctorForm.organization
        );

        userRequest.fullName = doctorForm.fullname;
        userRequest.userID = this.state.user._id;
        userRequest.vaccination = doctorForm.vaccination;
        userRequest.ServiceNeededTime = doctorForm.ServiceNeededFrom;
        userRequest.OrganizationID = doctorForm.organization;
        userRequest.email = doctorForm.email;
        userRequest.ServiceID = doctorForm.service;
        userRequest.cost = serviceCost;
        userRequest.Schedule = doctorForm.schedule;
        userRequest.orgName = org[0].name;
        userRequest.servicePlan = this.state.servicePlan;
        userRequest.Address = doctorForm.address;
        userRequest.PhoneNo = doctorForm.phoneno;
        userRequest.repeatedMeetingsNo = parseInt(doctorForm.noOfMeetings) + 1;

        const days = JSON.parse(localStorage.getItem("daysSelectedWeekly"));
        if (days && days.length > 0) {
          userRequest.days = days;
        }
        try {
          this.props.history.push("/Confirm/Meeting", userRequest);
          // await axios.post(
          //   config.apiEndPoint + `/confirmService?repeated=true&servicePlan=${servicePlan}&service=${doctorForm.service}&organization=${doctorForm.organization}`,
          //   userRequest
          // );
        } catch (ex) {
          toast.error(ex.response.data);
        }
      }
    }
    if (tempArray.length > 0) {
      global.servicePlan = this.state.servicePlan;

      global.totalMeetings = parseInt(totalMeetings);
      if (this.state.reschedule)
        this.props.history.push("/Confirm/Meeting", this.props.location.state);
      else this.props.history.push("/Confirm/Meeting");
    }
  };

  distance = (lat1, lat2, lon1, lon2) => {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = (lon1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return c * r;
  };

  AssignAutomatedStaff = async () => {
    if (
      this.state.doctorForm.noOfMeetings ||
      this.state.doctorForm.vaccination ||
      this.state.servicePlan === "Weekly"
    ) {
      await this.assignDutyOnServicePlan();

      return;
    }
    const { doctorForm } = this.state;
    const { schedule } = this.state.doctorForm;
    const { availabilityData, userRequests } = this.state;
    const { ServiceNeededFrom } = this.state.doctorForm;
    const { organization, service, city } = this.state.doctorForm;
    const m = moment(this.state.doctorForm.schedule);
    let dayNo = m.day();
    // const lat= localStorage.getItem("lat")
    // const lng= localStorage.getItem("lng")
    if (dayNo === 0) dayNo = "SUN";
    else if (dayNo === 1) dayNo = "MON";
    else if (dayNo === 2) dayNo = "TUE";
    else if (dayNo === 3) dayNo = "WED";
    else if (dayNo === 4) dayNo = "THRU";
    else if (dayNo === 5) dayNo = "FRI";
    else if (dayNo === 6) dayNo = "SAT";

    // if(lat && lng){
      
    const { patientLat, patientLng } = this.state;
    const { data: staff } = await axios.get(
      config.staff +
        `/?day=${dayNo}&service=${service}&organization=${organization}&city=${city}&lat=${patientLat}&lng=${patientLng}`
    );
    console.log("all Staff:", staff);

    const { staffLeaves } = this.state;

    let gotSlotBooked = false;
    let staffOnLeave = false;

    let tempArray = [];

    for (let j = 0; j < staff.length; j++) {
      gotSlotBooked = false;
      staffOnLeave = false;
      let liesBetween = false;

      let staffContainsSlot = staff[j].availableTime.some(
        (staff) => staff.time === ServiceNeededFrom && staff.value === true
      );

      if (staffContainsSlot) {
        for (let i = 0; i < userRequests.length; i++) {
          if (staffOnLeave || gotSlotBooked) break;
          if (staff[j]._id === userRequests[i].staffMemberAssigned._id) {
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
                  compareDate.isSame(startDate) ||
                  compareDate.isSame(endDate)
                ) {
                  staffOnLeave = true;
                  break;
                }
              }
            }
          }
        }
      }
      if (!gotSlotBooked && !staffOnLeave && staffContainsSlot) {
        const d = this.distance(
          this.state.lat,
          staff[j].lat,
          this.state.lng,
          staff[j].lng
        );
        const distance = parseInt(d);
        staff[j].distance = distance;
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
          userRequest.vaccination = doctorForm.vaccination;
          userRequest.ServiceNeededTime = doctorForm.ServiceNeededFrom;

          userRequest.ServiceID = doctorForm.service;
          userRequest.Schedule = doctorForm.schedule;
          // userRequest.Recursive = doctorForm.recursive;
          userRequest.Address = doctorForm.address;
          userRequest.PhoneNo = doctorForm.phoneno;
          userRequest.city = doctorForm.city;
          userRequest.email = doctorForm.email;
          userRequest.lat = patientLat;
          userRequest.lng = patientLng;

          console.log("userReq:", userRequest);
          try {
            await axios.post(
              config.apiEndPoint + "/confirmService",
              userRequest
            );
            this.props.history.push("/Confirm/Meeting");
            // toast.success("Meeting Scheduled");
          } catch (ex) {
            console.log("userRequest exception:", ex);
            // toast.error(ex.response.data);
          }

          return;
        }
      }
    }

    // tempArray.sort((a, b) => (a.distance > b.distance ? 1 : -1));

    //Assigning duty on the basis of rating
    if (tempArray.length > 0) {
      tempArray.sort((a, b) => (a.Rating > b.Rating ? -1 : 1));

      // if (!maxIndex) maxIndex = 0;
      if (doctorForm.vaccination) {
        let temp = new Date(this.state.doctorForm.schedule);
        const FullDate1 = new Date(new Date().setDate(temp.getDate() + 37));
        const FullDate2 = new Date(new Date().setDate(temp.getDate() + 65));
        const FullDate3 = new Date(new Date().setDate(temp.getDate() + 85));
        const FullDate4 = new Date(new Date().setDate(temp.getDate() + 289));

        let day_ = FullDate1.getDate();
        let month_ = FullDate1.getMonth() + 1;
        const year_ = FullDate1.getFullYear();
        if (month_ < 10) month_ = "0" + month_;
        if (day_ < 10) day_ = "0" + day_;

        let fristDoseDate = year_ + "-" + month_ + "-" + day_;

        let day1_ = FullDate2.getDate();
        let month1_ = FullDate2.getMonth() + 1;
        const year1_ = FullDate2.getFullYear();
        if (month1_ < 10) month1_ = "0" + month1_;
        if (day1_ < 10) day1_ = "0" + day1_;

        let secondDoseDate = year1_ + "-" + month1_ + "-" + day1_;

        let day2_ = FullDate3.getDate();
        let month2_ = FullDate3.getMonth() + 1;
        const year2_ = FullDate3.getFullYear();
        if (month2_ < 10) month2_ = "0" + month2_;
        if (day2_ < 10) day2_ = "0" + day2_;

        let thirdDoseDate = year2_ + "-" + month2_ + "-" + day2_;

        let day3_ = FullDate4.getDate();
        let month3_ = FullDate4.getMonth() + 1;
        const year3_ = FullDate4.getFullYear();
        if (month3_ < 10) month3_ = "0" + month3_;
        if (day3_ < 10) day3_ = "0" + day3_;

        let fourthDoseDate = year3_ + "-" + month3_ + "-" + day3_;

        let doseDateArray = [
          fristDoseDate,
          secondDoseDate,
          thirdDoseDate,
          fourthDoseDate,
        ];

        const userRequest = {};
        userRequest.fullName = doctorForm.fullname;
        userRequest.userID = this.state.user._id;
        userRequest.staffMemberID = tempArray[0]._id;
        userRequest.OrganizationID = doctorForm.organization;
        userRequest.ServiceNeededTime = doctorForm.ServiceNeededFrom;
        userRequest.vaccination = doctorForm.vaccination;
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

        for (let i = 0; i < doseDateArray.length; i++) {
          const userRequest = {};
          userRequest.fullName = doctorForm.fullname;
          userRequest.userID = this.state.user._id;
          userRequest.staffMemberID = tempArray[0]._id;
          userRequest.OrganizationID = doctorForm.organization;
          userRequest.ServiceNeededTime = doctorForm.ServiceNeededFrom;
          userRequest.vaccination = doctorForm.vaccination;
          userRequest.ServiceID = doctorForm.service;
          userRequest.Schedule = doseDateArray[i];
          userRequest.Address = doctorForm.address;
          userRequest.PhoneNo = doctorForm.phoneno;
          userRequest.city = doctorForm.city;
          userRequest.email = doctorForm.email;
          console.log(userRequest);
          try {
            await axios.post(
              config.apiEndPoint + "/confirmService",
              userRequest
            );

            // toast.success("Meeting Scheduled");
          } catch (ex) {
            toast.error(ex.response.data);
          }
        }
        this.props.history.push("/Confirm/Meeting");

        return;
      } else {
        const userRequest = {};
        userRequest.fullName = doctorForm.fullname;
        userRequest.userID = this.state.user._id;
        userRequest.staffMemberID = tempArray[0]._id;
        userRequest.OrganizationID = doctorForm.organization;
        userRequest.ServiceNeededTime = doctorForm.ServiceNeededFrom;
        userRequest.vaccination = doctorForm.vaccination;
        userRequest.ServiceID = doctorForm.service;
        userRequest.Schedule = doctorForm.schedule;
        // userRequest.Recursive = doctorForm.recursive;
        userRequest.Address = doctorForm.address;
        userRequest.PhoneNo = doctorForm.phoneno;
        // userRequest.city = doctorForm.city;
        userRequest.email = doctorForm.email;
        userRequest.lat = this.state.patientLat;
        userRequest.lng = this.state.patientLng;

        // userRequest.markers = JSON.parse(localStorage.getItem("markers"));

        try {
          await axios.post(config.apiEndPoint + "/confirmService", userRequest);
          if (this.props.location.state) {
            userRequest._id = this.props.location.state._id;
            this.props.history.push("/Confirm/Meeting", userRequest);
          } else {
            this.props.history.push("/Confirm/Meeting");
          }
          // toast.success("Meeting Scheduled");
        } catch (ex) {
          toast.error(ex.response.data);
        }

        return;
      }
    } else if (tempArray.length === 0) {
      toast.error("No Availability For the Specified Time!");
      toast.error("Please Check Availability and then Schedule!");
    }

    // }
    // if (gotSlotBooked || !liesBetween || staffOnLeave ) {
    //   toast.error("No Availability For the Specified Time!");
    //   toast.error("Please Check Availability and then Schedule!");
    // }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    // const radius= localStorage.getItem("radius");

    let errors = this.validate();
    if (this.state.servicePlan === "None") {
      delete errors["noOfMeetings"];
      if (!errors || Object.keys(errors).length === 0) errors = {};
    }
    this.setState({ errors: errors || {} });
    const errorClass = errors ? "errorClass" : "";
    this.setState({ errorClass });
    if (!errors || Object.keys(errors).length === 0)
      await this.AssignAutomatedStaff();
  };

  render() {
    const { organization, availabilityData } = this.state;
    const { schedule } = this.state.doctorForm;

    return (
      <div className="doc-container user-request-wrapper user-req">
        <ToastContainer />
        <article className="wrapper-user-req user-req-new">
          <div className="card-signup doc-form style-User-Request user-req-card user-req-layout">
            <header>
              <h3
                className="sign-up-header-text doc-header animate__animated animate__zoomIn"
                style={{ marginBottom: "6px" }}
              >
                Schedule A Service
              </h3>
            </header>
            {/* <article>{this.renderLabel("Organization", "serviceFor")}</article>
              <article>
                {this.renderDropDown("Profession", profession, "serviceFor")}
              </article> */}
            <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
              <div className="mb-2">
                <Row>
                  {/* <article className="RowSR RowSR-grid"> */}

                  <Col>
                    <article
                      className={`user-request-input-wrapper ${this.state.errorClass}`}
                    >
                      <article>
                        {this.renderLabel("Full Name", "fullName")}
                      </article>
                      <article>
                        {this.renderInput(
                          "text",
                          "fullname",
                          "fullname",
                          "Full Name"
                        )}
                      </article>
                    </article>
                  </Col>

                  {/* Paste service here */}
                  <Col>
                    <article
                      className={`user-request-input-wrapper ${this.state.errorClass}`}
                    >
                      <article>
                        {this.renderLabel("Service", "service")}
                      </article>
                      <article>
                        {this.renderDropDown(
                          "service",
                          this.state.Conditionalservices,
                          "service",
                          "service",
                          "Please Select a Service"
                        )}
                      </article>
                      {this.state.vaccinationSelected && <VaccinationPlan />}
                      {this.state.vaccinationSelected && (
                        <span style={{ marginLeft: "1rem" }}>
                          {this.state.vaccinationSelected &&
                            this.renderCheckBox2(
                              "vaccination,",
                              "vaccination",
                              "",
                              "Avail Plan"
                            )}
                        </span>
                      )}
                      {/* 
                 
                  {this.state.vaccinationSelected && (
                    <span className="vaccination-plan">
                      Vaccination Plan
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        style={{ marginLeft: "0.5rem" }}
                      />
                    </span>
                  )} */}
                    </article>
                  </Col>

                  {/* </article> */}
                </Row>
              </div>

              <div className="mb-2">
                <Row>
                  {/* Paste Organization here */}

                  <Col>
                    <article
                      className={`user-request-input-wrapper ${this.state.errorClass}`}
                    >
                      <article>
                        {this.renderLabel("Organization", "serviceFor")}
                      </article>
                      <article>
                        {this.renderDropOrg(
                          "service For",
                          organization,
                          "serviceOrgranization",
                          "organization",
                          "Please Choose Service First",
                          "organizationUserRequest"
                        )}
                      </article>
                    </article>
                  </Col>

                  <Col>
                    <article>
                      {/* <article>{this.renderLabel("City", "city")}</article>
                  <article className="signup-org-city_">
                    {this.renderDropDown(
                      "City",
                      this.state.cites,
                      "city",
                      "city",
                      "Please Select Your City"
                    )}
                  </article> */}
                      <article>
                        {this.renderLabel("Change My Location", "location")}
                      </article>

                      <Link to="/maps" target="_blank">
                        <div
                          className="style-map-pin"
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            border: "1px solid #0d6efd",
                            padding: "5.9px 0px",
                            borderRadius: "4px",
                            marginTop: "2px",
                          }}
                        >
                          <span>Open Map</span>
                          <MapPin
                            style={{
                              marginLeft: "2px",
                              display: "inline-block",
                              height: "17px",
                            }}
                          />
                          {/* <FontAwesomeIcon icon={MapPin} */}
                        </div>
                      </Link>
                      {this.state.serviceLocalityError &&
                        !this.state.errors.city && (
                          <p className="error">
                            {this.state.serviceLocalityError}
                          </p>
                        )}
                    </article>
                  </Col>

                  {/* schedule replace city */}
                  {/* </article> */}
                </Row>
              </div>

              <div className="mb-2">
                <Row>
                  {/* <article className="RowSR RowSR-grid email-txt"> */}

                  <Col>
                    <article className="email-label user_req_email_style">
                      <article>{this.renderLabel("Email", "Email")}</article>
                      <article>
                        {this.renderInput("text", "email", "email", "Email")}
                      </article>
                    </article>
                  </Col>

                  <Col>
                    <article>
                      <article>
                        {this.renderLabel("Phone No", "phoneno")}
                      </article>
                      <article>
                        {this.renderInput(
                          "tel",
                          "phoneno",
                          "phoneno",
                          "+923483933056"
                        )}
                      </article>
                    </article>
                  </Col>
                  {/* </article> */}
                </Row>
              </div>

              <div className="mb-2">
                <Row>
                  {/* <article className="RowSR RowSR-grid"> */}
                  <Col>
                    <article>
                      {/* City */}
                      <article
                        className={`user-request-input-wrapper ${this.state.errorClass}`}
                      >
                        <article>
                          {this.renderLabel("Schedule", "schedule")}
                        </article>
                        <article>
                          {this.renderInput(
                            "date",
                            "schedule",
                            "schedule",
                            "Schedule a Meeting",
                            this.state.minDate
                            // this.state.maxDate
                          )}
                        </article>
                      </article>
                      {/* City */}
                    </article>
                  </Col>
                  <Col>
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
                            this.state.requestTime,
                            "ServiceNeededFrom",
                            "ServiceNeededFrom",
                            "Please Select Time Slot"
                          )}
                        </article>
                      </article>
                    </article>
                  </Col>
                  {/* </article> */}
                </Row>
              </div>

              <Row>
                <Col>
                  {!this.state.vaccinationSelected && (
                    <>
                      <article style={{ display: "flex" }}>
                        <span
                          style={{ marginLeft: "1rem", marginTop: "0.5rem" }}
                        >
                          {this.renderRadioBtn1(
                            "daily",
                            "servicePlan",
                            "Daily"
                          )}
                          <span style={{ marginLeft: "0.5rem" }}>
                            {this.renderRadioBtn3(
                              "weekly",
                              "servicePlan",
                              "Weekly"
                            )}
                          </span>
                          {this.state.servicePlan === "None" ? (
                            <span style={{ marginLeft: "0.5rem" }}>
                              {this.renderRadioBtn3(
                                "None",
                                "servicePlan",
                                "None",
                                true
                              )}
                            </span>
                          ) : (
                            <span style={{ marginLeft: "0.5rem" }}>
                              {this.renderRadioBtn3(
                                "None",
                                "None",
                                "None",
                                false
                              )}
                            </span>
                          )}
                        </span>

                        {this.state.servicePlan !== "None" && (
                          <>
                            {/* type,
                              id,
                              name,
                              placeholder = "",
                              minDate = "",
                              maxDate = "",
                              readonly = "" */}
                            <span
                              style={{ marginLeft: "1rem" }}
                              className="repeated-wrapper"
                            >
                              {this.renderInput(
                                "number",
                                "noOfMeetings",
                                "noOfMeetings",
                                "Meetings?",
                                "1",
                                "",
                                "",
                                "1",
                                "no-of-meetings-style",
                                "10"
                              )}
                            </span>
                          </>
                        )}
                        {this.state.servicePlan === "Weekly" && <MultiSelect />}
                      </article>
                    </>
                  )}
                </Col>
                <Col md={2}>
                  <article style={{ display: "flex", justifyContent: "end" }}>
                    <BasicModal
                      lat={this.state.patientLat}
                      lng={this.state.patientLng}
                      availabilityData={this.state.allStaff}
                      userScheduledDate={schedule}
                      staffDateSelected={this.state.doctorForm.schedule}
                      filterTimeGonePastToday={
                        this.filterTimeGonePastTodayAvailability
                      }
                      requestTimeLength={
                        this.state.doctorForm.service &&
                        this.state.doctorForm.organization &&
                        this.state.doctorForm.schedule
                          ? this.state.requestTime.length
                          : 0
                      }
                      selectedSlot={this.state.doctorForm.ServiceNeededFrom}
                    />
                  </article>
                </Col>
              </Row>

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
                style={{ marginBottom: "10px" }}
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
