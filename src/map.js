import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'
import { locations } from './locations.js';
import { styles } from './mapStyle.js';

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


class Map extends Component {
  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        const map = new window.google.maps.Map(this.refs.map, {
          zoom: 17,
          center: {lat: 46.069923, lng: 23.561510},
          styles: styles
        });

        const bounds = new window.google.maps.LatLngBounds();
        const infowindow = new window.google.maps.InfoWindow();
        const defaultIcon = makeMarkerIcon('0091ff');
        const highlightedIcon = makeMarkerIcon('FFFF24');

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
          bounds.extend(location.pos);

          location.marker.addListener('click', function() {
            infowindow.setContent('<div>' + this.title + '</div>' + '<img src="https://freeiconshop.com/wp-content/uploads/edd/like-flat.png" width="50px"/>');
            infowindow.open(map, this)
          })
          const panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById('pano'), {
              position: location.pos,
              pov: {
                heading: 34,
                pitch: 10
              }
            });
              map.setStreetView(panorama);
        })
          map.fitBounds(bounds);

        }
      }
      else this.props.onError()
    }
  render(){
     return(
         <div>
              <header>
                <h2>Title</h2>
              </header>
             <div ref="map" id="map"></div>
         </div>
     )
 }
}

export default scriptLoader(['https://maps.googleapis.com/maps/api/js?&key=AIzaSyCkeub2_Omf-LYhgiZ2Qa3KIIqVv78jc_M&callback=initMap'])(Map)
