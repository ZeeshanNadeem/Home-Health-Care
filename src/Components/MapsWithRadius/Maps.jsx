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

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { Form, Container, Row, Col } from "react-bootstrap";
import { Circle } from '@react-google-maps/api';
import { Global } from "@emotion/react";
import { useSelector,useDispatch } from "react-redux";
import { SetLocationAction } from "../redux/actions/Organzationlocation";
import GetCurrentUser from "../CurrentUser/GetCurrentUser";


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
  

  let [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [showAlert, setAlert] = React.useState(false);
  let [inputRadius, setInputRadius] = React.useState("");

  const user=GetCurrentUser();
  const mapRef = React.useRef();


  useEffect(()=>{
      localStorage.removeItem("markers");
      localStorage.removeItem("lat");
      localStorage.removeItem("lng");
  },[])

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);


 

  const onMapClick = React.useCallback((event) => {

   const lat=parseFloat(event.latLng.lat())
   const lng=parseFloat(event.latLng.lng())


   if(user){
    setMarkers( [{
      lat:lat,
      lng:lng,
      time: new Date(),
    }])
   }
   else {
    setMarkers((current) => [

      
      ...current,
      {
        lat:lat,
        lng:lng,
        time: new Date(),
      }
     
    ]);
  }
  
    setInputRadius("");
  
    if(user){
      setAlert(true);
      localStorage.setItem("lat",parseFloat(event.latLng.lat()));
      localStorage.setItem("lng", parseFloat(event.latLng.lng()));
   
    }
    
  }, []);

 

  const handleRadius=(e)=>{
 
    
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
  console.log("marker:",marker)
  markers=markers.filter(m=>m!==marker)
  console.log("deleted:",markers)
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
    <div>
       

     {!user  &&
      <div className="search radius">
     
     <input type="tel"
     value={inputRadius}
     placeholder="Enter Radius in km"
    
     
     onChange={handleRadius}
     />
        
  
    </div>}

     
      <LoadScript googleMapsApiKey={config.apiKey} 
      libraries={libraries}
      >
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
          
          
          { markers.map((marker,index) => (
          
           
            <Marker
              key={marker.time.toISOString()}
              position={{ lat: parseFloat(marker.lat) , lng: parseFloat(marker.lng) }}  
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

      

             markers.map((marker)=>{
           
              
            return <Circle 
            key={marker.time.toISOString()}
            center={{ lat: parseFloat(marker.lat) , lng:parseFloat(marker.lng)}}
             
             radius={marker.radius*1000} />
             })
            
            }
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Maps;




