import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import './App.css';
import { locations } from './locations.js';
import { styles } from './mapStyle';

let newMarkers = [];
let infoWindow = [];
class App extends Component{
  state = {
    venues: [],
    loadSuccess: true,
    map: {},
    locations: locations,
    placeData: []
  };

  updateData = (newData) => {
    this.setState({ placeData: newData});
  };
  componentWillReceiveProps({isScriptLoadSucceed}){
    // Error handler for script
    if (isScriptLoadSucceed) {
      // Create map
      const map = new window.google.maps.Map(document.getElementById('map'),
      {
        zoom: 17,
        center: {lat: 46.069923, lng: 23.561510},
        styles: styles
      });
      this.setState({map:map});
    }
    else {
      // Error message
      console.log("Google map failed to load!");
      this.setState({loadSuccess: false})
    }
  };

  componentDidUpdate(){
    const {locations, map, placeData} = this.state;
    let showingLocations = locations

    newMarkers.forEach( (marker) => { marker.setMap(null) });

    newMarkers = [];
    infoWindow = [];
    showingLocations.map((marker)=> {


      let placeInfo = placeData.filter(info => info !== [] && info.venueId === marker.venueID).map(item => {
        if(placeData.length === 0) {
          return `No information found about this place!`
        } else if(content !== 0) {
          const message =
          `<div>${item.state}</div>
          <div>${item.address}</div>`;

          return message;
        } else {
          return `No information found about this place!`
        }
      })


      let content =
      `<div tabIndex="0" class="infowindow">
      <h4>${marker.title}</h4>
      <p>${placeInfo}</p>
      </div>`

      let addInfoWindow= new window.google.maps.InfoWindow({
        content: content,
      });
      //Extend the map bound
      let bounds = new window.google.maps.LatLngBounds();
      //Create the marker
      let addmarker = new window.google.maps.Marker({
        map: map,
        position: marker,
        title : marker.title
      });
      //Add the marker to the list of marker
      newMarkers.push(addmarker);
      infoWindow.push(addInfoWindow);
      addmarker.addListener('click', function() {
        //Close windows before open the another
        infoWindow.forEach(info => { info.close() });
        addInfoWindow.open(map, addmarker);
      })
      //Bounds
      newMarkers.forEach((m)=>
      bounds.extend(m.position))
      map.fitBounds(bounds)
    })
  }


  componentDidMount(){
    const clientID = `WYIER5VJ5T2DHNU1HPHDAHOH0FJPTD1NKMMTUSITAHNWLD5U`;
    const clientSecret = `2ESQLERQQSVUTVAKIWXM3PFL05RIFZMHH1F5ACIHPQI54QLS`;

    const url = `https://api.foursquare.com/v2/venues/explore?ll=46.069923,23.561510&client_id=${clientID}&client_secret=${clientSecret}&v=20180819`

    fetch(url)
    .then(data => {
      if(data.ok) {
        return data.json();
      } else {
        alert('Failed to get data from Foursquare' + new Error(data.statusText))
      }
    })
    .then(data => {
      const newData = data.response.groups[0].items.map(item => {
        return {
          position: { lat: item.venue.location.lat, lng: item.venue.location.lng },
          title: item.venue.name,
          venueId: item.venue.id,
          address: item.venue.location.formattedAddress[0],
          state: item.venue.location.state,
        }
      })
      return  this.updateData(newData);
    })
    .catch(error => {
      console.log("ERROR!! " + error)
    })
  }

  render(){
    const { venues } = this.state;
    return(
      <div>
      <div id="map"></div>
      </div>
    )
  }
}

export default scriptLoader(
  ["https://maps.googleapis.com/maps/api/js?&key=AIzaSyCkeub2_Omf-LYhgiZ2Qa3KIIqVv78jc_M&callback=initMap"]
)(App)
