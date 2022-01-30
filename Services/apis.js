import {Network} from './network'


//Network will recieve 4 Arguments
// "method(type of request)",
// "endpoint ()", 
// "body (if POST method)"
// See the main function at ./network.js

export default class Apis {


  static registration = (data) => {
    return Network('POST', 'addUser', data)
  }

  static userLogin = (data) => {
    return Network('POST', 'userLogin', data)
  }

  static verifyEmail = (data) => {
    return Network('POST', 'verifyEmail', data)
  }

  static verifyEmailOtp = (data) => {
    return Network('POST', 'verifyEmailOtp', data)
  }

  static forgotPassword = (data) => {
    return Network('POST', 'forgotPassword', data)
  }

  static changePassword = (data) => {
    return Network('POST', 'changePassword', data)
  }

  static termsConditions = (data) => {
    return Network('POST', 'get-terms-and-condition', data)
  }

  static getPrivacyPolicy = (data) => {
    return Network('POST', 'get-privacy-policy', data)
  }

  static deleteUser = (data) => {
    return Network('POST', 'deleteUser', data)
  }


  static socialLogin = (data) => {
    return Network('POST', 'socialLogin', data)
  }

  static editUser = (data) => {
    return Network('POST', 'editUser', data)
  }

  static getField = (data) => {
    return Network('POST', 'get-all-field' , data)
  }

  static addSpecialization = (data) => {
    return Network('POST', 'addSpecialization' , data)
  }


  static searchExpert = (data) => {
    return Network('POST', 'addVideoCall' , data)
  }

  static getallSpecialty = (data) => {
    return Network('POST', 'get-all-specialization',data)
  }

  static getTimer = (data) => {
    return Network('POST', 'get-all-timer',data)
  }

  static getallSpecialtyHome = (token) => {
    return Network('POST', 'get-all-specialization' ,token)
  }

  static listUserPersonal = (_id,authtoken,userType) => {
    return Network('POST', 'listUser?_id=' + `${_id}` +'&userType=' + `${userType}` , {authtoken})
  }

  static checkEmail = (email) => {
    return Network('POST', 'listUser?email=' + `${email}`)
  }

  static listUserExpert = (_id,authtoken,userType) => {
    console.log("expert",_id,authtoken,userType)
    return Network('POST', 'listUser?_id=' + `${_id}` +'&userType=' + `${userType}` , {authtoken})
  }

  static listNotification = (data) => {
    return Network('POST', 'listNotification',data)
  }

  static settingNotification = (data) => {
    return Network('POST', 'settingNotification',data)
  }

  static listUserType = (data) => {
    return Network('POST', 'listUserType',data)
  }

  static verifyChangedEmail = (data) => {
    return Network('POST', 'verifyChangedEmail',data)
  }

  static addRating = (data) => {
    return Network('POST', 'addRating',data)
  }


}