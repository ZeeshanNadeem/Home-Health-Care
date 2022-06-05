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
import moment from "moment";
// store.subscribe(()=>console.log(store.getState()))

//Getting next day form a specific day.(Next Monday,Tue)
//FullDate1.setDate(IntialMeeting.getDate() + (((Cal + 7 - IntialMeeting.getDay()) % 7) || 7));

//Getting Next week
// var firstDay = new Date("2022/06/07");
// var nextWeek = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);

//Practice
// var firstDay = new Date("2022/06/07");
// var nextWeek = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);

var a = moment('2022-05-08'); 
var b = a.clone().add(1, 'week').day("mon");
console.log("week Add:",b.format())

ReactDOM.render(
  <BrowserRouter>
  <Provider store={store}>
    <App/>
    
    </Provider>
  </BrowserRouter>,

  document.getElementById("root")
);
