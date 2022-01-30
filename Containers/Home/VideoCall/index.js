import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import {RtcEngine, AgoraView} from 'react-native-agora';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {config} from '../../../Services/videoCall';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import ListModal from '../VideoCall/callModal';
import {AddBtn, DisconnectBtn, MuteBtn} from './callButtons';
import Toast from 'react-native-smart-toast-alert';
import {base_url} from '../../../Services/constants'
// import Toast, { DURATION } from 'react-native-easy-toast'
// import Toast from 'react-native-smart-toast-alert'
import Timer from './callTimer';
import RatingComponent from './rating';
import io from 'socket.io-client';
import Apis from '../../../Services/apis';
import {server} from '../../../Services/constants';
import NetInfo from "@react-native-community/netinfo";


const socket = io(server);
const Deviceheight = Dimensions.get('window').height;
const Devicewidth = Dimensions.get('window').width;

var dataOnline = [];
var measageData=[]
class VideoCalling extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  state = {
    peerIds: [], //Array for storing connected peers
    uid: Math.floor(Math.random() * 100), //Generate a UID for local user
    vidMute: false, //State variable for Video Mute
    audMute: false, //State variable for Audio Mute
    joinSucceed: false,
    showLocal: true,
    addCall: false,
    addRating: false,
    startDisable: false,
    leaveUserData: {},
    id: '',
    fullName: '',
    starCount: '',
    selectedspecialization: [],
    onlineUsers: [],
    socketData: {},
    modal: true,
    textMessage: '',
    loading:false,
    data: [],
  };

  componentDidMount = async () => {
 
    const channelIdValue = this.props.navigation.state.params;
    this.connectVideoCall();
    const user = await AsyncStorage.getItem('userdata');
   
    const id = JSON.parse(user)._id;
   
    const fullName = JSON.parse(user).fullname;
    this.setState({
      id: id,
      fullName: fullName,
    });
    await AsyncStorage.setItem('arraylist', JSON.stringify([]))


    console.log('data chat',this.props.navigation.state.param)
    const peers = this.state.peerIds;
    const peerLength = peers.length;
      
    socket.emit('new user', {userId: id});
    socket.on('message', data => {
      console.log('incomingdata call', data);
      // alert(data)
    
    });
    socket.on('connected', data => {
      console.log('connecteddata>>>>>>>>>>>>>>>>>>>>', data);
      //  alert(data)
    })

    socket.on('userStatusDetail', message => {
      const userData = this.props.userListing
        ? this.props.userListing
        : 'EMPTY';
      if (userData.length != 0) {
        for (var i = 0; i < userData.length; i++) {
          dataOnline[i] = message.includes(userData[i]._id);
        }
      }
      this.setState({
        onlineUsers: dataOnline,
      });
    });
    socket.on('leaveUserData', data => {
      console.log('SOCKET-DATA', data);
      if (data.userId == id) {
        RtcEngine.destroy();
        // this.props.navigation.navigate("Home")
        this.setState({addRating: true});
      } else if (data.channelid == channelIdValue.channelid) {
        RtcEngine.destroy();
        // this.props.navigation.navigate("Home")
        this.setState({addRating: true});
      }
    });

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.connectVideoCall();
    });

  //  this.getMessageList()

  socket.on('chat list',  async(message)=> {
    console.log('socket on data==>', message);
  
    if(message.STATUSCODE==200){
      console.log('message list',message.response.reslt)
       console.log('mesgData',[...this.state.data,message.response.reslt])

    let array=  await AsyncStorage.getItem('arraylist');
     if (this.state.data.length==0){
     this.setState({
        data:[...this.state.data,message.response.reslt]
     
     })
     await AsyncStorage.setItem('arraylist', JSON.stringify(this.state.data))
    }else{
      this.setState({
        data:[...JSON.parse(array),message.response.reslt]
     
     })
     await AsyncStorage.setItem('arraylist', JSON.stringify(this.state.data))
    }
    

    //  this.getMessageList()
    console.log('msg list',this.state.data)
  }
    });

  };

  componentWillUnmount = () => {
    RtcEngine.destroy();
  };

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  saveRating = async () => {
    let data = {};
    const {id} = this.state;
    const navParam = this.props.navigation.state.params;
    const navCallerId = navParam ? navParam.callerid : '';
    const navUserId = navParam ? navParam.userId : '';
    this.setState({loading: true});
    if (navCallerId == id) {
      data = {
        callerId: navUserId,
        userId: navCallerId,
        rating: this.state.starCount,
      };
    } else {
      data = {
        callerId: navCallerId,
        userId: navUserId,
        rating: this.state.starCount,
      };
    }
    console.log('save rating',data)
    await Apis.addRating(data)
      .then(res => {
        if (res.STATUSCODE === 2000) {
          this.setState({loading: false});
        } else if (res.STATUSCODE === 5002) {
          this.setState({loading: false});
        } else {
          this.setState({loading: false});
        }
      })
      .catch(error => {
        this.setState({loading: false});
        console.error(error);
      });
  };

  addCallFunction = () => {
    this.setState({addCall: true});
  };
  onTimerEnd = async () => {
    const data = this.props.navigation.state.params;
    if (this.state.peerIds.length > 1) {
      if (data.type == 'create') {
        socket.emit('leaveRoom', {
          userId: this.state.id,
          channelid: data.channelid,
        });
        RtcEngine.destroy();
        this.setState({addRating: true});
      } else {
        RtcEngine.leaveChannel();
        RtcEngine.destroy();
        this.setState({addRating: true});
      }
    } else {
      socket.emit('leaveRoom', {
        userId: this.state.id,
        channelid: data.channelid,
      });
      RtcEngine.destroy();
      this.setState({addRating: true});
    }
  };
  onCancelRating = async () => {
    await RtcEngine.destroy();
    this.props.navigation.goBack();
    this.setState({addRating: false});
  };

  async onSaveRatingValue() {
    await RtcEngine.destroy();
    this.saveRating();
    this.props.navigation.goBack();
    this.setState({addRating: false});
  }

  connectVideoCall = () => {
    const data = this.props.navigation.state.params;
    console.log('JOINING', data);
    RtcEngine.on('userJoined', data => {
      console.log('UID', data);
      this.setState({vidMute: true}, () => this.setState({vidMute: false}));
      const {peerIds} = this.state; //Get currrent peer IDs
      if (peerIds.indexOf(data.uid) === -1) {
        //If new user has joined
        this.setState({
          peerIds: [...peerIds, data.uid], //add peer ID to state array
        });
      }
    });

    RtcEngine.on('userOffline', data => {
      this.setState({
        peerIds: this.state.peerIds.filter(uid => uid !== data.uid),
      });
    });

    RtcEngine.on('joinChannelSuccess', data => {
      //If Local user joins RTC channel
      RtcEngine.startPreview(); //Start RTC preview
      this.setState({
        joinSucceed: true, //Set state variable to true
      });
    });
    RtcEngine.joinChannel(data.channelid, this.state.uid);
    RtcEngine.init(config);
    RtcEngine.enableAudio();
  };
  //  abuseReport = (nav) =>{
  //    console.log("jj-----------++++++",this.props.navigation.navigate)
  //   this.props.navigation.navigate("Home")
  //  }


   onSendMessage = async () => {
  
    const user = await AsyncStorage.getItem('userdata')
    const userId = JSON.parse(user)._id
    const navParam = this.props.navigation.state.params;
    // let measageData=[]

    let data = {
        to_user:navParam ? navParam.toUserId===userId?navParam.userId:navParam.toUserId:'',
        from_user: userId,
        message: this.state.textMessage,
        user_fullname:JSON.parse(user).fullname
    }

    console.log('data send',data)
    socket.emit("send message", data);

   
    console.log('msg lists...',this.state.data)
    socket.on('chat list',  async(message)=> {
      console.log('socket on data==>', message);
    
      if(message.STATUSCODE==200){
        console.log('message list',message.response.reslt)
         console.log('mesgData',[...this.state.data,message.response.reslt])

      let array=  await AsyncStorage.getItem('arraylist');
       if (this.state.data.length==0){
       this.setState({
          data:[...this.state.data,message.response.reslt]
       
       })
       await AsyncStorage.setItem('arraylist', JSON.stringify(this.state.data))
      }else{
        this.setState({
          data:[...JSON.parse(array),message.response.reslt]
       
       })
       await AsyncStorage.setItem('arraylist', JSON.stringify(this.state.data))
      }
      

      //  this.getMessageList()
      console.log('msg list',this.state.data)
    }
      });

      this.setState({
        textMessage:''
      })
  
   

}


  sendMessage = async () => {
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const userId = JSON.parse(user)._id
    const navParam = this.props.navigation.state.params;

    console.log('token',token)

    var data = {
        authtoken:'Bearer'+token,
        to_user: navParam ? navParam.callerid:'',
        content: this.state.textMessage,
        
      }
  
    console.log("formdata message----", data)
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        console.log('Hii')
        fetch(`${base_url}` + "/message-send", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authtoken": token ? 'Bearer'+token : null,
          },
          body: JSON.stringify(data),
        })
          // .then(response =>response.json(),
          // console.log('response',response))
          .then(res => {
            console.log('res message',res)
            // if (res.STATUSCODE === 2000) {
            //         this.setState({ loading: false }) 
            // }      
          })
          .catch((error) => {
            this.setState({ loading: false })
             console.error('Error: message', error);
          });
      } else {
        this.setState({ loading: false })
        this.refs.toast.show("Network error")
      }

    })
  }


  getMessageList = async () => {
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const userId = JSON.parse(user)._id
    const navParam = this.props.navigation.state.params;

    console.log('userId',userId);
    console.log('from user id',navParam.callerid)

    var data = {
        // authtoken:'Bearer'+token,
        from_user:userId,
        to_user: navParam ? navParam.callerid:'',
       
        
      }
  
    console.log("formdata message----", data)
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        console.log('Hii')
        fetch("http://68.183.173.21:3113/apiAdmin/chathistory", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // "Authtoken": token ? 'Bearer'+token : null,
          },
          body:JSON.stringify(data),
        })
          .then(response =>response.json())
          .then(res => {
            console.log('res message list',res)
            this.setState({
              data:res.response.history
            })
            // if (res.STATUSCODE === 2000) {
            //         this.setState({ loading: false }) 
            // }      
            console.log('msg',this.state.data)
          })
          .catch((error) => {
            this.setState({ loading: false })
             console.error('Error: message', error);
          });
      } else {
        this.setState({ loading: false })
        this.refs.toast.show("Network error")
      }

    })
  }

  

  videoView() {
    const navParam = this.props.navigation.state.params;
    const navUserid = navParam ? navParam.userId : '';
    const navCallerId = navParam ? navParam.callerid : '';
    const navtimeForTalking = navParam ? navParam.timeForTalking : '';
    const selectedspecialization = navParam
      ? navParam.selectedspecialization
      : 'EMPTY';
    console.log('parms', this.props.navigation.state.params);
    const values1 = this.props.SingleUserOnline
      ? this.props.SingleUserOnline
      : 'EMPTY';
    const messageData=this.state.data.length>3 ?this.state.data.slice(-3):this.state.data
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.1)'}}>
        {this.props.userListing ? (
          <ListModal
            show={this.state.addCall}
            setVisibility={() => this.setState({addCall: false})}
            userData={this.props.userListing ? this.props.userListing : 'EMPTY'}
            channelId={navParam ? navParam.channelid : ''}
            timeForTalking={navParam ? navParam.timeForTalking : ''}
            callType={navParam ? navParam.callType : ''}
            selectedspecialization={selectedspecialization}
            onlineUserCheck={
              this.state.onlineUsers ? this.state.onlineUsers : ''
            }
            rating={this.props.userListing ? this.props.userListing.rating : ''}
            onStarRatingPress={rating => this.onStarRatingPress(rating)}
          />
        ) : null}
        <RatingComponent
          userName={navParam ? navParam.fullname : ''}
          callerName={navParam ? navParam.callerName : ''}
          callerId={navCallerId}
          userId={this.state.id}
          show={this.state.addRating}
          setVisibility={() => this.onCancelRating()}
          rating={this.state.starCount}
          onStarRatingPress={rating => this.onStarRatingPress(rating)}
          saveRating={() => this.onSaveRatingValue()}
          // abuseReport={(nav)=>this.abuseReport(nav)}
        />
        {this.state.peerIds.length > 3 ? ( //view for four videostreams
          <View style={{flex: 1}}>
            <View style={{flex: 1 / 2, flexDirection: 'row'}}>
              <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={this.state.peerIds[0]}
                mode={1}
              />
              <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={this.state.peerIds[1]}
                mode={1}
              />
            </View>
            <View style={{flex: 1 / 2, flexDirection: 'row'}}>
              <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={this.state.peerIds[2]}
                mode={1}
              />
              <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={this.state.peerIds[3]}
                mode={1}
              />
            </View>
          </View>
        ) : this.state.peerIds.length > 2 ? ( //view for three videostreams
          <View style={{flex: 1}}>
            <View style={{flex: 1 / 2}}>
              <AgoraView
                style={{flex: 1}}
                remoteUid={this.state.peerIds[0]}
                mode={1}
              />
            </View>
            <View style={{flex: 1 / 2, flexDirection: 'row'}}>
              <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={this.state.peerIds[1]}
                mode={1}
              />
              <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={this.state.peerIds[2]}
                mode={1}
              />
            </View>
          </View>
        ) : this.state.peerIds.length > 1 ? ( //view for two videostreams
          <View style={{flex: 1}}>
            <AgoraView
              style={{flex: 1}}
              remoteUid={this.state.peerIds[0]}
              mode={1}
            />
            <AgoraView
              style={{flex: 1}}
              remoteUid={this.state.peerIds[1]}
              mode={1}
            />
          </View>
        ) : this.state.peerIds.length > 0 ? ( //view for videostream
          <AgoraView
            style={{flex: 1}}
            remoteUid={this.state.peerIds[0]}
            mode={1}
          />
        ) : (
          <View />
        )}
        {!this.state.vidMute ? ( //view for local video
          <AgoraView
            style={styles.localVideoStyle}
            zOrderMediaOverlay={true}
            showLocalVideo={this.state.showLocal}
            mode={1}
          />
        ) : (
          <View />
        )}

   <View style={{position: 'absolute', top: 80, right: 40, zIndex: 9999}}>
          {this.state.peerIds.length > 0 ? (
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                zIndex: 999,
                fontWeight: '800',
              }}>
              {this.state.fullName ? this.state.fullName : ''}
            </Text>
          ) : null}
        </View>

        <View style={{position: 'absolute', top: 80, left: 30, zIndex: 9999}}>
          {this.state.peerIds.length > 0 ? (
            this.state.id == navUserid ? (
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  zIndex: 999,
                  fontWeight: '800',
                }}>
                {navParam ? navParam.callerName : ''}
              </Text>
            ) : (
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  zIndex: 999,
                  fontWeight: '800',
                }}>
                {navParam ? navParam.userName : ''}
              </Text>
            )
          ) : null}
        </View>


        <View style={styles.buttonTopic}>
          <View
            style={{
              width: Devicewidth,
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent:'space-around',
              // width:'100%',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                 marginLeft: '30%',
                fontWeight: '800',
              }}>
              Topic:-
            </Text>
            <FlatList
              keyExtractor={item => item._id}
              data={selectedspecialization.slice(0, 1)}
              // ListEmptyComponent={this._listEmptyComponentStandBy}
              extraData={this.state}
              renderItem={({item, index}) => {
                return (
                  <>
                    <View style={{alignSelf: 'auto'}}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 13,
                          fontWeight: '600',
                        }}>
                        {item.name}
                      </Text>
                    </View>
                  </>
                );
              }}
              removeClippedSubviews={false}
              horizontal={true}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
          {/* <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 18, textAlign: "center", paddingTop: 5 }}>Starting a business</Text>
          </View> */}
