
import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
	Container,		
	Content
} from 'native-base'
import invNum from 'invoice-number';
import md5 from'md5';
//--> Formating date to locale ID
import moment from 'moment';
import Idlocale from 'moment/locale/id';
moment.updateLocale('id',Idlocale);

const styles = StyleSheet.create({
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 250,
    paddingTop:150,
    paddingHorizontal: 50
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#A9A9A9',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default class EmptyView extends Component {
  _manifestnumberGenerate = () =>  {
      //--> 40000B2~110~40000~120~000~181000557
      return invNum.next('40000B2~110~40000~120~000~181000597')
  }
  _md5SignGenerator = () => {
      //--- Format MD5 Sign :
      //md5([uniquemainagenid]+[officerid]+[agenid]+[codeb2b]+[yyyy-mm-dd]+[key]) 
      //[289]+[orangers1001]+[40000B2]+[E2328E877]+[2018-10-13]+[p05bDu@bdj03ar4!]
      //'289oranger100140000B2E2328E8772018-11-02p05bDu@bdj03ar4!'
      const currDate = moment().format("YYYY-MM-DD")
      const combineSign = `289oranger100140000B2E2328E877${currDate}p05bDu@bdj03ar4!`

      return md5(combineSign)
  }

  render() {
    return (
      <View style={styles.emptyView}>			      
        <Text style={styles.emptyText}>
          Data tidak ditemukan
        </Text>    
        <Text style={styles.emptyText}>
         ManifestNo : {this._manifestnumberGenerate()}
        </Text>   
        <Text style={styles.emptyText}>
         SignCode : {this._md5SignGenerator()}
        </Text> 
	  </View>
    );
  }
};

