import React, { Component } from "react";
import { TouchableHighlight, StatusBar, ImageBackground, Dimensions } from "react-native";
import {
  Container,
	Header,
	Right, 
	Left, 
	Body,
	Title,
	Content,
	Icon,
	Button,
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
import styles from "./styles";
import * as session from '../../services/session';
import * as sessionSelectors from '../../services/session/selectors';
import * as api from '../../services/api';
import * as apiprofile from '../../data/profile/api';
import * as profileSelectors from '../../data/profile/selectors';
const device = Dimensions.get("window");
const nopicture = 'https://afcm.ca/wp-content/uploads/2018/06/no-photo.png';
const bgImage = require("../../../assets/bg_image.jpg");
 //--> Formating date to locale ID
 const moment = require('moment');
 const Idlocale = require('moment/locale/id');
 moment.updateLocale('id',Idlocale);

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      haloPOS: '161', 
      result: {},
      hasToken: false, 
      imageProfile: ''
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
                const imagePIC = (response.user.pelanggan !== null && response.user.pelanggan.imageProfile !== null) ? response.user.pelanggan.imageProfile : nopicture
                this.setState({ result: response.user, imageProfile: imagePIC });

            } else {
                this.setState({ result: {} });
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

  renderProfile = () => {
    const profileData = this.state.result
       
    if(Object.keys(profileData).length > 0){
      console.log('POTO:', this.state.imageProfile); 
        return (		
          <Content style={styles.container}>
            <ImageBackground source={bgImage} resizeMode='cover' style={styles.imagebackground}>	
              <Thumbnail large source={{uri: this.state.imageProfile}} style={styles.thumbnail}/>
              <View style={styles.topinfo} >
                <Text style={styles.title}>{profileData.fullName}</Text>
                <Text style={{ fontSize:14, color: '#000000'}}>{(profileData.pelanggan.alamat.length > 0 ) ? profileData.pelanggan.alamat[0].alamat : ' '}</Text>
              </View>
            </ImageBackground>
            <Card transparent style={{marginTop: 5}}>
              <CardItem header>
                  <Text style={{color: '#f26623', fontWeight: '400', fontSize: 18}}>Info</Text>		
                  <Left />			
                  <Right>
                    <Button transparent style={{ paddingHorizontal:20, paddingVertical:10 }} onPress={() => this.props.navigation.navigate("editProfile")}>
                      <Icon name='md-create' style={{color: '#6E6E6E', fontSize:20 }}/>
                    </Button>
                  </Right>
              </CardItem>	
              <CardItem bordered>
                <Body>
                  <Text>No. HP</Text>				
                  <Text note>{(profileData.noHP) ? profileData.noHP : '-'}</Text>               
                </Body>
              </CardItem>		
              <CardItem bordered>
                <Body>
                  <Text>Email</Text>
                  <Text note>{(profileData.email) ? profileData.email : '-'}</Text>						
                </Body>
              </CardItem>		
              <CardItem bordered>
                <Body>
                  <Text>Jenis Kelamin</Text>				
                  <Text note>{(profileData.pelanggan.gender !== null) ? (profileData.pelanggan.gender === 'L') ? 'Laki-Laki' : 'Perempuan' : '-'}</Text>						
                </Body>
              </CardItem>		
              <CardItem bordered>
                <Body>
                  <Text>Tempat Lahir</Text>
                  <Text note>{(profileData.pelanggan.tempatLahir !== null) ? profileData.pelanggan.tempatLahir : '-'}</Text>						
                </Body>
              </CardItem>		
              <CardItem bordered>
                <Body>
                  <Text>Tanggal Lahir</Text>
                  <Text note>{(profileData.pelanggan.tanggalLahir !== null) ? moment(profileData.pelanggan.tanggalLahir).format("LL") : '-'}</Text>										
                </Body>
              </CardItem>	
              <CardItem>
                <Body>
                  <Text>Kartu Identitas</Text>
                  <Text note>{(profileData.pelanggan.kartuIdentitas.length > 0 ) ? profileData.pelanggan.kartuIdentitas[0].nomorKartu : '-'}</Text>						
                </Body>
              </CardItem>		
            </Card>
            <Card transparent>
                <CardItem header>
                    <Text style={{color: '#f26623', fontWeight: '400', fontSize: 18}}>Bantuan</Text>					
                </CardItem>	
                <TouchableHighlight underlayColor="#E6E6E6" onPress={() => Communications.phonecall(this.state.haloPOS, false)}>
                <CardItem bordered>
                    <Text>Halo Pos 161</Text>				            
                </CardItem>		
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#E6E6E6" onPress={() => WebBrowser.openBrowserAsync('http://www.posindonesia.co.id/index.php/form-keluhan-pelanggan')} >
                <CardItem bordered>
                    <Text>Keluhan Kiriman Pos</Text>						
                </CardItem>		
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#E6E6E6" onPress={() => WebBrowser.openBrowserAsync('http://www.posindonesia.co.id/index.php/form-informasi-pelanggan')} >
                <CardItem bordered>
                    <Text>Permintaan Informasi</Text>						
                </CardItem>		
                </TouchableHighlight>
                <CardItem>
                  <Body>
                  <Button transparent full style={styles.btn} onPress={() => this.logout()}>
                    <Text style={styles.btnText}>Logout</Text>
                  </Button>
                  </Body>
                </CardItem>		
              </Card>
            
            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Versi 1.0.1</Text>
            </View>
          </Content>
          );
      }else{
          return (
              <Card transparent>
                  
                  <View style={{flex:1, justifyContent: 'center', alignItems: 'center', paddingVertical: device.height/3}}>
                      <Text>Tidak ada data</Text>
                      <Button full dark transparent onPress={() => this.tryFetch()}>
                          <Text>COBA LAGI</Text>
                      </Button>
                  </View>
                  <CardItem>
                  <Body>
                      <Button transparent full style={styles.btn} onPress={() => this.logout()}>
                        <Text style={styles.btnText}>Logout</Text>
                      </Button>
                    </Body>
                  </CardItem>
              </Card>
          )
    }
  };

  logout = () => {
		session.revoke();
		  
		const actionToDispatch = NavigationActions.reset({
			index: 0,
			key: null,  // black magic
			actions: [NavigationActions.navigate({ routeName: 'Login' })]
		})
		this.props.navigation.dispatch(actionToDispatch)
  };
  
  render() {
    if (this.state.isLoading) {
      return (
        <Spinner size="large" color="#f26623" />
      );
    }
        return (
          <Container style={styles.container}>
              {this.renderProfile()}
          </Container>
        );
  }
}

export default Profile;
