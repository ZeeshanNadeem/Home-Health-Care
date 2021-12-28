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

            leaveFormYear = leaveFormYear.replace(/^(?:)?0?/, "");
            leaveFormMonth = leaveFormMonth.replace(/^(?:)?0?/, "");
            leaveFromDay = leaveFromDay.replace(/^(?:)?0?/, "");

            leaveToYear = leaveToYear.replace(/^(?:)?0?/, "");
            leaveToMonth = leaveToMonth.replace(/^(?:)?0?/, "");
            leaveToDay = leaveToDay.replace(/^(?:)?0?/, "");

            userScheduleDateYear = userScheduleDateYear.replace(/^(?:)?0?/, "");
            userScheduleDateMonth = userScheduleDateMonth.replace(
              /^(?:)?0?/,
              ""
            );
            userScheduleDateDay = userScheduleDateDay.replace(/^(?:)?0?/, "");

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

      this.setState({ availabilityData: filteredStaff });
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
    let day = date.getDate();
    let year = date.getUTCFullYear();
    let TodayDate = year + "-" + month + "-" + day;
    let { timeArr } = this.state;
    let duplicationTime = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
    ];

    if (TodayDate === schedule) {
      let currentHour = date.getHours();
      if (currentHour === "12") currentHour = "24";
      else currentHour = currentHour + 12;
      const minutes = date.getMinutes();
      let filteredTime;

      if (minutes === "0" || minutes === "00")
        filteredTime = duplicationTime.filter((x) => x >= currentHour);
      else filteredTime = duplicationTime.filter((x) => x > currentHour);

      for (let i = 0; i < filteredTime.length; i++) {
        filteredTime[i] = filteredTime[i] + ":00";
      }

      this.setState({ timeArr: filteredTime });
    } else {
      for (let i = 0; i < duplicationTime.length; i++) {
        duplicationTime[i] = duplicationTime[i] + ":00";
      }
      this.setState({ timeArr: duplicationTime });
    }
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
