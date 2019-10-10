import React, { Component } from "react";
import { Image, Dimensions, StatusBar, ScrollView } from "react-native";
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
import * as session from '../../services/session';
import * as api from '../../services/api';
import * as apikodepos from '../../data/kodepos/api';
import styles from "./styles";
const device = Dimensions.get("window");
const iconCity = require("../../../assets/22worldwide.png");
const iconPin = require("../../../assets/23pinbiru.png");

class KodePos extends Component {
    constructor(props) {
        super(props);
        this.onPresskodepos = this.onPresskodepos.bind(this);
        this.state = {    
          isLoading: false, 
          error: null,
          hideView: true,
          result: [],
          city: '',
          address: ''
        };
    }

    onPresskodepos() {
        this.setState({
            isLoading: true,
            error: '',
            hideView: false
        });

        const { city, address } = this.state; 

        const payloadData = { city: city, address: address }
        apikodepos.kodepos(payloadData)
        .then((response) => {	
            this.setState({
                isLoading: false			        
              });			
              if(response.rs_postcode){
                  this.setState({ result: response.rs_postcode.r_postcode });

              } else {
                  this.setState({ result: [] });
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
      
    render() {
        const data_postcode = this.state.result
        return (
        <Container style={styles.container}>

            <ScrollView
                style={{ marginVertical: 5 }}
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={false}
                >
                <Card style={{ flex:1, elevation: 2, zIndex:2 }}>
                    <CardItem>
                    <View style={styles.formContainer} >   
                        
                            <Item regular style={styles.input_text}>
                                <Image source={iconCity} style={styles.iconText}/>
                                <Input style={styles.inputtext}
                                    placeholder="Masukan Nama Kota" 
                                    placeholderTextColor="#999999"  											
                                    returnKeyType = {"done"}	
                                    onChangeText={city => this.setState({ city })}
                                    value={this.state.city}	
                                    blurOnSubmit={ false }	
                                />
                            </Item>
                            <Button rounded block
                                style={styles.btn} 
                                onPress={() => this.onPresskodepos()}
                            >
                                <Text>Cek</Text>
                            </Button>		
                    </View>
                    </CardItem>
                </Card>
                {this.state.hideView ?  
                null
                :   
                this.state.isLoading ? (
                    <Spinner size="large" color="#f26623" /> 
                ) : (
                    (!Array.isArray(data_postcode) || !data_postcode.length) ? (
                        <Card transparent>
                            <CardItem>
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', paddingVertical: device.height/3}}>
                                <Text>Tidak ada data</Text>
                                <Button full dark transparent onPress={() => this.onPresskodepos()}>
                                    <Text>COBA LAGI</Text>
                                </Button>
                            </View>
                            </CardItem>
                        </Card>
                    ) : (
                            
                            data_postcode.map((item, index) => (
                            <Card key={index} style={{ flex:1, elevation: 1, zIndex:1 }}>
                                <CardItem>
                                    <Grid>
                                        <Row style={{paddingHorizontal: 12, paddingVertical: 15}}>
                                            <Col style={{ width: 30, marginRight: 15 }}>
                                                <Image source={iconPin} style={{width: 30, height: 30}}/>
                                            </Col>
                                            <Col>
                                                <Text style={{fontSize: 14, fontWeight:'600', color:'#f26623'}}>{item.address.trim()}</Text>
                                                <Text style={{fontSize: 14, fontWeight:'600', color:'#f26623'}}>{item.city}, {item.posCode}</Text>
                                            </Col>
                                        </Row>
                                    </Grid>                        
                                </CardItem>
                            </Card>
                            ))
                    )
                )}         
            </ScrollView>
            
        </Container>
        );
    }
}

export default KodePos;
