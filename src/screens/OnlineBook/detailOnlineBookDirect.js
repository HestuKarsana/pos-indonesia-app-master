import React, { Component } from "react";
import { Dimensions, TouchableHighlight, StatusBar, Image, Platform, Share, CameraRoll, ScrollView } from "react-native";
import {
    Container,
	Header,
	Right, 
	Left, 
	Body,
	Title,
	Content,
	Icon,
	Button,
	Text,
	Spinner,
    View,
    Label,
	Thumbnail,
	Card, 
    CardItem,
    Item,
    Footer,
    FooterTab,
    Badge,
    Toast
} from "native-base";
import Communications from 'react-native-communications';
import { WebBrowser, FileSystem, takeSnapshotAsync, ImagePicker, Permissions } from 'expo';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { NavigationActions } from 'react-navigation';
import Barcode from 'react-native-barcode-builder'
import NumberFormat from 'react-number-format';
import styles from "./styles";
import * as session from '../../services/session';
import * as sessionSelectors from '../../services/session/selectors';
import * as api from '../../services/api';
import * as apipon from '../../data/pon/api';
const device = Dimensions.get("window");
const iconLogo = require("../../../assets/pos_indonesia_logo.png");
const onlinelogo = require("../../../assets/pon.png");
//--> Formating date to locale ID
const moment = require('moment');
const Idlocale = require('moment/locale/id');
moment.updateLocale('id',Idlocale);

class detailOnlineBookDirect extends Component {
    constructor(props) {
        super(props);
        this.onShareThis = this.onShareThis.bind(this);
        this._thisDownload = this._thisDownload.bind(this);
        this.state = {
            isLoading: false,
            result: [],
            hasToken: false,
            progress: 0,
            cameraRollUri: null 
        };
    }

    onShareThis = async (item) => {
        Share.share({
          message: `Berikut adalah No.Order online booking Anda.\n ${item.params.reftrans}`,
          url: 'http://posindonesia.co.id',
          title: 'POS Online Booking'
        }, {
          // Android only:
          dialogTitle: 'POS Online Booking',
          // iOS only:
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToTwitter'
          ]
        })
    }
    
    _thisDownload = async (key, value) => {
        let result = await takeSnapshotAsync(this._container, {
            format: 'png',
            result: 'file',
        });
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // only if user allows permission to camera roll
        if (status === 'granted') {
            let saveResult = await CameraRoll.saveToCameraRoll(result, 'photo');
            this.setState({ cameraRollUri: saveResult });
        }
    
        this.setState({
            [key]: this.state[key] + value,
        });
    }
      
    _onComplete = async () => {
        // Alert.alert('Hey!', 'onComplete event fired!');   
        Toast.show({
            type: 'success',
            position: 'bottom',
            text: 'Download completed.',
            buttonText: "OK"
        })  
        this.setState({ progress: 0 });
        this.setState({ cameraRollUri: null });       
       
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // only if user allows permission to camera roll
        if (status === 'granted') {
            await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: .8, base64: true });
        }
    }

    renderOnlineBook = () => {
        const ponData = this.props.navigation.state;        
        if(Object.keys(ponData).length > 0){
            const totalFee = Math.floor(ponData.params.detail.fee + ponData.params.detail.feetax + ponData.params.detail.insurance + ponData.params.detail.insurancetax)
            return (		
                <Card transparent style={{marginTop: 5}}>
                    <View style={styles.imageContainer}>
                        <View style={styles.logoContainer}>
                            <Image source={iconLogo} style={styles.logo} resizeMode='contain'/>		
                        </View>
                        <View style={styles.logoContainerPON}>
                            <Image source={onlinelogo} style={styles.logo} resizeMode='contain'/>	
                            <Text style={{ fontSize: 14 }}>Online Booking</Text>	
                        </View>
                    </View>
                <CardItem>
                    <Body style={styles.centerContain}>
                        <Text style={{ fontSize: 14 }}>{moment().format("dddd, LL")}</Text>	
                        <Text style={{ fontSize: 14 }}>{moment().format("h:mm:ss")}</Text>	
                        <View style={styles.barcodeView}>
                            <Barcode value={ponData.params.reftrans} format="CODE128"/>
                        </View>
                    </Body>    
                </CardItem>
                <CardItem>
                    <Body style={styles.centerContain}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{ponData.params.reftrans}</Text>	
                    </Body>
                </CardItem>	
                <View style={styles.detailContainer}>
                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 16}}>Pengirim</Label> 
                        </Item>  
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Nama</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.name}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Alamat</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.address}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Asal</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.subdistrict}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Kode Pos</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.zipcode}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Telepon</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.phone}</Label>
                        </Item> 

                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 16}}>Penerima</Label> 
                        </Item>  
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Nama</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.name}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Alamat</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.address}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Asal</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.subdistrict}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Kode Pos</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.zipcode}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Telepon</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.phone}</Label>
                        </Item> 

                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 14}}>Kiriman</Label> 
                        </Item>  
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftTextFooter}>Layanan</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightTextFooter}>{ponData.params.serviceName}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftTextFooter}>Estimasi Biaya</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <NumberFormat value={Math.round(totalFee)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} renderText={value => <Label style={styles.labelRightTextFooter}>{value}</Label>} />
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftTextFooter}>Keterangan Kiriman</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightTextFooter}>{ponData.params.detail.desctrans}</Label>
                        </Item>  
                        <Item style={[styles.underlineDisable, { paddingTop: 20, paddingBottom: 20 }]}>
                            <Label style={{ color: '#f26623', fontSize: 12}}>* Pos Order Number ini bukan merupakan Tanda Terima Kiriman</Label> 
                        </Item>    
                </View>	
                </Card>
            );
        }else{
            return (
                <Card transparent>
                    <CardItem>
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', paddingVertical: device.height/3}}>
                        <Text>Tidak ada data</Text>
                    </View>
                    </CardItem>
                </Card>
            )
        }
    };
  
    render() {
        if (this.state.isLoading) {
            return (
                <Spinner size="large" color="#f26623" />
            );
        }
        const barWidth = Dimensions.get('screen').width - 30;
        const item = this.props.navigation.state;
        return (
        <Container style={styles.container}>
            {this.state.cameraRollUri &&
                <ProgressBarAnimated
                    width={barWidth}
                    value={this.state.progress}
                    onComplete={this._onComplete}
                    backgroundColor="#f26623"
                />
            }
            {/* {this.state.cameraRollUri &&
            <Image
                source={{ uri: this.state.cameraRollUri }}
                style={{ width: 200, height: 200 }}
            />} */}
            <ScrollView collapsable={false} ref={reff => { this._container = reff }}>
            {this.renderOnlineBook()}
            </ScrollView>
            <Footer>
            <FooterTab>
                <Button onPress={() => this.onShareThis(item)}>
                <Icon name="md-share" />
                </Button>
                <Button onPress={this._thisDownload.bind(this,'progress', 100)}>
                <Icon name="md-download" />
                </Button>
            </FooterTab>
            </Footer>
        </Container>
        );
    }
}

export default detailOnlineBookDirect;
