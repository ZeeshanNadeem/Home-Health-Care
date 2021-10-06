import React from "react";
import NavBar from "./NavBar";

const Hero = () => {
  return (
    <>
      <section className="hero-container">
        <header className="align">
          <h1 className="tag-msg font-style">We are here to serve You 24/7!</h1>
          <p className="discription">
            Home heath care helps you find a way to connect to nurses,doctors to
            have the priviledge to cure
          </p>
          <p className="discription-2">
            Contagious diseases and other epidemic conditions.
          </p>
        </header>
        <img
          className="hero-img"
          src="https://homehealthcare.com.ph/assets/default/img/hero_home_bg_1.svg"
        />
      </section>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, non
        fugiat est repellat facilis magnam voluptatibus temporibus laborum
        explicabo dolore!
      </p>
    </>
  );
};

export default Hero;
