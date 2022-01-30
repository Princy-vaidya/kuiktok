import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
const Circle = ({ text, selected,onClick }) => {
    return (
        <TouchableOpacity style={[styles.circle, selected ? styles.activeCircle : styles.inactiveCircle]}
          onPress ={onClick}
        >
            {selected && <Text style={styles.circleText}>{text}</Text>}
        </TouchableOpacity>
    )
}

export default Circle; 
const styles = StyleSheet.create({
    circle: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        justifyContent: "center",
        alignItems: 'center',
    },
    circleText: {
        color:"white"
    },
    activeCircle: {
        backgroundColor:"yellow",
    },
    inactiveCircle: {
        backgroundColor: "blue"
    },
})