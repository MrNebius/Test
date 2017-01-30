import React, { Component } from 'react'
import { withGoogleMap,GoogleMap} from "react-google-maps";

const SimpleMapExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  />
));

/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class Map extends Component {

  render() {
    console.log('rendering');
    return (
    <div className="wrap__content" style={{ height: `500px`,  width: `500px` }}>
      <span className="wrap__content-title">Map</span>
      <SimpleMapExampleGoogleMap
        containerElement={
          <div style={{ height: `100%` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
      />
    </div>
    );
  }
}