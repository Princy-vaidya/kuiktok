import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import LabeledSwitch from '../../Components/CustomeSwitchNotification/index'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { settingNotificationUserType } from '../../Actions/userAction'
import Toast, { DURATION } from 'react-native-easy-toast'
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../navigation/AuthLoadingScreen'
import Apis from '../../Services/apis';
const Deviceheight = Dimensions.get('window').height;

let arr = []
class NotificationCenter extends Component {

  static navigationOptions = {
    title: "Notification Center",
    headerStyle: {
      marginTop: -20,
      backgroundColor: '#000',
      height: 60,

    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      fontSize: 18
    },

  }


  state = {
    value: "",
    expert: "",
    listUserTypeData: [],
    settingNotificationUserType: [],
    loading: false
  }

  componentDidMount = () => {
    arr = [];
    this.listUserType()
  }

  listUserType = async () => {
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    console.log("auth data", token)
    const data = {
      authtoken: token
    }
    Apis.listUserType(data)
      .then(async (res) => {
        if (res.STATUSCODE === 2000) {
          this.setState({ loading: false })
          await this.setState({ listUserTypeData: res.response })

        }
        else if (res.STATUSCODE === 4002) {
          this.setState({ loading: false })
          Toast.show('info' + res.message)
        }
        else {
          this.setState({ loading: false })
          Toast.show('Oops..' + 'Something went wrong please try again !')
        }
      }).catch((error) => {
        this.setState({ loading: false })
        console.error(error);
      });
  }


  settingNotification = async () => {
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const userId = JSON.parse(user)._id
    const data = {
      authtoken: token,
      userId: userId ? userId : null,
      settingNotificationUserType: this.state.settingNotificationUserType
    }

    await Apis.settingNotification(data)
      .then(async (res) => {
        if (res.STATUSCODE === 2000) {
          this.setState({ loading: false })
          setTimeout(() => {
            this.refs.toast.show( res.message.toString());
          }, 1000)
          console.log("usertype", res.response.settingNotificationUserType)
          this.setState({ userType: res.response.settingNotificationUserType })
          console.log("userdata11111=>", JSON.stringify(res.response));

          await AsyncStorage.setItem("userdata", JSON.stringify(res.response))
          this.props.settingNotificationUserType(this.state.userType)
        }
        else if (res.STATUSCODE === 5002) {
          this.setState({ loading: false })
          Toast.show('info' + res.message)
        }
        else {
          this.setState({ loading: false })
          Toast.show('Error!' + res.message)
        }
      }).catch((error) => {
        console.error(error);
      });
  }


  switchValue = (value, id, name, index) => {
    console.log("sdfkgjkfjsgkjkfjdgdfgdfgdfg---", value, id, index, name)
    const { listUserTypeData } = this.state
    listUserTypeData.map(data => {
      if (data._id == id) {
        this.setState({ [data._id]: true })
      } else {
        this.setState({ [data._id]: false })
      }
    })

    let arrayVal = []
    if (value !== undefined) {
      console.log("arr1======>")
      if (name == "Personal") {
        console.log("Personal-VALUE", id, value, arr);
        if (value === true) {
          arr[index] = "1"
        } else {
          arr.splice(index, 1);
        }
      } else {
        console.log("Expert-VALUE", id, value);
        if (value === true) {
          arr[index] = "2"
        } else {
          arr.splice(index, 1);
        }
      }
      console.log("arr======>", arr)

      arrayVal = arr.filter((a) => a !== null)
      console.log("arrVal======>", arrayVal)

      this.setState({ settingNotificationUserType: arrayVal })
    }

    // console.log("arr======>", arr)

  }


  render() {
    const { listUserTypeData } = this.state

    console.log("hello----->", this.state.settingNotificationUserType)
    return (
      <View style={{ height: Deviceheight, backgroundColor: '#1f1f1f', }}>
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        <View style={{ marginTop: 20, alignItems: "center", marginBottom: 20 }}>
          {/* <Text style={{ color: "#ffffff", fontSize: 18, marginBottom: 12 }}>Notification Center</Text> */}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 30, marginHorizontal: 50 }}>
          {
            listUserTypeData.map((data, index) => (
              <View>
                <Text style={{ color: "#fff", fontSize: 12, marginBottom: 5 }}>{data.name}</Text>
                <LabeledSwitch ref="lsr" active={this.state[data._id]} id={data._id} name={data.name} onValuesChange={(value) => this.switchValue(value, data._id, data.name, index)} />
              </View>
            ))
          }
        </View>


        <TouchableOpacity
          onPress={this.settingNotification}
          activeOpacity={0.7}
          style={{ marginTop: 50, borderWidth: 1, borderColor: "#4b4949", paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', marginHorizontal: "23%", borderRadius: 6, marginBottom: 60 }}
        >
          <Text style={{ color: "#fff", fontSize: 20 }}>Save</Text>
        </TouchableOpacity>

        <Toast
          ref="toast"
          style={{ backgroundColor: '#228B22' }}
          position='top'
          positionValue={20}
          textStyle={{ color: 'white', fontSize: 16, fontWeight: "bold" }}
        />

      </View>
    );
  }
}





export default connect(null, { settingNotificationUserType, })(NotificationCenter)