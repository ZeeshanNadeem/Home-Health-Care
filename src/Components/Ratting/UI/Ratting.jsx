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
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import RattingModal from "./RattingModal/RattingModal";

import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    background: "#1976d2",
  },
};

const Ratting = (props) => {
  const [user, setUser] = useState("");
  const [userRequests, setUserRequests] = useState([]);
  const { classes } = props;
  useEffect(() => {
    let user = "";
    try {
      const jwt = localStorage.getItem("token");
      user = jwtDecode(jwt);
      setUser(user);
      console.log(user);
    } catch (ex) {}

    async function fetchData() {
      if (user) {
        // http://localhost:3000/api/userRequests?userID=61c07922764f46e1cbe43b96
        const { data: userRequest } = await axios.get(
          config.apiEndPoint + `/userRequests?userID=${user._id}`
        );

        setUserRequests(userRequest);
      }
    }
    fetchData();
  }, []);

  const checkRequest = (row) => {
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const time = d.getHours();
    const year = d.getFullYear();
    const todaysDate = year + "-" + month + "-" + day;
    const serviceNeededTo = row.ServiceNeededTo;
    let serviceNeededTo_ = serviceNeededTo.split(":");
    let serviceNeededToHourUser = serviceNeededTo_[0];
    const UserSelectedDate = row.Schedule;
    if (UserSelectedDate === todaysDate) {
      if (time >= serviceNeededToHourUser) {
        return (
          <article>
            <div class="progress">
              <div
                class="progress-bar progress-bar-striped bg-success"
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
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const time = d.getHours();
    const year = d.getFullYear();
    const todaysDate = year + "-" + month + "-" + day;
    const serviceNeededTo = row.ServiceNeededTo;
    let serviceNeededTo_ = serviceNeededTo.split(":");
    let serviceNeededToHourUser = serviceNeededTo_[0];
    const UserSelectedDate = row.Schedule;
    if (UserSelectedDate === todaysDate) {
      if (time >= serviceNeededToHourUser) {
        return true;
      } else return false;
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

  return (
    <article>
      <ToastContainer />
      <h3 style={{ marginLeft: "2rem", marginTop: "1rem", color: "#424242" }}>
        My Scheduled Meetings
      </h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 50 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Date</TableCell>
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
                <TableCell>{row.ServiceNeededFrom}</TableCell>
                <TableCell>{row.ServiceNeededTo}</TableCell>
                <TableCell>{row.Schedule}</TableCell>
                <TableCell align="left">{checkRequest(row)}</TableCell>
                <TableCell>
                  {checkRequestStatus(row) ? (
                    <RattingModal row={row} updateRating={RattingRefactor} />
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </article>
  );
};
export default Ratting;
