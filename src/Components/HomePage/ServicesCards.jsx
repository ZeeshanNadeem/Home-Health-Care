import React from "react";
import Card from "./Card";

const ServicesCards = ({ setProgress }) => {
  return (
    <React.Fragment>
      <article style={{ textAlign: "center", marginTop: "4.5rem" }}>
        <h2 className="msg-above-home-cards animate__animated animate__fadeInUp">
          Discover Home Heath Care's <strong>ONLINE</strong> SERVICES!{" "}
        </h2>
        <p className="fadeInUp animate__animated animate__fadeInUp">
          Home Health Care, Inc. has provided convenient support and treatment
          through house calls for the past 16 years.
        </p>
      </article>
      <article className="service-cards">
        <Card
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Home Visits"
          imgSrc="https://homehealthcare.com.ph/assets/default/img/house.svg"
        />
        <Card
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Nursing Care"
          imgSrc="https://homehealthcare.com.ph/assets/default/img/online.svg"
        />
        <Card
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Physiotherapy Care"
          imgSrc="https://homehealthcare.com.ph/assets/default/img/online.svg"
        />
        {/* <Card
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Vaccination Care"
          imgSrc={vaccination4}
        />
        <Card
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Home Health Aides"
          imgSrc={doc1}
        />
        <Card
          cardTitle=""
          cardText=""
          btnName=""
          cardTitle="Sampling Care"
          imgSrc={urine}
        /> */}
        {/* {setProgress(80)} */}
      </article>
    </React.Fragment>
  );
};

export default ServicesCards;
