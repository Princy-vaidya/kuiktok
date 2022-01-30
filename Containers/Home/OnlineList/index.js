import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity, FlatList, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import OnlineListing from '../../../Components/OnlineList/index'
import StandByList from '../../../Components/StandByList/index'
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import { server } from '../../../Services/constants'
import { base_url } from "../../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import Loader from '../../../navigation/AuthLoadingScreen'
const socket = io(server);
import { saveOnlineUsers, saveSingleOnlineUsers } from './../../../Actions/userAction';
import Toast, { DURATION } from 'react-native-easy-toast'


const Deviceheight = Dimensions.get('window').height;
var dataOnline = [];


class OnlineView extends Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    tab: "1",
    expertList: [],
    expertListData: [],
    showCallModal: false,
    onlineUsers: [],
    starCount: '',
    selectedspecializationValue: [],
    modalVisible: false,
    blockUserStatus: false,
    loading:false,
    talkTime:'',
    toUserId:''
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  userNav = () => {
    this.setModalVisible(!this.state.modalVisible)
    this.props.navigation.navigate("AbuseReport")
  }

  navBlock = () => {
    this.addBlock()
    this.setModalVisible(!this.state.modalVisible)

  }

  openModal = async (item) => {
    await AsyncStorage.setItem("pickedData", JSON.stringify(item))
    this.setModalVisible(!this.state.modalVisible)
  }

  componentDidMount = () => {
    // this.getBlockUser()
    this.getOnlineList()
    this.props.navigation.addListener('didFocus', () => {
      this.getOnlineList()
    });
    console.log("props-------", this.props.navigation)
   
  
 }

 getOnlineList=async()=>{
  const user = await AsyncStorage.getItem('userdata')
  const id = JSON.parse(user)._id
  socket.emit('new user', { userId: id })
  const { response, request, selectedspecializationValue,tab,fieldId, selectedTime,UData,listuserData ,selectedspecialization} = this.props.navigation.state.params;
  const token = JSON.parse(user).authtoken
  const userId = JSON.parse(user)._id
  if (fieldId == '' && selectedTime == '') {
    Toast.show('Please select Field !');
  } else if (selectedspecialization == '') {
    Toast.show('Add topic(s) tapping on the + symbol');
  } else if (selectedTime == '') {
   Toast.show('Please select Talking time !');
  } else {
    this.setState({ loading: true })
    const data = {
      excludeUserId: userId ? userId : null,
      authtoken: token ? token : null,
      specialization: selectedspecialization.map(ids => ids._id),
      talkTo: tab == 1 ? 'p2p' : tab == 2 ? 'e2p' : 0,
      timeForTalking: selectedTime,
      settingStartage: listuserData[0] ? listuserData[0].settingStartage : '',
      settingEndage: listuserData[0] ? listuserData[0].settingEndage : '',
      settingTalkLocation: listuserData[0] ? listuserData[0].settingTalkLocation : '',
      settingGender: listuserData[0] ? listuserData[0].settingGender : '',
      city: listuserData[0] ? listuserData[0].city : '',
      country: listuserData[0] ? listuserData[0].country : ''

    }
    console.log("online data",token,data)
    this.setState({
      talkTime:data.timeForTalking
    })
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
          .then(res => {

            console.log('online result',res.response);

            
            if (res.STATUSCODE == 2000) {
              this.setState({ loading: false })
              // this.props.navigation.navigate("OnlineView", { 
              //   response: res.response, 
              //   request: data, 
              //   selectedspecializationValue: this.state.selectedspecialization ,
              //   tab:this.state.tab, 
              //   fieldId:this.state.fieldData, 
              //   selectedTime:this.state.selectedTime,
              //   UData:this.state.UData,
              //   listuserData:this.state.listuserData
              // })

              

              this.setState({
                expertList: res.response,
                expertListData: res.response,
                toUserId:res.response[0]._id,
                selectedspecializationValue: selectedspecializationValue.slice(0, 2)
              }, () => {
                console.log("Timeobject", selectedspecializationValue)
              })
              this.props.saveOnlineUsers(response)
              this.props.saveSingleOnlineUsers(selectedspecializationValue.slice(0, 2))
              socket.on('userStatusDetail', (message) => {
                // alert(message)
                if (response.length != 0) {
                  for (var i = 0; i < response.length; i++) {
                    dataOnline[i] = (message.includes(response[i]._id));
                  }
                }        

              });
              this.setState({
                onlineUsers: dataOnline,
              })
              console.log('online list',this.state.toUserId)
            //  alert(this.state.toUserId)

            }
            else if (res.STATUSCODE == 5002) {
              this.setState({ loading: false })
              Toast.show(res.message);
            }
            else {
              this.setState({ loading: false })
              Toast.show('Something went wrong please try again !');
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
  this.setState({ loading: false })
 }

  changeTab = (tab) => {
    this.setState({ tab: tab })
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  startVideoCall = async (item) => {
    console.log("ITEN", item);
    this.setState({ showCallModal: true })
    const user = await AsyncStorage.getItem('userdata')
    const id = JSON.parse(user)._id
    const fullname = JSON.parse(user).fullname
    const location = JSON.parse(user).location
    const age = JSON.parse(user).age
    const profileimage = JSON.parse(user).profileImage
    const channelID = (Math.random() * 1e32).toString(36)

    const callObj = {
      callerid: item._id,
      userId: id,
      channelid: channelID,
      // timeForTalking: this.state.expertListData.timeForTalking,
      timeForTalking:this.state.talkTime,
      fullname: fullname,
      userName: fullname,
      profileImage: profileimage,
      callerName: item.fullname,
      deviceId: item.deviceId,
      callType: this.state.expertListData.talkTo,
      selectedspecialization: this.state.selectedspecializationValue,
      location: location ? location : '',
      age: age ? age : '',
      toUserId:this.state.toUserId
    }
    console.log("startcallobject", callObj)
    socket.emit('startCall', callObj)
    socket.emit('sendNotification', callObj)
    // this.props.navigation.navigate('VideoCalling', {toUserId:''})
    setTimeout(() => {
      this.props.navigation.navigate('VideoCalling', {
        type: 'create',
        ...callObj,
      })
    }, 500)

  }


  addBlock = async () => {
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const authtoken = JSON.parse(user).authtoken
    const userId = JSON.parse(user)._id
    const user1 = await AsyncStorage.getItem('pickedData')
    const id = JSON.parse(user1)._id
    const data = {
      fromUserId: userId,
      toUserId: id,
      blockUserStatus: this.state.blockUserStatus == false ? true : false
    }
    console.log("dataabusereport---", data, authtoken)
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "add-block-user", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "authtoken": authtoken
          },
          body: JSON.stringify(data),
        })
          // console.log("dataabusereport---", data,authtoken,base_url)
          .then(response => response.json())
          .then(res => {
            if (res.STATUSCODE === 2000) {
              this.setState({ [id]: res.response.blockUserStatus }, () => {
                console.log("dyanicstate---", this.state[id])
              })
              // this.getBlockUser()
              console.log("blockuser-----------------------", res.response)
              this.setState({ loading: false, blockUserStatus: res.response.blockUserStatus })
            }
            else if (res.STATUSCODE === 4002) {
              this.setState({ loading: false })
              this.refs.toast.show(res.message)
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show(res.message)
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




  _listEmptyComponentOnLine = () => {
    return (
      <View>
        <Text style={{ textAlign: "center", color: "#fff" }}>Oops, nobody is online now, try a different topic!</Text>
      </View>
    )
  }

  _listEmptyComponentStandBy = () => {
    return (
      <View>
        <Text style={{ textAlign: "center", color: "#fff" }}>Oops, nobody is on standby now, try a different topic!</Text>
      </View>
    )
  }



  render() {
    const { tab, expertList } = this.state
    return (
      <View style={{ height: Deviceheight, backgroundColor: '#1f1f1f', }}>
        {/* <CallModal 
          show={this.state.showCallModal} 
          setVisibility = {() => this.setState({showCallModal: false})}
          navigation = {this.props.navigation}
          callData = {this.ss}
        /> */}
        <View style={{ marginTop: 35 }}>
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
          <View style={{ marginTop: 30, alignContent: "center", justifyContent: "space-around", }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 26, marginBottom: 25 }}>
              <TouchableOpacity
                onPress={() => this.changeTab(1)}
                activeOpacity={0.7}
              >
                {tab == 1 ?
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 28, justifyContent: 'center', marginBottom: 2 }}>
                      <Text style={{ color: "#fff", fontSize: 14 }}>ONLINE </Text>
                    </View>
                  </View>
                  :
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 28, justifyContent: 'center', marginBottom: 2 }}>
                      <Text style={{ color: "#fff", fontSize: 14 }}>ONLINE </Text>
                    </View>
                  </View>
                }
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.changeTab(2)}
                activeOpacity={0.7}
              >
                {tab == 2 ?
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 28, justifyContent: 'center', marginBottom: 2 }}>
                      <Text style={{ color: "#fff", fontSize: 14 }}>STANDBY </Text>
                    </View>
                  </View>
                  :
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 28, justifyContent: 'center', marginBottom: 2 }}>
                      <Text style={{ color: "#fff", fontSize: 14 }}>STANDBY </Text>
                    </View>
                  </View>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {
          tab == 1 ?
            <>
              <View style={{ height: Deviceheight / 1.4 }}>
                <FlatList
                  // contentContainerStyle={{ alignContent: "center", justifyContent: "center"}}
                  keyExtractor={item => item._id}
                  data={this.state.expertList}
                  ListEmptyComponent={this._listEmptyComponentOnLine}
                  extraData={this.state}
                  renderItem={({ item, index }) => {
                    console.log("this.state[item._id,", this.state[item._id])
                    return (
                      <>
                        {this.state.onlineUsers[index] == true &&
                        

                          <OnlineListing
                            onClick={() => this.startVideoCall(item)}
                            disabled={typeof this.state[item._id] != 'undefined' ? this.state[item._id] : item.blockUserStatus}
                            profile={item.profileImage != null ? item.profileImage : "data:image/jpeg;base64,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"}
                            title={`${item.fullname} ${item.age}`}
                            address={item.location}
                            rating={JSON.stringify(item.rating).substring(0,3)}
                            onStarRatingPress={(rating) => this.onStarRatingPress(rating)}
                            modalOpen={() => this.openModal(item)}
                            show={this.state.modalVisible}
                            close={() => this.setModalVisible(!this.state.modalVisible)}
                            navUser={this.userNav}
                            navBlock={this.navBlock}
                            blockUserStatus={typeof this.state[item._id] != 'undefined' ? this.state[item._id] : item.blockUserStatus}
                          />
                        }
                      </>
                    )

                  }}
                  removeClippedSubviews={false}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>

            </>
            : null
        }

        {
          tab == 2 ?
            <>
              <View style={{ height: Deviceheight / 1.4 }}>
                <FlatList
                  // contentContainerStyle={{height:Deviceheight/2}}
                  keyExtractor={item => item.id}
                  data={this.state.expertList}
                  ListEmptyComponent={this._listEmptyComponentStandBy}
                  extraData={this.state}
                  renderItem={({ item, index }) => {
                    return (
                      <>
                        {this.state.onlineUsers[index] == false &&
                          <StandByList
                            onClick={() => this.startVideoCall(item)} profileImage={item.profileImage != null ? item.profileImage : "data:image/jpeg;base64,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"}
                            title={`${item.fullname} ${item.age ? item.age : ''}`}
                            address={item.location}
                            rating={JSON.stringify(item.rating).substring(0,3)}
                            onStarRatingPress={(rating) => this.onStarRatingPress(rating)}
                          />}
                      </>
                    )

                  }}
                  removeClippedSubviews={false}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </>
            : null
        }

        <Toast
          ref="toast"
          style={{ backgroundColor: '#228B22' }}
          position='top'
          positionValue={20}
          textStyle={{ color: 'white', fontSize: 16, fontWeight: "bold" }}
        />
      </View>
    );
  }
}


const mapStateToProps = (state) => ({
  formState: state.form,
  onlineExpert: state.onlineUsers,
  SingleUserOnline: state.singleOnlineUsers
});

const FormComponent = connect(
  mapStateToProps, { saveOnlineUsers, saveSingleOnlineUsers }
)(OnlineView)

export default reduxForm({
  form: 'OnlineView',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  
})(FormComponent)