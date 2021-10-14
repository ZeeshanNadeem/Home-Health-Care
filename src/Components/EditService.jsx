import React from "react";
import { Avatar } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { Typography } from "@mui/material";
import { typography } from "@mui/system";
import { Button } from "@mui/material";
const EditService = () => {
  return (
    <article className="editService-container">
      <div className="doc-table-container">
        <table class="table doc-table">
          <thead className="table-th">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Qualification</th>
              <th scope="col">Phone no</th>
              <th scope="col">Email</th>
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
                <Button variant="contained">Assign Duty</Button>
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
                <Button variant="contained">Assign Duty</Button>
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
                <Button variant="contained">Assign Duty</Button>
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
                <Button variant="contained">Assign Duty</Button>
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
                <Button variant="contained">Assign Duty</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default EditService;
