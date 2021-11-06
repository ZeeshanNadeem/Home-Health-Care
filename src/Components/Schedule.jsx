import React from "react";
import logo from "../Icons/logo.svg";
import Button from "@mui/material/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    marginLeft: "40rem",
  },
};
const Schedule = () => {
  const { root } = styles;
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
      <article className="leave-btn">
        <Button variant="contained" className={root}>
          Apply For Leave
        </Button>
      </article>
      <tr>
        <th className="td-schedule">Employee ID </th>
        <th className="td-schedule">Employee Name</th>
        <th className="td-schedule">Profession</th>
        <th className="td-schedule">Hospital working hours</th>
        {/* <th className="td-schedule">Patient ID</th> */}
        <th className="td-schedule">Patient Name</th>
        <th className="td-schedule">Patient Phone No</th>
        <th className="td-schedule">Patient Adresss</th>
        <th className="td-schedule">Serving Time Today</th>
      </tr>
      <tr>
        <td className="td-schedule">12229199001421</td>
        <td className="td-schedule">Hassan Ikram</td>
        <td className="td-schedule">Doctor</td>
        <td className="td-schedule">8am-5pm</td>
        {/* <td className="td-schedule">22221111111</td> */}
        <td className="td-schedule">Nabeel</td>
        <td className="td-schedule">+923055520912</td>
        <td className="td-schedule">E11 St#8 houseno#3 Islamabad </td>
        <td className="td-schedule">10pm-12am</td>
      </tr>
      <tr>
        <td className="td-schedule">12229199001421</td>
        <td className="td-schedule">Hassan Ikram</td>
        <td className="td-schedule">Doctor</td>
        <td className="td-schedule">8am-5pm</td>
        {/* <td className="td-schedule">22221111111</td> */}
        <td className="td-schedule">Usman</td>
        <td className="td-schedule">+92402120212</td>
        <td className="td-schedule">
          Bahira Town Civic center st#10 house no#9{" "}
        </td>
        <td className="td-schedule">3pm-4am</td>
      </tr>
      <tr>
        <td className="td-schedule">12229199001422</td>
        <td className="td-schedule">Umer Ayaz</td>
        <td className="td-schedule">Nurse</td>
        <td className="td-schedule">1am-5pm</td>
        {/* <td className="td-schedule">22221111111</td> */}
        <td className="td-schedule">Adil</td>
        <td>+92348212306</td>
        <td className="td-schedule">
          Bahira Town Civic center st#10 house no#9{" "}
        </td>
        <td className="td-schedule">3pm-4am</td>
      </tr>
      <tr>
        <td className="td-schedule">12229199001423</td>
        <td className="td-schedule">Waqas</td>
        <td className="td-schedule">physiotherapist</td>
        <td className="td-schedule">9am-3pm</td>
        {/* <td className="td-schedule">22221111111</td> */}
        <td className="td-schedule">Talha</td>
        <td className="td-schedule">+92332120222</td>
        <td className="td-schedule">Gulberg Greens st#5 house no#2</td>
        <td className="td-schedule">9pm-10pm</td>
      </tr>
      <tr>
        <td className="td-schedule">12229199001423</td>
        <td className="td-schedule">Waqas</td>
        <td className="td-schedule">physiotherapist</td>
        <td className="td-schedule">9am-3pm</td>
        {/* <td className="td-schedule">22221111111</td> */}
        <td className="td-schedule">Moshin</td>
        <td className="td-schedule">+92031920219</td>
        <td className="td-schedule">
          Airport Housing Society st#10 house no#4
        </td>
        <td className="td-schedule">12am-2pm</td>
      </tr>
      <tr>
        <td className="td-schedule">12229199001424</td>
        <td className="td-schedule">Usman</td>
        <td className="td-schedule">Doctor</td>
        <td className="td-schedule">7am-4pm</td>
        {/* <td className="td-schedule">22221111111</td> */}
        <td className="td-schedule">Sami</td>
        <td className="td-schedule">+92032134671</td>
        <td className="td-schedule">Ghori Town Phase 8 st#2 house no#4</td>
        <td className="td-schedule">2pm-3pm</td>
      </tr>
    </table>
  );
};

export default Schedule;
