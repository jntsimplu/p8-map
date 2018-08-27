import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { locations } from './locations.js';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?&key=AIzaSyCkeub2_Omf-LYhgiZ2Qa3KIIqVv78jc_M&callback=initMap",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={17}
    defaultCenter={{ lat: 46.069923, lng: 23.561510 }}
  >
  {locations.map(marker =>  {return <Marker position={marker.location} title={marker.title} key={marker.title} />})}
  </GoogleMap>
)

class App extends Component {
  render() {
    return (
      <div className="App">
        <MyMapComponent isMarkerShown />
      </div>
    );
  }
}

export default App;
