import React, { Component } from "react";
import { TouchableHighlight, TouchableOpacity, StatusBar, Image, FlatList, Dimensions } from "react-native";
import { Container,
  Header,
  Body,
  Left,
  Right,
  Title,
  Content,
  Icon,
  Button,
  Text,
  Spinner,
  View,
  Grid, Col, Row,
  IconNB,
  Footer,
  FooterTab,
  Badge,
  Toast,
  Card,
  CardItem,
  Item, 
  Input,
  List,
  ListItem,
  } from "native-base";
import Modal from 'react-native-modalbox';
import Slideshow from 'react-native-slideshow';
import Communications from 'react-native-communications';
import { CheckBox } from 'react-native-elements'
import { WebBrowser, Linking } from 'expo';
import styles from "./styles";
import * as session from '../../services/session';
import * as api from '../../services/api';
import * as sessionSelectors from '../../services/session/selectors';
var DeviceWidth = Dimensions.get('window').width;

const iconCekTarif = require("../../../assets/iconmenus/cektarif.png");
const iconPengiriman = require("../../../assets/iconmenus/pengiriman.png");
const iconJemput = require("../../../assets/iconmenus/jemput.png");
const iconNotif = require("../../../assets/iconmenus/notifikasi.png");
const iconHallo = require("../../../assets/iconmenus/hallopos.png");
const iconKodePos = require("../../../assets/iconmenus/kodepos.png");
const iconPromo = require("../../../assets/iconmenus/promo.png");
const iconOffice = require("../../../assets/iconmenus/kantorpos.png");
const iconPON = require("../../../assets/iconmenus/onlinebooking.png");
const iconTransaksi = require("../../../assets/iconmenus/transaksi.png");
const iconBarcode = require("../../../assets/1scan.png");
const iconFB = require("../../../assets/iconmedsos/xfacebook.png");
const iconInstagram = require("../../../assets/iconmedsos/xinstagram.png");
const iconLine = require("../../../assets/iconmedsos/xline.png");
const iconTelegram = require("../../../assets/iconmedsos/xtelegram.png");
const iconTwitter = require("../../../assets/iconmedsos/xtwitter.png");
const iconYoutube = require("../../../assets/iconmedsos/xyoutube.png");

class Beranda extends Component {
  constructor(props) {
    super(props);
    this._onProgressMenu = this._onProgressMenu.bind(this)
    this.state = {    
      isLoading: false, 
      error: null,
      position: 1,
      interval: null,
      checked: false,
      isDisabled: false,
      jemputKiriman: '1500261',
      haloPOS: '161',
      dataSource: [
        {
          url: require('../../../assets/banner/banner_1.png')
        }, {
          url: require('../../../assets/banner/banner_2.png')
        }, {
          url: require('../../../assets/banner/banner_3.png')
        }, {
          url: require('../../../assets/banner/banner_4.png')
        }, {
          url: require('../../../assets/banner/banner_5.png')
        }, {
          url: require('../../../assets/banner/banner_6.png')
        } 
      ],
    };
  }

