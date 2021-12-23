import React from "react";
import { Component } from "react";

import UserRequestContext from "./Context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import Form from "../Common/Form";
import { useContext } from "react";
import UserRequestService from "./UserRequest";

class ConfirmMeeting extends UserRequestService {
  state = {};

  componentDidMount() {}
  render() {
    return (
      <UserRequestContext.Consumer>
        {(user) => (
          <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
            <ToastContainer />
            <article className="signup-page confirm-meeting-page">
              <main className="confirm-meeting-card card-signup card-style animate__animated animate__fadeInLeft">
                <p>
                  <strong>Name:</strong>
                </p>
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
                {/* {this.renderBtn("Confirm Meeting")} */}
              </main>
            </article>
          </form>
        )}
      </UserRequestContext.Consumer>
    );
  }
}

ConfirmMeeting.contextType = UserRequestContext;

export default ConfirmMeeting;
