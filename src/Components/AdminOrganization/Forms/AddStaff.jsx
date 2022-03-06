import React from "react";
import axios from "axios";
import Form from "../../Common/Form";
import Joi from "joi-browser";
import Alert from "@material-ui/lab/Alert";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import config from "../../Api/config.json";

class NurseForm extends Form {
  state = {
    doctorForm: {
      fullName: "",
      // dateOfBirth: "",
      email: "",
      password: "",
      serviceID: "",
      qualification: "",
      // availabilityFrom: "",
      // availabilityTo: "",
      // availabileDayFrom: "",
      // availabileDayTo: "",

      // email: "",
      phone: "",
    },
    qualification: [],
    user: "",
    days: [
      {
        name: "Monday",
        _id: 1,
      },
      {
        name: "Tuesday",
        _id: 2,
      },
      {
        name: "Wednesday",
        _id: 3,
      },
      {
        name: "Thrusday",
        _id: 4,
      },
      {
        name: "Friday",
        _id: 5,
      },
      {
        name: "Saturday",
        _id: 6,
      },
      {
        name: "Sunday",
        _id: 7,
      },
    ],
    timeArr: [
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "00:00",
    ],
    isEditModel: "",
    services: [],
    daysAvailable: [
      {
        name: "MON",
        value: false,
      },
      {
        name: "TUE",
        value: false,
      },
      {
        name: "WED",
        value: false,
      },
      {
        name: "THRU",
        value: false,
      },
      { name: "FRI", value: false },
      { name: "SAT", value: false },
      { name: "SUN", value: false },
    ],
    slotTime: [
      {
        time: "12AM to 3AM",
        name: "12 AM to 3 AM",
        value: false,
      },
      {
        time: "3AM to 6AM",
        name: "3 AM to 6 AM",
        value: false,
      },

      {
        time: "6AM to 9AM",
        value: false,
        name: "6 AM to 9 AM",
      },
      {
        time: "9AM to 12PM",
        value: false,
        name: "9 AM to 12 PM",
      },
      {
        time: "12PM to 3PM",
        value: false,
        name: "12 PM to 3 PM",
      },
      {
        time: "3PM to 6PM",
        value: false,
        name: "3 PM to 6 PM",
      },
      {
        time: "6PM to 9PM",
        value: false,
        name: "6 PM to 9 PM",
      },
      {
        time: "9PM to 12AM",
        value: false,
        name: "9 PM to 12 AM",
      },
    ],
    lat: "",
    lng: "",
  };

  schema = {
    fullName: Joi.string().min(5).max(50).required().label("FullName"),
    // dateOfBirth: Joi.string().required().label("Date of Birth"),
    email: this.state.isEditModel
      ? Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .min(5)
          .max(255)
          .required()
      : Joi.string()
          .min(5)
          .max(255)
          .required()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .label("Email"),
    password: this.state.isEditModel
      ? Joi.string()
      : Joi.string().min(5).max(255).required().label("Password"),
    serviceID: Joi.string().required().label("Staff Type"),
    qualification: Joi.string().required().label("Qualification"),
    // availabilityFrom: Joi.string().required().label("Availability From"),
    // availabilityTo: Joi.string().required().label("Availability To"),
    // availabileDayFrom: Joi.string().required().label("Available Day"),
    // availabileDayTo: Joi.string().required().label("Available Day"),
    // email: Joi.string().required().label("Email"),
    phone: Joi.number().required().label("Phone No"),
  };

  //Editing Data
  updateStaffMember = async () => {
    const { staffMemberData, RefreshStaffMembers } = this.props;
    const { doctorForm } = this.state;
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);

    const { data: userObj } = await axios.get(
      `http://localhost:3000/api/user/${staffMemberData._id}`
    );

