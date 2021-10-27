import React from "react";

class Form extends React.Component {
  state = {
    doctorForm: {
      fullname: "",
      dateOfBirth: "",
      qualification: "",
      email: "",
      phoneNo: "",
    },
  };
  handleChange = ({ currentTarget: input }) => {
    console.log("ON CHANGE");
    const doctorForm = { ...this.state.doctorForm };
    doctorForm[input.name] = input.value;
    console.log(doctorForm);
    this.setState({ doctorForm });
  };
  renderInput = (type, id, name, placeholder = "") => {
    const { doctorForm } = this.state;
    return (
      <input
        name={name}
        value={doctorForm[name]}
        placeholder={placeholder}
        className="input"
        type={type}
        id={id}
        onChange={this.handleChange}
      />
    );
  };

  renderLabel = (labelName, ForHtml) => {
    return <label htmlFor={ForHtml}>{labelName}</label>;
  };
  renderCheckBox = (id, name, value, msg) => {
    return (
      <React.Fragment>
        <input type="checkbox" id={id} name={name} value={value} />
        <label className="chkBox-Msg" forHtml={id}>
          {msg}
        </label>
      </React.Fragment>
    );
  };

  renderBtn = (label) => {
    return <button className="btns">{label}</button>;
  };

  renderDropDown = (label, optionsArray, id, name) => {
    const { doctorForm } = this.state;
    return (
      <select
        value={doctorForm[name]}
        id={id}
        className="form-select dropdown"
        aria-label="Default select example"
      >
        {optionsArray.map((option) => (
          <option value={option._id}>{option.name}</option>
        ))}
      </select>
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
            <option value={opt}>{opt}</option>
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
