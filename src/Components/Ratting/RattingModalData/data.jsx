import React from "react";
import { Avatar, Typography } from "@material-ui/core";
import ReactStars from "react-rating-stars-component";
import { toast, ToastContainer } from "react-toastify";
import config from "../../Api/config.json";
import axios from "axios";

const RattingModelData = ({ row, updateRating }) => {
  const ratingChanged = async (ratting) => {
    const RatingAvg = row.staffMemberAssigned.RatingAvgCount + 1;
    let rating_ = (row.staffMemberAssigned.Rating + ratting) / RatingAvg;

    try {
      await axios.patch(
        config.apiEndPoint + `/staff/${row.staffMemberAssigned._id}`,
        {
          Rating: rating_,
          RatingAvgCount: RatingAvg,
        }
      );

      await axios.patch(
        config.apiEndPoint +
          `/userRequests?staffMemberID=${row.staffMemberAssigned._id}`,
        {
          Rating: rating_,
          RatingAvgCount: RatingAvg,
        }
      );
      await axios.patch(
        config.apiEndPoint +
          `/user?staffMemberID=${row.staffMemberAssigned._id}`,
        {
          Rating: rating_,
          RatingAvgCount: RatingAvg,
        }

        // await axios.delete(config.apiEndPoint+`${}`)
      );
      updateRating(row._id);
    } catch (ex) {
      toast.error(ex.response.data);
    }
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
