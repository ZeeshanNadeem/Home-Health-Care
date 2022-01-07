// import NavBar from "./Components/NavBar";
import { Route } from "react-router-dom";

import Login from "./Components/Login/LoginPage/Login";

import SignUp from "./Components/SignUp/SignUpPage/SignUp";

import Home from "./Components/HomePage/Home";

import Admin from "./Components/AdminOrganization/Admin";

import UserRequestService from "./Components/UserRequestService/UserRequest";

import EditService from "./Components/AdminOrganization/EditService";

import AdminUserRequest from "./Components/AdminOrganization/AdminUserRequest";

import Leave from "./Components/StaffLeave/Leave";
import StaffPanel from "./Components/AdminOrganization/StaffPanel";
import Logout from "./Components/Logout/logout";
import AppAdmin from "./Components/AppAdmin/PanelPages/Admin";
import ManageOrganizations from "./Components/AppAdmin/PanelPages/ManageOrganizations";

import Schedule from "./Components/Staff/StaffPages/Schedule";
import OrganizationAdminRequests from "./Components/AppAdmin/PanelPages/OrganizationAdminRequests";
import ContactUs from "./Components/Maps/ContactUs";
import SignUpAsOrganization from "./Components/SignUp/SignUpPage/SignUpOrganization";
import Ratting from "./Components/Ratting/UI/Ratting";
import ConfirmMeeting from "./Components/UserRequestService/ConfirmMeeting";
import React, { useState } from "react";
import LoadingBar from "react-top-loading-bar";
import PageNotFound from "./Components/NotFound/PageNotFound";
import AvailableDays from "./Components/SignUp/SignUpPage/AvailableDays";

const App = () => {
  const isLoggedIn = localStorage.getItem("token");
  const [progress, setProgress] = useState(0);

  return (
    <article>
      <LoadingBar
        color="#1976d2"
        progress={progress}
        height={3}
        // onLoaderFinished={() => setProgress(0)}
      />

      <article class="admin-routes">
        <Route
          path="/admin"
          render={(props) => <Admin setProgress={setProgress} {...props} />}
        />

        <Route
          path="/admin/Nurse"
          render={(props) => (
            <StaffPanel setProgress={setProgress} {...props} />
          )}
        />
        <Route
          path="/admin/Services/:id?"
          render={(props) => (
            <EditService setProgress={setProgress} {...props} />
          )}
        />
        <Route
          path="/admin/Requests"
          render={(props) => (
            <AdminUserRequest setProgress={setProgress} {...props} />
          )}
        />
        {/* <Route path="/admin/Staff" component={AdminStaff} /> */}
      </article>
      <article class="admin-routes appAdmin">
        <Route
          path="/app/admin"
          render={(props) => <AppAdmin setProgress={setProgress} {...props} />}
        />
        <Route
          path="/app/admin/org/:id?"
          render={(props) => (
            <ManageOrganizations setProgress={setProgress} {...props} />
          )}
        />
        <Route
          path="/app/admin/requests/:id?"
          render={(props) => (
            <OrganizationAdminRequests setProgress={setProgress} {...props} />
          )}
        />
      </article>
      <Route
        exact
        path="/"
        render={(props) =>
          isLoggedIn !== null ? (
            <Home setProgress={setProgress} {...props} />
          ) : (
            <Login setProgress={setProgress} {...props} />
          )
        }
      />
      {/* <Route exact path="/" component={isLoggedIn ? Home : Login} /> */}

      {/* <Route exact path="/Home" component={Home} /> */}
      <Route
        exact
        path="/Signup"
        render={(props) =>
          isLoggedIn ? (
            <Home setProgress={setProgress} {...props} />
          ) : (
            <SignUp setProgress={setProgress} {...props} />
          )
        }
      />
      <Route
        exact
        path="/SignUp/Organization"
        render={(props) => (
          <SignUpAsOrganization setProgress={setProgress} {...props} />
        )}
      />
      <Route
        exact
        path="/Home"
        render={(props) => <Home setProgress={setProgress} {...props} />}
      />
      <Route
        exact
        path="/Logout"
        render={(props) => <Logout setProgress={setProgress} {...props} />}
      />
      <Route
        exact
        path="/user/request"
        render={(props) =>
          isLoggedIn ? (
            <UserRequestService setProgress={setProgress} {...props} />
          ) : (
            <Login setProgress={setProgress} {...props} />
          )
        }
        // component={UserRequestService}
      />
      <Route
        exact
        path="/staff/schedule"
        render={(props) => <Schedule setProgress={setProgress} {...props} />}
      />
      <Route
        exact
        path="/contact"
        render={(props) => <ContactUs setProgress={setProgress} {...props} />}
      />
      <Route
        exact
        path="/staff/leave/:id?"
        render={(props) => <Leave setProgress={setProgress} {...props} />}
      />
      <Route
        exact
        path="/Ratting"
        render={(props) => <Ratting setProgress={setProgress} {...props} />}
      />
      <Route
        exact
        path="/Confirm/Meeting"
        render={(props) => (
          <ConfirmMeeting setProgress={setProgress} {...props} />
        )}
      />
      <Route
        path="/NotFound"
        render={(props) => (
          <PageNotFound setProgress={setProgress} {...props} />
        )}
      />
      <Route
        path="/signUp/details"
        render={(props) => (
          <AvailableDays setProgress={setProgress} {...props} />
        )}
      />
    </article>
  );
};

export default App;
