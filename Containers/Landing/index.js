import React, { Component } from 'react';
import { View, Text, Image, StatusBar,Alert, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: 'slider1',
    image: require('../../assets/landing/gatherintro1.jpg'),
  },
  // {
  //   key: 'slider2',
  //   image: require('../../assets/landing/gatherintroman.png'),
  // },
 
]

export default class LandingFirst extends React.Component {

  static navigationOptions = {
    header: null
  };

  state = {
    showRealApp: false
  }


  _renderItem = (item) => {
    console.log("UI", item.item.title);
    
    return (
      <View style={{flex:1,backgroundColor:"#000"}}>
         <View style={styles.slide}>
        <Image source={item.item.image} style={styles.image} resizeMode="cover"/>
      </View>
      </View>
    );
  }
  _onDone = () => {
    this.setState({ showRealApp: true });
    this.props.navigation.navigate("LandingSecond")
  }

  render() {
    // return (
    //   <View style={{flex:1,backgroundColor:"#000",alignItems:'center'}}>
    //     <StatusBar hidden={true}/>
    //       <Image source={require('../../assets/appicon.png')} style={{height: '30%', width: '30%'}}/>
    //       <Text style={{color:'#fff',alignItems:'center',fontSize:30,fontWeight:'bold'}}>Welcome to kuiktok</Text>
    //   </View>
      
           
    // );
  
    return <AppIntroSlider dotStyle={styles.dotStyle} renderItem={this._renderItem} slides={slides} onDone={this._onDone}/>;
  }
}
  
const styles = StyleSheet.create({
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    backgroundColor: '#000'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    alignItems:'center',
    textAlign:"center"
  },
  image:{
    height:"100%",
    width:"100%",
  },
  dotStyle:{
    backgroundColor: "gray"
  },
})