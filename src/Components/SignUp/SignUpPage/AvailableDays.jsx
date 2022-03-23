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
      price: "",
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
    price: Joi.string().required(),
    phone: Joi.string().required(),
  };

  async componentDidMount() {
    const { data } = await axios.get(
      `http://localhost:3000/api/independentServices?serviceID=${global.serviceSelectedID}`
    );

    let doctorForm = { ...this.state.doctorForm };
    doctorForm.price = data[0].servicePrice;
    this.setState({ doctorForm });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let hasSelectedSlot = this.state.slotTime.some((day) => day.value === true);
    let hasSelectedDay = this.state.daysAvailable.some(
      (day) => day.value === true
    );
    if (!hasSelectedSlot && !hasSelectedDay)
      this.setState({ hasSelectedSlot: false, hasSelectedDay: false });

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (!errors && hasSelectedSlot && hasSelectedDay) {
      try {
        // const response = await signingUp(global.formData);
        // localStorage.setItem("token", response.headers["x-auth-token"]);

        let serviceOrg = global.staffDetails.serviceOrg_;
        let OrgID = global.staffDetails.OrganizationID;
        let price = this.state.doctorForm.price;
        let user = global.userID;
        // let user = response.data._id;

        // const { data: service } = await axios.get(
        //   `http://localhost:3000/api/services?IndependentServiceID=${global.serviceSelectedID}`
        // );

        // if (service.length > 0) {

        //   let serviceObj = {
        //     serviceID: service[0].IndependentService._id,
        //     serviceOrgranization:
        //       service[0].IndependentService.serviceOrganization,
        //     servicePrice: service[0].servicePrice,
        //     userID: user,
        //   };
        //   // const { data: service } = await axios.post(
        //   //   config.apiEndPoint + "/services",
        //   //   serviceObj
        //   // );
        //   const addStaffMember = {
        //     fullName: global.staffDetails.fullName,
        //     email: global.staffDetails.email,
        //     password: global.staffDetails.password,

        //     serviceID: serviceObj.serviceID,

        //     Organization: serviceObj.serviceOrgranization,
        //     qualificationID: global.staffDetails.qualification,
        //     phone: this.state.doctorForm.phone,
        //     availableTime: this.state.slotTime,
        //     availableDays: this.state.daysAvailable,
        //     Rating: 0,
        //     RatingAvgCount: 0,
        //   };

        //   const { data: staffAdded } = await axios.post(
        //     `http://localhost:3000/api/staff?dontCheck=true&signUpOrg=true`,
        //     addStaffMember
        //   );

        //   await axios.patch(config.apiEndPoint + "/user?EditUser=true", {
        //     staffMemberObj: staffAdded,
        //     // staffMemberID: response.data._id
        //     staffMemberID: global.userID,
        //   });
        //   window.location = "/Home";
        // }
        // else {

        let serviceObj = {
          serviceID: serviceOrg,
          serviceOrgranization: OrgID,
          servicePrice: price,
          userID: user,
        };
        const { data: service } = await axios.post(
          config.apiEndPoint + "/services",
          serviceObj
        );
        const lat= localStorage.getItem("lat");
        const lng= localStorage.getItem("lng");
        const radius= localStorage.getItem("radius");
    
        const addStaffMember = {
          fullName: global.staffDetails.fullName,
          email: global.staffDetails.email,
          password: global.staffDetails.password,

          serviceID: serviceObj.serviceID,

          Organization: service.serviceOrgranization,
          qualificationID: global.staffDetails.qualification,
          phone: this.state.doctorForm.phone,
          availableTime: this.state.slotTime,
          availableDays: this.state.daysAvailable,
          Rating: 0,
          RatingAvgCount: 0,
          city: global.city,
         
          lat:lat,
          lng:lng,
          radius:radius
        };

       

        const { data: staffAdded } = await axios.post(
          `http://localhost:3000/api/staff?dontCheck=true&signUpOrg=true`,
          addStaffMember
        );

        await axios.patch(config.apiEndPoint + "/user?EditUser=true", {
          staffMemberObj: staffAdded,
          // staffMemberID: response.data._id
          staffMemberID: global.userID,
        });
        localStorage.removeItem("lat");
        localStorage.removeItem("lng");
        localStorage.removeItem("radius");
        window.location = "/Home";
        // }
      } catch (ex) {
        toast.error(ex.response.data);
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
                  <article
                    className="signup-label price-label"
                    style={{ margin: "0" }}
                  >
                    {this.renderLabel("Price", "price")}
                  </article>
                  <article className="price-txt txtField-signup-org">
                    {this.renderInput(
                      "number",
                      "price",
                      "price",
                      "",
                      "",
                      "",
                      "readonly"
                    )}
                  </article>
                </article>

                <article className="second-item">
                  <article
                    className="signup-label price-label"
                    style={{ margin: "0" }}
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
              {!hasSelectedSlot && (
                <p class="error" style={{ marginLeft: "1.4rem" }}>
                  Please Select Available Slots
                </p>
              )}
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
              {!hasSelectedDay && (
                <p class="error" style={{ marginLeft: "1.4rem" }}>
                  Please Select Available Days
                </p>
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
