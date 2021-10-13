import NavBar from "./Components/NavBar";
import { Route } from "react-router-dom";

import Login from "./Components/Login";

import SignUpNew from "./Components/SignUpNew";

import Home from "./Components/Home";

import Admin from "./Components/Admin";
import InputSearch from "./Components/Common/InputSearch";
import UserRequest from "./Components/UserRequest";
function App() {
  return (
    <article>
      {/* <InputSearch /> */}

      {/* <Route path="/admin/Panel" component={Admin} />

      <Route path="/" exact component={Home} />
      <Route path="/Signup" component={SignUpNew} />
      <Route path="/Login" component={Login} /> */}
      <UserRequest />
    </article>
  );
}

export default App;
