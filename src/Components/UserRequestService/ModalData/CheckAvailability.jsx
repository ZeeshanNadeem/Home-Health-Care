import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import UserRequest2 from "../UserRequest2";
import config from "../../Api/config.json";
import axios from "axios";

const CheckAvailability = ({ availabilityData, userScheduledDate }) => {
  let [userRequests, setBookedSlots] = useState([]);
  let [staffLeaves, setStaffLeaves] = useState([]);

  let booked = [];
  let arr = [];
  // let [staffNo, setStaffNo] = useState(0);
  let stafCount = 0;
  useEffect(async () => {
    const { data } = await axios.get(config.userRequests);
    const { data: staffLeaves } = await axios.get(
      config.apiEndPoint + "/staffLeave"
    );

    setStaffLeaves(setStaffLeaves);
    setBookedSlots(data);
  }, []);

  //Checking booked slots of a staff
  //Looping through all the staff available and
  //checking if a staff has got slots booked or not
  const getBookedSlots = (userRequests, staff) => {
    if (
      userRequests.staffMemberAssigned._id === staff._id &&
      userRequests.Schedule === userScheduledDate
    ) {
      return (
        userRequests.ServiceNeededFrom + " to " + userRequests.ServiceNeededTo
      );
    } else return false;
  };

  const staffNo = () => {
    stafCount = stafCount + 1;
    return stafCount;
  };

  return (
    <article>
      {availabilityData.length > 0 ? (
        <table className="table availability-table">
          <thead>
            <tr>
              <th className="availability-table-th" scope="col">
                Timings
              </th>

              <th
                className="availability-table-th"
                scope="col"
                colSpan={userRequests.length}
              >
                Booked-Slots
              </th>
              {/* <th className="availability-table-th" scope="col">
              Service Cost
            </th> */}
            </tr>
          </thead>

          <tbody>
            {availabilityData.map((data) => (
              <tr key={data._id}>
                <td className="availability-table-th">
                  {data.availabilityFrom} to {data.availabilityTo}
                </td>
                {userRequests.map((userRequest) => (
                  <>
                    {getBookedSlots(userRequest, data) && (
                      <td className="availability-table-th">
                        {getBookedSlots(userRequest, data)}
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          style={{ color: "#4E9F3D" }}
                        />
                      </td>
                    )}
                  </>
                ))}
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
