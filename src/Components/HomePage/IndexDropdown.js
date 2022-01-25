import React from "react";
import { Link } from "react-router-dom";
import { createPopper } from "@popperjs/core";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";

const IndexDropdown = () => {
  // dropdown props
  const [user, setUser] = React.useState(0);
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
      if (jwt) {
        const user = jwtDecode(jwt);
        setUser(user);
      }
    } catch (ex) {}
  }, []);

  return (
    <>
      <article>
        <Link
          to="/user/Request"
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
            dropdownPopoverShow
              ? closeDropdownPopover()
              : openDropdownPopover();
          }}
        >
          Services
        </Link>
      </article>

      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
          }
        >
          Services
        </span>

        {!user.isAppAdmin &&
        user.isOrganizationAdmin === "false" &&
        !user.staffMember ? (
          <span>
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
          </span>
        ) : (
          <span>
            <span
              to="/user/Request"
              className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
            >
              Home Vists
            </span>

            <span
              to="/user/Request"
              className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
            >
              Nursing
            </span>
            <span
              to="/user/Request"
              className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
            >
              Physiotherapy
            </span>
            <span
              to="/user/Request"
              className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
            >
              Infusion therapy
            </span>
            <span
              to="/user/Request"
              className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
            >
              Vaccination Services
            </span>
          </span>
        )}
      </div>
    </>
  );
};

export default IndexDropdown;
