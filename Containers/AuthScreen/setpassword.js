import React, { Component } from 'react';
import { View, Text, TouchableOpacity,StatusBar } from 'react-native';
import { renderField } from '../../Components/ReduxForm/inputs'
import validate from '../../Components/ReduxForm/formValidation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import {base_url} from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast'
import Loader from '../../navigation/AuthLoadingScreen'
import Apis from '../../Services/apis';

class SetPassword extends Component {

  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Set password',
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
    email: "",
    Password: "",
    confirmPassword: "",
    modalVisibleOtp: false,
    loading: false
  }
  componentDidMount() {
    const email = this.props.navigation.getParam('userEmail')
    this.setState({ email })

  }

  setModalVisibleOtp(visible) {
    console.log('visible', visible)
    this.setState({ modalVisibleOtp: visible });
  }


  forgotPassword = async () => {
    this.setState({ loading: true })
    const data = {
      email: this.state.email,
      password: this.state.Password,
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}`+"forgotPassword", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(async (res) => {
                 console.log("res",res)
            if (res.STATUSCODE === 2000) {
                    this.setState({ loading: false })
                    setTimeout(() => {
                      this.refs.toast.show(res.message)
                      this.setModalVisibleOtp(true)
                    }, 500)
                    this.props.navigation.navigate('Login');
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
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        <Toast />
        <View style={{ marginTop: "40%", marginLeft: "20%", marginBottom: 20 }}>
          <Text style={{ color: "#494848", fontSize: 20, fontWeight: 'bold' }}>Forgot your Password</Text>
        </View>

        <View style={{ marginLeft: 20, marginBottom: 25 }}>
          <Field
            iconType="MaterialIcons"
            titleName="New Password"
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


        <TouchableOpacity
          onPress={this.props.handleSubmit(this.forgotPassword)}
          activeOpacity={0.7}
          style={{ backgroundColor: '#4b4949', paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', marginHorizontal: "28%", borderRadius: 6, marginBottom: 15 }}
        >
          <Text style={{ color: "#fff" }}>Submit</Text>
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
)(SetPassword)

export default reduxForm({
  form: 'SetPassword',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate,
})(FormComponent)