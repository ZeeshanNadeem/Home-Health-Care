import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import axios from "axios";
import config from "../../Api/config.json";
import moment from "moment";

export default function BasicPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  let [userVacPlan, setuserVacPlan] = React.useState(null);
  let [NotificationMsg, setNotificationMsg] = React.useState({});

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    if (NotificationMsg.NotificationViewed === false) {
      try {
        const { data } = await axios.patch(
          config.apiEndPoint +
            `/userRequests?notification=true&userReqID=${NotificationMsg._id}`
        );
        setNotificationMsg(data);
      } catch (ex) {
        console.log("Ex::", ex);
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    getNotification();
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const jwt = localStorage.getItem("token");

  let user = "";
  if (jwt) {
    user = jwtDecode(jwt);
  }

  const checkTime = () => {};
  const getNotification = async () => {
    const { data } = await axios.get(config.apiEndPoint + `/userRequests`);
    userVacPlan = data.filter((x) => x.VaccinationPlan === true);
    let smallestDate = 0;
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let year = date.getUTCFullYear();
    let TodayDate = year + "-" + month + "-" + day;
    let momentTodaysDate = year + "/" + month + "/" + day;
    let tempDate = "";

    if (userVacPlan.length === 0) return;
    for (let i = 0; i < userVacPlan.length - 1; i++) {
      let tempArr1 = userVacPlan[i].Schedule.split("-");
      let temp1 = tempArr1[0] + "/" + tempArr1[1] + "/" + tempArr1[2];
      let tempArr2 = userVacPlan[i + 1].Schedule.split("-");
      let temp2 = tempArr2[0] + "/" + tempArr2[1] + "/" + tempArr2[2];

      const FristIndex = moment(temp1, "YYYY/MM/DD");
      const SecondIndex = moment(temp2, "YYYY/MM/DD");
      const todaysDate = moment(momentTodaysDate, "YYYY/MM/DD");
      let tempDate_ = moment(tempDate, "YYYY/MM/DD");

      //If vacination date is today and time has gone
      //past then we skip that iteration
      if (todaysDate.isSame(FristIndex)) {
        //Temp smallest date
        let time = userVacPlan[i].ServiceNeededTime.split("to");

        time[0] = time[0].trim();
        time[1] = time[1].trim();

        let timeFromConverted = "";
        let timeToConverted = "";

        if (time[0].includes("PM")) {
          let temp = time[0].split("PM");
          if (temp[0] !== "12") temp[0] = parseInt(temp[0]) + 12;
          timeFromConverted = temp[0];
        } else {
          let temp = time[0].split("AM");

          if (temp[0] !== "12") temp[0] = "00";
          timeFromConverted = temp[0];
        }

        if (time[1].includes("PM")) {
          let temp = time[1].split("PM");
          if (temp[0] !== "12") temp[0] = parseInt(temp[0]) + 12;
          timeToConverted = temp[0];
        } else {
          let temp = time[1].split("AM");

          if (temp[0] !== "12") temp[0] = "00";
          timeToConverted = temp[0];
        }

        timeFromConverted += ":00";
        timeToConverted += ":00";

        let currentHour = date.getHours();
        let currentMinutes = date.getMinutes();
        if (currentHour < 10) currentHour = "0" + currentHour;
        if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
        const currentTime = currentHour + ":" + currentMinutes;
        let format = "hh:mm";

        // const timeServiceFrom = moment(timeFromConverted, format);
        const timeServiceTo = moment(timeToConverted, format);
        const currentTime_ = moment(currentTime, format);

        if (currentTime_.isAfter(timeServiceTo)) continue;
      }

      if (
        tempDate &&
        !tempDate_.isSame(FristIndex) &&
        !SecondIndex.isSame(FristIndex)
      ) {
        if (tempDate_.isAfter(FristIndex)) {
          smallestDate = i;

          tempDate = FristIndex;
        }
      } else if (tempDate_.isSame(FristIndex)) {
        //Temp smallest date
        let time = userVacPlan[smallestDate].ServiceNeededTime.split("to");

        time[0] = time[0].trim();
        time[1] = time[1].trim();

        let timeFromConverted = "";
        let timeToConverted = "";

        if (time[0].includes("PM")) {
          let temp = time[0].split("PM");
          if (temp[0] !== "12") temp[0] = parseInt(temp[0]) + 12;
          timeFromConverted = temp[0];
        } else {
          let temp = time[0].split("AM");

          if (temp[0] !== "12") temp[0] = "00";
          timeFromConverted = temp[0];
        }

        if (time[1].includes("PM")) {
          let temp = time[1].split("PM");
          if (temp[0] !== "12") temp[0] = parseInt(temp[0]) + 12;
          timeToConverted = temp[0];
        } else {
          let temp = time[1].split("AM");

          if (temp[0] !== "12") temp[0] = "00";
          timeToConverted = temp[0];
        }

        timeFromConverted += ":00";
        timeToConverted += ":00";

        let currentHour = date.getHours();
        let currentMinutes = date.getMinutes();
        if (currentHour < 10) currentHour = "0" + currentHour;
        if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
        const currentTime = currentHour + ":" + currentMinutes;
        let format1 = "hh:mm";

        const currentSmallestTimeFromChk = moment(timeFromConverted, format1);
        const currentSmallestTimeToChk = moment(timeToConverted, format1);
        const currentTime_ = moment(currentTime, format1);

        //Second Index
        let timeFromConverted1 = "";
        let timeToConverted1 = "";
        let time1 = userVacPlan[i].ServiceNeededTime.split("to");

        time1[0] = time1[0].trim();
        time1[1] = time1[1].trim();

        if (time1[0].includes("PM")) {
          let temp1 = time1[0].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          timeFromConverted1 = temp1[0];
        } else {
          let temp1 = time1[0].split("AM");

          if (temp1[0] !== "12") temp1[0] = "00";
          timeFromConverted1 = temp1[0];
        }

        if (time1[1].includes("PM")) {
          let temp1 = time1[1].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          timeToConverted1 = temp1[0];
        } else {
          let temp1 = time1[1].split("AM");

          if (temp1[0] !== "12") temp1[0] = "00";
          timeToConverted1 = temp1[0];
        }

        timeFromConverted1 += ":00";
        timeToConverted1 += ":00";

        let format = "hh:mm";
        const currentSmallestTimeFrom = moment(timeFromConverted, format);
        const currentSmallestTimeTo = moment(timeToConverted, format);
        const secondIndexFrom = moment(timeFromConverted1, format);
        const secondIndexTo = moment(timeToConverted1, format);
        if (
          secondIndexFrom.isBefore(currentSmallestTimeFrom) &&
          secondIndexTo.isBefore(currentSmallestTimeTo)
        ) {
          smallestDate = i + 1;

          tempDate = SecondIndex;
        }
      } else if (SecondIndex.isSame(FristIndex) && !tempDate_) {
        //Temp smallest date
        let time = userVacPlan[i].ServiceNeededTime.split("to");

        time[0] = time[0].trim();
        time[1] = time[1].trim();

        let timeFromConverted = "";
        let timeToConverted = "";

        if (time[0].includes("PM")) {
          let temp = time[0].split("PM");
          if (temp[0] !== "12") temp[0] = parseInt(temp[0]) + 12;
          timeFromConverted = temp[0];
        } else {
          let temp = time[0].split("AM");

          if (temp[0] !== "12") temp[0] = "00";
          timeFromConverted = temp[0];
        }

        if (time[1].includes("PM")) {
          let temp = time[1].split("PM");
          if (temp[0] !== "12") temp[0] = parseInt(temp[0]) + 12;
          timeFromConverted = temp[0];
        } else {
          let temp = time[1].split("AM");

          if (temp[0] !== "12") temp[0] = "00";
          timeToConverted = temp[0];
        }

        timeFromConverted += ":00";
        timeToConverted += ":00";

        const currentHour = date.getHours();
        const currentMinutes = date.getMinutes();
        if (currentHour < 10) currentHour = "0" + currentHour;
        if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
        const currentTime = currentHour + ":" + currentMinutes;
        let format1 = "hh:mm";

        const currentSmallestTimeFromChk = moment(timeFromConverted, format1);
        const currentSmallestTimeToChk = moment(timeToConverted, format1);
        const currentTime_ = moment(currentTime, format1);

        if (currentTime_.isAfter(currentSmallestTimeToChk)) continue;

        //Second Index
        let timeFromConverted1 = "";
        let timeToConverted1 = "";
        let time1 = userVacPlan[i + 1].Schedule.split("to");

        time1[0] = time1[0].trim();
        time1[1] = time1[1].trim();

        if (time1[0].includes("PM")) {
          let temp1 = time1[0].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          timeFromConverted = temp1[0];
        } else {
          let temp1 = time1[0].split("AM");

          if (temp1[0] !== "12") temp1[0] = "00";
          timeFromConverted = temp1[0];
        }

        if (time1[0].includes("PM")) {
          let temp1 = time1[1].split("PM");
          if (temp1[0] !== "12") temp1[0] = parseInt(temp1[0]) + 12;
          timeFromConverted = temp1[0];
        } else {
          let temp1 = time1[1].split("AM");

          if (temp1[0] !== "12") temp1[0] = "00";
          timeToConverted = temp1[0];
        }

        timeFromConverted1 += ":00";
        timeToConverted1 += ":00";

        let format = "hh:mm";
        const currentSmallestTimeFrom = moment(timeFromConverted, format);
        const currentSmallestTimeTo = moment(timeToConverted, format);
        const secondIndexFrom = moment(timeFromConverted1, format);
        const secondIndexTo = moment(timeToConverted1, format);
        if (
          secondIndexFrom.isBefore(currentSmallestTimeFrom) &&
          secondIndexTo.isBefore(currentSmallestTimeTo)
        ) {
          smallestDate = i + 1;

          tempDate = SecondIndex;
        } else {
          smallestDate = i;

          tempDate = FristIndex;
        }
      } else if (FristIndex.isAfter(SecondIndex)) {
        smallestDate = i + 1;

        tempDate = SecondIndex;
      } else if (SecondIndex.isAfter(FristIndex)) {
        smallestDate = i;

        tempDate = FristIndex;
      }
    }

    let TodayCompareDate = year + "/" + month + "/" + day;
    let arrSplitDate = userVacPlan[smallestDate].Schedule.split("-");
    let smallestDate_ =
      arrSplitDate[0] + "/" + arrSplitDate[1] + "/" + arrSplitDate[2];

    const startDate = moment(TodayCompareDate, "YYYY/MM/DD");
    const endDate = moment(smallestDate_, "YYYY/MM/DD");

    if (startDate.isSame(endDate)) {
      setNotificationMsg(userVacPlan[smallestDate]);
    }
  };

  return (
    <div>
      <div>
        <div></div>
        <span className="notification" onClick={handleClick}>
          {NotificationMsg.ServiceNeededTime &&
          NotificationMsg.NotificationViewed === false ? (
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
          ) : (
            ""
          )}
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
          {NotificationMsg.ServiceNeededTime ? (
            <span>
              <Avatar
                alt={user.fullname}
                src="."
                className="avatar"
                style={{ float: "left", marginRight: "5px" }}
              />
              <span>
                Your Vaccination Date is today {NotificationMsg.Schedule} {""}
                at {""}
                {NotificationMsg.ServiceNeededTime}
              </span>
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
