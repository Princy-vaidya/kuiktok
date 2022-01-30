import React, { Component } from 'react';
import { View, Text, Image, StatusBar } from 'react-native';


export default class Landing extends Component {
  static navigationOptions = {
    header: null
  };

  componentDidMount = () => {
    const { navigation } = this.props
    setTimeout(() => {
    navigation.replace('LandingFirst') 
  },3000)
  } 

 

  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar hidden={true}/>
          <Image source={require('../../assets/landing/gatherintro.jpg')} style={{height: '100%', width: '100%'}}/>
      </View>
    );
  }
}


