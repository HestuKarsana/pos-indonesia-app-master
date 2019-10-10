import React, { Component } from 'react';
import { Image, ImageBackground, Dimensions, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
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
import styles from '../LupaPassword/styles';
const device = Dimensions.get("window")
const iconLogo = require("../../../assets/pos_logo.png");
const bgImage = require("../../../assets/bgimage.png");

class LupaPasswordActivation extends Component {
	constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;   
        this.toggleSwitch1 = this.toggleSwitch1.bind(this);
        this.toggleSwitch2 = this.toggleSwitch2.bind(this);
        this.onPressUpdatePassword = this.onPressUpdatePassword.bind(this);
		this.initialState = {
			isLoading: false,			
            error: null,
            showPassword1: true,
            showPassword2: true,
            sendTo: params.sendTo,
            email: params.email,
            newPassword1: '',
            newPassword2: '',
            verificationCode: '',
		};
		this.state = this.initialState;
	}
    
	onPressUpdatePassword() {
        dismissKeyboard();
        this.setState({
            isLoading: true,
            error: '',
        });

        const { email, newPassword1, newPassword2, verificationCode } = this.state; 
        const forgotPassswordData = { user: { email: email, 'new-password-1': newPassword1, 'new-password-2': newPassword2, verificationCode: verificationCode } }
        console.log('payload :', forgotPassswordData);
        usersApi.updateForgotPassword(forgotPassswordData)
        .then((response) => {	
            this.setState({
                isLoading: false			        
            });	
            if(response.isSuccess){
                this.setState(this.initialState);
                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text: 'Reset password berhasil, silahkan login',
                    buttonText: "OK",
                    duration:3600
                })
                setTimeout (() => {
                    this.props.navigation.navigate("Login");
                }, 1500);
                
            }else{
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

    toggleSwitch1() {
		this.setState({ showPassword1: !this.state.showPassword1 });
    }
    toggleSwitch2() {
		this.setState({ showPassword2: !this.state.showPassword2 });
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
                    <View style={styles.logoContainer}>
                        <Image source={iconLogo} style={styles.logo} resizeMode='contain'/>		
                        <Text style={{ color: '#FFFFFF'}}>Pos Mobile</Text>		  
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.textinfo}>Silakan periksa email</Text>
                        <Text style={styles.textinfo}>{this.state.email} & telepon Anda </Text>
                        <Text style={styles.textinfo}>{this.state.sendTo} Anda akan menerima</Text>
                        <Text style={styles.textinfo}>pesan dengan kode verifikasi Anda</Text>
                    </View>   
					<View style={styles.formContainer}>
                        <Item style={styles.input}>
                            <Input style={styles.inputtextcode}									
                                placeholder="_ _ _ _ _ _"
                                placeholderTextColor="rgba(255,255,255,0.7)"  												
                                onChangeText={(verificationCode) => this.setState({ verificationCode })}
                                value={this.state.verificationCode}	
                                returnKeyType = {"go"}
                                maxLength={6}
                                autoFocus
                                ref={'verificationCode'}
                                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                                onSubmitEditing={this.onPressUpdatePassword} />
                        </Item>  
                        <Item style={styles.input} >
                            <Icon style={styles.icon} name="ios-lock-outline" />    
                            <Input style={styles.inputtext}								
                                placeholder="Password Baru"
                                secureTextEntry={this.state.showPassword1}
                                placeholderTextColor="rgba(255,255,255,0.7)"  
                                returnKeyType = {"next"}
                                onChangeText={newPassword1 => this.setState({ newPassword1 })}
                                value={this.state.newPassword1}	
                                blurOnSubmit={ false }
                                ref="newPassword1"	
                                onSubmitEditing ={(event) => {
                                    this.refs.newPassword2._root.focus();
                                }}						
                            />
                            <Text style={styles.passwordBtnTxt} onPress={this.toggleSwitch1}
                            value={!this.state.showPassword1}>{this.state.showPassword1===false?"SEMBUNYIKAN":"LIHAT"}</Text>
                        </Item>   
                        <Item style={styles.input} >
                            <Icon style={styles.icon} name="ios-lock-outline" />    
                            <Input style={styles.inputtext}								
                                placeholder="Konfirm Password Baru"
                                secureTextEntry={this.state.showPassword2}
                                placeholderTextColor="rgba(255,255,255,0.7)"  
                                returnKeyType = {"next"}
                                onChangeText={newPassword2 => this.setState({ newPassword2 })}
                                value={this.state.newPassword2}	
                                blurOnSubmit={ false }
                                ref="newPassword2"		
                                onSubmitEditing ={(event) => {
                                    this.refs.verificationCode._root.focus();
                                }}					
                            />
                            <Text style={styles.passwordBtnTxt} onPress={this.toggleSwitch2}
                            value={!this.state.showPassword2}>{this.state.showPassword2===false?"SEMBUNYIKAN":"LIHAT"}</Text>
                        </Item>  
        

                        {this.state.isLoading ? (
                            <Spinner size="large" color="#f26623" /> 
                        ) : (
                        <Button transparent block style={styles.btn} onPress={() => this.onPressUpdatePassword()} >
                            <Text style={styles.btnText}>GANTI PASSWORD</Text>
                        </Button>						
                        )}
                    </View>       
                </Content>
            </ImageBackground>				
            </KeyboardAvoidingView>
		);
	}
}

export default LupaPasswordActivation;
