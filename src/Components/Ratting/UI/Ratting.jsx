import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useEffect } from "react";
import config from "../../Api/config.json";
import axios from "axios";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import RattingModal from "./RattingModal/RattingModal";

import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    background: "#1976d2",
  },
};

const Ratting = (props) => {
  const [user, setUser] = useState("");
  const [userRequests, setUserRequests] = useState([]);
  const { classes } = props;
  useEffect(() => {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      setUser(user);
    } catch (ex) {}

    async function fetchData() {
      if (user) {
        const { data: userRequest } = await axios.get(
          config.apiEndPoint + `/userRequests?userID=${user._id}`
        );
        console.log("userRequest::", userRequest);
        setUserRequests(userRequest);
      }
    }
    fetchData();
  }, []);
  return (
    <article>
      <h3 style={{ marginLeft: "2rem", marginTop: "1rem", color: "#424242" }}>
        My Scheduled Meetings
      </h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 50 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Date</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userRequests.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.Service.serviceName}
                </TableCell>
                <TableCell>{row.Organization.name}</TableCell>
                <TableCell>{row.Service.servicePrice}</TableCell>
                <TableCell>{row.ServiceNeededFrom}</TableCell>
                <TableCell>{row.ServiceNeededTo}</TableCell>
                <TableCell>{row.Schedule}</TableCell>
                <TableCell>
                  <RattingModal />

                  {/* <Rating
                    name="size-large no-value"
                    defaultValue={2}
                    size="large"
                  /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </article>
  );
};

export default Ratting;

// export default async function BasicTable() {
//   const [user, setUser] = useState("");
//   const [userRequests, setUserRequests] = useState([]);

//   useEffect(async () => {
//     try {
//       const jwt = localStorage.getItem("token");
//       const user = jwtDecode(jwt);
//       setUser(user);
//     } catch (ex) {}

//     const { data: userRequest } = await axios.get(
//       config.apiEndPoint + `/userRequests?userID=${user._id}`
//     );
//     console.log("user Requests ::", userRequest);
//     setUserRequests(userRequest);
//   }, []);
//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 50 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Service</TableCell>
//             <TableCell>Organization</TableCell>
//             <TableCell>Cost</TableCell>
//             <TableCell>From</TableCell>
//             <TableCell>To</TableCell>
//             <TableCell>Date</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {userRequests.map((row) => (
//             <TableRow
//               key={row._id}
//               sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//             >
//               <TableCell component="th" scope="row">
//                 {row.Service.serviceName}
//               </TableCell>
//               <TableCell>{row.Organization.name}</TableCell>
//               <TableCell>{row.Service.servicePrice}</TableCell>
//               <TableCell>{row.ServiceNeededFrom}</TableCell>
//               <TableCell>{row.ServiceNeededTo}</TableCell>
//               <TableCell>{row.Schedule}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
