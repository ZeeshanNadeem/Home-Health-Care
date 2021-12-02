import React from "react";
import logo from "../../Icons/logo.svg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <div>
      <footer id="footer" classNameName="footer-1">
        <div className="main-footer widgets-dark typo-light">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-3">
                <div className="widget subscribe no-box">
                  <h5 className="widget-title">
                    HOME HEALTH CARE<span></span>
                  </h5>
                  <img
                    className="nav-logo animate__heartBeat"
                    src={logo}
                    alt="home health care logo"
                  />
                  <p>
                    Home Health Care, Inc. has provided convenient support and
                    treatment through house vists
                  </p>
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-3">
                <div className="widget no-box">
                  <h5 className="widget-title">
                    Services<span></span>
                  </h5>
                  <ul className="thumbnail-widget">
                    <li>
                      <div className="thumb-content">
                        <a href="#.">Home Vists</a>
                      </div>
                    </li>
                    <li>
                      <div className="thumb-content">
                        <a href="#.">Nursing Homes</a>
                      </div>
                    </li>
                    <li>
                      <div className="thumb-content">
                        <a href="#.">Vaccination</a>
                      </div>
                    </li>
                    <li>
                      <div className="thumb-content">
                        <a href="#.">Sampling</a>
                      </div>
                    </li>
                    <li>
                      <div className="thumb-content">
                        <a href="#.">Stiches</a>
                      </div>
                    </li>
                    <li>
                      <div className="thumb-content">
                        <a href="#.">Physiotheraphy</a>
                      </div>
                    </li>
                    <li>
                      <div className="thumb-content">
                        <a href="#.">About</a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-3">
                <div className="widget no-box">
                  <h5 className="widget-title">
                    Get Started<span></span>
                  </h5>
                  <p>Contact Us</p>
                  <p>About Us</p>
                  <p>Get your home vists shecduled.</p>

                  <a
                    className="btn"
                    href="https://bit.ly/3m9avif"
                    target="_blank"
                  >
                    Sign Up
                  </a>
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-3">
                <div className="widget no-box">
                  <h5 className="widget-title">
                    Contact Us<span></span>
                  </h5>

                  <p>
                    <Link
                      className="contact-mail"
                      href="mailto:info@domain.com"
                      title="glorythemes"
                    >
                      HomeHealthCare@hotmail.com
                    </Link>
                  </p>

                  <Link href="#" className="fa fa-facebook"></Link>
                  <Link href="#" className="fa fa-twitter"></Link>
                  <Link href="#" className="fa fa-google"></Link>
                  <Link href="#" className="fa fa-linkedin"></Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <p>Copyright Home Health Care © 2021. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
