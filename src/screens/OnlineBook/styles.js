const React = require('react-native');
const { Dimensions, Platform} = React;
const device = Dimensions.get("window");
const platform = Platform.OS;

export default {
  container : {    
    flex:1,
  },
  imageContainer: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'stretch', 
    paddingHorizontal: 10,
    paddingTop:20
  },
  logoContainer : {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  logoContainerPON : {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1
  },
  logo : {
    width: 80,
    height: 50
  },
  imagebackground: {
    width: device.width, 
    height: device.height, 
  },
  bg : {
    flex: 1,
    width: device.width,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  detailContainer: {
    flex:1,
    paddingHorizontal: 10
  },
  formContainer: {
    flex:1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  input_text : {
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 3,
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 37,
    marginHorizontal: 3,
    marginTop: 5,
  },
  inputtext : {
    height: 30,
    color:'rgba(0,0,0,0.7)',
    fontSize: 16,
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputtextmodal : {
    color:'rgba(0,0,0,0.7)',
    fontSize: 16,
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 10,
    paddingRight: 10,
    height: 30, 
    width: device.width - 50
  },
  input_text_note : {
    height: 35,
    marginBottom: platform === "ios" ? 8 : 4, 
    paddingRight: 8,
    borderWidth: 1,
    borderColor: '#D9D5DC',
    borderRadius: 3
  },
  inputtextnote : {
    color:'rgba(0,0,0,0.7)',
    fontSize: 14,
    height: 30,
  },
  iconText: {
    width: 20, 
    height: 20, 
    marginRight:10
  },
  btn : {
    height: 40,
    marginTop: 10, 
    backgroundColor: '#f26623', 
    shadowColor:'#ccc',
  },
  listViewContainerShipper: {
    flex: 0,
    maxHeight:device.height/2,
    zIndex:99,
    elevation: 999,
    position: 'absolute',
    top:61,
    left:0,
  },
  listViewContainerReceiver: {
    flex: 0,
    zIndex:99,
    elevation: 999,
    maxHeight:device.height/2,
    position: 'absolute',
    top:410,
    left:0,
  },
  listView: {
    backgroundColor: 'white',
    margin: 10,
  },
  listItem: {
    padding: 10,
  },  
  listItemSeparator: {
    borderWidth: 0.5,
    borderColor: 'lightgrey',
  },
  underlineDisable: {
    backgroundColor: 'transparent', 
    borderColor: 'rgba(255,255,255,0.4)'
  },
  modal: {
    zIndex:2,
    elevation: 2
  },
  modalMenu: {
    width: 340,
    // height: deviceHeight - 150,
    borderRadius: 5,
    marginTop: 5
  },
  postingModal: {
    width: 300,
    height: 150,
    borderRadius: 5,
    marginTop: 5
  },
  text: {
    color: "black",
    fontSize: 18,
    textAlign: 'center',
  },
  centerContain: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: { marginVertical:10 },
  versionText: { color: '#f26623   ', fontSize: 12},
  labelLeftText: {
    fontSize: 14,
    width: device.width/3
  },
  labelCenterText: {
    fontSize: 14,
    width: platform === "ios" ? 10 : 10,
  },
  labelRightText: {
    fontSize: 14,
    width: platform === "ios" ? device.width/2 + 30 : device.width/2 + 30,
  },
  labelLeftTextFooter: {
    fontSize: 14,
    width: platform === "ios" ? device.width/2 - 50 : device.width/2 - 25,
  },
  labelRightTextFooter: {
    fontSize: 14,
    width: platform === "ios" ? device.width/2 + 20 : device.width/2 + 25,
  },
  barcodeView: {
    height: 80, 
    width: platform === "ios" ? device.width/2 : device.width/2+70,
  }
}