<View style={{marginRight:'30%',marginTop:'1%'}}>
{this.state.peerIds.length > 0 && navtimeForTalking != '' ? (
              <Timer time={navtimeForTalking} onTimerEnd={this.onTimerEnd} />
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  color: '#fff',
                  // marginRight: -40,
                }}>{`${0}:${0}`}</Text>
            )}
        </View>
        </View>

      
<KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={+30}
              style={{ flex:1, backgroundColor:'transparent',zIndex:999,position:'absolute',bottom:0}}
                    behavior="padding"
                    enabled>

     

        {/* <View style={[styles.buttonBar, { justifyContent: 'space-around' }]}>
          <View style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: "#000", alignItems: "center", alignContent: "center", justifyContent: "center", marginTop: -190 }}>
            <Icon style={styles.iconStyle}
              // backgroundColor="#0093E9"
              color="white"
              name={this.state.vidMute ? 'videocam-off' : 'videocam'}
              onPress={() => this.toggleVideo()}
            />
          </View>


          <View style={{ marginTop: -250 }}>
            <DisconnectBtn onTap={() => this.endCall()} />
          </View>

          <View style={{ marginTop: -190 }}>
            <MuteBtn isMuted={this.state.audMute} onTap={() => this.toggleAudio()} />
          </View>

        </View> */}

       
       <View style={styles.modalView}>
          
          <View style={{}}>
            <View style={{width:'80%'}}>
          { messageData.map((item,index)=> {
              return (
            <View>
               { this.state.data.length>2  && (index==0)?
                <View style={{backgroundColor:'rgba(0,0,0,0.2)',borderRadius:25,
                flexDirection: "row",
                    // width: "60%",
                    alignSelf: "flex-start",
                    alignItems:'center',
                    margin:2
                    }}>
                      <View
                      style={{width:35,height:35,borderRadius:40,borderWidth:2,borderColor:'white',alignSelf:'flex-start',margin:5,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{color:'white',fontWeight:'bold',fontSize:18}}>{item.user_fullname.charAt(0)}</Text>
                      </View>

                  <Text
                  style={{textAlign:'center',padding:10,paddingLeft:0,color:'white',fontWeight:'400'}}
                  >{item.message}</Text>
                </View>
               
               :
               <View style={{backgroundColor:'rgba(0,0,0,0.5)',borderRadius:25,
                flexDirection: "row",
                    // width: "60%",
                    alignSelf: "flex-start",
                    alignItems:'center',
                    margin:2
                    }}>
  <View
                      style={{width:35,height:35,borderRadius:40,borderWidth:2,borderColor:'white',alignSelf:'flex-start',margin:5,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{color:'white',fontWeight:'bold',fontSize:18}}>{item.user_fullname.charAt(0)}</Text>
                      </View>
                                        <Text
                  style={{textAlign:'center',padding:10,paddingLeft:0,color:'white',fontWeight:'400'}}
                  >{item.message}</Text>
                </View>}
                </View>
              );
            })}

            </View>
           
            <View style={{position:'absolute',bottom:0,right:0}}>
              <View style={{margin: 15}}>
                {navParam.callType == 0 && navParam.type == 'create' ? (
                  <AddBtn onTap={() => this.addCallFunction()} />
                ) : (
                  <View style={{width: 30, height: 30}} />
                )}
              </View>
       <View style={{}}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 30,
                  backgroundColor: '#000',
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                  marginVertical: 15,
                  marginLeft:23
                  // marginLeft:20
                }}>
                <Icon
                  style={styles.iconStyle}
                  // backgroundColor="#0093E9"
                  color="white"
                  name={this.state.vidMute ? 'videocam-off' : 'videocam'}
                  onPress={() => this.toggleVideo()}
                />
              </TouchableOpacity>

              <View style={{margin: 15,
                 marginLeft:23
                }}>
                <DisconnectBtn onTap={() => this.endCall()} />
              </View>

              <View style={{margin: 15, 
                 marginLeft: 23,
                }}>
                <MuteBtn
                  isMuted={this.state.audMute}
                  onTap={() => this.toggleAudio()}
                />
              </View>
              </View>
            </View>
          </View>
        
            <View style={{flexDirection: 'row',justifyContent:'space-between',width:'93%',alignSelf:'center'}}>
              <View style={styles.bottom}>
                <TextInput
                  // multiline={true}
                  // numberOfLines={5}
                  style={styles.input}
                  value={this.state.textMessage}
                  placeholder="Message..."
                  placeholderTextColor="grey"
                  onChangeText={text =>
                    this.setState({
                      textMessage: text,
                    })
                  }
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.btntxt}
                  onPress={() => {
                    // this.setState({
                    //   data: [...this.state.data, this.state.textMessage],
                    // });
                      this.onSendMessage()
                    // this.setState({
                    //   textMessage:''
                    // })
                  }}>
                  <Image
                    style={styles.sendicon}
                    source={require('../../../assets/home/Message.png')}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 30,
                  backgroundColor: '#000',
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                  marginTop:10,
                  marginRight:0
                  // margin: 15,
                  // marginRight:18
                }}
                onPress={() => this.switchCamera()}>
                <Icon
                  style={styles.iconStyle}
                  backgroundColor="#0093E9"
                  color="white"
                  name="switch-camera"
                  onPress={() => this.switchCamera()}
                />
              </TouchableOpacity>
            </View>
          {/* <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {}}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable> */}
        </View>
        </KeyboardAvoidingView> 

      </SafeAreaView>
    );
  }

  toggleAudio = () => {
    let mute = this.state.audMute;
    console.log('Audio toggle', mute);
    RtcEngine.muteLocalAudioStream(!mute);
    this.setState({
      audMute: !mute,
    });
  };

  toggleVideo = () => {
    let mute = this.state.vidMute;
    console.log('Video toggle', mute);
    this.setState({
      vidMute: !mute,
    });
    RtcEngine.muteLocalVideoStream(!this.state.vidMute);
  };

  switchCamera = () => {
    RtcEngine.switchCamera();
  };

  endCall = () => {
    const data = this.props.navigation.state.params;
    if (this.state.peerIds.length > 1) {
      if (data.type == 'create') {
        socket.emit('leaveRoom', {
          userId: this.state.id,
          channelid: data.channelid,
        });
        RtcEngine.destroy();
        // this.props.navigation.goBack()
        this.setState({addRating: true});
      } else {
        RtcEngine.leaveChannel();
        RtcEngine.destroy();
        // this.props.navigation.goBack()
        this.setState({addRating: true});
      }
    } else {
      socket.emit('leaveRoom', {
        userId: this.state.id,
        channelid: data.channelid,
      });
      RtcEngine.destroy();
      // this.props.navigation.goBack()
      this.setState({addRating: true});
    }
  };
  render() {
    console.log(
      'this.state.peerIds.length ',
      this.state.selectedspecialization,
    );
    const values = this.props.userListing ? this.props.userListing : 'EMPTY';
    console.log(values, 'redux value');
    return <View style={{flex: 1}}>{this.videoView()}</View>;
  }
}

