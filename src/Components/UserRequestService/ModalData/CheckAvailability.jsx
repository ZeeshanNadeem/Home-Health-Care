import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

import config from "../../Api/config.json";
import moment from "moment";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { Global } from "@emotion/react";

const CheckAvailability = ({
  availabilityData,
  userScheduledDate,
  userRequests,
}) => {
  const [availableTiming, setAvailableTime] = useState([
    "12AM to 3AM",
    "3AM to 6AM",
    "6AM to 9AM",
    "9AM to 12PM",
    "12PM to 3PM",
    "3PM to 6PM",
    "6PM to 9PM",
    "9PM to 12AM",
  ]);

  let [track, setTrack] = useState([]);

  //Checking booked slots of a staff
  //checking if a staff has got slots booked or not
  const getBookedSlots = (staff, slotTimeFrom, slotTimeTo) => {
    let GotSlotBooked = false;
    for (let i = 0; i < userRequests.length; i++) {
      //61d2487764ecd57afa992f66
      //61d2487764ecd57afa992f66
      if (
        userRequests[i].staffMemberAssigned._id === staff._id &&
        userRequests[i].Schedule === userScheduledDate
      ) {
        let serviceBookedFrom = userRequests[i].ServiceNeededTime.split("-");
        let temp1 = serviceBookedFrom[0];
        let temp2 = serviceBookedFrom[1];
        let serviceBookedFrom_ = temp1.split(":");
        let serviceBookedTo_ = temp2.split(":");

        let format = "hh";
        let serviceBookedFrom_staff = moment(serviceBookedFrom_, format),
          slot_From = moment(slotTimeFrom, format),
          slot_To = moment(slotTimeTo, format),
          serviceBookedTo_staff = moment(serviceBookedTo_, format);
        // serviceBookedFrom_[0] = serviceBookedFrom_[0].replace(/^0+/, "");
        // serviceBookedTo_[0] = serviceBookedTo_[0].replace(/^0+/, "");

        if (
          serviceBookedFrom_staff.isSame(slot_From) &&
          serviceBookedTo_staff.isSame(slot_To)
          // parseInt(serviceBookedFrom_[0]) === parseInt(slotTimeFrom) &&
          // parseInt(serviceBookedTo_[0]) === parseInt(slotTimeTo)
        ) {
          return true;
        } else GotSlotBooked = false;
      }
    }
    return GotSlotBooked;
  };

  const CheckAvailableStaff = (staffMember, slotTime) => {
    //Once there is a paticular staff member available at
    // a paticular time slot.No need to check other staff members
    // on that time slot.That slotTime  is being pushed in an array.
    // Skipping
    if (slotTime === "9AM to 12PM") {
      console.log("aaa");
    }
    let checkSlot = track.some(
      (x) => x.timeSlot === slotTime && x.BookedSlot === false
    );
    if (checkSlot) return;

    let provideServiceAtSlot = false;

    if (staffMember.availableTime.includes({ name: slotTime })) {
      provideServiceAtSlot = true;
    }
    return;
    let tempSlotTime = slotTime;
    let slotTimeFrom = "";
    let slotTimeTo = "";
    let slotTimeArr = slotTime.split("to");
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

    let staffAvailableFrom = staffMember.availabilityFrom.split(":");
    let staffAvailableTo = staffMember.availabilityTo.split(":");

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
      const slotBookedOfStaffMember = getBookedSlots(
        staffMember,
        slotTimeFrom,
        slotTimeTo
      );

      if (slotBookedOfStaffMember) {
        //Slot is booked
        //We send false here
        //So on that basis cross could be represented

        //Checking if this timeSlot exists and tick is there
        let check = track.some(
          (x) => x.timeSlot === tempSlotTime && x.BookedSlot === false
        );

        //Checking if timeSlots exists and slot is booked means cross
        let check1 = track.some(
          (x) => x.timeSlot === tempSlotTime && x.BookedSlot === true
        );
        if (!check && !check1) {
          track.push({
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

        let check = track.some(
          (x) => x.timeSlot === tempSlotTime && x.BookedSlot === false
        );

        let check1 = track.some(
          (x) => x.timeSlot === tempSlotTime && x.BookedSlot === true
        );
        if (!check && !check1) {
          track.push({
            timeSlot: tempSlotTime,
            BookedSlot: false,
          });
        }
        if (check1) {
          if (track.length > 0) {
            for (let t = 0; t < track.length; t++) {
              if (
                track[t].timeSlot === tempSlotTime &&
                track[t].BookedSlot === true
              ) {
                track[t].timeSlot = tempSlotTime;
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
        (x) => x.timeSlot === tempSlotTime && x.BookedSlot === false
      );

      let check1 = track.some(
        (x) => x.timeSlot === tempSlotTime && x.BookedSlot === true
      );
      if (!check && !check1) {
        track.push({
          timeSlot: tempSlotTime,
          BookedSlot: true,
        });
      }

      return false;
    }

    if (slotTime === "9PM to 12AM") {
      setTrack(track);
    }
  };

  const filteredUnavailableSlots = () => {
    track = track.filter((slot) => slot.BookedSlot === false);
    console.log("Track::", track);
    global.track = track;
  };
  return (
    <article>
      {availabilityData.length > 0 ? (
        <table className="table availability-table">
          <thead>
            <tr>
              <th
                className="availability-table-th availability-header"
                scope="col"
                style={{ textAlign: "center" }}
              >
                Timings
              </th>
            </tr>
          </thead>

          <tbody>
            {availableTiming.map((data) => (
              <arcticle key={data}>
                {availabilityData.map((staff) =>
                  CheckAvailableStaff(staff, data, userRequests)
                )}
              </arcticle>
            ))}
            {filteredUnavailableSlots()}

            {track.map((data) => (
              <tr key={data.timeSlot}>
                <td className="availability-table-th">
                  {data.timeSlot}
                  {data.BookedSlot === false ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ color: "#4E9F3D", marginLeft: "1rem" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ color: "#FF1700", marginLeft: "1rem" }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="check-availability-tag">Not Available Today!</p>
      )}
    </article>
  );
};

export default CheckAvailability;
