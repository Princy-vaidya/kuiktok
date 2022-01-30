import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Alert

} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import Toast, { DURATION } from 'react-native-easy-toast'
import Apis from '../Services/apis';
import io from 'socket.io-client';
import { server } from '../Services/constants'
const socket = io(server);

const Deviceheight = Dimensions.get('window').height;

export default class DrawerScreen extends Component {


  state = {
    loginType: ""
  }
  logout = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const id = JSON.parse(user)._id
    await socket.emit('signOutUser', { userId: id, })
    await AsyncStorage.removeItem('userdata')
    await AsyncStorage.removeItem('oneTimeonbording')
    this.props.navigation.navigate('LandingSecond');
    console.log(await AsyncStorage.getItem('userdata'), "user data");
  }

  componentDidMount = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const type = JSON.parse(user).socialData.type
    this.setState({ loginType: type })
    console.log("navigation", type)
  }


  deleteUser = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const UData = JSON.parse(user)._id
    const data = {
      _id: UData
    }
    await Apis.deleteUser(data)
      .then(async(res) => {
        if (res.STATUSCODE === 2000) {
          setTimeout(() => {
            Alert.alert(
              'Success',
              res.message.toString(),
              [
                { text: 'OK' },
              ],
              { cancelable: false },
            );
          }, 1000)
          await AsyncStorage.removeItem('userdata')
          this.props.navigation.navigate('LandingSecond');
        }
        else if (res.STATUSCODE === 5002) {
          this.refs.toast.show(res.message)
        }
        else {
          this.refs.toast.show(res.message)
        }
      }).catch((error) => {
        console.error(error);
      });
  }


  deleteAccount = async () => {
    Alert.alert(
      //title
      'Delete Account',
      //body
      'Are you sure you want to delete this account ?',
      [
        { text: 'Yes', onPress: () => this.deleteUser() },
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  }


  render() {
    const { navigation } = this.props;

    return (
      <View style={{ height: Deviceheight, backgroundColor: "#1f1f1f" }}>
        <StatusBar backgroundColor="#1f1f1f" barStyle="light-content" />
        <TouchableOpacity
          style={{ alignItems: 'flex-end', marginBottom: 30, marginTop: 10 }}
          onPress={() => this.props.navigation.closeDrawer()}
        >
          <MaterialIcons
            name="close"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>

        <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
          <Image
            style={{ width: 210, height: 100, borderRadius: 20 }}
            source={require('../assets/landing/kuiktok-INTRO-(1).png')}
            resizeMode="contain"
          />
        </View>
        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f6ff00', marginHorizontal: 15, elevation: 1, paddingVertical: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}
            style={{}}
          >
            <Text style={{ color: "#fff" }}>Home</Text>
          </TouchableOpacity>
        </View>
        {
          this.state.loginType != "APPLE" ?

            <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f6ff00', marginHorizontal: 15, elevation: 1, paddingVertical: 10, marginBottom: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
                <Text style={{ color: "#fff" }}>Change Password </Text>
              </TouchableOpacity>
            </View>

            : null

        }

        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f6ff00', marginHorizontal: 15, elevation: 1, paddingVertical: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Support")}>
            <Text style={{ color: "#fff" }}>Support </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f6ff00', marginHorizontal: 15, elevation: 1, paddingVertical: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate("CommunityRules")}>
            <Text style={{ color: "#fff" }}>Community Rules </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f6ff00', marginHorizontal: 15, elevation: 1, paddingVertical: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate("ContactUs")}>
            <Text style={{ color: "#fff" }}>Contact Us </Text>
          </TouchableOpacity>
        </View>



        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f6ff00', marginHorizontal: 15, elevation: 1, paddingVertical: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={this.deleteAccount}>
            <Text style={{ color: "#fff" }}>Delete Account</Text>
          </TouchableOpacity>
        </View>


        <View style={{ marginTop: 40 }}>
          <TouchableOpacity
            // onPress={handleSubmit(this.onSubmit)}
            onPress={this.logout}
            activeOpacity={0.7}
            style={{ backgroundColor: '#4b4949', paddingVertical: 13, paddingHorizontal: 20, alignItems: 'center', marginHorizontal: "26%", borderRadius: 8, marginBottom: 15 }}
          >
            <Text style={{ color: "#fff", fontSize: 14 }}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Toast
          ref="toast"
          style={{ backgroundColor: '#228B22' }}
          position='top'
          positionValue={20}
          textStyle={{ color: 'white', fontSize: 16, fontWeight: "bold" }}
        />
      </View>
    )
  }
}