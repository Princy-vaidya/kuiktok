import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Alert, Modal, KeyboardAvoidingView, TextInput, StatusBar } from 'react-native';
import { renderField } from '../../Components/ReduxForm/inputs'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import AsyncStorage from '@react-native-community/async-storage';
import { base_url } from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import { sendLocalNotification, pushConfig, getToken } from '../../pushNotification/notification'
import Toast, { DURATION } from 'react-native-easy-toast'
import Loader from '../../navigation/AuthLoadingScreen'

const Deviceheight = Dimensions.get('window').height;

class Login extends Component {

  static navigationOptions = {
    header: null
  };

  state = {
    email: "",
    password: "",
    fcmToken: '',
    lodaing: false

  }



  componentDidMount = () => {
    this.fcmToken()
  }

  fcmToken = () => {
    getToken().then(async res => {
      this.setState({ fcmToken: res })
      console.log("TOKEN-GCM==>", res);
      // this.messageListener()
    })
  }


    userLogin = () => {
      if (this.state.email == '') {
        this.refs.toast.show('Please enter email address !')
      } else if (this.state.email == '' || this.state.password == '') {
        this.refs.toast.show('Please enter Password !')
      }
      else {
        this.setState({ loading: true })
        const data = {
          email: this.state.email,
          password: this.state.password,
          deviceId: this.state.fcmToken
        }
        NetInfo.fetch().then(isConnected => {
          if (isConnected) {
            fetch(`${base_url}` + "userLogin", {
              method: 'POST', // or 'PUT'
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              .then(response => response.json())
              .then(async(res) => {
                console.log("manullogin",res)
                if (res.STATUSCODE === 2000) {
                        this.setState({ loading: false },async()=>{
                          await this.setData(res)
                        },200)
                        const user = await AsyncStorage.getItem('oneTimeonbording')
                        const UData = JSON.parse(user)
                        if(UData == null){
                          await AsyncStorage.setItem("oneTimeonbording", JSON.stringify(true))
                          this.props.navigation.navigate('OnBoarding');
                        }else{
                          this.props.navigation.navigate('Home');
                        }
                      }
                      else if (res.STATUSCODE === 4002) {
                        this.setState({ loading: false })
                        this.refs.toast.show(res.message)
                      }
                      else {
                        this.setState({ loading: false })
                        this.refs.toast.show('Something went wrong please try again !')
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

  setData = async (res) => {
    await AsyncStorage.setItem("userdata", JSON.stringify(res.response))
    await AsyncStorage.setItem("experience", JSON.stringify(res.response.experience))
    await AsyncStorage.setItem("fieldname", JSON.stringify(res.response.fieldname))
    console.log("TEST-LOGIN", JSON.stringify(res.response.fieldname));
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: '#0e0e0e' }}>
        <StatusBar hidden={true} barStyle="light-content" />
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          style={{ height: Deviceheight }}
        >
          {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
          <View style={{ marginTop: 120, marginLeft: 50, marginBottom: 20 }}>
            <Text style={{ color: "#494848", fontSize: 24, fontWeight: 'bold' }}>Welcome</Text>
            <Text style={{ color: "#a1a1a1", fontSize: 18, fontWeight: 'bold' }}>Sign in to continue</Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Field
              iconType="Feather"
              titleName="Your E-mail"
              iconName="user"
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

          <View style={{ marginBottom: 15 }}>
            <Field
              iconType="MaterialIcons"
              titleName="Password"
              iconName="lock-outline"
              iconSize={20}
              val={this.state.password}
              iconColor="#494848"
              secureTextEntry={true}
              keyboardType="default"
              changeField={password => this.setState({ password })}
              returnKeyType="done"
              component={renderField}
              name="password"
            />
          </View>


          <TouchableOpacity
            style={{ alignItems: 'center', marginBottom: 50}}
            onPress={() => navigation.navigate('ForgotPassword')}
            activeOpacity={0.7}
          >
            <Text style={{ color: "#a1a1a1" }}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={handleSubmit(this.onSubmit)}
            onPress={this.props.handleSubmit(this.userLogin)}
            activeOpacity={0.7}
            style={{ backgroundColor: '#4b4949', paddingVertical: 13, paddingHorizontal: 20, alignItems: 'center', marginHorizontal: "28%", borderRadius: 8, marginBottom: 15 }}
          >
            <Text style={{ color: "#fff",fontSize:16 }}>Sign in</Text>
          </TouchableOpacity>

        </ScrollView>
        <Toast
          ref="toast"
          style={{ backgroundColor: '#f6ff00' }}
          position='top'
          positionValue={30}
          textStyle={{ color: '#000', fontSize: 16, fontWeight: "bold" }}
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
)(Login)

export default reduxForm({
  form: 'Login',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  // validate,
})(FormComponent)




