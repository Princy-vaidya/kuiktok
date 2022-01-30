import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DateTimePicker from "react-native-modal-datetime-picker";


const Devicewidth = Dimensions.get('window').width;

export const renderField = ({ iconType, iconName, iconSize, iconColor, titleName, changeField, val, keyboardType, maxLength, textContentType, secureTextEntry, returnKeyType, name, input: { onChange, ...restInput }, meta: { touched, error, warning } }) => {
  return (
    <View style={{ paddingBottom: 15 }}>
      <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#494848', marginHorizontal: 50, paddingVertical: 10 }}>
        <Text style={{ color: "#494848", fontSize: 14, marginBottom: 8 }}>{titleName}</Text>
        <View style={{ height: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flex: 0.1, alignItems: 'flex-start' }}>
            {iconType === "Feather" ?
              <Feather
                style={{ paddingBottom: 2 }}
                name={iconName}
                size={iconSize}
                color={iconColor}
              /> :
              iconType === "MaterialIcons" ?
                <MaterialIcons
                  style={{ paddingBottom: 6 }}
                  name={iconName}
                  size={iconSize}
                  color={iconColor}
                />
                :
                iconType === "MaterialCommunityIcons" ?
                  <MaterialCommunityIcons
                    style={{ paddingBottom: 2 }}
                    name={iconName}
                    size={iconSize}
                    color={iconColor}
                  />
                  :
                  iconType === "SimpleLineIcons" ?
                    <SimpleLineIcons
                      style={{ paddingBottom: 2 }}
                      name={iconName}
                      size={iconSize}
                      color={iconColor}
                    />

                    : null}

          </View>
          <View style={{ flex: 0.9, alignItems: 'flex-start' }}>
            <TextInput
              style={styles.user}
              value={val}
              // onChangeText={onChange} {...restInput}
              onChangeText={(val) => { onChange(val); changeField(val) }}
              textContentType={textContentType}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              returnKeyType={returnKeyType}
              maxLength={maxLength}
              enablesReturnKeyAutomatically
              selectTextOnFocus={true}
              spellCheck={false}
            >
              {name}
            </TextInput>
          </View>
        </View>
      </View>
      {touched && ((error && <Text style={{ color: 'red', textAlign: "center" }}>{error}</Text>) ||
        (warning && <Text style={{ color: 'orange' }}>{warning}</Text>))}
    </View>
  );
};