    const updateStaff = {
      fullName: doctorForm.fullName,

      // dateOfBirth: doctorForm.dateOfBirth,
      email: userObj.email,
      password: userObj.password,
      serviceID: doctorForm.serviceID,
      Organization: user.Organization,
      qualificationID: doctorForm.qualification,
      availableTime: this.state.slotTime,
      availableDays: this.state.daysAvailable,
      Rating: userObj.staffMember.Rating,
      RatingAvgCount: userObj.staffMember.RatingAvgCount,
      // email: doctorForm.email,
      phone: doctorForm.phone,
    };

    const updateUser = {
      fullName: doctorForm.fullName,
      staffID: staffMemberData._id,
      // serviceID: doctorForm.serviceID,
      // Organization: user.Organization,
      // qualificationID: doctorForm.qualification,
      // availabilityFrom: doctorForm.availabilityFrom,
      // availabilityTo: doctorForm.availabilityTo,
      // availabileDayFrom: doctorForm.availabileDayFrom,
      // availabileDayTo: doctorForm.availabileDayTo,
      // phone: doctorForm.phone,
    };
    try {
      await axios.put(
        "http://localhost:3000/api/staff/" + staffMemberData._id,
        updateStaff
      );

      RefreshStaffMembers();
      RefreshStaffMembers();
      const { data: userObjInTable } = await axios.get(
        config.apiEndPoint + `/user/${staffMemberData._id}`
      );

      await axios.put(
        config.apiEndPoint + `/user/${userObjInTable._id}?findUser=abc`,
        updateUser
      );
      toast.success("Staff Member Updated");
    } catch (ex) {
      toast.error(ex.response.data);
    }
  };

  addAStaffMember = async () => {
    const { doctorForm } = this.state;
    const { RefreshStaffMembers } = this.props;
    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);

    const addStaffMember = {
      fullName: doctorForm.fullName,
      // dateOfBirth: doctorForm.dateOfBirth,
      email: doctorForm.email,
      password: doctorForm.password,
      serviceID: doctorForm.serviceID,
      Organization: user.Organization,
      qualificationID: doctorForm.qualification,
      phone: doctorForm.phone,
      city: user.city,
      availableTime: this.state.slotTime,
      availableDays: this.state.daysAvailable,
      // availabilityFrom: doctorForm.availabilityFrom,
      // availabilityTo: doctorForm.availabilityTo,
      // availabileDayFrom: doctorForm.availabileDayFrom,
      // availabileDayTo: doctorForm.availabileDayTo,
      Rating: 0,
      RatingAvgCount: 0,
      lat: user.lat,
      lng: user.lng,

      // email: doctorForm.email,
    };
    //  const user = {
    //    staffTypeID: doctorForm.staffType,
    //    qualificationID: doctorForm.qualification,
    //    phone: doctorForm.phone,
    //    availabilityFrom: doctorForm.availabilityFrom,
    //    availabilityTo: doctorForm.availabilityTo,
    //    availabileDayFrom: doctorForm.availabileDayFrom,
    //    availabileDayTo: doctorForm.availabileDayTo,
    //  };
    try {
      const userObj = {};
      userObj.fullName = addStaffMember.fullName;
      userObj.email = addStaffMember.email;
      userObj.password = addStaffMember.password;
      //  userObj.staffMemberID = staffAdded._id;

      const { data: user } = await axios.post(
        config.apiEndPoint + "/user",
        userObj
      );

      const { data: staffAdded } = await axios.post(
        "http://localhost:3000/api/staff?dontCheck=true",
        addStaffMember
      );

      await axios.patch(config.apiEndPoint + "/user?EditUser=true", {
        staffMemberID: user._id,
        staffMemberObj: staffAdded,
      });

      RefreshStaffMembers();
    } catch (ex) {
      const error = { ...this.state.errors };
      error.email = ex.response.data;
      this.setState({ errors: error });
      return;
    }
    toast.success("Staff member Added!");
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    // if (!isEditModel) {
    errors = this.validate();
    this.setState({ errors: errors || {} });
    // }

    const { staffMemberData } = this.props;
    if (staffMemberData) {
      this.updateStaffMember();
      return;
    }

    if (!errors) {
      this.addAStaffMember();
      return;
    }
  };

  getUniqueArray = (array) => {
    let unique = [];

    for (let i = 0; i < array.length; i++) {
      let GotDuplicated = false;
      for (let j = 0; j < unique.length; j++) {
        if (unique[j].serviceName === array[i].serviceName) {
          GotDuplicated = true;
          break;
        }
      }
      if (!GotDuplicated) unique.push(array[i]);
    }
    return unique;
  };

  async componentDidMount() {
    const { isEditModel } = this.props;
    this.setState({ isEditModel });
    const { data: qualification } = await axios.get(
      "http://localhost:3000/api/qualification"
    );

    const jwt = localStorage.getItem("token");
    const user = jwtDecode(jwt);
    console.log("admin signed:", user);
    let { data: services } = await axios.get(
      `http://localhost:3000/api/services?organization=${user.Organization._id}`
    );

    // let { data: services } = await axios.get(
    //   "http://localhost:3000/api/services"
    // );

    // let  uniqueServices= this.getUniqueArray(services.results);
    const { staffMemberData } = this.props;

    const doctorForm = { ...this.state.doctorForm };

    //Pre-Populating Staff Form on Edit Staff

    if (staffMemberData) {
      doctorForm.fullName = staffMemberData.fullName;
      // doctorForm.dateOfBirth = staffMemberData.dateOfBirth;

      doctorForm.serviceID = staffMemberData.staffSpeciality._id;
      doctorForm.qualification = staffMemberData.qualification._id;

      // doctorForm.availabilityFrom = staffMemberData.availabilityFrom;
      // doctorForm.availabilityTo = staffMemberData.availabilityTo;
      // doctorForm.availabileDayFrom = staffMemberData.availabileDayFrom;
      // doctorForm.availabileDayTo = staffMemberData.availabileDayTo;
      doctorForm.phone = staffMemberData.phone;
      // doctorForm.email = staffMemberData.email;

      this.setState({
        doctorForm,
        slotTime: staffMemberData.availableTime,
        daysAvailable: staffMemberData.availableDays,
      });
    }
    this.setState({ qualification, services: services.results });
  }
  render() {
    const { qualification, successMessage, services } = this.state;
    const { isEditModel } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className="doc-form-wrapper">
        {/* <ToastContainer /> */}

        <div className="doc-container">
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <div className="card-signup doc-form add-staff-form">
            <header>
              <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
                Add A Staff Member
              </h1>
            </header>

            <article className="addStaff-Fields-grouping add-staff-input-styling">
              <article className="one-group-first-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("FULL NAME", "fname")}
                </article>
                <article className="addStaff-input">
                  {this.renderInput("text", "fname", "fullName", "Full Name")}
                </article>
              </article>
              <article className="one-group-second-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Qualification", "qualification")}
                </article>
                <article className="input-addStaff">
                  {this.renderDropDown(
                    "Qualification",
                    qualification,
                    "docQualification",
                    "qualification",
                    "Please Select Qualification"
                  )}
                </article>
              </article>
              {/* <article className="one-group-second-item addStaff-group-alignment">
                <article>{this.renderLabel("Date of Birth", "dob")}</article>
                <article className="add-staff-dob">
                  {this.renderInput(
                    "date",
                    "dob",
                    "dateOfBirth",
                    "Date of Birth"
                  )}
                </article>
              </article> */}
            </article>

            {!isEditModel && (
              <article className="addStaff-Fields-grouping add-staff-input-styling">
                <article className="one-group-first-item addStaff-group-alignment">
                  <article className="label-addStaff">
                    {this.renderLabel("Email", "Email")}
                  </article>
                  <article className="addStaff-input">
                    {this.renderInput("text", "email", "email", "email")}
                  </article>
                </article>

                <article className="one-group-second-item addStaff-group-alignment">
                  <article className="label-addStaff">
                    {this.renderLabel("Password", "Password")}
                  </article>
                  <article className="input-addStaff">
                    {this.renderInput(
                      "password",
                      "password",
                      "password",
                      "password"
                    )}
                  </article>
                </article>
              </article>
            )}

            <article className="addStaff-Fields-grouping">
              <article className="one-group-first-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Speciality", "serviceID")}
                </article>
                <article className="input-addStaff">
                  {this.renderDropDown(
                    "Staff",
                    services,
                    "serviceID",
                    "serviceID",
                    "Please Select Speciality"
                  )}
                </article>
              </article>
              <article className="one-group-second-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Phone No", "phoneno")}
                </article>
                <article className="input-addStaff">
                  {this.renderInput(
                    "tel",
                    "phoneno",
                    "phone",
                    "Example 03448123901"
                  )}
                </article>
              </article>
            </article>

            <article className="time-slots">
              <article className="one-group-first-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("Available Slots", "availabilityFrom")}
                </article>
                <article className="time-slots">
                  {this.state.slotTime.map((day) =>
                    day.name === "12 PM to 3 PM" ||
                    day.name === "3 PM to 6 PM" ||
                    day.name === "6 PM to 9 PM" ||
                    day.name === "9 PM to 12 AM" ? (
                      <article key={day.name}></article>
                    ) : (
                      <article key={day.name}>
                        <article className="time-slots-Chk-Box">
                          {this.renderCheckBoxForSlots(
                            day.name,
                            day.name,
                            day.value,
                            day.name
                          )}
                        </article>
                      </article>
                    )
                  )}
                </article>
              </article>
            </article>

            <article className="time-slots">
              <article className="one-group-first-item addStaff-group-alignment">
                <article className="time-slots">
                  {this.state.slotTime.map((day) =>
                    day.name === "12 AM to 3 AM" ||
                    day.name === "3 AM to 6 AM" ||
                    day.name === "6 AM to 9 AM" ||
                    day.name === "9 AM to 12 PM" ? (
                      <article key={day.name}></article>
                    ) : (
                      <article key={day.name}>
                        <article className="time-slots-Chk-Box">
                          {this.renderCheckBoxForSlots(
                            day.name,
                            day.name,
                            day.value,
                            day.name
                          )}
                        </article>
                      </article>
                    )
                  )}
                </article>
              </article>
            </article>
            <article className="time-slots">
              <article className="one-group-first-item addStaff-group-alignment">
                <article className="label-addStaff">
                  {this.renderLabel("AVAILABLE DAYS", "availabilityFrom")}
                </article>
                <article className="time-slots">
                  {this.state.daysAvailable.map((day) => (
                    <article className="time-slots-Chk-Box" key={day.name}>
                      {this.renderCheckBoxForDays(
                        day.name,
                        day.name,
                        day.value,
                        day.name
                      )}
                    </article>
                  ))}
                </article>
              </article>
            </article>

            {/* <article className="addStaff-Fields-grouping">
              <article className="addStaff-input addStaff-group-alignment one-group-first-item">
                <article className="label-addStaff">
                  {this.renderLabel(
                    "Availabile Day From",
                    "availabilityweekFrom"
                  )}
                </article>
                <article className="addStaff-special-fields">
                  {this.renderDropDown(
                    "availabileDayFrom",
                    this.state.days,
                    "availabileDayFrom",
                    "availabileDayFrom",
                    "Please Select Availability"
                  )}
                </article>
              </article>

              <article className="addStaff-input addStaff-group-alignment one-group-second-item">
                <article className="label-addStaff">
                  {this.renderLabel("Available Day To", "availabilityweekTo")}
                </article>
                <article className="addStaff-special-fields">
                  {this.renderDropDown(
                    "availabileDayTo",
                    this.state.days,
                    "availabileDayTo",
                    "availabileDayTo",
                    "Please Select Availability"
                  )}
                </article>
              </article>
            </article> */}

            {/* <article>{this.renderLabel("Email", "email")}</article>
            <article>
              {this.renderInput("text", "email", "email", "Email")}
            </article> */}

            <article className="addStaff-group-alignment addStaff-btn">
              {this.renderBtn("Save Staff Member")}
            </article>
          </div>
        </div>
      </form>
    );
  }
}

export default NurseForm;
