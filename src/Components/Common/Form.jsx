import React from "react";
import { Alert } from "@mui/material";
import getDay from "date-fns/getDay";
import Joi from "joi-browser";
import axios from "axios";
import moment from "moment";
import config from "../Api/config.json";

class Form extends React.Component {
  state = {
    doctorForm: {
      // fullName: "",
      // dateOfBirth: "",
      // staffType: "",
      // qualification: "",
      // email: "",
      // phone: "",
      // serviceName: "",
      // serviceOrgranization: "",
      // servicePrice: "",
      // //User Request
      // service: "",
      // organization: "",
      // schedule: "",
      // address: "",
      // phoneno: "",
      // addressCheckBox: "",
    },
    errors: {},
    availabilityData: [],
  };

  validateProperty = ({ value, name }) => {
    let dataProperty = { [name]: value };
    let subSchema = { [name]: this.schema[name] };
    let errors = {};
    const { error } = Joi.validate(dataProperty, subSchema);

    return error ? error.details[0].message : null;
  };

  validate = () => {
    const { error } = Joi.validate(this.state.doctorForm, this.schema, {
      abortEarly: false,
    });
    if (!error) return null;
    let errors = {};
    if (error) {
      for (let item of error.details) {
        errors[item.path] = item.message;
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  //Deleting those staff members who are on Leave.
  //When staff member leave comes in between user required service date.
  //Those staff members shouldn't be displayed in check availability
  StaffLeaves = async (staff) => {
    const { data: staffLeaves } = await axios.get(
      config.apiEndPoint + "/staffLeave"
    );
    const { schedule } = this.state.doctorForm;
    let filteredStaff = [];
    for (let i = 0; i < staff.length; i++) {
      let staffOnLeave = false;
      for (let j = 0; j < staffLeaves.length; j++) {
        if (staff[i]._id === staffLeaves[j].staff._id) {
          if (staffLeaves[j].leaveFrom === schedule) {
            staffOnLeave = true;
            // if (filteredStaff.length > 0) {
            staff = staff.filter((s) => s._id !== staffLeaves[j].staff._id);
            // } else {
            //   staff = staff.filter((s) => s._id !== staffLeaves[j].staff._id);
            // }

            break;
          } else {
            const leaveFromArr = staffLeaves[j].leaveFrom.split("-");
            const leaveToArr = staffLeaves[j].leaveTo.split("-");
            const scheduleArr = schedule.split("-");

            let leaveFormYear = leaveFromArr[0];
            let leaveFormMonth = leaveFromArr[1];
            let leaveFromDay = leaveFromArr[2];

            let leaveToYear = leaveToArr[0];
            let leaveToMonth = leaveToArr[1];
            let leaveToDay = leaveToArr[2];

            let userScheduleDateYear = scheduleArr[0];
            let userScheduleDateMonth = scheduleArr[1];
            let userScheduleDateDay = scheduleArr[2];

            leaveFormYear = leaveFormYear.replace(/^(?:00:)?0?/, "");
            leaveFormMonth = leaveFormMonth.replace(/^(?:00:)?0?/, "");
            leaveFromDay = leaveFromDay.replace(/^(?:00:)?0?/, "");

            leaveToYear = leaveToYear.replace(/^(?:00:)?0?/, "");
            leaveToMonth = leaveToMonth.replace(/^(?:00:)?0?/, "");
            leaveToDay = leaveToDay.replace(/^(?:00:)?0?/, "");

            userScheduleDateYear = userScheduleDateYear.replace(
              /^(?:00:)?0?/,
              ""
            );
            userScheduleDateMonth = userScheduleDateMonth.replace(
              /^(?:00:)?0?/,
              ""
            );
            userScheduleDateDay = userScheduleDateDay.replace(
              /^(?:00:)?0?/,
              ""
            );

            if (
              userScheduleDateYear >= leaveFormYear &&
              userScheduleDateYear <= leaveToYear
            ) {
              const checkBetweenMonths = leaveFormMonth - userScheduleDateMonth;
              const checkBetweenMonth2 = leaveToMonth - userScheduleDateMonth;

              if (checkBetweenMonths > 0 && checkBetweenMonth2 > 0) {
                staffOnLeave = true;
                // if (filteredStaff.length > 0) {
                staff = staff.filter((s) => s._id !== staffLeaves[j].staff._id);
                // } else {
                //   filteredStaff = staff.filter(
                //     (s) => s._id !== staffLeaves[j].staff._id
                //   );
                // }

                break;
              }
            }
          }
        }
      }
    }
    return staff;
  };

  //Deleting those staff members who are currently on bookedSlots Leave.
  //When user requests a service on a date
  //When staff member's booked Slot comes in between user required service date.
  //Those staff members shouldn't be displayed in check availability
  StaffBookedSlots = async (staff) => {
    const { data: userRequests } = await axios.get(
      config.apiEndPoint + "/userRequests"
    );
    const { schedule } = this.state.doctorForm;
    const { ServiceNeededFrom } = this.state.doctorForm;

    for (let i = 0; i < staff.length; i++) {
      for (let j = 0; j < userRequests.length; j++) {
        if (staff[i]._id === userRequests[j].staffMemberAssigned._id) {
          if (userRequests[j].Schedule === schedule) {
            // let userSelectedTime = ServiceNeededFrom.split(":");
            // let userSelectedTime_ = userSelectedTime[0];
            // userSelectedTime_ = userSelectedTime_.replace(/^(?:00:)?0?/, "");
            // let userRequestsArr = userRequests[i].ServiceNeededFrom.split(":");
            // let userRequestServiceNeededFrom = userRequestsArr[0];
            // userRequestServiceNeededFrom = userRequestServiceNeededFrom.replace(
            //   /^(?:00:)?0?/,
            //   ""
            // );
            // let userRequestsToArr = userRequests[i].ServiceNeededTo.split(":");
            // let userRequestServiceNeededTo = userRequestsToArr[0];
            // userRequestServiceNeededTo = userRequestServiceNeededTo.replace(
            //   /^(?:00:)?0?/,
            //   ""
            // );
            // if (
            //   userSelectedTime_ >= userRequestServiceNeededFrom &&
            //   userSelectedTime_ <= userRequestServiceNeededTo
            // ) {
            //   if (staff.length === 0) {
            //     return staff;
            //   }
            //   staff = staff.filter(
            //     (s) => s._id !== userRequests[i].staffMemberAssigned._id
            //   );
            // }
          }
        }
      }
    }
    return staff;
  };

  scheduleTime = async (date) => {
    const { service, organization, schedule, ServiceNeededFrom } =
      this.state.doctorForm;
    if (service && organization) {
      const m = moment(date);
      const day = m.format("dddd");
      const { service } = this.state.doctorForm;
      const { organization } = this.state.doctorForm;
      const { data } = await axios.get(
        config.staff +
          `/?day=${day}&service=${service}&organization=${organization}`
      );
      let filteredStaff_ = [];
      const filteredStaff = await this.StaffLeaves(data);

      // filteredStaff_ = await this.StaffBookedSlots(filteredStaff);

      this.setState({ availabilityData: filteredStaff });
    }
  };

  populateServices = async (inputValue) => {
    const { data } = await axios.get(
      `http://localhost:3000/api/services?organization=${inputValue}`
    );

    this.setState({ Conditionalservices: data.results });
  };

  handleChange = ({ currentTarget: input }) => {
    const errorMessage = this.validateProperty(input);
    const errors = { ...this.state.errors };
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const doctorForm = { ...this.state.doctorForm };
    doctorForm[input.name] = input.value;

    this.setState({ doctorForm, errors });
    const { service, organization, schedule, ServiceNeededFrom } =
      this.state.doctorForm;
    if (input.name === "organization") {
      this.populateServices(input.value);
    } else if (service && organization && schedule) {
      this.scheduleTime(input.value);
    }
  };

  handleChangeForCheckBox = (e) => {
    const doctorForm = { ...this.state.doctorForm };
    doctorForm[e.currentTarget.name] = e.target.checked;
    this.setState({ doctorForm });
  };
  renderInput = (type, id, name, placeholder = "", minDate = "") => {
    const { doctorForm, errors } = this.state;

    return (
      <article>
        <input
          name={name}
          value={doctorForm[name]}
          placeholder={placeholder}
          className="input"
          type={type}
          id={id}
          onChange={this.handleChange}
          min={minDate}
        />
        {errors && errors[name] && <p className="error">{errors[name]}</p>}
      </article>
    );
  };

  renderLabel = (labelName, ForHtml) => {
    return <label htmlfor={ForHtml}>{labelName}</label>;
  };
  renderCheckBox = (id, name, value, msg) => {
    const { doctorForm } = this.state;
    return (
      <article>
        <input
          type="checkbox"
          // checked="Only Once"
          id={id}
          name={name}
          // value={doctorForm[name]}
          onChange={this.handleChangeForCheckBox}
        />
        <label className="chkBox-Msg" forHtml={id}>
          {msg}
        </label>
      </article>
    );
  };

  renderBtn = (label) => {
    return <button className="btns">{label}</button>;
  };

  renderConditionalDropDown = (id, name, label) => {
    const { doctorForm, errors, Conditionalservices } = this.state;

    return (
      <article>
        <select
          value={doctorForm[name]}
          name={name}
          id={id}
          className="form-select dropdown"
          aria-label="Default select example"
          onChange={this.handleChange}
        >
          {Conditionalservices.length > 0 && <option value="">{label}</option>}
          {Conditionalservices ? (
            Conditionalservices.map((option) => (
              <option value={option._id} key={option._id}>
                {option.serviceName}
              </option>
            ))
          ) : (
            <option value="" key=""></option>
          )}
        </select>
        {errors && errors[name] && <p className="error">{errors[name]}</p>}
      </article>
    );
  };

  renderDropDown = (label, optionsArray, id, name, dropDownLabel = "") => {
    const { doctorForm, errors, Conditionalservices } = this.state;

    return (
      <article>
        <select
          value={doctorForm[name]}
          name={name}
          id={id}
          className="form-select dropdown"
          aria-label="Default select example"
          onChange={this.handleChange}
        >
          <option value="">{dropDownLabel}</option>
          {optionsArray.map((option) => (
            <option value={option._id} key={option._id}>
              {option.serviceName || option.name || option}
            </option>
          ))}
        </select>
        {errors && errors[name] && <p className="error">{errors[name]}</p>}
      </article>
    );
  };

  SmallDropDown = (optionsArray) => {
    return (
      <article>
        <select
          id=""
          className="small-dropdown"
          aria-label="Default select example"
        >
          {optionsArray.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </article>
    );
  };

  renderSmallButton = (btnName) => {
    return <button className="btns small-btn">{btnName}</button>;
  };

  renderMultiLineTextField = (rows, cols, id, name) => {
    const { doctorForm } = this.state;
    return (
      <textarea
        rows={rows}
        cols={cols}
        id={id}
        name={name}
        value={doctorForm[name]}
        onChange={this.handleChange}
      ></textarea>
    );
  };
}

export default Form;
