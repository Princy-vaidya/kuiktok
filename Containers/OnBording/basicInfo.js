import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, Modal, KeyboardAvoidingView, TextInput, StatusBar, SafeAreaView } from 'react-native';
import { connect, change } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import AsyncStorage from '@react-native-community/async-storage';
import { base_url } from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-tiny-toast'

import moment from 'moment'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { renderField1, renderField2, datePicker, googlePlaceSearch } from "../../Components/ReduxForm/inputs"
const Deviceheight = Dimensions.get('window').height;
const Devicewidth = Dimensions.get('window').width;

class BasicInfo extends Component {

  static navigationOptions = {
    header: null
  };

  state = {
    fullNamePersonal: "",
    dobPersonal: 'YYYY-MM-DD',
    dobExpert: 'YYYY-MM-DD',
    isDateTimePickerVisiblePersonal: false,
    isDateTimePickerVisibleExpert: false,
    address_string: '',
    googleAddress: {},
    UData: {}
  }

  _showDateTimePickerPersonal = () => this.setState({ isDateTimePickerVisiblePersonal: true });

  _hideDateTimePickerPersonal = () => {
    this.setState({ isDateTimePickerVisiblePersonal: false });
  }

  _handleDatePickedPersonal = (dobPersonal) => {
    this.setState({ dobPersonal: moment(dobPersonal).format("YYYY-MM-DD"), isDateTimePickerVisiblePersonal: false });
  }

  googleAddressChange = (data, details) => {
    console.log('city---*******', details)
    let city = details.address_components.filter(
      gcity => gcity.types[0] == "locality"
    )
    let cityName = ''
    if (city.length == 0) {
      let subcity = details.address_components.filter(
        gcity => gcity.types[1] == "sublocality"
      )
      cityName = subcity[0].long_name

    }
    console.log('city---*******', cityName)

    let country = details.address_components.filter(
      gcountry => gcountry.types[0] == "country"
    )
    //console.log('country---', country[0].long_name)
    let googleAddress = { city: city.length > 0 ? city[0].long_name : cityName, country: country.length > 0 ? country[0].long_name : '' }
    const address = details.formatted_address

    this.setState({
      googleAddress: googleAddress,

    }, () => {
      // this.props.googleAddress(this.state.agoogleAddress)
    })
  }

  componentDidMount = async () => {
    this.getLocalData();
    this.listUserpersonal()
  };


