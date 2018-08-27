import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const locations = [
  {location: {lat: 46.070376, lng: 23.558074}}, // Enjoy Life | Caffe
  {location: {lat: 46.070566, lng: 23.558859}}, // Eis Caffe Paradis
  {location: {lat: 46.070261, lng: 23.560221}}, // Tabu Caffe
  {location: {lat: 46.070149, lng: 23.560864}}, // J'adore Caffe
  {location: {lat: 46.069727, lng: 23.563169}}, // Blue Hours | Caffe
  {location: {lat: 46.069616, lng: 23.564387}}, // Gavroche | caffe
  {location: {lat: 46.069187, lng: 23.564258}}, // Rosenthalers caffe
  {location: {lat: 46.069605, lng: 23.556503}}, // 3EST | Caffe
  {location: {lat: 46.069859, lng: 23.564517}}, // Glamour | Caffe
  {location: {lat: 46.069420, lng: 23.561488}}, // Menuet | Restaurant
  {location: {lat: 46.069475, lng: 23.564092}}, // Go In | Restaurant
  {location: {lat: 46.069096, lng: 23.564298}}, // Aloro | Restaurant
  {location: {lat: 46.070590, lng: 23.565056}}, // Remeny | Restaurant
  {location: {lat: 46.070426, lng: 23.557993}}, // Ca La Bunica | Restaurant
  {location: {lat: 46.068787, lng: 23.564320}}, // Bosfor Kebab | Fast Food
  {location: {lat: 46.070539, lng: 23.558295}}, // Panini | Fast Food
  {location: {lat: 46.069350, lng: 23.563688}}, // Dabo Doner | Fast Food
  {location: {lat: 46.069648, lng: 23.564192}}, // Broaster Chicken | Fast Food
  {location: {lat: 46.069502, lng: 23.562851}}, // Al Forno | Pizza
  {location: {lat: 46.070166, lng: 23.558851}}, // Pizza Erol
  {location: {lat: 46.069342, lng: 23.560931}} // Pizza Party
];

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
  {locations.map(marker =>  {return <Marker position={marker.location} key={marker.title} />})}
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
