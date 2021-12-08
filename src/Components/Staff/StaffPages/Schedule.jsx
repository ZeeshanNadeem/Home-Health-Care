import React from "react";
import jwtDecode from "jwt-decode";
import logo from "../../../Icons/logo.svg";
import Button from "@mui/material/Button";
import { withStyles } from "@material-ui/core/styles";
import config from "../../Api/config.json";
import axios from "axios";
import { useEffect } from "react";

const styles = {
  root: {
    marginLeft: "40rem",
  },
};
const Schedule = () => {
  const { root } = styles;
  const [user, setUser] = React.useState([]);
  const [staffDetails, setStaffDetials] = React.useState([]);

  useEffect(async () => {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      setUser(user);
      console.log("Current use IndexDropDown:", user);

      const { data: staffRecord } = await axios.get(
        config.apiEndPoint +
          `/userRequests?staffMemberId=${user.staffMember._id}`
      );
      console.log("Nursing Record :", staffRecord);
      setStaffDetials(staffRecord);
    } catch (ex) {}
  }, []);

  return (
    <table className="table-schedule">
      <img
        className="nav-logo animate__heartBeat"
        src={logo}
        alt="home health care logo"
      />
      <h2 className="msg-above-home-cards">
        <strong>Home Heath Care's Schedules</strong>
      </h2>

      <tr>
        <th className="td-schedule">Patient Name</th>
        <th className="td-schedule">Patient Phone No</th>
        <th className="td-schedule">Patient Adresss</th>
        <th className="td-schedule">Date</th>
        <th className="td-schedule">Time</th>
      </tr>
      {staffDetails.map((staff) => (
        <tr>
          <td className="td-schedule">{staff.fullName}</td>
          <td className="td-schedule">{staff.PhoneNo}</td>
          <td className="td-schedule">{staff.Address} </td>
          <td className="td-schedule">{staff.Schedule}</td>
          <td className="td-schedule">
            {staff.ServiceNeededFrom} to {staff.ServiceNeededTo}
          </td>
        </tr>
      ))}
    </table>
  );
};

export default Schedule;