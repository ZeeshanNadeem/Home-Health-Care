import menu from "../Icons/menu.svg";
import logo from "../Icons/logo.svg";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
  state = {
    openToggler: "",
  };
  handleMenu = () => {
    const { openToggler } = this.state;
    if (!openToggler) this.setState({ openToggler: "TogglerOpened" });
    else this.setState({ openToggler: "" });
  };
  render() {
    const { openToggler } = this.state;
    return (
      <nav className={`nav ${openToggler}`}>
        <img className="nav-logo" src={logo} alt="home health care logo" />

        <img
          className="nav-menu"
          src={menu}
          onClick={this.handleMenu}
          alt="menu"
        ></img>

        <ul className="nav-items">
          <Link to="/">
            <li>Home</li>
          </Link>
          <li>Registered Organizations</li>
          <li>About Us</li>
          <li>Contact Us</li>
          {openToggler ? (
            <Link to="/Login">
              <li>Login</li>
            </Link>
          ) : (
            <button className="nav-btn login">
              <Link className="login-li" to="/Login">
                <li>Login And Get Started</li>
              </Link>
            </button>
          )}
          {openToggler ? (
            <Link to="/Signup">
              <li>Sign Up</li>
            </Link>
          ) : (
            <button className="nav-btn signup">
              <Link to="/Signup">
                <li className="signup-li">Sign Up</li>
              </Link>
            </button>
          )}
        </ul>
      </nav>
    );
  }
}

export default NavBar;
