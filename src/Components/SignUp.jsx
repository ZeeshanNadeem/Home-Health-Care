import * as React from "react";
import TextField from "@mui/material/TextField";
import { Container, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";

// import LocalizationProvider from "@mui/lab/LocalizationProvider";

// import DateAdapter from "@mui/lab/AdapterDateFns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
// import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Card } from "@mui/material";
import styles from "./Classes";

export default function SignUp() {
  const [value, setValue] = React.useState(new Date());
  const classes = styles;
  console.log("Classes", classes);
  return (
    <div className="signUp-container">
      <Card
        className="card"
        sx={{
          minWidth: "100px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          padding: "50px",
        }}
      >
        <h1 class="signup-title">Sign Up</h1>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              className="txt"
              id="outlined-basic"
              label="Frist Name"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="Date Of Birth"
                format="MM/dd/yyyy"
                // value={selectedDate}
                InputAdornmentProps={{ position: "start" }}
                // onChange={(date) => handleDateChange(date)}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField id="outlined-basic" label="Email" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="outlined-basic"
              label="Confirm Password"
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Button variant="contained" size="large" className={classes.btn}>
          Sign Up
        </Button>
      </Card>
    </div>
  );
}
