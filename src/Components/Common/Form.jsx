import React from "react";

class Form extends React.Component {
  renderInput = (type, id, name) => {
    return <input className="input" type={type} id={id} name={name} />;
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
}

export default Form;
