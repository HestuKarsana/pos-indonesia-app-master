import * as Expo from "expo";
import React, { Component } from "react";
import { StyleProvider } from "native-base";
import { Provider } from 'react-redux';
import store from '../store';
import AppNavigator from "../AppNavigator";
import ReduxNavigation from '../ReduxNavigation';
import getTheme from "../theme/components";
import variables from "../theme/variables/commonColor";

// This is used in order to see requests on the Chrome DevTools
XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
GLOBAL.originalXMLHttpRequest :
GLOBAL.XMLHttpRequest;

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }
  componentWillMount() {
    this.loadFonts();
  }
  async loadFonts() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      FontAwesome: require("@expo/vector-icons/fonts/FontAwesome.ttf"),
      MaterialIcons: require("@expo/vector-icons/fonts/MaterialIcons.ttf")
    });
    this.setState({ isReady: true });
  }
  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return (
      <StyleProvider style={getTheme(variables)}>
        <Provider store={store}>              
          <ReduxNavigation />  
          {/* <AppNavigator /> */}
        </Provider>
      </StyleProvider>
    );
  }
}
