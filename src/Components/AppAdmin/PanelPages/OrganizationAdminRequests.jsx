import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import config from "../../Api/config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const OrganizationAdminRequests = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);

  useEffect(() => {
    getPendingOrganizationAdmins();
  }, []);

  const getPendingOrganizationAdmins = async () => {
    const { data } = await axios.get(
      config.apiEndPoint + `/user?getOrganizationAdmins=abc`
    );

    setPendingAdmins(data);
  };
  const ApproveAdminRequests = async (admin) => {
    try {
      await axios.put(config.apiEndPoint + "/user" + "/" + admin._id, {
        isOrganizationAdmin: "Approved Admin",
      });
    } catch (ex) {
      toast.error(ex.response.data);
    }
    await getPendingOrganizationAdmins();
  };
  return (
    <article className="ServicePanel-wrapper">
      <React.Fragment>
        <ToastContainer />
        {pendingAdmins.length > 0 && (
          <article className="table-responsive table-Services">
            <table className="table">
              <caption>Requests for being an Organization Admin</caption>
              <thead className="table-th assign-duty-th">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Request Status</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {pendingAdmins.map((admin) => (
                  <tr>
                    <td>{admin.fullName}</td>
                    <td>{admin.email}</td>
                    <td>{admin.isOrganizationAdmin}</td>
                    <td>
                      <Link to={`/app/admin/requests/${admin._id}`}>
                        <Button
                          variant="contained"
                          onClick={() => ApproveAdminRequests(admin)}
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            style={{ marginRight: "0.6rem" }}
                          />
                          Approve Request
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        )}
      </React.Fragment>
    </article>
  );
};

export default OrganizationAdminRequests;
