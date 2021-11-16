import React from "react";

const CheckAvailability = ({ availabilityData }) => {
  return (
    <article>
      <table className="table availability-table">
        <thead>
          <tr>
            <th className="availability-table-th" scope="col">
              Service Name
            </th>
            <th className="availability-table-th" scope="col">
              Organization
            </th>
            <th className="availability-table-th" scope="col">
              Day
            </th>
            <th className="availability-table-th" scope="col">
              Availbility From
            </th>
            <th className="availability-table-th" scope="col">
              Availbility To
            </th>
            <th className="availability-table-th" scope="col">
              Service Cost
            </th>
          </tr>
        </thead>
        <tbody>
          {availabilityData.map((data) => (
            <tr>
              <td className="availability-table-th">
                {data.service.serviceName}
              </td>
              <td className="availability-table-th">
                {data.serviceOrganization.name}
              </td>
              <td className="availability-table-th">{data.Day}</td>
              <td className="availability-table-th">{data.From}</td>
              <td className="availability-table-th">{data.To}</td>
              <td className="availability-table-th">
                {data.service.servicePrice}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};

export default CheckAvailability;
