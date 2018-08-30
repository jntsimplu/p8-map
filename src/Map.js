import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import './App.css';
import { locations } from './locations.js';
import { styles } from './mapStyle';

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

let newMarkers = [];
let infoWindow = [];

class Map extends Component{
  state = {
    loadSuccess: true,
    map: {},
    locations: locations,
    placeData: []
  };

  componentDidMount(){
    fetch(`https://api.foursquare.com/v2/venues/explore?ll=46.069506,23.563806&client_id=WYIER5VJ5T2DHNU1HPHDAHOH0FJPTD1NKMMTUSITAHNWLD5U&client_secret=2ESQLERQQSVUTVAKIWXM3PFL05RIFZMHH1F5ACIHPQI54QLS&v=20180819`)
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
          state: item.venue.location.state
        }
      })
      return  this.updateData(newData);
    })
    .catch(error => {
      console.log("ERROR!! " + error)
    })
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        // Create map
        const map = new window.google.maps.Map(document.getElementById('map'),
        {
          zoom: 17,
          center: {lat: 46.069506, lng: 23.563806},
          styles: styles
        });
        this.setState({map:map});
      }
      else {
        this.setState({loadSuccess: false})
      }
    };
  };

  componentDidUpdate(){
    const {locations, map, placeData} = this.state;
    let showingLocations = locations

    newMarkers.forEach( (marker) => { marker.setMap(null) });

    newMarkers = [];
    infoWindow = [];

    showingLocations.forEach((marker)=> {
      let placeInfo = placeData.filter(info => info !== [] && info.venueId === marker.venueID).map(item => {
        if(placeData.length === 0) {
          return `Unknown address!`
        } else if(content !== 0) {
          const message = `<div>${item.state}</div><div>${item.address}</div>`;
          return message;
        } else {
          return `Unknown address!`
        }
      })

      let content = `<div tabIndex="0" className="infowindow"><h4>${marker.title}</h4><h6>${placeInfo}</h6></div>`
      let addInfoWindow= new window.google.maps.InfoWindow({
        content: content,
      });
      //Extend the map bound
      let bounds = new window.google.maps.LatLngBounds();
      //Create the marker
      const defaultIcon = makeMarkerIcon('e5a267');
      let addmarker = new window.google.maps.Marker({
        map: map,
        position: marker,
        title : marker.title,
        icon: defaultIcon
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
  updateData = (newData) => {
    this.setState({ placeData: newData});
  };

render(){
  return(
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <div className="navbar-brand">
                <span className="nav-title">Neighborhood Map</span>
              </div>
            </div>
              <form className="navbar-form navbar-right" role="search">
                <div className="input-group">
                  <div className="input-group-btn">
                  <button className="btn btn-default"><i className="glyphicon glyphicon-search"></i></button>
                </div>
              </div>
            </form>
          </div>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <div id="map"></div>
              <aside className="col-md-3 col-md-offset-9 collapsed in" id="navbarSupportedContent">
                <div className="sidenav">
                  <div className="list-group" data-bind="foreach: locationList">
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )
  }
}

export default scriptLoader(
  ["https://maps.googleapis.com/maps/api/js?&key=AIzaSyCkeub2_Omf-LYhgiZ2Qa3KIIqVv78jc_M"]
)(Map)
