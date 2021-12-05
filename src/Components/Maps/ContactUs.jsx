import React, { useState, useEffect } from "react";

export default function App() {
  return (
    <div style="width: 100%">
      <iframe
        width="100%"
        height="600"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(Home%20Health%20Care%20Territory)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
      >
        <a href="https://www.gps.ie/car-satnav-gps/">best car gps</a>
      </iframe>
    </div>
    // <div style={{ width: "100vw", height: "100vh" }}>
    //   <MapWrapped
    //     googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
    //     loadingElement={<div style={{ height: `100%` }} />}
    //     containerElement={<div style={{ height: `100%` }} />}
    //     mapElement={<div style={{ height: `100%` }} />}
    //   />
    // </div>
  );
}
