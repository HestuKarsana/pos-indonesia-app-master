const React = require('react-native');
const {StyleSheet, Dimensions, Platform} = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;

export default {
  container: {
    flex: 1
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingLeft: 15,
  },
  iconText: {    
    fontSize: 12,
    fontWeight: '400',
    paddingTop: 8,
    textAlign: 'center'
  },
  icon: {
    justifyContent: 'center',
    fontSize: 12,
  },
  col: {
    paddingHorizontal: 5,
    marginHorizontal:5,
    backgroundColor: '#fff',
  },
  row: {
    paddingBottom: 0
  },
  touch: {
    width: 40,
    height: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 5
  },
  breadcrumb:{
    backgroundColor: '#fff', 
    marginLeft:0, 
    paddingLeft:8, 
    paddingTop:8, 
    paddingBottom:10,
  },
  rightTitleText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnClickContain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  contain_table: { flex: 1, padding: 0, backgroundColor: '#F2F2F2' },
  head: { height: 40, backgroundColor: '#C2C2C2' },
  rows: { backgroundColor: '#F2F2F2'},
  text_head : { margin: 4, fontSize: 12, fontWeight: 'bold', textAlign: 'center'},
  text: { margin: 4, fontSize: 12},
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalMenu: {
    height: 125,
    width: 300
  },
  iconSlider: {
    justifyContent:'center', 
    alignItems:'center', 
    padding:0, 
    margin: 0,  
    width: deviceWidth, 
    height: 30,
    borderWidth:0,
    borderColor:'black'
  },
  list: {
    flex: 1,
    marginTop:20,
    marginHorizontal:20,
  },
  title:{
    fontSize:14,
    fontWeight: 'bold',
    color: '#000000'
  },
  subtitle:{
    fontSize:12,
  },
  descriptionContainer:{
    flexDirection: 'row',
  },
  image:{
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textDescription: {
    color: 'gray',
    fontSize:12,
  }
};
