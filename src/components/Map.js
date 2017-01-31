import React, { Component } from 'react'
import {withGoogleMap,GoogleMap,Marker,Circle,InfoWindow} from 'react-google-maps'

const geolocation = (
  navigator.geolocation ?
    navigator.geolocation :
    ({
      getCurrentPosition(success, failure) {
        failure('Your browser doesn`t support geolocation.');
      }
    })
);

const StartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={12}
    center={props.center}
    onClick={props.onMapClick}
    //zoom={props.ZoomBottons}
  >

    {props.center && (
      <InfoWindow position={props.center}>
        <div>{props.content}</div>
        </InfoWindow>
    )}
    {props.center && (
      <Circle
        center={props.center}
        radius={props.radius}
        options={{
          fillColor: 'green',
          fillOpacity: 0.20,
          strokeColor: 'red',
          strokeOpacity: 1,
          strokeWeight: 1
        }}
      />
    )}

    {props.markers.map(marker =>(
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(marker)}
      />
    ))}
  </GoogleMap>
));

export default class Map extends Component {
  constructor (props) {
    super(props);

    this.isUnmounted = false;

    this.state = {
      center: null,
      content: null,
      radius: 50,
      markers: [{
        position: {
          lat: 46.4825,
          lng: 30.7233
        },
        key: 'Odessa',
        defaultAnimation: 2
      }]
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
  }


  componentDidMount() {
    geolocation.getCurrentPosition((position) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        content: 'I found you!'
      });
    }, (reason) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: 46.4825,
          lng: 30.7233
        },
        content: `Error: The Geolocation service failed (${reason}).`
      });
    });
  }


  componentWillUnmount() {
    this.isUnmounted=true;
  }

  handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }


  handleMapClick(event) {
    const nextMarkers = [
      ...this.state.markers,
      {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now()
      }
    ];
    this.setState({
      markers: nextMarkers
    });

  }

  handleMarkerRightClick(targetMarker) {
    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({
      markers: nextMarkers
    });
  }

  render() {
    return (
      <div className="wrap__content" style={{ height: `700px`,  width: `1000px` }}>
        <span className="wrap__content-title">Map</span>
        <button onClick={this.zoomButtons}>
          Zoom out
        </button>
        <button onClick={this.zoomButtons}>
          Zoom in
        </button>
        <StartedGoogleMap
          containerElement={
            <div style={{height: '100%'}} />
          }
          mapElement={
            <div style={{height: '100%'}} />
          }
          zoomButtons={this.state.zoomButtons}
          center={this.state.center}
          content={this.state.content}
          radius={this.state.radius}
          onMapLoad={this.handleMapLoad}
          onMapClick={this.handleMapClick}
          markers={this.state.markers}
          onMarkerRightClick={this.handleMarkerRightClick}
        />
      </div>
    );
  }
}
