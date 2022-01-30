import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthLoadingScreen from  "./AuthLoadingScreen"
import MainTabNavigator from  "./MainTabNavigator"
import AuthNavigator from  "./AuthNavigator"



export default createAppContainer(createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Main: MainTabNavigator,
  Auth: AuthNavigator,
},{
  initialRouteName: 'AuthLoading'
}));