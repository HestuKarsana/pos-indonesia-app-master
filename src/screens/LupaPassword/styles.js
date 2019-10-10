const React = require('react-native');
const {scale, scaleModerate, scaleVertical} = require('../../helpers/scale');

const {StyleSheet, Dimensions, Platform} = React;

const device = Dimensions.get('window')

export default {
  container : {    
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer : {
    marginBottom: 20,
    // marginTop: platform === "ios" ? (isIphoneX ? 88 : 64) : 56,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  logo : {
    width: 150
  },
  imagebackground: {
    width: device.width, 
    height: device.height, 
  },
  title : {
    color: '#FFF',
    marginTop: 10,
    width: 230,
    textAlign: 'center',
    opacity: 0.9,
    fontSize: 18
  },
  bg : {
    flex: 1,
    width: device.width,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  formContainer: {
    flex:1,
    paddingHorizontal: 40,
  },
  input : {
    marginBottom: 5,
    backgroundColor: 'transparent', 
  },
  inputtext : {
    color:'#FFFFFF',
    fontSize: 16,
  },
  inputtextcode : {
    color:'#FFFFFF',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '400'
  },
  icon : {
    color: '#FFFFFF',    
    opacity: 0.9,
    paddingLeft: 12,
  },
  btn : {
    marginTop: 40, 
    backgroundColor: '#f26623', 
    shadowColor:'#ccc'
  },
  btnDisabled : {
    marginTop: 40,   
    borderWidth: 1,
    borderColor: '#FFFFFF', 
    backgroundColor: 'transparent', 
  },
  btnText : {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14
  },
  btnTextDisabled : {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  header : {    
    backgroundColor: '#00796B',
  },
  hideText:{ display:"none" },
  passwordBtnTxt: {
    paddingRight: 12,
    fontSize:12,
    color:'#6E6E6E'
  },
  infoContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: device.width, 
    marginTop: 15, 
    marginBottom: 30
  },
  textinfo: {
    fontSize:14, 
    color: 'rgba(255,255,255,0.7)'
  }
};
