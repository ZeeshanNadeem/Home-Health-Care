import React from "react";
import UserRequestService from "../UserRequestService/UserRequest";
import { toast, ToastContainer } from "react-toastify";

class ConfirmMeeting extends UserRequestService {
  state = {
    doctorForm: {
      fullname: "",
      // staffMemberId: "",
      service: "",
      organization: "",
      schedule: "",
      address: "",
      phoneno: "",
      // recursive: false,
      ServiceNeededFrom: "",
      // ServiceNeededTo: "",
      // address: "",
    },
    // services: [],
    organization: [],
    Conditionalservices: [],
    availabilityData: [],
    userRequests: [],
    errors: [],
    staffLeaves: [],
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        <ToastContainer />
        <article className="signup-page confirm-meeting-page">
          <main className="confirm-meeting-card card-signup card-style animate__animated animate__fadeInLeft">
            <p>
              <strong>Service:</strong>: Nursing
            </p>
            <p>
              <strong>Organziation:</strong>: Shifa
            </p>
            <p>
              <strong>Start At:</strong>: 10-February-2020 10:00
            </p>
            <p>
              <strong>End At:</strong>: 10-February-2020 11:00
            </p>
            <p>-----------------------------</p>
            {this.renderBtn("Confirm Meeting")}
          </main>
        </article>
      </form>
    );
  }
}

export default ConfirmMeeting;
