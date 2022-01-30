import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
  class Support extends Component {
    static navigationOptions = ({ navigation }) => {
      return {
        title: 'Support',
        headerLeft: (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 16, borderRadius: 25, marginTop: -3 }}
            underlayColor={"rgba(0,0,0,0.32)"}
          >
            <MaterialIcons
              name='dehaze'
              size={25}
              color='#fff'
            />
          </TouchableOpacity>
        ),
        headerRightContainerStyle: {
          marginRight: 18
        },
        headerStyle: {
          backgroundColor: '#000',
          height: 40,
  
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 18,
          paddingBottom: 8
        },
  
      }
    }
    render(){
        return(
            < WebView
            source={{ uri: 'https://kuiktok.com/contact/' }}
                style={{ flex: 1 }}
            />
        )
    }

  }
  export default (Support)