  getLocalData = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const UData = JSON.parse(user)
    this.setState({ UData })
  }


  getAge = (DOB) => {
    console.log("DOB", DOB)
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }
    return age;
  }

  

  editProfilePersonal = async (DOB) => {
    const { UData, fullNamePersonal, dobPersonal, googleAddress } = this.state
    this.setState({ loading: true })
    let form = new FormData();
    form.append("_id", UData.id ? UData.id : null || UData._id ? UData._id : null);
    // form.append("authtoken", UData.token ? UData.token : null || UData.authtoken ? UData.authtoken : null);
    form.append("userType", "1");
    form.append("fullname", this.state.fullNamePersonal);
    form.append("dob", this.state.dobPersonal);
    form.append("age", this.getAge(this.state.dobPersonal));
    form.append("location", this.state.googleAddress.city + ", " + this.state.googleAddress.country);
    form.append("googleAddress", JSON.stringify(this.state.googleAddress));
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "editUser", {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'multipart/form-data',
            "authtoken": UData.token ? UData.token : null || UData.authtoken ? UData.authtoken : null
          },
          body: form,
        })
          .then(response => response.json())
          .then(async (res) => {
            if (res.STATUSCODE === 2000) {
              this.setState({ loading: false, flagDisable: false })
              Toast.show('profile has been updated sucessfully!',{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })

              await AsyncStorage.setItem("userdata", JSON.stringify(res.response), async () => {
                const user = await AsyncStorage.getItem('userdata')
                const UData = JSON.parse(user)
                this.setState({ UData }, () => {
                })
              }, async () => {
                await this.listUserpersonal();
              })
            }
            else if (res.STATUSCODE === 4002) {
              this.setState({ loading: false })
              Toast.show(res.message,{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })

            }
            else {
              this.setState({ loading: false })
              Toast.show("Something went wrong please try again !",{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })
            }
          })
          .catch((error) => {
            this.setState({ loading: false })
            Toast.show('error',{
              position: Toast.position.center,
              containerStyle:{backgroundColor: '#f6ff00'},
              textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
             
            })
            // console.error('Error:', error);
          });
      } else {
        this.setState({ loading: false })
        // this.refs.toast.show("Network error")
      }

    })
  }

  listUserpersonal = async (id) => {
    const user = await AsyncStorage.getItem('userdata')
    const authtoken = JSON.parse(user).authtoken
    const _id = JSON.parse(user)._id
    // const userType = this.state.tab
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + 'listUser?_id=' + `${_id}` + '&userType=' + `${"1"}`, {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authtoken: authtoken,
          },
          // / body: JSON.stringify(object),
        })
          .then(response => response.json())
          .then(res => {
            console.log("helloscdsfsfsfsfsf", res)
            if (res.STATUSCODE === 2000) {
              this.setState({ loading: false })
              res.response.map(data => {
                const { fieldData } = this.state
                // if (data.location == '') {
                //   this.setState({ flagDisable: true })
                // } else {
                //   this.setState({ flagDisable: false })
                // }
              
                this.setState({
                  fullNamePersonal: data.fullname,
                  dobPersonal: (data.dob) ? moment(data.dob).format("YYYY-MM-DD") : '',
                  googleAddress: { city: data.city, country: data.country },
                })
              })

            }
            else if (res.STATUSCODE === 4002) {
              this.setState({ loading: false })
              Toast.show(res.message,{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })
            }
            else {
              this.setState({ loading: false })
              Toast.show("Something went wrong please try again !",{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })
            }
          })
          .catch((error) => {
            this.setState({ loading: false })
           console.error('Error:', error);
          });
      } else {
        this.setState({ loading: false })
        console.error('Error:', error);
      }

    })
  }


  next = () => {
    const { UData, fullNamePersonal, dobPersonal, googleAddress } = this.state
    if (fullNamePersonal.length === 0) {
      Toast.show('please enter name',{
        position: Toast.position.CENTER,
        containerStyle:{backgroundColor: '#f6ff00'},
        textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
       
      })
    }
   else if (dobPersonal == "YYYY-MM-DD") {
      Toast.show('DOB is required !',{
        position: Toast.position.CENTER,
        containerStyle:{backgroundColor: '#f6ff00'},
        textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
       
      })
    }
  else if (googleAddress === null) {
      Toast.show('Address is required',{
        position: Toast.position.CENTER,
        containerStyle:{backgroundColor: '#f6ff00'},
        textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
       
      })
    }
    else{
      this.editProfilePersonal()
      this.props.onClick()
    }
  
  }


  render() {
    const { navigation } = this.props
    console.log("he31z5-------->",this.state.googleAddress)
    return (
      <>
      <View style={{ flex: 1, backgroundColor: '#0e0e0e' }}>
        <SafeAreaView >
     
          <View style={{ alignItems: "center", marginBottom: 10, marginTop: 20 }}>
            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "bold" }}>BASIC INFO</Text>
          </View>

          <View style={{ backgroundColor: "#f6ff00", marginHorizontal: 40, borderRadius: 10, paddingVertical: 10, marginBottom: 40,paddingHorizontal:10 }}>
            <Text style={{ fontSize: 16, color: "#000000", textAlign: "center" }}>
              Let's get you all set up and ready to connect
           </Text>
          </View>

          <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 20, marginHorizontal: 30 }}>
            <Field
              titleName="Your Name"
              keyboardType="default"
              val={this.state.fullNamePersonal}
              component={renderField1}
              changeField={fullNamePersonal => this.setState({ fullNamePersonal })}
              name="username"
              colorFlag={"yellow"}
              fontFlag={"large"}
            />
          </View>

          <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 30, marginHorizontal: 30 }}>
            {/* {this.renderLocation()} */}
            <Field
              titleName="Location"
              component={googlePlaceSearch}
              dValue={Object.keys(this.state.googleAddress).length != 0 && this.state.googleAddress.city ? this.state.googleAddress.city + "," + this.state.googleAddress.country : ''}
              name="address"
              valueChange={(data, details) => this.googleAddressChange(data, details)}
              colorFlag={"yellow"}
              fontFlag={"large"}
            />
          </View>

          <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 10, marginHorizontal: 30 }}>
            <Field
              component={datePicker}
              titleName="Date Of Birth"
              visible={this.state.isDateTimePickerVisiblePersonal}
              confirm={this._handleDatePickedPersonal}
              cancel={this._hideDateTimePickerPersonal}
              dob={this.state.dobPersonal}
              changeField={dobPersonal => this.setState({ dobPersonal: dobPersonal })}
              show={this._showDateTimePickerPersonal}
              name="age"
              colorFlag={"yellow"}
              fontFlag={"large"}
            // maxDate={new Date()}
            />
          </View>

          <TouchableOpacity style={{
            borderWidth: 2,
            borderRadius: 20,
            borderColor: '#f6ff00',
            paddingHorizontal: 20,
            paddingVertical: 5,
            position: "absolute",
            bottom: -100,
            right: 20
          }}
            onPress={() => this.next()}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Next
                       </Text>
          </TouchableOpacity>

        </SafeAreaView>
      </View>

     
       {/* <Toast
            ref="toast"
            style={{ backgroundColor: '#f6ff00' }}
            position='top'
            positionValue={20}
            textStyle={{ color: '#000', fontSize: 16, fontWeight: "bold" }}
          />  */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  formState: state.form,
});

const FormComponent = connect(
  mapStateToProps, {
  googleAddress: val => change('user', 'googleAddress', val),
}
)(BasicInfo)

export default reduxForm({
  form: 'BasicInfo',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  // validate,
})(FormComponent)

