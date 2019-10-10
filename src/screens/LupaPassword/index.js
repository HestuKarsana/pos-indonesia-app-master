import React, { Component } from 'react';
import { Alert, ImageBackground, Image, Entypo, Dimensions, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
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
import * as session from '../../services/session';
import * as usersApi from '../../data/users/api';
import * as api from '../../services/api';
import styles from './styles';
const device = Dimensions.get("window")
const iconLogo = require("../../../assets/pos_logo.png");
const bgImage = require("../../../assets/bgimage.png");

class LupaPassword extends Component {
	constructor(props) {
        super(props);
        this._emaiValidate = this._emaiValidate.bind(this);
        this.onPressResetPassword = this.onPressResetPassword.bind(this);
		this.initialState = {
			isLoading: false,			
			error: null,
            email: '',
            emailvalidate:false
		};
		this.state = this.initialState;
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
            this.setState({ emailvalidate:true, isLoading: false })
        }
    }
	onPressResetPassword() {
        dismissKeyboard();
        this.setState({
            isLoading: true,
            error: '',
        });
        // this._emaiValidate(this.state.email)
        //if(this.state.emailvalidate){
            const { email } = this.state; 
            const LupaPasswordData = { user: { email: email } }
            usersApi.sendVerificationForgotPassword(LupaPasswordData)
            .then((response) => {	
				this.setState({
					isLoading: false			        
				});	
                if(response.isSuccess){
					this.setState(this.initialState);
					this.props.navigation.navigate('LupaPasswordActivation',  { sendTo: response.sendTo, email: email  } );
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
        //} 
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
                            <Icon style={styles.icon} name="ios-mail-outline" />    
							<Input style={styles.inputtext}									
								placeholder="Email"
								placeholderTextColor="rgba(255,255,255,0.7)" 											
								returnKeyType = {"go"}	
								onChangeText={email => this.setState({ email })}
								value={this.state.email}	
								blurOnSubmit={ true }
								onSubmitEditing={this.onPressResetPassword} />	
						</Item>         

                        {this.state.isLoading ? (
                            <Spinner size="large" color="#f26623" /> 
                        ) : (
                        <Button transparent block
                                style={!this.state.email ? styles.btnDisabled : styles.btn} 
                                disabled={!this.state.email} 
                            onPress={() => this.onPressResetPassword()}
                        >
                        <Text style={!this.state.email ? styles.btnTextDisabled : styles.btnText}>RESET PASSWORD</Text>
                        </Button>						
                        )}
                                    
                        </View>
				</Content>
			</ImageBackground>				
			</KeyboardAvoidingView>
		);
	}
}

export default LupaPassword;
