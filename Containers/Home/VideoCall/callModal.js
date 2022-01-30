import React from 'react'
import { View, Text, Modal, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import io from 'socket.io-client';
import StarRating from  "../../../Components/ratingComponent/StarRating";
import { server } from '../../../Services/constants'
const socket = io(server);


const DeviceHeight = Dimensions.get('window').height;

export default ListUsers = (props) => {

  const onCallJoin = async (data) => {
    await AsyncStorage.setItem("callerId", JSON.stringify(data._id))
    console.log("onedata",data)
    const user = await AsyncStorage.getItem('userdata')
    const id = JSON.parse(user)._id
    const fullname = JSON.parse(user).fullname
    const location = JSON.parse(user).location
    const age = JSON.parse(user).age
    const profileimage = JSON.parse(user).profileImage

    const callObj = {
      callerid: data._id,
      deviceId: data.deviceId,
      userId: id,
      channelid: props.channelId,
      type: 'join',
      timeForTalking: props.timeForTalking,
      userName: fullname,
      profileImage: profileimage,
      callerName:data.fullname,
      callType:props.callType,
      selectedspecialization:props.selectedspecialization,
      location:location,
      age:age?age:''
    }
    console.log("startcallobject", callObj)
    socket.emit('startCall', callObj)
    socket.emit('sendNotification', callObj)
  }

 const  _listEmptyComponentOnLine = () => {
    return (
      <View>
        <Text style={{ textAlign: "center", color: "#fff" }}>No User online in this record!</Text>
      </View>
    )
  }

  const OnlineListing = (props) => {
    const data = props.data
    console.log("DATRA+______", data);
    return (
      <View style={{ flex: 1, flexDirection: "row", backgroundColor: "#232323", paddingVertical: 10, marginBottom: 10, marginHorizontal: 10 }}>
      <View style={{ flex: 0.9 }}>
      <TouchableOpacity
        style={{ flexDirection: 'row'}}
        onPress={() => onCallJoin(data)}
      >
        <View style={{ flex: 0.3, alignItems: "center" }}>
          <Image
            source={{ uri: data.profileImage ? data.profileImage : 'http://3.128.124.147/kuiktokapi/public/uploads/no-img.jpg' }}
            style={{ height: 60, width: 60, borderRadius: 30, borderWidth: 2, borderColor: "gray" }}
          />

          <View
            onPress={() => alert("hello")}
            activeOpacity={0.7}
            style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "gray", position: "absolute", alignItems: "center", justifyContent: "center", alignContent: "center", right: "27%", }}
          >
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#00e74a" }} />
          </View>
        </View>

        <View style={{ flex: 0.7 }}>
          <Text style={{ color: "#d6d4d4", fontSize: 16 }}>{data.fullname}</Text>
          <Text style={{ color: "#d6d4d4", fontSize: 14 }}>{data.location}</Text>
          <View style={{ marginRight: 50 }}>
              <StarRating
                disabled={false}
                starSize={25}
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                halfStar={'ios-star-half'}
                iconSet={'Ionicons'}
                maxStars={5}
                rating={data.rating}
                selectedStar={(rating) => props.onStarRatingPress(rating)}
                fullStarColor={'#FAD65E'}
              />
          </View>
        </View>
      </TouchableOpacity>
      </View>

      <TouchableOpacity 
        // onPress={(val)=>data.modalOpen(val)}
        style={{ flex: 0.1 }} 
         activeOpacity={0.7}>
        <Entypo name="dots-three-vertical" size={24} color="#fff" />
      </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.show}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
        <View style={{ flex: 1, backgroundColor: '#0e0e0e', borderWidth: 1, borderRadius: 5, marginTop: 30, marginBottom: 0, borderRadius: 5, paddingVertical: 15 }}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 65 }}
            ListEmptyComponent={_listEmptyComponentOnLine}
            showsVerticalScrollIndicator={true}
            keyExtractor={(item) => item._id}
            data={props.userData}
            renderItem={({ item,index }) => {
              return (
                <>
                  {props.onlineUserCheck[index] == true &&
                <OnlineListing 
                 data={item}
                 />
                  }
                </>
              )
            }} />
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={props.setVisibility}
              style={{ position: "absolute", bottom: 5, width: 50, height: 50, borderRadius: 25, backgroundColor: "#000", alignContent: "center", justifyContent: "center", alignItems: "center" }}
            >
              <AntDesign
                name="close"
                size={20}
                color="#fff"

              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}