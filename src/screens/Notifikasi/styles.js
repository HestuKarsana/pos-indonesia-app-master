const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const device = Dimensions.get("window");
const platform = Platform.OS;

export default {
  container : {    
    flex:1,
  },
  header: {
    backgroundColor:'#00796B',
  },
  breadcrumb:{
    backgroundColor: '#FFFFFF', 
    marginLeft:0, 
    padding:8, 
    paddingTop:8, 
    paddingBottom:10,
  },
  card:{
    marginTop:5, 
    marginLeft:5, 
    marginRight:5,
  },
  titleText: {
    fontWeight: '400'
  },
  subTitleText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#A4A4A4'
  },
  productText: {
    fontWeight: '400',
    color: '#f26623' 
  },
  nominalText: {
    fontWeight: '400',
    fontSize: 16,
  },
  titleTextHead: {
    fontWeight: '400',
    color: '#f26623' 
  },
  contentTextHead: {
    fontSize: 16,
    fontWeight: '400',
    color: '#f26623' 
  },
  infoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f26623' 
  },
}
