import React from "react";
import { Link } from "react-router-dom";
import { createPopper } from "@popperjs/core";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";

const IndexDropdown = () => {
  // dropdown props
  const [services, setServices] = React.useState([]);
  const [user, setUser] = React.useState([]);
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  useEffect(() => {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      setUser(user);
      console.log("Current use IndexDropDown:", user);
      this.setState({ user });
    } catch (ex) {}
  }, []);

  return (
    <>
      <a
        className="nav-li nav-items"
        href="#pablo"
        ref={btnDropdownRef}
        // onMouseEnter={(e) => {
        //   e.preventDefault();
        //   openDropdownPopover();
        // }}
        // onMouseOut={(e) => {
        //   e.preventDefault();
        //   closeDropdownPopover();
        // }}

        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        Services
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        {!user.isAppAdmin && (
          <article>
            <article>
              <span
                className={
                  "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
                }
              >
                Organization Admin
              </span>
              <Link
                onClick={() => setDropdownPopoverShow(false)}
                to="/admin"
                className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              >
                Admin
              </Link>
              {/* /*{" "}
              <Link
                to="/admin/settings"
                className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              >
                Settings
              </Link>
              <Link
                to="/admin/tables"
                className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              >
                Tables
              </Link>
              <Link
                to="/admin/maps"
                className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              >
                Maps
              </Link>{" "} */}
              <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100" />
              <span
                className={
                  "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
                }
              >
                Staff
              </span>
              <Link
                to="/auth/login"
                className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              >
                Schedule
              </Link>
              <Link
                to="/auth/register"
                className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              >
                Apply For Leave
              </Link>
            </article>
            <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
          </article>
        )}
        {/* <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100" /> */}
        {/* <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
          }
        >
          Doctor
        </span>

        <Link
          to="/landing"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Schedule
        </Link>
        <Link
          to="/profile"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Apply for Leave
        </Link> */}

        <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
          }
        >
          App Admin
        </span>

        <Link
          to="/app/admin"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Admin
        </Link>
        <div class="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
        <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
          }
        >
          Registered Organizations
        </span>

        <Link
          to="/profile"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Organizations
        </Link>
      </div>
    </>
  );
};

export default IndexDropdown;
