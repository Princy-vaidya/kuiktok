import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  Alert,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import BasicInfo from './basicInfo';
import YourInsights from './yourInsights';
import YourExpertise from './yourExpertise';
import SearchSettings from './searchSettings';
import Circle from "../../Components/DotComponent"
import Dots from 'react-native-dots-pagination';

const WIDTH = Dimensions.get('window').width;
const height = Dimensions.get('window').height;



export default class OnBoarding extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      address_string: '',
      googleAddress: {},
      indicator: 0
    };
  }



  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0e0e0e'
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='always'
          contentContainerStyle={{height:height+100 }}>
          {
            this.state.indicator == 0 && <BasicInfo onClick={() => this.setState({ indicator: 1 })} />
          }
          {
            this.state.indicator == 1 && <YourInsights onClick={() => this.setState({ indicator: 2 })} />
          }
          {
            this.state.indicator == 2 && <YourExpertise onClick={() =>this.props.navigation.navigate("Home")} />
          }

        </ScrollView>

        <View style={{ flexDirection:"row",alignItems: "center",justifyContent:"center",paddingBottom:30 }}>
          <Dots length={3} active={this.state.indicator} />
      </View>
       
      </View >
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    alignItems: 'center',
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  dotStyle: {
    backgroundColor: 'gray',
  },
  slideContainer: {
    flex: 1,
  },

});