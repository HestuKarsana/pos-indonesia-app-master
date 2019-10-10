import React, { Component } from "react";
import { TouchableOpacity, StatusBar, ImageBackground, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import {
  Container,
	Header,
	Right, 
	Left, 
    Body,
    Picker,
	Button,
    Item,
    Label,
    Input,
	Content,
	Icon,
	Text,
	Spinner,
    View,
	Thumbnail,
	Card, 
  CardItem,
  Footer,
  FooterTab,
  Badge,
  Toast
} from "native-base";
import Communications from 'react-native-communications';
import { WebBrowser } from 'expo';
import { NavigationActions } from 'react-navigation';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import DateTimePicker from "react-native-modal-datetime-picker";
import styles from "./styles";
import * as session from '../../services/session';
import * as sessionSelectors from '../../services/session/selectors';
import * as api from '../../services/api';
import * as apiprofile from '../../data/profile/api';
import * as profileSelectors from '../../data/profile/selectors';
const device = Dimensions.get("window");
const nopicture = 'https://afcm.ca/wp-content/uploads/2018/06/no-photo.png';
const bgImage = require("../../../assets/bg_image.png");
 //--> Formating date to locale ID
 const moment = require('moment');
 const Idlocale = require('moment/locale/id');
 moment.updateLocale('id',Idlocale);

class editProfile extends Component {
  constructor(props) {
    super(props);
    this.onUpdateProfile = this.onUpdateProfile.bind(this);
    this.state = {
      Loading: false,
      isLoading: false,
      haloPOS: '161', 
      hasToken: false, 
      isDateTimePickerVisible: false,
      fullName: '',
      noHP: '',
      email: '',
      gender: '',
      tempatLahir: '',
      tanggalLahir: '',
      tgllahirval: '',
      nomorKartu: '', 
      alamat: '' 
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
      
      if(sessionSelectors.get().user.token === null){
        // this.setState({ hasName: true })
        this.props.navigation.navigate('Login');
      }
      apiprofile.get()
      .then((response) => {		
          this.setState({
              isLoading: false			        
            });			
            if(response.user){
                this.setState({ 
                    fullName: response.user.fullName,
                    noHP: response.user.noHP,
                    email: response.user.email,
                    gender: (response.user.pelanggan.gender !== null) ? response.user.pelanggan.gender : '',
                    tempatLahir: (response.user.pelanggan.tempatLahir !== null) ? response.user.pelanggan.tempatLahir : '',
                    tanggalLahir: (response.user.pelanggan.tanggalLahir !== null) ? moment(response.user.pelanggan.tanggalLahir).format("LL") : moment().format("LL"),
                    tgllahirval: (response.user.pelanggan.tanggalLahir !== null) ? moment(response.user.pelanggan.tanggalLahir).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
                    nomorKartu: (response.user.pelanggan.kartuIdentitas.length > 0 ) ? response.user.pelanggan.kartuIdentitas[0].nomorKartu : '',
                    alamat: (response.user.pelanggan.alamat.length > 0 ) ? response.user.pelanggan.alamat[0].alamat : ''
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
    
    onUpdateProfile() {
        dismissKeyboard();
        this.setState({
            Loading: true,
            error: '',
        });

        const { fullName, noHP, email, gender, tempatLahir, tgllahirval, nomorKartu, alamat } = this.state; 
        const pGender = (gender === '')? 'L' : gender; 
        const ptanggalLahir = moment(tgllahirval).format("YYYY-MM-DD");
        const updateDataProfile = {user:{email: email,fullName: fullName,noHp: noHP,timezone: 'ID',language: 'ID',userType: '1',pelanggan:{tempatLahir: tempatLahir,tanggalLahir: ptanggalLahir,gender: pGender,imageProfile: nopicture,alamat:[{alamat: alamat,statusAlamat: '1',negara: 'ID',kabupatenKota: 'null',kecamatan: 'null',kelurahan: 'null',propinsi: 'null',kodepos: 'null ',telepon: noHP}],kartuIdentitas:[{jenisKartu: 'KTP',nomorKartu: nomorKartu,tanggalBerakhir: '2100-08-03'}]}}}
        console.log('PAYLOAD:', updateDataProfile);
        setTimeout (() => {    
            apiprofile.updateProfile(updateDataProfile)
            .then((feedback) => {	
                this.setState({
                    Loading: false,
                    error: '',
                });
                if(feedback.user){
                        Toast.show({
                            type: 'success',
                            position: 'bottom',
                            text: 'Akun berhasil di ubah',
                            buttonText: "OK",
                            duration:3600
                            })	
                        //-->redirect to detail page    
                        this.props.navigation.navigate('Akun');	
                    
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

    onChangeGender(value) {
        this.setState({
            gender: value
        });
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = date => {
        this.setState({ tanggalLahir: moment(date).format("LL"), tgllahirval: date });
        this._hideDateTimePicker();
    };
    render() {
        if (this.state.isLoading) {
            return (
                <Spinner size="large" color="#f26623" />
            );
        }
        const { isDateTimePickerVisible } = this.state;
            return (
                <KeyboardAvoidingView style={styles.container} behavior={'padding'} keyboardVerticalOffset={Platform.select({ios: 0, android: 80})} >  
                    <Content style={styles.container}>
                        {/* <Card transparent style={{marginTop: 5}}>
                        <CardItem header>
                            <Right>
                                <Button transparent style={{ paddingHorizontal:20, paddingVertical:10 }} onPress={() => this.props.navigation.navigate("changePassword")}>
                                    <Text style={{color: '#f26623', fontWeight: '400', fontSize: 16}}>Ubah Password</Text>	
                                    <Icon name='md-create' style={{color: '#6E6E6E', fontSize:20 }}/>
                                </Button>
                            </Right>
                        </CardItem>	
                        </Card> */}
                        <Card transparent style={{marginTop: 5}}>
                            <View style={styles.formContainer}>
                                <Item stackedLabel>
                                    <Label>Nama</Label>				
                                    <Input style={styles.inputtext}		
                                            placeholder="Nama"
                                            placeholderTextColor="rgba(0,0,0,0.3)"								
                                            returnKeyType = {"next"}	
                                            onChangeText={fullName => this.setState({ fullName })}
                                            value={this.state.fullName}	
                                            blurOnSubmit={ true }
                                            maxLength={50}	
                                            onSubmitEditing ={(event) => {
                                                this.refs.noHP._root.focus();
                                            }}
                                        />          
                                </Item>	
                                <Item stackedLabel>
                                    <Label>No. HP</Label>				
                                    <Input style={styles.inputtext}		
                                            placeholder="No.HP"
                                            placeholderTextColor="rgba(0,0,0,0.3)"								
                                            returnKeyType = {"next"}	
                                            keyboardType={'phone-pad'}			
                                            onChangeText={noHP => this.setState({ noHP })}
                                            value={this.state.noHP}	
                                            blurOnSubmit={ true }
                                            maxLength={15}	
                                            ref="noHP"
                                            onSubmitEditing ={(event) => {
                                                this.refs.email._root.focus();
                                            }}
                                        />          
                                </Item>		
                                <Item stackedLabel>
                                    <Label>Email</Label>
                                    <Input style={styles.inputtext}	
                                            placeholder="Email"
                                            placeholderTextColor="rgba(0,0,0,0.3)"									
                                            returnKeyType = {"next"}	
                                            onChangeText={email => this.setState({ email })}
                                            value={this.state.email}	
                                            blurOnSubmit={ true }
                                            maxLength={50}	
                                            ref="email"
                                            onSubmitEditing ={(event) => {
                                                this.refs.gender._root.focus();
                                            }}
                                        />      					
                                </Item>		
                                <Item stackedLabel>
                                    <Label>Jenis Kelamin</Label>	
                                        <View style={{ 
                                                flex:1,
                                                justifyContent: 'center',
                                                alignContent: 'center',
                                                width: device.width - 25
                                                }}
                                        >
                                            <Picker
                                                textStyle={{ color: "#999999", fontSize: 16 }}
                                                itemTextStyle={{ color: "#999999", fontSize: 16 }}
                                                ref="gender"
                                                note
                                                mode="dropdown"
                                                iosHeader="Jenis Kelamin"
                                                iosIcon={<Icon name="ios-arrow-down-outline"/>}
                                                placeholder="Jenis Kelamin"
                                                placeholderStyle={{ color: "rgba(0,0,0,0.3)" }}
                                                placeholderIconColor="rgba(0,0,0,0.3)"
                                                selectedValue={this.state.gender}
                                                onValueChange={this.onChangeGender.bind(this)}
                                            >
                                                <Picker.Item label="Laki-Laki" value="L" />
                                                <Picker.Item label="Perempuan" value="P" />
                                            </Picker>  
                                        </View>      								
                                </Item>		
                                <Item stackedLabel>
                                    <Label>Tempat Lahir</Label>
                                    <Input style={styles.inputtext}		
                                            placeholder="Tempat Lahir"
                                            placeholderTextColor="rgba(0,0,0,0.3)"										
                                            returnKeyType = {"next"}	
                                            onChangeText={tempatLahir => this.setState({ tempatLahir })}
                                            value={this.state.tempatLahir}
                                            blurOnSubmit={ true }
                                            maxLength={20}	
                                            ref="tempatLahir"
                                            onSubmitEditing ={(event) => {
                                                this.refs.tanggalLahir._root.focus();
                                            }}
                                        />   
                                </Item>		
                                <Item stackedLabel>
                                    <Label>Tanggal Lahir</Label>
                                    {/* <TouchableOpacity onPress={() => this.setState({ isDateTimePickerVisible: true })}> */}
                                    <Input style={styles.inputtext}	
                                            placeholder="Tanggal Lahir"
                                            placeholderTextColor="rgba(0,0,0,0.3)"			
                                            onTouchStart={() => this.setState({ isDateTimePickerVisible: true })}								
                                            returnKeyType = {"next"}	
                                            onChangeText={tanggalLahir => this.setState({ tanggalLahir })}
                                            value={this.state.tanggalLahir}
                                            blurOnSubmit={ true }	
                                            ref="tanggalLahir"
                                            onSubmitEditing ={(event) => {
                                                this.refs.nomorKartu._root.focus();
                                            }}
                                        />   
                                    {/* </TouchableOpacity> */}
                                     <DateTimePicker
                                        isVisible={isDateTimePickerVisible}
                                        onConfirm={this._handleDatePicked}
                                        onCancel={this._hideDateTimePicker}
                                    />
                                </Item>	
                                <Item stackedLabel>
                                    <Label>Kartu Identitas</Label>
                                    <Input style={styles.inputtext}		
                                            placeholder="Kartu Identitas"
                                            placeholderTextColor="rgba(0,0,0,0.3)"								
                                            returnKeyType = {"next"}	
                                            keyboardType={'numeric'}	
                                            onChangeText={nomorKartu => this.setState({ nomorKartu })}
                                            value={this.state.nomorKartu}
                                            blurOnSubmit={ true }
                                            maxLength={16}	
                                            ref="nomorKartu"
                                            onSubmitEditing ={(event) => {
                                                this.refs.alamat._root.focus();
                                            }}
                                        />   
                                </Item>	
                                <Item stackedLabel>
                                    <Label>Alamat</Label>
                                    <Input style={styles.inputtext}	
                                            placeholder="Alamat"
                                            placeholderTextColor="rgba(0,0,0,0.3)"									
                                            returnKeyType = {"next"}	
                                            onChangeText={alamat => this.setState({ alamat })}
                                            value={this.state.alamat}
                                            blurOnSubmit={ true }
                                            maxLength={50}	
                                            ref="alamat"
                                        />   
                                </Item>	
                                {this.state.Loading ? (
                                    <Spinner size="large" color="#f26623" /> 
                                ) : (
                                <Button transparent block
                                        style={!this.state.fullName || !this.state.noHP || !this.state.email || !this.state.tempatLahir || !this.state.tanggalLahir || !this.state.nomorKartu ? styles.btnDisabled : styles.btn} 
                                        disabled={!this.state.fullName || !this.state.noHP || !this.state.email || !this.state.tempatLahir || !this.state.tanggalLahir || !this.state.nomorKartu} 
                                    onPress={() => this.onUpdateProfile()}
                                >
                                <Text style={!this.state.fullName || !this.state.noHP || !this.state.email || !this.state.tempatLahir || !this.state.tanggalLahir || !this.state.nomorKartu ? styles.btnTextDisabled : styles.btnText}>SIMPAN</Text>
                                </Button>						
                            )}
                            </View>
                        </Card> 
                    </Content>
                </KeyboardAvoidingView>
            );
    }
}

export default editProfile;
