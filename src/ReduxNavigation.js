import React from 'react';
import {StatusBar, NetInfo} from "react-native";
import {Root, Footer, FooterTab, Text} from "native-base";
import * as ReactNavigation from 'react-navigation';
import {connect} from 'react-redux';
import AppNavigator from './AppNavigator';
import {BackHandler} from "react-native";
import PropTypes from "prop-types";

class ReduxNavigation extends React.Component {
    state = {
        isConnected: true
    };
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        nav: PropTypes.object.isRequired
    }

    _shouldCloseApp = () => this.props.nav.index === 1

    _goBack = () => this
        .props
        .dispatch(ReactNavigation.NavigationActions.back())

    _handleBackPress = () => {
        if (this._shouldCloseApp()) {
            return false
        }
        this._goBack()
        return true
    }

    componentWillMount() {
        BackHandler.addEventListener("hardwareBackPress", this._handleBackPress)
    }

    componentDidMount() {
        NetInfo
            .isConnected
            .addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress)
        NetInfo
            .isConnected
            .removeEventListener('connectionChange', this.handleConnectivityChange)
    }

    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.setState({isConnected});
        } else {
            this.setState({isConnected});
        }
    };

    render() {
        // here is our redux-aware our smart component
        const {dispatch, nav} = this.props
        const navigation = ReactNavigation.addNavigationHelpers({dispatch, state: nav})

        if (!this.state.isConnected) {
            return (
                <Root>
                    {/* <StatusBar backgroundColor="#58595B" barStyle="light-content"/> */}
                    <AppNavigator navigation={navigation}/>
                    <Footer>
                        <FooterTab
                            style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#424242'
                        }}>
                            <Text
                                style={{
                                color: '#FFF',
                                fontSize: 14
                            }}>Uh oh, kamu tidak terhubung internet :(</Text>
                        </FooterTab>
                    </Footer>
                </Root>
            )
        }
        return (
            <Root>
                {/* <StatusBar backgroundColor="#58595B" barStyle="light-content"/> */}
                <AppNavigator navigation={navigation}/>
            </Root>
        )
    }
}

const mapStateToProps = state => ({nav: state.nav})
export default connect(mapStateToProps)(ReduxNavigation)

// gets the current screen from navigation state function
// getCurrentRouteName(navigationState) {     if (!navigationState) {
// return null;     }     const route =
// navigationState.routes[navigationState.index];     // dive into nested
// navigators     if (route.routes) {       return getCurrentRouteName(route);
//   }     return route.routeName; } export default () =>     <Root>
// <StatusBar backgroundColor="#000000" barStyle="light-content"/>
// <AppNavigator              onNavigationStateChange={(prevState, currentState)
// => {               const currentScreen = getCurrentRouteName(currentState);
//             const prevScreen = getCurrentRouteName(prevState);
// if (prevScreen !== currentScreen) {                 // the line below uses
// the Google Analytics tracker                 // change the tracker here to
// use other Mobile analytics SDK.                  //Update route
//    const routeStack = { name: currentScreen }
// store.dispatch(routeHistoryActions.push(routeStack))                 //
// tracker.trackScreenView(currentScreen);               }           }}
// />     </Root>;