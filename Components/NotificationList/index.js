import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const NotificaionListing = (props) => {
  const { title } = props;
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', backgroundColor: "#232323", paddingVertical: 10, marginBottom: 10, marginHorizontal: 10 }}
      onPress={props.onClick}
    >
  
      <View style={{ flex: 0.3, alignItems: "center" }}>
        <Image
          source={{ uri: props.profile ? props.profile : 'http://3.128.124.147/kuiktokapi/public/uploads/no-img.jpg' }}
          style={{ height: 60, width: 60, borderRadius: 30, borderWidth: 2, borderColor: "gray" }}
        />

       { props.dataOnline == true ? <View
          onPress={() => alert("hello")}
          activeOpacity={0.7}
          style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "gray", position: "absolute", alignItems: "center", justifyContent: "center", alignContent: "center", right: "27%", }}
        >
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#00e74a" }} />
        </View> : <View
          onPress={() => alert("hello")}
          activeOpacity={0.7}
          style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "gray", position: "absolute", alignItems: "center", justifyContent: "center", alignContent: "center", right: "27%", }}
        >
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "grey" }} />
        </View> }
      </View>

      <View style={{ flex: 0.7 }}>
        <Text style={{ color: "#d6d4d4", fontSize: 12 }}> {props.subName}</Text>
        <Text style={{ color: "#fff", fontSize: 14 }}>{props.dateTime}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default NotificaionListing;