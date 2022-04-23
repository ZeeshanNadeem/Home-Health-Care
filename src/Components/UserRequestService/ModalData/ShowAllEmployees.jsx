// import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import * as React from "react";
import jwtDecode from "jwt-decode";
import Popover from "@mui/material/Popover";

import CheckAvailability from "../ModalData/CheckAvailability";

import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import config from "../../Api/config.json";

const ShowAllEmployees = ({
  availabilityData,
  userScheduledDate,
  userRequests,
  requestTimeLength,
  filterTimeGonePastToday,
  staffDateSelected,
  selectedSlot,
  //staff lat,lng which is same of its organization
  lat,
  lng,
}) => {
  const [availableTiming, setAvailableTime] = React.useState([
    "12AM to 3AM",
    "3AM to 6AM",
    "6AM to 9AM",
    "9AM to 12PM",
    "12PM to 3PM",
    "3PM to 6PM",
    "6PM to 9PM",
    "9PM to 12AM",
  ]);

  let [track, setTrack] = React.useState([]);
  let [allStaffMembers, setAllStaff] = React.useState([]);
  let [uniqueArr, setUniqueArr] = React.useState([]);
  let [currentUserLat, setLat] = React.useState("");
  let [currentUserLng, setLng] = React.useState("");
  const [distanceFound, setDistance] = React.useState("");

  // let [uniqueArr, setUniqueArr] = React.useState([{ name: "hhh" }]);
  let [allStaff, AllStaff] = React.useState([]);
  React.useEffect(() => {
    //currentLocation
    // navigator.geolocation.getCurrentPosition((position) => {
    //   setLat(position.coords.latitude);
    //   setLng(position.coords.longitude);
    // });
    const d = distance(lat, currentUserLat, lng, currentUserLng);
    const t = parseInt(d);

    setDistance(t);
    displayAllStaff();
  }, []);

  const distance = (lat1, lat2, lon1, lon2) => {
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

  const checkBookedSlot = (staffMemberBookedSlots, userSelectedDate) => {
    let slotBooked = false;
    for (let i = 0; i < staffMemberBookedSlots.length; i++) {
      if (
        staffMemberBookedSlots[i].Schedule === userSelectedDate &&
        staffMemberBookedSlots[i].ServiceNeededTime === selectedSlot
      ) {
        slotBooked = true;
        break;
      }
    }

    if (slotBooked) return true;
    else return false;
  };

  const checkTookLeave = (userRequestStaff) => {
    let LeaveFound = false;
    for (let i = 0; i < userRequestStaff.length; i++) {
      let staffLeaveDateFrom = userRequestStaff[i].leaveFrom.split("-");
      let staffLeaveDateTo = userRequestStaff[i].leaveTo.split("-");
      let userSelected = userScheduledDate.split("-");

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
        userSelected[0] + "/" + userSelected[1] + "/" + userSelected[2];

      const compareDate = moment(userSelectedDate_, "YYYY/MM/DD");
      const startDate = moment(staffLeaveDateFrom_, "YYYY/MM/DD");
      const endDate = moment(staffLeaveDateTo_, "YYYY/MM/DD");
      const isBetween = compareDate.isBetween(startDate, endDate);
      if (
        isBetween ||
        compareDate.isSame(staffLeaveDateFrom_) ||
        compareDate.isSame(staffLeaveDateTo_)
      ) {
        LeaveFound = true;
        break;
      }
    }
    if (LeaveFound) return true;
    else return false;
  };
  const displayAllStaff = async () => {
    const m = moment(userScheduledDate);
    let temp = [];
    let dayNo = m.day();
    if (dayNo === 0) dayNo = "SUN";
    else if (dayNo === 1) dayNo = "MON";
    else if (dayNo === 2) dayNo = "TUE";
    else if (dayNo === 3) dayNo = "WED";
    else if (dayNo === 4) dayNo = "THRU";
    else if (dayNo === 5) dayNo = "FRI";
    else if (dayNo === 6) dayNo = "SAT";
    for (let i = 0; i < availabilityData.length; i++) {
      let containsDay = availabilityData[i].availableDays.some(
        (day) => day.name === dayNo && day.value === true
      );

      let containsSlot = availabilityData[i].availableTime.some(
        (day) => day.time === selectedSlot && day.value === true
      );

      const { data } = await axios.get(
        config.apiEndPoint +
          `/userRequests?staffMemberId=${availabilityData[i]._id}`
      );
      let slotBookedOrNot = false;
      if (data.length > 0)
        slotBookedOrNot = checkBookedSlot(data, staffDateSelected);

      let tookLeaveOrNot = false;
      const { data: leaves } = await axios.get(
        config.apiEndPoint +
          `/staffLeave?staffMemberID=${availabilityData[i]._id}`
      );
      if (leaves.length > 0) tookLeaveOrNot = checkTookLeave(leaves);

      let TotalDistance="";
      let LiesInRadius=false;
      // const d = distance(lat, availabilityData[i].locations[0].lat, lng, availabilityData[i].locations[0].lng);
      
      // const t = parseInt(d);

      for(let location of availabilityData[i].locations){
        const distanceInDecimal = distance(lat,location.lat, lng,location.lng);
        const distanceFound = parseInt(distanceInDecimal);
        for(let staffLocation of availabilityData[i].locations){
           if(distanceFound<=staffLocation.radius){
            LiesInRadius=true;
            TotalDistance=distanceFound;
            break;
           }
        }
       if(LiesInRadius) break;
      }
      if (LiesInRadius && containsDay && containsSlot && !slotBookedOrNot && !tookLeaveOrNot) {
        temp.push({
          _id: availabilityData[i]._id,
          name: availabilityData[i].fullName,
          rating: availabilityData[i].Rating,
          free: "YES",
          Distance:  TotalDistance + " KM",
        });
      } else {
      const d = distance(lat, availabilityData[i].locations[0].lat, lng, availabilityData[i].locations[0].lng);
      const t = parseInt(d);
        temp.push({
          _id: availabilityData[i]._id,
          name: availabilityData[i].fullName,
          rating: availabilityData[i].Rating,
          free: "NO",
          Distance: t + " KM",
        });
      }
    }

    temp.sort((a, b) => (a.rating > b.rating ? -1 : 1));

    AllStaff(temp);
  };
  //Checking booked slots of a staff
  //checking if a staff has got slots booked or not
  const getBookedSlots = (staff, slotTime) => {
    let GotSlotBooked = false;
    for (let i = 0; i < userRequests.length; i++) {
      if (
        userRequests[i].staffMemberAssigned._id === staff._id &&
        userRequests[i].Schedule === userScheduledDate
      ) {
        if (userRequests[i].ServiceNeededTime === slotTime) {
          GotSlotBooked = true;
          break;
        }

        // let staffContainsSlot = userRequestss.some(
        //   (req) => req.ServiceNeededTime === slotTime
        // );
        // if (staffContainsSlot) {
        //   return true;
        // } else GotSlotBooked = false;
      }
    }
    return GotSlotBooked;
  };

  const CheckAvailableStaff = (staffMember, slotTime) => {
    //Once there is a paticular staff member available at
    // a paticular time slot.No need to check other staff members
    // on that time slot.That slotTime  is being pushed in an array.
    // Skipping

    // let checkSlot = track.some(
    //   (x) => x.timeSlot === slotTime && x.BookedSlot === false
    // );

    // if (checkSlot) return;

    let staffContainsSlot = staffMember.availableTime.some(
      (staff) => staff.time === slotTime && staff.value === true
    );

    let slotBooked = false;
    if (staffContainsSlot) {
      //   //Checking staff member's duty booked
      //   //On a slot or not.Slots are predefined
      //   //Staff members are sent to this function one by one

      const slotBookedOfStaffMember = getBookedSlots(staffMember, slotTime);

      if (slotBookedOfStaffMember) {
        //Slot is booked
        //We send false here
        //So on that basis cross could be represented

        //Checking if this timeSlot exists and tick is there
        let check = track.some(
          (x) => x.timeSlot === slotTime && x.BookedSlot === false
        );

        //Checking if timeSlots exists and slot is booked means cross
        let check1 = track.some(
          (x) => x.timeSlot === slotTime && x.BookedSlot === true
        );
        if (!check && !check1) {
          track.push({
            _id: staffMember._id,
            name: staffMember.fullName,
            rating: staffMember.Rating,
            distance: "1KM",
            free: "No",

            timeSlot: slotTime,
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
          (x) => x.timeSlot === slotTime && x.BookedSlot === false
        );

        let check1 = track.some(
          (x) => x.timeSlot === slotTime && x.BookedSlot === true
        );
        if (!check && !check1) {
          track.push({
            _id: staffMember._id,
            name: staffMember.fullName,
            rating: staffMember.Rating,
            distance: "1KM",
            free: "YES",
            timeSlot: slotTime,
            BookedSlot: false,
          });
        }
        if (check1) {
          if (track.length > 0) {
            for (let t = 0; t < track.length; t++) {
              if (
                track[t].timeSlot === slotTime &&
                track[t].BookedSlot === true
              ) {
                track[t].timeSlot = slotTime;
                track[t].BookedSlot = false;
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

      let check = track.some(
        (x) => x.timeSlot === slotTime && x.BookedSlot === false
      );

      let check1 = track.some(
        (x) => x.timeSlot === slotTime && x.BookedSlot === true
      );
      if (!check && !check1) {
        track.push({
          _id: staffMember._id,
          name: staffMember.fullName,
          rating: staffMember.Rating,
          distance: "1KM",
          free: "No",
          timeSlot: slotTime,
          BookedSlot: true,
        });
      }

      return false;
    }
  };
  const filterSlotsGonePast_ = () => {
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getUTCFullYear();
    let TodayDate = year + "-" + month + "-" + day;
    let tempArr = track;
    if (TodayDate === staffDateSelected) {
      for (let i = 0; i < track.length; i++) {
        let currentHour = date.getHours();
        let currentMintues = date.getMinutes();
        if (currentMintues < 10) currentMintues = "0" + currentMintues;

        let format = "hh:mm";
        if (currentHour < 10) currentHour = "0" + currentHour;
        currentHour = currentHour + ":" + currentMintues;

        let slots = track[i].timeSlot.split("to");
        slots[0] = slots[0].trim();
        slots[1] = slots[1].trim();

        let slotFromConverted = "";
        if (slots[0].includes("PM")) {
          let temp1 = slots[0].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          slotFromConverted = temp1[0];
          if (slotFromConverted < 10)
            slotFromConverted = "0" + slotFromConverted;
        } else {
          let temp1 = slots[0].split("AM");

          if (temp1[0] === "12") temp1[0] = "00";
          slotFromConverted = temp1[0];
          if (slotFromConverted < 10 && slotFromConverted !== "00")
            slotFromConverted = "0" + slotFromConverted;
        }

        let slotToConverted = "";
        if (slots[0].includes("PM")) {
          let temp1 = slots[1].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          slotToConverted = temp1[0];
          if (slotToConverted < 10) slotToConverted = "0" + slotToConverted;
        } else {
          let temp1 = slots[1].split("AM");

          if (temp1[0] === "12") temp1[0] = "00";
          slotToConverted = temp1[0];
          if (slotToConverted < 10 && slotToConverted !== "00")
            slotToConverted = "0" + slotToConverted;
        }

        slotFromConverted += ":00";
        slotToConverted += ":00";
        let currentHour_ = moment(currentHour, format),
          beforeTime = moment(slotFromConverted, format);

        if (currentHour_.isAfter(beforeTime)) {
          tempArr = tempArr.filter((slot) => slot !== track[i]);
        }
      }
      return tempArr;
    }
    return tempArr;
  };

  const filteredUnavailableSlots = () => {
    let slots = filterSlotsGonePast_();
    track = slots.filter((slot) => slot.BookedSlot === false);
  };
  const showAllStaff = () => {
    for (let i = 0; i < track.length; i++) {
      let valueExists = false;

      if (uniqueArr.length > 0) {
        for (let j = 0; j < uniqueArr.length; j++) {
          if (uniqueArr[j]._id === track[i]._id) {
            valueExists = true;
            break;
          }
        }
      }
      if (!valueExists) uniqueArr.push(track[i]);
    }

    uniqueArr.sort((a, b) => (a.Rating > b.Rating ? 1 : -1));
  };
  return (
    <article style={{ height: "10rem", overflowY: "auto" }}>
      {" "}
      <table className="table">
        <thead>
          <tr>
            <th className="" scope="col" style={{ textAlign: "center" }}>
              Name
            </th>
            <th className="" scope="col" style={{ textAlign: "center" }}>
              Rating
            </th>
            <th className="" scope="col" style={{ textAlign: "center" }}>
              Distance
            </th>
            <th className="" scope="col" style={{ textAlign: "center" }}>
              Free
            </th>
          </tr>
        </thead>

        <tbody>
          {/* {availableTiming.map((data) => (
              <span key={data}>
                {availabilityData.map((staff) =>
                  CheckAvailableStaff(staff, data, userRequests)
                )}
              </span>
            ))}
            {filteredUnavailableSlots()} */}

          {allStaff.map((data) => (
            <tr key={data._id}>
              <td>{data.name}</td>
              <td>{data.rating}</td>
              <td> {data.Distance}</td>
              <td> {data.free}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};

export default ShowAllEmployees;
