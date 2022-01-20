import React from "react";
import ContactUs from "./ContactUs";
import NavBar from "../HomePage/NavBar";
import Footer from "../Footer/footer";

const ContactPage = ({ setProgress }) => {
  return (
    <div>
      <NavBar />
      <h1 style={{ marginTop: "1.5rem", textAlign: "center" }}>
        Our Service Locality
      </h1>
      <ContactUs />
      <p style={{ marginLeft: "2rem", marginTop: "2rem" }}>
        <strong>Contact Information</strong>
        <br></br>
        Satellite Town A Block Rawalpindi <br></br>
        +923483933056<br></br>
        <a href="">HomeHealthCare@gmail.com</a>
      </p>
      <Footer setProgress={setProgress} />
    </div>
  );
};

export default ContactPage;
