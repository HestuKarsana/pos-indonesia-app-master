import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, StatusBar, Dimensions } from "react-native";
import {
    Container,
    Header,
    Right, 
    Left, 
    Body,
    Title,
    Content,
    Icon,
    Button,
    Text,
    ListItem,
    Spinner,
    Thumbnail,
    Card, 
    CardItem
} from "native-base";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as pengumumanActionCreators from '../../data/pengumuman/actions';
import * as pengumumanSelectors from '../../data/pengumuman/selectors';
import * as apiservice from '../../services/api';
import * as api from '../../data/pengumuman/api';
import TimeAgo from 'react-native-timeago';
import HTMLView from 'react-native-htmlview';
import EmptyView from '../../helpers/emptyView';
import styles from "./styles";
const device = Dimensions.get("window");
//--> Formating date to locale ID
const moment = require('moment');
const Idlocale = require('moment/locale/id');
moment.updateLocale('id',Idlocale);

class Pengumuman extends Component {
    constructor(props) {
        super(props);
        this.makeRemoteRequest = this.makeRemoteRequest.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.state = {
            loading: false,
            result: [],
            page: 1,            
            error: null,
            refreshing: false
        };
    }

    componentDidMount() {
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        const { page } = this.state;
        this.setState({ loading: true });
        
        setTimeout (() => {
            api.get()
            .then(response => {
                this.setState({
                    result: page === 1 ? response.data : [...this.state.result, ...response.data],
                    error: response.error || null,
                    loading: false,
                    refreshing: false
                    });			            
                // store.dispatch(pengumumanActionCreators.update(response.data));
                console.log('promo: ',this.state.result);
            })
            .catch(exception => {
                // Displays only the first error message
                const error = apiservice.exceptionExtractError(exception);
                this.setState({
                    loading: false,
                    refreshing: false,
                    ...(error ? { error } : {}),
                });
                if (!error) {
                throw exception;
                }
            });
        }, 1500);
    };

    handleRefresh = () => {
        this.setState(
        {          
            page: 1,     
            refreshing: true
        },
        () => {
            this.makeRemoteRequest();
        }
        );
    };

    renderFooter = () => {
        if (!this.state.loading) return null;
        
        return (
            <View
            style={{
                paddingVertical: 20,
                borderTopWidth: 1,
                borderColor: "#f26623"
            }}
            >
            <ActivityIndicator animating size="large" color="#f26623"/>
            </View>
        );
    };

    _renderItem = ({ item, index }) => {
        return (
            <Card style={styles.card} transparent>
                <CardItem header>             					
                    <Body>
                        <Text style={styles.titleText}>{item.campaignName}</Text>
                        <Text note>Periode: { moment(item.beginDate).format("ll") } - { moment(item.endDate).format("ll") }</Text>
                    </Body>
                </CardItem>
                <CardItem cardBody> 
                    <Body style={styles.breadcrumb}>
                        {/* <FitImage
                            source={{
                            uri: GetImage(photoPath + '/' +item.foto)
                        }}/> */}
                        {/* <Image style={{height: 200, width: 330, flex: 1, marginBottom:8}} source={{uri: photoPath + '/' +item.image}}/> */}
                        <HTMLView value={item.campaignDescription}/>
                    </Body>
                </CardItem>
            </Card>
        ); 
    };

  render() {
    return (
      <Container style={styles.container}>
      <StatusBar backgroundColor="#f26623" barStyle="light-content" />
            {this.state.loading ? (
                <Spinner size="large" color="#f26623" /> 
            ) : (
                (!Array.isArray(this.state.result) || !this.state.result.length) ? (
                    <Card transparent>
                        <CardItem>
                        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', paddingVertical: device.height/3}}>
                            <Text>Tidak ada data</Text>
                            <Button full dark transparent onPress={() => this.makeRemoteRequest()}>
                                <Text>COBA LAGI</Text>
                            </Button>
                        </View>
                        </CardItem>
                    </Card>
                ) : (
                    <FlatList
                        data={this.state.result.sort((b, a) => a.campaignID.localeCompare(b.campaignID))}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => String(index)}
                        ListFooterComponent={this.renderFooter}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                    /> 
                    )
            )}   
      </Container>
    );
  }
}

export default Pengumuman;
// export default connect(state => ({
// 	data: {
// 		pengumuman: state.data.pengumuman,
// 	},
// }), dispatch => ({
// 	actions: {
// 		pengumuman: bindActionCreators(pengumumanActionCreators, dispatch),
// 	},
// }))(Pengumuman);

