import React, { Component } from "react";
import Form from "../Common/Form";
import Joi from "joi-browser";
import config from "../Api/config.json";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
class Leave extends Form {
  state = {
    doctorForm: {
      leave_from: "",
      leave_to: "",
    },
    user: "",
  };
  componentDidMount() {
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    this.setState({ user });
  }

  schema = {
    leave_from: Joi.string().required().label("Leave From"),
    leave_to: Joi.string().required().label("Leave To"),
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (!errors) {
      const leave = {
        leave_from: this.state.doctorForm.leave_from,
        leave_to: this.state.doctorForm.leave_to,
        staffID: this.state.user.staffMember._id,
      };
      try {
        await axios.post(config.apiEndPoint + "/staffLeave", leave);
        toast.success("Leave Scheduled!");
      } catch (ex) {
        toast.error(ex.response.data);
      }
    }
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        <ToastContainer />
        <div className="leave">
          <main className="card-signup staff-leave card-style animate__animated animate__fadeInLeft">
            <article>{this.renderLabel("From", "leave_from")}</article>
            <article>
              {this.renderInput(
                "date",
                "leave_from",
                "leave_from",
                "leave_from"
              )}
            </article>
            <article>{this.renderLabel("To", "leave_to")}</article>
            <article>
              {this.renderInput("date", "leave_to", "leave_to", "leave_to")}
            </article>
            <article className="staff-leave-btn">
              {this.renderBtn("Apply For Leave")}
            </article>
          </main>
        </div>
      </form>
    );
  }
}

export default Leave;
