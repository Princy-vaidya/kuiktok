import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, KeyboardAvoidingView, Alert, Modal, TextInput, SafeAreaView } from 'react-native';
import { renderField } from '../../Components/ReduxForm/inputs'
import validate from '../../Components/ReduxForm/formValidation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { sendLocalNotification, pushConfig, getToken } from '../../pushNotification/notification'
import { CheckBox } from 'react-native-elements'
import Loader from '../../navigation/AuthLoadingScreen'
import AsyncStorage from '@react-native-community/async-storage';
import { base_url } from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import Apis from '../../Services/apis';
import Toast, { DURATION } from 'react-native-easy-toast'
import { WebView } from 'react-native-webview';

const DeviceHeight = Dimensions.get('window').height;

class SignUp extends Component {

  static navigationOptions = {
    header: null
  };

  componentDidMount = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const UData = JSON.parse(user)
    this.setState({ UData: UData })
    this.termsConditions()
    this.getPrivacyPolicy()
    this.fcmToken()
  }

  state = {
    checked: false,
    loading: false,
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    privacyPolicyData: "",
    termConditionData: "",
    modalVisibleOtp: false,
    verificationCode: "",
    UData: "",
    fcmToken: '',
    modalVisiblePrivacy: false,
    modalVisibleTermsCondition: false,
  }



  fcmToken = () => {
    getToken().then(async res => {
      this.setState({ fcmToken: res })
      console.log("TOKEN-GCM==>", res);
      // this.messageListener()
    })
  }


  setModalVisibleOtp(visible) {
    this.setState({ modalVisibleOtp: visible });
  }

  setModalVisiblePrivacy(visible) {
    this.setState({ modalVisiblePrivacy: visible });
  }

  setModalVisibleTermsCondition(visible) {
    this.setState({ modalVisibleTermsCondition: visible });
  }


  registration = async () => {
    this.setState({ loading: true })
    const data = {
      fullname: this.state.fullName,
      email: this.state.email,
      password: this.state.password,
      deviceId: this.state.fcmToken,
      termCondition: "1"
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "addUser", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(async (res) => {
            this.setState({ loading: false })
            if (res.STATUSCODE === 2000) {
              this.setState({ email: res.response.email })
              setTimeout(() => {
                Alert.alert(
                  'Success',
                  res.message.toString(),
                  [
                    { text: 'OK', onPress: () => this.setModalVisibleOtp(true) },
                  ],
                  { cancelable: false },
                );
              }, 1000)
              // await AsyncStorage.setItem("userdata", JSON.stringify(res.response))

            }
            else if (res.STATUSCODE === 4200) {
              this.setState({ loading: false })
              this.refs.toast.show(res.message)
            }
            else {
              Alert.alert('Oops..', 'Something went wrong please try again !')
              this.setState({ loading: false })
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

  emailVerification = async () => {
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
              Alert.alert('Sucesss!', res.message)
              this.setState({ loading: false });
              this.setModalVisibleOtp(false);
              this.props.navigation.navigate('Login');
            }
            else if (res.STATUSCODE === 5002) {
              Alert.alert('info', res.message)
            }
            else {
              Alert.alert('Error!', res.message)
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

  getPrivacyPolicy = async () => {
    const regex = /(<([^>]+)>)/ig;
    const data = {

    }
    await Apis.getPrivacyPolicy(data)
      .then((res) => {
        console.log("gghgh", res.response)
        if (res.STATUSCODE === 2000) {
          this.setState({ privacyPolicyData: res.response.text.replace(regex, '') })
        }
        else if (res.STATUSCODE === 5002) {
          Alert.alert('info', res.message)
        }
        else {
          Alert.alert('Error!', res.message)
        }
      }).catch((error) => {
        console.error(error);
      });
  }


  termsConditions = async () => {
    const regex = /(<([^>]+)>)/ig;
    const data = {

    }
    await Apis.termsConditions(data)
      .then((res) => {
        if (res.STATUSCODE === 2000) {
          this.setState({ termConditionData: res.response.text.replace(regex, '') })
        }
        else if (res.STATUSCODE === 5002) {
          Alert.alert('info', res.message)
        }
        else {
          Alert.alert('Error!', res.message)
        }
      }).catch((error) => {
        console.error(error);
      });
  }


  onSubmit = (values) => {
    this.registration();
    alert("values", `${JSON.stringify(values)}`)
  };

  render() {
    const { navigation, handleSubmit } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: '#0e0e0e' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
        // keyboardVerticalOffset={-145}
        // contentContainerStyle={{height: DeviceHeight}}
        >
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
          // style={{height:DeviceHeight}}
          >
            <View>
              {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
              <View style={{ marginTop: 40, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Image
                  style={{ width: 210, height: 100, borderRadius: 20 }}
                  source={require('../../assets/landing/kuiktok-INTRO-(1).png')}
                  resizeMode="contain"
                />
              </View>

              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Field
                  iconType="Feather"
                  titleName="Full Name"
                  iconName="user"
                  val={this.state.fullName}
                  iconSize={20}
                  iconColor="#494848"
                  returnKeyType="done"
                  keyboardType="default"
                  component={renderField}
                  changeField={fullName => this.setState({ fullName })}
                  name="username"
                />

                <Field
                  iconType="MaterialIcons"
                  titleName="Email Id"
                  iconName="mail-outline"
                  iconSize={20}
                  iconColor="#494848"
                  val={this.state.email.toLowerCase()}
                  changeField={email => this.setState({ email: email })}
                  returnKeyType="done"
                  keyboardType="default"
                  component={renderField}
                  name="email"
                />

                <Field
                  iconType="MaterialIcons"
                  titleName="Password"
                  iconName="lock-outline"
                  iconSize={20}
                  iconColor="#494848"
                  secureTextEntry={true}
                  value={this.state.password}
                  changeField={password => this.setState({ password: password })}
                  keyboardType="default"
                  returnKeyType="done"
                  component={renderField}
                  name="password"
                />

                <Field
                  iconType="MaterialIcons"
                  titleName="Confirm Password"
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

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', alignContent: 'center', marginLeft: 40, marginBottom: 10, marginHorizontal: "10%" }}>
                <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                  <CheckBox
                    size={18}
                    checked={this.state.checked}
                    onPress={() => this.setState({ checked: !this.state.checked })}
                  />
                </View>
                <View style={{ flex: 0.8, alignItems: 'flex-start', marginLeft: -10 }}>
                  <Text style={{ marginTop: 10, color: '#a1a1a1' }}>I agree to the <Text style={{ color: 'blue', textDecorationLine: 'underline' }} onPress={() => { this.setModalVisibleTermsCondition(!this.state.modalVisibleTermsCondition) }} activeOpacity={0.5}>Terms and Conditions</Text> and <Text style={{ color: 'blue', textDecorationLine: 'underline' }} onPress={() => { this.setModalVisiblePrivacy(!this.state.modalVisiblePrivacy) }} activeOpacity={0.5} >Privacy Policy</Text></Text>
                </View>

                <Modal
                  animationType='fade'
                  transparent={true}
                  visible={this.state.modalVisibleTermsCondition}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');

                  }}
                >
                  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
                    <View style={{ flex: 1, backgroundColor: '#ffffff', marginTop: DeviceHeight * 0.02, marginBottom: DeviceHeight * 0.02, marginHorizontal: '5%', borderRadius: 5, borderColor: "#f6ff00", borderWidth: 2 }}>
                      <View style={{ alignItems: 'flex-end', }}>
                        <TouchableOpacity
                          onPress={() => { this.setModalVisibleTermsCondition(!this.state.modalVisibleTermsCondition) }}
                          activeOpacity={0.5}
                        >
                          <MaterialIcons
                            name='close'
                            size={25}
                            color='red'
                          />
                        </TouchableOpacity>
                      </View>

                      {/* <View style={{ alignItems: 'center', justifyContent: 'center', alignContent: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Terms and Conditions</Text>
                      </View> */}

                      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

                        {/* <ScrollView
                          showsVerticalScrollIndicator={true}
                          contentContainerStyle={{ paddingVertical: 5, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}
                        > */}
                        {/* <Text style={{ textAlign: 'left' }}>{this.state.termConditionData}</Text> */}
                        <WebView ref={(ref) => { this.webview = ref; }} source={{ uri: 'https://kuiktok.com/terms-conditions/' }} style={{ flex: 1 }} scalesPageToFit={true} />
                        {/* </ScrollView> */}

                      </View>
                    </View>
                  </View>
                </Modal>

                <Modal
                  animationType='fade'
                  transparent={true}
                  visible={this.state.modalVisiblePrivacy}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');

                  }}
                >
                  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
                    <View style={{ flex: 1, backgroundColor: '#ffffff', marginTop: DeviceHeight * 0.02, marginBottom: DeviceHeight * 0.02, marginHorizontal: '5%', borderRadius: 5, borderColor: "#f6ff00", borderWidth: 2 }}>
                      <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                          onPress={() => { this.setModalVisiblePrivacy(!this.state.modalVisiblePrivacy) }}
                          activeOpacity={0.5}
                        >
                          <MaterialIcons
                            name='close'
                            size={25}
                            color='red'
                          />
                        </TouchableOpacity>
                      </View>
                      {/* 
                      <View style={{ alignItems: 'center', justifyContent: 'center', alignContent: 'center', marginBottom: 10, }}>
                        <Text style={{ fontSize: 18, color: '#000', textAlign: 'center', fontWeight: 'bold' }}>Privacy policy</Text>
                      </View> */}

                      <View style={{ flex: 10, backgroundColor: '#ffffff' }}>

                        {/* <ScrollView
                          showsVerticalScrollIndicator={true}
                          contentContainerStyle={{ paddingVertical: 5, alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}
                        >
                          <Text style={{ textAlign: 'left' }}>{this.state.privacyPolicyData}</Text>
                        </ScrollView> */}

                        <WebView ref={(ref) => { this.webview = ref; }} source={{ uri: 'https://kuiktok.com/terms-conditions/' }} style={{ flex: 1 }} scalesPageToFit={true} />

                      </View>
                    </View>
                  </View>
                </Modal>

              </View>

              <TouchableOpacity
                // onPress={this.Signup}
                onPress={this.props.handleSubmit(this.registration)}
                activeOpacity={0.7}
                style={{ backgroundColor: '#4b4949', paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', marginHorizontal: "28%", borderRadius: 6, marginBottom: 20 }}
              >
                <Text style={{ color: "#fff" }}>Sign up</Text>
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
                  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ffffff', marginTop: DeviceHeight * 0.25, marginBottom: DeviceHeight * 0.25, marginHorizontal: '10%', borderRadius: 5, padding: '3%' }}>
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
                            onPress={this.emailVerification}
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

              <View style={{ alignItems: 'center', marginBottom: 40 }}>
                <Text style={{ color: "#494848", fontSize: 14 }}>Already have an account? <Text onPress={() => navigation.navigate("LandingSecond")} style={{ color: "#fff", fontSize: 16 }}>Sign in</Text></Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

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
)(SignUp)
export default reduxForm({
  form: 'SignUp',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate,
})(FormComponent)