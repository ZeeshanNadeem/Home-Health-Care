import React from "react";

const DropDown = ({ label, opt1, opt2, opt3, opt4, opt5 }) => {
  return (
    <article>
      <select
        id=""
        className="form-select dropdown"
        aria-label="Default select example"
      >
        <option value="" selected disabled>
          {label}
        </option>
        <option value="1">{opt1}</option>
        <option value="2">{opt2}</option>
        <option value="3">{opt3}</option>
        <option value="4">{opt4}</option>
        <option value="5">{opt5}</option>
      </select>
    </article>
  );
};

export default DropDown;
