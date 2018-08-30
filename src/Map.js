import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
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
    placeData: [],
    query: ''
  };

  updatequery =(query) => {
    this.setState({query: query})
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
        alert('Failed to load map!')
        this.setState({loadSuccess: false})
      }
    };
  };

  componentDidUpdate(){
    const {locations, map, placeData, query} = this.state;
    let showingLocations = locations

    if (query) {
      const match = new RegExp(escapeRegExp(query),'i')
      showingLocations = locations.filter((location)=> match.test(location.title))
    }
    else{
      showingLocations = locations;
    }

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
  //Trigger a specific marker when the list item is clicked
  listItem = (item) => {
    let selected = newMarkers.filter((currentOne)=> currentOne.title === item.title)
    window.google.maps.event.trigger(selected[0], 'click');
  }
  // Accessibility support from https://stackoverflow.com/questions/34223558/enter-key-event-handler-on-react-bootstrap-input-component?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
  handleKeyPress(target,item,e) {
    if(item.charCode===13){
      this.listItem(target,e)
    }
  }
render(){
  const { locations, query } = this.state;
  let showingLocations;

  if (query){
    const match = new RegExp(escapeRegExp(query),'i')
    showingLocations = locations.filter((location)=> match.test(location.title))
  }
  else{
    showingLocations=locations;
  }

  showingLocations.sort(sortBy('title'))
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
                  <input
                    id="search-input"
                    type='text'
                    className="form-control"
                    placeholder='Search'
                    value={ query }
                    onChange={ (event)=> this.updatequery(event.target.value) }
                    role="search"
                    aria-labelledby="Search For a Location"
                    tabIndex="1"
                  />
                  <button className="btn btn-default"><i className="glyphicon glyphicon-search"></i></button>
                </div>
              </div>
            </form>
          </div>
        </nav>
        <main role="main" className="container-fluid">
          <section className="row">
            <div id="map" role="application" tabIndex="-1" aria-label="Good Place in Alba Iulia"></div>
              <aside className="col-md-3 col-md-offset-9 collapsed in" id="navbarSupportedContent">
                <div className="sidenav">
                  <div className="list-group" data-bind="foreach: locationList">
                  <ul tabIndex="1" area-labelledby="Locations details">
                    {showingLocations.map((getLocation, index)=>
                      <li
                        className="list-group-item list-group-item-action"
                        id={ getLocation.title }
                        onKeyPress={ this.handleKeyPress.bind(this,getLocation) }
                        onClick={ this.listItem.bind(this,getLocation) }
                        key={ index }
                        tabIndex={ index+2 }
                        area-labelledby={`View details for ${ getLocation.title }`}
                        >
                        { getLocation.title }
                      </li>
                    )}
                  </ul>
                  </div>
                </div>
              </aside>
            </section>
          </main>
        </div>
      )
  }
}

export default scriptLoader(
  ["https://maps.googleapis.com/maps/api/js?&key=AIzaSyCkeub2_Omf-LYhgiZ2Qa3KIIqVv78jc_M"]
)(Map)