export const renderField1 = ({ titleName, keyboardType, maxLength, textContentType, secureTextEntry, returnKeyType, name, val, changeField,colorFlag,fontFlag, input: { onChange, ...restInput }, meta: { touched, error, warning } }) => {
  return (
    <View style={{ paddingBottom: 10, }}>
      <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#494848', marginHorizontal: 25, paddingVertical: 10 }}>
        <Text style={{ color:colorFlag == "yellow" ? "#f6ff00" : "#494848", fontSize:fontFlag == "large" ? 18 : 14, marginBottom: 16 }}>{titleName}</Text>
        <View style={{ flex: 1, height: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TextInput
            style={styles.user}
            value={val}
            // onChangeText={onChange} {...restInput}
            onChangeText={(val) => { onChange(val); changeField(val) }}
            textContentType={textContentType}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            maxLength={maxLength}
            enablesReturnKeyAutomatically
            selectTextOnFocus={true}
            spellCheck={false}
          >
            {name}
          </TextInput>
        </View>
      </View>
      {touched && ((error && <Text style={{ color: 'red', textAlign: "center", }}>{error}</Text>) ||
        (warning && <Text style={{ color: 'orange' }}>{warning}</Text>))}
    </View>
  );
};

export const renderField2 = ({ titleName, keyboardType, maxLength, editable, textContentType, secureTextEntry, returnKeyType, name, onPress, val, changeField, input: { onChange, ...restInput }, meta: { touched, error, warning, asyncValidating } }) => {
  return (
    <View style={{ paddingBottom: 10, }}>
      <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#494848', marginHorizontal: 25, paddingVertical: 10 }}>
        <Text style={{ color: "#494848", fontSize: 14, marginBottom: 16 }}>{titleName}</Text>
        <View style={{ flex: 1, height: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TextInput
            style={styles.user}
            value={val}
            // onChangeText={onChange} {...restInput}
            onChangeText={(val) => { onChange(val); changeField(val) }}
            textContentType={textContentType}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            maxLength={maxLength}
            enablesReturnKeyAutomatically
            selectTextOnFocus={true}
            spellCheck={false}
            editable={editable}
          >
            {name}
          </TextInput>
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{ position: "absolute", left: "90%", bottom: -1, width: 20, height: 20, borderRadius: 10, backgroundColor: "white", position: "absolute", alignItems: "center", justifyContent: "center", alignContent: "center", right: "42%", tintColor: "red" }}
          >
            <Image
              style={{ width: 14, height: 13, }}
              source={require("../../assets/user/edit.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      {touched && ((error && <Text style={{ color: 'red', textAlign: "center", }}>{error}</Text>) ||
        (warning && <Text style={{ color: 'orange' }}>{warning}</Text>))}
    </View>
  );
};

export const datePicker = ({ titleName, dob, editable, returnKeyType,colorFlag,fontFlag ,name, input: { onChange, ...restInput }, meta: { touched, error, warning }, confirm, visible, cancel, show, changeField }) => {
  return (
    <View style={{ paddingBottom: 10, }}>
      <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#494848', marginHorizontal: 25, paddingVertical: 10 }}>
        <Text style={{ color:colorFlag == "yellow" ? "#f6ff00" : "#494848", fontSize:fontFlag == "large" ? 18 : 14, marginBottom: 16 }}>{titleName}</Text>
        <View style={{ flex: 1, height: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TextInput
            style={styles.user}
            value={dob}
            onChangeText={(val) => { onChange(val); changeField(val) }}
            returnKeyType={returnKeyType}
            enablesReturnKeyAutomatically
            selectTextOnFocus
            spellCheck={false}
             editable={false}
          >
            {name}
          </TextInput>
          <TouchableOpacity
            style={{ position: 'absolute', right: 10, bottom: -4 }}
            onPress={show}
            activeOpacity={0.7}
          >
            <EvilIcons
              name="calendar"
              size={25}
              color="#fff"
            />
          </TouchableOpacity>

          <DateTimePicker
            isVisible={visible}
            onConfirm={(val) => {
              confirm(val)
              onChange(val)
            }}
            onCancel={(val) => {
              cancel(val)
              onChange(val)
            }}
          />
        </View>
      </View >
      {touched && ((error && <Text style={{ color: 'red', textAlign: "center", }}>{error}</Text>) ||
        (warning && <Text style={{ color: 'orange' }}>{warning}</Text>))}
    </View>
  );
};

export const googlePlaceSearch = ({ dValue, titleName, valueChange,colorFlag,fontFlag, input: { onChange, ...restInput }, meta: { touched, error, warning } }) => {
  console.log("dValue===>", dValue);

  return (
    <View style={{}}>
      <View style={{ marginHorizontal: 25, borderBottomWidth: 0.8, borderBottomColor: '#494848', }}>
        <Text style={{ color:colorFlag == "yellow" ? "#f6ff00" : "#494848", fontSize:fontFlag == "large" ? 18 : 14, }}>{titleName}</Text>
        <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <GooglePlacesAutocomplete
            styles={{
              textInputContainer: {
                //  width: Devicewidth-20,
                backgroundColor: "#232323",
                borderBottomColor: "#232323",
                borderTopColor: "#232323",
                height: -44,
              },
              container: {
                marginRight: 10,
              },
              textInput: {
                width: Devicewidth,
                backgroundColor: "#232323",
                color: "#a1a1a1",
                height: 20,
                paddingTop: -4.5,
                paddingBottom: -4.5,
                paddingLeft: -10,
                marginLeft: -0.3,
                fontSize: 15,
                flex: 1,
                alignItems: "flex-start"
              },
              description: {
                color: "#a1a1a1",
              },
              poweredContainer: {
                backgroundColor: "#232323"
              },
            }}
            enablePoweredByContainer={false}
            placeholder={null}
            minLength={3} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed={false}    // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {  // 'details' is provided when fetchDetails = true
              valueChange(data, details);
              // console.log("adadadadad",details)
            }}
            getDefaultValue={() => dValue ? dValue.toString() : ""}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyCzDqd5KJk6f4iL7H8CnRbJUHa4rqdnonY',
              language: 'en', // language of the results
              // types: '(locality)' // default: 'geocode'
            }}

            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
              types: 'food'
            }}

            filterReverseGeocodingByTypes={["city", "political"]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            predefinedPlaces={[]}

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            renderLeftButton={() => null}
            renderRightButton={() => null}
          />
        </View>
      </View>
      {touched && ((error && <Text style={{ color: 'red', textAlign: "center", }}>{error}</Text>) ||
        (warning && <Text style={{ color: 'orange' }}>{warning}</Text>))}
    </View>

  )
}




const styles = StyleSheet.create({
  user: {
    width: "100%",
    height: 56,
    color: "#a1a1a1",
    fontSize: 14,
  },
  conditions: {
    color: 'gray',
    fontSize: 12,
  },
})

