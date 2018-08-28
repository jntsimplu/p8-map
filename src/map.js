import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'
import { locations } from './locations.js';

class Map extends Component {
  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        const map = new window.google.maps.Map(this.refs.map, {
          zoom: 17,
          center: {lat: 46.069923, lng: 23.561510}
        });
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach( (location) =>  {
          location.marker = new window.google.maps.Marker({
            position: location.pos,
            map: map,
            title: location.title
          });
          bounds.extend(location.pos);
        })
          map.fitBounds(bounds);
        }
      }
      else this.props.onError()
    }

  render(){
     return(
         <div>
             <div ref="map" style={{height: "500px"}}></div>
         </div>
     )
 }
}


export default scriptLoader(['https://maps.googleapis.com/maps/api/js?&key=AIzaSyCkeub2_Omf-LYhgiZ2Qa3KIIqVv78jc_M&callback=initMap'])(Map)
