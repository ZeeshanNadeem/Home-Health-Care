import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";
import mapStyles from "./MapStyles";
import React, { useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import config from "./config.json";
import compass from "../../Images/compass.png";
import configApi from "../Api/config.json";



import {
  Combobox,
  ComboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxInput,
} from "@reach/combobox";
import { Form, Container, Row, Col } from "react-bootstrap";
import { Circle } from '@react-google-maps/api';
import { Global } from "@emotion/react";
import { useSelector,useDispatch } from "react-redux";
import { SetLocationAction } from "../redux/actions/Organzationlocation";
import GetCurrentUser from "../CurrentUser/GetCurrentUser";
import axios from "axios";


const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

// lat: () => 43.6532, lng: () => -79.3832
// 43.653225
// -79.383186
const center = {
  lat: 33.6844,
  lng:  73.0479,
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const libraries = ["places"];



const Maps = () => {
  

  let [markers, setMarkers] = React.useState([
  
]);
  const [selected, setSelected] = React.useState(null);
  const [showAlert, setAlert] = React.useState(false);
  let [inputRadius, setInputRadius] = React.useState("");

  const user=GetCurrentUser();
  console.log("user:",user);

  const mapRef = React.useRef();
  const {isLoaded}= useLoadScript({googleMapsApiKey:config.apiKey,
  libraries:libraries
  })


  useEffect(async ()=>{
   
   
    if(!user){
     
      localStorage.removeItem("markers");
      
      localStorage.removeItem("lat");
      localStorage.removeItem("lng");
      localStorage.removeItem("locationChanged")
      }
    
      if(user){
        // localStorage.removeItem("lat");
        // localStorage.removeItem("lng");
       const {data} =await axios.get(configApi.apiEndPoint+`/userRequests?userID=${user._id}`)
       if(data.length>0 && data[data.length-1].markers.length>0){
        const marker=data[data.length-1].markers;
        
       
        setMarkers(marker)
      } else if(localStorage.getItem("lat") && localStorage.getItem("lng")){
          let marker=[];
          marker.push({lat:Number(localStorage.getItem("lat")),
          lng:Number(localStorage.getItem("lng"))
        
        })
        setMarkers(marker)
      }
      }
    

  },[])
  

  const panTo=React.useCallback(({lat,lng})=>{
    mapRef.current.panTo({lat,lng});
    mapRef.current.setZoom(14);
  
  },[])
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);


 

  const onMapClick = React.useCallback((event) => {

  //  const lat=
  //  const lng=


   if(user){
    setMarkers( [{
      lat:Number(event.latLng.lat()),
      lng:Number(event.latLng.lng()),
      time: new Date(),
    }])
   }

   else {
    setMarkers((current) => [

      
      ...current,
      {
        lat:Number(event.latLng.lat()),
        lng:Number(event.latLng.lng()),
        time: new Date(),
      }
     
    ]);
  }
  
    setInputRadius("");
  
    if(user){
      setAlert(true);
      localStorage.setItem("lat",Number(event.latLng.lat()));
      localStorage.setItem("lng", Number(event.latLng.lng()));
      localStorage.setItem("locationChanged", "true");
   
    }
    
  }, []);

 

  const handleRadius=(e)=>{
 
    
    if(markers.length===0) return;
   const selected=markers.filter(x=>x.selected===true);
   if(selected.length>0){
     const indexOfSelected=markers.indexOf(selected[0]);
     markers[indexOfSelected].radius=e.currentTarget.value;

   }
   else 
   markers[markers.length-1].radius=e.currentTarget.value;
    setInputRadius(e.currentTarget.value);

   
    if(e.currentTarget.value!="" && markers.length>0){

    
    
      setAlert(true);
    }
   

  


    
  }
  // if (loadError) return "Error loading maps";
  // else if (!isLoaded) return "Loading Maps";

  // React.useCallback((event) => {

 const checkRadius= React.useCallback(()=>{
 

    if(markers.length>0){
     
    
    
      localStorage.setItem("markers",JSON.stringify(markers));
    
     
     
      return true;
    }
   
    else return false;
 })

 const setSelectedMarker=(marker)=>{

 
     markers=markers.map((m)=>{
       if(m.selected===true)
       delete m.selected;
        
       return m;
       

    })
  
  inputRadius=marker.radius? marker.radius :"";
  marker.selected=true;
  setSelected(marker);
  setInputRadius(inputRadius)

 }


 const deleteMarker=(marker)=>{
  
  markers=markers.filter(m=>m!==marker)
  
  setMarkers(markers);
 }
 
 const onMarkerDrag=(e,marker)=>{
  
  const filterMaker=markers.filter(m=>m===marker);
  const index=markers.indexOf(filterMaker[0]);
  const lat=parseFloat(e.latLng.lat())
  const lng=parseFloat(e.latLng.lng())

  marker.lat=lat;
  marker.lng=lng;

  markers[index]=marker;
  // if(marker.radius){
  //   marker.radius="";
  // }

  const newMarkers=markers.filter(m=>m!==marker);


 
  if(user){
   
    setMarkers( [{
      lat:e.latLng.lat(),
      lng:e.latLng.lng(),
     
      time: new Date(),
    }])
    if(user){
      setAlert(true);
      localStorage.setItem("lat",parseFloat(lat));
      localStorage.setItem("lng", parseFloat(lng));
      localStorage.setItem("locationChanged", "true");
   
    }
   }

   else{
  setMarkers(() => [
    ...newMarkers,
    {
      lat:lat,
      lng:lng,
      radius:marker.radius,
      time: new Date(),
    }
   
  ]);
}
  
 }

 const eraseAlert=()=>{
    setTimeout(()=>{
      setAlert(false);
  }, 1000);
  }
  return (
    <>
    {isLoaded && <div>
       

     {!user  &&
      <div className="search radius">
     
     <input type="tel"
     value={inputRadius}
     placeholder="Enter Radius in km"
     style={{marginTop:"4rem"}}
     
     onChange={handleRadius}
     />
        
  
    </div>}

    

     
      {/* <LoadScript googleMapsApiKey={config.apiKey} 
      libraries={libraries}
      
      > */}
        <Search 
          panTo={panTo}
          />
          <Locate panTo={panTo}/>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
        { showAlert && <div className="alert-container">
                  
                <div className="alert alert-success cutomization-alert" role="alert">
                Service locality set <strong>successfully!</strong>
                </div>
                {eraseAlert()}
              </div>
          }
          
          
          {markers.length>0  && 
          
          markers.map((marker,index) => (
        
          
           
            
          
              <Marker
              key={index}
              position={{ lat: Number(marker.lat), lng: Number(marker.lng)}}  
              draggable
            
           
              icon={{
                url: marker.selected || (index===markers.length-1 && !markers.some(x=>x.selected===true)) ? "/pinBlue.png":"/pin.png",
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
              
              
               

                
                
              }}
              
              onClick={()=>{setSelectedMarker(marker)}}
              onRightClick={(()=>{deleteMarker(marker)})}
              onDragEnd={(e)=>onMarkerDrag(e,marker)}
            />
        
             
          
            
          ))}
        
         
       

          {/* {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <h6>Your Pinned Location </h6>
            </InfoWindow>
          )} */}

           {checkRadius() && 

      
             
             markers.map((marker,index)=>{
           
              if(marker.radius){
            return <Circle 
            key={index}
            center={{ lat: Number(marker.lat) , lng:Number(marker.lng)}}
             
             radius={Number(marker.radius*1000)} />
            }
            else {
              return <Circle 
              key={index}
              center={{ lat: Number(marker.lat) , lng:Number(marker.lng)}}
               
               />
            }
             })
            
            }
        </GoogleMap>
      {/* </LoadScript> */}
    </div>}
    </>
  );
};


function Locate({panTo}){
  const locateUser=()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      panTo({lat:position.coords.latitude,
     lng:position.coords.longitude   
     })
    })
  }
    return(
      <button className="locate">
      <img
           style={{height:"4rem",width:"4rem"}}
           src={compass}
           alt="compass - locate me"
           onClick={locateUser}
         />
      </button>
    )
  }
 
   function Search({panTo}){
 
     const {ready,
         value,
       suggestions:{status,data},
       setValue,
       clearSuggestions
 
   }=usePlacesAutocomplete(
     //   {
     //   requestOptions:{
     //     location:{ lat:()=> 33.6844,
     //       lng:()=>  73.0479,
     //       radius:200*1000
     //     }
     //   }
     // }
     );

     console.log('ready:',ready)
 
     const handleSelect=async(address)=>{
       setValue(address,false);
       clearSuggestions();
      
       try{
         const results =await getGeocode({address});
         const {lat ,lng}=await getLatLng(results[0]);
         panTo({lat,lng})
      
       }
       catch(error){
        
       }
     }
     
 
     return(
       <Combobox
       onSelect={(address)=>{handleSelect(address)}}
       >
 
         <div className="search">
         <ComboboxInput
         value={value}
         onChange={(e)=>{
           setValue(e.target.value)
         }}
         disabled={!ready}
         placeholder="Enter an address"
         ></ComboboxInput>
         </div>
 
               <ComboboxPopover
                 className="popover-style"
                 >
                 <ComboboxList>
                         {status === "OK" && 
                             data.map(({ id, description },i) => (
                                 <ComboboxOption key={i} value={description}
                                 className="popover-option"
                                
                                 />
                             ))}
                     </ComboboxList>
                 </ComboboxPopover>
       </Combobox>
     )
   }
   

export default Maps;




