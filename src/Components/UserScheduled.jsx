import React from "react";
import Form from "./Common/Form";

class UserScheduled extends Form {
  render() {
    return (
      <article className="signup-page">
        <main className="card-signup card-style animate__animated animate__fadeInLeft">
          <p>Organziation: Shifa </p>
          <p>Profession: Doctor </p>
          <p>Speciality: Gynecologist </p>
          <p>-----------------------------</p>
          <p>Date : 6-7-2021 </p>
          {this.renderBtn("Book Now")}
        </main>
      </article>
    );
  }
}

export default UserScheduled;
