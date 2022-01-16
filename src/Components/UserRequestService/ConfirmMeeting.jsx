import React from "react";
import { Component } from "react";

import UserRequestContext from "./Context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import Form from "../Common/Form";
import { useContext } from "react";
import UserRequestService from "./UserRequest";
import axios from "axios";
import config from "../Api/config.json";

class ConfirmMeeting extends Form {
  state = {
    confirmMeeting: [],
    counter: 0,
  };

  async componentDidMount() {
    this.props.setProgress(10);
    this.props.setProgress(30);
    const { data: meetingDetials } = await axios.get(
      config.apiEndPoint + "/confirmService"
    );
    if (meetingDetials.length > 1) {
      for (let i = 0; i < meetingDetials.length - 1; i++) {
        await axios.delete(
          config.apiEndPoint + "/confirmService/" + meetingDetials[i]._id
        );
      }
    }
    const { data } = await axios.get(config.apiEndPoint + "/confirmService");
    if (data.length === 0) this.props.history.replace("/");
    this.props.setProgress(70);
    this.setState({ confirmMeeting: data });
    this.props.setProgress(100);
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const counter = this.state.counter + 1;
    this.setState({ counter });
    if (counter >= 2) return;
    const { confirmMeeting } = this.state;
    const confirmedService = {
      fullName: confirmMeeting[0].fullName,
      Address: confirmMeeting[0].Address,
      City: confirmMeeting[0].City,
      Email: confirmMeeting[0].Email,
      Organization: confirmMeeting[0].Organization,
      PhoneNo: confirmMeeting[0].PhoneNo,
      Schedule: confirmMeeting[0].Schedule,
      Service: confirmMeeting[0].Service,
      ServiceNeededTime: confirmMeeting[0].ServiceNeededTime,
      // ServiceNeededTo: confirmMeeting[0].ServiceNeededTo,
      rated: confirmMeeting[0].rated,
      staffMemberAssigned: confirmMeeting[0].staffMemberAssigned,
      user: confirmMeeting[0].user,
    };

    try {
      await axios.post(
        config.apiEndPoint + "/userRequests?postObj=abc",
        confirmedService
      );

      await axios.delete(
        config.apiEndPoint + "/confirmService/" + confirmMeeting[0]._id
      );

      toast.success("Meeting Scheduled");
      setTimeout(() => {
        this.props.history.replace("/user/request");
      }, 4100);
    } catch (ex) {
      toast.error(ex.response.data);
    }
  };
  render() {
    console.log("confirm Meeting::", this.state.confirmMeeting);
    return (
      <article>
        <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
          <ToastContainer />
          <article className="signup-page confirm-meeting-page confirm-meeting">
            <main className="confirm-meeting-card card-signup card-style animate__animated animate__fadeInLeft">
              {this.state.confirmMeeting.map((data) => (
                <article>
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
                      Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <span className="style-meeting-detials-1">
                      {data.Schedule}
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
                      {data.PhoneNo}
                    </span>
                  </p>
                </article>
              ))}

              <article style={{ marginTop: "2.3rem" }}>
                {this.renderBtn("Confirm Meeting")}
              </article>
            </main>
          </article>
        </form>
      </article>
    );
  }
}

ConfirmMeeting.contextType = UserRequestContext;

export default ConfirmMeeting;
