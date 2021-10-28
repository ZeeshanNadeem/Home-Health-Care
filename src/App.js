import NavBar from "./Components/NavBar";
import { Route } from "react-router-dom";

import Login from "./Components/Login";

import SignUpNew from "./Components/SignUpNew";

import Home from "./Components/Home";

import Admin from "./Components/Admin";

import UserRequest from "./Components/UserRequest";
import AdminNav from "./Components/AdminNav";

function App() {
  return (
    <article>
      {/* <EditService /> */}
      <Route path="/admin/Panel" component={Admin} />

      <Route path="/" exact component={Home} />
      <Route path="/Signup" component={SignUpNew} />
      <Route path="/Login" component={Login} />
      <Route path="/user/request" component={UserRequest} />
    </article>
  );
}

export default App;
