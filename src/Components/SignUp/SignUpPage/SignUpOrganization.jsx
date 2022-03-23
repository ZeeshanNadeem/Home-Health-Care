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
    serviceLocalityError:"",
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
    city: ["Islamabad", "Rawalpindi"],
    lat: "",
    lng: "",
  };

  schema = {
    fullName: Joi.string().required(),
    // dateOfBirth: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(255).required(),
    isOrganizationAdmin: Joi.boolean().required(),
    OrganizationID: Joi.string().required(),
    city: Joi.string().required(),
    

    // price: Joi.string().required(),

    // phone: Joi.string().required(),
    //61d5bc5c69b35ef18754dc9a
    serviceOrg_:
      this.state.doctorForm.OrganizationID === "61d5bc5c69b35ef18754dc9a"
        ? Joi.string().required().label("Service")
        : Joi.string().optional().label("Service"),
    qualification:
      this.state.doctorForm.OrganizationID === "61d5bc5c69b35ef18754dc9a"
        ? Joi.string().required().label("Qualification")
        : Joi.string().optional().label("Qualification"),
  };

  constructor(props){
    super(props);
    localStorage.removeItem("lat");
    localStorage.removeItem("lng");
    localStorage.removeItem("radius");
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
        } catch (ex) {}
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

  
    this.setState({
      organizations: data.results,
      qualification,
      IndependentServices: services,
    });
  }

  // setFile = (e) => {
  //   this.setState({ selectedFile: e.target.files[0] });
  // };

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
  
   const lat= localStorage.getItem("lat");
   const lng= localStorage.getItem("lng");
   const radius= localStorage.getItem("radius");

   if(lat && lng && radius)
   this.setState({serviceLocalityError:""})
  
    const isIndependentPerson =
      this.state.doctorForm.OrganizationID === "6237270f9179e6123218a579"
        ? true
        : false;

    global.staffDetails = this.state.doctorForm;

    let errors = this.validate();
   
    if (!isIndependentPerson) {
      delete errors["qualification"];
      delete errors["serviceOrg_"];
      if (
        !errors.fullName &&
        !errors.email &&
        !errors.password &&
        !errors.OrganizationID &&
        !errors.city 
      ) {
        errors = null;
      }
    }

    if (isIndependentPerson) this.GenerateFileNotUploadError();

    if(errors){
      this.setState({ errors: errors  });
      return;
    }
   
    

    if (!errors && this.state.selectedFile) {
      try {
        // global.formData = formData;
        // global.staffDetails = this.state.doctorForm;
        // this.state.doctorForm = formData;
        // const response = await signingUp(this.state.doctorForm);
        // global.data = this.state.doctorForm;

        if (isIndependentPerson) {
          const formData = new FormData();

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
          formData.append("city", this.state.doctorForm.city);
          formData.append("lat", lat);
          formData.append("lng", lng);
          formData.append("radius", radius);

          global.selectedFile = this.state.doctorForm.selectedFile;
          const response = await signingUp(formData);
          localStorage.setItem("token", response.headers["x-auth-token"]);
          global.userID = response.data._id;
          global.formData = formData;
          global.staffDetails = this.state.doctorForm;
          global.city = this.state.doctorForm.city;
          global.serviceSelectedID = this.state.doctorForm.serviceOrg_;
          this.props.history.push("/signUp/details");
        }
        // window.location = "/Home";
        // const { serviceOrg_, qualification, OrganizationID } =
        //   this.state.doctorForm;
        // if (serviceOrg_ && qualification) {
        //   const obj = {};
        //   obj.serviceName = serviceOrg_;
        //   obj.serviceOrgranization = OrganizationID;
        //   // obj.servicePrice = price;
        //   // obj.userID = response.data._id;
        //   // await axios.post(config.apiEndPoint + "/services", obj);
        //   global.serviceObj = obj;
        //   global.staffDetails = this.state.doctorForm;
        //   this.props.history.push("/signUp/details");
        // }
        // if (!price && !serviceOrg_ && !qualification) window.location = "/Home";
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          const error = { ...this.state.errors };
          console.log("eXX:",ex);
          
          error.email = ex.response.data;

          this.setState({ errors: error });
        
        }
      }
    } else if (!isIndependentPerson) {
      const lat=localStorage.getItem("lat");
      const lng=localStorage.getItem("lng");
      const radius=localStorage.getItem("radius");
      if(lat && lng && radius){
      const { fullName, email, password, isOrganizationAdmin, OrganizationID,city } =
        this.state.doctorForm;
      const obj = {
        fullName: fullName,
        email: email,
        password: password,
        isOrganizationAdmin: isOrganizationAdmin,
        lat: lat,
        lng: lng,
        radius:radius,
        OrganizationID: OrganizationID,
        city:city,

      };

      if (errors) return;
      try {
        const response = await signingUp(obj);
        localStorage.setItem("token", response.headers["x-auth-token"]);
        localStorage.removeItem("lat");
        localStorage.removeItem("lng");
        localStorage.removeItem("radius");
        window.location = "/Home";
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          const error = { ...this.state.errors };

          error.email = ex.response.data;

          this.setState({ errors: error });
        }
      }
    }
    else {
          this.setState({serviceLocalityError:"Service Locality Required"})
    }
    }
  };
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
              {/* <article
                className="signup-dob signup-label"
                style={{ margin: "0" }}
              >
                {this.renderLabel("Date of Birth", "dob")}
              </article>
              <article>
                {this.renderInput(
                  "date",
                  "dateOfBirth",
                  "dateOfBirth",
                  "",
                  "",
                  dobSignUpMaxDate
                )}
              </article> */}

              <article className="signup-org-group">
                <article>
                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("Password", "password")}
                  </article>
                  <article className="txtField-signup-org">
                    {this.renderInput("password", "password", "password")}
                  </article>
                </article>
                {/* <article className="signup-label">
                    {this.renderLabel("Confirm Password", "email")}
                  </article>
                  <article>{this.renderInput("text", "email", "email")}</article> */}
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

              {this.state.doctorForm.OrganizationID ===
                "6237270f9179e6123218a579" && (
                <article
                  // style={{ marginTop: "0.5rem" }}
                  className="signup-org-group servies-org"
                >
                  <article>
                    <article style={{ margin: "0" }}>
                      {this.renderLabel("Service", "service")}
                    </article>
                    <article>
                      {this.renderDropDown(
                        "",
                        this.state.IndependentServices,
                        "serviceOrg_",
                        "serviceOrg_",
                        "Please Select a Service"
                      )}
                    </article>
                  </article>
                  <article>
                    <article
                      className="second-item"
                      // style={{ marginTop: "1rem" }}
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
              )}

              {this.state.doctorForm.OrganizationID ===
                "6237270f9179e6123218a579" && (
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

                  {/* {this.renderFile(
                    "file",
                    "selectedFile",
                    "selectedFile",
                    ".pdf,.docx"
                  )} */}
                </article>
              )}
              {/* <article className="ChkBox-signup">
                {this.renderCheckBox(
                  "checkbox",
                  "isOrganizationAdmin",
                  "isOrganizationAdmin",
                  "Request To Be an Organization Admin"
                )}
              </article> */}

              <article
              
                className="signup-org-group"
                style={{
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                   



              <article>

                  <article className="signup-label" style={{ margin: "0" }}>
                    {this.renderLabel("City", "city")}
                  </article>

                  <article
                    className="txtField-signup-org"
                    // style={{ width: "34rem" }}
                  >
                    {this.renderDropDown(
                      "City",
                      this.state.city,
                      "city",
                      "city",
                      "Select Your City"
                    )}
                </article>

               
                

              </article>

              <article className="second-item">
                      <article className="signup-label" style={{ margin: "0" }}>
                        {this.renderLabel("Set Your Service Locality", "serviceLocality")}
                      </article>

                      <div style={{marginLeft:"auto",marginRight:"auto"}}
                      className="open-map"
                      >
                      <Link to="/maps"
                     target="_blank"
                     
                      >
                       Open Map
                      <FontAwesomeIcon icon={faLocationArrow}
                      style={{marginLeft:"0.5rem"}}
                      />
                      </Link>
                      </div>
                      {this.state.serviceLocalityError &&

                      
                        <p className="error">{this.state.serviceLocalityError}</p>}
                      
                     

                  </article>



              

                {/* <article className="signup-label">
                    {this.renderLabel("Confirm Password", "email")}
                  </article>
                  <article>{this.renderInput("text", "email", "email")}</article> */}
                {/* <article className="second-item dropdown-second-item">
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
                </article> */}
              </article>

              <article className="btn-orgSignUp org-btn signup-page-btn">
                {this.renderBtn("Sign Up")}
              </article>
              {/* <a href="#" className="google btn">
                  <i className="fa fa-google fa-fw"></i> SignUp with Google
                </a> */}
            </main>
          </article>
        </form>
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  console.log("state:::",state);
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
