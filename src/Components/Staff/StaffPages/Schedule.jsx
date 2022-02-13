import React from "react";
import jwtDecode from "jwt-decode";
import logo from "../../../Icons/logo.svg";
import Button from "@mui/material/Button";
import { withStyles } from "@material-ui/core/styles";
import config from "../../Api/config.json";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";

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

      const { data: staffRecord } = await axios.get(
        config.apiEndPoint +
          `/userRequests?staffMemberId=${user.staffMember._id}`
      );
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      const year = date.getFullYear();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      const todaysDate = year + "/" + month + "/" + day;
      console.log("todaysDate:", todaysDate);
      if (staffRecord.length > 0) {
        const todaysDate_ = moment(todaysDate, "YYYY/MM/DD");
        let duties = [];
        for (let i = 0; i < staffRecord.length; i++) {
          const dutyDate = moment(staffRecord[i].Schedule, "YYYY/MM/DD");
          if (todaysDate_.isAfter(dutyDate)) continue;
          else duties.push(staffRecord[i]);
        }
        setStaffDetials(duties);
      } else setStaffDetials(staffRecord);
    } catch (ex) {}
  }, []);

  return staffDetails.length > 0 ? (
    <React.Fragment>
      <img
        className="nav-logo animate__heartBeat"
        src={logo}
        alt="home health care logo"
      />
      <h2 className="msg-above-home-cards">
        <strong style={{ marginLeft: "0.5rem", color: "#333" }}>
          My Duties
        </strong>
      </h2>
      <table className="table-schedule" style={{ marginLeft: "0.5rem" }}>
        <thead>
          <tr>
            <th className="td-schedule">Patient Name</th>
            <th className="td-schedule">Patient Phone No</th>
            <th className="td-schedule">Patient Adresss</th>
            <th className="td-schedule">Date</th>
            <th className="td-schedule">SLOT</th>
          </tr>
        </thead>

        {staffDetails.map((staff) => (
          <tbody key={staff._id}>
            <tr>
              <td className="td-schedule">
                <small>{staff.fullName}</small>
              </td>
              <td className="td-schedule">
                <small>0{staff.PhoneNo}</small>
              </td>
              <td className="td-schedule">
                <small>{staff.Address}</small>
              </td>
              <td className="td-schedule">
                <small>
                  {staff.Schedule[8]}
                  {staff.Schedule[9]}
                  {staff.Schedule[7]}
                  {staff.Schedule[5]}
                  {staff.Schedule[6]}
                  {staff.Schedule[4]}
                  {staff.Schedule[0]}
                  {staff.Schedule[1]}
                  {staff.Schedule[2]}
                  {staff.Schedule[3]}
                </small>
              </td>
              <td className="td-schedule">
                <small> {staff.ServiceNeededTime}</small>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </React.Fragment>
  ) : (
    <h5
      style={{
        marginLeft: "3rem",
        marginTop: "1rem",
        color: "#333",
        maxWidth: "75ch",
        color: "",
      }}
    >
      <span
        style={{ color: "#396EB0", fontWeight: "bold", letterSpacing: "0.2px" }}
      >
        You haven't been assigned a duty lately
      </span>
      <div className="info" style={{ marginTop: "0.8rem" }}>
        <p>
          <strong>Independent </strong>
          If you're working Independently (no organization association) then
          either your request for working hasn't been approved or you aren't
          assigned a duty yet
        </p>
      </div>
      <div className="info">
        <p>
          <strong>Association </strong>
          If you're assoicated with an organization then you aren't assigned a
          duty yet
        </p>
      </div>
    </h5>
  );
};

export default Schedule;
