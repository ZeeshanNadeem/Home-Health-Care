import React from "react";
import AddOrgModal from "../Modals/AddOrganizationModal";
const ManageOrganizations = () => {
  return (
    <article className="manage-org-wrapper">
      <AddOrgModal />
      <article className="table-responsive table-Services organizations-table">
        <table className="table">
          <thead className="table-th assign-duty-th">
            <tr>
              <th scope="col">Organization Name</th>
              <th scope="col">Service Name</th>
              <th scope="col">Service Cost</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>KRL</td>
              <td>Nursing</td>
              <td>10000</td>
            </tr>
          </tbody>
        </table>
      </article>
    </article>
  );
};

export default ManageOrganizations;
