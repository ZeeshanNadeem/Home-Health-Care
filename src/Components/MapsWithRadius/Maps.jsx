import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";
import mapStyles from "./MapStyles";
import React from "react";
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

const Maps = () => {
  const libraries = ["places"];
  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: process.env.React_APP_GOOGLE_MAPS_API_KEY,
  //   libraries,
  // });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [radius, setRadius] = React.useState(null);
  const [createRadius, setCreateRadius] = React.useState(false);
  const [showAlert, setAlert] = React.useState(false);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      // ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

 

  const handleRadius=(e)=>{
    if(e.currentTarget.value!="" && markers.length>0){
      setCreateRadius(true);
      setAlert(true);
    }
    else {
      setCreateRadius(false);
    }
    setRadius(e.currentTarget.value)

  }
  // if (loadError) return "Error loading maps";
  // else if (!isLoaded) return "Loading Maps";


 const eraseAlert=()=>{
    setTimeout(()=>{
      setAlert(false);
  }, 1000);
  }
  return (
    <div>
      {/* <Search /> */}

      <div className="search radius">
     
     <input type="text"
     placeholder="Enter Radius in km"
     onChange={handleRadius}
     />
        
  
    </div>

      <LoadScript googleMapsApiKey={config.apiKey} libraries={libraries}>
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
          
          {markers.map((marker) => (
            <Marker
              key={marker.time.toISOString()}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{
                url: "/pin.png",
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
              }}
              onClick={() => {
                setSelected(marker);
              }}
            />
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <h6>Your Pinned Location </h6>
            </InfoWindow>
          )}
           {createRadius &&
             <Circle center={{ lat: markers[0].lat, lng: markers[0].lng }} radius={radius*1000} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Maps;




// function radius() {
//   return (
//     <div className="search">
//       <Combobox
//         onSelect={(address) => {
//           console.log(address);
//         }}
//       >
//         <ComboboxInput
//           value={value}
//           onChange={(e) => {
//             setValue(e.target.value);
//           }}
//           disabled={!ready}
//           placeholder="Enter a address.."
//         />
        
//       </Combobox>
//     </div>
//   );
// }



// function Search() {
//   const {
//     ready,
//     value,
//     suggestions: { status, data },
//     setValue,
//     clearSuggestions,
//   } = usePlacesAutocomplete(
//     {
//     requestOptions: {
//       location: { lat: () => 43.6532, lng: () => -79.3832 },
//       radius: 100 * 1000,
//     },
//   }
//   );

//   console.log("ready:",ready);
//   // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

//   const handleInput = (e) => {
//     setValue(e.target.value);
//   };

//   const handleSelect = async (address) => {
//     // setValue(address, false);
//     // clearSuggestions();

//     // try {
//     //   const results = await getGeocode({ address });
//     //   const { lat, lng } = await getLatLng(results[0]);
//     //   panTo({ lat, lng });
//     // } catch (error) {
//     //   console.log("😱 Error: ", error);
//     // }
//   };

//   return (
//     <div className="search">
//       <Combobox onSelect={handleSelect}>
//         <ComboboxInput
//           value={value}
//           onChange={handleInput}
//           // disabled={!ready}
//           placeholder="Search your location"
//         />
//         <ComboboxPopover>
//           <ComboboxList>
//             {status === "OK" &&
//               data.map(({ id, description }) => (
//                 <ComboboxOption key={id} value={description} />
//               ))}
//           </ComboboxList>
//         </ComboboxPopover>
//       </Combobox>
//     </div>
//   );
// }
