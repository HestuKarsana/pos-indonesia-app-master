const React = require('react-native');
const {scale, scaleModerate, scaleVertical} = require('../../helpers/scale');
const {StyleSheet, Dimensions, Platform} = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;

export default {
  container : {    
    flex:1,
  },
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logo: {
    width: 50,
    height: 50
  },
  logoContainer : {
    paddingBottom: scaleVertical(10),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  title : {
    color: '#FFF',
    marginTop: 10,
    width: 230,
    textAlign: 'center',
    opacity: 0.9,
    fontSize: 18
  },
  input_text : {
    marginBottom: platform === "ios" ? 8 : 4,
    borderWidth: 1,
    borderColor: '#D9D5DC'
  },
  inputtext : {
    color:'rgba(0,0,0,0.7)',
    fontSize: 16,
  },
  input_text_note : {
    height: 40,
    marginBottom: platform === "ios" ? 8 : 4, 
    paddingRight: 8,
    borderWidth: 1,
    borderColor: '#D9D5DC'
  },
  inputtextnote : {
    color:'rgba(0,0,0,0.7)',
    fontSize: 14,
    height: 30,
  },
  iconText: {
    width: 20, 
    height: 20, 
    marginLeft:10
  },
  icon : {
    color: '#FFF',    
    opacity: 0.9,
    paddingLeft: 12,
  },
  btn : {
    marginTop: 10, 
    backgroundColor: '#f26623', 
    shadowColor:'#ccc'
  },
  btnDisabled : {
    borderRadius:5,
    marginTop: 10,    
    backgroundColor: 'rgba(242,102,35, 0.5)', 
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
  hideText:{ 
    display:"none" 
  },
  passwordBtnTxt: {
    paddingRight: 12,
    fontSize:12,
    color:'#FFF'
  },
  formContainer: {
    flex: 1,
    zIndex: 10
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: 'white',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 7,
    top: 10
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 50,
    width: deviceWidth - 20,
    height: 'auto',
    borderRadius: 8,
    backgroundColor: 'white',
    // backgroundColor: '#7E57C2',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  loginContent : {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
    backgroundColor: 'transparent'
  },
}
