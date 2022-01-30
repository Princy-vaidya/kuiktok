import React, { Component } from 'react';
import { View,Text,Dimensions } from 'react-native';

const Deviceheight = Dimensions.get('window').height;

export default class LiveStream extends Component {

  static navigationOptions = {
     header:null
  };

  render() {
    return (
      <View style={{height: Deviceheight + 100, backgroundColor: '#1f1f1f',}}>
        <Text>Hello</Text>
      </View>
    );
  }
}