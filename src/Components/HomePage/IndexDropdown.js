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
    } catch (ex) {}
  }, []);

  return (
    <>
      <Link
        className="nav-li nav-items services-li"
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
      </Link>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <article>
          <article>
            {/* {user.isOrganizationAdmin === "Approved Admin" && (
              <span>
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
                <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100" />
              </span>
            )} */}
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

            {/* {user.staffMember && (
              <span>
                <span
                  className={
                    "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
                  }
                >
                  Staff
                </span>
                <Link
                  to="/staff/schedule"
                  className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                >
                  Schedule
                </Link>
                <Link
                  to="/staff/leave"
                  className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                >
                  Apply For Leave
                </Link>

                <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
              </span>
            )} */}
          </article>
        </article>

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
        {/* 
        {user.isAppAdmin && (
          <span>
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
          </span>
        )} */}
        <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
          }
        >
          Services
        </span>

        <Link
          to="/user/Request"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Home Vists
        </Link>

        <Link
          to="/user/Request"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Nursing
        </Link>
        <Link
          to="/user/Request"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Physiotherapy
        </Link>
        <Link
          to="/user/Request"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Infusion therapy
        </Link>
        <Link
          to="/user/Request"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Vaccination Services
        </Link>
      </div>
    </>
  );
};

export default IndexDropdown;
