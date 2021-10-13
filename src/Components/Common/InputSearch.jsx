import React from "react";

const InputSearch = () => {
  return (
    <React.Fragment>
      <article className="input-group">
        <input
          type="text"
          placeholder="Search A Service"
          className="search-input"
        />
      </article>
      <button className="search-btn">Search</button>
    </React.Fragment>
  );
};

export default InputSearch;
