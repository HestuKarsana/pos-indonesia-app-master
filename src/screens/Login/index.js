import React, { Component } from 'react';
import { TouchableOpacity, ImageBackground, Image, Entypo, Dimensions, StatusBar, KeyboardAvoidingView } from 'react-native';
import { 
	Container,
	Content,
	Header,
    Body,
    Left,
    Right,
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
import * as api from '../../services/api';
import styles from './styles';
const device = Dimensions.get("window")
const iconLogo = require("../../../assets/pos_logo.png");
const bgImage = require("../../../assets/bgimage.png");

class Login extends Component {
	constructor(props) {
		super(props);
		this.toggleSwitch = this.toggleSwitch.bind(this);
		this.initialState = {
			active: false,
			isLoading: false,			
			error: null,
			username: '',
			password: '',
			showPassword: true,
		};
		this.state = this.initialState;
	}

	toggleSwitch() {
		this.setState({ showPassword: !this.state.showPassword });
	}
	onPressLogin() {
		dismissKeyboard();
		this.setState({
			isLoading: true,
			error: '',
		});
		session.authenticate(this.state.username, this.state.password)
		.then((response) => {	
			// console.log('respon',response);
		 	this.setState({
				isLoading: false			        
			});			
			if(response.user){
		 		this.setState(this.initialState);				
				this.props.navigation.navigate("Home");	
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
	 
	render() {
		return (
			<KeyboardAvoidingView style={styles.container} behavior="padding">	
			<ImageBackground source={bgImage} resizeMode='cover' style={styles.imagebackground}>	
				<Header style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", paddingTop: Constants.statusBarHeight }} transparentiosBarStyle={"light-content"} transparent noShadow androidStatusBarColor="#FFFFFF">
					{/* <Left>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name='arrow-back' style={{ color: '#FFFFFF' }} />
						</Button>
					</Left> */}
					<Left />
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
								placeholder="Email"
								placeholderTextColor="rgba(255,255,255,0.7)" 											
								returnKeyType = {"next"}	
								onChangeText={username => this.setState({ username })}
								value={this.state.username}
								maxLength={30}
								blurOnSubmit={ false }	
								onSubmitEditing ={(event) => {
									this.refs.Password._root.focus();
								}}
								
							/>
						</Item>
						<Item style={styles.input}>
							<Icon style={styles.icon} name="ios-lock-outline" />
							<Input style={styles.inputtext}								
								placeholder="Password"
								secureTextEntry={this.state.showPassword}
								placeholderTextColor="rgba(255,255,255,0.7)" 	
								returnKeyType="done"
								onChangeText={password => this.setState({ password })}
								value={this.state.password}
								maxLength={200}
								blurOnSubmit={ true }
								ref="Password"								
							/>
							<Text style={styles.passwordBtnTxt} onPress={this.toggleSwitch}
							value={!this.state.showPassword}>{this.state.showPassword===false?"SEMBUNYIKAN":"LIHAT"}</Text>
						</Item>
						<View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate("LupaPassword")}>
								<Text style={{fontSize:14, color: '#FFFFFF'}} >Lupa Password?</Text>
							</TouchableOpacity>
						</View>
						{this.state.isLoading ? (
							<Spinner size="large" color="#f26623" /> 
						) : (
						<Button block
								style={!this.state.username || !this.state.password ? styles.btnDisabled : styles.btn} 
								disabled={!this.state.username || !this.state.password} 
							onPress={() => this.onPressLogin()}
						>
						<Text style={!this.state.username || !this.state.password ? styles.btnTextDisabled : styles.btnText}>LOGIN</Text>
						</Button>						
						)}
					</View>
					<View style={styles.bottomInfo}>
						<Text style={{fontSize:14, color: 'rgba(255,255,255,0.7)'}}>Anda belum punya akun? </Text>
						<Text style={{fontSize:14, color: '#FFFFFF', fontWeight: '500'}} onPress={() => this.props.navigation.navigate("Register")}>Daftar Sekarang</Text>
					</View>
				</Content>
			</ImageBackground>				
			</KeyboardAvoidingView>
		);
	}
}

export default Login;
