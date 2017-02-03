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
    center={props.center}
    onClick={props.onMapClick}
    zoom={props.zoom}
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

    {props.markers.map((marker, index) =>(
      <Marker
        key={index}
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
      zoom: null,
      center: null,
      content: null,
      radius: 100,
      markers: [{
        position: {
          lat: 46.4825,
          lng: 30.7233
        },
        defaultAnimation: 2,
      }]
    };

    this.request = {
      location: null,
      radius: '500',
      type: null
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
    this.zoomButtonIn = this.zoomButtonIn.bind(this);
    this.zoomButtonOut = this.zoomButtonOut.bind(this);
    this.schoolButton = this.schoolButton.bind(this);
    this.pharmacyButton = this.pharmacyButton.bind(this);
    this.restaurantButton = this.restaurantButton.bind(this);
    this.callback = this.callback.bind(this);
  }

  componentDidMount() {
    geolocation.getCurrentPosition((position) => {
      if (this.isUnmounted) {
        return;
      }

      this.request.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.setState({
        zoom: 16,
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
        zoom: 10,
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
    //console.log(map);
    this.service = new google.maps.places.PlacesService(document.createElement('div'));
    if (map) {
      console.log(map.getZoom());
    }
  }

  callback (results, status) {
    const places =[];
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        places.push(      {
          position: {
            lat: results[i].geometry.location.lat(),
            lng: results[i].geometry.location.lng()
          },
          defaultAnimation: 2,
          icon: {
            url: results[i].icon,
            scaledSize: new google.maps.Size(25, 25)
          }
        })

      }
      this.setState({
        markers: places
      });
    }
  }

  handleMapClick(event) {
    const nextMarkers = [
      ...this.state.markers,
      {
        position: event.latLng,
        defaultAnimation: 2
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

  zoomButtonOut() {
    this.setState({
      zoom: this.state.zoom - 2
    });
  }

  zoomButtonIn() {
    this.setState({
      zoom: this.state.zoom + 2
    });
  }

  pharmacyButton() {
    this.request.type = ['pharmacy'];
    this.service.nearbySearch(this.request, this.callback);
  }

  schoolButton() {
    this.request.type = ['school'];
    this.service.nearbySearch(this.request, this.callback);
  }

  restaurantButton() {
    this.request.type = ['restaurant'];
    this.service.nearbySearch(this.request, this.callback);
  }

  render() {
    return (
      <div className="wrap__content" style={{ height: `700px`,  width: `1000px` }}>
        <span className="wrap__content-title">Map</span>
        <button onClick={this.zoomButtonOut}>
          Zoom out
        </button>
        <button onClick={this.zoomButtonIn}>
          Zoom in
        </button>
        <button onClick={this.pharmacyButton}>
          Near pharmacies
        </button>
        <button onClick={this.schoolButton}>
          Near schools
        </button>
        <button onClick={this.restaurantButton}>
          Near restaurants
        </button>
        <StartedGoogleMap
          containerElement={
            <div style={{height: '100%'}} />
          }
          mapElement={
            <div style={{height: '100%'}} />
          }
          zoom={this.state.zoom}
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
