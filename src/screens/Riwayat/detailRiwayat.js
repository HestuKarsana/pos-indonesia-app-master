
import React, { Component, PropTypes } from 'react';
import { StatusBar, Alert, Platform, Dimensions } from 'react-native';
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
	InputGroup, 
	Input, 
	Picker,
	Thumbnail,
	Card, 
    CardItem,
    Toast
} from 'native-base';
import NumberFormat from 'react-number-format';
import * as api from '../../services/api';
import * as apiriwayat from '../../data/riwayat/api';
import styles from './styles';
//--> Formating date to locale ID
import moment from 'moment';
import Idlocale from 'moment/locale/id';
moment.updateLocale('id',Idlocale);
const device = Dimensions.get("window");

class detailRiwayat extends Component {
    constructor(props) {
        super(props);
        this.tryFetch = this.tryFetch.bind(this);
        this.state = {    
          loading: false, 
          result: [],
          error: null
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
        
        apiriwayat.getDetail(params.idTransaksiIpos)
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

    _renderDetail = () => {  
        const transaksiData = this.state.result
        if(Object.keys(transaksiData).length > 0){
            const fee = (transaksiData.fee === null)? 0 : parseFloat(transaksiData.fee);
            const feetax = (transaksiData.feetax === null)? 0 : parseFloat(transaksiData.feetax);
            const insurance = (transaksiData.insurance === null)? 0 : parseFloat(transaksiData.insurance);
            const insurancetax = (transaksiData.insurancetax === null)? 0 : parseFloat(transaksiData.insurancetax);
            const totalFee = Math.floor(fee + feetax + insurance + insurancetax);
            const tglTransaksi = transaksiData.transactionDate
            return (		
                <Card>
                    <CardItem bordered>
                        <Left>
                            <Text style={styles.titleTextHead}>{(transaksiData.sistem !== null) ? transaksiData.sistem.deskripsiSistem : ''}</Text>
                        </Left>
                        <Body>
                            <Text style={styles.contentTextHead}>{(transaksiData.produk !== null) ? transaksiData.produk.namaProduk : ''}</Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Text style={styles.subTitleText}>Nominal Transaksi</Text>
                        </Left>
                        <Body>
                        <NumberFormat value={Math.round(totalFee)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} renderText={value => <Text>{value}</Text>} />
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Text style={styles.subTitleText}>Kode Transaksi</Text>
                        </Left>
                        <Body>
                            <Text>{transaksiData.resi}</Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Text style={styles.subTitleText}>Tanggal</Text>
                        </Left>
                        <Body>
                            <Text>{moment(tglTransaksi).format("L LT")}</Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Text style={styles.subTitleText}>Kantor Pos</Text>
                        </Left>
                        <Body>
                            <Text>{transaksiData.receiverCity} {transaksiData.receiverZipcode}</Text>
                        </Body>
                    </CardItem>
                    {/* <CardItem>
                        <Left>
                            <Text style={styles.subTitleText}>Reward Point</Text>
                        </Left>
                        <Body>
                            <Text>{'100'}</Text>
                        </Body>
                    </CardItem>         */}
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
        return (
            <Container>        
                <Content style={{ marginTop: 5 }}>            
                    {this._renderDetail()}
                </Content>
        </Container>
        );
    }
}
export default detailRiwayat;

