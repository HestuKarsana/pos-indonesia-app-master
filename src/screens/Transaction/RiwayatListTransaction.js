import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Dimensions, Platform } from "react-native";
import {
    Container,
    Content,
	Header,
	Right, 
	Left, 
	Body,
	Title,	
	Icon,
	Button,
	List,
	ListItem,
	Text,
    Spinner,
    Thumbnail,
    Card,
    CardItem,
    Toast,
} from 'native-base';
import NumberFormat from 'react-number-format';
import * as api from '../../services/api';
import * as apitransaksi from '../../data/transaksi/api';
import styles from './styles';
const device = Dimensions.get("window");
//--> Formating date to locale ID
import moment from 'moment';
import Idlocale from 'moment/locale/id';
moment.updateLocale('id',Idlocale); 

class RiwayatListTransaction extends Component {
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
            apitransaksi.getTransaction()
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
        return (
            <ListItem avatar button key={index} onPress={() => this.props.navigation.navigate('detailTransaction', { ...item })}>
                <Left style={{ width:50 }}>                
                    <Text>{moment(item.transactionDate).format("ll")}</Text>
                </Left>
                <Body>
                    <Text>{(item.produk !== null) ? item.produk.namaProduk : ''}</Text>
                    <Text note>Pengirim : {item.shipperName}, Penerima : {item.receiverName}</Text>
                    <NumberFormat value={Math.round(item.fee)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} renderText={value => <Text note>Estimasi Biaya : {value}</Text>} />
                </Body>
                <Right>													
                    <Icon name="ios-arrow-forward" style={{ color: '#000000'}} />
                </Right>
            </ListItem>
        ); 
    };

    render() {
        return (
          <Container style={styles.container}>
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
                            style={{ backgroundColor: '#FFFFFF', marginTop: 5 }}
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
export default RiwayatListTransaction;