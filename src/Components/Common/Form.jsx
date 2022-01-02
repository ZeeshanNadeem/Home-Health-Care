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
    let filteredStaff = staff;

    for (let i = 0; i < staff.length; i++) {
      console.log(i);

      let staffOnLeave = false;
      for (let j = 0; j < staffLeaves.length; j++) {
        if (staff[i]._id === staffLeaves[j].staff._id) {
          if (staffLeaves[j].leaveFrom === schedule) {
            staffOnLeave = true;

            filteredStaff = filteredStaff.filter(
              (s) => s._id !== staffLeaves[j].staff._id
            );
          } else {
            let staffLeaveDateFrom = staffLeaves[j].leaveFrom.split("-");
            let staffLeaveDateTo = staffLeaves[j].leaveTo.split("-");
            let userSelectedDate = schedule.split("-");

            let staffLeaveDateFrom_ =
              staffLeaveDateFrom[0] +
              "/" +
              staffLeaveDateFrom[1] +
              "/" +
              staffLeaveDateFrom[2];
            let staffLeaveDateTo_ =
              staffLeaveDateTo[0] +
              "/" +
              staffLeaveDateTo[1] +
              "/" +
              staffLeaveDateTo[2];
            let userSelectedDate_ =
              userSelectedDate[0] +
              "/" +
              userSelectedDate[1] +
              "/" +
              userSelectedDate[2];
            const compareDate = moment(userSelectedDate_, "YYYY/MM/DD");
            const startDate = moment(staffLeaveDateFrom_, "YYYY/MM/DD");
            const endDate = moment(staffLeaveDateTo_, "YYYY/MM/DD");
            const isBetween = compareDate.isBetween(startDate, endDate);
            if (
              isBetween ||
              compareDate.isSame(startDate) ||
              compareDate.isSame(endDate)
            ) {
              staffOnLeave = true;
              filteredStaff = filteredStaff.filter(
                (s) => s._id !== staffLeaves[j].staff._id
              );
            }
          }
        }
      }
    }
    return filteredStaff;
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
            // userSelectedTime_ = userSelectedTime_.replace(/^(?:)?0?/, "");
            // let userRequestsArr = userRequests[i].ServiceNeededFrom.split(":");
            // let userRequestServiceNeededFrom = userRequestsArr[0];
            // userRequestServiceNeededFrom = userRequestServiceNeededFrom.replace(
            //   /^(?:)?0?/,
            //   ""
            // );
            // let userRequestsToArr = userRequests[i].ServiceNeededTo.split(":");
            // let userRequestServiceNeededTo = userRequestsToArr[0];
            // userRequestServiceNeededTo = userRequestServiceNeededTo.replace(
            //   /^(?:)?0?/,
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

  //Showing available staff on a paticular date
  //Filling availableData array
  scheduleTime = async (date, doctorForm) => {
    const { service, organization } = this.state.doctorForm;
    if (service && organization) {
      const m = moment(doctorForm.schedule);
      const day = m.format("dddd");

      const d = new Date();
      let dayNo = m.day();
      if (dayNo === "0") dayNo = 7;
      const { service: serviceGot } = doctorForm;
      const { organization: orgGot } = doctorForm;
      const { data } = await axios.get(
        config.staff +
          `/?day=${dayNo}&service=${serviceGot}&organization=${orgGot}`
      );

      // let filteredStaff_ = [];
      const filteredStaff = await this.StaffLeaves(data);

      // filteredStaff_ = await this.StaffBookedSlots(filteredStaff);
      if (filteredStaff) this.setState({ availabilityData: filteredStaff });
      else this.setState({ availabilityData: data });
    }
  };

  //When user selects an organization on a drop down on userRequest Page
  //Populating the current organization's services in the next dropdown that
  // is service
  populateServices = async (inputValue) => {
    const { data } = await axios.get(
      `http://localhost:3000/api/services?organization=${inputValue}`
    );

    this.setState({ Conditionalservices: data.results });
  };

  filterTime = (schedule) => {
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getUTCFullYear();
    let TodayDate = year + "-" + month + "-" + day;

    let timeArr = [
      {
        _id: "00:00-3:00",
        name: "12 AM to 3 AM",
      },
      {
        _id: "03:00-6:00",
        name: "3 AM to 6 AM",
      },

      {
        _id: "06:00-09:00",
        name: "6 AM to 9 AM",
      },
      {
        _id: "09:00-12:00",
        name: "9 AM to 12 PM",
      },
      {
        _id: "12:00-15:00",
        name: "12 PM to 3 PM",
      },
      {
        _id: "15:00-18:00",
        name: "3 PM to 6 PM",
      },
      {
        _id: "18:00-21:00",
        name: "6 PM to 9 PM",
      },
      {
        _id: "21:00-00:00",
        name: "9 PM to 12 AM",
      },
    ];

    if (TodayDate === schedule) {
      for (let i = 0; i < timeArr.length; i++) {
        let currentHour = date.getHours();
        let temp1 = timeArr[i]._id.split("-");
        let slotFrom = temp1[0];
        let slotTo = temp1[1];
        let format = "hh:mm";
        if (currentHour < 10) currentHour = "0" + currentHour;
        currentHour = currentHour + ":00";
        let currentHour_ = moment(currentHour, format),
          beforeTime = moment(slotFrom, format),
          afterTime = moment(slotTo, format);

        if (
          // currentHour_.isBetween(beforeTime, afterTime) ||
          currentHour_.isBefore(beforeTime, afterTime) ||
          currentHour_.isSame(beforeTime)
        ) {
        } else {
          delete timeArr[i];
        }
      }

      // let format = "hh:mm";
      // let time = moment("02:00", format),
      //   beforeTime = moment("00:00", format),
      //   afterTime = moment("03:00", format);

      // if (time.isBetween(beforeTime, afterTime)) {
      //   console.log("is between");
      // } else {
      //   console.log("is not between");
      // }

      this.setState({ timeArr });
    } else this.setState({ timeArr });
  };
  handleChange = ({ currentTarget: input }) => {
    const errorMessage = this.validateProperty(input);
    const errors = { ...this.state.errors };
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const doctorForm = { ...this.state.doctorForm };
    doctorForm[input.name] = input.value;

    this.setState({ doctorForm, errors });
    const { service, organization } = doctorForm;
    if (input.name === "schedule") {
      this.filterTime(input.value);
    }
    if (input.name === "organization") {
      this.populateServices(input.value);
    } else if (service && organization) {
      this.scheduleTime(input.value, doctorForm);
    }
  };

  handleChangeForCheckBox = (e) => {
    const doctorForm = { ...this.state.doctorForm };
    doctorForm[e.currentTarget.name] = e.target.checked;
    this.setState({ doctorForm });
  };
  renderInput = (
    type,
    id,
    name,
    placeholder = "",
    minDate = "",
    maxDate = "",
    readonly = ""
  ) => {
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
          max={maxDate}
          readOnly={readonly}
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
          {Conditionalservices.length > 0 ? (
            <option value="">{label}</option>
          ) : (
            <option value="">Choose An Organization First</option>
          )}
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
    const { doctorForm, errors } = this.state;
    return (
      <article>
        <textarea
          rows={rows}
          cols={cols}
          id={id}
          name={name}
          value={doctorForm[name]}
          onChange={this.handleChange}
        ></textarea>
        {errors && errors[name] && <p className="error er">{errors[name]}</p>}
      </article>
    );
  };
}

export default Form;
