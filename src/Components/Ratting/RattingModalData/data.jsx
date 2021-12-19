import React from "react";
import { Avatar, Typography } from "@material-ui/core";
import ReactStars from "react-rating-stars-component";

const RattingModelData = ({ row }) => {
  const ratingChanged = (ratting) => {
    alert(`Ratting Selected ${ratting}`);
  };
  return (
    <div>
      <h2
        id="parent-modal-title"
        style={{ color: "#424242", textAlign: "center" }}
      >
        Rate Staff Member
      </h2>
      <article>
        <Avatar
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "1rem",
          }}
          alt={row.staffMemberAssigned.fullName}
          src="."
          className="avatar"
        />
      </article>
      <h4
        style={{
          textAlign: "center",
          marginTop: "0.3rem",
          color: "#424242",
        }}
      >
        {row.staffMemberAssigned.fullName}
      </h4>

      <ReactStars
        count={5}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "1rem",
        }}
        onChange={ratingChanged}
        size={40}
        activeColor="#ffd700"
      />
    </div>
  );
};

export default RattingModelData;
