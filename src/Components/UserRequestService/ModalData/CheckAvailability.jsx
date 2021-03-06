import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const CheckAvailability = ({
  availabilityData,
  userScheduledDate,
  userRequests,
  requestTimeLength,
  filterTimeGonePastToday,
  staffDateSelected,
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

        // let staffContainsSlot = userRequests.some(
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

    let checkSlot = track.some(
      (x) => x.timeSlot === slotTime && x.BookedSlot === false
    );
    if (checkSlot) return;

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
          timeSlot: slotTime,
          BookedSlot: true,
        });
      }

      return false;
    }

    // if (slotTime === "9PM to 12AM") {
    //   setTrack(track);
    // }
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
  return (
    <article>
      {availableTiming.map((data) => (
        <span key={data}>
          {availabilityData.map((staff) =>
            CheckAvailableStaff(staff, data, userRequests)
          )}
        </span>
      ))}
      {filteredUnavailableSlots()}
      {requestTimeLength > 0 ? (
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
            {/* {availableTiming.map((data) => (
              <span key={data}>
                {availabilityData.map((staff) =>
                  CheckAvailableStaff(staff, data, userRequests)
                )}
              </span>
            ))}
            {filteredUnavailableSlots()} */}

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
                      style={{ color: "#CD1818", marginLeft: "1rem" }}
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
