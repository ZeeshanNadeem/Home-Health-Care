import React, { Component } from "react";
import Form from "../Common/Form";
import Joi from "joi-browser";
import config from "../Api/config.json";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import Select from 'react-select'
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
    leaveSlot:false,
    slots:[],
    leaveSlots:[]
  };
 async componentDidMount() {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    const {data}=await axios.get(config.apiEndPoint+`/staff/${user.staffMember._id}`)
    const slots=data.availableTime.filter(s=>s.value===true);
    this.setState({slots})
    this.setState({ user });
  }

  schema = {
    leave_from: Joi.string().required().label("Leave From"),
    leave_to: Joi.string().required().label("Leave To"),
  };

  MatchUserSelected = (BookedStaffDate1) => {
    let BookedStaffDate = BookedStaffDate1.split("-");
    let BookedStaffDate_ =
      BookedStaffDate[0] + "/" + BookedStaffDate[1] + "/" + BookedStaffDate[2];

    let leave_from = this.state.doctorForm.leave_from.split("-");
    let leave_from_ = leave_from[0] + "/" + leave_from[1] + "/" + leave_from[2];

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
  };

  //This function reschedules duty of the staff member
  //who took leaves and assigns it to another staff member
  //with same organization and same designation (e.g nurse)
  AssignAutomatedStaffDuty = async (serviceDemander, count) => {
    const { Schedule, Service, Organization } = serviceDemander;
    const { data: userRequests } = await axios.get(
      config.apiEndPoint + `/userRequests`
    );
    const { ServiceNeededTime } = serviceDemander;
    // const d = new Date();
    // let day = d.getDay();

    const m = moment(Schedule);
    let dayNo = m.format("dddd");

    // if (day === "0") day = 7;
    // const { data: staff } = await axios.get(config.staff);

    if (dayNo === "Sunday") dayNo = "SUN";
    else if (dayNo === "Monday") dayNo = "MON";
    else if (dayNo === "Tuesday") dayNo = "TUE";
    else if (dayNo === "Wednesday") dayNo = "WED";
    else if (dayNo === "Thursday") dayNo = "THRU";
    else if (dayNo === "Friday") dayNo = "FRI";
    else if (dayNo === "Saturday") dayNo = "SAT";
   

     
    const { data: staffGot } = await axios.get(
      config.staff +
        `?day=${dayNo}&service=${Service._id}&organization=${Organization._id}&ignoreCity=true`
    );
    
    const { data: staffLeaves } = await axios.get(
      config.apiEndPoint + "/staffLeave"
    );
    let gotSlotBooked = false;
    let staffOnLeave = false;
    let liesBetween = false;
    let countReschedule = 0;
    let loopEnds = false;
    for (let j = 0; j < staffGot.length; j++) {
      if (j === staffGot[j].length - 1) loopEnds = true;
      let availableTime = staffGot[j].availableTime.filter(
        (s) => s.time === ServiceNeededTime && s.value === true
      );
      gotSlotBooked = false;
      staffOnLeave = false;
      let liesBetween = false;

      if (availableTime.length > 0) liesBetween = true;
      else continue;

      //Checking if staff Selected time comes in between a staff duty
      //If yes then we proceed further else check for other staff member

      // let format = "hh";
      // let timeFrom = moment(userSelectedTimeFrom, format),
      //   beforeTime = moment(availabilityFrom, format),
      //   afterTime = moment(availabilityTo, format),
      //   timeTo = moment(userSelectedTimeTo, format);

      // if (timeFrom.isSame(beforeTime) && timeTo.isSame(afterTime)) {
      //   liesBetween = true;
      // }

      if (liesBetween) {
        let availabilityFrom = null;
        let availabilityTo = null;
        let availableFromArr = availableTime[0].time.split("to");
        availableFromArr[0].trim();
        availableFromArr[1].trim();

        if (availableFromArr[0].includes("AM")) {
          let arr = availableFromArr[0].split("AM");
          if (arr[0] === "12") {
            availabilityFrom = "00";
          } else availabilityFrom = arr[0];
          if (availabilityFrom < 10 && availabilityFrom !== "00") {
            availabilityFrom = "0" + availabilityFrom;
          }
        } else if (availableFromArr[0].includes("PM")) {
          let arr = availableFromArr[0].split("PM");
          if (arr[0] !== "12") {
            availabilityFrom = parseInt(arr[0]) + 12;
          } else availabilityFrom = arr[0];

          if (availabilityFrom < 10) {
            availabilityFrom = "0" + availabilityFrom;
          }
        }

        if (availableFromArr[1].includes("AM")) {
          let arr = availableFromArr[1].split("AM");
          if (arr[0] === "12") {
            availabilityTo = "00";
          } else availabilityTo = arr[0];

          if (availabilityTo < 10 && availabilityTo !== "00") {
            availabilityTo = "0" + availabilityTo;
          }
        } else if (availableFromArr[1].includes("PM")) {
          let arr = availableFromArr[1].split("PM");
          if (arr[0] !== "12") {
            availabilityTo = parseInt(arr[0]) + 12;
          } else availabilityTo = arr[0];
          if (availabilityTo < 10) {
            availabilityTo = "0" + availabilityTo;
          }
        }

        // // let availableToArr = staffGot[j].availabilityTo.split(":");

        // // let StaffAvailableForm = availableFromArr[0];
        // // let StaffAvailableTo = availableToArr[0];

        let userSelectedTime = ServiceNeededTime.split("to");

        userSelectedTime[0].trim();
        userSelectedTime[1].trim();
        let userSelectedTimeFrom = null;
        let userSelectedTimeTo = null;

        if (userSelectedTime[0].includes("AM")) {
          let arr = userSelectedTime[0].split("AM");
          arr[0] = arr[0].trim();
          arr[1] = arr[1].trim();
          if (arr[0] === "12") {
            userSelectedTimeFrom = "00";
          } else {
            userSelectedTimeFrom = arr[0];
          }
          if (userSelectedTimeFrom < 10 && userSelectedTimeFrom !== "00")
            userSelectedTimeFrom = "0" + userSelectedTimeFrom;
        } else if (userSelectedTime[0].includes("PM")) {
          let arr = userSelectedTime[0].split("PM");
          arr[0] = arr[0].trim();
          arr[1] = arr[1].trim();
          if (arr[0] !== "12") {
            userSelectedTimeFrom = parseInt(arr[0]) + 12;
          } else {
            userSelectedTimeFrom = arr[0];
          }
          if (userSelectedTimeFrom < 10)
            userSelectedTimeFrom = "0" + userSelectedTimeFrom;
        }

        if (userSelectedTime[1].includes("AM")) {
          let arr = userSelectedTime[1].split("AM");
          arr[0] = arr[0].trim();
          arr[1] = arr[1].trim();
          if (arr[0] === "12") {
            userSelectedTimeTo = "00";
          } else {
            userSelectedTimeTo = arr[0];
          }
          if (userSelectedTimeTo < 10 && userSelectedTimeTo !== "00")
            userSelectedTimeTo = "0" + userSelectedTimeTo;
        } else if (userSelectedTime[1].includes("PM")) {
          let arr = userSelectedTime[1].split("PM");
          arr[0] = arr[0].trim();
          arr[1] = arr[1].trim();

          if (arr[0] !== "12") {
            userSelectedTimeTo = parseInt(arr[0]) + 12;
          } else {
            userSelectedTimeTo = arr[0];
          }
          if (userSelectedTimeTo < 10)
            userSelectedTimeTo = "0" + userSelectedTimeTo;
        }

        for (let i = 0; i < userRequests.length; i++) {
          if (staffOnLeave || gotSlotBooked) break;

          if (staffGot[j]._id === userRequests[i].staffMemberAssigned._id) {
            let arrayTime = userRequests[i].ServiceNeededTime.split("to");
            arrayTime[0] = arrayTime[0].trim();
            arrayTime[1] = arrayTime[1].trim();

            let bookedServiceFrom = null;
            let bookedServiceTo = null;

            if (arrayTime[0].includes("AM")) {
              let arr = arrayTime[0].split("AM");
              arr[0] = arr[0].trim();
              arr[1] = arr[1].trim();
              if (arr[0] === "12") {
                bookedServiceFrom = "00";
              } else {
                bookedServiceFrom = arr[0];
              }
              if (bookedServiceFrom < 10 && bookedServiceFrom !== "00") {
                bookedServiceFrom = "0" + bookedServiceFrom;
              }
            } else if (arrayTime[0].includes("PM")) {
              let arr = arrayTime[0].split("PM");
              arr[0] = arr[0].trim();
              arr[1] = arr[1].trim();
              if (arr[0] !== "12") {
                bookedServiceFrom = parseInt(arr[0]) + 12;
              } else {
                bookedServiceFrom = arr[0];
              }
              if (bookedServiceFrom < 10) {
                bookedServiceFrom = "0" + bookedServiceFrom;
              }
            }

            if (arrayTime[1].includes("AM")) {
              let arr = arrayTime[1].split("AM");
              arr[0] = arr[0].trim();
              arr[1] = arr[1].trim();
              if (arr[0] === "12") {
                bookedServiceTo = "00";
              } else bookedServiceTo = arr[0];

              if (bookedServiceTo < 10 && bookedServiceTo !== "00") {
                bookedServiceTo = "0" + bookedServiceTo;
              }
            } else if (arrayTime[1].includes("PM")) {
              let arr = arrayTime[1].split("PM");
              if (arr[0] !== "12") {
                bookedServiceTo = parseInt(arr[0]) + 12;
              } else bookedServiceTo = arr[0];
              if (bookedServiceTo < 10) {
                bookedServiceTo = "0" + bookedServiceTo;
              }
            }

            let format = "hh";
            let timeFrom_ = moment(userSelectedTimeFrom, format),
              beforeTime_ = moment(bookedServiceFrom, format),
              afterTime_ = moment(bookedServiceTo, format),
              timeTo_ = moment(userSelectedTimeTo, format);

            //Checking If staff booked service time
            //lies between user requested time
            //If time lies between then we check weather
            //its the day in between where user demands service
            //If yes then its slot is booked
            if (
              timeFrom_.isSame(beforeTime_) &&
              timeTo_.isSame(afterTime_)

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
                let leaveFromArr = staffLeaves[z].leaveFrom.split("-");
                let leaveToArr = staffLeaves[z].leaveTo.split("-");
                let scheduleArr = Schedule.split("-");

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
      // IF That staff is neither on leave nor got slot booked in that time
      // Assigning that staff a duty
      if (!gotSlotBooked && !staffOnLeave && liesBetween) {
        const jwt = localStorage.getItem("token");
        const user = jwtDecode(jwt);
        serviceDemander.staffMemberID = staffGot[j]._id;
        serviceDemander.userID=serviceDemander.user._id;

        try {
          count++;
          await axios.post(
            "http://localhost:3000/api/userRequests?assignDuty=abc",
            serviceDemander
          );

          // toast.success(
          //   "Leave Scheduled! Substitute Staff Member has been Assigned Your duty"
          // );
          // toast.success(
          //   "Check your schedule to know what duties have been substituted"
          // );
        } catch (ex) {
          toast.error(ex.response.data);
        }
        if (loopEnds) {
          if (count !== 0) {
            toast.success(
              "Leave Scheduled! Substitute Staff Member has been Assigned Your duty"
            );
            toast.success(
              "Check your schedule to know what duties have been substituted"
            );
          }
        }
        // break;
        return count;
        // continue;
      }
    }
    //Can't take leave no substitute staff member available
    if (gotSlotBooked || !liesBetween || staffOnLeave) {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      serviceDemander.staffMemberID = user.staffMember._id;
      serviceDemander.userID=serviceDemander.user._id;
      try {
        await axios.post(
          "http://localhost:3000/api/userRequests?assignDuty=abc",
          serviceDemander
        );
      } catch (ex) {
        toast.error(ex.response.data);
      }
      // try {
      //   await axios.get(
      //     `http://localhost:3000/api/StaffLeave?delete=ab&id=${this.state.leaveGot._id}`
      //   );
      // } catch (ex) {
      //   toast.error(ex.response.data);
      // }

      // toast.error("Sorry No Staff Member Availabile To Assign Your Shift!");
      // toast.error(
      //   "Check your schedule to know what duties have been substituted"
      // );
    }
  };

  //This function checks if the required staff member
  //who took leave its assigned duties need to rescheduled
  //or not
  ReScheduleDuty = async (userRequestStaff, leave_from, leave_to,leaveSaved="") => {
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

    let rescheduleCount = 0;
    let DutyBetweenLeave = false;
    for (let i = 0; i < userRequestStaff.length; i++) {
      let userRequestDate = userRequestStaff[i].Schedule.split("-");
      let userRequestDate_ =
        userRequestDate[0] +
        "/" +
        userRequestDate[1] +
        "/" +
        userRequestDate[2];

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
        markers
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
        markers:markers
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
        DutyBetweenLeave = true;
        await axios.delete(
          config.apiEndPoint + "/userRequests/" + userRequestStaff[i]._id
        );
        rescheduleCount = await this.AssignAutomatedStaffDuty(
          customer,
          rescheduleCount
        );
      }
    }
    if (rescheduleCount && rescheduleCount > 0) {
      toast.success("Leave Scheduled!!");
      toast.success(
        "Check your schedule to know what duties have been substituted"
      );
    } else if (!DutyBetweenLeave) toast.success("You've been granted leave");
    else {
      toast.error("Sorry!! You can't take leave");
      toast.error("No Substitute Staff Member Available to Assign Your Shift");

      if(leaveSaved){
      await axios.delete(
        config.apiEndPoint + "/staffLeave/" + leaveSaved._id
      );
    }
    }
  };

  AssignSubstituteStaff = async (leave_from, leave_to,leaveSaved="") => {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    //checking if this person who took leave has
    //duties assigned too
    const { data } = await axios.get(
      config.apiEndPoint + `/userRequests?staffMemberId=${user.staffMember._id}`
    );

    if (data.length === 0) toast.success("You've been granted leave ! ");
    else await this.ReScheduleDuty(data, leave_from, leave_to,leaveSaved);
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (!errors) {
      console.log(this.state.leaveSlots)
      if(this.state.leaveSlot){
 
    
      const leave = {
        leave_from: this.state.doctorForm.leave_from,
        leave_to: this.state.doctorForm.leave_to,
        staffID: this.state.user.staffMember._id,
        slots:this.state.leaveSlots
      };
      try {
     
        const { data: leaveGot } = await await axios.post(
          config.apiEndPoint + "/staffLeave?slotLeave=true",
          leave
        );
        this.setState({ leaveGot });
       //checking slots need to re-assigned on slot leave
      const {data}= await axios.post(config.apiEndPoint+"/staff?SlotsBooked=true",leave)
     
      let rescheduleCount = 0;
      if(data.length>0) 
      {
        for(let userReq of data){
          await axios.delete(
            config.apiEndPoint + "/userRequests/" + userReq._id
          );
          rescheduleCount=  await this.AssignAutomatedStaffDuty(userReq,data.length)
          
        }
        if (rescheduleCount && rescheduleCount > 0) {
          toast.success("Leave Scheduled!!");
          toast.success(
            "Check your schedule to know what duties have been substituted"
          );
        } 
        else {
          toast.error("Sorry!! You can't take leave");
          toast.error("No Substitute Staff Member Available to Assign Your Shift");
          await axios.delete(
            config.apiEndPoint + "/staffLeave/" + leaveGot._id
          );
        }
    
      }
      else toast.success("You've been granted leave");

      


       
     

      } catch (ex) {
        toast.error(ex.response.data);
      }

      }
      else{
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
        await this.AssignSubstituteStaff(leaveGot.leaveFrom, leaveGot.leaveTo,leaveGot);
      } catch (ex) {
        toast.error(ex.response.data);
      }
    }
    }
  };

  slotLeaveCheck=(e)=>{
   this.setState({leaveSlot:e.target.checked})
  }
  getSlots=()=>{
    let arr=[]
    for(let slot of this.state.slots){
        arr.push({value: slot.time, label: slot.time})
    }
    return arr;
  }
  handleSlots=(e)=>{

    const leaveSlots=[...this.state.leaveSlots];
    leaveSlots.push(e[0]);
    this.setState({leaveSlots:e})
  }
 
  
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
       


         
          <div className="form-check">
          <input className="form-check-input" type="checkbox" value={this.state.leaveSlot} id="flexCheckDefault"
          onChange={this.slotLeaveCheck}
          />
          <div  style={{marginTop:"0.5rem"}}>
          <label className="form-check-label" htmlFor="flexCheckDefault">
          Leave On Slot?
          </label>
          </div>
          </div>

          {this.state.leaveSlot && <>
          <label className="form-check-label mt-2" htmlFor="flexCheckDefault">
          Select Slots
          </label>
          <div style={{marginTop:"0rem"}}>
          <Select options={this.getSlots()}
          onChange={this.handleSlots}
          isMulti
          />
         
          </div> </>}



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
