import React from "react";
import Card_ from "./Card";
import vacine from "../Images/vacine4.jpg";
import doc1 from "../Images/aides2.jpg";
import urine from "../Images/urine9.jpg";
const ServicesCards = () => {
  return (
    <React.Fragment>
      <article style={{ textAlign: "center", marginTop: "4.5rem" }}>
        <h2 className="msg-above-home-cards">
          Discover Home Heath Care's <strong>ONLINE</strong> SERVICES!{" "}
        </h2>
        <p>
          Home Health Care, Inc. has provided convenient support and treatment
          through house calls for the past 16 years.
        </p>
      </article>
      <article className="service-cards">
        <Card_
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Nursing Care"
          imgSrc="https://homehealthcare.com.ph/assets/default/img/house.svg"
        />
        <Card_
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Doctor Care"
          imgSrc="https://homehealthcare.com.ph/assets/default/img/online.svg"
        />
        <Card_
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Physical Therapy"
          imgSrc="https://homehealthcare.com.ph/assets/default/img/online.svg"
        />
        <Card_
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Vaccination"
          imgSrc={vacine}
        />
        <Card_
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Home Health Aides"
          imgSrc={doc1}
        />
        <Card_
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Urine Sample"
          imgSrc={urine}
        />
      </article>
    </React.Fragment>
  );
};

export default ServicesCards;
