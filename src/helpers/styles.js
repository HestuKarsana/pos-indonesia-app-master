const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;

export default {
  container : {    
    flex:1
  },
  input_text : {
    marginBottom: platform === "ios" ? 8 : 4,
    borderWidth: 1,
    borderColor: '#D9D5DC',
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 40,
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
  btn : {
    height: 40,
    marginTop: 10, 
    backgroundColor: '#f26623', 
    shadowColor:'#ccc',
  },
  progressiveInput: {
    marginTop: 0,
    borderWidth:0,
    borderWidth: 1,
    borderColor: '#D9D5DC'
  },
  listViewContainerShipper: {
    flex: 0,
    maxHeight:deviceHeight/2,
    zIndex:10,
    elevation: 999,
    position: 'absolute',
    top:35,
    left:0,
  },
  listViewContainerReceiver: {
    flex: 0,
    maxHeight:deviceHeight/2,
    zIndex:10,
    elevation: 999,
    position: 'absolute',
    top:80,
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
}
