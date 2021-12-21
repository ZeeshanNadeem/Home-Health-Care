// import NavBar from "./Components/NavBar";
import { Route } from "react-router-dom";

import Login from "./Components/Login/LoginPage/Login";

import SignUp from "./Components/SignUp/SignUpPage/SignUp";

import Home from "./Components/HomePage/Home";

import Admin from "./Components/AdminOrganization/Admin";

import UserRequestService from "./Components/UserRequestService/UserRequest";
import AddService from "./Components/AdminOrganization/Forms/AddService";
import EditService from "./Components/AdminOrganization/EditService";
import EditModal from "./Components/AdminOrganization/Modles/MoodleForEdit";
// import DoctorForm from "./Components/DoctorForm";
import NurseForm from "./Components/AdminOrganization/Forms/AddStaff";
// import AdminNav from "./Components/AdminNav";
import AdminUserRequest from "./Components/AdminOrganization/AdminUserRequest";
import AdminStaff from "./Components/AdminOrganization/AdminStaff";

import Leave from "./Components/StaffLeave/Leave";
import StaffPanel from "./Components/AdminOrganization/StaffPanel";
import Logout from "./Components/Logout/logout";
import AppAdmin from "./Components/AppAdmin/PanelPages/Admin";
import ManageOrganizations from "./Components/AppAdmin/PanelPages/ManageOrganizations";
import EditModalOrg from "./Components/AppAdmin/Modals/EditOrganizationModle";
import Schedule from "./Components/Staff/StaffPages/Schedule";
import OrganizationAdminRequests from "./Components/AppAdmin/PanelPages/OrganizationAdminRequests";
import ContactUs from "./Components/Maps/ContactUs";
import SignUpAsOrganization from "./Components/SignUp/SignUpPage/SignUpOrganization";
import Ratting from "./Components/Ratting/UI/Ratting";
import ConfirmMeeting from "./Components/UserRequestService/ConfirmMeeting";

function App() {
  const isLoggedIn = localStorage.getItem("token");
  console.log("is Logged IN :", isLoggedIn);
  return (
    <article>
      {/* <Schedule /> */}
      {/* <Leave /> */}
      {/* <Schedule /> */}
      {/* <EditService /> */}

      {/* var isLoggedIn = localStorage.getItem("token");
      <Route path="/" exact component={isLoggedIn ? Dashboard : Login} /> */}
      <article class="admin-routes">
        <Route path="/admin" component={Admin} />
        <Route path="/admin/Nurse" component={StaffPanel} />
        <Route path="/admin/Services/:id?" component={EditService} />
        <Route path="/admin/Requests" component={AdminUserRequest} />
        {/* <Route path="/admin/Staff" component={AdminStaff} /> */}
      </article>
      <article class="admin-routes appAdmin">
        <Route path="/app/admin" component={AppAdmin} />
        <Route path="/app/admin/org/:id?" component={ManageOrganizations} />
        <Route
          path="/app/admin/requests/:id?"
          component={OrganizationAdminRequests}
        />
      </article>
      <Route exact path="/" component={isLoggedIn ? Home : Login} />
      {/* <Route exact path="/Home" component={Home} /> */}
      <Route exact path="/Signup" component={isLoggedIn ? Home : SignUp} />
      <Route
        exact
        path="/SignUp/Organization"
        component={SignUpAsOrganization}
      />
      <Route exact path="/Home" component={Home} />
      <Route exact path="/Logout" component={Logout} />
      <Route
        exact
        path="/user/request"
        component={isLoggedIn ? UserRequestService : Login}
        // component={UserRequestService}
      />
      <Route exact path="/staff/schedule" component={Schedule} />
      <Route exact path="/contact" component={ContactUs} />
      <Route exact path="/staff/leave/:id?" component={Leave} />
      <Route exact path="/Ratting" component={Ratting} />
      <Route exact path="/Confirm/Meeting" component={ConfirmMeeting} />
    </article>
  );
}

export default App;
