import React from "react";
import ReactDOM from "react-dom";
import "./Components/Styles/style.css";
import "./Components/Styles/index.css";
import App from "./App";
import "./tailwind.css";
import "./Components/Styles/style1.css";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../src/Components/Styles/footer.css";
import "../src/Components/Styles/appAdmin.css";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,

  document.getElementById("root")
);
