import React from "react";

class Form extends React.Component {
  renderInput = (type, id, name, placeholder = "") => {
    return (
      <input
        placeholder={placeholder}
        className="input"
        type={type}
        id={id}
        name={name}
      />
    );
  };

  renderLabel = (labelName, HtmlFor) => {
    return <label forHtml={HtmlFor}>{labelName}</label>;
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

  renderDropDown = (
    label,
    opt1,
    opt2,
    opt3,
    opt4,
    opt5,
    id,
    placeholder = ""
  ) => {
    return (
      <select
        placeholder={placeholder}
        id={id}
        className="form-select dropdown"
        aria-label="Default select example"
      >
        <option selected disabled>
          {label}
        </option>
        <option value="1">{opt1}</option>
        <option value="2">{opt2}</option>
        <option value="3">{opt3}</option>
        <option value="4">{opt4}</option>
        <option value="5">{opt5}</option>
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
