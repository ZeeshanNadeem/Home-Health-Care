// import NavBar from "./Components/NavBar";
import { Route } from "react-router-dom";

import Login from "./Components/Login";

import SignUpNew from "./Components/SignUpNew";

import Home from "./Components/HomePage/Home";

import Admin from "./Components/AdminOrganization/Admin";

import UserRequest from "./Components/UserRequest";
import AddService from "./Components/AdminOrganization/Forms/AddService";
import EditService from "./Components/AdminOrganization/EditService";
import EditModal from "./Components/AdminOrganization/Modles/MoodleForEdit";
// import DoctorForm from "./Components/DoctorForm";
import NurseForm from "./Components/AdminOrganization/Forms/AddStaff";
// import AdminNav from "./Components/AdminNav";
import AdminUserRequest from "./Components/AdminOrganization/AdminUserRequest";
import AdminStaff from "./Components/AdminOrganization/AdminStaff";
import UserScheduled from "./Components/UserScheduled";
import Schedule from "./Components/Schedule";
import Leave from "./Components/Leave";
import StaffPanel from "./Components/AdminOrganization/StaffPanel";
function App() {
  return (
    <article>
      {/* <Schedule /> */}
      {/* <Leave /> */}
      {/* <Schedule /> */}
      {/* <EditService /> */}
      <article class="admin-routes">
        <Route path="/admin" component={Admin} />
        <Route path="/admin/Nurse" component={StaffPanel} />
        <Route path="/admin/Services/:id?" component={EditService} />
        <Route path="/admin/Requests" component={AdminUserRequest} />
        {/* <Route path="/admin/Staff" component={AdminStaff} /> */}
      </article>
      <Route exact path="/" component={Home} />
      <Route exact path="/Signup" component={SignUpNew} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/user/request" component={UserRequest} />
    </article>
  );
}

export default App;
