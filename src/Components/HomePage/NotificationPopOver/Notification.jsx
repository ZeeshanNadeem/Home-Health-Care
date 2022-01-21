import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import axios from "axios";
import config from "../../Api/config.json";
import moment from "moment";

export default function BasicPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  let [userVacPlan, setuserVacPlan] = React.useState(null);
  let [NotificationMsg, setNotificationMsg] = React.useState({});

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const jwt = localStorage.getItem("token");
  const user = jwtDecode(jwt);

  const getData = async () => {
    const { data } = await axios.get(
      config.apiEndPoint + `/userRequests?vacPlan=true&userID=${user._id}`
    );
    userVacPlan = data.filter((x) => x.VaccinationPlan === true);
    let smallestDate = 0;
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getUTCFullYear();
    let TodayDate = year + "-" + month + "-" + day;

    let tempDate = "";
    for (let i = 0; i < userVacPlan.length - 1; i++) {
      if (TodayDate === userVacPlan[i].Schedule) continue;
      let tempArr1 = userVacPlan[i].Schedule.split("-");
      let temp1 = tempArr1[0] + "/" + tempArr1[1] + "/" + tempArr1[2];
      let tempArr2 = userVacPlan[i + 1].Schedule.split("-");
      let temp2 = tempArr2[0] + "/" + tempArr2[1] + "/" + tempArr2[2];

      const FristIndex = moment(temp1, "YYYY/MM/DD");
      const SecondIndex = moment(temp2, "YYYY/MM/DD");

      if (tempDate) {
        let tempDate_ = moment(tempDate, "YYYY/MM/DD");
        if (tempDate_.isAfter(SecondIndex)) {
          smallestDate = i + 1;
          tempDate = SecondIndex;
        }
        continue;
      }
      if (FristIndex.isAfter(SecondIndex)) {
        smallestDate = i + 1;
        tempDate = SecondIndex;
      } else if (SecondIndex.isAfter(FristIndex)) {
        smallestDate = i;
        tempDate = FristIndex;
      }
    }

    let TodayCompareDate = year + "/" + month + "/" + day;
    let arrSplitDate = userVacPlan[smallestDate].Schedule.split("-");
    let smallestDate =
      arrSplitDate[0] + "/" + arrSplitDate[1] + "/" + arrSplitDate[2];
    const date1 = new Date(TodayCompareDate);
    const date2 = new Date(smallestDate);
    console.log(getDifferenceInDays(date1, date2));
    if (getDifferenceInDays(date1, date2) === 2) {
      setNotificationMsg(userVacPlan[smallestDate]);
    }
  };
  getData();

  return (
    <div>
      <div>
        <div></div>
        <span className="notification" onClick={handleClick}>
          {
            <span
              style={{
                color: "#fff",
                backgroundColor: "#dc3545",
                position: "absolute",
                marginLeft: "0.6rem",
                marginTop: "-1rem",
                borderRadius: "15px",
              }}
              className="badge badge-info"
            >
              1
            </span>
          }
          <FontAwesomeIcon icon={faBell} />
        </span>
      </div>
      {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button> */}
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
        <Typography
          sx={{
            p: 2,
            paddingLeft: "1rem",
            paddingRight: "1rem",
            maxWidth: "35ch",
            marginBottom: "0",
          }}
        >
          <Avatar
            alt={user.fullname}
            src="."
            className="avatar"
            style={{ float: "left", marginRight: "5px" }}
          />
          {NotificationMsg ? (
            <span>
              Your Next Vaccination Date is on {NotificationMsg.Schedule} {""}
              at {""}
              {NotificationMsg.ServiceNeededTime}
            </span>
          ) : (
            "No Notification"
          )}
        </Typography>
        <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100"></div>
      </Popover>
    </div>
  );
}
