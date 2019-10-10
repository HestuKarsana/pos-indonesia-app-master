import React, { Component } from "react";
import { Constants } from 'expo';
import { Image, Dimensions, StatusBar, ScrollView, Platform, ImageBackground } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Body,
  Left,
  Right,
  Card,
  CardItem,
  View,
  Input,
  Item,
  Form,
  Picker,
  Grid, Col, Row,
  Spinner,
  Toast
} from "native-base";
import * as session from '../../services/session';
import * as sessionSelectors from '../../services/session/selectors';
import * as api from '../../services/api';
import * as apipoin from '../../data/poin/api';
import styles from "./styles";
const device = Dimensions.get("window");
const couponImage = require("../../../assets/membercard.png");
const coinPoint = require("../../../assets/coin.png");

class Poin extends Component {
    constructor(props) {
        super(props);
        this.makeRemoteRequest = this.makeRemoteRequest.bind(this);
        this.state = {    
            isLoading: false, 
            hideView: true,
            result: [],
            jumlahpoint: 0
        };
    }

    async componentDidMount() {
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        this.setState({ isLoading: true });
        setTimeout (() => {
            apipoin.get()
            .then(response => {
                this.setState({
                    isLoading: false			        
                });
                console.log('status', response.errors);			
                if(!response.errors){
                    this.setState({ result: response })
                } else {
                    this.setState({ result: [] });
                    if(response.errors) {
                    const error = api.exceptionExtractError(response); 
                    Toast.show({
                        type: 'danger',
                        position: 'bottom',
                        text: error,
                        buttonText: "OK",
                        duration:3600
                    })	
                    }
                }

            })
            .catch((exception) => {
                // Displays only the first error message
                const error = api.exceptionExtractError(exception);
                this.setState({
                    isLoading: false,
                    ...(error ? { error } : {}),
                });
                if (!error) {
                    throw exception;
                }
            });
        }, 1500);
    };

    _currencyFormat = (number) => {
        if (Platform.OS === 'ios')
            return (number).toLocaleString('id-ID');
        else
            return (number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    renderPoin = () => {
        const userLogin = (sessionSelectors.get().user) ? sessionSelectors.get().user: '';
        return (
            <Card> 
                <CardItem>
                    <ImageBackground source={couponImage} resizeMode='contain' style={styles.imagebackground}>	
                        <View style={styles.topinfo} >
                            <Text style={styles.title}>{userLogin.fullName.toUpperCase()}</Text>
                            <Text style={{ fontSize:14, color: '#FFFFFF' }}>{userLogin.idPendaftaran.toUpperCase()}</Text>
                        </View>
                    </ImageBackground>
                </CardItem>
                <CardItem> 
                    <Image source={coinPoint} style={{width: 50, height: 50 }} />
                    <Body style={{marginLeft: 20}}>
                        <View style={{width: device.width/3, height: 20}}>
                            <Text style={styles.titleText}>Poin saya</Text>
                        </View>
                        <View style={{width: device.width/3, height: 30}}>
                            <Text style={styles.poinText}>{(this.state.result[0].total === null)? this.state.jumlahpoint : this.state.result[0].total}</Text>
                        </View>
                    </Body>
                </CardItem>
            </Card>
        ); 
    };

    render() {
        

        return (
          <Container style={styles.container}>
          <StatusBar backgroundColor="#f26623" barStyle="light-content"/>
            <Header noShadow 
                    style={{ backgroundColor: "#f26623" }}
                    androidStatusBarColor="#f26623"
                    iosBarStyle="light-content"
            >
                <Body style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Title style={{ color: '#FFFFFF', fontSize:17, fontWeight: '400' }}>Reward Point</Title>
                </Body>
            </Header>
            {this.state.isLoading ? (
                <Spinner size="large" color="#f26623" /> 
            ) : (
                (!Array.isArray(this.state.result) || !this.state.result.length) ? (
                    
                    <Card transparent>
                        <CardItem>
                        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', paddingVertical: device.height/3}}>
                            <Text>Tidak ada data</Text>
                            <Button full dark transparent onPress={() => this.makeRemoteRequest()}>
                                <Text>COBA LAGI</Text>
                            </Button>
                        </View>
                        </CardItem>
                    </Card>
                   
                ) : (
                    <Content>
                    {this.renderPoin()}
                    </Content>
                )
            )}
          </Container>
        );
    }
}

export default Poin;
