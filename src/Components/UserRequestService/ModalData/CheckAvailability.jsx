import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import config from "../../Api/config.json";
import axios from "axios";

const CheckAvailability = ({ availabilityData, userScheduledDate }) => {
  let [userRequests, setBookedSlots] = useState([]);
  let [staffLeaves, setStaffLeaves] = useState([]);
  // let [staffNo, setStaffNo] = useState(0);
  let stafCount = 0;
  useEffect(async () => {
    if (userRequests.length === 0) {
      const { data } = await axios.get(config.userRequests);
      const { data: staffLeaves } = await axios.get(
        config.apiEndPoint + "/staffLeave"
      );
      setStaffLeaves(setStaffLeaves);
      setBookedSlots(data);
    }
  });

  const checkBookedSlots = (userRequests, staff) => {
    if (
      userRequests.staffMemberAssigned._id === staff._id &&
      userRequests.Schedule === userScheduledDate
    ) {
      return (
        userRequests.ServiceNeededFrom +
        " to " +
        userRequests.ServiceNeededTo +
        " "
      );
    } else return false;
  };

  const staffNo = () => {
    stafCount = stafCount + 1;
    return stafCount;
  };
  console.log("Availability ::", availabilityData);
  return (
    <article>
      {availabilityData.length > 0 ? (
        <table className="table availability-table">
          <thead>
            <tr>
              {/* <th className="availability-table-th" scope="col">
              Available Staff
            </th> */}
              {/* <th className="availability-table-th" scope="col">
              Organization
            </th> */}
              <th className="availability-table-th" scope="col">
                Timings
              </th>
              {/* <th className="availability-table-th" scope="col">
              From-To
            </th> */}

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
                {/* <td className="availability-table-th">
                {data.service.serviceName} {staffNo()}
              </td> */}
                {/* <td className="availability-table-th">
                {data.serviceOrganization.name}
              </td> */}
                {/* <td className="availability-table-th">{data.staffType.name}</td> */}
                <td className="availability-table-th">
                  {data.availabilityFrom} to {data.availabilityTo}
                </td>
                {/* <td className="availability-table-th">
                {data.availabileDayFrom} to {data.availabileDayTo}
              </td> */}
                {userRequests.map((bookedSlots) => (
                  <td className="availability-table-th" key={bookedSlots._id}>
                    {checkBookedSlots(bookedSlots, data) ? (
                      <article>
                        {checkBookedSlots(bookedSlots, data)}
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          style={{ color: "#4E9F3D" }}
                        />
                      </article>
                    ) : (
                      ""
                    )}
                  </td>
                ))}

                {/* <td className="availability-table-th">
                {data.service.servicePrice}
              </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="check-availability-tag">
          Please Select Service and Organization first
        </p>
      )}
    </article>
  );
};

export default CheckAvailability;
