import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import axios from "axios";
import config from "../../Api/config.json";
import { data } from "jquery";

export default function MouseOverPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [meetings, setMeetings] = React.useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  React.useEffect(async () => {
    const { data } = await axios.get(config.apiEndPoint + "/confirmService");
    delete data[0];

    setMeetings(data);
  
  }, []);

  return (
    <span>
      <small
        style={{
          color: "#1572A1",
          border: "1px solid #1572A1",
          padding: "0.2rem 0.5rem",
          borderRadius: "20px",
          cursor: "pointer",
        }}
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        className="further-meetings"
      >
        Further-Meetings
      </small>
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
        {meetings.length === 1 ? (
          <span>Staff Not Available</span>
        ) : (
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Dates</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((data) => (
                <tr key={data._id}>
                  <td
                    style={{
                      border: "1px solid #333",
                      padding: "0.3rem 0.3rem",
                      margin: "0 0.5rem",
                    }}
                  >
                    {data.Schedule[8]}
                    {data.Schedule[9]}
                    {data.Schedule[7]}
                    {data.Schedule[5]}
                    {data.Schedule[6]}
                    {data.Schedule[4]}
                    {data.Schedule[0]}
                    {data.Schedule[1]}
                    {data.Schedule[2]}
                    {data.Schedule[3]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Popover>
    </span>
  );
}
