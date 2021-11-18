import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import config from "../../Api/config.json";
import axios from "axios";

const CheckAvailability = ({ availabilityData }) => {
  let [bookedSlots, setBookedSlots] = useState([]);
  // let [staffNo, setStaffNo] = useState(0);
  let stafCount = 0;
  useEffect(async () => {
    if (bookedSlots.length === 0) {
      const { data } = await axios.get(config.bookedSlots);

      setBookedSlots(data);
    }
  });

  const checkBookedSlots = (bookedSlots, staffDuties) => {
    if (bookedSlots.staffDuty._id === staffDuties._id) {
      return (
        bookedSlots.BookedSlotFrom + " to " + bookedSlots.BookedSlotTo + " "
      );
    } else return false;
  };

  const staffNo = () => {
    stafCount = stafCount + 1;
    return stafCount;
  };

  return (
    <article>
      <table className="table availability-table">
        <thead>
          <tr>
            <th className="availability-table-th" scope="col">
              Service Name
            </th>
            {/* <th className="availability-table-th" scope="col">
              Organization
            </th> */}
            <th className="availability-table-th" scope="col">
              Day
            </th>
            <th className="availability-table-th" scope="col">
              From
            </th>
            <th className="availability-table-th" scope="col">
              To
            </th>
            <th className="availability-table-th" scope="col">
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
                {data.service.serviceName} {staffNo()}
              </td>
              {/* <td className="availability-table-th">
                {data.serviceOrganization.name}
              </td> */}
              <td className="availability-table-th">{data.Day}</td>
              <td className="availability-table-th">{data.From}</td>
              <td className="availability-table-th">{data.To}</td>
              {bookedSlots.map((bookedSlots) => (
                <td className="availability-table-th">
                  {checkBookedSlots(bookedSlots, data) ? (
                    <article>
                      {checkBookedSlots(bookedSlots, data)}
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        style={{ color: "#4E9F3D" }}
                      />
                    </article>
                  ) : (
                    "None"
                  )}
                  {}
                </td>
              ))}
              {/* <td className="availability-table-th">
                {data.service.servicePrice}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};

export default CheckAvailability;
