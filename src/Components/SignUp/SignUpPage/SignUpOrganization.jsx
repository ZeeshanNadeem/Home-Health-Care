import React from "react";
import Form from "../../Common/Form";
import NavBar from "../../HomePage/NavBar";
import signingUp from "../SigningUp/SignUp";
import Joi from "joi-browser";
import "animate.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import config from "../../Api/config.json";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";
import { Global } from "@emotion/react";
import { connect } from "react-redux";
import Maps from "../../MapsWithRadius/Maps";
import { SetLocationAction } from "../../redux/actions/Organzationlocation";
import store from "../../../store";
import { MultiSelect } from "react-multi-select-component";
import Example from "../../ReactMultiSelect/MultiServices";

import { useForm } from "antd/lib/form/Form";
class SignUpAsOrganization extends Form {
  state = {
    doctorForm: {
      fullName: "",
      // dateOfBirth: "",
      email: "",
      password: "",
      // price: "",
      // phone: "",
      isOrganizationAdmin: true,
      OrganizationID: "",
      serviceOrg_: "",
      qualification: "",
      city: "",

      // selectedFile: null,
    },
    serviceLocalityError: "",
    errors: {},
    selectedFile: null,
    organizations: [],
    IndependentServices: [],
    qualification: [],
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
    fileUpload: true,
    city: ["Islamabad", "Rawalpindi", "Karachi", "Lahore", "Multan", "Hyderabad", "Quetta", "Faisalabad",
      "Sialkot", "Dera Ghazi Khan"
    ],
    lat: "",
    lng: "",
    isIndependentPerson: false,
    servicesSelected: []
  };

  schema = {
    fullName: Joi.string().required(),
    // dateOfBirth: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(255).required(),
    isOrganizationAdmin: Joi.boolean().required(),
    OrganizationID: Joi.string().required(),



    // price: Joi.string().required(),

    // phone: Joi.string().required(),
    //61d5bc5c69b35ef18754dc9a
    // serviceOrg_:
    //   this.state.doctorForm.OrganizationID === "61d5bc5c69b35ef18754dc9a"
    //     ? Joi.string().required().label("Service")
    //     : Joi.string().optional().label("Service"),
    qualification:
      this.state.doctorForm.OrganizationID === "61d5bc5c69b35ef18754dc9a"
        ? Joi.string().required().label("Qualification")
        : Joi.string().optional().label("Qualification"),
  };

