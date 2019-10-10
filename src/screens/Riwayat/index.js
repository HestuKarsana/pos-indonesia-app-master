import React, { Component } from "react";
import { Constants } from 'expo';
import { FlatList, ActivityIndicator, Image, Dimensions, StatusBar, ScrollView, Platform } from "react-native";
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
import NumberFormat from 'react-number-format';
import * as session from '../../services/session';
import * as api from '../../services/api';
import * as apiriwayat from '../../data/riwayat/api';
import styles from "./styles";
const device = Dimensions.get("window");

class Riwayat extends Component {
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
            apiriwayat.get()
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
                    this.setState({ result: [], loading: false});
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
        const fee = (item.fee === null)? 0 : parseFloat(item.fee);
        const feetax = (item.feetax === null)? 0 : parseFloat(item.feetax);
        const insurance = (item.insurance === null)? 0 : parseFloat(item.insurance);
        const insurancetax = (item.insurancetax === null)? 0 : parseFloat(item.insurancetax);
        const totalFee = Math.floor(fee + feetax + insurance + insurancetax);
        return (
            <Card key={index}>
                <CardItem bordered button onPress={() => this.props.navigation.navigate('detailRiwayat', { ...item })}>					
                    <Left style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 7}}>
                        <View style={{width: device.width/2 + 80, height: 25 }}>
                            <Text style={styles.titleText}>Jenis Layanan</Text>
                        </View>
                        <View style={{width: device.width/2 + 80, height: 25 }}>
                            <Text style={styles.productText}>{(item.produk !== null) ? item.produk.namaProduk : ''}</Text>
                        </View>
                    </Left>
                    <Right style={{flexDirection: 'row', justifyContent:'flex-end'}}>
                        <Text note>Detail </Text>
                        <Icon name="ios-arrow-forward" style={{color: '#f26623'}}/>
                    </Right>
                </CardItem>
                <CardItem> 
                    <Left>
                        <Text style={styles.subTitleText}>Nominal Transaksi</Text>
                    </Left>
                    <Right>
                    <NumberFormat value={Math.round(totalFee)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} renderText={value => <Text style={styles.nominalText}>{value}</Text>} />
                    </Right>
                </CardItem>
            </Card>
        ); 
    };

    render() {
        // if (Object.keys(this.state.result).length === 0) {
        //     return (
        //         <Spinner size="large" color="#f26623" />
        //     );
        // }
        return (
          <Container style={styles.container}>
          <StatusBar backgroundColor="#f26623" barStyle="light-content" />
            <Header noShadow 
                    style={{ backgroundColor: "#f26623" }}
                    androidStatusBarColor="#f26623"
                    iosBarStyle="light-content"
            >
                <Body style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Title style={{ color: '#FFFFFF', fontSize:17, fontWeight: '400' }}>Transaksi</Title>
                </Body>
            </Header>
            
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
                        style={{ marginTop: 5 }}
                        data={this.state.result.sort((b, a) => a.transactionDate.localeCompare(b.transactionDate))}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => String(index)}
                        ListFooterComponent={this.renderFooter}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                    />    
                )
            )}
            
          </Container>
        );
    }
}

export default Riwayat;
