import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native'
import StarRating from '../../../Components/ratingComponent/StarRating';

const Deviceheight = Dimensions.get('window').height;

const Rating = (props) => {
  console.log("??????", props)
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={props.show}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');

      }}
    >
      <View style={{ flex: 1, backgroundColor: "#0e0e0e" }} >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#1f1f1f', marginTop: Deviceheight * 0.25, marginBottom: Deviceheight * 0.35, marginHorizontal: '10%', borderRadius: 5, padding: '3%' }}>

          <View style={{ flex: 1, justifyContent: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 22, color: '#fff', textAlign: 'center', marginBottom: 10, fontWeight: "bold" }}>Time is up!</Text>
            {
              props.callerId == props.userId ?
                <Text style={{ fontSize: 17, color: '#fff', textAlign: 'center', marginBottom: 20, fontWeight: "800" }}>{'Got some perspective from' + " " + props.userName + " " + " " + '?'}</Text>
                :
                <Text style={{ fontSize: 17, color: '#fff', textAlign: 'center', marginBottom: 20, fontWeight: "800" }}>{'Got some perspective from' + " " + props.callerName + " " + " " + '?'}</Text>
            }
            <View style={{ marginHorizontal: 40, marginBottom: 20 }}>
              <StarRating
                disabled={false}
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
            {
              props.rating != 0 ?
                <TouchableOpacity
                  onPress={() => props.saveRating()}
                  activeOpacity={0.7}
                  style={{ backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 30, alignItems: 'center', marginHorizontal: "25%", borderRadius: 6, marginBottom: 60 }}
                >
                  <Text style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>Submit</Text>
                </TouchableOpacity>

                :
                <TouchableOpacity
                  onPress={() => props.setVisibility()}
                  activeOpacity={0.7}
                  style={{ backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 30, alignItems: 'center', marginHorizontal: "25%", borderRadius: 6, marginBottom: 60 }}
                >
                  <Text style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>cancel</Text>
                </TouchableOpacity>
            }

            {/* <TouchableOpacity
               onPress={(nav)=>props.abuseReport(nav)}
            >
              <Text style = {{color:"red",fontSize:20}} >Abuse Report</Text>
            </TouchableOpacity> */}

          </View>
        </View>

      </View>
    </Modal>


  );

}

export default Rating;

