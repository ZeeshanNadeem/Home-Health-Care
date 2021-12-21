import menu from "../../Icons/menu.svg";
import logo from "../../Icons/logo.svg";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import IndexDropdown from "./IndexDropdown";
import { Avatar, Typography } from "@material-ui/core";
import { deepOrange, deepPurple, blue } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import AccountPopOver from "../UserProfile/AccountPopover";

class NavBar extends Component {
  state = {
    openToggler: "",
  };

  componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      this.setState({ user });
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

          <li className="nav-li">About Us</li>

          <Link to="contact">
            <li className="nav-li">Contact Us</li>
          </Link>

          {/* {user ? this.UserNameNav() : ""} */}
          {user && (
            <li>
              <AccountPopOver user={user} />
            </li>
          )}

          {!user ? (
            openToggler ? (
              <Link to="/">
                <li className="nav-li">Login</li>
              </Link>
            ) : (
              <button className="nav-btn login">
                <Link className="login-li" to="/">
                  <li>Login And Get Started</li>
                </Link>
              </button>
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
              <button className="nav-btn signup signup-btn">
                <Link to="/Signup">
                  <li className="signup-li">Sign Up</li>
                </Link>
              </button>
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
