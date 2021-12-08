import React, { Component } from "react";
import Form from "../Common/Form";
class Leave extends Form {
  render() {
    return (
      <div className="leave">
        <main className="card-signup staff-leave card-style animate__animated animate__fadeInLeft">
          <article>{this.renderLabel("From", "from")}</article>
          <article>
            {this.renderInput("date", "leave", "leave", "Leave")}
          </article>
          <article>{this.renderLabel("To", "to")}</article>
          <article>{this.renderInput("date", "to", "to", "to")}</article>
          <article className="staff-leave-btn">
            {this.renderBtn("Apply For Leave")}
          </article>
        </main>
      </div>
    );
  }
}

export default Leave;
