import React from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { Constants, MapView, Location, Permissions } from 'expo';   
import { Container, Content } from "native-base";
const GOOGLE_API_KEY = 'AIzaSyDSjf01IczRC2vpEt5i67Vg6y6bT4HmMO4';

class Offices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        flex: 1,
        isLoading: true,
        markers: [],
        mapRegion: { latitude: -6.8944396, longitude: 107.6347912, latitudeDelta: 0.0922, longitudeDelta:  0.0421 },
        locationResult: null,
        location: {coords: { latitude: -6.8944396, longitude: 107.6347912}},
    };
  }

  componentDidMount() {
    this._getLocationAsync();
    this.fetchMarkerData();
    setTimeout(()=>this.setState({flex: 1}),500);
  }

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location), location, });
  };

  fetchMarkerData() {
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-6.8944396,107.6347912&radius=15000&type=post_office&keyword=kantor%20pos&fields=photos,formatted_address&key=AIzaSyBRnqEc1YynRLJBpxVk-kDodTwh3foAaNE
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.location.coords.latitude},${this.state.location.coords.longitude}&radius=10000&type=post_office&keyword=kantor%20pos&key=${GOOGLE_API_KEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ 
          isLoading: false,
          markers: responseJson.results, 
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
        <Container>
           <StatusBar
            backgroundColor={'transparent'}
            translucent
          />
            <MapView
                provider="google"
                style={{flex: this.state.flex}}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                toolbarEnabled={true}
                zoomEnabled={true}
                followsUserLocation={true}
                region={{ 
                  latitude: this.state.location.coords.latitude, 
                  longitude: this.state.location.coords.longitude, 
                  latitudeDelta: this.state.mapRegion.latitudeDelta,
                  longitudeDelta: this.state.mapRegion.longitudeDelta
                }}
                // onRegionChange={this._handleMapRegionChange}
                >
                {this.state.isLoading ? null : this.state.markers.map((marker, index) => {
                const coords = {
                    latitude: marker.geometry.location.lat,
                    longitude: marker.geometry.location.lng,
                };
            
                const metadata = `${marker.vicinity}`;
            
                return (
                    <MapView.Marker
                        key={index}
                        coordinate={coords}
                        title={marker.name}
                        description={metadata}
                    />
                );
            })}
            </MapView>
        </Container>
    );
  }
  
}

export default Offices;