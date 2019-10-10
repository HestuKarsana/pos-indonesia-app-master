import React, { Component } from "react";
import { Image, Dimensions, ImageBackground, StatusBar, ScrollView, Platform, ListView, TouchableOpacity, TouchableHighlight, KeyboardAvoidingView } from "react-native";
import {
  Container,
  Header,
  Body,
  Left,
  Right,
  Button,
  Icon,
  Text, 
  Card,
  CardItem,
  Form,
  View,
  Label,
  Input,
  Item,
  Picker,
  Grid, Col, Row,
  Spinner,
  Toast,
  Content,
} from "native-base";
import { CheckBox } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modalbox';
import AwesomeAlert from 'react-native-awesome-alerts';
import ProgressiveInput from 'react-native-progressive-input';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import ValidationComponent from 'react-native-form-validator';
import invNum from 'invoice-number';
import md5 from'md5';
import * as api from '../../services/api';
import * as apitransaksi from '../../data/transaksi/api';
import * as apikodepos from '../../data/kodepos/api';
import * as apicektarif from '../../data/cektarif/api';
import * as apiprofile from '../../data/profile/api';
import * as sessionSelectors from '../../services/session/selectors';
import FormMessage from '../../helpers/FormMessage';
import styles from "./styles";
const device = Dimensions.get("window");
const iconLogo = require("../../../assets/pos_logo.png");
const bgImage = require("../../../assets/bgimage.png");
const iconMarker = require("../../../assets/24.png");
const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.id !== r2.id,
});
//--> Formating date to locale ID
import moment from 'moment';
import Idlocale from 'moment/locale/id';
moment.updateLocale('id',Idlocale);

class Transaction extends ValidationComponent {
    constructor(props) {
        super(props);
        this.searchShipper = this.searchShipper.bind(this);
        this.searchReceiver = this.searchReceiver.bind(this);
        this.renderRowShipper = this.renderRowShipper.bind(this);
        this.renderRowReceiver = this.renderRowReceiver.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.onInputClearedShipper = this.onInputClearedShipper.bind(this);
        this.onInputClearedReceiver = this.onInputClearedReceiver.bind(this);
        this.onPressCekTarif = this.onPressCekTarif.bind(this);
        this._formvalidate = this._formvalidate.bind(this);
        this._emaiValidate = this._emaiValidate.bind(this);
        this._resinumberGenerate = this._resinumberGenerate.bind(this);
        this._manifestnumberGenerate = this._manifestnumberGenerate.bind(this);
        this._addTransaction = this._addTransaction.bind(this);
        
        this.state = {    
           isLoading: false, 
           error: null,
           hideView: true,
           disableScroll: true,
           showClearShipperButton: false,
           showClearReceiverButton: false,
           showAlert: false,
           result: {},
           customertype: '',
           name_shipper: '',
           phone_shipper: '',
           email_shipper: '',
           address_shipper: '',
           subdistrict_shipper: '',
           city_shipper: '',
           province_shipper: '',
           zipcode_shipper: '',
           name_receiver: '',
           phone_receiver: '',
           email_receiver: '',
           address_receiver: '',
           subdistrict_receiver: '',
           city_receiver: '',
           province_receiver: '',
           zipcode_receiver: '', 
           itemtypeid:'',
           weight: '',
           length: '',
           width: '',
           height: '',
           diameterCal: '',
           valuegoods: '',
           codvalue: 0,
           dataSourceShipper: ds.cloneWithRows([]),
           dataSourceReceiver: ds.cloneWithRows([]),
           shipperzipcode: '',
           receiverzipcode: '',
           shipperzipcodevalue: '',
           receiverzipcodevalue: '',
           address: '',
           description: '',
           productid: '',
           serviceName: '',
           fee: '',
           feetax: '',
           insurance: '',
           insurancetax: '',
        };
    }

