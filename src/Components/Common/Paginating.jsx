import Pagination from "@mui/material/Pagination";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
const useStyles = makeStyles({
  root: {},
});
const Paginating = ({ count }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  return (
    <div className="pagination">
      <Pagination
        className={classes.root}
        count={count}
        // variant="outlined"
        color="secondary"
        defaultPage={page}
        size="large"
        showFirstButton
        showLastButton
        onChange={(event, value) => setPage(value)}
      />
    </div>
  );
};

export default Paginating;
