import jwtDecode from "jwt-decode";
import logo from "../../../Icons/logo.svg";
import Button from "@mui/material/Button";
import { withStyles } from "@material-ui/core/styles";
import config from "../../Api/config.json";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import swal from "sweetalert";
import GetCurrentUser from "../../CurrentUser/GetCurrentUser";
import * as React from "react";

import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";

import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Dessert (100g serving)",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Calories",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "Fat (g)",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Carbs (g)",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Protein (g)",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          My Duties
        </Typography>
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const Schedule = (props) => {
  const [user, setUser] = React.useState([]);
  const [staffDetails, setStaffDetials] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    async function fetchData() {
      // You can await here
      try {
        const jwt = localStorage.getItem("token");

        const user = jwtDecode(jwt);
        setUser(user);

        const { data: staffRecord } = await axios.get(
          config.apiEndPoint +
            `/userRequests?staffMemberId=${user.staffMember._id}&showMyDuties=true`
        );

        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        const todaysDate = year + "/" + month + "/" + day;
        console.log("todaysDate:", todaysDate);

        //Filtering those requests that are gone past today
        //checking on date
        // if (staffRecord.length > 0) {
        //   const todaysDate_ = moment(todaysDate, "YYYY/MM/DD");
        //   let duties = [];
        //   for (let i = 0; i < staffRecord.length; i++) {
        //     const dutyDate = moment(staffRecord[i].Schedule, "YYYY/MM/DD");
        //     if (todaysDate_.isAfter(dutyDate)) continue;
        //     else duties.push(staffRecord[i]);
        //   }
        //   setStaffDetials(duties);
        // } else
        console.log("myDuties:", staffRecord);
        setStaffDetials(staffRecord);
      } catch (ex) {}
      // ...
    }
    fetchData();
  }, []);

  const serviceCompleted = async (id) => {
    try {
      await axios.patch(
        config.apiEndPoint + `/userRequests?serviceCompleted=true&id=${id}`,
        { completeStatus: true }
      );
      const { data: staffRecord } = await axios.get(
        config.apiEndPoint +
          `/userRequests?staffMemberId=${user.staffMember._id}&showMyDuties=true`
      );
      setStaffDetials(staffRecord);
      swal(
        "Service Completed Successfully!",
        "You have completed Your Service!",
        "success"
      );
    } catch {}
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = staffDetails.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  function reverseString(str) {
    // Step 1. Use the split() method to return a new array
    var splitString = str.split("-"); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]

    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]

    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join("/"); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"

    //Step 4. Return the reversed string
    return joinArray; // "olleh"
  }

  const serviceStatus = (row) => {
    if (row.completed) {
      return (
        <span className="badge badge-secondary completed-badge-myduties">
          Completed
        </span>
      );
    } else if (row.canceled) {
      return <span style={{ color: "red" }}>Canceled</span>;
    } else {
      return (
        <button
          className="btn btn-primary"
          type="submit"
          onClick={() => {
            serviceCompleted(row._id);
          }}
        >
          COMPLETE
        </button>
      );
    }
  };

  return staffDetails.length > 0 ? (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            {/* <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={myleaves.length}
          /> */}
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Patient Phone No</TableCell>
                <TableCell>Patient Address</TableCell>

                <TableCell>Date</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Slot</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <thead></thead>
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
               rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(staffDetails, getComparator(order, orderBy)).map(
                (row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      //   onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      //   selected={isItemSelected}
                    >
                      {/* <td className="td-schedule">
                <small>{staff.fullName}</small>
              </td>
              <td className="td-schedule">
                <small>0{staff.PhoneNo}</small>
              </td>
              <td className="td-schedule">
                <small>{staff.Address}</small>
              </td>
              <td className="td-schedule">
                <small>
                  {staff.Schedule[8]}
                  {staff.Schedule[9]}
                  {staff.Schedule[7]}
                  {staff.Schedule[5]}
                  {staff.Schedule[6]}
                  {staff.Schedule[4]}
                  {staff.Schedule[0]}
                  {staff.Schedule[1]}
                  {staff.Schedule[2]}
                  {staff.Schedule[3]}
                </small>
              </td> */}
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.PhoneNo}</TableCell>
                      <TableCell>{row.Address}</TableCell>
                      <TableCell>{reverseString(row.Schedule)}</TableCell>
                      <TableCell>{row.Service.servicePrice}</TableCell>
                      <TableCell>{row.ServiceNeededTime}</TableCell>
                      <TableCell>
                        {serviceStatus(row)}
                        {/* {row.completed ? (
                          <span className="badge badge-secondary completed-badge-myduties">
                            Completed
                          </span>
                        ) : (
                          <button
                            className="btn btn-primary"
                            type="submit"
                            onClick={() => {
                              serviceCompleted(row._id);
                            }}
                          >
                            COMPLETE
                          </button>
                        )} */}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={staffDetails.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
      {/* <FormControlLabel
      control={<Switch checked={dense} onChange={handleChangeDense} />}
      label="Dense padding"
    /> */}
    </Box>
  ) : (
    <h5
      style={{
        marginLeft: "3rem",
        marginTop: "1rem",
        color: "#333",
        maxWidth: "75ch",
        color: "",
      }}
    >
      <span
        style={{ color: "#396EB0", fontWeight: "bold", letterSpacing: "0.2px" }}
      >
        You haven't been assigned a duty lately
      </span>
      {/* <div className="info" style={{ marginTop: "0.8rem" }}>
        <p>
          <strong>Independent </strong>
          If you're working Independently (no organization association) then
          either your request for working hasn't been approved or you aren't
          assigned a duty yet
        </p>
      </div>
      <div className="info">
        <p>
          <strong>Association </strong>
          If you're assoicated with an organization then you aren't assigned a
          duty yet
        </p>
      </div> */}
    </h5>
  );
};

export default Schedule;
