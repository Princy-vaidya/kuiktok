import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const ConversationTopics = (props) => {
  const { title } = props;
  return (
      <View style={{ flexDirection: 'row', backgroundColor: "#242223", borderRadius: 15, paddingVertical: 10, paddingHorizontal: 8, elevation: 2, justifyContent: "space-between", marginBottom: 15, marginHorizontal:4}}>
        <Text style={{ paddingRight: 10, color: "#fff", fontSize: 12 }}>{title}</Text>

        <EvilIcons
          onPress={props.onClick}
          name="close-o"
          size={24}
          color="#fff"
        />

      </View>
  );
}

export default ConversationTopics;



