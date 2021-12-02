import React from "react";
import NavBar from "./NavBar";
import Carasol from "./Carasol";
// import SearchService from "./SearchService";
import ServicesCards from "./ServicesCards";
import Footer from "../Footer/footer";

const Home = () => {
  return (
    <div>
      <NavBar />

      <Carasol />
      {/* <SearchService /> */}
      <ServicesCards />
      <Footer />
    </div>
  );
};

export default Home;
