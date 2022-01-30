import React from 'react';
import { StyleSheet, Image,View,Text } from 'react-native';

class CustomMarker extends React.Component {
  render() {
    return (
      <View style={styles.Container}>
         <View style={styles.subContainer}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor:"#fff",
    width:22,
    height:22,
   borderRadius:11,
   alignContent:"center",
   alignItems:"center",
   justifyContent:"center"
  },
  subContainer:{
    backgroundColor:"#fcff00",
    width:18,
    height:18,
   borderRadius:9,
   alignContent:"center",
   alignItems:"center"
  }
});

export default CustomMarker;