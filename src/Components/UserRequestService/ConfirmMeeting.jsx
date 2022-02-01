import React from "react";

import UserRequestContext from "./Context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import { Alert } from "@mui/material";
import FurtherMeetingsPopOver from "./Modal/FurtherMeetingsPopOver";

import Form from "../Common/Form";

import axios from "axios";
import config from "../Api/config.json";

class ConfirmMeeting extends Form {
  state = {
    confirmMeeting: [],
    counter: 0,
    totalConfirmMeetings: [],
    totalMeetingsRequested: 0,
  };

  async componentDidMount() {
    this.props.setProgress(10);
    this.props.setProgress(30);
    const { data: meetingDetials } = await axios.get(
      "http://localhost:3000/api/confirmService"
    );

    let temp = [];
    temp.push(meetingDetials[0]);
    this.props.setProgress(70);

    if ("totalMeetingsRequested" in meetingDetials[0]) {
      this.setState({
        confirmMeeting: temp,
        totalConfirmMeetings: meetingDetials,
        totalMeetingsRequested: meetingDetials[0].totalMeetingsRequested,
      });
    } else {
      this.setState({
        confirmMeeting: temp,
        totalConfirmMeetings: meetingDetials,
      });
    }
    // console.log(
    //   "totalConfirmMeetings...:",
    //   meetingDetials[0].totalMeetingsRequested
    // );
    console.log("global.totalMeetings::", global.totalMeetings);
    this.props.setProgress(100);
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const counter = this.state.counter + 1;
    this.setState({ counter });
    if (counter >= 2) return;
    const { confirmMeeting } = this.state;
    const { data } = await axios.get(config.apiEndPoint + "/confirmService");

    for (let i = 0; i < data.length; i++) {
      const confirmedService = {
        fullName: data[i].fullName,
        Address: data[i].Address,
        City: data[i].City,
        Email: data[i].Email,
        Organization: data[i].Organization,
        vaccination: data[i].VaccinationPlan,
        PhoneNo: data[i].PhoneNo,
        Schedule: data[i].Schedule,
        Service: data[i].Service,
        ServiceNeededTime: data[i].ServiceNeededTime,
        // ServiceNeededTo: data[i].ServiceNeededTo,
        rated: data[i].rated,
        staffMemberAssigned: data[i].staffMemberAssigned,
        user: data[i].user,
      };

      try {
        await axios.post(
          config.apiEndPoint + "/userRequests?postObj=abc",
          confirmedService
        );

        await axios.delete(
          config.apiEndPoint + "/confirmService/" + data[i]._id
        );
      } catch (ex) {
        toast.error(ex.response.data);
      }
    }
    toast.success("Meeting Scheduled");

    setTimeout(() => {
      if (window.location.href.endsWith("/Confirm/Meeting"))
        this.props.history.replace("/user/request");
    }, 4100);
  };

  render() {
    return (
      <article>
        <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
          <ToastContainer />

          {this.state.totalMeetingsRequested !== 0 &&
            this.state.totalConfirmMeetings.length - 1 !==
              this.state.totalMeetingsRequested &&
            this.state.totalConfirmMeetings.length !== 1 && (
              <Alert severity="error">
                Some Further Meetings might not have been scheduled due to
                non-availability of staff.
              </Alert>
            )}

          {this.state.totalMeetingsRequested !== 0 &&
            this.state.totalConfirmMeetings.length === 1 && (
              <Alert severity="error">
                Further Meetings haven't been scheduled due to non-availability
                of staff.
              </Alert>
            )}
          <article className="signup-page confirm-meeting-page confirm-meeting">
            <main className="confirm-meeting-card card-signup card-style animate__animated animate__fadeInLeft">
              {this.state.confirmMeeting.map((data) => (
                <article key={data._id}>
                  {/* <span
                    style={{ display: "flex", justifyContent: "space-between" }}
                  > */}
                  <h4
                    className="meeting-info-heading"
                    style={{ marginBottom: "2rem" }}
                  >
                    Meeting Confirmation
                  </h4>
                  {/* <button className="payment-btn">Payment On Arrival</button> */}
                  {/* </span> */}
                  <p>
                    <span className="confirm-title">
                      Name&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <span className="style-meeting-detials">
                      {data.fullName}
                    </span>
                  </p>
                  <p>
                    <span className="confirm-title">
                      Date&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <span className="style-meeting-detials-1">
                      {data.Schedule}
                      &nbsp;&nbsp; &nbsp;
                      {this.state.totalConfirmMeetings.length > 1 && (
                        <FurtherMeetingsPopOver />
                      )}
                    </span>
                  </p>
                  <p>
                    <span className="confirm-title">
                      Timing&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <span className="style-meeting-detials-2">
                      {data.ServiceNeededTime}&nbsp; (Travel Time Included)
                    </span>
                  </p>

                  <p>
                    <span className="confirm-title">
                      Service &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    </span>
                    <span className="style-meeting-detials-4">
                      {data.Service.serviceName}
                    </span>
                  </p>
                  <p>
                    <span className="confirm-title">
                      Organization &nbsp;&nbsp;
                    </span>
                    <span className="style-meeting-detials-5">
                      {data.Service.serviceOrgranization.name}
                    </span>
                  </p>
                  <p>
                    <span className="confirm-title">
                      Cost &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;{" "}
                    </span>
                    &nbsp; &nbsp; &nbsp;
                    <span className="style-meeting-detials-6">
                      {data.Service.servicePrice ||
                        data.staffMemberAssigned.staffSpeciality.servicePrice}
                    </span>
                  </p>
                  <p>
                    <span className="confirm-title">
                      Address &nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <span className="style-meeting-detials-7">
                      {data.Address}
                    </span>
                  </p>

                  <p>
                    <span className="confirm-title">
                      Phone No &nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <span className="style-meeting-detials-8">
                      0{data.PhoneNo}
                    </span>
                  </p>
                </article>
              ))}
              {/* {global.servicePlan !== "None" &&
                this.state.totalConfirmMeetings.length - 1 !==
                  global.totalMeetings && (
                  <small>
                    some services might not have been scheduled due to
                    non-availability of staff.
                  </small>
                )} */}

              <article style={{ marginTop: "2.3rem" }}>
                {this.renderBtn("Confirm Meeting")}
              </article>
            </main>
          </article>
          {/* <div className="alert alert-danger" role="alert">
            This is a danger alert—check it out!
          </div> */}
        </form>
      </article>
    );
  }
}

ConfirmMeeting.contextType = UserRequestContext;

export default ConfirmMeeting;
