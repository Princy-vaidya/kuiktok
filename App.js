/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { useState, useEffect } from 'react'
//Redux imports
import { Provider } from 'react-redux'
import configReduxStore from './Config/configReduxStore'
//Other imports
import AppNavigator  from './navigation/AppNavigator'
import NetworkError from './Services/networkError'
import NetInfo from "@react-native-community/netinfo";
import io from 'socket.io-client';
import {server} from './Services/constants';


// const socket = io(server);

const store = configReduxStore()
const socket = io(server);

const App = () => {
  const [netStatus, setNet] = useState(true);
  // const [socket,setSocket]=useState(null)
  //Checking live status of internet connection
  useEffect(() => {
    NetInfo.addEventListener(state => {
      setNet(state.isConnected)
    });

    socket.on('connected', data => {
      console.log('connected>>>>>>>>>>>>>>>>>>>>', data);
      // alert(data)
      // if (socket.connected) {
      //   console.warn('hihi');
      // } else {
      //   console.warn('ggg');
      // }
    })

  //   setSocket(io('http://68.183.173.21:3113/'))

  //  if (socket != null) {
  //   console.warn('OKKKKK',socket);
  //   socket.on('connected', data => {
  //     console.log('connected>>>>>>>>>>>>>>>>>>>>', data);
  //     alert(data)
  //     // if (socket.connected) {
  //     //   console.warn('hihi');
  //     // } else {
  //     //   console.warn('ggg');
  //     // }
  //   })
  // }
   
  })

  return (
    <Provider store={store}>
      {!netStatus ? <NetworkError /> : null}
      <AppNavigator/>
    </Provider>
  )
}

export default App;


