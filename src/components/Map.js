import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withGoogleMap,GoogleMap,Marker,Circle,InfoWindow} from 'react-google-maps'
const request = require('superagent');

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

class Map extends Component {
  constructor(props) {
    super(props);

    this.isUnmounted = false;

    this.state = {
      zoom: null,
      center: null,
      content: null,
      radius: 100,
      markers: []
    };
  }

  componentDidMount() {
    geolocation.getCurrentPosition((position) => {
      if (this.isUnmounted) {
        return;
      }

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
    this.isUnmounted = true;
  }

  handleMapLoad = (map) => {
    this._mapComponent = map;
    this.service = new google.maps.places.PlacesService(document.createElement('div'));
  };

  callback = (results, status) => {
    const places = [];
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        places.push({
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
    } else {
      alert('Nothing found')
    }
  };

  handleMapClick = (event) => {
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
  };

  handleMarkerRightClick = (targetMarker) => {
    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({
      markers: nextMarkers
    });
  };

  setZoom = (attr) => {
    if (attr) {
      if (this.state.zoom <= 23) {
        this.setState({
          zoom: this.state.zoom + 2
        });
      } else {
        alert('max zoom')
      }
    } else {
      if (this.state.zoom >= 0) {
        this.setState({
          zoom: this.state.zoom - 2
        });
      } else {
        alert('min zoom')
      }
    }
  };

  findButton = (attr) => {
    const currentCenter = this._mapComponent.getCenter();
    const request = {
      location: {
        lat: currentCenter.lat(),
        lng: currentCenter.lng()
      },
      radius: '500',
      type: attr
    };
    this.service.nearbySearch(request, this.callback);
  };

  getMarkers = () => {
    if (this.props.user.isAuthenticated) {
      request.get('http://localhost:8080/markers/get')
        .set('token', localStorage.token)
        .end((err, res) => {

          if (err || !res.body.success) {
            alert(res.body.message);
          } else {
            this.setState({markers: res.body.markers});
            alert(res.body.message)
          }
        })
    } else {
      alert("You need to log in");
    }
  };

  saveMarkers = () => {
    if (this.props.user.isAuthenticated) {
      request.put('http://localhost:8080/markers/save')
        .set('token', localStorage.token)
        .send({markers: this.state.markers})
        .end((err, res) => {
          if (err || !res.body.success) {
            alert(res.body.message);
          } else {
            alert(res.body.message);
          }
        });
    } else {
      alert('You need to log in');
    }
  };

  removeMarkers = () => {
    if (this.props.user.isAuthenticated) {
      request.delete('http://localhost:8080/markers/delete')
        .set('token', localStorage.token)
        .end((err, res) => {
          if (err || !res.body.success) {
            alert(res.body.message);
          } else {
            this.setState({markers: []});
            alert(res.body.message);
          }
        })
    } else {
      alert('You need to log in');
    }
  };

  render() {
    return (
      <div className="wrap__content" style={{ height: `500px`,  width: `1000px` }}>
        <span className="wrap__content-title">Map</span>
        <span className="wrap__content-selects">
          <button onClick={() => this.setZoom(false)}>
            Zoom out
          </button>
          <button onClick={() => this.setZoom(true)}>
            Zoom in
          </button>
          <button onClick={() => this.findButton('pharmacy')}>
            Near pharmacies
          </button>
          <button onClick={() => this.findButton('school')}>
            Near schools
          </button>
          <button onClick={() => this.findButton('restaurant')}>
            Near restaurants
          </button>
          <button onClick={this.getMarkers}>
            Get you markers
          </button>
          <button onClick={this.saveMarkers}>
            Save you markers
          </button>
          <button onClick={this.removeMarkers}>
            Delete you markers
          </button>
        </span>
        <StartedGoogleMap
          containerElement={
            <div style={{ height: '100%' }} />
          }
          mapElement={
            <div style={{ height: '100%' }} />
          }
          zoom={this.state.zoom}
          center={this.state.center}
          content={this.state.content}
          radius={this.state.radius}
          markers={this.state.markers}
          onMapLoad={this.handleMapLoad}
          onMapClick={this.handleMapClick}
          onMarkerRightClick={this.handleMarkerRightClick}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Map)