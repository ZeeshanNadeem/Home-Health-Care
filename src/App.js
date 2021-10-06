import NavBar from "./Components/NavBar";
import { Route } from "react-router-dom";
import Hero from "./Components/Hero";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import SignUpN from "./Components/SignUpN";
import SignUpp from "./Components/Common/Form";
import SignUpNew from "./Components/SignUpNew";
import Carasol from "./Components/Carasol";

function App() {
  return (
    <article>
      <Carasol />
      {/* <NavBar />

      <Route path="/" exact component={Hero} />
      <Route path="/Signup" component={SignUpNew} />
      <Route path="/Login" component={Login} /> */}
    </article>
  );
}

export default App;
