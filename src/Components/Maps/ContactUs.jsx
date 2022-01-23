import React, { useState, useEffect } from "react";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  google,
} from "react-google-maps";

import { Circle } from "react-google-maps";
class ContactUs extends React.Component {
  state = {
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    height: 400,
    mapPosition: {
      lat: 0,
      lng: 0,
    },
    markerPosition: {
      lat: 0,
      lng: 0,
    },
  };

  render() {
    const MapWithAMarker = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          defaultZoom={10.2}
          defaultCenter={{ lat: 33.738045, lng: 73.084488 }}
          onGoogleApiLoaded={({ map, maps }) =>
            new google.maps.Circle({
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.3,
              map,
              center: { lat: 33.738045, lng: 73.084488 },
              radius: 1000,
            })
          }
        >
          {/* <Marker position={{ lat: 33.738045, lng: 73.084488 }} /> */}
          <Circle center={{ lat: 33.738045, lng: 73.084488 }} radius={4000} />
          <Circle center={{ lat: 33.626057, lng: 73.071442 }} radius={7000} />
        </GoogleMap>
      ))
    );

    return (
      <MapWithAMarker
        // googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAAbgJTLaFLWsWWvzafIXpJU62NXdQKY1Q&v=3.exp&libraries=geometry,drawing,places"
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBLhbN9qEV-vcGzi3ZZt1yf9amkTR4PdC0&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

export default ContactUs;
