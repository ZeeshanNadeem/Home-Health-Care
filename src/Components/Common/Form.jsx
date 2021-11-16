import React from "react";
import { Alert } from "@mui/material";
import getDay from "date-fns/getDay";
import Joi from "joi-browser";
import axios from "axios";
import moment from "moment";
import confiq from "../Api/config.json";

class Form extends React.Component {
  state = {
    doctorForm: {
      fullName: "",
      dateOfBirth: "",
      staffType: "",
      qualification: "",
      email: "",
      phone: "",

      serviceName: "",
      serviceOrgranization: "",
      servicePrice: "",

      //User Request
      service: "",
      organization: "618a7b3192c7e9d6236734a0",
      schedule: "",

      address: "",
      phoneno: "",
      addressCheckBox: "",
    },
    errors: {},
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
  scheduleTime = async (date) => {
    console.log("Schedule Time!!!");

    const m = moment(date);
    const day = m.format("dddd");
    console.log("Schedule ::", m.format("dddd"));
    const { data } = await axios.get(confiq.staffDuties);
    console.log(data);
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

    if (input.name === "organization") {
      this.populateServices(input.value);
    } else if (input.name === "schedule") {
      this.scheduleTime(input.value);
    }
  };
  renderInput = (type, id, name, placeholder = "") => {
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
        />
        {errors && errors[name] && <p className="error">{errors[name]}</p>}
      </article>
    );
  };

  renderLabel = (labelName, ForHtml) => {
    return <label htmlFor={ForHtml}>{labelName}</label>;
  };
  renderCheckBox = (id, name, value, msg) => {
    return (
      <article>
        <input type="checkbox" id={id} name={name} value={value} />
        <label className="chkBox-Msg" forHtml={id}>
          {msg}
        </label>
      </article>
    );
  };

  renderBtn = (label) => {
    return <button className="btns">{label}</button>;
  };

  renderConditionalDropDown = (id, name) => {
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
              {option.serviceName || option.name}
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

  renderMultiLineTextField = (rows, cols, id) => {
    return <textarea rows={rows} cols={cols} id={id}></textarea>;
  };
}

export default Form;
