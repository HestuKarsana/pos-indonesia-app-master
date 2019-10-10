import React, { Component } from 'react';
import { Image, ImageBackground, Dimensions, StatusBar, KeyboardAvoidingView } from 'react-native';
import { 
    Container,
    Content,
    Header,
    Body,
    Left,
    Right,
    Title,
	Item,
	Input,
	Button,
	Icon,
	Text,
	View,
	Spinner,
	Toast
} from 'native-base';
import { Constants } from 'expo';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import * as usersApi from '../../data/users/api';
import * as session from '../../services/session';
import * as api from '../../services/api';
import styles from './styles';
const device = Dimensions.get("window")
const iconLogo = require("../../../assets/pos_logo.png");
const bgImage = require("../../../assets/bgimage.png");

class Register extends Component {
	constructor(props) {
		super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this._emaiValidate = this._emaiValidate.bind(this);
        this.onPressRegister = this.onPressRegister.bind(this);
		this.initialState = {
			active: false,
			isLoading: false,			
            error: null,
            fullName: '',
            email: '',
            password: '',
            noHP: '+62',
            showPassword: true,
            emailvalidate:false
		};
		this.state = this.initialState;
	}

	toggleSwitch() {
		this.setState({ showPassword: !this.state.showPassword });
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
    
	onPressRegister = () => {
        dismissKeyboard();
        this.setState({
            isLoading: true,
            error: '',
        });

            const { fullName, email, password, noHP } = this.state; 
            const username = noHP.replace(/^\+[0-9]{2}/, '0')
            const pNoHP = noHP.replace(/^\+/, '')
            const registerData = { user: { email: email, password: password, username: username, fullName: fullName, noHp: pNoHP, timezone: 'ID', language: 'ID', userType: '1'} }
            usersApi.create(registerData)
            .then((response) => {	
                if(response.user){
                    session.authenticate(email, password)
                    .then(() => {
                        usersApi.sendVerification({})
                        .then(() => {	
                            this.setState(this.initialState);
                            this.props.navigation.navigate('RegisterActivation',  { sendTo: noHP } );
                        });
                    });
                }else{
                    this.setState({
                        isLoading: false			        
                    });	
                    const error = api.exceptionExtractError(response); 
                    Toast.show({
                       type: 'danger',
                       position: 'bottom',
                       text: error,
                       buttonText: "OK",
                       duration:3600
                    })	
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

    _showInfo(textinfo){
        Toast.show({
          position: 'bottom',
          text: textinfo,
        })	
    }
	 
	render() {
		return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">	
			<ImageBackground source={bgImage} resizeMode='cover' style={styles.imagebackground}>
                <Header style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", paddingTop: Constants.statusBarHeight }} transparentiosBarStyle={"light-content"} transparent noShadow androidStatusBarColor="#FFFFFF">
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#FFFFFF' }} />
                        </Button>
                    </Left>
                    <Body />
                    <Right />    
                </Header>		
				<Content style={styles.bg}>
					<View style={styles.formContainer}>
						<View style={styles.logoContainer}>
							<Image source={iconLogo} style={styles.logo} resizeMode='contain'/>		
							<Text style={{ color: '#FFFFFF'}}>Pos Mobile</Text>		  
						</View>
                        <Item style={styles.input}>
                            <Icon style={styles.icon} name="ios-person" />
                            <Input style={styles.inputtext}									
                                placeholder="Nama"
                                placeholderTextColor="rgba(255,255,255,0.7)"  											
                                returnKeyType = {"next"}	
                                onChangeText={fullName => this.setState({ fullName })}
                                value={this.state.fullName}	
                                blurOnSubmit={ false }	
                                maxLength={50}
                                onSubmitEditing ={(event) => {
                                    this.refs.NoHP._root.focus();
                                }}
                                
                            />
                        </Item>
                        <Item style={styles.input}>
                            <Input style={styles.inputtext}									
                                placeholder="+62"
                                placeholderTextColor="rgba(255,255,255,0.7)"  												
                                onChangeText={(noHP) => this.setState({ noHP })}
                                value={this.state.noHP}	
                                returnKeyType = {"next"}
                                blurOnSubmit={ false }
                                maxLength={15}
                                ref="NoHP"
                                keyboardType={'phone-pad'}
                                onSubmitEditing ={(event) => {
                                    this.refs.Email._root.focus();
                                }}	
                            />
                        </Item>  
                        <Item style={styles.input}>
                            <Icon style={styles.icon} name="ios-mail-outline" />    
                            <Input style={styles.inputtext}									
                                placeholder="Email"
                                placeholderTextColor="rgba(255,255,255,0.7)"  											
                                returnKeyType = {"next"}	
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email}	
                                blurOnSubmit={ false }
                                maxLength={50}	
                                ref="Email"
                                onSubmitEditing ={(event) => {
                                    this.refs.Password._root.focus();
                                }}
                                
                            />
                        </Item>
                        <Item style={styles.input} >
                            <Icon style={styles.icon} name="ios-lock-outline" />    
                            <Input style={styles.inputtext}								
                                placeholder="Password"
                                secureTextEntry={this.state.showPassword}
                                placeholderTextColor="rgba(255,255,255,0.7)"  
                                returnKeyType = {"go"}
                                onChangeText={password => this.setState({ password })}
                                value={this.state.password}	
                                blurOnSubmit={ true }
                                maxLength={200}
                                ref="Password"		
                                onSubmitEditing={this.onPressRegister} />						
                            <Text style={styles.passwordBtnTxt} onPress={this.toggleSwitch}
                            value={!this.state.showPassword}>{this.state.showPassword===false?"SEMBUNYIKAN":"LIHAT"}</Text>
                        </Item>       

                        {this.state.isLoading ? (
                            <Spinner size="large" color="#f26623" /> 
                        ) : (
                        <Button transparent block
                                style={!this.state.fullName || !this.state.email || !this.state.noHP || !this.state.password ? styles.btnDisabled : styles.btn} 
                                disabled={!this.state.fullName || !this.state.password || !this.state.noHP || !this.state.password} 
                            onPress={() => this.onPressRegister()}
                        >
                        <Text style={!this.state.fullName || !this.state.email || !this.state.noHP || !this.state.password ? styles.btnTextDisabled : styles.btnText}>DAFTAR</Text>
                        </Button>						
                        )}
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: device.width, marginTop: 15 }}>
                        <Text style={{fontSize:12, color: 'rgba(255,255,255,0.7)'}}>Dengan mendaftar, saya menyetujui</Text>
                        <Text style={{fontSize:12,  color: 'rgba(255,255,255,0.7)', textDecorationLine: 'underline'}}  onPress={() => this.props.navigation.navigate("SyaratKetentuan")}>Syarat & Ketentuan</Text>
                    </View>     
                    <View style={{flex: 1, flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center', width: device.width, marginTop: 5 }}>
                        <Text style={{fontSize:12, color: 'rgba(255,255,255,0.7)'}}>dan </Text>
                        <Text style={{fontSize:12, color: 'rgba(255,255,255,0.7)', textDecorationLine: 'underline'}}  onPress={() => this.props.navigation.navigate("SyaratKetentuan")}>Kebijakan Privasi POS Indonesia</Text>
                    </View> 
                    <View style={{flex: 1, flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center', width: device.width, marginTop: 20 }}>
						<Text style={{fontSize:14, color: 'rgba(255,255,255,0.7)'}}>Sudah punya akun? </Text>
						<Text style={{fontSize:14, color: '#FFFFFF', fontWeight: '500'}} onPress={() => this.props.navigation.navigate("Login")}>Login</Text>
					</View>           
                </Content>
            </ImageBackground>				
            </KeyboardAvoidingView>
		);
	}
}

export default Register;
