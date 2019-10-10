import React, { Component } from "react";
import { TouchableOpacity, Image, Dimensions, StatusBar, ScrollView } from "react-native";
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
import Timeline from 'react-native-timeline-listview'
import { CheckBox } from 'react-native-elements'
import styles from "./styles";
import * as session from '../../services/session';
import * as api from '../../services/api';
import * as sessionSelectors from '../../services/session/selectors';
var DeviceWidth = Dimensions.get('window').width;
//--> Formating date to locale ID
var moment = require('moment');
var Idlocale = require('moment/locale/id');
moment.updateLocale('id',Idlocale);

const iconBarcode = require("../../../assets/1scan.png");

class TrackTrace extends Component {
    constructor(props) {
        super(props);
        this.onPressTraceTack = this.onPressTraceTack.bind(this)
        this.renderDetail = this.renderDetail.bind(this)
        this.state = {    
          isLoading: false, 
          error: null,
          resi: '',
          result: [],
          checked: false,
          hideView: true
        };
    }
    
    onPressTraceTack() {
        this.setState({
          isLoading: true,
          error: '',
          hideView: false
        });
        session.tracetrack(this.state.resi)
        .then((response) => {	
            this.setState({
              isLoading: false			        
            });			
            if(response.rs_tnt){
                this.setState({ result: response.rs_tnt.r_tnt });
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

    renderForm() {
        var noresi = ''
    
        if (typeof this.props.navigation.state.params != "undefined") {
            const { params } = this.props.navigation.state;
            console.log('param_resi: ',params.resi_no)
            if(noresi == ''){ 
                noresi = params.resi_no
            }
        }
        
        return (
            <Card transparent>
                <CardItem>
                    <Content>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{width:  DeviceWidth/1.2 }}>
                                <Item rounded style={{backgroundColor: '#D8D8D8' }}>
                                    <Input style={{fontSize:14, height: 35, paddingLeft: 15}} 
                                        placeholder="Masukan Nomor Resi" 
                                        autoFocus={false}
                                        returnKeyType = {"done"}	
                                        onChangeText={resi => this.setState({ resi })}
                                        value={(this.state.resi == '') ? noresi : this.state.resi}	
                                        blurOnSubmit
                                        onSubmitEditing={() => this.onPressTraceTack()}
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
        )
    }

    renderDetail(rowData, sectionID, rowID) {
        let convTanggal = moment(rowData.eventDate).format('l LT')
        let title = <Text style={[styles.title]}>{convTanggal}</Text>
        let subtitle = <Text style={[styles.subtitle]}>{rowData.eventName}</Text>
        var desc = null
        if(rowData.description){  
          desc = (
            <View style={styles.descriptionContainer}>   
              {(rowData.description.hasOwnProperty("@nil")) ? (
                null
              ) : ( 
                <Text style={[styles.textDescription]}>{rowData.description}</Text>
              )}
            </View>
          )
        }
        return (
          <View style={{flex:1}}>
            {title}
            {subtitle}
            {desc}
          </View>
        )
    }

    render() {
        const data_tnt = this.state.result

        return (
        <Container style={styles.container}>
        <StatusBar backgroundColor="#f26623" barStyle="light-content" /> 	  
        <ScrollView
                style={{ marginVertical: 5 }}
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={false}
                >
            {this.renderForm()}
            {this.state.hideView ?  
            null
            :  
            <Card transparent>
                <CardItem>
                    <Content>
                    {this.state.isLoading ? (
                            <Spinner size="large" color="#f26623" /> 
                    ) : (
                            (!Array.isArray(data_tnt) || !data_tnt.length) ? (
                                <Body style={{flex:1, justifyContent: 'center', alignItems: 'stretch'}}>
                                    <Text>Tidak ada data</Text>
                                </Body>
                            ) : (
                                <Timeline 
                                    style={styles.list}
                                    data={this.state.result.sort((b, a) => a.eventDate.localeCompare(b.eventDate))}
                                    circleSize={20}
                                    circleColor='rgb(242,102,35)'
                                    lineColor='rgb(216,216,216)'
                                    descriptionStyle={{color:'gray'}}
                                    options={{
                                        style:{paddingTop:5}
                                    }}
                                    innerCircle={'dot'}
                                    renderDetail={this.renderDetail}
                                    showTime={false}
                                    // renderFullLine={true}
                                />
                            )
                    )}
                    </Content>
                </CardItem>
            </Card>
            }
            </ScrollView>
        </Container>
        );
    }
}

export default TrackTrace;
