import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../Containers/AuthScreen/login';
import SignUp from '../Containers/AuthScreen/signUp';
import ForgotPassword from '../Containers/AuthScreen/forgetpassword';
import SetPassword from '../Containers/AuthScreen/setpassword';
import Splash from '../Containers/Splash/index';
import LandingFirst from "../Containers/Landing/index";
import LandingSecond from '../Containers/Landing/landingSecond';
import OnBoarding from "../Containers/OnBording/index";

const  AuthNavigator = createStackNavigator({
  Splash,
  LandingFirst,
  OnBoarding,
  LandingSecond:{
    screen:LandingSecond,
    NavigationOptions:{
      gesturesEnabled: false,
      mode: 'modal',
    }
  },
  Login,
  SignUp,
  ForgotPassword,
  SetPassword,
},
{
  initialRouteName: 'Splash'
})
export default AuthNavigator;