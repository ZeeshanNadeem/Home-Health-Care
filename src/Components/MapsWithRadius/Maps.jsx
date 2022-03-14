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

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 33.6844,
  lng: 73.0479,
};

const options = {
  styles: mapStyles,
  disabledDefaultUI: true,
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

  // if (loadError) return "Error loading maps";
  // else if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <Search />

      {/* <Container>
        <Row className="justify-content-center">
          <Col md="auto">
            <Form>
              <Form.Group>
                <Form.Control type="text" placeholder="Enter A Radius" />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container> */}
      <LoadScript googleMapsApiKey={config.apiKey} libraries={libraries}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
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
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Maps;

function Search() {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestion,
  } = usePlacesAutocomplete({
    requestOptions: {
      loaction: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 200 * 1000,
    },
  });

  return (
    <div className="search">
      <Combobox
        onSelect={(address) => {
          console.log(address);
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Enter a radius.."
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
