import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import validate from '../../../Components/ReduxForm/formValidation'
import { connect } from 'react-redux'
import Toast, { DURATION } from 'react-native-easy-toast'
import { Field, reduxForm } from 'redux-form'
import RNPickerSelect from 'react-native-picker-select';
import { base_url } from "../../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import Loader from '../../../navigation/AuthLoadingScreen'


const Deviceheight = Dimensions.get('window').height;

const colors = [
  {
    label: 'Nudity',
    value: 'nudity',
  },
  {
    label: 'Harassment',
    value: 'harassment',
  },
  {
    label: 'misrepresentation',
    value: 'misrepresentation',
  },
  {
    label: 'Spam',
    value: 'Spam',
  },
  {
    label: 'unauthorised sales',
    value: 'unauthorisedsales',
  },
  {
    label: 'Hate speech',
    value: 'hatespeech',
  },
];

class AbuseReport extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Abuse Report',
      headerRightContainerStyle: {
        marginRight: 18
      },
      headerStyle: {
        backgroundColor: '#000',
        height: 40,

      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontSize: 18,
        paddingBottom: 8
      },

    }
  }
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      selectedValue: "",
      userId:"",
      modalVisibleOtp: false,
      loading: false
    }
    this.inputRefs = {};
  }

  setModalVisibleOtp(visible) {
    console.log('visible', visible)
    this.setState({ modalVisibleOtp: visible });
  }

  componentDidMount = async() =>{
    const user = await AsyncStorage.getItem('callerId')
    const id = JSON.parse(user)
    this.setState({userId:id})
    console.log("pickedsfffsf---",id)
  }


  addaAbuse = async () => {
    if(this.state.selectedValue == ""){
      this.refs.toast.show("Please select abuse type!")
    }else if(this.state.message.trim() == ""){
      this.refs.toast.show("Please type a message!")
    }else{
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('pickedData')
    const id = JSON.parse(user)._id
    const data = {
      fromUserId:this.state.userId,
      title: this.state.selectedValue,
      abuseReport:this.state.message,
      toUserId:id
    }
    console.log("dataabusereport---",data)
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "add-abuse-report", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(async (res) => {
            if (res.STATUSCODE === 2000) {
              this.setState({ loading: false })
            }
            else if (res.STATUSCODE === 5002) {
              this.setState({ loading: false })
              this.refs.toast.show(res.message)
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show(res.message)
            }
          })
          .catch((error) => {
            this.setState({ loading: false })
            this.refs.toast.show("Network error")
            // console.error('Error:', error);
          });
      } else {
        this.setState({ loading: false })
        this.refs.toast.show("Network error")
      }
    })
  }
  }

  render() {
    const { navigation } = this.props
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#1f1f1f' }}>
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        <View style={{ marginTop:70, marginHorizontal: 18, marginBottom:60 }}>
          <RNPickerSelect
            placeholder={{
              label: 'Please select a problem to continue .....',
              value: 0,
            }}

            onValueChange={(value) => this.setState({ selectedValue: value })}
            items={colors}
            onUpArrow={() => {
              this.inputRefs.picker.togglePicker();
            }}
            onDownArrow={() => {
              this.inputRefs.company.focus();
            }}
            style={{ ...pickerSelectStyles }}
            ref={(el) => {
              this.inputRefs.picker2 = el;
            }}
            useNativeAndroidPickerStyle={true} //android only
          />
        </View>

        <View style={{ marginBottom: 35, justifyContent: "center", marginHorizontal: 20 }}>
          <Text style={{ color: "#a1a1a1", fontSize: 16,marginLeft:5 ,fontWeight: '500', marginBottom: 5, textAlign: "left" }}>Enter message here</Text>
          <TextInput
            style={{ width: "100%", height: 100, borderWidth: 1, borderColor: "#a1a1a1",paddingHorizontal:5,color: "#a1a1a1"}}
            value={this.state.message}
            onChangeText={(text) => this.setState({ message: text })}
            multiline={true}
            returnKeyType={"done"}
            enablesReturnKeyAutomatically
            selectTextOnFocus={true}
            spellCheck={false}
          />
        </View>


        <TouchableOpacity
          onPress={this.addaAbuse}
          activeOpacity={0.7}
          style={{ backgroundColor: '#4b4949', paddingVertical: 13, paddingHorizontal: 20, alignItems: 'center', marginHorizontal: "28%", borderRadius: 8, marginBottom: 15 }}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>Submit</Text>
        </TouchableOpacity>


        <Toast
          ref="toast"
          style={{ backgroundColor: '#228B22' }}
          position='top'
          positionValue={20}
          textStyle={{ color: 'white', fontSize: 16, fontWeight: "bold" }}
        />
      </ScrollView>
    );
  }
}


const mapStateToProps = (state) => ({
  formState: state.form,
});

const FormComponent = connect(
  mapStateToProps, {

}
)(AbuseReport)

export default reduxForm({
  form: 'AbuseReport',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate,
})(FormComponent)

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#494848',
    borderRadius: 4,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});