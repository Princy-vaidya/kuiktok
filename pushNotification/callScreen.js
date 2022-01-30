import React from 'react'
import { View, Text, Modal, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
import { server } from '../Services/constants'
const socket = io(server);


const { width, height } = Dimensions.get('window')


export default CallReceive = (props) => {
  console.log("call recive ----->", props)
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.show}
      style={{ justifyContent: "center" }}
    //onDismiss = {props.setVisibility}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: "center" }} >
        <View style={{  backgroundColor: '#1f1f1f',  marginHorizontal: 5, borderRadius: 10, padding: '3%', flex: 0.25,borderWidth:0.5,borderColor:"white" }}>

          <Text style={{ fontWeight: "800", fontSize: 16, color: "#fff" }}>{`${props.fullName} is calling  ....`}</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 20,alignItems:"center" }}>

          <Image
            source={{ uri: props.profile ? props.profile : "data:image/jpeg;base64,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" }}
            style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 2, borderColor: "white",borderWidth:4 }}
        />

            <TouchableOpacity
              style={{ width: 60, height: 60, borderRadius: 35, backgroundColor: "red", alignItems: "center", alignContent: "center", justifyContent: "center" }}
              onPress={props.Reject}
            >
              <MaterialIcons
                name="call-end"
                size={40}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: 60, height: 60, borderRadius: 35, backgroundColor: "green", alignItems: "center", alignContent: "center", justifyContent: "center" }}
              onPress={props.Accept}
            >
              <Ionicons
                name="md-call"
                size={40}
                color="#fff"
              />
            </TouchableOpacity>

          </View>
        </View>
      </View>

    </Modal>
  )
}