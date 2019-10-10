import React, { Component } from "react";
import { Image, Dimensions, StatusBar, ScrollView, Platform, ListView, TouchableOpacity, } from "react-native";
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
import ProgressiveInput from 'react-native-progressive-input';
import * as api from '../services/api';
import * as apikodepos from '../data/kodepos/api';
import * as apicektarif from '../data/cektarif/api';
import styles from "./styles";
const deviceWidth = Dimensions.get("window").width;
const iconStart = require("../../assets/17gps.png");
const iconEnd = require("../../assets/18pin.png");
const iconKg = require("../../assets/19weight-tool.png");
const iconRp = require("../../assets/20rp.png");
const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.id !== r2.id,
});

class AutocompleteModal extends Component {
    constructor(props) {
        super(props);
        this.searchShipper = this.searchShipper.bind(this);
        this.searchReceiver = this.searchReceiver.bind(this);
        this.renderRowShipper = this.renderRowShipper.bind(this);
        this.renderRowReceiver = this.renderRowReceiver.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.onInputCleared = this.onInputCleared.bind(this);

        // this.onPressCekTarif = this.onPressCekTarif.bind(this);
        this.state = {    
           isLoading: false, 
           error: null,
           hideView: true,
           result: [],
           itemtypeid: '',
           weight: '',
           length: '',
           width: '',
           height: '',
           diameterCal: '',
           valuegoods: '',
           dataSourceShipper: ds.cloneWithRows([]),
           dataSourceReceiver: ds.cloneWithRows([]),
           shipperzipcode: '',
           receiverzipcode: '',
           shipperzipcodevalue: '',
           receiverzipcodevalue: '',
           address: ''
        };
    }

