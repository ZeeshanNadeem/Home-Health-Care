import React from "react";
import Form from "../Common/Form";

class UserScheduled extends Form {
  render() {
    return (
      <article className="signup-page">
        <main className="card-signup card-style animate__animated animate__fadeInLeft">
          <p>
            <strong>Service:</strong>: Nursing
          </p>
          <p>
            <strong>Organziation:</strong>: Shifa
          </p>
          <p>
            <strong>Start At:</strong>: 10-February-2020 10:00
          </p>
          <p>
            <strong>End At:</strong>: 10-February-2020 11:00
          </p>
          <p>-----------------------------</p>
          {this.renderBtn("Confirm Meeting")}
        </main>
      </article>
    );
  }
}

export default UserScheduled;
