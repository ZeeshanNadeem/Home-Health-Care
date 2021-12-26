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
    const user = jwtDecode(jwt);
    setUser(user);
    if (user.isOrganizationAdmin === "pending") {
      toast.info("App Admin will respond to your request shortly");
      toast.info("Then you can manage your organization");
    }
    document.title = "Home Health Care";
  }, []);
  return (
    <div>
      <NavBar setProgress={setProgress} />
      <ToastContainer />
      <Carasol setProgress={setProgress} />

      <ServicesCards setProgress={setProgress} />

      <Footer setProgress={setProgress} />
    </div>
  );
};

export default Home;
