import React from 'react'
import { TouchableOpacity, Text } from "react-native"
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const AddBtn = (props) => {
  return (
    <TouchableOpacity
      style= {{width:40,height:40,borderRadius:30,backgroundColor:"#000",alignItems:"center",alignContent:"center",justifyContent:"center"}}
      onPress={props.onTap}
    >
      <SimpleLineIcons
        name="plus"
        size={25}
        color="#fff"
      />
    </TouchableOpacity>
  )
}

export const DisconnectBtn = (props) => {
  return (
    <TouchableOpacity 
    style= {{width:40,height:40,borderRadius:30,backgroundColor:"red",alignItems:"center",alignContent:"center",justifyContent:"center"}}
       onPress={props.onTap}
     >
       <MaterialIcons
        name="call-end"
        size={25}
        color="#fff"
      />
    </TouchableOpacity>
  )
}

export const MuteBtn = (props) => {
  return (
    <TouchableOpacity 
    style= {{width:40,height:40,borderRadius:30,backgroundColor:"#000",alignItems:"center",alignContent:"center",justifyContent:"center"}}
       onPress={props.onTap}
     >
       <MaterialIcons
        name={props.isMuted ? 'mic-off' : 'mic'}
        size={25}
        color="#fff"
      />
    </TouchableOpacity>
  )
}