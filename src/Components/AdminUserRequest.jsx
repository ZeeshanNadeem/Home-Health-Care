import React from "react";
import { Avatar } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { Typography } from "@mui/material";

import Popover from "@mui/material/Popover";
import AssignDuty from "./AssignDuty";
import PopOverTable from "./PopOverTable";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@mui/material/Button";
const AdminUserRequest = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <article className="editService-container">
      <article className="table-container">
        <div className="doc-table-container">
          <table className="table doc-table">
            <thead className="table-th">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Request Type</th>
                <th scope="col">Phone no</th>
                <th scope="col">Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td className="icon-name">
                  <article className="icon-doc">
                    <Avatar alt="Zeeshan" src="." className="avatar" />
                  </article>
                  <article className="name">Neymar</article>
                </td>
                <td className="td">MBBS</td>
                <td>+9928261111</td>
                <td>abc@gmail.com</td>
                <td>
                  <Button onClick={handleClick} variant="contained">
                    <FontAwesomeIcon
                      icon={faUserTie}
                      style={{ marginRight: "0.6rem" }}
                    />
                    Assign Duty
                  </Button>
                  <div>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <PopOverTable />
                    </Popover>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td className="icon-name">
                  <article className="icon-doc">
                    <Avatar alt="Nabeel" src="." />
                  </article>
                  <article className="name">Benzema</article>
                </td>
                <td>MBBS</td>
                <td>+9928261111</td>
                <td>abc@gmail.com</td>
                <td>
                  <Button onClick={handleClick} variant="contained">
                    <FontAwesomeIcon
                      icon={faUserTie}
                      style={{ marginRight: "0.6rem" }}
                    />
                    Assign Duty
                  </Button>
                  <div>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <PopOverTable />
                    </Popover>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td className="icon-name">
                  <article className="icon-doc">
                    <Avatar alt="Waqas" src="." />
                  </article>
                  <article className="name">Salah</article>
                </td>
                <td>MBBS</td>
                <td>+9928261111</td>
                <td>abc@gmail.com</td>
                <td>
                  <Button onClick={handleClick} variant="contained">
                    <FontAwesomeIcon
                      icon={faUserTie}
                      style={{ marginRight: "0.6rem" }}
                    />
                    Assign Duty
                  </Button>
                  <div>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <PopOverTable />
                    </Popover>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td className="icon-name">
                  <article className="icon-doc">
                    <Avatar alt="Hassan" src="." />
                  </article>
                  <article className="name">Mbappe</article>
                </td>
                <td>MBBS</td>
                <td>+9928261111</td>
                <td>abc@gmail.com</td>
                <td>
                  <Button onClick={handleClick} variant="contained">
                    <FontAwesomeIcon
                      icon={faUserTie}
                      style={{ marginRight: "0.6rem" }}
                    />
                    Assign Duty
                  </Button>
                  <div>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <PopOverTable />
                    </Popover>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td className="icon-name">
                  <article className="icon-doc">
                    <Avatar alt="Umer" src="." />
                  </article>
                  <article className="name">Ronaldo</article>
                </td>
                <td>MBBS</td>
                <td>+9928261111</td>
                <td>abc@gmail.com</td>
                <td>
                  <Button onClick={handleClick} variant="contained">
                    <FontAwesomeIcon
                      icon={faUserTie}
                      style={{ marginRight: "0.6rem" }}
                    />
                    Assign Duty
                  </Button>
                  <div>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <PopOverTable />
                    </Popover>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </article>
  );
};

export default AdminUserRequest;
