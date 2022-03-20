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
import { Provider } from "react-redux";
import store from "./store";


// store.subscribe(()=>console.log(store.getState()))


ReactDOM.render(
  <BrowserRouter>
  <Provider store={store}>
    <App />
    </Provider>
  </BrowserRouter>,

  document.getElementById("root")
);
