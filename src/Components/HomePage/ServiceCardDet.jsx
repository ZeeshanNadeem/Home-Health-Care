import * as React from "react";

import { Link } from "react-router-dom";
export default function SimplePaper() {
  return (
    <>
      <article style={{ textAlign: "center", marginTop: "4.5rem" }}>
        <h2 className="msg-above-home-cards animate__animated animate__fadeInUp">
          <strong>COVID-19 </strong> HOME HEALTH CARE SERVICES{" "}
        </h2>
        <p className="fadeInUp animate__animated animate__fadeInUp">
          {/* Physician-directed with a Case Manager as your point of care Web-based
          virtual monitoring */}
          Vaccinations for COVID 19 and Baby Vaccinations
        </p>
      </article>
      <div style={{ display: "flex" }}>
        <div className="service-card-lg">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2.2rem",
            }}
          >
            <img src="https://homehealthcare.com.ph/assets/default/img/covid-care-home.png" />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "0.5rem",
            }}
          >
            <p style={{ maxWidth: "100ch", color: "gray", fontSize: "0.9rem" }}>
              Physician-directed care for an adult or child with confirmed or
              suspected COVID-19 when inpatient care is unavailable or unsafe,
              and for patients who have been discharged from hospital, are
              recovering, or need additional support to remain safely at home.
            </p>
          </div>
          <p style={{ textAlign: "center", color: "gray", fontSize: "0.9rem" }}>
            Hospice care for terminally ill patients can also be provided
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            <Link to="/About/Us">
              <button className="more-Info-btn">More Information</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
