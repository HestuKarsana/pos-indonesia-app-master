import React, { Component } from "react";
import { Container,
    Header,
    Body,
    Left,
    Right,
    Title,
    Content,
    Icon,
    Button,
    Text,
    Grid, Col, Row,
    IconNB,
    Footer,
    FooterTab,
    Badge,
    Card,
    CardItem,
} from "native-base";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableHighlight
} from 'react-native';
import Modal from 'react-native-modalbox';
import EmptyView from './emptyView';
var screen = Dimensions.get('window');

class showMenu extends Component {

  constructor() {
    super();
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3
    };
  }

  onClose() {
    console.log('Modal just closed');
  }

  onOpen() {
    console.log('Modal just opened');
  }

  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }

  renderList() {
    var list = [];

    for (var i=0;i<50;i++) {
      list.push(<Text style={styles.text} key={i}>Elem {i}</Text>);
    }

    return list;
  }

  render() {
    var BContent = <TouchableHighlight style={styles.btnModal} underlayColor="#E6E6E6" onPress={() => this.setState({isOpen: false})} style={styles.btnModal}>
                      <View>
                        <Icon name="ios-contact" style={{ color: '#638F98', fontSize: 30}} />
                      </View>
                    </TouchableHighlight>
    // <Button transparent dark onPress={() => this.setState({isOpen: false})} style={styles.btnModal}><Text>X</Text></Button>;

    return (
      <View style={styles.wrapper}>
        <Button primary block rounded style={styles.btn} onPress={() => this.refs.modal1.open()}><Text>Basic modal</Text></Button>
        <Button primary block rounded style={styles.btn} onPress={() => this.refs.modal2.open()}><Text>Position top</Text></Button>
        <Button primary block rounded style={styles.btn} onPress={() => this.refs.modal3.open()}><Text>Position centered + backdrop + disable</Text></Button>
        <Button primary block rounded style={styles.btn} onPress={() => this.refs.modal4.open()}><Text>Position bottom + backdrop + slider</Text></Button>
        <Button primary block rounded style={styles.btn} onPress={() => this.setState({isOpen: true})}><Text>Backdrop + backdropContent</Text></Button>
        <Button primary block rounded style={styles.btn} onPress={() => this.refs.modal6.open()}><Text>Position bottom + ScrollView</Text></Button>
        <Button primary block rounded style={styles.btn} onPress={() => this.refs.modal7.open()}><Text>Modal with keyboard support</Text></Button>

        <Modal
          style={[styles.modal, styles.modal1]}
          ref={"modal1"}
          swipeToClose={this.state.swipeToClose}
          onClosed={this.onClose}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}>
            <Text style={styles.text}>Basic modal</Text>
            <Button primary block rounded style={styles.btn} onPress={() => this.setState({swipeToClose: !this.state.swipeToClose})}><Text>Disable swipeToClose({this.state.swipeToClose ? "true" : "false"})</Text></Button>
        </Modal>

        <Modal style={[styles.modal, styles.modal2]} backdrop={false}  position={"top"} ref={"modal2"}>
          <Text style={[styles.text, {color: "white"}]}>Modal on top</Text>
        </Modal>

        <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled}>
          <Text style={styles.text}>Modal centered</Text>
          <Button primary block rounded style={styles.btn} onPress={() => this.setState({isDisabled: !this.state.isDisabled})}><Text>Disable ({this.state.isDisabled ? "true" : "false"})</Text></Button>
        </Modal>

        <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal4"}>
          <Text style={styles.text}>Modal on bottom with backdrop</Text>
          {/* <Slider style={{width: 200}} value={this.state.sliderValue} onValueChange={(value) => this.setState({sliderValue: value})} /> */}
        </Modal>

        <Modal isOpen={this.state.isOpen} onClosed={() => this.setState({isOpen: false})} style={[styles.modal, styles.modal4]} position={"center"} backdropContent={BContent}>
          <Text style={styles.text}>Modal with backdrop content</Text>
        </Modal>

        <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal6"} swipeToClose={true}>
                <View style={{justifyContent:'center', alignItems:'center', padding:0, margin: 0,  width:screen.width, height: 30}}>
                <Icon name="ios-more" style={{ color: '#C2C2C2', fontSize: 40}} />
                </View>
              <EmptyView />  
              {/* {this.renderList()} */}
        </Modal>

        <Modal ref={"modal7"} style={[styles.modal, styles.modal4]} position={"center"}>
          <View>
            <TextInput style={{height: 50, width: 200, backgroundColor: '#DDDDDD'}}/>
          </View>
        </Modal>
      </View>
    );
  }

}

const styles = StyleSheet.create({

  wrapper: {
    paddingTop: 50,
    flex: 1
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: 500
  },

  btn: {
    margin: 10,
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
  },

  text: {
    color: "black",
    fontSize: 22
  }

});

export default showMenu;