  componentWillMount() {
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position: this.state.position === this.state.dataSource.length ? 0 : this.state.position + 1
        });
      }, 3600)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  _onProgressMenu(){
      Toast.show({
        position: 'bottom',
        text: 'Under Development',
        buttonText: "OK"
      })	
  }

  render() {
    const session = (sessionSelectors.get().user) ? sessionSelectors.get().user: '';

    return (
      <Container>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
        />
          <View style={styles.container}>                      	
            <Content disableKBDismissScroll>
              <Slideshow 
                        dataSource={this.state.dataSource}
                        height={230}
                        position={this.state.position}
                        onPositionChanged={position => this.setState({ position })} 
                        indicatorSelectedColor={'#f26623'}
                        containerStyle={{backgroundColor:'#FFFFFF'}}
                        arrowLeft={<Icon name='ios-arrow-back' style={{color:'#f26623', fontSize: 18}}/>}
                        arrowRight={<Icon name='ios-arrow-forward' style={{color:'#f26623', fontSize: 18}}/>}
                    />
              {/*------ Trace & Track -----*/}
              <Card transparent>
                <CardItem style={{paddingTop: 2}}>
                  <Content>
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                      <Title style={{fontSize:15, fontWeight:'700', color: '#f26623', paddingVertical: 10}}>Lacak Kiriman</Title>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{width:  DeviceWidth/1.2 }}>
                            <Item rounded style={{backgroundColor: '#D8D8D8' }} onPress={() => this.props.navigation.navigate("TrackTrace")}>
                                <Input style={{fontSize:14, height: 35, paddingLeft: 15}} 
                                      placeholder="Masukan Nomor Resi" 
                                      editable={false}
                                      onTouchStart={()=> this.props.navigation.navigate("TrackTrace")}
                                />
                                <Icon active name='md-search' />
                            </Item>
                        </View>
                        <View style={{width: DeviceWidth/4 }}>
                          <TouchableOpacity style={{paddingVertical:5, paddingLeft: 5 }} onPress={() => this.props.navigation.navigate("BarcodeScan")}>
                            <Image source={iconBarcode} style={{width: 25, height: 25}} />
                          </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex:1, alignItems: 'flex-start'}}>
                        <CheckBox 
                            containerStyle={{backgroundColor: '#FFFFFF', borderWidth: 0, paddingVertical:2}}
                            textStyle={{fontSize: 12, fontWeight: '400'}}
                            title="Pencarian Kiriman WeselPos"
                            checked={this.state.checked}
                            checkedColor="#6E6E6E"
                            uncheckedColor="#6E6E6E"
                            size={16}
                            onPress={() => this.setState({ checked: !this.state.checked })}
                        />
                    </View>
                  </Content>
                </CardItem>
              </Card>
              {/*------ Display Menu -----*/}
              <Card transparent>
                <CardItem>

                  <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      backgroundColor: "#E6E6E6"}}>
                      <View>
                        <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.props.navigation.navigate("TabOnlineBooking")}>
                          <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginBottom:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconPON} style={{width: 40, height: 40}}/>
                            <Text style={styles.iconText}>Online Booking</Text>
                          </View>
                        </TouchableHighlight>
                        {/* <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.refs.menuPengiriman.open()}>
                          <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginBottom:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconPengiriman} style={{width: 40, height: 40}}/>
                            <Text style={styles.iconText}>Pengiriman</Text>
                          </View>
                        </TouchableHighlight> */}
                        <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.props.navigation.navigate("CekTarif")}>
                          <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginBottom:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconCekTarif} style={{width: 40, height: 40}}/>
                            <Text style={styles.iconText}>Cek Tarif</Text>
                          </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.props.navigation.navigate("KodePos")}>
                          <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                              <Image source={iconKodePos} style={{width: 40, height: 40}}/>
                              <Text style={styles.iconText}>Kode Pos</Text>
                          </View>
                        </TouchableHighlight>
                      </View>

                      <View>
                        {/* <TouchableHighlight underlayColor="#D8D8D8" onPress={() => Communications.phonecall(this.state.jemputKiriman, false)}> */}
                        <TouchableHighlight underlayColor="#D8D8D8" onPress={() => Linking.openURL('tel:' + this.state.jemputKiriman)}>
                          <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginBottom:1, marginLeft:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconJemput} style={{width: 50, height: 40}}/>
                            <Text style={styles.iconText}>Jemput Kiriman</Text>
                          </View>
                        </TouchableHighlight>
                        {/* <TouchableHighlight underlayColor="#D8D8D8" onPress={() => Communications.phonecall(this.state.haloPOS, false)}> */}
                        <TouchableHighlight underlayColor="#D8D8D8" onPress={() => Linking.openURL('tel:' + this.state.haloPOS)}>
                          <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginBottom:1, marginLeft:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconHallo} style={{width: 40, height: 40}}/>
                            <Text style={styles.iconText}>Hallo POS 161</Text>
                          </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.props.navigation.navigate("Pengumuman")}>
                          <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginLeft:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconPromo} style={{width: 40, height: 40}}/>
                            <Text style={styles.iconText}>Promo</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                      
                      <View>
                        <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.props.navigation.navigate("Notifikasi")}>
                          <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginBottom:1, marginLeft:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconNotif} style={{width: 40, height: 40}}/>
                            <Text style={styles.iconText}>Notifikasi</Text>
                          </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.props.navigation.navigate("Offices")}>
                          <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginBottom:1, marginLeft:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconOffice} style={{width: 40, height: 40}}/>
                            <Text style={styles.iconText}>Kantor Pos Terdekat</Text>
                          </View>
                        </TouchableHighlight>
                        <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginLeft:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} />
                      </View>    
                    </View>
                  </View>  

                </CardItem>
              </Card>
              {/*------ Icon MedSos -----*/}
              <Card transparent> 
                <CardItem>
                  <Grid style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 90
                  }}>
                  
                    <Row style={{paddingVertical: 2}}>
                        <Col style={{alignItems: 'center'}} >
                          {/* <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => WebBrowser.openBrowserAsync('https://www.facebook.com/posindonesia')} > */}
                          <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => Linking.openURL('https://www.facebook.com/posindonesia')} >
                          <View style={styles.btnContainer}>
                            <Image source={iconFB} style={{width: 30, height: 30}}/>
                          </View>
                          </TouchableHighlight>
                        </Col>  
                        <Col style={{alignItems: 'center'}} >
                          {/* <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => WebBrowser.openBrowserAsync('https://twitter.com/@PosIndonesia')} > */}
                          <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => Linking.openURL('https://twitter.com/@PosIndonesia')} >
                          <View style={styles.btnContainer}>
                            <Image source={iconTwitter} style={{width: 30, height: 30}}/>
                          </View>
                          </TouchableHighlight>
                        </Col>  
                        <Col style={{alignItems: 'center'}} >
                          {/* <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => WebBrowser.openBrowserAsync('https://www.instagram.com/posindonesia.ig/')} > */}
                          <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => Linking.openURL('https://www.instagram.com/posindonesia.ig/')} >
                          <View style={styles.btnContainer}>
                            <Image source={iconInstagram} style={{width: 30, height: 30}}/>
                          </View>
                          </TouchableHighlight>
                        </Col>  
                        <Col style={{alignItems: 'center'}} >
                          {/* <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => WebBrowser.openBrowserAsync('http://www.youtube.com/channel/UCjE1Io1gYXgGCepaXL9k57w')} > */}
                          <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => Linking.openURL('http://www.youtube.com/channel/UCjE1Io1gYXgGCepaXL9k57w')} >
                          <View style={styles.btnContainer}>
                            <Image source={iconYoutube} style={{width: 30, height: 30}}/>
                          </View>
                          </TouchableHighlight>
                        </Col>  
                    </Row>

                    <Row style={{paddingVertical: 2}}>
                        <Col style={{alignItems: 'center'}} >
                          <View style={styles.btnContainer} />
                        </Col>
                        <Col style={{alignItems: 'center'}} >
                          <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => Linking.openURL('http://line.me/ti/p/~@posindonesia')} >
                          <View style={styles.btnContainer}>
                            <Image source={iconLine} style={{width: 30, height: 30}}/>
                          </View>
                          </TouchableHighlight>
                        </Col>  
                        <Col style={{alignItems: 'center'}} >
                          {/* <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => Linking.openURL('tg://resolve?domain=posindonesia_officialbot')} > */}
                          <TouchableHighlight style={styles.touch} underlayColor="#D8D8D8" onPress={() => Linking.openURL('https://t.me/posindonesia_officialbot')} >
                          <View style={styles.btnContainer}>
                            <Image source={iconTelegram} style={{width: 30, height: 30}}/>
                          </View>
                          </TouchableHighlight>
                        </Col>  
                        <Col style={{alignItems: 'center'}} >
                          <View style={styles.btnContainer} />
                        </Col>
                    </Row>
                 
                  </Grid> 
                </CardItem>
              </Card>    
            </Content>
          </View>  

         <Modal style={[styles.modal, styles.modalMenu]} position={"center"} ref={"menuPengiriman"} isDisabled={this.state.isDisabled}>
            <View style={styles.container}>			  
              <Content style={{width:DeviceWidth/2 + 80}} scrollEnabled={false}>
                <Card transparent>
                  <CardItem>

                    <View style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        backgroundColor: "#E6E6E6"}}>
                        
                        <View>
                          <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.props.navigation.navigate("TabOnlineBooking")}>
                            <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                              <Image source={iconPON} style={{width: 40, height: 40}}/>
                              <Text style={styles.iconText}>Online Booking</Text>
                            </View>
                          </TouchableHighlight>
                        </View>
                        <View>
                          <TouchableHighlight underlayColor="#D8D8D8" onPress={() => this.props.navigation.navigate("TabTransaction")}>
                            <View style={{width: DeviceWidth*0.3, height: DeviceWidth*0.3, marginLeft:1, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                              <Image source={iconTransaksi} style={{width: 40, height: 40}}/>
                              <Text style={styles.iconText}>Transaksi</Text>
                            </View>
                          </TouchableHighlight>
                        </View>    

                      </View>
                    </View>  

                  </CardItem>
                </Card>
              </Content>
            </View>              
        </Modal>

      </Container>
    );
  }
}

export default Beranda;
