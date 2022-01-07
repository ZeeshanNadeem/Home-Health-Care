import React, { Component } from "react";
import Form from "../../Common/Form";
import { Link } from "react-router-dom";
import signingUp from "../SigningUp/SignUp";
import config from "../../Api/config.json";
import axios from "axios";
class AvailableDays extends Form {
  state = {
    daysAvailable: [
      {
        name: "MON",
        value: false,
      },
      {
        name: "TUE",
        value: false,
      },
      {
        name: "WED",
        value: false,
      },
      {
        name: "THRU",
        value: false,
      },
      { name: "FRI", value: false },
      { name: "SAT", value: false },
      { name: "SUN", value: false },
    ],
    slotTime: [
      {
        time: "12AM to 3AM",
        name: "12 AM to 3 AM",
        value: false,
      },
      {
        time: "3AM to 6AM",
        name: "3 AM to 6 AM",
        value: false,
      },

      {
        time: "6AM to 9AM",
        value: false,
        name: "6 AM to 9 AM",
      },
      {
        time: "9AM to 12PM",
        value: false,
        name: "9 AM to 12 PM",
      },
      {
        time: "12PM to 3PM",
        value: false,
        name: "12 PM to 3 PM",
      },
      {
        time: "3PM to 6PM",
        value: false,
        name: "3 PM to 6 PM",
      },
      {
        time: "6PM to 9PM",
        value: false,
        name: "6 PM to 9 PM",
      },
      {
        time: "9PM to 12AM",
        value: false,
        name: "9 PM to 12 AM",
      },
    ],
  };
  componentDidMount() {}
  handleSubmit = async () => {
    const addStaffMember = {
      fullName: global.staffDetails.fullName,

      email: global.staffDetails.email,
      password: global.staffDetails.password,
      serviceID: global.staffDetails.serviceID,
      Organization: global.staffDetails.Organization,
      qualificationID: global.staffDetails.qualification,
      phone: global.staffDetails.phone,
      availableTime: this.state.slotTime,
      availableDays: this.state.daysAvailable,
      Rating: 0,
      RatingAvgCount: 0,
      approvel: "pending",
    };
    try {
      const response = await signingUp(global.formData);
      localStorage.setItem("token", response.headers["x-auth-token"]);
      await axios.post(config.apiEndPoint + "/services", global.serviceObj);

      const { data: staffAdded } = await axios.post(
        "http://localhost:3000/api/staff",
        addStaffMember
      );
      window.location = "/Home";
    } catch (ex) {
      console.log(ex.response.data);
    }
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} enctype="multipart/form-data">
          <article className="avaialble-days-pg signup-page signup-org-admin ">
            <main className="available-slots available-days org-signup org card-signup signup-style-org animate__animated animate__fadeInLeft">
              <header>
                <h1
                  className="label-signup-org sign-up-header-text animate__animated animate__zoomIn"
                  style={{ margin: "0" }}
                >
                  SLOTS AND DAYS
                </h1>
              </header>

              <article className="time-slots">
                <article className="one-group-first-item addStaff-group-alignment">
                  <article className="label-addStaff">
                    {this.renderLabel("Available Slots", "availabilityFrom")}
                  </article>
                  <article className="time-slots">
                    {this.state.slotTime.map((day) =>
                      day.name === "12 PM to 3 PM" ||
                      day.name === "3 PM to 6 PM" ||
                      day.name === "6 PM to 9 PM" ||
                      day.name === "9 PM to 12 AM" ? (
                        <article></article>
                      ) : (
                        <article>
                          <article className="time-slots-Chk-Box">
                            {this.renderCheckBoxForSlots(
                              day.name,
                              day.name,
                              day.value,
                              day.name
                            )}
                          </article>
                        </article>
                      )
                    )}
                  </article>
                </article>
              </article>

              <article className="time-slots">
                <article className="one-group-first-item addStaff-group-alignment">
                  <article className="time-slots">
                    {this.state.slotTime.map((day) =>
                      day.name === "12 AM to 3 AM" ||
                      day.name === "3 AM to 6 AM" ||
                      day.name === "6 AM to 9 AM" ||
                      day.name === "9 AM to 12 PM" ? (
                        <article></article>
                      ) : (
                        <article>
                          <article className="time-slots-Chk-Box">
                            {this.renderCheckBoxForSlots(
                              day.name,
                              day.name,
                              day.value,
                              day.name
                            )}
                          </article>
                        </article>
                      )
                    )}
                  </article>
                </article>
              </article>
              <article className="time-slots">
                <article className="one-group-first-item addStaff-group-alignment">
                  <article className="label-addStaff">
                    {this.renderLabel("AVAILABLE DAYS", "availabilityFrom")}
                  </article>
                  <article className="time-slots">
                    {this.state.daysAvailable.map((day) => (
                      <article className="time-slots-Chk-Box">
                        {this.renderCheckBoxForDays(
                          day.name,
                          day.name,
                          day.value,
                          day.name
                        )}
                      </article>
                    ))}
                  </article>
                </article>
              </article>

              <article className="btn-orgSignUp org-btn signup-page-btn">
                {this.renderBtn("Sign Up")}
              </article>
              {/* <a href="#" className="google btn">
                  <i className="fa fa-google fa-fw"></i> SignUp with Google
                </a> */}
            </main>
          </article>
        </form>
      </div>
    );
  }
}

export default AvailableDays;
