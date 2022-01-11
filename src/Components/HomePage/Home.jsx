import React from "react";
import NavBar from "./NavBar";
import Carasol from "./Carasol";
// import SearchService from "./SearchService";
import ServicesCards from "./ServicesCards";
import Footer from "../Footer/footer";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";

const Home = ({ setProgress }) => {
  const [user, setUser] = React.useState([]);
  useEffect(() => {
    const jwt = localStorage.getItem("token");
    let userGot = "";
    if (jwt) {
      userGot = jwtDecode(jwt);
      setUser(userGot);
    }

    console.log("userGOT::", userGot);
    if (
      userGot.isOrganizationAdmin === "pending" &&
      userGot.Organization._id === "61d5bc5c69b35ef18754dc9a"
    ) {
      toast.info("We will review your request shortly");
      toast.info("Then you will get duties booked only");
    } else if (userGot.isOrganizationAdmin === "pending") {
      toast.info("We will respond to your request shortly");
      toast.info("Then you can manage your organization");
    }

    document.title = "Home Health Care";
  }, []);
  return (
    <div>
      {setProgress(0)}

      <NavBar setProgress={setProgress} />
      {setProgress(10)}
      <ToastContainer />
      {setProgress(20)}

      <Carasol setProgress={setProgress} />

      {setProgress(40)}
      <ServicesCards setProgress={setProgress} />
      {setProgress(80)}

      <Footer setProgress={setProgress} />
      {setProgress(100)}
    </div>
  );
};

export default Home;