    async searchShipper(query) {
        if(query !== ''){
            this.setState({ isLoading: true, shipperzipcode: query });
            const { address } = this.state; 
            const payloadData = { city: query, address: address }
            await apikodepos.kodepos(payloadData)
            .then( (response) => {	
                if(response.rs_postcode){
                    this.setState({
                        isLoading: false,
                        dataSourceShipper: ds.cloneWithRows(response.rs_postcode.r_postcode),
                    });

                } else {
                    this.setState({ isLoading: false });
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
        }    
    }

    async searchReceiver(query) {
        if(query !== ''){
            this.setState({ isLoading: true, receiverzipcode: query });
            const { address } = this.state; 
            const payloadData = { city: query, address: address }
            await apikodepos.kodepos(payloadData)
            .then( (response) => {	
                if(response.rs_postcode){
                    this.setState({
                        isLoading: false,
                        dataSourceReceiver: ds.cloneWithRows(response.rs_postcode.r_postcode),
                    });

                } else {
                    this.setState({ isLoading: false });
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
        }    
    }

    renderRowShipper(prediction) {
        console.log('prediction :',prediction)
        return (
          <TouchableOpacity
            onPress={() => this.onListItemClickedShipper(prediction)}
            style={styles.listItem}
          >
            <Text>{prediction.address.trim()}</Text>
          </TouchableOpacity>
        );
    }
    renderRowReceiver(prediction) {
        console.log('prediction :',prediction)
        return (
          <TouchableOpacity
            onPress={() => this.onListItemClickedReceiver(prediction)}
            style={styles.listItem}
          >
            <Text>{prediction.address.trim()}</Text>
          </TouchableOpacity>
        );
    }
    async onListItemClickedShipper(prediction) {
        this.setState({
          shipperzipcode: prediction.address.trim(),
          shipperzipcodevalue: prediction.posCode,
          dataSourceShipper: ds.cloneWithRows([]),
        });
    }
    async onListItemClickedReceiver(prediction) {
        this.setState({
          receiverzipcode: prediction.address.trim(),
          receiverzipcodevalue: prediction.posCode,
          dataSourceReceiver: ds.cloneWithRows([]),
        });
    }
    renderSeparator() {
        return <View style={styles.listItemSeparator} />;
    }
    onInputCleared() {
        this.setState({
          shipperzipcode: '',
          receiverzipcode: '',
          isLoading: false,
          dataSource: ds.cloneWithRows([]),
        });
    }

      
    onPressCekTarif() {
        this.setState({
            isLoading: true,
            error: '',
            hideView: false
        });
        const { itemtypeid, shipperzipcodevalue, receiverzipcodevalue, weight, length, width, height, valuegoods } = this.state; 
        const pItemtypeid = (itemtypeid === '')? '1' : itemtypeid;
        const pWeight = (weight === '')? 1000 : parseInt(weight);
        const weightCal = (pWeight * 1000)
        const pLength = (length === '')? 0 : parseInt(length);
        const pWidth = (width === '')? 0 : parseInt(width);
        const pHeight = (height === '')? 0 : parseInt(height);
        const diameterCal = (length * width * height)
        const pValuegoods = (valuegoods === '')? 1000 : parseInt(valuegoods);

        const payloadData = { customerid: '', desttypeid: '1', itemtypeid: pItemtypeid, shipperzipcode: shipperzipcodevalue, receiverzipcode: receiverzipcodevalue, weight: weightCal, length: pLength, width: pWidth, height: pHeight, diameter: diameterCal, valuegoods: pValuegoods }
        console.log('payload', payloadData);
        apicektarif.cektarif(payloadData)
        .then((response) => {	
            console.log('respon:', response);
            this.setState({
                isLoading: false			        
              });			
              if(response.rs_fee){
                  this.setState({ result: response.rs_fee.r_fee });
                  console.log('statedata_1:',this.state.result);
              } else {
                  this.setState({ result: [] });
                  console.log('statedata_2:',this.state.result);
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
    }
    onValueChange(value) {
        this.setState({
            itemtypeid: value
        });
    }
    _currencyFormat = (number) => {
        if (Platform.OS === 'ios')
            return (number).toLocaleString('id-ID');
        else
            return (number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
      
    render() {
        const data_r_fee = this.state.result
        return (
        <Container style={styles.container}>
        <StatusBar backgroundColor="#f26623" barStyle="light-content" />
            <ScrollView
                style={{ marginVertical: 5 }}
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={false}
                >

            <Card>
                <CardItem style={{flex:1, justifyContent: 'flex-start', alignItems: 'stretch'}}>
                    <View style={{flex:1, zIndex:1}}>
                        <View style={[styles.input_text, {marginLeft: 2}]}>
                            <Image source={iconStart} style={styles.iconText}/>
                            <ProgressiveInput
                                placeholder="Kota Asal" 
                                placeholderTextColor="#999999"  											
                                returnKeyType = {"next"}	
                                value={this.state.shipperzipcode}
                                style={styles.progressiveInput}
                                isLoading={this.state.isLoading}
                                onChangeText={this.searchShipper}
                                onInputCleared={this.onInputCleared}
                                blurOnSubmit={ false }	
                                onSubmitEditing ={() => {
                                    this.refs.receiverzipcode._root.focus();
                                }}
                            />
                        </View>  
                        <View style={styles.listViewContainerShipper}>
                            <ListView
                                enableEmptySections
                                style={styles.listView}
                                dataSource={this.state.dataSourceShipper}
                                renderRow={this.renderRowShipper}
                                renderSeparator={this.renderSeparator}
                            />
                        </View> 

                        <View style={[styles.input_text, {marginLeft: 2}]}>
                            <Image source={iconEnd} style={styles.iconText}/>
                            <ProgressiveInput
                                placeholder="Kota Tujuan" 
                                placeholderTextColor="#999999"  											
                                returnKeyType = {"next"}	
                                value={this.state.receiverzipcode}
                                style={styles.progressiveInput}
                                isLoading={this.state.isLoading}
                                onChangeText={this.searchReceiver}
                                onInputCleared={this.onInputCleared}
                                blurOnSubmit={ false }	
                                ref="receiverzipcode"
                                onSubmitEditing ={() => {
                                    this.refs.weight._root.focus();
                                }}
                            />
                        </View>  
                        <View style={styles.listViewContainerReceiver}>
                            <ListView
                                enableEmptySections
                                style={styles.listView}
                                dataSource={this.state.dataSourceReceiver}
                                renderRow={this.renderRowReceiver}
                                renderSeparator={this.renderSeparator}
                            />
                        </View> 
                        
                        <Item regular style={styles.input_text}>   
                            <Picker
                                style={{ width: deviceWidth - 20, height: 40}}
                                textStyle={{ color: "#999999" }}
                                ref="itemtypeid"
                                note
                                mode="dropdown"
                                iosHeader="Pilih Jenis Kiriman"
                                iosIcon={<Icon name="ios-arrow-down-outline"/>}
                                placeholder="Pilih Jenis Kiriman"
                                placeholderStyle={{ color: "#999999" }}
                                placeholderIconColor="#999999"
                                selectedValue={this.state.itemtypeid}
                                onValueChange={this.onValueChange.bind(this)}
                            >
                                <Picker.Item label="Paket" value="1" />
                                <Picker.Item label="Surat" value="0" />
                            </Picker>         
                        </Item>
                        <Item regular style={[styles.input_text, {height: 40}]}>
                            <Image source={iconKg} style={styles.iconText}/>
                            <Input style={[styles.inputtext, {height: 30} ]}
                                placeholder="Berat"
                                placeholderTextColor="#999999"  			
                                keyboardType="numeric"								
                                returnKeyType = {"next"}	
                                onChangeText={weight => this.setState({ weight })}
                                value={`${this.state.weight}`}	
                                blurOnSubmit={ false }	
                                ref="weight"
                                onSubmitEditing ={(event) => {
                                    this.refs.length._root.focus();
                                }}
                            />
                        </Item>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{width: deviceWidth/4 + 22, marginRight: 12 }}>
                                <Item regular style={styles.input_text_note}>
                                    <Input style={styles.inputtextnote}
                                        placeholder="Panjang"
                                        placeholderTextColor="#999999"  
                                        keyboardType="numeric"											
                                        returnKeyType = {"next"}	
                                        onChangeText={length => this.setState({ length })}
                                        value={`${this.state.length}`}	
                                        blurOnSubmit={ false }	
                                        ref="length"
                                        onSubmitEditing ={(event) => {
                                            this.refs.width._root.focus();
                                        }}
                                    />
                                    <Text note style={{fontSize:11, }}>cm</Text>
                                </Item>
                            </View>
                            <View style={{width: deviceWidth/4 + 10, marginRight: 12 }}>
                                <Item regular style={styles.input_text_note}>
                                    <Input style={styles.inputtextnote}
                                        placeholder="Lebar"
                                        placeholderTextColor="#999999" 
                                        keyboardType="numeric" 											
                                        returnKeyType = {"next"}	
                                        onChangeText={width => this.setState({ width })}
                                        value={`${this.state.width}`}	
                                        blurOnSubmit={ false }	
                                        ref="width"
                                        onSubmitEditing ={(event) => {
                                            this.refs.height._root.focus();
                                        }}
                                    />
                                    <Text note style={{fontSize:11}}>cm</Text>
                                </Item>        
                            </View>
                            <View style={{width: deviceWidth/4 + 10}}>
                                <Item regular style={styles.input_text_note}>
                                    <Input style={styles.inputtextnote}
                                        placeholder="Tinggi"
                                        placeholderTextColor="#999999"  
                                        keyboardType="numeric"											
                                        returnKeyType = {"next"}	
                                        onChangeText={height => this.setState({ height })}
                                        value={`${this.state.height}`}		
                                        blurOnSubmit={ false }	
                                        ref="height"
                                        onSubmitEditing ={(event) => {
                                            this.refs.valuegoods._root.focus();
                                        }}
                                    />
                                    <Text note style={{fontSize:11}}>cm</Text>
                                </Item>    
                            </View>
                        </View>
                        <Item regular style={styles.input_text}>
                            <Image source={iconRp} style={styles.iconText}/>
                            <Input style={styles.inputtext}
                                placeholder="Nilai Barang (Optional)"
                                placeholderTextColor="#999999"  
                                keyboardType="numeric"											
                                returnKeyType = {"done"}	
                                onChangeText={valuegoods => this.setState({ valuegoods })}
                                value={`${this.state.valuegoods}`}	
                                blurOnSubmit={ false }	
                                ref="valuegoods"
                            />
                        </Item>
                        <Button rounded block
                            style={styles.btn} 
                            onPress={() => this.onPressCekTarif()}
                        >
                            <Text>Cari</Text>
                        </Button>	
                    </View>
                       
                </CardItem>
            </Card>
            {this.state.hideView ?  
                null
            :                          
            <Card>
                {this.state.isLoading ? (
                    <Spinner size="large" color="#f26623" /> 
                ) : (
                    (!Array.isArray(data_r_fee) || !data_r_fee.length) ? (
                        <Body style={{flex:1, justifyContent: 'center', alignItems: 'stretch', paddingVertical: 10}}>
                        <Text>No data found</Text>
                        </Body>
                    ) : (
                        <CardItem>
                        <Grid>
                            <Row style={{paddingHorizontal: 12}}>
                                <Col style={{alignItems: 'center'}}>
                                    <Text style={{fontSize: 14, color:'#666'}}>Layanan</Text>
                                </Col>
                                <Col style={{alignItems: 'center'}}>
                                    <Text style={{fontSize: 14, color:'#666'}}>Tarif*</Text>
                                </Col>
                            </Row>
                            {data_r_fee.map(item => (
                            <Row style={{paddingHorizontal: 12, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#c9c9c9', borderStyle: 'dashed'}} key={item.serviceCode}>
                                <Col>
                                    <Text style={{fontSize: 14, fontWeight:'600', color:'#f26623', textAlign:'left'}}>{(item.serviceName.length == 29) ? item.serviceName.substring(0, item.serviceName.length - 11) : item.serviceName.substring(0, item.serviceName.length - 9)}</Text>
                                </Col>
                                <Col>
                                    <Text style={{fontSize: 14, fontWeight:'600', color:'#f26623', textAlign:'right'}}>Rp. {this._currencyFormat(item.totalFee)}</Text>
                                    <Text note style={{fontSize: 12, textAlign:'right'}}>Et. {(item.serviceName.length == 29) ? item.serviceName.substring(item.serviceName.length - 6, item.serviceName.length - 9) : item.serviceName.substring(item.serviceName.length - 7, item.serviceName.length - 6)} Hari</Text>
                                </Col>
                            </Row>
                            ))}
                        </Grid>                        
                        </CardItem>
                    )
                )}            
            </Card>
            }
            </ScrollView>
        </Container>
        );
    }
}

export default AutocompleteModal;
