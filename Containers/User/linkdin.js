import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
  
  class LinkDin extends Component {

    render(){
        return(
            < WebView
            source={{ uri: 'https://in.linkedin.com/' }}
                style={{ flex: 1 }}
            />
        )
    }

  }
  export default (LinkDin)