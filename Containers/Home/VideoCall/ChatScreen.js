import React, { Component,useRef,useState,useEffect } from 'react'
import {View, Text,SafeAreaView,Image,TouchableOpacity,FlatList, KeyboardAvoidingView,StyleSheet,TextInput} from 'react-native'
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage'

const socket = io('http://3.128.124.147:3112');

const ChatScreen = (props) => {  {
    
    
      ChatScreen['navigationOptions'] = screenProps => ({
        header: null,
    })
   
    const [messages, setMessages] = useState([{from_user:'12345',text:'Hii Test',createdAt:'4:00pm'},{from_user:'34455',text:'Hello Princy, How rae you?',createdAt:'4:00pm'}]);
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [froms, setFrom] = useState('12345');
    const [textMessage, setTextMessages] = useState('');
    //  const [socket,setSocket]=useState(io(ENDPOINT));
    const [chatMessages, setChatMessages] = useState([]);
    const [statusOnline, setStatusOnline] = useState(false);
    const [loading, setLoading] = useState(false)


    let flatList = useRef();
    const isFocussed=props.navigation.isFocused();


    useEffect(function () {

        console.log('props',props)

       if(isFocussed){
        // getOnChatDetail()
        // getUserChatList();
         chatList();
       } 

    }, [isFocussed]);


    const getOnChatDetail = async () => {
        const user = await AsyncStorage.getItem('userdata');
        console.log('userId..',user)
        const userId = JSON.parse(user)._id
        const fromUser = userId;
        const toUser = props.navigation.state.params.callUserId;
        console.log('to user',toUser)
        setFrom(fromUser)
        let data = {
            from_user: fromUser,
            to_user: toUser,
        }
        socket.emit("user-join", data);

        socket.on('online-user', function (list) {
            console.log('socket online data==>', list);
            let status = false;

            const onlineUser = list.filter((item) => item === toUser)
            console.log('jjkl', onlineUser)
            if (onlineUser[0] === toUser) {
                status = true
            }
            setStatusOnline(status)
            console.log('status', statusOnline)
        });

    }


    const chatList = () => {
        socket.on('chat-list', function (message) {
            console.log('socket on data==>', message);
            setMessages(message.response_data.docs.reverse())

        });
    }

    // const getUserChatList = async () => {
    //     const authToken = await getToken();
    //     const fromUser = await getUserId();

    //     const toUser = route.params.chat.userDetails._id;
    //     let formData = new FormData();
    //     formData.append('from_user', fromUser);
    //     formData.append('to_user', toUser);

    //     setLoading(true)
    //     Network('/get-user-chat', 'post', formData, authToken)
    //         // .then(async (res) => {
    //         .then((res) => {
    //             setLoading(false)
    //             if (res.response_code === 2000) {
    //                 const messageList = res.response_data.docs.reverse();
    //                 setMessages(messageList)
    //             }
    //         })

    //         .catch((error) => {
    //             Toast.show(res.response_message);
    //         });

    // }

    const onSendMessage = async () => {
        const fromUser = await getUserId();
        const toUser = route.params.chat.userDetails._id;
        let data = {
            to_user: toUser,
            from_user: fromUser,
            message: textMessage,
        }

        console.log('data', data)
        socket.emit("send-message", data);
        setTextMessages('');

        socket.on('chat-list', function (message) {
            console.log('socket on data==>', message);
            if (message.response_code === 2000) {

                const messageList = message.response_data.docs.reverse();
                setMessages(messageList)
          
                console.log('mesg',message.response_data.docs)
            }
        });

    }



    const _renderMessageRow = (item, index) => {
        console.log('from', item)
        return (
            <View
                style={{
                    flexDirection: "row",
                    // width: "60%",
                    alignSelf:
                        item.from_user === froms ? "flex-end" : "flex-start",
                    backgroundColor:
                        item.from_user === froms ? "lightgrey" : "#E6B0AA",
                    borderTopLeftRadius: item.from_user === froms ? 15 : 0,
                    borderBottomRightRadius: item.from_user === froms ? 0 : 15,
                    borderTopRightRadius: item.from_user === froms ? 15 : 15,
                    borderBottomLeftRadius: item.from_user === froms ? 15 : 15,
                    borderRadius: 5,
                    marginBottom: 10,
                    marginLeft:item.from_user === froms ? 50 : 0,
                    marginRight:item.from_user === froms ? 0 :50
                }}
            >
                <View style={{ padding: 10,justifyContent:'space-between'}}>
                    <Text style={{
                        color: 'black',
                        fontSize: 16               
                    }}>
                        {item.text}
                    </Text>

                    <Text style={{
                    color: 'gray',
                    fontSize: 10,
                    paddingBottom: 5,
                    padding:5,
                    alignSelf: 'flex-end',   
                }}>
                  {item.createdAt}
                </Text>
                </View>
               
            </View>
        );
    }


      return (
          <SafeAreaView style={{flex:1, backgroundColor: '#1f1f1f'}}>
              <View style={{minHeight:50,borderBottomWidth:0.5,borderBottomColor:'gray',flexDirection:'row',alignItems:'center'}}>
              <View style={{width:'35%',flexDirection:'row'}}>
              <TouchableOpacity
              onPress={()=>props.navigation.goBack()}>   
            <Image source={require('../../../assets/home/back.png')} 
            style={{width:30,height:20,marginLeft:5,alignSelf:'center',marginTop:5}}/>             

              </TouchableOpacity>
              <Image source={require('../../../assets/home/user.png')} 
              style={{width:35,height:35,marginLeft:10}}/>
              </View>
              <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>Princy Vaidya</Text>
              </View>

              <FlatList
                data={messages}
                style={{ margin: 10 }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => _renderMessageRow(item, index)}
                ref={ref => (flatList = ref)}
                onLayout={() => flatList.scrollToEnd({ animated: true })}
                onContentSizeChange={() =>
                    flatList.scrollToEnd({ animated: true })
                }
                // contentContainerStyle={{marginBottom:200}}
            />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}
             keyboardVerticalOffset={+76}
            >
                <View style={styles.bottom}>
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        style={styles.input}
                        value={textMessage}
                        placeholder="Message..."
                        placeholderTextColor="grey"
                        onChangeText={(text) => setTextMessages(text)}
                    />
                    <TouchableOpacity
                        style={styles.btntxt}
                        onPress={() =>
                            {setMessages([...messages,{from_user:'12345',text:textMessage,createdAt:'4:00pm'}]);
                            setTextMessages('')
                    

                         } }
                    >
                        <Image style={styles.sendicon} source={require('../../../assets/home/Message.png')} />
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
             
          </SafeAreaView>
      )
    
}
}
const styles = StyleSheet.create({
    
    input: {
        padding: 10,
        flex: 1,
        color:'white',
        fontSize:16
    },
    btntxt: {
        alignSelf: "center",
        alignContent: "flex-end",
        margin: 10,
       
    },
    bottom: {
        flexDirection: "row",
        borderTopWidth: 0.5,
        borderColor: "#ccc",
        elevation: 0.5,
        backgroundColor: "#1f1f1f",
        justifyContent:'center',
        alignItems:'center'
    },
    sendicon: {
        height: 30,
        width: 30,
        resizeMode: "contain"
    },
   
   
});
export default ChatScreen;  