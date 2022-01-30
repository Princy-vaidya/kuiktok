import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Modal,Dimensions, } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StarRating from  "../../Components/ratingComponent/StarRating";
const DeviceHeight = Dimensions.get('window').height;

const OnlineListing = (props) => {
  const { title } = props;
  console.log("helllllll",props.blockUserStatus)
  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor:props.blockUserStatus == true ? "rgba(0,0,0,0.2)" : "#232323", paddingVertical: 10, marginBottom: 10, marginHorizontal: 10 }}>
      <View style={{ flex: 0.9 }}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={props.onClick}
          disabled ={props.disabled}
        >
          <View style={{ flex: 0.3, alignItems: "center" }}>
            <Image
              source={{ uri: props.profile ? props.profile : 'http://3.128.124.147/kuiktokapi/public/uploads/no-img.jpg' }}
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

          <View style={{ flex: 0.6 }}>
            <Text style={{ color: "#d6d4d4", fontSize: 16, marginBottom: 2 }}>{props.title}</Text>
            <Text style={{ color: "#d6d4d4", fontSize: 14, marginBottom: 3 }}>{props.address}</Text>
            <View style={{ marginRight:50,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{width:'100%'}}>
        <StarRating
                disabled={false}
                starSize={25}
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                halfStar={'ios-star-half'}
                iconSet={'Ionicons'}
                maxStars={5}
                rating={props.rating}
                selectedStar={(rating) => props.onStarRatingPress(rating)}
                fullStarColor={'#FAD65E'}
              />
              </View>
              <Text style={{color: "#d6d4d4",fontSize:16,fontWeight:'bold',marginLeft:20}}>{props.rating}</Text>
        </View>
         
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        onPress={(val)=>props.modalOpen(val)}
        style={{ flex: 0.1 }} 
         activeOpacity={0.7}>
        <Entypo name="dots-three-vertical" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType='fade'
        transparent={true}
        visible={props.show}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');

        }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ffffff', marginTop: DeviceHeight * 0.22, marginBottom: DeviceHeight * 0.55, marginHorizontal: '10%', borderRadius: 5, padding: '3%',marginLeft:DeviceHeight * 0.20}}>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity
                onPress={props.close}
                activeOpacity={0.5}
              >
                <MaterialIcons
                  name='close'
                  size={30}
                  color='#c0c0c0'
                />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ffffff',alignItems:"center" }}>  
                <Text style={{borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 28, justifyContent: 'center', marginBottom:10,fontSize:16}} onPress={props.navUser}>Abuse report </Text>
                {
                  props.blockUserStatus == false ?
                  <Text style={{borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 35, justifyContent: 'center', marginBottom:5,fontSize:16}} onPress={props.navBlock} >Block User</Text>
                  :
                  <Text style={{borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 35, justifyContent: 'center', marginBottom:5,fontSize:16}} onPress={props.navBlock} >Unblock User</Text>
                }
                
                  
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

export default OnlineListing;