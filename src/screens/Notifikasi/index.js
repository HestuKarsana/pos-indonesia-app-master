import React, { Component } from "react";
import { Constants } from 'expo';
import { FlatList, ActivityIndicator, Image, Dimensions, TouchableOpacity, StatusBar, ScrollView, Platform } from "react-native";
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
  List,
  ListItem,
  View,
  Input,
  Item,
  Form,
  Picker,
  Grid, Col, Row,
  Spinner,
  Toast
} from "native-base";
import Communications from 'react-native-communications';
import * as session from '../../services/session';
import * as api from '../../services/api';
import * as apinotifikasi from '../../data/notifikasi/api';
import styles from "./styles";
const device = Dimensions.get("window");
const headerbg = require("../../../assets/notifikasi_bg.png");
//--> Formating date to locale ID
const moment = require('moment');
const Idlocale = require('moment/locale/id');
moment.updateLocale('id',Idlocale);

// const resultNotfikasi = [
//     {
//         idNotifikasi: 1,
//         noresi: '70648366372',
//         tanggalTransaksi: '2018-08-21 15:25:00',
//         pengirim: 'Maman Nurjaman',
//         status: 'Dikirimkan',
//         description: 'sdg dlm proses pengiriman'
//     },
//     {
//         idNotifikasi: 2,
//         noresi: '71648365545',
//         tanggalTransaksi: '2018-08-11 17:20:00',
//         pengirim: 'Fery Farikhin',
//         status: 'Paket Telah Sampai',
//         description: 'di terima oleh Soeharto'
//     },{
//         idNotifikasi: 2,
//         noresi: '71648365545',
//         tanggalTransaksi: '2018-08-11 17:20:00',
//         pengirim: 'Fery Farikhin',
//         status: 'Paket Telah Sampai',
//         description: 'di terima oleh Soeharto'
//     },{
//         idNotifikasi: 2,
//         noresi: '71648365545',
//         tanggalTransaksi: '2018-08-11 17:20:00',
//         pengirim: 'Fery Farikhin',
//         status: 'Paket Telah Sampai',
//         description: 'di terima oleh Soeharto'
//     }
// ]
class Notifikasi extends Component {
    constructor(props) {
        super(props);
        this.makeRemoteRequest = this.makeRemoteRequest.bind(this);
        this.state = {    
          loading: false, 
          hideView: true,
          result: [],
          page: 1,            
          error: null,
          refreshing: false
        };
    }

    async componentDidMount() {
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        const { page } = this.state;
        this.setState({ loading: true });
        
        setTimeout (() => {
            apinotifikasi.get()
            .then(response => {
                if(response.data){
                    this.setState({
                        result: page === 1 ? response.data : [...this.state.result, ...response.data],
                        error: response.error || null,
                        loading: false,
                        refreshing: false
                    });		
                    // store.dispatch(pengumumanActionCreators.update(response.data));
                } else {
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
            .catch(exception => {
                // Displays only the first error message
                const error = api.exceptionExtractError(exception);
                this.setState({
                    loading: false,
                    refreshing: false,
                    ...(error ? { error } : {}),
                });
                if (!error) {
                throw exception;
                }
            });
        }, 1500);
    };

    handleRefresh = () => {
        this.setState(
        {          
            page: 1,     
            refreshing: true
        },
        () => {
            this.makeRemoteRequest();
        }
        );
    };

    renderFooter = () => {
        if (!this.state.loading) return null;
        
        return (
            <View
            style={{
                paddingVertical: 20,
                borderTopWidth: 1,
                borderColor: "#f26623"
            }}
            >
            <ActivityIndicator animating size="large" color="#f26623"/>
            </View>
        );
    };

    _renderItem = ({ item, index }) => {
 
        return (
                <ListItem key={index} button onPress={() => Communications.web('http://www.posindonesia.co.id')}>
                    <Body>
                        <Text style={{ color: '#a9d5de' }}>{item.deskripsi}</Text>
                        <Text note>
                            Pelanggan Yth.Kiriman dari {(item.pengirim).toUpperCase()}{'\n'}
                            tgl {moment(item.tanggal).format("DD-MM-YYYY")} {'\n'}
                            {item.deskripsi}
                        </Text>
                        <TouchableOpacity onPress={() => Communications.web('http://www.posindonesia.co.id')}><Text style={{fontSize:12, fontWeight:'600', color: '#56aa44'}}>No. {item.barcode}</Text></TouchableOpacity>
                        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop:5 }}>
                            <Icon name='md-time' style={{ fontSize: 14, color: '#b4b4b4'}}/>
                            <Text style={{ fontSize: 10, color: '#b4b4b4', paddingLeft: 5 }}>
                                {moment(item.tanggal).format("DD-MM-YYYY hh:mm")}
                            </Text>
                        </View> 
                    </Body>
                </ListItem>
        ); 
    };

    render() {
        return (
            <Container style={styles.container}>
            <Image source={headerbg} style={{width: device.width, height: device.height/4}} resizeMode='stretch'/>
            <Card transparent>
                <CardItem>
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', paddingVertical: device.height/4}}>
                        <Text style={styles.infoText}>Comming Soon</Text>
                    </View>
                </CardItem>
            </Card>
            </Container>
        )
     /* return (
          <Container style={styles.container}>
          <Image source={headerbg} style={{width: device.width, height: device.height/4}} resizeMode='stretch'/>
            
            {this.state.loading ? (
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
                    <FlatList
                        style={{ backgroundColor: '#FFFFFF'}}
                        data={this.state.result.sort((b, a) => a.tanggal.localeCompare(b.tanggal))}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => String(index)}
                        ListFooterComponent={this.renderFooter}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                    />    
                )
            )}
          </Container> 
        ); */
    }
}

export default Notifikasi;