const mapStateToProps = state => {
  console.log('state', state.singleOnlineUsers);
  return {
    userListing: state.onlineUsers,
    SingleUserOnline: state.singleOnlineUsers,
    socketData: state.socketIncomingValue,
  };
};

export default connect(
  mapStateToProps,
  null,
)(VideoCalling);

const styles = StyleSheet.create({
  buttonBar: {
    // backgroundColor: '#000000',
    width: '100%',
    // position: 'absolute',
    top: 30,
    left: 10,
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  buttonTopic: {
    height: 30,
    backgroundColor: '#1f1f1f',
    display: 'flex',
    width: '100%',
    position: 'absolute',
    top: 40,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  localVideoStyle: {
    width: 145,
    height: 190,
    position: 'absolute',
    top: 100,
    right: 5,
    zIndex: 100,
  },
  iconStyle: {
    fontSize: 25,
    // paddingTop: 15,
    // paddingLeft: 40,
    // paddingRight: 40,
    // paddingBottom: 15,
    // borderRadius: 0,
  },
  timeStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalView: {
    // flex: 1,
    // position:'absolute',
    // bottom:0,
    backgroundColor:'transparent',
    // backgroundColor: "red",
    // flexGrow:1

    justifyContent: 'flex-end',
  },
  input: {
    padding: 10,
    flex: 1,
    color: 'black',
    fontSize: 16,
  },
  btntxt: {
    alignSelf: 'center',
    alignContent: 'flex-end',
    margin: 10,
  },
  bottom: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#ccc',
    // backgroundColor: "#1f1f1f",
    // justifyContent:'center',
    alignItems: 'center',
    width: '86%',
    borderRadius: 40,
    margin: 5,
    marginLeft:-5,
    marginBottom:20,
  },
  sendicon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
});
