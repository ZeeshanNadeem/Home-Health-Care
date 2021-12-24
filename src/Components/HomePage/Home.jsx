import React from "react";
import NavBar from "./NavBar";
import Carasol from "./Carasol";
// import SearchService from "./SearchService";
import ServicesCards from "./ServicesCards";
import Footer from "../Footer/footer";
import { useEffect } from "react";

const Home = ({ setProgress }) => {
  useEffect(() => {
    document.title = "Home Health Care";
  }, []);
  return (
    <div>
      <NavBar setProgress={setProgress} />

      <Carasol setProgress={setProgress} />

      <ServicesCards setProgress={setProgress} />

      <Footer setProgress={setProgress} />
    </div>
  );
};

export default Home;
