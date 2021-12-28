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

    if (userGot.isOrganizationAdmin === "pending") {
      toast.info("App Admin will respond to your request shortly");
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
