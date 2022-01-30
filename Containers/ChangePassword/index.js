import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { renderField } from '../../Components/ReduxForm/inputs'
import validate from '../../Components/ReduxForm/formValidation'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import Toast, { DURATION } from 'react-native-easy-toast'
import {base_url} from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import Loader from '../../navigation/AuthLoadingScreen'
import Apis from '../../Services/apis';

class ChangePassword extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Change Password',
      headerRightContainerStyle: {
        marginRight: 18
      },
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
  }


  state = {
    currentPassword: "",
    Password: "",
    confirmPassword: "",
    modalVisibleOtp: false,
    UData: "",
    authToken: "",
    loading: false
  }
  componentDidMount() {
    const email = this.props.navigation.getParam('userEmail')
    this.setState({ email }),
      this.getData();

  }

  getData = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const UData = JSON.parse(user)
    this.setState({ UData: UData })
    console.log('userdata', UData.token)

  }

  setModalVisibleOtp(visible) {
    console.log('visible', visible)
    this.setState({ modalVisibleOtp: visible });
  }


  changePassword = async () => {
    this.setState({ loading: true })
    const data = {
      authtoken: this.state.UData.authtoken,
      currentPassword: this.state.currentPassword,
      newPassword: this.state.Password,
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}`+"changePassword", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "authtoken":this.state.UData.authtoken,
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(async (res) => {
            //     console.log("res",res)
            if (res.STATUSCODE === 2000) {
              this.setState({ loading: false })
              setTimeout(() => {
                this.refs.toast.show(res.message.toString())
              }, 1000)
              this.setState({
                currentPassword: '',
                Password: '',
                confirmPassword: ''
              })
              // this.props.navigation.navigate('Login');
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

  render() {
    const { navigation } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <StatusBar hidden={true} barStyle="light-content" />
        <Toast />
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        <View style={{ marginTop: "16%", marginLeft: "20%", marginBottom: 20 }}>
          <Text style={{ color: "#494848", fontSize: 20, fontWeight: 'bold' }}>Forgot your Password</Text>
        </View>

        <View style={{ marginLeft: 20, marginBottom: 25 }}>

          <Field
            iconType="MaterialIcons"
            titleName="Enter Current Password"
            iconName="lock-outline"
            iconSize={20}
            iconColor="#494848"
            secureTextEntry={true}
            value={this.state.currentPassword}
            changeField={currentPassword => this.setState({ currentPassword })}
            keyboardType="default"
            returnKeyType="done"
            component={renderField}
            name="currentPassword"
          />

          <Field
            iconType="MaterialIcons"
            titleName="Enter New Password"
            iconName="lock-outline"
            iconSize={20}
            iconColor="#494848"
            secureTextEntry={true}
            value={this.state.Password}
            changeField={Password => this.setState({ Password })}
            keyboardType="default"
            returnKeyType="done"
            component={renderField}
            name="password"
          />

          <Field
            iconType="MaterialIcons"
            titleName="Re-enter New Password"
            iconName="lock-outline"
            iconSize={20}
            iconColor="#494848"
            val={this.state.confirmPassword}
            changeField={confirmPassword => this.setState({ confirmPassword })}
            secureTextEntry={true}
            keyboardType="default"
            returnKeyType="done"
            component={renderField}
            name="cnfpassword"
          />
        </View>


        <TouchableOpacity
          onPress={this.props.handleSubmit(this.changePassword)}
          activeOpacity={0.7}
          style={{ backgroundColor: '#4b4949', paddingVertical: 13, paddingHorizontal: 20, alignItems: 'center', marginHorizontal: "28%", borderRadius: 8, marginBottom: 15 }}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>Submit</Text>
        </TouchableOpacity>


        <Toast
          ref="toast"
          style={{ backgroundColor: '#228B22' }}
          position='top'
          positionValue={35}
          textStyle={{ color: 'white', fontSize: 16, fontWeight: "bold" }}
        />

      </View>
    );
  }
}


const mapStateToProps = (state) => ({
  formState: state.form,
});

const FormComponent = connect(
  mapStateToProps, {

}
)(ChangePassword)

export default reduxForm({
  form: 'ChangePassword',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate,
})(FormComponent)