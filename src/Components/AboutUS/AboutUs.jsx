import React from "react";
import NavBar from "../HomePage/NavBar";
import usImgsm from "../../Images/usImgsm.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Footer/footer";

const AboutUs = ({ setProgress }) => {
  return (
    <div>
      <NavBar />
      <h1
        style={{
          textAlign: "center",
          marginTop: "4rem",
        }}
      >
        About Home Health Care
      </h1>
      <article
        style={{
          backgroundColor: "#F6F6F6",
          paddingTop: "1rem",
          paddingBottom: "4rem",
        }}
      >
        <article className="about-us-wrapper">
          <img
            src={usImgsm}
            alt="nurse"
            className="imgAboutUs"
            style={{
              marginTop: "3rem",
              // float: "left",
              marginRight: "2rem",
              height: "22rem",
            }}
          />
          <div style={{ lineHeight: "1.5" }}>
            <p className="p-tag-aboutUs">
              Home Health Care (HHC), is a health care service provider
              utilizing the expertise and clinical skills of a multidisciplinary
              team of physicians, registered nurses, physical therapists,
              nutritionists/dieticians, medical technologists and trained
              caregivers. The company specializes in delivering wellness
              programs and services to seniors and persons with disability in
              the comfort of their homes. It also caters to people of any age
              who need medical assistance at home as well as individual, group
              or company vaccinations, among others. Grounded on the skills of
              an extensive network of health professionals, HHC envisions itself
              as the premier provider of home-based health and wellness
              programs.
            </p>
          </div>
        </article>
      </article>

      <h1 style={{ textAlign: "center", marginTop: "3rem" }}>Testimonials</h1>
      <article className="aboutCardsWrapper">
        <article className="about-us-cards">
          <div className="card testimonals" style={{ width: "18rem" }}>
            <div className="card-body">
              {/* <h5 class="card-title">Card title</h5> */}
              <div className="card-text testimonals-text">
                <div style={{ marginLeft: "4.5rem" }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                </div>
                <div style={{ marginTop: "0.6rem" }}>
                  "I am so pleased with the progress of my aunt. All our family
                  and relatives are so surprised, we thought there is no more
                  improvement to her condition. Thank God you are in this and
                  your team is excellent."
                </div>
                <div style={{ marginTop: "0.4rem" }}>
                  <strong>Hassan Ikram</strong>
                </div>
                <p style={{ fontSize: "0.777rem" }}>
                  Home Health Services Client
                </p>
              </div>
            </div>
          </div>
          <div className="card testimonals" style={{ width: "18rem" }}>
            <div className="card-body">
              {/* <h5 class="card-title">Card title</h5> */}
              <div className="card-text testimonals-text">
                <div style={{ marginLeft: "4.5rem" }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                </div>
                <div style={{ marginTop: "0.6rem" }}>
                  "Thank you very much for the care you have been giving my
                  sister, Aida. My sisters and I really appreciate this. "
                </div>
                <div style={{ marginTop: "0.4rem" }}>
                  <strong>Mrs. Ayesha khan</strong>
                </div>
                <p style={{ fontSize: "0.777rem" }}>
                  Home Health Services Client
                </p>
              </div>
            </div>
          </div>
          <div className="card testimonals" style={{ width: "18rem" }}>
            <div className="card-body">
              {/* <h5 class="card-title">Card title</h5> */}
              <div className="card-text testimonals-text">
                <div style={{ marginLeft: "4.5rem" }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                </div>
                <div style={{ marginTop: "0.6rem" }}>
                  "My sister in law loves her caregiver from Home Health Care
                  very much. When your staff member leaves for her home, she
                  always asks, when are you coming back?"
                </div>
                <div style={{ marginTop: "0.4rem" }}>
                  <strong>Zarnish</strong>
                </div>
                <p style={{ fontSize: "0.777rem" }}>
                  Home Health Services Client
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className="about-us-cards">
          <div className="card testimonals" style={{ width: "18rem" }}>
            <div className="card-body">
              {/* <h5 class="card-title">Card title</h5> */}
              <div className="card-text testimonals-text">
                <div style={{ marginLeft: "4.5rem" }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                </div>
                <div style={{ marginTop: "0.6rem" }}>
                  "Thank you very much, Home Health Care. Your nurses did a
                  splendid job of caring for my sister.Didn't come across of
                  such and amazing health care company Wish you good luck God
                  Bless!"
                </div>
                <div style={{ marginTop: "0.4rem" }}>
                  <strong>Usman</strong>
                </div>
                <p style={{ fontSize: "0.777rem" }}>
                  Home Health Services Client
                </p>
              </div>
            </div>
          </div>

          <div className="card testimonals" style={{ width: "18rem" }}>
            <div className="card-body">
              {/* <h5 class="card-title">Card title</h5> */}
              <div className="card-text testimonals-text">
                <div style={{ marginLeft: "4.5rem" }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                </div>
                <div style={{ marginTop: "0.6rem" }}>
                  I just Couldn't thank you much my mother had been suffering
                  from physical pain she got rid of it with your amazing
                  therapy.keep delighting us.Lots of Love
                </div>
                <div style={{ marginTop: "0.4rem" }}>
                  <strong>Waqas Ahmed</strong>
                </div>
                <p style={{ fontSize: "0.777rem" }}>
                  Home Health Services Client
                </p>
              </div>
            </div>
          </div>

          <div className="card testimonals" style={{ width: "18rem" }}>
            <div className="card-body">
              {/* <h5 class="card-title">Card title</h5> */}
              <div className="card-text testimonals-text">
                <div style={{ marginLeft: "4.5rem" }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFC600" }} />
                </div>
                <div style={{ marginTop: "0.6rem" }}>
                  "I am so glad to have found Home Health Care and feel so at
                  peace knowing she is happy where she is for the moment.
                </div>
                <div style={{ marginTop: "0.4rem" }}>
                  <strong>Mohsin Azam</strong>
                </div>
                <p style={{ fontSize: "0.777rem" }}>
                  Home Health Services Client
                </p>
              </div>
            </div>
          </div>
        </article>
      </article>
      <Footer setProgress={setProgress} />
    </div>
  );
};

export default AboutUs;
