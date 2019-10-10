import React, { Component } from "react";
import { Dimensions, TouchableHighlight, StatusBar, Image, Platform, Share } from "react-native";
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
import { WebBrowser, FileSystem } from 'expo';
import { NavigationActions } from 'react-navigation';
import Barcode from 'react-native-barcode-builder'
import NumberFormat from 'react-number-format';
import styles from "./styles";
import * as session from '../../services/session';
import * as sessionSelectors from '../../services/session/selectors';
import * as api from '../../services/api';
import * as apitransaksi from '../../data/transaksi/api';
const device = Dimensions.get("window");
const iconLogo = require("../../../assets/pos_indonesia_logo.png");
const onlinelogo = require("../../../assets/pon.png");
//--> Formating date to locale ID
import moment from 'moment';
import Idlocale from 'moment/locale/id';
moment.updateLocale('id',Idlocale);

class detailTransaction extends Component {
    constructor(props) {
        super(props);
        this.tryFetch = this.tryFetch.bind(this);
        this.onShareThis = this.onShareThis.bind(this);
        this._thisDownload = this._thisDownload.bind(this);
        this.state = {
        isLoading: false,
        result: [],
        hasToken: false, 
        };
    }

    async componentDidMount() {
        this.tryFetch();
    }

    tryFetch() {
      // Fetch profile when the scene becomes active
      this.setState({
        isLoading: true,
      });

      const { params } = this.props.navigation.state;
      
      apitransaksi.getDetail(params.idTransaksiIpos)
      .then((response) => {		
          this.setState({
              isLoading: false			        
            });			
            console.log('respon:', response.data[0])
            if(response.data){
                this.setState({ result: response.data[0] });
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

    onShareThis(item) {
        Share.share({
          message: `Berikut adalah No.Resi Anda.\n ${item.resi}`,
          url: 'http://posindonesia.co.id',
          title: 'POS Online Order'
        }, {
          // Android only:
          dialogTitle: 'POS Online Order',
          // iOS only:
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToTwitter'
          ]
        })
    }
    
    _thisDownload() {
        // const { params } = this.props.navigation.state;

        const downloadResumable = FileSystem.createDownloadResumable(
            'http://gahp.net/wp-content/uploads/2017/09/sample.pdf',
            FileSystem.documentDirectory + 'small.pdf'
        );
          
        downloadResumable.downloadAsync()
        .then(({ uri }) => {
            console.log('Finished downloading to ', uri);
        })
        .catch(error => {
            console.error(error);
        });

        // apitransaksi.getDetailDownload()
        // .then((response) => {
        //     console.log('aya response:',response);
        //     if(response.status === 200){
        //         Toast.show({
        //             type: 'sucess',
        //             position: 'bottom',
        //             text: 'Downloading...',
        //             buttonText: "OK",
        //             duration:3600
        //           })	
        //     } else {
        //         if(response.errors) {
        //           const error = api.exceptionExtractError(response); 
        //           Toast.show({
        //             type: 'danger',
        //             position: 'bottom',
        //             text: error,
        //             buttonText: "OK",
        //             duration:3600
        //           })	
        //         }
        //     }
        // })
        // .catch((exception) => {
        //     // Displays only the first error message
        //     const error = api.exceptionExtractError(exception);
        //     this.setState({
        //         isLoading: false,
        //         ...(error ? { error } : {}),
        //     });
        //     if (!error) {
        //         throw exception;
        //     }
        // });
    }

    renderTransaction = () => {
        const transactionData = this.state.result
        
        if(Object.keys(transactionData).length > 0){
            const tglTransaksi = transactionData.transactionDate
            return (		
                <Card transparent style={{marginTop: 5}}>
                    <View style={styles.imageContainer}>
                        <View style={styles.logoContainer}>
                            <Image source={iconLogo} style={styles.logo} resizeMode='contain'/>		
                        </View>
                        <View style={styles.logoContainerPON}>
                            <Image source={onlinelogo} style={styles.logo} resizeMode='contain'/>	
                            <Text style={{ fontSize: 14 }}>Transaksi Online</Text>	
                        </View>
                    </View>
                <CardItem>
                    <Body style={styles.centerContain}>
                        <Text style={{ fontSize: 14 }}>{moment(tglTransaksi).format("dddd, LL")}</Text>	
                        <Text style={{ fontSize: 14 }}>{moment(tglTransaksi).format("h:mm:ss")}</Text>	
                        <View style={styles.barcodeView}>
                            <Barcode value={transactionData.resi} format="CODE128"/>
                        </View>
                    </Body>    
                </CardItem>
                <CardItem>
                    <Body style={styles.centerContain}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{transactionData.resi}</Text>	
                    </Body>
                </CardItem>	
                <View style={styles.detailContainer}>
                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 16}}>Pengirim</Label> 
                        </Item>  
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Nama</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{transactionData.shipperName}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Alamat</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{transactionData.shipperAddress}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Asal</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{transactionData.shipperSubdistrict}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Telepon</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{transactionData.shipperPhone}</Label>
                        </Item> 

                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 16}}>Penerima</Label> 
                        </Item>  
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Nama</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{transactionData.receiverName}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Alamat</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{transactionData.receiverAddress}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Asal</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{transactionData.receiverSubdistrict}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Telepon</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{transactionData.receiverPhone}</Label>
                        </Item> 

                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 14}}>Kiriman</Label> 
                        </Item>  
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftTextFooter}>Layanan</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightTextFooter}>{(transactionData.produk !== null) ? transactionData.produk.namaProduk : ''}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftTextFooter}>Estimasi Biaya</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <NumberFormat value={Math.round(transactionData.fee)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} renderText={value => <Label style={styles.labelRightTextFooter}>{value}</Label>} />
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftTextFooter}>Keterangan Kiriman</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightTextFooter}>{transactionData.desctrans}</Label>
                        </Item>  
                        <Item style={[styles.underlineDisable, { paddingTop: 20, paddingBottom: 20 }]}>
                            <Label style={{ color: '#f26623', fontSize: 12}}>* Pos Order Number ini merupakan Tanda Terima Kiriman</Label> 
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
                        <Button full dark transparent onPress={() => this.tryFetch()}>
                            <Text>COBA LAGI</Text>
                        </Button>
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
        const item = this.state.result
        return (
        <Container style={styles.container}>
            <Content>
            {this.renderTransaction()}
            </Content>
            <Footer>
            <FooterTab>
                <Button onPress={() => this.onShareThis(item)}>
                <Icon name="md-share" />
                </Button>
                <Button onPress={() => this._thisDownload()}>
                <Icon name="md-download" />
                </Button>
            </FooterTab>
            </Footer>
        </Container>
        );
    }
}

export default detailTransaction;
