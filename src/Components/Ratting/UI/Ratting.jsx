import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { toast, ToastContainer } from "react-toastify";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useEffect } from "react";
import config from "../../Api/config.json";
import axios from "axios";
import RattingModal from "./RattingModal/RattingModal";
import Button from '@mui/material/Button';
import moment from "moment";

const Ratting = (props) => {
  const [user, setUser] = useState("");
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    props.setProgress(0);

    let user = "";
    try {
      const jwt = localStorage.getItem("token");
      user = jwtDecode(jwt);
      setUser(user);
    } catch (ex) { }
    props.setProgress(10);
    async function fetchData() {
      if (user) {
        // http://localhost:3000/api/userRequests?userID=61c07922764f46e1cbe43b96
        const { data: userRequest } = await axios.get(
          config.apiEndPoint + `/userRequests?userID=${user._id}`
        );

        console.log(userRequest)
        setUserRequests(userRequest);
      }
      props.setProgress(20);
      props.setProgress(40);
      props.setProgress(100);
    }
    fetchData();
  }, []);

  const checkRequest = (row) => {
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let time = d.getHours();
    let currentMintues = d.getMinutes();
    if (currentMintues < 10) currentMintues = "0" + currentMintues;
    if (time < 10) time = "0" + time;
    const year = d.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    const todaysDate = year + "-" + month + "-" + day;
    const serviceNeededTo = row.ServiceNeededTime;
    let serviceNeededTo_ = serviceNeededTo.split("to");
    serviceNeededTo_[1] = serviceNeededTo_[1].trim();

    let serviceNeededToCompute = "";
    if (serviceNeededTo_[1].includes("PM")) {
      let temp1 = serviceNeededTo_[1].split("PM");
      if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
      serviceNeededToCompute = temp1[0];
      if (serviceNeededToCompute < 10)
        serviceNeededToCompute = "0" + serviceNeededToCompute;
    } else {
      let temp1 = serviceNeededTo_[1].split("AM");

      if (temp1[0] === "12") temp1[0] = "00";

      serviceNeededToCompute = temp1[0];
      if (serviceNeededToCompute < 10 && temp1[0] !== "00")
        serviceNeededToCompute = "0" + serviceNeededToCompute;
    }
    let format = "hh:mm";
    serviceNeededToCompute = serviceNeededToCompute + ":00";
    time = time + ":" + currentMintues;
    let currentHour = moment(time, format),
      slotTo = moment(serviceNeededToCompute, format);

    let UserSelectedDate = row.Schedule;
    if (serviceNeededToCompute === "00:00") {
      let dateArr = UserSelectedDate.split("-");
      let day = parseInt(dateArr[2]) + 1;
      UserSelectedDate = dateArr[0] + "-" + dateArr[1] + "-" + day;
    }
    if (UserSelectedDate === todaysDate) {
      if (currentHour.isAfter(slotTo) || currentHour.isSame(slotTo)) {
        return (
          <article>
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped bg-success"
                role="progressbar"
                style={{ width: "100%" }}
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                completed
              </div>
            </div>
            {/* <RattingModal row={row} updateRating={RattingRefactor} /> */}
          </article>
        );
      } else {
        return (
          <div className="progress">
            <div
              className="progress-bar progress-bar-warning progress-bar-striped"
              role="progressbar"
              aria-valuenow="0"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: "100%" }}
            >
              pending
            </div>
          </div>
        );
      }
    } else if (moment(todaysDate).isAfter(UserSelectedDate)) {
      return (
        <article>
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped bg-success"
              role="progressbar"
              style={{ width: "100%" }}
              aria-valuenow="100"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              completed
            </div>
          </div>
          {/* <RattingModal row={row} updateRating={RattingRefactor} /> */}
        </article>
      );
    } else {
      return (
        <div className="progress">
          <div
            className="progress-bar progress-bar-warning progress-bar-striped"
            role="progressbar"
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: "100%" }}
          >
            pending
          </div>
        </div>
      );
    }
  };

  const checkRequestStatus = (row) => {
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let time = d.getHours();
    let currentMintues = d.getMinutes();
    if (currentMintues < 10) currentMintues = "0" + currentMintues;
    if (time < 10) time = "0" + time;
    const year = d.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    const todaysDate = year + "-" + month + "-" + day;
    const serviceNeededTo = row.ServiceNeededTime;
    let serviceNeededTo_ = serviceNeededTo.split("to");
    serviceNeededTo_[1] = serviceNeededTo_[1].trim();

    let serviceNeededToCompute = "";
    if (serviceNeededTo_[1].includes("PM")) {
      let temp1 = serviceNeededTo_[1].split("PM");
      if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
      serviceNeededToCompute = temp1[0];
      if (serviceNeededToCompute < 10)
        serviceNeededToCompute = "0" + serviceNeededToCompute;
    } else {
      let temp1 = serviceNeededTo_[1].split("AM");

      if (temp1[0] === "12") temp1[0] = "00";

      serviceNeededToCompute = temp1[0];
      if (serviceNeededToCompute < 10 && temp1[0] !== "00")
        serviceNeededToCompute = "0" + serviceNeededToCompute;
    }
    // const serviceNeededTo = row.ServiceNeededTime;
    // let serviceNeededTo_ = serviceNeededTo.split("-");
    // let temp1 = serviceNeededTo_[0].split(":");
    // let temp2 = serviceNeededTo_[1].split(":");
    // let serviceNeededToHourUser = temp2[0];

    let format = "hh:mm";
    serviceNeededToCompute = serviceNeededToCompute + ":00";
    time = time + ":" + currentMintues;

    let currentHour = moment(time, format),
      slotTo = moment(serviceNeededToCompute, format);

    let UserSelectedDate = row.Schedule;
    if (serviceNeededToCompute === "00:00") {
      let dateArr = UserSelectedDate.split("-");
      let day = parseInt(dateArr[2]) + 1;
      UserSelectedDate = dateArr[0] + "-" + dateArr[1] + "-" + day;
    }
    if (UserSelectedDate === todaysDate) {
      if (currentHour.isAfter(slotTo) || currentHour.isSame(slotTo)) {
        return true;
      } else return false;
    } else if (moment(todaysDate).isAfter(UserSelectedDate)) {
      return true;
    }
  };

  const RattingRefactor = async (id) => {
    let user = "";
    const jwt = localStorage.getItem("token");
    user = jwtDecode(jwt);
    setUser(user);
    const { data: userRequest } = await axios.get(
      config.apiEndPoint + `/userRequests`
    );
    const ratingRecord = userRequest.filter((r) => r._id !== id);
    await axios.delete(config.apiEndPoint + `/userRequests/${id}`);
    toast("Thanks For Your Feedback!");

    setUserRequests(ratingRecord);
  };

  const rescheduleAppointment = async (appointment) => {

    await axios.patch(config.apiEndPoint + `/userRequests?id=${appointment._id}&rescheduleAppointment=true`, {
      status: true
    })
    props.history.push("/user/request", appointment);
  }
  return (
    <article>
      <ToastContainer />
      <h3 style={{ marginLeft: "2rem", marginTop: "1rem", color: "#424242" }}>
        My Scheduled Appointments
      </h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 50 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Slot</TableCell>

              <TableCell>Date</TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userRequests.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.Service.serviceName}
                </TableCell>
                <TableCell>{row.Organization.name}</TableCell>
                <TableCell>{row.Service.servicePrice}</TableCell>
                <TableCell>{row.ServiceNeededTime}</TableCell>


                <TableCell>
                  {new Date(row.Schedule).getDate() + "-" + parseInt(new Date(row.Schedule).getMonth() + 1) + "-" + new Date(row.Schedule).getFullYear()}
                  {/* {row.Schedule[8]}
                  {row.Schedule[9]}
                  {row.Schedule[7]}
                  {row.Schedule[5]}
                  {row.Schedule[6]}
                  {row.Schedule[4]}
                  {row.Schedule[0]}
                  {row.Schedule[1]}
                  {row.Schedule[2]}
                  {row.Schedule[3]} */}
                </TableCell>

                {row.canceled && <TableCell align="left"
                  style={{ textAlign: "center", color: "red" }}
                >CANCELED</TableCell>}
                {!row.canceled && <TableCell align="left">{
                  //request checking status before

                  // checkRequest(row)
                  //now
                  row.completed ?
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-striped bg-success"
                        role="progressbar"
                        style={{ width: "100%" }}
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        completed
                      </div>
                    </div> :
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-warning progress-bar-striped"
                        role="progressbar"
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: "100%" }}
                      >
                        pending
                      </div>
                    </div>
                }</TableCell>}

                {row.completed && <TableCell>




                  <RattingModal row={row} updateRating={RattingRefactor} />


                </TableCell>}
                {/* ReScheule Appointment Button */}

                {/* { !row.completed &&<TableCell>  <Button variant="contained"
                onClick={()=>rescheduleAppointment(row)}
                >ReSchedule</Button></TableCell>} */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </article>
  );
};
export default Ratting;
