import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Keyboard, ScrollView, Dimensions, Platform, Alert, StyleSheet, StatusBar } from 'react-native';
import ConversationTopics from '../../Components/ConversationTopics'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { socketIncomingData } from './../../Actions/userAction'
import io from 'socket.io-client';
import { server } from '../../Services/constants'
import {base_url} from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import Apis from '../../Services/apis';
import AsyncStorage from '@react-native-community/async-storage';
import LabeledSwitch from '../../Components/CustomSwitch/'
import Autocomplete from 'react-native-autocomplete-input';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../navigation/AuthLoadingScreen'
import Toast, { DURATION } from 'react-native-easy-toast'
import { request, PERMISSIONS } from 'react-native-permissions';
const socket = io(server);
import CallModal from './VideoCall/callModal'
import { sendLocalNotification, pushConfig, getToken } from '../../pushNotification/notification'
import firebase from 'react-native-firebase';
import CallReceive from '../../pushNotification/callScreen'

const Deviceheight = Dimensions.get('window').height;
const Devicewidth = Dimensions.get('window').width;
let speclist = []

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Kuiktok',
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

  state = {
    tab: "1",
    timeTab: "1",
    value: "",
    query: '',
    selectedspecialization: [],
    fieldData: [],
    timerData: [],
    fieldId: '',
    showCallModal: false,
    callData: {},
    fieldError: 'Please select field',
    loading: false,
    toggleValue: '',
    selectedTime: '',
    callReceiveFlag: false,
    callReceiveFlag2: false,
    callObj: {},
    videoCallData: {},
    listuserData: [],
  }



  findSpacelization(query) {
    // let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    // let checkSpacialChar = format.test(query)
    //method called everytime when we change the value of the input
    if (query === '') {
      //if the query is null then return blank
      return [];
    }
    //making a case insensitive regular expression to get similar value from the film json
    const regex = new RegExp(`${query.trim()}`, 'i');
    //return the filtered film array according the query from the input
     console.log("dfdsfdsfsdfsdfs",console.log('search',speclist.filter(spec => spec.name.search(regex) >= 0 )))

  //  return speclist.filter(spec => spec.name.search(regex) >= 0 )
   
    return speclist.filter((x) =>
        String(x.name.toLowerCase()).startsWith(query.toLowerCase())
      ); 

  }

  componentDidMount = async () => {
    pushConfig(this.props.navigation)
    this.messageListener()
    const user = await AsyncStorage.getItem('userdata')
    const id = JSON.parse(user)._id
    const nav = this.props.navigation
    socket.emit('new user', { userId: id })
    socket.on('message', (data) => {
      this.props.socketIncomingData(data)
      console.log("CALL-RECEIVED----------------->", data);
      if (data.callerid == id) {
        const videoCallData = { type: 'join', ...data }
        this.setState({ videoCallData: videoCallData }, () => {
        })
        // );
        this.goToCall(videoCallData)
      }
    });
    this.getField();
    this.fcmToken()
    this.getTimer()
    this.requestAll()
    this.localData()
    this.listUser();
    this.listner()
  }

  requestAll = async () => {
    const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
    const contactsStatus = await request(PERMISSIONS.IOS.MICROPHONE);
    return { cameraStatus, contactsStatus };

  }

  localData = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const UData = JSON.parse(user)
    console.log("userdata77777", UData)
  }

  fcmToken = () => {
    getToken().then(async res => {
      console.log("TOKEN-FCM==>", res);
    })
  }

  listner = () => {
    this.props.navigation.addListener('willFocus',
      async (payload) => {
        this.listUser()
        this.setState({ selectedspecialization: [] })
      }
    );
  }

  listUser = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const authtoken = JSON.parse(user).authtoken
    const _id = JSON.parse(user)._id
    const userType = this.state.tab
    await Apis.listUserPersonal(_id, authtoken, userType)
      .then((res) => {
        if (res.STATUSCODE === 2000) {
          this.setState({ listuserData: res.response })
        }
      }).catch((error) => {
        console.error(error);
      });
  }


  goToCall = (callObj) => {
    this.setState({
      callReceiveFlag: true,
      callObj: callObj
    })

  }


  messageListener = async () => {
    firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      const type = JSON.parse(notification.data.tag).notificationType
      if (type == 'Search') {
        // this.showAlert(title, body);
        //Do nothing
      } else {
        try {
          console.log("ADDADA", JSON.parse(notification.data.tag));
          const callObj = JSON.parse(notification.data.tag).data
          this.goToCall(callObj)
          this.props.navigation.navigate("Home")
        }
        catch (err) {
          console.log('ERROR', err)
        }
      }
    });

    firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.log("notification open", notificationOpen.notification.data.tag)
      const { title, body } = notificationOpen.notification;
      // this.showAlert(title, body);
      const type = JSON.parse(notificationOpen.notification.data.tag).notificationType
      if (type == 'Search') {
        //  this.showAlert(title, body);
      } else {
        try {
          const callObj = JSON.parse(notificationOpen.notification.data.tag).data
          this.goToCall(callObj)
          this.props.navigation.navigate("Home")
        }
        catch (err) {
          console.log('ERROR', err)
        }
      }
    });

    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      //  this.showAlert(title, body);
      this.props.navigation.navigate("Home")
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      const type = JSON.parse(message.data.tag).notificationType
      if (type == 'Search') {
        //  this.showAlert(title, body);
      } else {
        try {
          const callObj = JSON.parse(message.data.tag).data
          this.goToCall(callObj)
          this.props.navigation.navigate("Home")
        }
        catch (err) {
          console.log('ERROR', err)
        }
      }
    });
  }




  changeTab = (tab) => {
    this.setState({ tab: tab }, () => {
      speclist=[]
      const { fieldData} = this.state
      fieldData.map(data => {
          this.setState({ [data._id]: false})
      })  
      this.listUser();
    })
  }

  changeTimeTab = (timeTab) => {
    this.setState({ timeTab: timeTab })
  }



  getallSpecialty = async (id) => {
    this.setState({ loading: true })
    const { tab } = this.state
    const data = {
      fieldId: id,
      userType: tab == 1 ? '1' : tab == 2 ? '2' : '',
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "get-all-specialization", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(res => {
            console.log('specialization',res)
            if (res.STATUSCODE === 2000) {
              this.setState({ loading: false })
              let list = res.response;
              speclist = list
            }
            else if (res.STATUSCODE === 4200) {
              this.setState({ loading: false })
              this.refs.toast.show(res.message);
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show('Something went wrong please try again !');
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

  addSpeclization = () => {
    if (
      (this.findSpacelization(this.state.query)).length == 0
    ) {
      this.addSpecialization(this.state.query)
    } else {
      this.state.selectedspecialization.push(this.findSpacelization(this.state.query)[0])
    }
    this.setState({ test: true, query: '' })
  }

  removeSpeclization = (id) => {
    const selectedList = this.state.selectedspecialization
    let newList = []
    if (selectedList.length != 0) {
      selectedList.map(list => {
        if (list._id != id) {
          newList.push(list)
        }
      })
      this.setState({ selectedspecialization: newList }, () => {
        this.setState({ query: '' })
      })
    } else {
      this.refs.toast.show('No data found! Please add specialization ');
    }

  }

  getField = async () => {
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const data = {

    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "get-all-field", {
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
              this.setState({ loading: false })
              this.setState({ fieldData: res.response })
            }
            else if (res.STATUSCODE === 4002) {
              this.setState({ loading: false })
              this.refs.toast.show(res.message);
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show('Something went wrong please try again !');
            }
          })
          .catch((error) => {
            this.setState({ loading: false })
            console.error('Error home:', error);
          });
      } else {
        this.setState({ loading: false })
        console.error('Error home:', error);
      }

    })

  }

  getTimer = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const data = {
      authtoken: token
    }
    Apis.getTimer(data)
      .then(async (res) => {
        if (res.STATUSCODE === 2000) {
          console.log("hello-------*****",res)
          await this.setState({ timerData: res.response.timer })

        }
        else if (res.STATUSCODE === 4002) {
          this.refs.toast.show(res.message);
        }
        else {
          this.refs.toast.show('Something went wrong please try again !')
        }
      }).catch((error) => {
        console.error(error);
      });
  }


  addSpecialization = async (query) => {
    if(this.state.fieldId == ""){
      this.refs.toast.show('Please Select Field !')
    }else{
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const data = {
      fieldId: this.state.fieldId,
      name: query,
      userType: this.state.tab == 1 ? '1' : this.state.tab == 2 ? '2' : '',
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}`+ "addSpecialization", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "authtoken": token ? token : null,
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(response => {
            if (response.STATUSCODE === 2000) {
              this.setState({ loading: false })
              let addSpeclist = {
                _id: response.response._id,
                name: response.response.name,
                fieldId: response.response.fieldId,
                description: response.response.name
              }
              if (this.state.tab == 1) {
                this.state.selectedspecialization.push(addSpeclist)
              } else {
                this.state.selectedspecializationExpert.push(addSpeclist)
              }
              this.setState({ query: '' })
            }
            else if (response.STATUSCODE === 4002) {
              this.setState({ loading: false })
              this.refs.toast.show(response.message)
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show('Something went wrong please try again !')
            }
          })
          .catch((error) => {
            this.setState({ loading: false })
            console.error('Error:', error);
          });
      } else {
        this.setState({ loading: false })
        console.error('Error:', error);
      }

    })
  }
  }

  searchExperts = async () => {
    const { tab, fieldId, selectedTime,UData } = this.state;
    const user = await AsyncStorage.getItem('userdata')
    console.log("20kjjhhhhh",JSON.parse(user))
    const token = JSON.parse(user).authtoken
    const userId = JSON.parse(user)._id
    if (fieldId == '' && selectedTime == '') {
      this.refs.toast.show('Please select Field !');
    } else if (this.state.selectedspecialization == '') {
      this.refs.toast.show('Add topic(s) tapping on the + symbol');
    } else if (selectedTime == '') {
      this.refs.toast.show('Please select Talking time !');
    } else {
      this.setState({ loading: true })
      const data = {
        excludeUserId: userId ? userId : null,
        authtoken: token ? token : null,
        specialization: this.state.selectedspecialization.map(ids => ids._id),
        talkTo: tab == 1 ? 'p2p' : tab == 2 ? 'e2p' : 0,
        timeForTalking: this.state.selectedTime,
        settingStartage: this.state.listuserData[0] ? this.state.listuserData[0].settingStartage : '',
        settingEndage: this.state.listuserData[0] ? this.state.listuserData[0].settingEndage : '',
        settingTalkLocation: this.state.listuserData[0] ? this.state.listuserData[0].settingTalkLocation : '',
        settingGender: this.state.listuserData[0] ? this.state.listuserData[0].settingGender : '',
        city: this.state.listuserData[0] ? this.state.listuserData[0].city : '',
        country: this.state.listuserData[0] ? this.state.listuserData[0].country : ''

      }
      console.log("pintukumar",token,data)
      NetInfo.fetch().then(isConnected => {
        if (isConnected) {
          fetch(`${base_url}` + "addVideoCall", {
            method: 'POST', // or 'PUT'
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            //  "authtoken": UData ? UData.authtoken : "",
            },
            body: JSON.stringify(data),
          })
            .then(response => response.json())
            .then(async(res) => {
              if (res.STATUSCODE == 2000) {
                this.setState({ loading: false });
                this.props.navigation.navigate("OnlineView", { 
                  response: res.response, 
                  request: data, 
                  selectedspecializationValue: this.state.selectedspecialization ,
                  tab:this.state.tab, 
                  fieldId:this.state.fieldData, 
                  selectedTime:this.state.selectedTime,
                  UData:this.state.UData,
                  listuserData:this.state.listuserData,
                  selectedspecialization:this.state.selectedspecialization
                })
              }
              else if (res.STATUSCODE == 5002) {
                this.setState({ loading: false })
                this.refs.toast.show(res.message);
              }
              else {
                this.setState({ loading: false })
                this.refs.toast.show('Something went wrong please try again !');
              }
            })
            .catch((error) => {
              this.setState({ loading: false })
              console.error('Error:', error);
            });
        } else {
          this.setState({ loading: false })
          console.error('Error:', error);
        }
      })
    }
  }


  switchValue = (value, id) => {
    const { fieldData } = this.state
    fieldData.map(data => {
      if (data._id == id) {
        this.setState({ [data._id]: true, fieldId: id }, () => {
          this.getallSpecialty(id)
        })
      } else {
        this.setState({ [data._id]: false })
      }
    })
  }

  renderCallReceived() {
    if (this.state.callReceiveFlag == true) {
      return (
        <CallReceive
          show={this.state.callReceiveFlag}
          Accept={() => { this.props.navigation.navigate('VideoCalling', { type: 'join', ...this.state.callObj }), this.setState({ callReceiveFlag: false }) }}
          Reject={() => this.setState({ callReceiveFlag: false })}
          fullName={this.state.callObj.fullname}
          // age = {this.state.callObj.age}
          // location = {this.state.callObj.location}
          profile={this.state.callObj.profileImage}
        />
      )
    }
  }


  render() {
    const { tab, query } = this.state
    const selectedspecialization = this.state.selectedspecialization ? this.state.selectedspecialization : undefined
     let speclist = this.findSpacelization(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <>
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          style={{ height: Deviceheight, backgroundColor: '#1f1f1f' }}
        >
          <StatusBar hidden={false} barStyle="light-content" />
          {this.renderCallReceived()}
          <CallModal
            show={this.state.showCallModal}
            setVisibility={() => this.setState({ showCallModal: false })}
            navigation={this.props.navigation}
            callData={this.state.callData}
          />
          <View style={{ marginTop: 40, alignContent: "center", justifyContent: "space-between", alignContent: "center", marginBottom: 15 }}>
            {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                <TouchableOpacity
                  onPress={() => this.changeTab(1)}
                  activeOpacity={0.7}
                >
                  {tab == 1 ?
                    <View style={{ alignItems: 'center', marginBottom: 20, }}>
                      <Text style={{ color: "#f6ff00", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>INSIGHTS</Text>
                      <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                        <Image
                          style={{ width: 15, height: 14 }}
                          source={require('../../assets/home/two_users.png')}
                        />
                      </View>
                    </View>
                    :
                    <View style={{ alignItems: 'center', marginBottom: 20, }}>
                      <Text style={{ color: "#484848", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>INSIGHTS</Text>
                      <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                        <Image
                          style={{ width: 15, height: 14 }}
                          source={require('../../assets/home/two_users.png')}

                        />
                      </View>
                    </View>
                  }
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: "space-between" }}>
                <TouchableOpacity
                  onPress={() => this.changeTab(2)}
                  activeOpacity={0.7}
                >
                  {tab == 2 ?
                    <View style={{ alignItems: 'center', marginBottom: 20, justifyContent: "space-around" }}>
                      <Text style={{ color: "#f6ff00", fontSize: 10, fontWeight: 'bold', marginBottom: 4, }}>EXPERTS</Text>
                      <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                        <Image
                          style={{ width: 16, height: 15, tintColor: "#fff" }}
                          source={require('../../assets/home/two_users.png')}
                        />
                      </View>
                    </View>
                    :
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                      <Text style={{ color: "#484848", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>EXPERTS</Text>
                      <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                        <Image
                          style={{ width: 16, height: 15, tintColor: "#fff" }}
                          source={require('../../assets/home/two_users.png')}

                        />
                      </View>
                    </View>
                  }
                </TouchableOpacity>
              </View>


              <View style={{ justifyContent: "space-between" }}>
                <TouchableOpacity
                  onPress={() => this.changeTab(3)}
                  activeOpacity={0.7}
                >
                  {tab == 3 ?
                    <View style={{ alignItems: 'center', marginBottom: 20, justifyContent: "space-around" }}>
                      <Text style={{ color: "#f6ff00", fontSize: 10, fontWeight: 'bold', marginBottom: 4, }}>GROUP</Text>
                      <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                        <Image
                          style={{ width: 14, height: 15, tintColor: "#fff" }}
                          source={require('../../assets/home/group_of_users.png')}
                        />
                      </View>
                    </View>
                    :
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                      <Text style={{ color: "#484848", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>GROUP</Text>
                      <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                        <Image
                          style={{ width: 14, height: 15, tintColor: "#fff" }}
                          source={require('../../assets/home/group_of_users.png')}

                        />
                      </View>
                    </View>
                  }
                </TouchableOpacity>

              </View>
            </View>
          </View>

          <View style={{ width: Devicewidth }}>
            {
              this.state.fieldData.length > 0 ?
                <FlatList
                  contentContainerStyle={{ width: Devicewidth, justifyContent: "center", alignItems: "center" }}
                  keyExtractor={item => item._id}
                  numColumns={5}
                  data={this.state.fieldData}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ paddingHorizontal: 10, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#fff", fontSize: 12, marginBottom: 5 }}>{item.name}</Text>
                        <LabeledSwitch ref="lsr" index={index} active={this.state[item._id]} id={item._id} name={item.name} onValuesChange={(value) => this.switchValue(value, item._id)} />
                      </View>
                    )
                  }}
                  removeClippedSubviews={false}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                /> : null

            }

          </View>

          <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 5, zIndex: 999999, alignContent: "center", marginTop: 15 }}>
            <Text style={{ color: "#ffffff", marginBottom: 10, fontSize: 16, marginLeft: 12 }}>Let's talk about :</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", alignContent: "center" }}>
              <View style={{ width: "62%", alignContent: "center", justifyContent: "center"}}>
                <Autocomplete
                  autoCapitalize="none"
                  placeholder="Type a letter and select"
                  placeholderTextColor="gray"
                  autoCorrect={false}
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    height: 36,
                    fontSize: 17,
                    padding: 7,
                    fontSize: 14,
                    color: "gray",
                    zIndex: 9999
                  }}
                  listStyle={{ maxHeight: 200, marginTop: 12, borderRadius: 5, position: "absolute", bottom: 50 }}
                  inputContainerStyle={styles.inputContainerStyle}
                  keyExtractor={index => index['_id'].toString()}
                  data={speclist.length === 1 && comp(query, speclist[0].name) ? [] : speclist}
                  defaultValue={query}
                  onChangeText={text => this.setState({ query: text })}
                  renderItem={({ item }) => (
                    <ScrollView>
                      <TouchableOpacity
                        style={{ borderBottomColor: "gray", borderBottomWidth: 0.5 }}
                        onPress={() => {
                          this.setState({ query: item.name  },()=>{
                            this.addSpeclization()
                          });

                        }}>
                        <Text style={styles.itemText}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                />

              </View>
              {/* <TouchableOpacity
                onPress={this.addSpeclization}
                disabled={this.state.query.length == 0 ? true : false}
                activeOpacity={0.7}
                style={{ width: 30, height: 30, borderRadius: 15, borderColor: "#fff", borderWidth: 1, alignContent: "center", marginLeft: 12, }}
              >
                <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "400", textAlign: "center" }}>+</Text>
              </TouchableOpacity> */}
            </View>
          </View>


          <View style={{ alignContent: "center", borderColor: "#fff", width: "100%", justifyContent: "space-between", alignItems: "center", marginBottom: 20, }}>
            {
              selectedspecialization.length > 0 ?
                <FlatList
                  contentContainerStyle={{ alignContent: "center", justifyContent: "center", paddingHorizontal: 5, alignItems: "center", paddingTop: 10, marginTop: 10 }}
                  keyExtractor={item => item._id}
                  numColumns={2}
                  data={selectedspecialization}
                  extraData={this.state}
                  renderItem={({ item }) => {
                    return (
                      <ConversationTopics title={item.name} onClick={() => this.removeSpeclization(item._id)} />
                    )
                  }}
                  removeClippedSubviews={false}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                /> : null
            }
          </View>


          <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginHorizontal: "32%", marginBottom: 3 }}>
            {
              this.state.timerData.map((data) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.setState({ selectedTime: data })}
                    activeOpacity={0.7}
                  >
                    <View style={{ width: 36, height: 36, borderRadius: 118, borderColor: this.state.selectedTime == data ? "#f6ff00" : "#484848", borderWidth: 1, alignItems: "center", justifyContent: "center", alignContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 18 }}>{data}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })
            }
          </View>

          <Text style={{ color: "#fff", fontSize: 16, textAlign: "center", marginBottom: 20, marginTop: 10 }}>Select Minutes</Text>

          {/* <View style={{ marginHorizontal: "22%", marginBottom: 40 }}>
            <TouchableOpacity onPress={this.searchExperts} style={{ height:48, borderWidth: 1, borderColor: "#484848", borderRadius: 10, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 40, justifyContent: 'center', marginBottom: 2 }}>
              <Text style={{ fontSize: 20, color: "#fff" }}>Search</Text>
            </TouchableOpacity>
          </View> */}

          <TouchableOpacity
            onPress={this.searchExperts}
            activeOpacity={0.7}
            style={{ borderWidth: 1, borderColor: "#4b4949", paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', marginHorizontal: "23%", borderRadius: 10, marginBottom: 40 }}
          >
            <Text style={{ color: "#fff", fontSize: 20 }}>Search</Text>
          </TouchableOpacity>

        </ScrollView>
        <Toast
          ref="toast"
          style={{ backgroundColor: '#f6ff00' }}
          position='top'
          positionValue={30}
          textStyle={{ color: '#000', fontSize: 16, fontWeight: "bold" }}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  formState: state.form,
  socketData: state.socketIncomingValue,
});

const FormComponent = connect(
  mapStateToProps, { socketIncomingData }
)(Home)

export default reduxForm({
  form: 'Home',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(FormComponent)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5FCFF',
  },
  autocompleteContainer: {
    color: '#000000',
    fontSize: 17,
    height: 36,
    padding: 12,
    borderRadius: 5,
  },
  inputContainerStyle: {
    borderRadius: 20,
    borderColor: "#fff",
    borderWidth: 1,
    alignItems: "center",
    width: "90%",
    height: 35,
    paddingHorizontal: 5,
    marginHorizontal: 15,
    zIndex: 9999,
  },
  itemText: {
    fontSize: 16,
    margin: 5,
    textAlign: "center"
  },
});


// import React, { Component } from 'react';
// import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Keyboard, ScrollView, Dimensions, Platform, Alert, StyleSheet, StatusBar } from 'react-native';
// import ConversationTopics from '../../Components/ConversationTopics'
// import { connect } from 'react-redux'
// import { reduxForm } from 'redux-form'
// import { socketIncomingData } from './../../Actions/userAction'
// import io from 'socket.io-client';
// import { server } from '../../Services/constants'
// import {base_url} from "../../Services/constants"
// import NetInfo from "@react-native-community/netinfo";
// import Apis from '../../Services/apis';
// import AsyncStorage from '@react-native-community/async-storage';
// import LabeledSwitch from '../../Components/CustomSwitch/'
// import Autocomplete from 'react-native-autocomplete-input';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Loader from '../../navigation/AuthLoadingScreen'
// import Toast, { DURATION } from 'react-native-easy-toast'
// import { request, PERMISSIONS } from 'react-native-permissions';
// const socket = io(server);
// import CallModal from './VideoCall/callModal'
// import { sendLocalNotification, pushConfig, getToken } from '../../pushNotification/notification'
// import firebase from 'react-native-firebase';
// import CallReceive from '../../pushNotification/callScreen'

// const Deviceheight = Dimensions.get('window').height;
// const Devicewidth = Dimensions.get('window').width;
// let speclist = []

// class Home extends Component {
//   static navigationOptions = ({ navigation }) => {
//     return {
//       title: 'Kuiktok',
//       headerLeft: (
//         <TouchableOpacity
//           onPress={() => navigation.toggleDrawer()}
//           style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 16, borderRadius: 25, marginTop: -3 }}
//           underlayColor={"rgba(0,0,0,0.32)"}
//         >
//           <MaterialIcons
//             name='dehaze'
//             size={25}
//             color='#fff'
//           />
//         </TouchableOpacity>
//       ),
//       headerRightContainerStyle: {
//         marginRight: 18
//       },
//       headerStyle: {
//         backgroundColor: '#000',
//         height: 40,

//       },
//       headerTintColor: '#ffffff',
//       headerTitleStyle: {
//         fontSize: 18,
//         paddingBottom: 8
//       },

//     }
//   }

//   state = {
//     tab: "1",
//     timeTab: "1",
//     value: "",
//     query: '',
//     selectedspecialization: [],
//     fieldData: [],
//     timerData: [],
//     fieldId: '',
//     showCallModal: false,
//     callData: {},
//     fieldError: 'Please select field',
//     loading: false,
//     toggleValue: '',
//     selectedTime: '',
//     callReceiveFlag: false,
//     callReceiveFlag2: false,
//     callObj: {},
//     videoCallData: {},
//     listuserData: [],
//     invalid:false,
//     specialist:[],
//     message:''
    
//   }



//   findSpacelization(query) {
//     // let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
//     // let checkSpacialChar = format.test(query)
//     //method called everytime when we change the value of the input
//     if (query === '') {
//       //if the query is null then return blank
//       return [];
//     }
//     //making a case insensitive regular expression to get similar value from the film json
//     const regex = new RegExp(`${query.trim()}`, 'i');
//     //return the filtered film array according the query from the input
//      console.log("dfdsfdsfsdfsdfs",speclist)
//    return speclist.filter(spec => spec.name.search(regex) >= 0);

//   }

//   componentDidMount = async () => {
//     pushConfig(this.props.navigation)
//     this.messageListener()
//     const user = await AsyncStorage.getItem('userdata')
//     const id = JSON.parse(user)._id
//     const nav = this.props.navigation
//     socket.emit('new user', { userId: id })
//     socket.on('message', (data) => {
//       this.props.socketIncomingData(data)
//       console.log("CALL-RECEIVED----------------->", data);
//       if (data.callerid == id) {
//         const videoCallData = { type: 'join', ...data }
//         this.setState({ videoCallData: videoCallData }, () => {
//         })
//         // );
//         this.goToCall(videoCallData)
//       }
//     });
//     this.getField();
//     this.fcmToken()
//     this.getTimer()
//     this.requestAll()
//     this.localData()
//     this.listUser();
//     this.listner()
//   }

//   requestAll = async () => {
//     const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
//     const contactsStatus = await request(PERMISSIONS.IOS.MICROPHONE);
//     return { cameraStatus, contactsStatus };

//   }

//   localData = async () => {
//     const user = await AsyncStorage.getItem('userdata')
//     const UData = JSON.parse(user)
//     console.log("userdata77777", UData)
//   }

//   fcmToken = () => {
//     getToken().then(async res => {
//       console.log("TOKEN-FCM==>", res);
//     })
//   }

//   listner = () => {
//     this.props.navigation.addListener('willFocus',
//       async (payload) => {
//         this.listUser()
//         this.setState({ selectedspecialization: [] })
//       }
//     );
//   }

//   listUser = async () => {
//     const user = await AsyncStorage.getItem('userdata')
//     const authtoken = JSON.parse(user).authtoken
//     const _id = JSON.parse(user)._id
//     const userType = this.state.tab
//     await Apis.listUserPersonal(_id, authtoken, userType)
//       .then((res) => {
//         if (res.STATUSCODE === 2000) {
//           this.setState({ listuserData: res.response })
//         }
//       }).catch((error) => {
//         console.error(error);
//       });
//   }


//   goToCall = (callObj) => {
//     this.setState({
//       callReceiveFlag: true,
//       callObj: callObj
//     })

//   }


//   messageListener = async () => {
//     firebase.notifications().onNotification((notification) => {
//       const { title, body } = notification;
//       const type = JSON.parse(notification.data.tag).notificationType
//       if (type == 'Search') {
//         // this.showAlert(title, body);
//         //Do nothing
//       } else {
//         try {
//           console.log("ADDADA", JSON.parse(notification.data.tag));
//           const callObj = JSON.parse(notification.data.tag).data
//           this.goToCall(callObj)
//           this.props.navigation.navigate("Home")
//         }
//         catch (err) {
//           console.log('ERROR', err)
//         }
//       }
//     });

//     firebase.notifications().onNotificationOpened((notificationOpen) => {
//       console.log("notification open", notificationOpen.notification.data.tag)
//       const { title, body } = notificationOpen.notification;
//       // this.showAlert(title, body);
//       const type = JSON.parse(notificationOpen.notification.data.tag).notificationType
//       if (type == 'Search') {
//         //  this.showAlert(title, body);
//       } else {
//         try {
//           const callObj = JSON.parse(notificationOpen.notification.data.tag).data
//           this.goToCall(callObj)
//           this.props.navigation.navigate("Home")
//         }
//         catch (err) {
//           console.log('ERROR', err)
//         }
//       }
//     });

//     const notificationOpen = await firebase.notifications().getInitialNotification();
//     if (notificationOpen) {
//       const { title, body } = notificationOpen.notification;
//       //  this.showAlert(title, body);
//       this.props.navigation.navigate("Home")
//     }

//     this.messageListener = firebase.messaging().onMessage((message) => {
//       const type = JSON.parse(message.data.tag).notificationType
//       if (type == 'Search') {
//         //  this.showAlert(title, body);
//       } else {
//         try {
//           const callObj = JSON.parse(message.data.tag).data
//           this.goToCall(callObj)
//           this.props.navigation.navigate("Home")
//         }
//         catch (err) {
//           console.log('ERROR', err)
//         }
//       }
//     });
//   }




//   changeTab = (tab) => {
//     this.setState({ tab: tab }, () => {
//       speclist=[]
//       const { fieldData} = this.state
//       fieldData.map(data => {
//           this.setState({ [data._id]: false})
//       })  
//       this.listUser();
//     })
//   }

//   changeTimeTab = (timeTab) => {
//     this.setState({ timeTab: timeTab })
//   }


//   searchState = (text) => {
//     let currentData = [];
//     if (text === "") {
     
//       this.setState({
//         specialist:speclist,
//       });
//     } else 
//     {
//       currentData = this.state.specialist.filter((x) =>
//         String(x.name.toLowerCase()).includes(text.toLowerCase())
//       ); 

//     this.setState({
//       specialist:currentData
//     })
//   }
    
//   };

//   getallSpecialty = async (id) => {
//     this.setState({ loading: true })
//     const { tab } = this.state
//     const data = {
//       fieldId: id,
//       userType: tab == 1 ? '1' : tab == 2 ? '2' : '',
//     }
//     NetInfo.fetch().then(isConnected => {
//       if (isConnected) {
//         fetch(`${base_url}` + "get-all-specialization", {
//           method: 'POST', // or 'PUT'
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         })
//           .then(response => response.json())
//           .then(res => {
//             if (res.STATUSCODE === 2000) {
//               this.setState({ loading: false })
//               let list = res.response;
//               speclist = list,
//               this.setState({
//                 specialist:list
//               }); 
//             }
//             else if (res.STATUSCODE === 4200) {
//               this.setState({ loading: false })
//               this.refs.toast.show(res.message);
//             }
//             else {
//               this.setState({ loading: false })
//               this.refs.toast.show('Something went wrong please try again !');
//             }
//           })
//           .catch((error) => {
//             this.setState({ loading: false })
//             this.refs.toast.show("Network error")
//             // console.error('Error:', error);
//           });
//       } else {
//         this.setState({ loading: false })
//         this.refs.toast.show("Network error")
//       }

//     })
//   }

//   addSpeclization = () => {
//     if (
//       (this.findSpacelization(this.state.query)).length == 0
//     ) {
//       this.addSpecialization(this.state.query)
//     } else {
//       this.state.selectedspecialization.push(this.findSpacelization(this.state.query)[0])
//     }
//     this.setState({ test: true, query: '' })
//   }

//   removeSpeclization = (id) => {
//     const selectedList = this.state.selectedspecialization
//     let newList = []
//     if (selectedList.length != 0) {
//       selectedList.map(list => {
//         if (list._id != id) {
//           newList.push(list)
//         }
//       })
//       this.setState({ selectedspecialization: newList }, () => {
//         this.setState({ query: '' })
//       })
//     } else {
//       this.refs.toast.show('No data found! Please add specialization ');
//     }

//   }

//   getField = async () => {
//     this.setState({ loading: true })
//     const user = await AsyncStorage.getItem('userdata')
//     const token = JSON.parse(user).authtoken
//     const data = {

//     }
//     NetInfo.fetch().then(isConnected => {
//       if (isConnected) {
//         fetch(`${base_url}` + "get-all-field", {
//           method: 'POST', // or 'PUT'
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             "authtoken": token ? token : null,
//           },
//           body: JSON.stringify(data),
//         })
//           .then(response => response.json())
//           .then(res => {
//             if (res.STATUSCODE === 2000) {
//               this.setState({ loading: false })
//               this.setState({ fieldData: res.response })
//             }
//             else if (res.STATUSCODE === 4002) {
//               this.setState({ loading: false })
//               this.refs.toast.show(res.message);
//             }
//             else {
//               this.setState({ loading: false })
//               this.refs.toast.show('Something went wrong please try again !');
//             }
//           })
//           .catch((error) => {
//             this.setState({ loading: false })
//             console.error('Error:', error);
//           });
//       } else {
//         this.setState({ loading: false })
//         console.error('Error:', error);
//       }

//     })

//   }

//   getTimer = async () => {
//     const user = await AsyncStorage.getItem('userdata')
//     const token = JSON.parse(user).authtoken
//     const data = {
//       authtoken: token
//     }
//     Apis.getTimer(data)
//       .then(async (res) => {
//         if (res.STATUSCODE === 2000) {
//           console.log("hello-------*****",res)
//           await this.setState({ timerData: res.response.timer })

//         }
//         else if (res.STATUSCODE === 4002) {
//           this.refs.toast.show(res.message);
//         }
//         else {
//           this.refs.toast.show('Something went wrong please try again !')
//         }
//       }).catch((error) => {
//         console.error(error);
//       });
//   }


//   addSpecialization = async (query) => {
//     if(this.state.fieldId == ""){
//       this.refs.toast.show('Please Select Field !')
//     }else{
//     this.setState({ loading: true })
//     const user = await AsyncStorage.getItem('userdata')
//     const token = JSON.parse(user).authtoken
//     const data = {
//       fieldId: this.state.fieldId,
//       name: query,
//       userType: this.state.tab == 1 ? '1' : this.state.tab == 2 ? '2' : '',
//     }
//     NetInfo.fetch().then(isConnected => {
//       if (isConnected) {
//         fetch(`${base_url}`+ "addSpecialization", {
//           method: 'POST', // or 'PUT'
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             "authtoken": token ? token : null,
//           },
//           body: JSON.stringify(data),
//         })
//           .then(response => response.json())
//           .then(response => {
//             if (response.STATUSCODE === 2000) {
//               this.setState({ loading: false })
//               let addSpeclist = {
//                 _id: response.response._id,
//                 name: response.response.name,
//                 fieldId: response.response.fieldId,
//                 description: response.response.name
//               }
//               if (this.state.tab == 1) {
//                 this.state.selectedspecialization.push(addSpeclist)
//               } else {
//                 this.state.selectedspecializationExpert.push(addSpeclist)
//               }
//               this.setState({ query: '' })
//             }
//             else if (response.STATUSCODE === 4002) {
//               this.setState({ loading: false })
//               this.refs.toast.show(response.message)
//             }
//             else {
//               this.setState({ loading: false })
//               this.refs.toast.show('Something went wrong please try again !')
//             }
//           })
//           .catch((error) => {
//             this.setState({ loading: false })
//             console.error('Error:', error);
//           });
//       } else {
//         this.setState({ loading: false })
//         console.error('Error:', error);
//       }

//     })
//   }
//   }

//   searchExperts = async () => {
//     const { tab, fieldId, selectedTime,UData } = this.state;
//     const user = await AsyncStorage.getItem('userdata')
//     console.log("20kjjhhhhh",JSON.parse(user))
//     const token = JSON.parse(user).authtoken
//     const userId = JSON.parse(user)._id
//     if (fieldId == '' && selectedTime == '') {
//       this.refs.toast.show('Please select Field !');
//     } else if (this.state.selectedspecialization == '') {
//       this.refs.toast.show('Add topic(s) tapping on the + symbol');
//     } else if (selectedTime == '') {
//       this.refs.toast.show('Please select Talking time !');
//     } else {
//       this.setState({ loading: true })
//       const data = {
//         excludeUserId: userId ? userId : null,
//         authtoken: token ? token : null,
//         specialization: this.state.selectedspecialization.map(ids => ids._id),
//         talkTo: tab == 1 ? 'p2p' : tab == 2 ? 'e2p' : 0,
//         timeForTalking: this.state.selectedTime,
//         settingStartage: this.state.listuserData[0] ? this.state.listuserData[0].settingStartage : '',
//         settingEndage: this.state.listuserData[0] ? this.state.listuserData[0].settingEndage : '',
//         settingTalkLocation: this.state.listuserData[0] ? this.state.listuserData[0].settingTalkLocation : '',
//         settingGender: this.state.listuserData[0] ? this.state.listuserData[0].settingGender : '',
//         city: this.state.listuserData[0] ? this.state.listuserData[0].city : '',
//         country: this.state.listuserData[0] ? this.state.listuserData[0].country : ''

//       }
//       console.log("pintukumar",token,data)
//       NetInfo.fetch().then(isConnected => {
//         if (isConnected) {
//           fetch(`${base_url}` + "addVideoCall", {
//             method: 'POST', // or 'PUT'
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             //  "authtoken": UData ? UData.authtoken : "",
//             },
//             body: JSON.stringify(data),
//           })
//             .then(response => response.json())
//             .then(res => {
//               if (res.STATUSCODE == 2000) {
//                 this.setState({ loading: false })
//                 this.props.navigation.navigate("OnlineView", { response: res.response, request: data, selectedspecializationValue: this.state.selectedspecialization })
//               }
//               else if (res.STATUSCODE == 5002) {
//                 this.setState({ loading: false })
//                 this.refs.toast.show(res.message);
//               }
//               else {
//                 this.setState({ loading: false })
//                 this.refs.toast.show('Something went wrong please try again !');
//               }
//             })
//             .catch((error) => {
//               this.setState({ loading: false })
//               console.error('Error:', error);
//             });
//         } else {
//           this.setState({ loading: false })
//           console.error('Error:', error);
//         }
//       })
//     }
//   }


//   switchValue = (value, id) => {
//     const { fieldData } = this.state
//     fieldData.map(data => {
//       if (data._id == id) {
//         this.setState({ [data._id]: true, fieldId: id }, () => {
//           this.getallSpecialty(id)
//         })
//       } else {
//         this.setState({ [data._id]: false })
//       }
//     })
//   }

//   renderCallReceived() {
//     if (this.state.callReceiveFlag == true) {
//       return (
//         <CallReceive
//           show={this.state.callReceiveFlag}
//           Accept={() => { this.props.navigation.navigate('VideoCalling', { type: 'join', ...this.state.callObj }), this.setState({ callReceiveFlag: false }) }}
//           Reject={() => this.setState({ callReceiveFlag: false })}
//           fullName={this.state.callObj.fullname}
//           // age = {this.state.callObj.age}
//           // location = {this.state.callObj.location}
//           profile={this.state.callObj.profileImage}
//         />
//       )
//     }
//   }


//   render() {
//     const { tab, query } = this.state
//     const selectedspecialization = this.state.selectedspecialization ? this.state.selectedspecialization : undefined
//      let speclist = this.findSpacelization(query);
//     const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
//     return (
//       <>
//         <ScrollView
//           alwaysBounceVertical={true}
//           keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
//           showsVerticalScrollIndicator={false}
//           style={{ height: Deviceheight, backgroundColor: '#1f1f1f' }}
//         >
//           <StatusBar hidden={false} barStyle="light-content" />
//           {this.renderCallReceived()}
//           <CallModal
//             show={this.state.showCallModal}
//             setVisibility={() => this.setState({ showCallModal: false })}
//             navigation={this.props.navigation}
//             callData={this.state.callData}
//           />
//           <View style={{ marginTop: 40, alignContent: "center", justifyContent: "space-between", alignContent: "center", marginBottom: 15 }}>
//             {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
//             <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, }}>
//               <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
//                 <TouchableOpacity
//                   onPress={() => this.changeTab(1)}
//                   activeOpacity={0.7}
//                 >
//                   {tab == 1 ?
//                     <View style={{ alignItems: 'center', marginBottom: 20, }}>
//                       <Text style={{ color: "#f6ff00", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>INSIGHTS</Text>
//                       <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
//                         <Image
//                           style={{ width: 15, height: 14 }}
//                           source={require('../../assets/home/two_users.png')}
//                         />
//                       </View>
//                     </View>
//                     :
//                     <View style={{ alignItems: 'center', marginBottom: 20, }}>
//                       <Text style={{ color: "#484848", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>INSIGHTS</Text>
//                       <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
//                         <Image
//                           style={{ width: 15, height: 14 }}
//                           source={require('../../assets/home/two_users.png')}

//                         />
//                       </View>
//                     </View>
//                   }
//                 </TouchableOpacity>
//               </View>
//               <View style={{ justifyContent: "space-between" }}>
//                 <TouchableOpacity
//                   onPress={() => this.changeTab(2)}
//                   activeOpacity={0.7}
//                 >
//                   {tab == 2 ?
//                     <View style={{ alignItems: 'center', marginBottom: 20, justifyContent: "space-around" }}>
//                       <Text style={{ color: "#f6ff00", fontSize: 10, fontWeight: 'bold', marginBottom: 4, }}>EXPERTS</Text>
//                       <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
//                         <Image
//                           style={{ width: 16, height: 15, tintColor: "#fff" }}
//                           source={require('../../assets/home/two_users.png')}
//                         />
//                       </View>
//                     </View>
//                     :
//                     <View style={{ alignItems: 'center', marginBottom: 20 }}>
//                       <Text style={{ color: "#484848", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>EXPERTS</Text>
//                       <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
//                         <Image
//                           style={{ width: 16, height: 15, tintColor: "#fff" }}
//                           source={require('../../assets/home/two_users.png')}

//                         />
//                       </View>
//                     </View>
//                   }
//                 </TouchableOpacity>
//               </View>


//               <View style={{ justifyContent: "space-between" }}>
//                 <TouchableOpacity
//                   onPress={() => this.changeTab(3)}
//                   activeOpacity={0.7}
//                 >
//                   {tab == 3 ?
//                     <View style={{ alignItems: 'center', marginBottom: 20, justifyContent: "space-around" }}>
//                       <Text style={{ color: "#f6ff00", fontSize: 10, fontWeight: 'bold', marginBottom: 4, }}>GROUP</Text>
//                       <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
//                         <Image
//                           style={{ width: 14, height: 15, tintColor: "#fff" }}
//                           source={require('../../assets/home/group_of_users.png')}
//                         />
//                       </View>
//                     </View>
//                     :
//                     <View style={{ alignItems: 'center', marginBottom: 20 }}>
//                       <Text style={{ color: "#484848", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>GROUP</Text>
//                       <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
//                         <Image
//                           style={{ width: 14, height: 15, tintColor: "#fff" }}
//                           source={require('../../assets/home/group_of_users.png')}

//                         />
//                       </View>
//                     </View>
//                   }
//                 </TouchableOpacity>

//               </View>
//             </View>
//           </View>

//           <View style={{ width: Devicewidth }}>
//             {
//               this.state.fieldData.length > 0 ?
//                 <FlatList
//                   contentContainerStyle={{ width: Devicewidth, justifyContent: "center", alignItems: "center" }}
//                   keyExtractor={item => item._id}
//                   numColumns={5}
//                   data={this.state.fieldData}
//                   renderItem={({ item, index }) => {
//                     return (
//                       <View style={{ paddingHorizontal: 10, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
//                         <Text style={{ color: "#fff", fontSize: 12, marginBottom: 5 }}>{item.name}</Text>
//                         <LabeledSwitch ref="lsr" index={index} active={this.state[item._id]} id={item._id} name={item.name} onValuesChange={(value) => this.switchValue(value, item._id)} />
//                       </View>
//                     )
//                   }}
//                   removeClippedSubviews={false}
//                   bounces={false}
//                   showsHorizontalScrollIndicator={false}
//                 /> : null

//             }

//           </View>

//           <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 5, zIndex: 999999, alignContent: "center", marginTop: 15 }}>
//             <Text style={{ color: "#ffffff", marginBottom: 10, fontSize: 16, marginLeft: 12 }}>Let's talk about :</Text>
//             <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", alignContent: "center" }}>
//               <View style={{ width: "62%", alignContent: "center", justifyContent: "center"}}>
//                 <Autocomplete
//                   autoCapitalize="none"
//                   placeholder="Type a letter and select"
//                   placeholderTextColor="gray"
//                   autoCorrect={false}
//                   style={{
//                     width: "100%",
//                     borderRadius: 20,
//                     height: 36,
//                     fontSize: 17,
//                     padding: 7,
//                     fontSize: 14,
//                     color: "gray",
//                     zIndex: 9999
//                   }}
//                   listStyle={{ maxHeight: 200, marginTop: 12, borderRadius: 5, position: "absolute", bottom: 50 }}
//                   inputContainerStyle={styles.inputContainerStyle}
//                   keyExtractor={index => index['_id'].toString()}
//                   data={this.state.specialist.length === 1 && comp(query, this.state.specialist[0].name) ? [] : this.state.specialist}
//                   defaultValue={query}
//                   onChangeText={text => this.searchState(text)}
//                   renderItem={({ item }) => (
//                     <ScrollView>
//                       <TouchableOpacity
//                         style={{ borderBottomColor: "gray", borderBottomWidth: 0.5 }}
//                         onPress={() => {
//                           this.setState({ query: item.name  },()=>{
//                             this.addSpeclization()
//                           });

//                         }}>
//                         <Text style={styles.itemText}>
//                           {item.name}
//                         </Text>
//                       </TouchableOpacity>
                     
//                     </ScrollView>
//                   )}
//                 />

//               </View>
//               {/* <TouchableOpacity
//                 onPress={this.addSpeclization}
//                 disabled={this.state.query.length == 0 ? true : false}
//                 activeOpacity={0.7}
//                 style={{ width: 30, height: 30, borderRadius: 15, borderColor: "#fff", borderWidth: 1, alignContent: "center", marginLeft: 12, }}
//               >
//                 <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "400", textAlign: "center" }}>+</Text>
//               </TouchableOpacity> */}
//             </View>
//           </View>


//           <View style={{ alignContent: "center", borderColor: "#fff", width: "100%", justifyContent: "space-between", alignItems: "center", marginBottom: 20, }}>
//             {
//               selectedspecialization.length > 0 ?
//                 <FlatList
//                   contentContainerStyle={{ alignContent: "center", justifyContent: "center", paddingHorizontal: 5, alignItems: "center", paddingTop: 10, marginTop: 10 }}
//                   keyExtractor={item => item._id}
//                   numColumns={2}
//                   data={selectedspecialization}
//                   extraData={this.state}
//                   renderItem={({ item }) => {
//                     return (
//                       <ConversationTopics title={item.name} onClick={() => this.removeSpeclization(item._id)} />
//                     )
//                   }}
//                   removeClippedSubviews={false}
//                   bounces={false}
//                   showsHorizontalScrollIndicator={false}
//                 /> : null
//             }
//           </View>


//           <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginHorizontal: "32%", marginBottom: 3 }}>
//             {
//               this.state.timerData.map((data) => {
//                 return (
//                   <TouchableOpacity
//                     onPress={() => this.setState({ selectedTime: data })}
//                     activeOpacity={0.7}
//                   >
//                     <View style={{ width: 36, height: 36, borderRadius: 118, borderColor: this.state.selectedTime == data ? "#f6ff00" : "#484848", borderWidth: 1, alignItems: "center", justifyContent: "center", alignContent: "center" }}>
//                       <Text style={{ color: "#fff", fontSize: 18 }}>{data}</Text>
//                     </View>
//                   </TouchableOpacity>
//                 )
//               })
//             }
//           </View>

//           <Text style={{ color: "#fff", fontSize: 16, textAlign: "center", marginBottom: 20, marginTop: 10 }}>Select Minutes</Text>

//           {/* <View style={{ marginHorizontal: "22%", marginBottom: 40 }}>
//             <TouchableOpacity onPress={this.searchExperts} style={{ height:48, borderWidth: 1, borderColor: "#484848", borderRadius: 10, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 40, justifyContent: 'center', marginBottom: 2 }}>
//               <Text style={{ fontSize: 20, color: "#fff" }}>Search</Text>
//             </TouchableOpacity>
//           </View> */}

//           <TouchableOpacity
//             onPress={this.searchExperts}
//             activeOpacity={0.7}
//             style={{ borderWidth: 1, borderColor: "#4b4949", paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', marginHorizontal: "23%", borderRadius: 10, marginBottom: 40 }}
//           >
//             <Text style={{ color: "#fff", fontSize: 20 }}>Search</Text>
//           </TouchableOpacity>

          

//         </ScrollView>
//         <Toast
//           ref="toast"
//           style={{ backgroundColor: '#f6ff00' }}
//           position='top'
//           positionValue={30}
//           textStyle={{ color: '#000', fontSize: 16, fontWeight: "bold" }}
//         />
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   formState: state.form,
//   socketData: state.socketIncomingValue,
// });

// const FormComponent = connect(
//   mapStateToProps, { socketIncomingData }
// )(Home)

// export default reduxForm({
//   form: 'Home',
//   destroyOnUnmount: false,
//   forceUnregisterOnUnmount: true,
//   enableReinitialize: true,
// })(FormComponent)


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: '#F5FCFF',
//   },
//   autocompleteContainer: {
//     color: '#000000',
//     fontSize: 17,
//     height: 36,
//     padding: 12,
//     borderRadius: 5,
//   },
//   inputContainerStyle: {
//     borderRadius: 20,
//     borderColor: "#fff",
//     borderWidth: 1,
//     alignItems: "center",
//     width: "90%",
//     height: 35,
//     paddingHorizontal: 5,
//     marginHorizontal: 15,
//     zIndex: 9999,
//   },
//   itemText: {
//     fontSize: 16,
//     margin: 5,
//     textAlign: "center"
//   },
// });


