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
import styles from './styles';
const device = Dimensions.get("window")
const iconLogo = require("../../../assets/pos_logo.png");
const bgImage = require("../../../assets/bgimage.png");

class RegisterActivation extends Component {
	constructor(props) {
		super(props);
        this.onPressRegisterActivate = this.onPressRegisterActivate.bind(this);
		this.initialState = {
			isLoading: false,			
            error: null,
            verificationCode: '',
		};
		this.state = this.initialState;
	}
    
	onPressRegisterActivate() {
        dismissKeyboard();
        this.setState({
            isLoading: true,
            error: '',
        });

        const { verificationCode } = this.state; 
        const registerActivate = { verificationCode: verificationCode }
        usersApi.createActivation(registerActivate)
        .then((response) => {	
            if(response.user){
                this.setState(this.initialState);
                this.props.navigation.navigate("Home");
            }else{
                this.setState({ isLoading: false });
                console.log('error :', response.errors);
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
        const { params } = this.props.navigation.state;   
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
                        <Text style={styles.textinfo}>Silakan periksa email & telepon Anda</Text>
                        <Text style={styles.textinfo}>{params.sendTo} Anda akan menerima</Text>
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
                                onSubmitEditing={this.onPressRegisterActivate} />
                        </Item>  
        

                        {this.state.isLoading ? (
                            <Spinner size="large" color="#f26623" /> 
                        ) : (
                        <Button transparent block style={styles.btn} onPress={() => this.onPressRegisterActivate()} >
                            <Text style={styles.btnText}>KONFIRM</Text>
                        </Button>						
                        )}
                    </View>       
                </Content>
            </ImageBackground>				
            </KeyboardAvoidingView>
		);
	}
}

export default RegisterActivation;
