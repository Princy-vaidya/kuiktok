import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TextInput, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import NotificaionListing from '../../Components/NotificationList'
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../navigation/AuthLoadingScreen'
import Toast from 'react-native-smart-toast-alert'
import { server } from '../../Services/constants'
import { base_url } from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import io from 'socket.io-client';
const socket = io(server);

const Deviceheight = Dimensions.get('window').height;

var dataOnline = []

class Notifications extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Notifications',
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{ justifyContent: 'center', alignItems: 'center', marginTop: -3, marginLeft: 10, borderRadius: 25 }}
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
        height: 45,

      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontSize: 18,
        paddingBottom: 8
      },

    }
  }

  state = {
    value: "",
    expert: "",
    notificationList: [],
    UData: {},
    loading: false,
    offSet: 0,
    showCallModal: false,
    newListLength: '',
    // callReceiveFlag: false
  }

  componentDidMount = () => {
    this.getLocalData()
    this.listner()
    // this.handleCallingDetails()
  }

  getLocalData = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const UData = JSON.parse(user)
    socket.emit('new user', { userId: UData._id })
    this.setState({ UData }, () => {
      this.listNotification()
    })
  }

  listner = () => {
    this.props.navigation.addListener('willFocus',
      async (payload) => {
        const user = await AsyncStorage.getItem('userdata')
        const UData = JSON.parse(user)
        this.setState({ notificationList: [] })
        console.log("hello", this.state.notificationList)
        this.setState({ UData }, () => {
          this.listNotification()
        })
      }
    );
  }



  listNotification = async () => {
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const userId = JSON.parse(user)._id
    var data = {}
    if (this.state.UData.settingNotificationUserType === undefined) {
      data = {
        authtoken: token,
        userId: userId ? userId : null,
        pageIndex: this.state.offSet,
        pageSize: 10
      }
    }
    else {
      data = {
        authtoken: token,
        userId: userId ? userId : null,
        settingNotificationUserType: this.state.UData.settingNotificationUserType,
        pageIndex: this.state.offSet,
        pageSize: 10
      }
    }
    console.log("userdatakllkkfkfkf----", data)
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "listNotification", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "authtoken": token ? token : null,
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(res => {
            if (res.STATUSCODE === 2000) {
                    this.setState({ loading: false }) +
                    socket.emit('new user', { userId: userId })
                      socket.on('userStatusDetail', (message) => {
                        for (var i = 0; i < res.response.length; i++) {
                          dataOnline[i] = (message.includes(res.response[i].from_user));
                        }
                        console.log('user status Details', dataOnline)
                      })
                    //   console.log("notification-----1111", this.state.notificationList)
                    console.log("notification----->" + JSON.stringify(res.response))
                    this.setState({
                      notificationList: this.state.notificationList.concat(res.response),
                      newListLength: res.response.length
                    })
                    // console.log("notification-----1112", this.state.notificationList)
                  }
                  else if (res.STATUSCODE === 5002) {
                    this.setState({ loading: false })
                    Toast.showToast(res.message, '#FF0000')
                  }
                  else {
                    this.setState({ loading: false })
                    Toast.showToast(res.message, '#FF0000')
                  }
          })
          .catch((error) => {
            this.setState({ loading: false })
            this.refs.toast.show("Network error")
            // console.error('Error:', error);
          });
      } else {
        this.setState({ loading: false })
        this.refs.toast.show("Network error")
      }

    })
  }

  startVideoCall = async (item) => {
    console.log("ITEN", JSON.stringify(item));
    this.setState({ showCallModal: true })
    const user = await AsyncStorage.getItem('userdata')
    const id = JSON.parse(user)._id
    const fullname = JSON.parse(user).fullname
    const channelID = (Math.random() * 1e32).toString(36)

    const callObj = {
      callerid: item.UserDetails._id,
      userId: id,
      channelid: channelID,
      timeForTalking: item.UserDetails.timeForTalking,
      fullname: fullname,
      deviceId: item.UserDetails.deviceId
    }
    console.log("startcallobject", callObj)

    socket.emit('startCall', callObj)
    socket.emit('sendNotification', callObj)
    setTimeout(() => {
      this.props.navigation.navigate('VideoCalling', { type: 'create', ...callObj })
    }, 500)
  }


  getDate = (item) => {
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var dateStr = date + "/" + month + "/" + year;
    return dateStr;
  }

  IndexAdd = () => {
    console.log("index====", this.state.offSet);
    console.log("newListLength==", this.state.newListLength);

    if (this.state.newListLength < 10) {
      return null;
    }
    else {
      let offSet = this.state.offSet + 1
      this.setState({
        offSet: offSet
      }, () => {
        this.listNotification()
      })
    }
  }

  _listEmptyComponent = () => {
    return (
      <View>
        <Text style={{ textAlign: "center", color: "#fff", marginTop: 20 }}>You have no new notifications!</Text>
      </View>
    )
  }


  render() {
    console.log("Udata", this.state.UData.settingNotificationUserType);
    console.log("rendernotification-----1111", this.state.notificationList)
    return (
      <View style={{ flex:1, backgroundColor: '#1f1f1f' }}>
        <Toast />
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        {/* {this.renderCallReceived()} */}
        <FlatList
          contentContainerStyle={{paddingVertical:5}}
          keyExtractor={item => item._id}
          data={this.state.notificationList}
          ListEmptyComponent={this._listEmptyComponent}
          onEndReachedThreshold={0.5}
          onEndReached={() => this.IndexAdd()}
          renderItem={({ item, index }) => {
            return (
              <>
                <NotificaionListing
                  // onClick={() => this.startVideoCall(item)}
                  profile={item.UserDetails.profileImage != null ? item.UserDetails.profileImage : ''}
                  // name={item.UserDetails.fullname}
                  dataOnline={dataOnline[index]}
                  subName={item.message}
                  dateTime={new Date(item.createdAt).toLocaleString()} />
              </>
            )

          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userTypeData: state.userType
  }
}

export default connect(mapStateToProps, null)(Notifications)