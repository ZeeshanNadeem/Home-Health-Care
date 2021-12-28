import React from "react";

import { Carousel } from "react-bootstrap";

import img1 from "../../Images/img1.jpg";

import img3 from "../../Images/img3.jpg";
import img4 from "../../Images/img4.jpg";
import img5 from "../../Images/img5.jpg";
import img9 from "../../Images/img5.jpg";

import img10 from "../../Images/img10.jpg";

const Carasol = ({ setProgress }) => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100 carasol-img"
          src={img1}
          alt="First slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100 carasol-img"
          src={img3}
          alt="First slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100 carasol-img"
          src={img9}
          alt="First slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100 carasol-img"
          src={img4}
          alt="First slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100 carasol-img"
          src={img5}
          alt="First slide"
        />
      </Carousel.Item>

      {/* <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100 carasol-img"
          src={img6}
          alt="First slide"
        />
      </Carousel.Item> */}

      <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100 carasol-img"
          src={img10}
          alt="First slide"
        />
      </Carousel.Item>
      {setProgress(60)}
      {/* <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100"
          src={nurse4}
          alt="First slide"
        /> */}
      {/* <Carousel.Caption>
          <h3 style={{ color: "#333" }}>Home Heath Care Nurses & Doctors</h3>
          <p style={{ color: "#333" }}>Will take care of you</p>
        </Carousel.Caption> */}
      {/* </Carousel.Item> */}

      {/* <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100"
          src={nurse5}
          alt="First slide"
        /> */}
      {/* <Carousel.Caption>
          <h3 style={{ color: "#333" }}>Home Heath Care Nurses & Doctors</h3>
          <p style={{ color: "#333" }}>Will take care of you</p>
        </Carousel.Caption> */}
      {/* </Carousel.Item> */}

      {/* <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100"
          src={nurse1}
          alt="Second slide"
        /> */}

      {/* <Carousel.Caption>
          <h3 style={{ color: "#333" }}>Home Heath Care Nurses & Doctors</h3>
          <p style={{ color: "#333" }}>Will take care of you</p>
        </Carousel.Caption> */}
      {/* </Carousel.Item> */}
      {/* <Carousel.Item>
        <img
          style={{ height: "37rem" }}
          className="d-block w-100"
          src={nurse7}
          alt="Third slide"
        /> */}

      {/* <Carousel.Caption>
          <h3 style={{ color: "#333" }}>Home Heath Care Nurses & Doctors</h3>
          <p style={{ color: "#333" }}>Will take care of you</p>
        </Carousel.Caption> */}
      {/* </Carousel.Item> */}
    </Carousel>
  );
};

export default Carasol;
