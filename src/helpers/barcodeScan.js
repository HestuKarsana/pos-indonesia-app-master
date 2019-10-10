import React, {Component} from "react";
import { StatusBar, Vibration } from "react-native";
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
import { Permissions } from 'expo';
import QRScannerView from './QRScannerView';

// import {ImageButton, TitleBar} from "../../components/";

// import {Constants, Images, Colors} from "../../resource/";

export default class barcodeScan extends Component {
  constructor(props) {
    super(props);   
    this._handleBarCodeRead = this._handleBarCodeRead.bind(this);
    this.initialState = {     
            scanning: true,            
            hasCameraPermission: null,
            shouldReadBarCode: true,
          };
          this.state = this.initialState;
 }

    async componentWillMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({hasCameraPermission: status === 'granted'});
    }

    _handleBarCodeRead(e) {
            console.log('Barcode :',e.data);
            if (this.state.scanning) {
              
                if (e.data !== undefined) {
                    Vibration.vibrate();   
                    
                    this.setState({
                      scanning: false,
                      shouldReadBarCode: false
                    })  

                    Toast.show({
                      position: 'bottom',
                      text: e.data,
                      buttonText: "OK",
                      duration:3600
                    })
                    this.props.navigation.navigate('TrackTrace', { resi_no: e.data })	
                }
            }

    }
    
    render() {
        const { shouldReadBarCode }  = this.state;
        const { hasCameraPermission } = this.state;

        if (hasCameraPermission === null) {
          return <Text>Requesting for camera permission</Text>;
        } else if (hasCameraPermission === false) {
          return <Text>No access to camera</Text>;
        } else {

            return (
             
                  <QRScannerView
                      bottomMenuStyle={{height: 100, backgroundColor: '#393A3F', opacity: 1}}
                      hintTextPosition={120}
                      hintTextStyle={{color:'#C0C0C0'}}
                      maskColor={'#0000004D'}
                      borderWidth={0}
                      iscorneroffset={false}
                      cornerOffsetSize={0}
                      scanBarAnimateTime={3000}
                      onScanResultReceived={shouldReadBarCode ? this._handleBarCodeRead : null}

                      // renderTopBarView={() => {
                      //     return (
                      //         <TitleBar
                      //             titleColor={Colors.white_fff}
                      //             bgColor={Colors.black_393A3F}
                      //             title={Constants.string_title_wechat_scanner}
                      //             rightIcon={Images.ic_wechat_more}
                      //             leftIcon={Images.ic_wechat_back}
                      //             leftIconPress={() => this.props.navigation.goBack()}
                      //         />

                      //     )
                      // }}

                      // renderBottomMenuView={() => {
                      //     return (
                      //         <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                      //             <View style={Styles.view_bottom_menu_item}>
                      //                 <ImageButton
                      //                     style={Styles.image_bottom_menu}
                      //                     source={Images.ic_wechat_scan_hl}
                      //                 />
                      //                 <Text
                      //                     style={Styles.text_bottom_menu_item}
                      //                 >扫码</Text>
                      //             </View>

                      //             <View style={Styles.view_bottom_menu_item}>
                      //                 <ImageButton
                      //                     style={Styles.image_bottom_menu}
                      //                     source={Images.ic_wechat_scan_book}
                      //                 />
                      //                 <Text
                      //                     style={Styles.text_bottom_menu_item}
                      //                 >封面</Text>
                      //             </View>


                      //             <View style={Styles.view_bottom_menu_item}>
                      //                 <ImageButton
                      //                     style={Styles.image_bottom_menu}
                      //                     source={Images.ic_wechat_scan_street}
                      //                 />
                      //                 <Text
                      //                     style={Styles.text_bottom_menu_item}
                      //                 >街景</Text>
                      //             </View>


                      //             <View style={Styles.view_bottom_menu_item}>
                      //                 <ImageButton
                      //                     style={Styles.image_bottom_menu}
                      //                     source={Images.ic_wechat_scan_word}
                      //                 />
                      //                 <Text
                      //                     style={Styles.text_bottom_menu_item}
                      //                 >翻译</Text>
                      //             </View>

                      //         </View>
                      //     )
                      // }}
                  />
            )
        }
    }

}