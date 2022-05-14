import {Container,Row,Col,Form,Button} from 'react-bootstrap'
import GetCurrentUser from '../CurrentUser/GetCurrentUser';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import Joi from "joi-browser";
import axios from "axios";
import { useState,useEffect,useRef,useLayoutEffect} from 'react'
import Select from 'react-select'
import config from "../Api/config.json";

const MyAvailability=()=>{
 const  daysSchema = Joi.object({
        name: Joi.string().required().label("Days").required(),
        value: Joi.number().required().label("Days").required()
      }).required()
    
 const slotSchema = Joi.object({
        time: Joi.string().required().label("Days").required(),
        name: Joi.number().required().label("Days").required(),
        value:Joi.boolean().required()
      }).required()
    
 const daysChoosen=useRef([
  {name:"MON",value:false},
  {name:"TUE",value:false},
  {name:"WED",value:false},
  {name:"THRU",value:false},
  {name:"FRI",value:false},
  {name:"SAT",value:false},
  {name:"SUN",value:false}
 ]);

 const slotsForBackend=useRef([
  {time:"12AM to 3AM",name:"12 AM to 3 AM",value:false},
  {time:"3AM to 6AM",name:"12 AM to 3 AM",value:false },
  {time:"6AM to 9AM",name:"12 AM to 3 AM",value:false},
  {time:"9AM to 12PM",name:"12 AM to 3 AM",value:false},
  {time:"12PM to 3PM",name:"12 AM to 3 AM",value:false},
  {time:"3PM to 6PM",name:"12 AM to 3 AM",value:false},
  {time:"6PM to 9PM",name:"12 AM to 3 AM",value:false},
  {time:"9PM to 12AM",name:"12 AM to 3 AM",value:false},
]);





   let optionDays=[];

  const  schema = {
        fullName: Joi.string().required().label("Name"),
        qualification: Joi.string().label("Qualification"),
        phoneNo: Joi.string().required().label("PhoneNo"),
        service: Joi.string().required().label("Service"),
       
        // availableDays: Joi.array().items(daysSchema).required().label("Days"),
        // availableTime: Joi.array().items(slotSchema).required().label("Time"),
       
    };
    const [daysDefaultSelected,setDefaultDays]=useState([]);
    const [slotsAvailableDefault,setSlotsAvailable]=useState([]);
    const [fullName,setFullName]=useState("");
    const [qualification,setQualification]=useState("");
    const [phoneNo,setPhoneNo]=useState("");
    const [service,setService]=useState("");
    const [availableDays,setAvailableDays]=useState([]);
    const [availableTime,setAvailableTime]=useState([]);
    const [totalQualifications,setTotalQualification]=useState([]);
    const [independentServices,setIndependentServices]=useState([]);
    const [staffDetails,setStaffDetails]=useState([]);

    

    const [days,setDays]=useState( [
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
      ]);
    const [slot,setSlots]=useState([
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
      ]);

    const [errors,setErrors]=useState({});

    const daysAvailable = [
        { label: 'MON', value: 'MON' },
        { label: 'TUE', value: 'TUE'},
        { label: 'WED', value: 'WED' },
        { label: 'THRU', value: 'THRU' },
        { label: 'FRI', value: 'FRI' },
        { label: 'SAT', value: 'SAT' },
        { label: 'SUN', value: 'SUN' }

      ]      
    const slotsAvailable=[
           {
          label: "12AM to 3AM",
          value: "12AM to 3AM",
        
        },
        {
            label: "3AM to 6AM",
            value: "3AM to 6AM",
        
        },
  
        {
            label: "6AM to 9AM",
        
            value: "6AM to 9AM",
        },
        {
            label: "9AM to 12PM",
        
            value: "9AM to 12PM",
        },
        {
            label: "12PM to 3PM",
        
            value: "12PM to 3PM",
        },
        {
            label: "3PM to 6PM",
        
            value: "3PM to 6PM",
        },
        {
            label: "6PM to 9PM",
        
            value: "6PM to 9PM",
        },
        {
            label: "9PM to 12AM",
        
            value: "9PM to 12AM",
        },
      ]

  
   

    useEffect(async ()=>{
  
      const user=  GetCurrentUser();

      try{
        let  {data:StaffDetails}= await axios.get(config.apiEndPoint+`/staff/${user.staffMember._id}`)
        const {data:qualificationsArr}=await axios.get(config.apiEndPoint+`/qualification`)
        const { data: services } = await axios.get(
            config.apiEndPoint + "/independentServices"
          );

         

         daysChoosen.current=StaffDetails.availableDays;
         slotsForBackend.current=StaffDetails.availableTime;

        console.log("independent Services::", services)
        console.log(" slotsForBackend.current::",  slotsForBackend.current)
     

          const daysAvailable= StaffDetails.availableDays.filter(d=>d.value===true);
      
          const slotsAvailable= StaffDetails.availableTime.filter(d=>d.value===true);
        
          let slotsAvailable_=[];

          slotsAvailable.map((d)=>(
            slotsAvailable_.push({
                label:d.time,
                value:d.time
            })
            
         ));

        
         setSlotsAvailable(slotsAvailable_)
         setAvailableTime(slotsAvailable_)

          daysAvailable.map((d)=>(
             optionDays.push({label:d.name,
                 value:d.name
             })
             
          ));
         setDefaultDays(optionDays)
         setAvailableDays(optionDays)
        
        
          setIndependentServices(services.results)
          setTotalQualification(qualificationsArr)
          setQualification(StaffDetails.qualification._id)
          setService(StaffDetails.staffSpeciality._id)
          setFullName(StaffDetails.fullName)
          setPhoneNo(StaffDetails.phone)
          setStaffDetails(StaffDetails)
         
       
         
        
      }
       catch(ex){
           console.log("ex:",ex)
       }
     
    },[])

   const onChangeTextFields=(e)=>{


        const errorMessage = validateProperty(e.currentTarget);

    
        if (errorMessage) errors[e.currentTarget.name] = errorMessage;
        else {
            delete errors[e.currentTarget.name];
            setErrors(errors);
        }


        let Name=e.currentTarget.name;
        
        if(Name==="fullName"){
            setFullName(e.currentTarget.value)
        }
       else if(Name==="qualification"){
        setQualification(e.currentTarget.value)
        }
       else if(Name==="phoneNo"){
        setPhoneNo(e.currentTarget.value)
        }
        else if(Name==="service"){
          console.log("e.currentTarget.value::",e.currentTarget.value)
            setService(e.currentTarget.value)
        }
       
      
       setErrors(errors)
          
    }


    const onChangeSlots=(e)=>{
     
     for(let backendSlot of slotsForBackend.current){
      let found=false;
         for(let slot of e){
             if(backendSlot.time===slot.value){
              backendSlot.value=true;
              found=true;
             }
            
         }
         if(!found) backendSlot.value=false;
     }
     console.log("backendSlot::",slotsForBackend.current)

     
    
    }

    const onChangeDays=(e)=>{

     
        for(let day of  daysChoosen.current){
          let found=false;
            for(let d of e){
                if(day.name===d.value){
                  day.value=true;
                  found=true;

                }
                
               
            }
            if(!found) day.value=false;
        }
      
   
        
      }

   const  validate = () => {
        let obj={
            fullName,
            qualification,
            phoneNo,
            service,
            // availableDays,
            // availableTime,
            
        }
        console.log("obj:::",obj);
          const { error } = Joi.validate(
              obj,
             schema,
              {
                  abortEarly: false,
              }
          );
          if (!error) return null;
          let errors = {};
          if (error) {
              for (let item of error.details) {
                  errors[item.path] = item.message;
              }
          }
  
          return Object.keys(errors).length === 0 ? null : errors;
      };


    const updateDetials=async(e)=>{
          e.preventDefault();
         const user=GetCurrentUser();
      
        const errors=validate();
        setErrors(errors || {})


        const { data:serviceGot } = await axios.get(
          config.apiEndPoint + `/services?findServiceByUser=true&userID=${user._id}`
        );
        

       

        
        const { data: userObjInTable } = await axios.get(
          config.apiEndPoint + `/user/${staffDetails._id}`
        );
     
       
        if(!errors){
        
          let obj={
              fullName,
              email:userObjInTable.email,
              password:userObjInTable.password,
              serviceID:service,
              Organization:staffDetails.Organization,
              availableDays:daysChoosen.current,
              availableTime:slotsForBackend.current,
              phone:phoneNo,
              qualificationID:qualification,
          
              Rating: staffDetails.Rating,
              RatingAvgCount: staffDetails.RatingAvgCount

          }

       
          try {
          
            await axios.put(
              "http://localhost:3000/api/staff/" + `${staffDetails._id}?updateIndependent=true`,
              obj
            );
      
            const updateUser = {
              fullName: fullName,
              staffID: staffDetails._id,
            
            };
           
         
            await axios.put(
              config.apiEndPoint + `/user/${userObjInTable._id}?findUser=abc`,
              updateUser
            );
            toast.success("Details Updated");
          } catch (ex) {
            toast.error(ex.response.data);
          }
        }
    }
  
    const validateProperty = ({ value, name }) => {
          let dataProperty = { [name]: value };
          let subSchema = { [name]: schema[name] };
  
         
          const { error } = Joi.validate(dataProperty, subSchema);
  
          return error ? error.details[0].message : null;
      };


     
      
    return(
    <>
    <ToastContainer/>
    <div className="avaialbility-container">
       
        <h2 className='availability-hd'>My Details</h2>
   <Container>
   <Form 
    onSubmit={updateDetials}
   >
  <Row className="mt-5">
    <Col></Col>
    <Col> 
    <Form.Group className="mb-3" >
    <Form.Label className="label-order label-style1">Full Name</Form.Label>
    <Form.Control
    onChange={onChangeTextFields}
    type="text" placeholder="FullName"
    name="fullName"
    value={fullName}
    />
               
    </Form.Group>
    <div className='text-danger'>
    {errors && errors.fullName}
    </div>
    </Col>
    <Col></Col>
  </Row>


  <Row>
    <Col ></Col>
    <Col> 
    <Form.Group className="mb-3" >
                <Form.Label className="label-order label-style1">Phone No</Form.Label>
                <Form.Control 
                 onChange={onChangeTextFields}
                type="tel" placeholder="Phone No"
                name="phoneNo"
                value={phoneNo && phoneNo}
                
                />
               
            </Form.Group>
            <div className='text-danger'>
             {errors && errors.phoneNo}
              </div>

            
            </Col>
    <Col></Col>
  </Row>


  <Row>
    <Col></Col>
            <Col> 
            <Form.Group className="mb-3" >
                <Form.Label className="label-order label-style1">Qualification</Form.Label>
                <Form.Select
                 onChange={onChangeTextFields}
                 name="qualification"
                 value={qualification && qualification}
                
                aria-label="Default select example">
                    <option>Select Your Qualification</option>
                    {totalQualifications.map((data,i)=>(
                        <option 
                        key={i}
                        value={data._id}>{data.name}</option>
                    ))
                       }
                    
            </Form.Select>
               
            </Form.Group>
            <div className='text-danger'>
             {errors && errors.qualification}
              </div>

            
            </Col>
    <Col></Col>
  </Row>

  <Row>
    <Col></Col>
            <Col> 
            
            <Form.Group className="mb-3" >
                <Form.Label className="label-order label-style1">Service</Form.Label>
                <Form.Select 
                 onChange={onChangeTextFields}
                 name="service"
                 value={service && service}
               
                aria-label="Default select example">
                    <option value="">Select Your Service</option>
                    
                    {independentServices.length>0 && independentServices.map((data,i)=>(
                    <option key={i} value={data._id}
                     
                    >{data.serviceName}
                 
                    </option>
                    ))
                   
                    }
                 
            </Form.Select>
               
            </Form.Group>
            <div className='text-danger'>
             {errors && errors.service}
              </div>

            
            </Col>
    <Col></Col>
  </Row>
  
  <Row className="mb-3">
  
    <Col ></Col>
            <Col> 
            <Form.Label className="label-order label-style1">Select Your Days</Form.Label>
            {daysDefaultSelected.length>0 &&
            <Select options={daysAvailable}
            name="availableDays"
            placeholder="Select Days Available"
            isMulti
            defaultValue={daysDefaultSelected}
            onChange={onChangeDays}
            
            />

            }
             <div className='text-danger'>
             {errors && errors.availableDays}
              </div>


            
            </Col>
    <Col></Col>
  </Row>

  <Row  className="mb-4">
    <Col></Col>
            <Col> 
            <Form.Label className="label-order label-style1">Select Your Slots</Form.Label>
           {slotsAvailableDefault.length>0 
           &&
           <Select options={slotsAvailable}
            placeholder="Select Slots Available"
            name="availableTime"
            defaultValue={slotsAvailableDefault}
            isMulti
            onChange={onChangeSlots}
            
            />}
            <div className='text-danger'>
             {errors && errors.availableTime}
              </div>


            
            </Col>
    <Col></Col>
  </Row>

  <Row>
    <Col></Col>
            <Col> 
            <Button
            type="submit"
            variant="primary">Update Your Information</Button>

            
            </Col>
    <Col></Col>
  </Row>
 
 
  </Form>
</Container>

</div>
</>
    )
}

export default MyAvailability;