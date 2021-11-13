import React from "react";
import NavBar from "./NavBar";
import Carasol from "./Carasol";
// import SearchService from "./SearchService";
import ServicesCards from "./ServicesCards";

const Home = () => {
  return (
    <div>
      <NavBar />

      <Carasol />
      {/* <SearchService /> */}
      <ServicesCards />
    </div>
  );
};

export default Home;