    async componentDidMount() {
        this.tryFetch();
    }
    tryFetch() {
        // Fetch profile when the scene becomes active
        if(sessionSelectors.get().user.token === null){
          // this.setState({ hasName: true })
          this.props.navigation.navigate('Login');
        }
        apiprofile.get()
        .then((response) => {		
              if(response.user){
                  this.setState({ 
                        name_shipper: response.user.fullName,
                        phone_shipper: response.user.noHP,
                        email_shipper: response.user.email,
                        address_shipper: (response.user.pelanggan.alamat.length > 0 ) ? response.user.pelanggan.alamat[0].alamat : ''
                   });
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
                    if(response.rs_postcode.r_postcode[0].city === 'NEGARA'){
                        this.onInputClearedShipper()
                    }

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
                    if(response.rs_postcode.r_postcode[0].city === 'NEGARA'){
                        this.onInputClearedReceiver()
                    }

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
          disableScroll: true,     
          shipperzipcode: prediction.address.trim(),
          shipperzipcodevalue: prediction.posCode,
          subdistrict_shipper: prediction.address.trim(),
          city_shipper: prediction.city,
          province_shipper: '-',
          zipcode_shipper: prediction.posCode,
          dataSourceShipper: ds.cloneWithRows([]),
        });
    }
    async onListItemClickedReceiver(prediction) {
        this.setState({
          disableScroll: true,     
          receiverzipcode: prediction.address.trim(),
          receiverzipcodevalue: prediction.posCode,
          subdistrict_receiver: prediction.address.trim(),
          city_receiver: prediction.city,
          province_receiver: '-',
          zipcode_receiver: prediction.posCode,
          dataSourceReceiver: ds.cloneWithRows([]),
        });
    }
    renderSeparator() {
        return <View style={styles.listItemSeparator} />;
    }
    _renderClearButtonShipper = () => {
        if (this.state.showClearShipperButton) {
            return (
            <TouchableOpacity onPress={() => this._onFocusClearedShipper()}>
                <Icon
                name='ios-close-circle'
                style={{ marginLeft: 5, fontSize: 20, color: 'lightgrey' }}
                />
            </TouchableOpacity>
            );
        }
    };
    _renderClearButtonReceiver = () => {
        if (this.state.showReceiverClearButton) {
            return (
            <TouchableOpacity onPress={() => this._onFocusClearedReceiver()}>
                <Icon
                name='ios-close-circle'
                style={{ marginLeft: 5, fontSize: 20, color: 'lightgrey' }}
                />
            </TouchableOpacity>
            );
        }
    };
    onInputClearedShipper() {
        this.setState({
          isLoading: false,
          dataSourceShipper: ds.cloneWithRows([]),
        });
    }
    onInputClearedReceiver() {
        this.setState({
          isLoading: false,
          dataSourceReceiver: ds.cloneWithRows([]),
        });
    }
    _onFocusShipper = () => {
        this.setState({ showClearShipperButton: true, disableScroll: false });
    };
    _onFocusReceiver = () => {
        this.setState({ showReceiverClearButton: true, disableScroll: false });
    };
    _onFocusClearedShipper() {
        this.setState({
          shipperzipcode: '',
          isLoading: false,
          disableScroll: true,
          dataSourceShipper: ds.cloneWithRows([]),
          showClearShipperButton: false,  
        });
    }
    _onFocusClearedReceiver() {
        this.setState({
          receiverzipcode: '',
          isLoading: false,
          disableScroll: true,
          dataSourceReceiver: ds.cloneWithRows([]),
          showReceiverClearButton: false,
        });
    }

    async onPressCekTarif() {
        dismissKeyboard();
        // Call ValidationComponent validate method
        this.validate({
            itemtypeid: {required: true},
            weight: {maxlength:9, number:true, required: true},
            // length: {maxlength:9, number:true, required: true},
            // width: {maxlength:9, number:true, required: true},
            // height: {maxlength:9, number:true, required: true},
            valuegoods: {maxlength:10, number:true, required: true} 
        })
        if(this.isFormValid()){
            this.setState({
                isLoading: true,
                error: '',
                hideView: false
            });
            const { itemtypeid, shipperzipcodevalue, receiverzipcodevalue, weight, length, width, height, valuegoods } = this.state; 
            const pItemtypeid = (itemtypeid === '')? '1' : itemtypeid;
            const pWeight = (weight === '')? 1000 : parseFloat(weight);
            let weightCal = (pWeight)
            const pLength = (length === '')? 0 : parseFloat(length);
            const pWidth = (width === '')? 0 : parseFloat(width);
            const pHeight = (height === '')? 0 : parseFloat(height);
            const diameterCal = (length * width * height)
            const pValuegoods = (valuegoods === '')? 1000 : parseFloat(valuegoods);
            //--> Check Limit Size package max <= 400
            const limitSize = Math.floor(pLength + (2*(pWidth + pHeight))) 
            //--> Check Limit Volumetric size (PxLxT)/6000
            const volumeSize = Math.floor((pLength * pWidth + pHeight) / 6000) 
            if(parseFloat(volumeSize) > pWeight){
                weightCal = volumeSize;
            }  
                const payloadData = { customerid: '', desttypeid: '1', itemtypeid: pItemtypeid, shipperzipcode: shipperzipcodevalue, receiverzipcode: receiverzipcodevalue, weight: weightCal, length: pLength, width: pWidth, height: pHeight, diameter: diameterCal, valuegoods: pValuegoods }
                apicektarif.cektarif(payloadData)
                .then((response) => {	
                    console.log('respon:', response);
                    this.setState({
                        isLoading: false			        
                    });			
                    if(response.rs_fee){
                        this.setState({ result: response.rs_fee.r_fee });
                    } else {
                        if(response.errors) {
                            const error = api.exceptionExtractError(response); 
                            Toast.show({
                            type: 'danger',
                            position: 'bottom',
                            text: error,
                            buttonText: "OK",
                            duration:7200
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
        }else{
            Toast.show({
                type: 'danger',
                position: 'bottom',
                text: this.getErrorMessages(),
                buttonText: "OK",
                duration:7200
            })	
        }
    }
    onChangeCustomertype(value) {
        this.setState({
            customertype: value
        });
    }
    onChangeItemtypeid(value) {
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
    showAlert = (item) => {
        console.log('Service : ',item); 
        this.setState({
          showAlert: true,
          productid: item.serviceCode,
          serviceName: item.serviceName,
          fee: item.fee,
          feetax: item.feeTax,
          insurance: item.insurance,
          insurancetax: item.insuranceTax,
        });
        this.refs.modalPaket.close()
    };
    hideAlert = () => {
        this.setState({
          showAlert: false
        });
        this.refs.modalPaket.open()
    };
    _formvalidate(){
        dismissKeyboard();
        // Call ValidationComponent validate method
        this.validate({
            name_shipper: {maxlength:100, required: true},
            phone_shipper: {maxlength:20, required: true},
            email_shipper: {required: true, email: true},
            address_shipper: { maxlength:120, required: true},
            city_shipper: {maxlength:100, required: true},
            zipcode_shipper: {numbers: true, required: true},
            name_receiver: {maxlength:100, required: true},
            phone_receiver: {maxlength:20, required: true},
            address_receiver: {maxlength:120, required: true},
            city_receiver: {maxlength:100, required: true},
            zipcode_receiver: {numbers: true, required: true}
        })
        
        if(this.isFormValid()){
            this.refs.modalPaket.open() 
        }else{
            Toast.show({
                type: 'danger',
                position: 'bottom',
                text: this.getErrorMessages(),
                buttonText: "OK",
                duration:7200
            })	
        }
        
    }
    _emaiValidate = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(text) === false)
        {
            Toast.show({
                type: 'danger',
                position: 'bottom',
                text: 'Email tidak valid!',
                buttonText: "OK",
                duration:3600
            })	
            this.setState({ emailvalidate:false, isLoading: false })
        }else{
            this.setState({ emailvalidate:true, isLoading: true })
        }
    }

    _resinumberGenerate = () =>  {
        //--> 1810ORAJNYUV4PP
        const currDate = moment().format("YYMM")
        return (currDate.toString(36) + 'ORA' + Date.now().toString(36)).toUpperCase()
    }
    _manifestnumberGenerate = () =>  {
        //--> 40000B2~110~40000~120~000~181000557
        // return invNum.next('40000B2~110~40000~120~000~181000560')
        return '40000B2~110~40000~120~000~'+ Date.now().toString(9).substring(4,13)
    }
    _md5SignGenerator = (uniquemainagenid, officerid, agenid, codeb2b, key) => {
        //--- Format MD5 Sign :
        //md5([uniquemainagenid]+[officerid]+[agenid]+[codeb2b]+[yyyy-mm-dd]+[key]) 
        //[289]+[orangers1001]+[40000B2]+[E2328E877]+[2018-10-13]+[p05bDu@bdj03ar4!]
        //'289oranger100140000B2E2328E8772018-11-02p05bDu@bdj03ar4!'
        const currDate = moment().format("YYYY-MM-DD")
        const combineSign = `${uniquemainagenid}${officerid}${agenid}${codeb2b}${currDate}${key}`

        return md5(combineSign)
    }

    async _addTransaction(){
        const userData = sessionSelectors.get().user //officerid
        this.hideAlert();
        this.refs.postingModal.open()
        console.log('number :', this._resinumberGenerate())
        //--> Action Save
        const { customertype, 
                name_shipper, phone_shipper, email_shipper, address_shipper, subdistrict_shipper, city_shipper, province_shipper, zipcode_shipper, 
                name_receiver, phone_receiver, email_receiver, address_receiver, subdistrict_receiver, city_receiver, province_receiver, zipcode_receiver,  
                itemtypeid, productid, serviceName, valuegoods, weight, length, width, height, codvalue, description,
                fee, feetax, insurance, insurancetax } = this.state; 
        const pItemtypeid = (itemtypeid === '')? '1' : itemtypeid; 
        const pCustomertype = (customertype === '')? '1' : customertype;
        const pWeight = (weight === '')? 1000 : parseFloat(weight);
        let weightCal = (pWeight)
        const pLength = (length === '')? 0 : parseFloat(length);
        const pWidth = (width === '')? 0 : parseFloat(width);
        const pHeight = (height === '')? 0 : parseFloat(height);
        const pValuegoods = (valuegoods === '')? 1000 : parseFloat(valuegoods);
        //--> Check Limit Size package max <= 400
        const limitSize = Math.floor(pLength + (2*(pWidth + pHeight))) 
        //--> Check Limit Volumetric size (PxLxT)/6000
        const volumeSize = Math.floor((pLength * pWidth + pHeight) / 6000) 
        if(parseFloat(volumeSize) > pWeight){
            weightCal = volumeSize;
        }  

        setTimeout (() => {  
            //-- payload data Sheet
            // const payloadSheet = {mainagenid: 'ORANGERB2B'}    
            apitransaksi.getSheetHistory()
            .then((resSheet) => {	
                console.log('resSheet:', resSheet);
                if(resSheet.data.length > 0){
                        const signCode = this._md5SignGenerator(resSheet.data[0].uniquemainagenid,'oranger1001','40000B2','E2328E877','p05bDu@bdj03ar4!')
                        //-- payload data manifest
                        const payloadManifest = {uniquemainagenid: resSheet.data[0].uniquemainagenid,manifestnumber: this._manifestnumberGenerate(),agenid: '40000B2',parentposid: '40000',officerid: 'oranger1001',sign: signCode}    
                        console.log('payloadManifest:', payloadManifest);
                        apitransaksi.createManifest(payloadManifest)
                        .then((resManifest) => {	
                            console.log('resManifest:', resManifest);
                            if(resManifest.response){
                                if(resManifest.response.respcode === '000'){
                                    //-- payload data transaction
                                    const payloadDataTransaction = {uniquemainagenid: resSheet.data[0].uniquemainagenid,officerid: 'oranger1001',transdocid: resSheet.data[0].transdocid,resi: this._resinumberGenerate(),shipper: {customertype: pCustomertype,name: name_shipper,phone: phone_shipper,address: address_shipper,city: city_shipper,subdistrict: subdistrict_shipper,zipcode: zipcode_shipper,country: 'Indonesia',optionaldesc: ''},receiver: {customertype: pCustomertype,name: name_receiver,phone: phone_receiver,address: address_receiver,city: city_receiver,subdistrict: subdistrict_receiver,zipcode: zipcode_receiver,country: 'Indonesia',optionaldesc: ''},item: {itemtypeid: pItemtypeid,productid: productid,uomload: 0,valuegoods: pValuegoods,weight: weightCal,uomvolumetric: 0,length: pLength,width: pWidth,height: pHeight,codvalue: 0},detail: {agenid: '40000B2',destoffice: zipcode_receiver,fee: fee,feetax: feetax,insurance: insurance,insurancetax: insurancetax,discount: 0,desctrans: description},processing: {uniquemanifestid: resManifest.response.transref,descmanf: ''},pin: '',sign: signCode}    
                                    console.log('payloadDataTransaction:', payloadDataTransaction);
                                    apitransaksi.addTransaction(payloadDataTransaction)
                                    .then((feedback) => {	
                                        console.log('feedback:', feedback);
                                        this.refs.postingModal.close()
                                        this.refs.modalPaket.close()
                                        
                                            if(feedback.response){
                                                if(feedback.response.respcode === '000'){
                                                    Toast.show({
                                                        type: 'success',
                                                        position: 'bottom',
                                                        text: `${feedback.response.respmsg}\n${feedback.response.transref}`,
                                                        buttonText: "OK",
                                                        duration:3600
                                                        })	
                                                    //-->redirect to detail page    
                                                    this.props.navigation.navigate('detailTransactionDirect', { transref : feedback.response.transref, serviceName: serviceName, ...payloadDataTransaction });		
                                                }else{
                                                    Toast.show({
                                                        type: 'danger',
                                                        position: 'bottom',
                                                        text: feedback.response.respmsg,
                                                        buttonText: "OK",
                                                        duration:3600
                                                        })	
                                                }
                                            } else {
                                                if(feedback.errors) {
                                                    const error = api.exceptionExtractError(feedback); 
                                                    Toast.show({
                                                    type: 'danger',
                                                    position: 'bottom',
                                                    text: error,
                                                    buttonText: "OK",
                                                    duration:3600
                                                    })	
                                                }
                                            }    
                                    });
                                }else{
                                    Toast.show({
                                        type: 'danger',
                                        position: 'bottom',
                                        text: resManifest.response.respmsg,
                                        buttonText: "OK",
                                        duration:3600
                                        })	
                                }
                            }
                        });

                } else {
                    if(resSheet.errors) {
                        const error = api.exceptionExtractError(resSheet); 
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
                    ...(error ? { error } : {}),
                });
                if (!error) {
                    throw exception;
                }
            });   

        }, 3600);
    }

    render() {
        const data_r_fee = this.state.result
        return (

        <KeyboardAvoidingView style={styles.container} behavior={'padding'} keyboardVerticalOffset={Platform.select({ios: 0, android: 130})} >
            <Content style={styles.imagebackground} scrollEnabled={this.state.disableScroll}>
            <Card style={{ marginTop: 5 }}>
				<View style={styles.formContainer}>
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>Segmentasi</Label> 
                                <View style={{ borderColor: '#666666',
                                               borderWidth: 1,
                                               borderRadius: 3,
                                               flex:1,
                                               justifyContent: 'center',
                                               alignContent: 'center',
                                               width: device.width - 25
                                            }}
                                >
                                    <Picker
                                        textStyle={{ color: "#999999", fontSize: 16 }}
                                        itemTextStyle={{ color: "#999999", fontSize: 16 }}
                                        ref="customertype"
                                        note
                                        mode="dropdown"
                                        iosHeader="Pilih Segmentasi"
                                        iosIcon={<Icon name="ios-arrow-down-outline"/>}
                                        placeholder="Pilih Segmentasi"
                                        placeholderStyle={{ color: "#999999" }}
                                        placeholderIconColor="#999999"
                                        selectedValue={this.state.customertype}
                                        onValueChange={this.onChangeCustomertype.bind(this)}
                                    >
                                        <Picker.Item label="Individu" value="1" />
                                        <Picker.Item label="e-Commerce" value="2" />
                                        <Picker.Item label="Pemerintah" value="3" />
                                        <Picker.Item label="Korporat" value="4" />
                                    </Picker>      
                                </View>   
                        </Item>
                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 14}}>Pengirim</Label> 
                        </Item>
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>Nama</Label> 
                            <Input style={styles.inputtext}
                                returnKeyType = {"next"}	
                                onChangeText={name_shipper => this.setState({ name_shipper })}
                                value={this.state.name_shipper}
                                blurOnSubmit={ true }	
                                maxLength={50}
                                ref="name_shipper"
                                onSubmitEditing ={() => {
                                    this.refs.phone_shipper._root.focus();
                                }}
                            />
                        </Item>
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>No. Telepon</Label> 
                            <Input style={styles.inputtext}
                                keyboardType={'phone-pad'}					
                                returnKeyType = {"next"}	
                                onChangeText={phone_shipper => this.setState({ phone_shipper })}
                                value={this.state.phone_shipper}
                                blurOnSubmit={ true }	
                                maxLength={15}
                                ref="phone_shipper"
                                onSubmitEditing ={() => {
                                    this.refs.email_shipper._root.focus();
                                }}
                            />
                        </Item>
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>Email</Label> 
                            <Input style={styles.inputtext}
                                returnKeyType = {"next"}	
                                onChangeText={email_shipper => this.setState({ email_shipper })}
                                value={this.state.email_shipper}
                                blurOnSubmit={ true }
                                maxLength={50}	
                                ref="email_shipper"
                                onSubmitEditing ={() => {
                                    this.refs.address_shipper._root.focus();
                                }}
                            />
                        </Item>
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>Alamat Lengkap</Label> 
                            <Input style={styles.inputtext}	
                                placeholder="Jalan No RT RW"
                                placeholderTextColor="#999999" 					
                                returnKeyType = {"next"}	
                                onChangeText={address_shipper => this.setState({ address_shipper })}
                                value={this.state.address_shipper}
                                blurOnSubmit={ true }	
                                ref="address_shipper"
                            />
                        </Item>    
                        <View style={styles.input_text}>
                            {this._renderClearButtonShipper()}
                            <ProgressiveInput
                                placeholder="Masukan Kel/Desa atau Kec. atau Kab." 
                                placeholderTextColor="#999999"  											
                                returnKeyType = {"done"}	
                                onFocus={this._onFocusShipper}
                                value={this.state.shipperzipcode}
                                isLoading={this.state.isLoading}
                                onChangeText={this.searchShipper}
                                onInputCleared={this.onInputCleared}
                                blurOnSubmit={ false }	
                            />
                            <Image source={iconMarker} style={styles.iconText}/>
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
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>Kode Pos</Label> 
                            <Input style={styles.inputtext}	
                                placeholder="Kode Pos"
                                placeholderTextColor="#999999" 					
                                returnKeyType = {"next"}	
                                onChangeText={zipcode_shipper => this.setState({ zipcode_shipper })}
                                value={this.state.zipcode_shipper.toString()}
                                blurOnSubmit={ true }	
                                maxLength={6}
                                ref="zipcode_shipper"
                            />
                        </Item>    

                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 14}}>Penerima</Label> 
                        </Item>        
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>Nama</Label> 
                            <Input style={styles.inputtext}
                                returnKeyType = {"next"}	
                                onChangeText={name_receiver => this.setState({ name_receiver })}
                                value={this.state.name_receiver}
                                blurOnSubmit={ true }
                                maxLength={50}	
                                ref="name_receiver"
                                onSubmitEditing ={() => {
                                    this.refs.phone_receiver._root.focus();
                                }}
                            />
                        </Item>
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>No. Telepon</Label> 
                            <Input style={styles.inputtext}
                                keyboardType={'phone-pad'}					
                                returnKeyType = {"next"}	
                                onChangeText={phone_receiver => this.setState({ phone_receiver })}
                                value={this.state.phone_receiver}
                                blurOnSubmit={ true }
                                maxLength={15}	
                                ref="phone_receiver"
                                onSubmitEditing ={() => {
                                    this.refs.email_receiver._root.focus();
                                }}
                            />
                        </Item>
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>Email</Label> 
                            <Input style={styles.inputtext}
                                returnKeyType = {"next"}	
                                onChangeText={email_receiver => this.setState({ email_receiver })}
                                value={this.state.email_receiver}
                                blurOnSubmit={ true }
                                maxLength={50}	
                                ref="email_receiver"
                                onSubmitEditing ={() => {
                                    this.refs.address_receiver._root.focus();
                                }}
                            />
                        </Item>
                        <Item stackedLabel style={styles.underlineDisable}>
                            <Label>Alamat Lengkap</Label> 
                            <Input style={styles.inputtext}
                                placeholder="Jalan No RT RW"
                                placeholderTextColor="#999999" 					
                                returnKeyType = {"next"}	
                                onChangeText={address_receiver => this.setState({ address_receiver })}
                                value={this.state.address_receiver}
                                blurOnSubmit={ true }	
                                ref="address_receiver"
                            />
                        </Item>    
                        <View style={styles.input_text}>
                            {this._renderClearButtonReceiver()}
                            <ProgressiveInput
                                placeholder="Masukan Kel/Desa atau Kec. atau Kab." 
                                placeholderTextColor="#999999"  											
                                returnKeyType = {"done"}		
                                onFocus={this._onFocusReceiver}
                                value={this.state.receiverzipcode}
                                isLoading={this.state.isLoading}
                                onChangeText={this.searchReceiver}
                                onInputCleared={this.onInputCleared}
                                blurOnSubmit={ false }	
                                ref="receiverzipcode"
                            />
                             <Image source={iconMarker} style={styles.iconText}/>
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
                       <Item stackedLabel style={styles.underlineDisable}>
                            <Label>Kode Pos</Label> 
                            <Input style={styles.inputtext}	
                                placeholder="Kode Pos"
                                placeholderTextColor="#999999" 					
                                returnKeyType = {"next"}	
                                onChangeText={zipcode_receiver => this.setState({ zipcode_receiver })}
                                value={this.state.zipcode_receiver.toString()}
                                blurOnSubmit={ true }	
                                maxLength={6}
                                ref="zipcode_receiver"
                            />
                        </Item>  
                        
                        <Button block
                            style={styles.btn} 
                            onPress={() => this._formvalidate()}
                        >
                            <Text>Submit</Text>
                        </Button>	   
                </View> 
            </Card>                    
            </Content>    		
        

            <Modal style={[styles.modal, styles.modalMenu]} position={"center"} ref={"modalPaket"} isDisabled={this.state.isDisabled}>
                <View style={{alignItems: 'flex-end', marginTop: 10, marginRight: 10 }}>
                    <TouchableOpacity onPress={() => this.refs.modalPaket.close()}>
                    <Icon name='ios-close-circle' style={{ fontSize: 20, color: '#000000'}}/>
                    </TouchableOpacity>
                </View>  
                <KeyboardAvoidingView style={styles.container} behavior={'padding'} keyboardVerticalOffset={Platform.select({ios: 0, android: 135})} >                                          
                    <Content>			  
                        <Card transparent>
                            <CardItem>
                                <View>
                                    
                                    <Item stackedLabel style={styles.underlineDisable}>
                                        <Label>Berat</Label> 
                                        <Input style={styles.inputtextmodal}
                                            keyboardType="numeric"								
                                            returnKeyType = {"next"}	
                                            onChangeText={weight => this.setState({ weight })}
                                            value={`${this.state.weight}`}	
                                            blurOnSubmit={ true }	
                                            maxLength={9}
                                            ref="weight"
                                            onSubmitEditing ={() => {
                                                this.refs.length._root.focus();
                                            }}
                                        />
                                    </Item>
                                    <Item stackedLabel style={styles.underlineDisable}>
                                        <Label>Kategori</Label> 
                                        <View style={{ borderColor: '#666666',
                                                        borderWidth: 1,
                                                        borderRadius: 3,
                                                        flex:1,
                                                        justifyContent: 'center',
                                                        alignContent: 'center',
                                                        width: device.width - 50
                                                    }}
                                        >
                                            <Picker
                                                textStyle={{ color: "#999999", fontSize: 16 }}
                                                itemTextStyle={{ color: "#999999", fontSize: 16 }}
                                                ref="itemtypeid"
                                                note
                                                mode="dropdown"
                                                iosHeader="Pilih Jenis Kiriman"
                                                iosIcon={<Icon name="ios-arrow-down-outline"/>}
                                                placeholder="Pilih Jenis Kiriman"
                                                placeholderStyle={{ color: "#999999" }}
                                                placeholderIconColor="#999999"
                                                selectedValue={this.state.itemtypeid}
                                                onValueChange={this.onChangeItemtypeid.bind(this)}
                                            >
                                                <Picker.Item label="Paket" value="1" />
                                                <Picker.Item label="Surat" value="0" />
                                            </Picker>   
                                        </View>      
                                    </Item>
                                    <Item stackedLabel style={styles.underlineDisable}>
                                        <Label>Dimensi Kiriman</Label> 
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{width: device.width/4 + 20, marginRight: 5 }}>
                                                <Item regular style={styles.input_text_note}>
                                                    <Input style={styles.inputtextnote}
                                                        placeholder="Panjang"
                                                        placeholderTextColor="#999999"  
                                                        keyboardType="numeric"											
                                                        returnKeyType = {"next"}	
                                                        onChangeText={length => this.setState({ length })}
                                                        value={`${this.state.length}`}	
                                                        blurOnSubmit={ false }	
                                                        maxLength={9}
                                                        ref="length"
                                                        onSubmitEditing ={() => {
                                                            this.refs.width._root.focus();
                                                        }}
                                                    />
                                                    <Text note style={{fontSize:11 }}>cm</Text>
                                                </Item>
                                            </View>
                                            <View style={{width: device.width/4 + 5, marginRight: 5 }}>
                                                <Item regular style={styles.input_text_note}>
                                                    <Input style={styles.inputtextnote}
                                                        placeholder="Lebar"
                                                        placeholderTextColor="#999999" 
                                                        keyboardType="numeric" 											
                                                        returnKeyType = {"next"}	
                                                        onChangeText={width => this.setState({ width })}
                                                        value={`${this.state.width}`}	
                                                        blurOnSubmit={ false }	
                                                        maxLength={9}
                                                        ref="width"
                                                        onSubmitEditing ={() => {
                                                            this.refs.height._root.focus();
                                                        }}
                                                    />
                                                    <Text note style={{fontSize:11}}>cm</Text>
                                                </Item>        
                                            </View>
                                            <View style={{width: device.width/4 + 5}}>
                                                <Item regular style={styles.input_text_note}>
                                                    <Input style={styles.inputtextnote}
                                                        placeholder="Tinggi"
                                                        placeholderTextColor="#999999"  
                                                        keyboardType="numeric"											
                                                        returnKeyType = {"next"}	
                                                        onChangeText={height => this.setState({ height })}
                                                        value={`${this.state.height}`}		
                                                        blurOnSubmit={ true }	
                                                        maxLength={9}
                                                        ref="height"
                                                        onSubmitEditing ={() => {
                                                            this.refs.valuegoods._root.focus();
                                                        }}
                                                    />
                                                    <Text note style={{fontSize:11}}>cm</Text>
                                                </Item>    
                                            </View>
                                        </View>
                                    </Item>
                                    <Item stackedLabel style={styles.underlineDisable}>
                                        <Label>Nilai Barang</Label> 
                                        <Input style={styles.inputtextmodal}
                                            keyboardType="numeric"											
                                            returnKeyType = {"next"}	
                                            onChangeText={valuegoods => this.setState({ valuegoods })}
                                            value={`${this.state.valuegoods}`}	
                                            blurOnSubmit={ true }	
                                            maxLength={10}
                                            ref="valuegoods"
                                            onSubmitEditing ={() => {
                                                this.refs.description._root.focus();
                                            }}
                                        />
                                    </Item>
                                    <Item stackedLabel style={styles.underlineDisable}>
                                        <Label>Keterangan Kiriman</Label> 
                                        <Input style={styles.inputtextmodal}
                                            returnKeyType = {"done"}	
                                            onChangeText={description => this.setState({ description })}
                                            value={`${this.state.description}`}	
                                            blurOnSubmit={ true }	
                                            ref="description"
                                        />
                                    </Item>
                                    
                                    <CheckBox 
                                        containerStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0, width: device.width - 68 }}
                                        textStyle={{fontSize: 10, fontWeight: '400'}}
                                        title="Saya telah membaca dan menyetujui Syarat dan Ketentuan"
                                        checked={this.state.checked}
                                        checkedColor="#6E6E6E"
                                        uncheckedColor="#6E6E6E"
                                        size={16}
                                        onPress={() => this.setState({ checked: !this.state.checked })}
                                    />
                                    {this.state.isLoading ? (
                                        <Spinner size="large" color="#f26623" /> 
                                    ) : (
                                    <Button block
                                    style={styles.btn} 
                                    onPress={() => this.onPressCekTarif()}
                                    >
                                        <Text>Cek Tarif</Text>
                                    </Button>							
                                    )}        
                                
                                </View>
                                
                            </CardItem>

                            {this.state.hideView ?  
                                null
                            :        
                            ( data_r_fee.serviceCode === 999 ) ? (        
                                    <Body style={{flex:1, justifyContent: 'center', alignItems: 'stretch', paddingVertical: 10}}>
                                        <Text>Tidak ada data</Text>
                                    </Body>
                                ) : (
                                    <CardItem>
                                    <Grid>
                                        <Row style={{paddingHorizontal: 12}}>
                                            <Col style={{alignItems: 'center'}}>
                                                <Text style={{fontSize: 14, color:'#666'}}>Pilih layanan di bawah ini:</Text>
                                            </Col>
                                        </Row>
                                        {(Array.isArray(data_r_fee)) ?
                                            data_r_fee.map( (item, index)  => (
                                            <TouchableHighlight key={index} underlayColor="#D8D8D8" onPress={() => this.showAlert(item)}>
                                            <Row style={{paddingHorizontal: 12, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#c9c9c9', borderStyle: 'dashed'}} >
                                                <Col>
                                                    <Text style={{fontSize: 14, fontWeight:'600', color:'#f26623', textAlign:'left'}}>{(item.serviceName.length == 29) ? item.serviceName.substring(0, item.serviceName.length - 11) : item.serviceName.substring(0, item.serviceName.length - 9)}</Text>
                                                </Col>
                                                <Col>
                                                    <Text style={{fontSize: 14, fontWeight:'600', color:'#f26623', textAlign:'right'}}>Rp. {this._currencyFormat(item.totalFee)}</Text>
                                                    <Text note style={{fontSize: 12, textAlign:'right'}}>Et. {(item.serviceName.length == 29) ? item.serviceName.substring(item.serviceName.length - 6, item.serviceName.length - 9) : item.serviceName.substring(item.serviceName.length - 7, item.serviceName.length - 6)} Hari</Text>
                                                </Col>
                                            </Row>
                                            </TouchableHighlight>
                                            )
                                        ):(
                                            (Object.keys(data_r_fee).length > 0) ? 
                                                <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.showAlert(data_r_fee.serviceCode)}>
                                                <Row style={{paddingHorizontal: 12, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#c9c9c9', borderStyle: 'dashed'}} key={data_r_fee.serviceCode}>
                                                    <Col>
                                                        <Text style={{fontSize: 14, fontWeight:'600', color:'#f26623', textAlign:'left'}}>{(data_r_fee.serviceName.length == 29) ? data_r_fee.serviceName.substring(0, data_r_fee.serviceName.length - 11) : data_r_fee.serviceName.substring(0, data_r_fee.serviceName.length - 9)}</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={{fontSize: 14, fontWeight:'600', color:'#f26623', textAlign:'right'}}>Rp. {this._currencyFormat(data_r_fee.totalFee)}</Text>
                                                        <Text note style={{fontSize: 12, textAlign:'right'}}>Et. {((data_r_fee.serviceName).length == 29) ? data_r_fee.serviceName.substring(data_r_fee.serviceName.length - 6, data_r_fee.serviceName.length - 9) : data_r_fee.serviceName.substring(data_r_fee.serviceName.length - 7, data_r_fee.serviceName.length - 6)} Hari</Text>
                                                    </Col>
                                                </Row>
                                                </TouchableHighlight>
                                            : 
                                                <Body style={{flex:1, justifyContent: 'center', alignItems: 'stretch', paddingVertical: 10}}>
                                                    <Text>Tidak ada data</Text>
                                                </Body>
                                        )}
                                    </Grid>                        
                                    </CardItem>
                            )}
            
                        </Card>       
                    </Content>   
                </KeyboardAvoidingView>    
            </Modal>

            <Modal style={[styles.modal, styles.postingModal]} position={"center"} ref={"postingModal"} isDisabled={this.state.isDisabled}>
            <Container style={[styles.container, { justifyContent: 'center', alignItems: 'center', }]} > 
                <Content>
                    <Spinner size="large" color="#f26623" /> 
                    <Text style={styles.text}>Processing order...</Text>
                </Content>
            </Container>    
            </Modal>

            <AwesomeAlert
                show={this.state.showAlert}
                showProgress={false}
                title=""
                message="Apakah anda yakin akan order tarif yang ini ?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Tidak"
                confirmText="Ya"
                confirmButtonColor="#f26623"
                onCancelPressed={() => {
                    this.hideAlert();
                }}
                onConfirmPressed={() => {
                    this._addTransaction();
                }}
                confirmButtonStyle={{ paddingHorizontal: 30 }}
                cancelButtonStyle={{ paddingHorizontal: 20 }}
            />

        </KeyboardAvoidingView>
        );
    }
}

export default Transaction;
