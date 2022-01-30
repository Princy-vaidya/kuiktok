import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { TabBarIcon, EvilIconsImage, MaterialIconsImage } from '../Components/TabBarIcon';
import Home from '../Containers/Home/index';
import Search from '../Containers/Search';
import Notifications from '../Containers/Notification/index';
import NotificationCenter from '../Containers/Notification/notificationCenter'
// import LiveStream from '../Containers/LiveStream'
import User from '../Containers/User';
import DrawerScreen from '../Containers/drawer';
import ChangePassword from "../Containers/ChangePassword/index"
import VideoCalling from './../Containers/Home/VideoCall';
import ChatScreen  from '../Containers/Home/VideoCall/ChatScreen';
import OnlineView from '../Containers/Home/OnlineList'
import ChangeEmailPersonal from '../Containers/User/changeEmailPersonal'
import Support from '../Containers/User/support'
import CommunityRules from '../Containers/User/communityRules'
import ContactUs from "../Containers/User/contactUs"
import AbuseReport from "../Containers/Home/AbuseReport"
import OnBoarding from "../Containers/OnBording/index"
const Devicewidth = Dimensions.get('window').width;




const HomeStack = createStackNavigator(
  {
    Home,
    OnBoarding,
    VideoCalling: {
      screen: VideoCalling,
    },
    OnlineView,
    ChangeEmailPersonal,
    ChangePassword,
    Support,
    ChatScreen,
    CommunityRules,
    ContactUs,
    AbuseReport
  },
  {
    initialRouteName:"Home",
    headerLayoutPreset: 'center',
  }
);

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "VideoCalling" || route.routeName === "ChangePassword"|| route.routeName === "ChatScreen") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? `ios-home${focused ? '' : ''}` : 'md-home'}
      />
    ),
    tabBarOptions: {
      activeTintColor: '#ffffff',
      inactiveTintColor: '#6e7d91',
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#000000',
        // borderTopLeftRadius:25,
        // marginTop:-30,
        // borderTopRightRadius:25,
        height: Devicewidth < '360' ? 50 : 60,
      },
      tabStyle: {
        paddingVertical: 3,
      },
    },
  };
};

const SearchStack = createStackNavigator(
  {
    Search,
    ChangeEmailPersonal
  },
  {
    headerLayoutPreset: 'center',
  }
);

SearchStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => <EvilIconsImage focused={focused} name="gear" />,
  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor: '#6e7d91',

    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#000000',

      // borderTopLeftRadius:25,
      // borderTopRightRadius:25,
      // marginTop:-20,
      height: Devicewidth < '360' ? 50 : 60,
    },
    tabStyle: {
      paddingVertical: 3,
    },
  },
};

const NotificationStack = createStackNavigator(
  {
    Notifications,
    NotificationCenter,
    ChangeEmailPersonal
  },
  {
    headerLayoutPreset: 'center',
  }
);

NotificationStack.navigationOptions = {
  tabBarLabel: 'Notifications',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-notifications-outline" />,
  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor: '#6e7d91',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#000000',
      // borderTopLeftRadius:25,
      // borderTopRightRadius:25,
      // marginTop:-20,
      height: Devicewidth < '360' ? 50 : 60,
    },
    tabStyle: {
      paddingVertical: 3,
    },
  },
};

// const LiveStreamStack = createStackNavigator(
//   {
//     LiveStream,
//   },
//   {
//     headerLayoutPreset: 'center',
//   }
// );

// LiveStreamStack.navigationOptions = {
//   tabBarLabel: 'Live TV',
//   tabBarIcon: ({ focused }) => <MaterialIconsImage focused={focused} name="live-tv" />,

//   tabBarOptions: {
//     activeTintColor: '#ffffff',
//     inactiveTintColor: '#6e7d91',
//     indicatorStyle: { backgroundColor: 'transparent' },
//     labelStyle: {
//       fontSize: 11,
//     },
//     style: {
//       backgroundColor: '#000000',
//       // borderTopLeftRadius:25,
//       // borderTopRightRadius:25,
//       // marginTop:-20,
//       height: Devicewidth < '360' ? 50 : 60,
//     },

//     tabStyle: {
//       paddingVertical: 3,
//     },
//   },
// };

const UserStack = createStackNavigator(
  {
    User,
    // ChangePassword,
    // Support,
    // CommunityRules,
    // ChangeEmailPersonal,
    // LinkDin
  },
  {
    headerLayoutPreset: 'center',
  }
);

UserStack.navigationOptions = {
  tabBarLabel: 'Me',
  tabBarIcon: ({ focused }) => <EvilIconsImage focused={focused} name="user" />,
  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor: '#6e7d91',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#000000',
      // borderTopLeftRadius:25,
      // borderTopRightRadius:25,
      // marginTop:-20,
      height: Devicewidth < '360' ? 50 : 60,
    },
    tabStyle: {
      paddingVertical: 3,
    },
  },
};

// const ProfileStack = createStackNavigator(
//   {
//     ChangePassword,
//     Support,
//     CommunityRules,
//     ContactUs
//   },
//   {
//     headerLayoutPreset: 'center',
//   }
// );


const TabNavigator = createBottomTabNavigator({
  HomeStack,
  SearchStack,
  NotificationStack,
  // LiveStreamStack,
  UserStack,
});

export default createDrawerNavigator(
  {
    Home: {
      screen: TabNavigator,
    },
    // ProfileStack,
  },
  {
    initialRouteName: 'Home',
    contentComponent: DrawerScreen,
    drawerWidth: Devicewidth - Devicewidth / 4,
  }
);
