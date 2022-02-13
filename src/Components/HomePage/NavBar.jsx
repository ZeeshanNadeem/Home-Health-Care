import menu from "../../Icons/menu.svg";
import logo from "../../Icons/logo.svg";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import IndexDropdown from "./IndexDropdown";
import { Avatar } from "@material-ui/core";
import AccountPopOver from "../UserProfile/AccountPopover";
import Notification from "./NotificationPopOver/Notification";

class NavBar extends Component {
  state = {
    openToggler: "",
  };

  componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      if (jwt) {
        const user = jwtDecode(jwt);
        this.setState({ user });
      }
    } catch (ex) {}
  }

  handleMenu = () => {
    const { openToggler } = this.state;
    if (!openToggler) this.setState({ openToggler: "TogglerOpened" });
    else this.setState({ openToggler: "" });
  };
  UserNameNav = () => {
    const { user } = this.state;

    return (
      <li className="nav-li">
        <span className="current-user">
          <Avatar alt={user.fullName} src="." className="avatar" />
          <p className="logged-in-user">{user.fullName}</p>
        </span>
      </li>
    );
  };
  render() {
    const { openToggler, user } = this.state;
    return (
      <nav className={`nav ${openToggler}`}>
        <img
          className="nav-logo animate__heartBeat"
          src={logo}
          alt="home health care logo"
        />

        <img
          className="nav-menu"
          src={menu}
          onClick={this.handleMenu}
          alt="menu"
        ></img>
        <ul className="nav-items">
          <Link to="/Home">
            <li className="nav-li">Home</li>
          </Link>

          {/* <li className="nav-li">Registered Organizations</li> */}
          <IndexDropdown />

          <Link
            to="/About/Us"
            style={{ marginLeft: "2rem", marginRight: "1rem" }}
          >
            <li className="nav-li">About Us</li>
          </Link>
          <Link to="/contact">
            <li className="nav-li">Contact Us</li>
          </Link>

          {/* {user ? this.UserNameNav() : ""} */}
          {user && (
            <React.Fragment>
              <li className="wrapper-notifications">
                <span style={{ display: "flex" }}>
                  <span>
                    <AccountPopOver user={user} />
                  </span>

                  {!user.isAppAdmin &&
                    user.isOrganizationAdmin === "false" &&
                    !user.staffMember && (
                      <span style={{ marginTop: "0.51rem" }}>
                        <Notification />
                      </span>
                    )}
                </span>
              </li>
            </React.Fragment>
          )}

          {!user ? (
            openToggler ? (
              <Link to="/">
                <li className="nav-li">Login</li>
              </Link>
            ) : (
              <article>
                <button className="nav-btn login">
                  <Link className="login-li" to="/">
                    <li>Login And Get Started</li>
                  </Link>
                </button>
              </article>
            )
          ) : (
            <li className="nav-li">
              {/* <button className="nav-btn signup logout-btn">
                <article className="logout-iconText-wrapper">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ marginTop: "0.2rem", marginRight: "0.2rem" }}
                  />
                  <Link to="/logout">
                    <p className="logout">Logout</p>
                  </Link>
                </article>
              </button> */}
            </li>
          )}
          {!user ? (
            openToggler ? (
              <Link to="/Signup">
                <li className="nav-li">Sign Up</li>
              </Link>
            ) : (
              <article>
                {/* <article className="notification">
                  <FontAwesomeIcon icon={faBell} />
                  aa
                </article> */}
                <button className="nav-btn signup signup-btn">
                  <Link to="/Signup">
                    <li className="signup-li">Sign Up</li>
                  </Link>
                </button>
              </article>
            )
          ) : (
            ""
          )}
        </ul>
      </nav>
    );
  }
}

export default NavBar;
