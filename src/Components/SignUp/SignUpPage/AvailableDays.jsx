import React, { Component } from "react";
import Form from "../../Common/Form";
import { Link } from "react-router-dom";
import signingUp from "../SigningUp/SignUp";
import config from "../../Api/config.json";
import Joi from "joi-browser";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
class AvailableDays extends Form {
  state = {
    doctorForm: {
      // price: "",
      phone: "",
      // email: "",
      // password: "",
    },
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
    errors: {},
    hasSelectedSlot: true,
    hasSelectedDay: true,
  };
  schema = {
    // email: Joi.string().min(5).max(255).required().email(),
    // password: Joi.string().min(5).max(255).required(),
    // price: Joi.string().required(),
    phone: Joi.string().required(),
  };

  async componentDidMount() {
    // const obj = this.props.location.state;
    // const { data } = await axios.get(
    //   `http://localhost:3000/api/independentServices?serviceID=${obj.serviceSelectedID}`
    // );
    // // let doctorForm = { ...this.state.doctorForm };
    // // doctorForm.price = data[0].servicePrice;
    // this.setState({ doctorForm });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let hasSelectedSlot = this.state.slotTime.some((day) => day.value === true);
    let hasSelectedDay = this.state.daysAvailable.some(
      (day) => day.value === true
    );
    if (!hasSelectedSlot || !hasSelectedDay) {
      this.setState({ availabilityError: true });
      return;
    }

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (!errors && hasSelectedSlot && hasSelectedDay) {
      try {
        //hea

        const obj = this.props.location.state;

        let serviceOrg = obj.staffDetails.serviceOrg_;
        let OrgID = obj.staffDetails.OrganizationID;
        // let price = this.state.doctorForm.price;
        let user = obj.userID;
        let services = obj.myServices;

        let serviceObj = {
          serviceID: services[0]._id,
          serviceOrgranization: OrgID,
          // servicePrice: price,
          userID: user,
          services,
        };
        const { data: service } = await axios.post(
          config.apiEndPoint + "/services",
          serviceObj
        );
        const locations = JSON.parse(localStorage.getItem("markers"));
        const newLocation = locations.map((marker) => {
          if (marker.selected === true) delete marker.selected;
          if (marker.time) delete marker.time;

          return marker;
        });

        const addStaffMember = {
          fullName: obj.staffDetails.fullName,
          email: obj.staffDetails.email,
          password: obj.staffDetails.password,

          serviceID: services,

          Organization: services[0].serviceOrganization,
          qualificationID: obj.staffDetails.qualification,
          phone: this.state.doctorForm.phone,
          availableTime: this.state.slotTime,
          availableDays: this.state.daysAvailable,
          Rating: 0,
          RatingAvgCount: 0,
          locations: newLocation,
          // city: obj.city,
          locations: newLocation,
        };

        const { data: staffAdded } = await axios.post(
          `http://localhost:3000/api/staff?dontCheck=true&signUpOrg=true`,
          addStaffMember
        );

        await axios.patch(config.apiEndPoint + "/user?EditUser=true", {
          staffMemberObj: staffAdded,

          staffMemberID: obj.userID,
        });

        localStorage.removeItem("markers");
        window.location = "/Home";
      } catch (ex) {
        console.log(ex.response);
        // toast.error(ex.response.data);
      }
    }
  };
  render() {
    const { hasSelectedSlot, hasSelectedDay } = this.state;
    return (
      <div>
        <ToastContainer />
        <form onSubmit={this.handleSubmit}>
          <article className="avaialble-days-pg signup-page signup-org-admin ">
            <main className="available-slots available-days org-signup org card-signup signup-style-org animate__animated animate__fadeInLeft">
              <header>
                <h1
                  className="label-signup-org sign-up-header-text animate__animated animate__zoomIn"
                  style={{ margin: "0" }}
                >
                  YOUR AVAILABILITY
                </h1>
              </header>
              <article className="signup-org-group">
                <article>
                  {/* <article
                    className="signup-label price-label"
                    style={{ margin: "0" }}
                  >
                    {this.renderLabel("Price", "price")}
                  </article> */}
                  {/* <article className="price-txt txtField-signup-org">
                    {this.renderInput(
                      "number",
                      "price",
                      "price",
                      "",
                      "",
                      "",
                      "readonly"
                    )}
                  </article> */}
                </article>

                <article className="second-item">
                  <article
                    className="signup-label price-label"
                    style={{ margin: "0", width: "100%" }}
                  >
                    {this.renderLabel("Phone No", "phone")}
                  </article>
                  <article className="price-txt txtField-signup-org">
                    {this.renderInput("number", "phone", "phone")}
                  </article>
                </article>
              </article>
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
                        <article key={day.name}></article>
                      ) : (
                        <article key={day.name}>
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
                        <article key={day.name}></article>
                      ) : (
                        <article key={day.name}>
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
              {/* {!hasSelectedSlot && (
                <p class="error" style={{ marginLeft: "1.4rem" }}>
                  Please Select Available Slots
                </p>
              )} */}
              <article className="time-slots">
                <article className="one-group-first-item addStaff-group-alignment">
                  <article className="label-addStaff">
                    {this.renderLabel("AVAILABLE DAYS", "availabilityFrom")}
                  </article>
                  <article className="time-slots">
                    {this.state.daysAvailable.map((day) => (
                      <article className="time-slots-Chk-Box" key={day.name}>
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
              {this.state.availabilityError && (
                <p class="error">Please Select Availability</p>
              )}
              <article className="btn-orgSignUp org-btn signup-page-btn">
                {this.renderBtn("OK")}
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
