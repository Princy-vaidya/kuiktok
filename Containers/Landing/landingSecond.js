import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Button, ScrollView, Dimensions, Alert, Modal, KeyboardAvoidingView, TextInput, StatusBar, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager, LoginButton } from "react-native-fbsdk";
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes, } from '@react-native-community/google-signin';
import Apis from '../../Services/apis';
import { base_url } from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import { sendLocalNotification, pushConfig, getToken } from '../../pushNotification/notification'
import firebase from 'react-native-firebase';
import Toast, { DURATION } from 'react-native-easy-toast'
import Loader from '../../navigation/AuthLoadingScreen'
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthError
} from '@invertase/react-native-apple-authentication';




const Deviceheight = Dimensions.get('window').height;

class LandingSecond extends Component {

  static navigationOptions = {
    header: null,
    // gestureEnabled: true,
    // mode: 'card',
  };

  state = {
    email: "",
    password: "",
    googleData: null,
    FBData: null,
    appleData: {},
    fcmToken: '',
    lodaing: false,
    isLogin: false
  }




  componentDidMount = async () => {
    const user = await AsyncStorage.getItem('userdata')
    pushConfig(this.props.navigation)
    this._configureGoogleSignIn()
    this.fcmToken()

  }


  async handleResponse() {
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      if (appleAuthRequestResponse['realUserStatus']) {
        this.setState({ appleData: appleAuthRequestResponse }, () => {
          this.AppleUserdata()
        })
      }
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
      }
      if (error.code === AppleAuthError.FAILED) {
        alert('Touch ID wrong');
      }
      if (error.code === AppleAuthError.INVALID_RESPONSE) {
        alert('Touch ID wrong');
      }
      if (error.code === AppleAuthError.NOT_HANDLED) {
      }
      if (error.code === AppleAuthError.UNKNOWN) {
        alert('Touch ID wrong');
      }
    }
  }

  fcmToken = () => {
    getToken().then(async res => {
      this.setState({ fcmToken: res })
      console.log("TOKEN-GCM==>", res);
      // this.messageListener()
    })
  }



  AppleUserdata = () => {
    this.setState({ loading: true })
    const { appleData, fcmToken } = this.state;
    let socialL = {
      "type": "APPLE",
      "image": "",
      "socialId": appleData.user
    }
    const data = {
      fullname: appleData.fullName ? `${appleData.fullName.givenName} ${appleData.fullName.familyName}` :
        'Kuiktok User',
      email: appleData ? appleData.email : "",
      termCondition: "1",
      deviceId: fcmToken,
      socialLogin: JSON.stringify(socialL),
      // apptype: Platform.OS === 'android' ? 'ANDROID' : 'IOS'
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "socialLogin", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(async(response) => {
            if (response.STATUSCODE == 2000) {
              this.setState({ loading: false })
              await AsyncStorage.setItem("userdata", JSON.stringify(response.response))
              await AsyncStorage.setItem("experience", JSON.stringify(response.response.experience))
              await AsyncStorage.setItem("fieldname", JSON.stringify(response.response.fieldname))
              const user = await AsyncStorage.getItem('oneTimeonbording')
              const UData = JSON.parse(user)
              if(UData == null){
                await AsyncStorage.setItem("oneTimeonbording", JSON.stringify(true))
                this.props.navigation.navigate('OnBoarding');
              }else{
                this.props.navigation.navigate('Home');
              }
              
            } else if (response.STATUSCODE == 4200) {
              this.setState({ loading: false })
              await AsyncStorage.setItem("userdata", JSON.stringify(response.response))
              await AsyncStorage.setItem("experience", JSON.stringify(response.response.experience))
              await AsyncStorage.setItem("fieldname", JSON.stringify(response.response.fieldname))
              const user = await AsyncStorage.getItem('oneTimeonbording')
              const UData = JSON.parse(user)
              if(UData == null){
                await AsyncStorage.setItem("oneTimeonbording", JSON.stringify(true))
                this.props.navigation.navigate('OnBoarding');
              }else{
                this.props.navigation.navigate('Home');
              }
              
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show(JSON.stringify(response.response))
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


  fblogin = async () => {
    try {
      let result = await LoginManager.logInWithPermissions(['public_profile', 'email'])
      console.log(result);
      if (result.isCancelled) {
        this.state.password
      } else {
        AccessToken.getCurrentAccessToken().then((data) => {
          const accessToken = data.accessToken.toString();
          const responseInfoCallback = async (error, result) => {
            if (error) {
              console.log(error)
              alert('Error fetching data: ' + error.toString());
            } else {
              console.log(result)
              await AsyncStorage.setItem('facebookadata', JSON.stringify(result))
              console.log(result)
              this.setState({ FBData: result }, () => {
                this.facebookUserdata()
              })
            }
          }
          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken: accessToken,
              parameters: {
                fields: {
                  string: 'email,name,id,picture.type(large)'
                }
              }
            },
            responseInfoCallback
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start()
        })
      }
    } catch (error) {
      console.log("ERROR WHILE LOGIN!");
    }
  }


  facebookUserdata = () => {
    this.setState({ loading: true })
    const { FBData, fcmToken } = this.state;
    let socialL = {
      "type": "FB",
      "image": FBData.picture ? FBData.picture.data.url : null,
      "socialId": FBData.id
    }
    const data = {
      fullname: FBData ? FBData.name : null,
      email: FBData ? FBData.email : null,
      termCondition: "1",
      deviceId: fcmToken,
      socialLogin: JSON.stringify(socialL),
      // apptype: Platform.OS === 'android' ? 'ANDROID' : 'IOS'
    }
    console.log("facebook data------>", data)
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "socialLogin", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(async(response) => {
            console.log("rtyuirew",response.response)
            if (response.STATUSCODE == 2000) {
              this.setState({ loading: false })
              await AsyncStorage.setItem("userdata", JSON.stringify(response.response))
              await AsyncStorage.setItem("experience", JSON.stringify(response.response.experience))
              await AsyncStorage.setItem("fieldname", JSON.stringify(response.response.fieldname))
              const user = await AsyncStorage.getItem('oneTimeonbording')
              const UData = JSON.parse(user)
              if(UData == null){
                await AsyncStorage.setItem("oneTimeonbording", JSON.stringify(true))
                this.props.navigation.navigate('OnBoarding');
              }else{
                this.props.navigation.navigate('Home');
              }
            } else if (response.STATUSCODE == 4200) {
              this.setState({ loading: false })
              await AsyncStorage.setItem("userdata", JSON.stringify(response.response))
              await AsyncStorage.setItem("experience", JSON.stringify(response.response.experience))
              await AsyncStorage.setItem("fieldname", JSON.stringify(response.response.fieldname))
              const user = await AsyncStorage.getItem('oneTimeonbording')
              const UData = JSON.parse(user)
              if(UData == null){
                await AsyncStorage.setItem("oneTimeonbording", JSON.stringify(true))
                this.props.navigation.navigate('OnBoarding');
              }else{
                this.props.navigation.navigate('Home');
              }
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show(JSON.stringify(response.response))
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

  /* Google Login Start*/
  _configureGoogleSignIn = () => {
    GoogleSignin.configure({
      scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '396537705316-k5ls8rsljc2qdpeii18vgs6u8cinmgj0.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId: '396537705316-k5ls8rsljc2qdpeii18vgs6u8cinmgj0.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await GoogleSignin.revokeAccess();
      console.log(userInfo, 'userInfo');
      this.setState({ googleData: userInfo }, () => {
        this.userData()
      })
      // userData(userInfo)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        console.log('in progress')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.refs.toast.show('play services not available or outdated');
      } else {
        console.log('Something went wrong:', error.toString());
        setError(error)
      }
    }
  };

  userData = () => {
    this.setState({ loading: true })
    const { googleData, fcmToken } = this.state
    console.log(googleData, 'googleData');
    const googlename = googleData ? googleData.user.name : null;
    const googleemail = googleData ? googleData.user.email : null;
    let socialL = {
      "type": "GOOGLE",
      "image": googleData ? googleData.user.photo : null,
      "socialId": googleData ? googleData.user.id : null
    }
    const data = {
      fullname: googlename,
      email: googleemail,
      termCondition: "1",
      deviceId: fcmToken,
      socialLogin: JSON.stringify(socialL)
    }
    console.log("userdata", data)
    this.socialLogin(data)
  }

  socialLogin = (data) => {
    console.log("userdata", data)
    const { navigation } = this.props
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "socialLogin", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(async(response) => {
            if (response.STATUSCODE == 2000) {
              this.setState({ loading: false })
              await AsyncStorage.setItem("userdata", JSON.stringify(response.response))
              await AsyncStorage.setItem("experience", JSON.stringify(response.response.experience))
              await AsyncStorage.setItem("fieldname", JSON.stringify(response.response.fieldname))
              const user = await AsyncStorage.getItem('oneTimeonbording')
              const UData = JSON.parse(user)
              if(UData == null){
                await AsyncStorage.setItem("oneTimeonbording", JSON.stringify(true))
                this.props.navigation.navigate('OnBoarding');
              }else{
                this.props.navigation.navigate('Home');
              }
            } else if (response.STATUSCODE == 4200) {
              this.setState({ loading: false })
              await AsyncStorage.setItem("userdata", JSON.stringify(response.response))
              await AsyncStorage.setItem("experience", JSON.stringify(response.response.experience))
              await AsyncStorage.setItem("fieldname", JSON.stringify(response.response.fieldname))
              const user = await AsyncStorage.getItem('oneTimeonbording')
              const UData = JSON.parse(user)
              if(UData == null){
                await AsyncStorage.setItem("oneTimeonbording", JSON.stringify(true))
                this.props.navigation.navigate('OnBoarding');
              }else{
                this.props.navigation.navigate('Home');
              }
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show(JSON.stringify(response.response))
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


  setData = async (res) => {
    await AsyncStorage.setItem("userdata", JSON.stringify(res.response))
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: '#101010' }}>
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          style={{ height: Deviceheight }}
        >
          <StatusBar hidden={true} barStyle="light-content" />
          {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
          <View style={{ marginTop: 80, alignItems: "center", justifyContent: "center", marginBottom: 65 }}>
            <Image
              style={{ width: 220, height: 120, borderRadius: 20 }}
              source={require('../../assets/landing/kuiktok-INTRO-(1).png')}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            // onPress={handleSubmit(this.onSubmit)}
            onPress={() => this.props.navigation.navigate("Login")}
            activeOpacity={0.7}
            style={{ backgroundColor: "#7c9bff", marginHorizontal: "15%", marginBottom: 25, borderRadius: 20, paddingVertical: 10, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Sign in</Text>
          </TouchableOpacity>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: "#fff", fontSize: 12, textAlign: 'center' }}>Or Sign in with</Text>
          </View>

          <View style={{ marginBottom: 25 }}>
            <Text style={{ color: "#fff", fontSize: 13, textAlign: 'center' }}>We don't post anything on Facebook or Google </Text>
          </View>

          <TouchableOpacity
            style={{ flexDirection: "row", backgroundColor: "#7c9bff", marginHorizontal: "15%", marginBottom: 25, borderRadius: 20, paddingVertical: 10, alignItems: "center", justifyContent: "center" }}
            onPress={this.fblogin}
            activeOpacity={0.7}
          >
            <View style={{ width: 22, height: 22, backgroundColor: "white", alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginRight: 8 }}>
              <Text style={{ color: "#7d9cff", fontSize: 16, fontWeight: 'bold' }}>f</Text>
            </View>
            <Text style={{ textDecorationLine: "underline", textDecorationColor: "#fff", color: "#fff", fontWeight: "500" }}>Continue with Fackbook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", backgroundColor: "white", marginHorizontal: "15%", marginBottom: 20, borderRadius: 20, paddingVertical: 10, alignItems: "center", justifyContent: "center" }}
            onPress={this._signIn}
            activeOpacity={0.7}
          >
            <Image
              style={{ width: 30, height: 20, marginRight: 8 }}
              source={require("../../assets/landing/googleIcon.png")}
            />
            <Text style={{ textDecorationLine: "underline", textDecorationColor: "#000", fontWeight: "500" }}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.container}>
            <AppleButton
              buttonStyle={AppleButton.Style.WHITE}
              cornerRadius={20}
              buttonType={AppleButton.Type.CONTINUE}
              onPress={() => this.handleResponse()}
              style={styles.appleButton}
            />
          </View>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: "#fff", fontSize: 13 }}>Don't have an account yet ? <Text onPress={() => navigation.navigate('SignUp')} style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>Sign up</Text></Text>
          </View>

        </ScrollView>
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
)(LandingSecond)

export default reduxForm({
  form: 'LandingSecond',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  // validate,
})(FormComponent)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },
  appleButton: {
    width: 260,
    height: 40,
    fontSize: 10
  },
});



