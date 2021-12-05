import React from "react";

const UsersRequests = () => {
  return (
    <article className="ServicePanel-wrapper">
      <React.Fragment>
        <article className="table-responsive table-Services">
          <table className="table">
            <caption>Requests for being an Organization Admin</caption>
            <thead className="table-th assign-duty-th">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">Phone</th>
                <th scope="col">Staff Assigned</th>
                <th scope="col">Staff Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </article>
      </React.Fragment>
    </article>
  );
};

export default UsersRequests;
