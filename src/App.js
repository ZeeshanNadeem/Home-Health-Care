// import NavBar from "./Components/NavBar";
import { Route } from "react-router-dom";

import Login from "./Components/Login";

import SignUpNew from "./Components/SignUpNew";

import Home from "./Components/Home";

import Admin from "./Components/Admin";

import UserRequest from "./Components/UserRequest";
import AddService from "./Components/AddService";
import EditService from "./Components/EditService";
// import AdminNav from "./Components/AdminNav";

function App() {
  return (
    <article>
      {/* <EditService /> */}
      <Route exact path="/admin/Panel" component={Admin} />
      <Route exact path="/admin/Panel/:id" component={EditService} />

      <Route exact path="/" exact component={Home} />
      <Route exact path="/Signup" component={SignUpNew} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/user/request" component={UserRequest} />
    </article>
  );
}

export default App;
