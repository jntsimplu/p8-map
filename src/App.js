import React, { Component } from 'react';
import Map from './map.js';
import './App.css';

import axios from 'axios'

class App extends Component {

  state = {
    venues: []
  }

  componentDidMount() {
    this.getVenues()
  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "WYIER5VJ5T2DHNU1HPHDAHOH0FJPTD1NKMMTUSITAHNWLD5U",
      client_secret: "2ESQLERQQSVUTVAKIWXM3PFL05RIFZMHH1F5ACIHPQI54QLS",
      query: "food",
      near: "Alba Iulia",
      v: "20182507"
    }
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        })
      })
      .catch(error => {
        console.log("ERROR!" + error)
      })
  }
  render() {
    return (
      <Map />
    );
  }
}

export default App;
