const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const Device = Dimensions.get("window");
const platform = Platform.OS;
const isIphoneX = platform === "ios" && Device.height === 812 && Device.width === 375;

export default {
  container: {
    flex:1
  },
  header: {
    backgroundColor:'#00796B',
  },
  heightHeader: {
    height: platform === "ios" ? (isIphoneX ? 64 : 64) : 66,
  },
  imagebackground: {
    width: Device.width - 20, 
    height: 200,
    // borderWidth: 1, borderColor: '#000'
  },
  topinfo: {
    alignItems: 'flex-end',
    position: 'absolute', 
    top: platform === "ios" ? 150 : 130, 
    right:25
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
    color:'#FFFFFF'
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
  titleText: {
    fontWeight: '400',
    fontSize: 14
  },
  poinText: {
    fontWeight: '400',
    fontSize: 20,
    color: '#FFBF00' 
  },
};
