import React, { Component } from 'react';
import { locations } from './locations.js';
import scriptLoader from 'react-async-script-loader'
import { styles } from './mapStyle.js';
import './App.css';
import axios from 'axios'

class App extends Component {
  state = {
    venues: [],
    placeData: []
  }

  componentDidMount() {
    this.getVenues()
  }
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?&key=AIzaSyCkeub2_Omf-LYhgiZ2Qa3KIIqVv78jc_M&callback=initMap")
    window.initMap = this.initMap
  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "WYIER5VJ5T2DHNU1HPHDAHOH0FJPTD1NKMMTUSITAHNWLD5U",
      client_secret: "2ESQLERQQSVUTVAKIWXM3PFL05RIFZMHH1F5ACIHPQI54QLS",
      query: "drinks",
      near: "Alba Iulia",
      v: "20182507"
    }
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({
        venues: response.data.response.groups[0].items
      }, this.renderMap())
    })
    .catch(error => {
      console.log("ERROR!! " + error)
    })

  }

  initMap = () => {
    const map = new window.google.maps.Map(this.refs.map, {
      zoom: 17,
      center: {lat: 46.069923, lng: 23.561510},
      styles: styles
    })

    const defaultIcon = makeMarkerIcon('0091ff');
    const highlightedIcon = makeMarkerIcon('FFFF24');
    const infowindow = new window.google.maps.InfoWindow()
    locations.forEach( (location) =>  {
      location.marker = new window.google.maps.Marker({
        position: location.pos,
        map: map,
        title: location.title,
        icon: defaultIcon
      });
      location.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      location.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });
      location.marker.addListener('click', function() {
        location.marker.addListener('click', function() {
          infowindow.setContent('<div>' + this.title + '</div>' + '<img src="https://freeiconshop.com/wp-content/uploads/edd/like-flat.png" width="50px"/>');
          infowindow.open(map, this)
        });
      });

    })
  }

  render() {
    const { venues, map, infowindow, bounds } = this.state;
    return (
      <div>
      <div ref="map" id="map"></div>
      </div>
    );
  }
}

function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

function makeMarkerIcon(markerColor) {
  var markerImage = new window.google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new window.google.maps.Size(21, 34),
    new window.google.maps.Point(0, 0),
    new window.google.maps.Point(10, 34),
    new window.google.maps.Size(21,34));
    return markerImage;
  }

  export default App;
