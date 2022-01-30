import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, KeyboardAvoidingView, TextInput, Alert, StatusBar } from 'react-native';
import { renderField } from '../../Components/ReduxForm/inputs'
import validate from '../../Components/ReduxForm/formValidation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux'
import Toast, { DURATION } from 'react-native-easy-toast'
import { Field, reduxForm } from 'redux-form'
import { base_url } from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import Loader from '../../navigation/AuthLoadingScreen'

const Deviceheight = Dimensions.get('window').height;

class ForgotPassword extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Forget password',
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

  state = {
    email: "",
    verificationCode: "",
    modalVisibleOtp: false,
    loading: false
  }

  setModalVisibleOtp(visible) {
    console.log('visible', visible)
    this.setState({ modalVisibleOtp: visible });
  }


  verifyEmail = async () => {
    this.setState({ loading: true })
    const data = {
      email: this.state.email,
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "verifyEmail", {
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
              this.setState({ email: res.response.email })
              setTimeout(() => {
                this.refs.toast.show(res.message)
                this.setModalVisibleOtp(true)
              }, 1000)
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


  verifyEmailOtp = async () => {
    const data = {
      email: this.state.email,
      otp: parseInt(this.state.verificationCode)
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "verifyEmailOtp", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(async (res) => {
            console.log("api", res);
            if (res.STATUSCODE === 2000) {
              setTimeout(async () => {
                this.refs.toast.show(res.message)
                await this.setModalVisibleOtp(false)
                this.props.navigation.navigate('SetPassword', { "userEmail": this.state.email });
              }, 5000)

            }
            else if (res.STATUSCODE === 5002) {
              this.refs.toast.show(res.message)
            }
            else {
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
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        <View style={{ marginTop: "40%", marginLeft: "20%", marginBottom: 20 }}>
          <Text style={{ color: "#494848", fontSize: 20, fontWeight: 'bold' }}>Forgot your Password</Text>
        </View>

        <View style={{ marginLeft: 20, marginBottom: 25 }}>
          <Field
            iconType="MaterialIcons"
            titleName="Email Id"
            iconName="mail-outline"
            val={this.state.email.toLowerCase()}
            iconSize={20}
            iconColor="#494848"
            keyboardType="default"
            returnKeyType="done"
            component={renderField}
            changeField={email => this.setState({ email })}
            name="email"
          />

        </View>


        <TouchableOpacity
          onPress={this.props.handleSubmit(this.verifyEmail)}
          activeOpacity={0.7}
          style={{ backgroundColor: '#4b4949', paddingVertical: 13, paddingHorizontal: 20, alignItems: 'center', marginHorizontal: "28%", borderRadius: 8, marginBottom: 15 }}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>Submit</Text>
        </TouchableOpacity>

        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisibleOtp}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');

          }}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ffffff', marginTop: Deviceheight * 0.25, marginBottom: Deviceheight * 0.25, marginHorizontal: '10%', borderRadius: 5, padding: '3%' }}>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() => { this.setModalVisibleOtp(!this.state.modalVisibleOtp) }}
                  activeOpacity={0.5}
                >
                  <MaterialIcons
                    name='close'
                    size={30}
                    color='#c0c0c0'
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <Text style={{ fontSize: 22, color: '#000', textAlign: 'center' }}>Enter OTP</Text>
                <Text style={{ fontSize: 12, color: '#000', textAlign: 'center', marginBottom: '6%', marginTop: '4%' }}>Which have been sent to your mail</Text>

                <KeyboardAvoidingView
                  behavior='padding'
                >
                  <View style={{ marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <TextInput
                      style={{ paddingVertical: 5, textAlign: 'center', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, width: '80%' }}
                      placeholder='OTP'
                      value={this.state.verificationCode}
                      onChangeText={(verificationCode) => this.setState({ verificationCode })}
                      textColor='#000'
                      fontSize={17}
                      textContentType='telephoneNumber'
                      returnKeyType='done'
                      selectTextOnFocus={true}
                      spellCheck={false}
                      keyboardType='number-pad'
                      maxLength={6}
                      returnKeyType='done'
                    />
                  </View>
                  <View style={{ marginTop: '3%' }}>
                    <TouchableOpacity
                      onPress={this.verifyEmailOtp}
                      activeOpacity={0.7}
                      style={{ backgroundColor: '#4b4949', paddingVertical: 18, paddingHorizontal: 30, alignItems: 'center', marginHorizontal: "25%", borderRadius: 6, marginBottom: 60 }}
                    >
                      <Text style={{ color: "#fff", fontSize: 16 }}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </View>
          </View>
        </Modal>
        
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


const mapStateToProps = (state) => ({
  formState: state.form,
});

const FormComponent = connect(
  mapStateToProps, {

}
)(ForgotPassword)

export default reduxForm({
  form: 'ForgotPassword',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate,
})(FormComponent)
