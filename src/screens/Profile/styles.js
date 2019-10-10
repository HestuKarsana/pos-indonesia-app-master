const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const Device = Dimensions.get("window");
const platform = Platform.OS;

export default {
  container: {
    flex:1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    backgroundColor:'#00796B',
  },
  imagebackground: {
    flex: 1,
    width: Device.width, 
    height: 200,
  },
  thumbnail: {
    position: 'absolute', 
    top: platform === "ios" ? 100 : 88, 
    left:20
  },
  topinfo: {
    position: 'absolute', 
    top: platform === "ios" ? 120 : 100, 
    left:120
  },
  photo: {
    width: 90,
    height: 90
  },
  contentPhoto: {
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  btnlink: {
    fontSize:20,
  },
  title:{
    fontSize:16,
    fontWeight: '600',
    color:'#000000'
  },
  logoutContainer: { justifyContent: 'center', alignItems: 'center'},
  logoutText: { textAlign: 'center', color: '#DF0101'},
  versionContainer: { justifyContent: 'center', alignItems: 'center', marginVertical:10},
  versionText: { textAlign: 'center', color: '#666666', fontSize: 12},
  btn : {
    backgroundColor: '#f26623', 
    shadowColor:'#ccc'
  },
  btnText : {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 14
  },
  inputtext : {
    fontSize: 16,
  },
  btn : {
    marginTop: 20, 
    backgroundColor: '#f26623', 
    shadowColor:'#ccc'
  },
  btnDisabled : {
    marginTop: 20,   
    borderWidth: 1,
    borderColor: '#CCCCCC', 
    backgroundColor: '#F2F2F2', 
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
  formContainer: {
    flex:1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
};