  options = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry" }
  ];

  constructor(props) {
    super(props);
    localStorage.removeItem("markers");

  }
  async componentDidMount() {

    const jwt = localStorage.getItem("token");
    if (jwt) {
      const user = jwtDecode(jwt);
      const { data: currentUser } = await axios.get(
        config.apiEndPoint + `/user?findUser_=${user._id}`
      );
      if (currentUser.ResumePath && !currentUser.staffMember) {
        try {
          await axios.delete(config.apiEndPoint + `/user/${user._id}`);
          localStorage.removeItem("token");
          window.location = "/SignUp/Organization";
        } catch (ex) { }
      }
    }

    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.setState({ lat: position.coords.latitude });
    //   this.setState({ lng: position.coords.longitude });
    // });
    // const d = distance(lat, saddarLat, lng, saddatlng);
    // const t = parseInt(d);
    // setDistance(t);
    const { data } = await axios.get(config.apiEndPoint + "/organizations");
    const { data: qualification } = await axios.get(
      config.apiEndPoint + "/qualification"
    );
    const { data: services } = await axios.get(
      config.apiEndPoint + "/independentServices"
    );
    let multiSevices = [];
    for (let s of services.results) {
      multiSevices.push({ label: s.serviceName, value: s.serviceName });
    }

    this.setState({ multiSevices })


    this.setState({
      organizations: data.results,
      qualification,
      IndependentServices: services.results,
    });
  }



  onChange = (e) => {
    // setFile(e.target.files[0]);
    this.setState({ selectedFile: e.target.files[0], fileUpload: true });
    // setFilename(e.target.files[0].name);
  };

  GenerateFileNotUploadError = () => {
    if (!this.state.selectedFile) this.setState({ fileUpload: false });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const servicesMulti = JSON.parse(localStorage.getItem("servicesMulti"));
    let myServices = [];
    for (let s of this.state.IndependentServices) {
      if (servicesMulti.some(x => x.value === s.serviceName))
        myServices.push(s);
    }


    const locations = JSON.parse(localStorage.getItem("markers"));



    if (!locations || locations.length === 0)
      this.setState({ serviceLocalityError: "Please Set Your Service Locality" })

    else
      this.setState({ serviceLocalityError: "" })




    const isIndependentPerson =
      this.state.isIndependentPerson ? true : false;


    this.setState({ isIndependentPerson })
    global.staffDetails = this.state.doctorForm;

    let errors = this.validate();

    if (!isIndependentPerson && errors && errors.qualification && errors.serviceOrg_) {
      delete errors["qualification"];
      delete errors["serviceOrg_"];
      if (
        !errors.fullName &&
        !errors.email &&
        !errors.password &&
        !errors.OrganizationID

      ) {
        errors = null;
      }
    }

    if (isIndependentPerson) this.GenerateFileNotUploadError();

    // if (errors) {
    //   this.setState({ errors: errors });
    //   return;
    // }



    if (locations && locations.length >= 0) {

      // if (!errors) {
      try {
        if (isIndependentPerson && this.state.selectedFile) {
          const formData = new FormData();
          const locations = JSON.parse(localStorage.getItem("markers"));
          formData.append("CV", this.state.selectedFile);
          formData.append("fullName", this.state.doctorForm.fullName);
          formData.append("email", this.state.doctorForm.email);
          formData.append("password", this.state.doctorForm.password);
          formData.append(
            "isOrganizationAdmin",
            this.state.doctorForm.isOrganizationAdmin
          );
          formData.append(
            "OrganizationID",
            this.state.doctorForm.OrganizationID
          );






          const newLocation = locations.map((marker) => {
            if (marker.selected === true)
              delete marker.selected;
            if (marker.time)
              delete marker.time

            return marker;
          })


          formData.append("city", this.state.doctorForm.city);
          formData.append("locations", JSON.stringify(newLocation));


          global.selectedFile = this.state.doctorForm.selectedFile;
          const response = await signingUp(formData, "indepedentServiceProvider");
          localStorage.setItem("token", response.headers["x-auth-token"]);
          global.userID = response.data._id;
          global.formData = formData;
          global.staffDetails = this.state.doctorForm;
          global.city = this.state.doctorForm.city;
          global.serviceSelectedID = this.state.doctorForm.serviceOrg_;


          const servicesMulti = JSON.parse(localStorage.getItem("servicesMulti"));
          let myServices = [];
          for (let s of this.state.IndependentServices) {
            if (servicesMulti.some(x => x.value === s.serviceName))
              myServices.push(s);
          }
          const obj = {
            myServices,
            userID: response.data._id,
            // formData:formData,
            staffDetails: this.state.doctorForm,
            city: this.state.doctorForm.city,
            serviceSelectedID: this.state.doctorForm.serviceOrg_
          }

          this.props.history.push("/signUp/details", obj);


        }
        else if (!isIndependentPerson) {
          const locations = JSON.parse(localStorage.getItem("markers"));


          const newLocation = locations.map((marker) => {
            if (marker.selected === true)
              delete marker.selected;
            if (marker.time)
              delete marker.time

            return marker;
          })



          // if(lat && lng && radius){
          const { fullName, email, password, isOrganizationAdmin, OrganizationID, city } =
            this.state.doctorForm;
          const obj = {
            fullName: fullName,
            email: email,
            password: password,
            isOrganizationAdmin: isOrganizationAdmin,
            locations: newLocation,
            OrganizationID: OrganizationID,
            city: "Islamabad",


          };

          if (errors) return;
          try {
            const response = await signingUp(obj);
            localStorage.setItem("token", response.headers["x-auth-token"]);

            window.location = "/Home";


          } catch (ex) {
            if (ex.response && ex.response.status === 400) {
              const error = { ...this.state.errors };

              error.email = ex.response.data;

              this.setState({ errors: error });
            }
          }

        }

      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          const error = { ...this.state.errors };
          console.log("eXX:", ex);

          error.email = ex.response.data;

          this.setState({ errors: error });

        }
      }
      // }
    }
  }
  // };
  render() {
    const year = new Date().getFullYear();
    const dobSignUpMaxDate = year + "-12-31";

    return (
      <React.Fragment>
        <NavBar />
        <ToastContainer />
        <form onSubmit={this.handleSubmit}>
          <article className="signup-page signup-org-admin ">
            <main className="org-signup org card-signup signup-style-org animate__animated animate__fadeInLeft">
              <header>
                <h1
                  className="label-signup-org sign-up-header-text animate__animated animate__zoomIn"
                  style={{ margin: "0" }}
                >
                  Sign Up
                </h1>
              </header>

              <article className="signup-org-group">
                <article>
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("FULL NAME", "fname")}
                  </article>
                  <article className="txtField-signup-org">
                    {this.renderInput("text", "fullName", "fullName")}
                  </article>
                </article>
                <article className="second-item">
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("Email", "email")}
                  </article>
                  <article className="txtField-signup-org">
                    {this.renderInput("text", "email", "email")}
                  </article>
                </article>

              </article>


              <article className="signup-org-group">
                <article>
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("Password", "password")}
                  </article>
                  <article className="txtField-signup-org">
                    {this.renderInput("password", "password", "password")}
                  </article>
                </article>

                <article className="second-item dropdown-second-item">
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("Organization", "organization")}
                  </article>
                  <article className="txtField-signup-org">
                    {this.renderDropDown(
                      "service For",
                      this.state.organizations,
                      "OrganizationID",
                      "OrganizationID",
                      "Select Your Organization"
                    )}
                  </article>
                </article>
              </article>

              {this.state.isIndependentPerson && (
                <>

                  <article
                    style={{ display: "flex" }}
                  // className="signup-org-group servies-org"
                  >
                    <article>
                      <article style={{ margin: "0" }}>
                        {this.renderLabel("Service", "service")}
                      </article>
                      <article>
                        <Example

                          services={this.state.multiSevices}
                        />
                        {/* <MultiSelect
                          className="services-multi"
                          options={this.options}
                          selected={this.servicesSelected}
                          onChange={(e) => { this.setState({ servicesSelected: e }) }}
                          labelledBy={"Services"}
                        /> */}
                        {/* {this.renderDropDown(
                          "",
                          this.state.IndependentServices,
                          "serviceOrg_",
                          "serviceOrg_",
                          "Please Select a Service",
                 

                        )} */}
                      </article>
                    </article>
                    <article>
                      <article
                        className="second-item"

                      ></article>
                    </article>
                    <article>
                      <article className="signup-label" style={{ margin: "0" }}>
                        {this.renderLabel("Qualification", "Qualification")}
                      </article>
                      <article className="txtField-signup-org">
                        {this.renderDropDown(
                          "service For",
                          this.state.qualification,
                          "qualification",
                          "qualification",
                          "Your Qualification?"
                        )}
                      </article>
                    </article>
                  </article>
                </>
              )}

              {this.state.isIndependentPerson && (
                <article>
                  <article
                    className="txt-upload-label signup-label"
                    style={{ margin: "0" }}
                  >
                    {this.renderLabel("Upload Your Resume", "Resume")}
                  </article>
                  <input
                    className="txt-upload"
                    name="selectedFile"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={this.onChange}
                  ></input>
                  {!this.state.fileUpload && (
                    <p className="error">Please Upload Your Resume</p>
                  )}


                </article>
              )}


              <article

                className="signup-org-group"
                style={{
                  display: "flex",
                  justifyContent: "start",
                }}
              >




                <article>

                  {/* <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("City", "city")}
                  </article> */}

                  {/* <article
                    className="txtField-signup-org"

                  >
                    {this.renderDropDown(
                      "City",
                      this.state.city,
                      "city",
                      "city",
                      "Select Your City"
                    )}
                  </article> */}




                </article>

                <article className="second-item mt-2 ml-0"
                  style={{ margin: 0 }}
                >
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("Set Your Service Locality", "serviceLocality")}
                  </article>

                  <div style={{ marginLeft: "auto", marginRight: "auto" }}
                    className="open-map"
                  >
                    <Link to="/maps"
                      target="_blank"

                    >
                      Open Map
                      <FontAwesomeIcon icon={faLocationArrow}
                        style={{ marginLeft: "0.5rem" }}
                      />
                    </Link>
                  </div>
                  {this.state.serviceLocalityError &&


                    <p className="error">{this.state.serviceLocalityError}</p>}



                </article>






              </article>
              {/* <MultiServices /> */}
              <article className="btn-orgSignUp org-btn signup-page-btn">
                {this.renderBtn("Sign Up")}
              </article>

            </main>
          </article>
        </form>
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => {

  return {
    Organizationlocation: state.SetLocation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocation: (location) => dispatch(SetLocationAction(location)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SignUpAsOrganization)
);
