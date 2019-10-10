import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import PropTypes from "prop-types";
import {
	TouchableWithoutFeedback,
	StyleSheet,
} from 'react-native';
import {
    Container,
    Content,
	Header,
    Body,
    Left,
    Right,
	Title,
	InputGroup,
	Input,
	Button,
	Spinner,
	Icon,
    View,
    Text
} from 'native-base';

import * as usersApi from '../../data/users/api';
import * as session from '../../services/session';
import * as api from '../../services/api';

const styles = StyleSheet.create({
	container: {
        flex:1,
        backgroundColor: '#FFFFFF'	
	},
	content: {
		padding: 30,
		flex: 1,
	},
	shadow: {
		flex: 1,
		width: null,
		height: null,
	},
	input: {
		marginBottom: 20,
	},
	inputIcon: {
		width: 30,
	},
	button: {
		marginTop: 20,
		alignSelf: 'center',
        width: 150,

    },
    btnText: {
        marginLeft:29,  
        color: '#FFF',        
        fontSize: 14
    }
});

class changePassword extends Component {

	constructor(props) {
		super(props);

		this.initialState = {
			isLoading: false,
            error: null,       
            success:null,     
			password: '',
			confirm_password: '',			
		};
		this.state = this.initialState;
	}

	onPressChangePass() {
		this.setState({
			isLoading: true,
            error: '',      
            success:'',                 
		});
		dismissKeyboard();

		const { password, confirm_password } = this.state;
		usersApi.change({ password })
		.then(() => {
			session.revoke()			
                //this.setState(this.initialState);
                this.setState({
                    isLoading: false,
                    success: 'Password Berhasil di rubah.',            
                });				
                const actionToDispatch = NavigationActions.reset({
                  index: 0,
                  key: null,  // black magic
                  actions: [NavigationActions.navigate({ routeName: 'Login' })]
                })
                this.props.navigation.dispatch(actionToDispatch)			
		})
		.catch((exception) => {
			// Displays only the first error message
			const error = api.exceptionExtractError(exception);
			const newState = {
				isLoading: false,
				...(error ? { error } : {}),
			};
			this.setState(newState);
		});
	}	

	render() {
		return (
			<Container>
				<Content style={styles.container}>		
					<TouchableWithoutFeedback
						onPress={dismissKeyboard}
					>
						<View
							style={styles.content}
						>
							
							<InputGroup style={styles.input}>
								<Icon style={styles.inputIcon} name="md-lock" />
								<Input
									placeholder="Kata Sandi Baru"									
									onChangeText={password => this.setState({ password })}
									value={this.state.password}
                                    secureTextEntry
                                    returnKeyType = {"next"}	
								/>
							</InputGroup>						
							<InputGroup style={styles.input}>
								<Icon style={styles.inputIcon} name="ios-unlock" />
								<Input
									placeholder="Konfirmasi Kata Sandi"
									onChangeText={confirm_password => this.setState({ confirm_password })}
									value={this.state.confirm_password}
									secureTextEntry
                                    returnKeyType = {"done"}	
								/>
							</InputGroup>
							{this.state.isLoading ? (
								<Spinner size="large" color="#FFC400" />
							) : (
								<Button dark
									style={styles.button}
									onPress={() => this.onPressChangePass()}
								>
                                <Text style={styles.btnText}>Simpan</Text>
								</Button>
							)}
						</View>
					</TouchableWithoutFeedback>
				</Content>
			</Container>
		);
	}
}

export default changePassword;
