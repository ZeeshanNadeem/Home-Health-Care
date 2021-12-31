import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckCircle,
  faCross,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import UserRequest2 from "../UserRequest2";
import config from "../../Api/config.json";
import axios from "axios";

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
  const [track, setTrack] = useState([]);
  // let track = [];
  // let requests = [];
  // // let stafCount = 0;

  //Checking booked slots of a staff
  //checking if a staff has got slots booked or not
  const getBookedSlots = (staff, slotTimeFrom, slotTimeTo) => {
    let GotSlotBooked = false;
    for (let i = 0; i < userRequests.length; i++) {
      console.log(userRequests[i].staffMemberAssigned._id);
      console.log(staff._id);
      console.log(userRequests[i].Schedule);
      console.log(userScheduledDate);
      if (
        parseInt(userRequests[i].staffMemberAssigned._id) ===
          parseInt(staff._id) &&
        userRequests[i].Schedule === userScheduledDate
      ) {
        let serviceBookedFrom = userRequests[i].ServiceNeededTime.split("-");
        let temp1 = serviceBookedFrom[0];
        let temp2 = serviceBookedFrom[1];
        let serviceBookedFrom_ = temp1.split(":");
        let serviceBookedTo_ = temp2.split(":");
        serviceBookedFrom_[0] = serviceBookedFrom_[0].replace(/^0+/, "");
        serviceBookedTo_[0] = serviceBookedTo_[0].replace(/^0+/, "");

        if (
          parseInt(serviceBookedFrom_[0]) === parseInt(slotTimeFrom) &&
          parseInt(serviceBookedTo_[0]) === parseInt(slotTimeTo)
        ) {
          return true;
        } else GotSlotBooked = false;
      }
    }
    return GotSlotBooked;
  };

  // const staffNo = () => {
  //   stafCount = stafCount + 1;
  //   return stafCount;
  // };

  const CheckAvailableStaff = (staffMember, slotTime) => {
    //Once there is a paticular staff member available at
    // a paticular time slot.No need to check other staff members
    // on that time slot.That slotTime  is being pushed in an array.
    // Skipping

    console.log("track::", track);
    let tempSlotTime = slotTime;
    for (let t = 0; t < track.length; t++) {
      if (track[t].timeSlot === slotTime && track.SlotBooked === false) {
        return;
      }
    }
    if (slotTime === "9AM to 12PM") {
      console.log("a");
    }

    let slotTimeFrom = "";
    let slotTimeTo = "";
    let slotTimeArr = slotTime.split("to");
    if (slotTimeArr[0].includes("AM")) {
      slotTimeFrom = slotTimeArr[0].split("AM");
      slotTimeFrom = slotTimeFrom[0];
      slotTimeFrom = slotTimeFrom.replace(/ /g, "");
      if (slotTimeFrom === "12") {
        slotTimeFrom = 24;
      }
    } else {
      slotTimeFrom = slotTimeArr[0].split("PM");
      slotTimeFrom = slotTimeFrom[0];
      if (slotTimeFrom.trim() !== "12")
        slotTimeFrom = parseInt(slotTimeFrom.trim()) + 12;
    }

    if (slotTimeArr[1].includes("AM")) {
      slotTimeTo = slotTimeArr[1].split("AM");
      slotTimeTo = slotTimeTo[0];
      if (slotTimeTo.trim() === "12") slotTimeTo = "24";
    } else {
      slotTimeTo = slotTimeArr[1].split("PM");
      let temp = slotTimeTo[0];
      slotTime = "";
      slotTimeTo = temp;
      if (slotTimeTo.trim() !== "12") {
        let temp1 = parseInt(slotTimeTo.trim()) + 12;
        slotTimeTo = temp1;
      }
    }

    if (typeof slotTimeFrom === "string") {
      slotTimeFrom = slotTimeFrom.trim();
    }

    if (typeof slotTimeTo === "string") slotTimeTo = slotTimeTo.trim();

    // if (parseInt(slotTimeFrom) < 12) slotTimeFrom = parseInt(slotTimeFrom) + 12;
    // if (parseInt(slotTimeTo) < 12) slotTimeTo = parseInt(slotTimeTo) + 12;

    //Getting userRequests that have  been assigned a staff member each
    // const { data: userRequests } = await axios.get(config.userRequests);

    //Slots are predefined checking whether a
    //staff member's slot is free or busy
    // for (let i = 0; i < 8; i++) {
    let availableFromStaff = staffMember.availabilityFrom.split(":");
    let availableToStaff = staffMember.availabilityTo.split(":");
    availableFromStaff[0] = availableFromStaff[0].replace(/^0+/, "");
    availableToStaff[0] = availableToStaff[0].replace(/^0+/, "");

    let slotBooked = false;
    let liesBetween = false;
    let check1 = false;
    let check2 = false;
    //Checking if a slot lies between a staff member's duty
    //staff 3PM-9PM (15-21)
    // slotTime 12AM-3AM (24-3)

    for (
      let count = parseInt(availableFromStaff[0]);
      count <= parseInt(availableToStaff[0]);
      count++
    ) {
      if (parseInt(count) === parseInt(slotTimeFrom)) {
        check1 = true;
      }
      if (parseInt(count) === parseInt(slotTimeTo)) {
        check2 = true;
      }
      if (check1 && check2) {
        liesBetween = true;
        break;
      }
    }
    if (
      liesBetween
      // parseInt(slotTimeFrom) >= parseInt(availableFromStaff[0]) &&
      // parseInt(slotTimeTo) <= parseInt(availableToStaff[0])
    ) {
      //Checking staff member's duty booked
      //On a slot or not.Slots are predefined
      //Staff members are sent to this function one by one
      // for (let j = 0; j < userRequests.length; j++) {
      const slotBookedOfStaffMember = getBookedSlots(
        staffMember,
        slotTimeFrom,
        slotTimeTo
      );
      if (slotBookedOfStaffMember) {
        //Slot is booked
        //We send false here
        //So on that basis cross could be represented

        let check = track.some(
          (x) => x.timeSlot === tempSlotTime && x.BookedSlot === false
        );

        let check1 = track.some(
          (x) => x.timeSlot === tempSlotTime && x.BookedSlot === true
        );
        if (!check && !check) {
          track.push({
            timeSlot: tempSlotTime,
            BookedSlot: false,
          });
        }
        if (check1) {
          for (let t = 0; t < track; t++) {
            if (
              track[t].timeSlot === tempSlotTime &&
              track[t].BookedSlot === true
            ) {
              delete track[t];
              track.push({
                timeSlot: tempSlotTime,
                BookedSlot: false,
              });
            }
          }
        }
      }
      // }
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
        if (!check && !check) {
          track.push({
            timeSlot: tempSlotTime,
            BookedSlot: false,
          });
        }
        if (check1) {
          for (let t = 0; t < track; t++) {
            if (
              track[t].timeSlot === tempSlotTime &&
              track[t].BookedSlot === true
            ) {
              delete track[t];
              track.push({
                timeSlot: tempSlotTime,
                BookedSlot: false,
              });
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
      if (!check && !check) {
        track.push({
          timeSlot: tempSlotTime,
          BookedSlot: false,
        });
      }
      if (check1) {
        for (let t = 0; t < track; t++) {
          if (
            track[t].timeSlot === tempSlotTime &&
            track[t].BookedSlot === true
          ) {
            delete track[t];
            track.push({
              timeSlot: tempSlotTime,
              BookedSlot: false,
            });
          }
        }
      }
      return false;
    }
    // }
  };

  // const storeStatus = (timeSlot, bol) => {
  //   const val = availabilities.some(
  //     (record) => record.timeSlot === tempSlotTime
  //   );
  //   if (!val) {
  //     if (bol) {
  //       availabilities.push({
  //         timeSlot: timeSlot,
  //         slotBooked: false,
  //       });
  //     } else {
  //       availabilities.push({
  //         timeSlot: timeSlot,
  //         slotBooked: false,
  //       });
  //     }
  //     setAvailabilities(availabilities);
  //   }
  // };
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
              <tr key={data}>
                <td className="availability-table-th">
                  {data}
                  {availabilityData.map((staff) =>
                    CheckAvailableStaff(staff, data, userRequests) === true ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "#4E9F3D", marginLeft: "1rem" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faTimes}
                        style={{
                          color: "#FF1700",
                          marginLeft: "1rem",
                        }}
                      />
                    )
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

// class CheckAvailability extends React.Component {
//   state = {
//     availableTiming: [
//       "12AM to 3AM",
//       "3AM to 6AM",
//       "6AM to 9AM",
//       "9AM to 12PM",
//       "12PM to 3PM",
//       "3PM to 6PM",
//       "6PM to 9PM",
//       "9PM to 12AM",
//     ],
//     userRequests: [],
//     track: [],
//   };
//   temp = [];
//   async componentDidMount() {
//     const { data } = await axios.get(config.apiEndPoint + "/userRequests");

//     this.setState({ userRequests: data });
//     console.log("userRequests::", this.state.userRequests);
//   }

//   //Checking booked slots of a staff
//   //checking if a staff has got slots booked or not
//   getBookedSlots = (userRequests, staff) => {
//     const { userScheduledDate } = this.props;
//     if (
//       userRequests.staffMemberAssigned._id === staff._id &&
//       userRequests.Schedule === userScheduledDate
//     ) {
//       let serviceBookedFrom = userRequests.ServiceNeededFrom.split(":");
//       let serviceBookedTo = userRequests.ServiceNeededTo.split(":");
//       serviceBookedFrom[0] = serviceBookedFrom[0].replace(/^0+/, "");
//       serviceBookedTo[0] = serviceBookedTo[0].replace(/^0+/, "");
//       if (parseInt(serviceBookedFrom[0]) < 12)
//         serviceBookedFrom[0] = parseInt(serviceBookedFrom[0]) + 12;
//       if (parseInt(serviceBookedTo[0]) < 12)
//         serviceBookedTo[0] = parseInt(serviceBookedTo[0]) + 12;

//       return {
//         bookedSlotFrom: serviceBookedFrom[0],
//         bookedSlotTo: serviceBookedTo[0],
//       };
//     } else return false;
//   };
//   track = [];
//   CheckAvailableStaff = async (staffMember, slotTime) => {
//     //Once there is a paticular staff member available at
//     // a paticular time slot.No need to check other staff members
//     // on that time slot.That slotTime  is being pushed in an array.
//     // Skipping

//     console.log("aaa::", this.temp);

//     for (let t = 0; t < this.track.length; t++) {
//       if (this.track[t].timeSlot === slotTime) {
//         return;
//       }
//     }
//     if (slotTime === "9AM to 12PM") {
//       console.log("a");
//     }
//     let slotTimeFrom = "";
//     let slotTimeTo = "";
//     let slotTimeArr = slotTime.split("to");
//     if (slotTimeArr[0].includes("AM")) {
//       slotTimeFrom = slotTimeArr[0].split("AM");
//       slotTimeFrom = slotTimeFrom[0];
//       slotTimeFrom = slotTimeFrom.replace(/ /g, "");
//       if (slotTimeFrom === "12") {
//         slotTimeFrom = 0;
//       }
//     } else {
//       slotTimeFrom = slotTimeArr[0].split("PM");
//       slotTimeFrom = slotTimeFrom[0];
//       if (slotTimeFrom.trim() !== "12")
//         slotTimeFrom = parseInt(slotTimeFrom[0]) + 12;
//     }

//     if (slotTimeArr[1].includes("AM")) {
//       slotTimeTo = slotTimeArr[1].split("AM");
//       slotTimeTo = slotTimeTo[0];
//     } else {
//       slotTimeTo = slotTimeArr[1].split("PM");
//       slotTimeTo = slotTimeTo[0];
//       if (slotTimeTo.trim() !== "12") slotTimeTo = parseInt(slotTimeTo[0]) + 12;
//     }

//     if (typeof slotTimeFrom === "string") {
//       slotTimeFrom = slotTimeFrom.trim();
//     }

//     if (typeof slotTimeTo === "string") slotTimeTo = slotTimeTo.trim();

//     // if (parseInt(slotTimeFrom) < 12) slotTimeFrom = parseInt(slotTimeFrom) + 12;
//     // if (parseInt(slotTimeTo) < 12) slotTimeTo = parseInt(slotTimeTo) + 12;

//     //Getting userRequests that have  been assigned a staff member each
//     // const { data: userRequests } = await axios.get(config.userRequests);

//     //Slots are predefined checking whether a
//     //staff member's slot is free or busy
//     // for (let i = 0; i < 8; i++) {
//     let availableFromStaff = staffMember.availabilityFrom.split(":");
//     let availableToStaff = staffMember.availabilityTo.split(":");
//     availableFromStaff[0] = availableFromStaff[0].replace(/^0+/, "");
//     availableToStaff[0] = availableToStaff[0].replace(/^0+/, "");

//     let slotBooked = false;

//     //Checking if a slot lies between a staff member's duty
//     if (
//       parseInt(slotTimeFrom) >= parseInt(availableFromStaff[0]) &&
//       parseInt(slotTimeTo) <= parseInt(availableToStaff[0])
//     ) {
//       //Checking staff member's duty booked
//       //On a slot or not.Slots are predefined
//       //Staff members are sent to this function one by one
//       for (let j = 0; j < this.state.userRequests.length; j++) {
//         const slotBookedOfStaffMember = this.getBookedSlots(
//           this.state.userRequests[j],
//           staffMember
//         );
//         if (
//           slotBookedOfStaffMember.bookedSlotFrom &&
//           parseInt(slotBookedOfStaffMember.bookedSlotFrom) ===
//             parseInt(slotTimeFrom) &&
//           parseInt(slotBookedOfStaffMember.bookedSlotTo) ===
//             parseInt(slotTimeTo)
//         ) {
//           //Slot is booked
//           //We send false here
//           //So on that basis cross could be represented
//           slotBooked = false;
//           return false;
//         } else {
//         }
//       }
//       if (!slotBooked) {
//         //Slot is not booked
//         //We send true here
//         //So on that basis tick could be represented
//         this.track.push({
//           timeSlot: slotTime,
//           tick: true,
//         });
//         // this.setState({ track });
//         return true;
//       }
//     } else {
//       //Slot doesn't lie between staff member timing
//       //We send false here
//       //So on that basis cross could be represented
//       return false;
//     }
//     // }
//   };
//   render() {
//     const { userRequests } = this.state;
//     return (
//       <article>
//         {this.props.availabilityData.length > 0 ? (
//           <table className="table availability-table">
//             <thead>
//               <tr>
//                 <th
//                   className="availability-table-th availability-header"
//                   scope="col"
//                 >
//                   Timings
//                 </th>

//                 {/* <th
//                 className="availability-table-th"
//                 scope="col"
//                 colSpan={userRequests.length}
//               >
//                 Booked-Slots
//               </th> */}
//                 {/* <th className="availability-table-th" scope="col">
//               Service Cost
//             </th> */}
//               </tr>
//             </thead>

//             <tbody>
//               {this.state.availableTiming.map((data) => (
//                 <tr key={data}>
//                   <td className="availability-table-th">
//                     {data}
//                     {this.props.availabilityData.map((staff) =>
//                       this.CheckAvailableStaff(staff, data, userRequests) ? (
//                         <FontAwesomeIcon
//                           icon={faCheck}
//                           style={{ color: "#4E9F3D", marginLeft: "1rem" }}
//                         />
//                       ) : (
//                         <FontAwesomeIcon
//                           icon={faTimes}
//                           // style={{ color: "#4E9F3D" }}
//                         />
//                       )
//                     )}
//                     {/* {availabilityData.map(
//                     (staff) =>
//                       CheckAvailableStaff(staff, data) ? (
//                         <FontAwesomeIcon
//                           icon={faCheck}
//                           style={{ color: "#4E9F3D", marginLeft: "1rem" }}
//                         />
//                       ) : (
//                          <FontAwesomeIcon
//                       icon={faTimes}
//                       // style={{ color: "#4E9F3D" }}
//                     />
//                       )

//                   )} */}
//                   </td>
//                 </tr>
//               ))}

//               {/* {availabilityData.map((data) => (
//               <tr key={data._id}>
//                 <td className="availability-table-th">
//                   {data.availabilityFrom} to {data.availabilityTo}
//                 </td>
//                 {userRequests.map((userRequest) => (
//                   <>
//                     {getBookedSlots(userRequest, data) && (
//                       <td className="availability-table-th">
//                         {getBookedSlots(userRequest, data)}
//                         <FontAwesomeIcon
//                           icon={faCheckCircle}
//                           style={{ color: "#4E9F3D" }}
//                         />
//                       </td>
//                     )}
//                   </>
//                 ))}
//               </tr> */}
//             </tbody>
//           </table>
//         ) : (
//           <p className="check-availability-tag">Not Available Today!</p>
//         )}
//       </article>
//     );
//   }
// }

// export default CheckAvailability;
