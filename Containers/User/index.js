import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Alert, FlatList, ImageBackground } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMarker from '../../Components/CustomSlider/index'
import LabeledSwitch from '../../Components/CustomSwitch'
import ConversationTopics from '../../Components/ConversationTopics'
import { renderField1, renderField2, datePicker, googlePlaceSearch } from '../../Components/ReduxForm/inputs'
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux'
import validate from './Validation'
import AsyncStorage from '@react-native-community/async-storage';
import { Field, reduxForm, change } from 'redux-form'
import Autocomplete from 'react-native-autocomplete-input';
import axios from 'axios'
import Apis from '../../Services/apis';
import { base_url } from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import Loader from '../../navigation/AuthLoadingScreen'
import Toast, { DURATION } from 'react-native-easy-toast'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment'
import io from 'socket.io-client';
import { server } from '../../Services/constants'


const Deviceheight = Dimensions.get('window').height;
const Devicewidth = Dimensions.get('window').width;
let speclist = []

Array.prototype.first = function () {
  return this[0];
};

class user extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit Profile',
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 16, borderRadius: 25, marginTop: -3 }}
          underlayColor={"rgba(0,0,0,0.32)"}
        >
          <MaterialIcons
            name='dehaze'
            size={25}
            color='#fff'
          />
        </TouchableOpacity>
      ),
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
    tab: "1",
    sliderOneValue: [0],
    sliderTwoValue: [0],
    sliderThreeValue: [0],
    source: null,
    sourceExpert: null,
    fullNamePersonal: "",
    emailPersonal: "",
    agePersonal: "",
    fullNameExpert: "",
    emailExpert: "",
    ageExpert: "",
    location: "",
    ocupation: "",
    specialization: "",
    experience: "",
    linkDinLink: '',
    dobPersonal: 'YYYY-MM-DD',
    dobExpert: 'YYYY-MM-DD',
    isDateTimePickerVisiblePersonal: false,
    isDateTimePickerVisibleExpert: false,
    field: "",
    UData: {},
    fieldData: [],
    fieldDataExpert: [],
    fieldId: '',
    selectedspecialization: [],
    selectedspecializationExpert: [],
    loading: false,
    autoPopulateField: false,
    address_string: '',
    googleAddress: {},
    contact: {},
    flagDisable: false,
    experienceValue: '',
    fieldnameValue: [],
    // callReceiveFlag: false
  }

  componentDidMount = async () => {
    this.getField();
    this.getLocalData();
  };


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
      address_string: address,
      googleAddress: googleAddress,
      contact: googleAddress
    }, () => {
      this.props.address_string(this.state.googleAddress.city + ", " + this.state.googleAddress.country)
      this.props.contact(this.state.contact.city + ", " + this.state.contact.country)
      this.props.googleAddress(this.state.agoogleAddress)
    })
  }

  getLocalData = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const experience = await AsyncStorage.getItem('experience')
    const fieldname = await AsyncStorage.getItem('fieldname')
    const experienceValue = JSON.parse(experience)
    const fieldnameValue = JSON.parse(fieldname)
    const UData = JSON.parse(user)
    this.setState({ UData, experienceValue, fieldnameValue }, () => {
      this.listUserpersonal()
    })
  }


  changeTab = (tab) => {
    this.setState({ tab: tab, autoPopulateField: false, query: '' }, () => {
      this.setState({ autoPopulateField: true })
    })
    speclist = []
    if (tab == 2) {
      this.listUserExpert()
    } else {
      this.listUserpersonal()
    }
  }



  sliderOneValuesChange(values) {
    this.setState({
      sliderOneValue: values,
    });
  };


  sliderTwoValuesChange(values) {
    this.setState({
      sliderTwoValue: values,
    });
  };


  getAge = (DOB) => {
    console.log("DOB",DOB)
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }
    return age;
  }


  _showDateTimePickerPersonal = () => this.setState({ isDateTimePickerVisiblePersonal: true });

  _hideDateTimePickerPersonal = () => {
    this.setState({ isDateTimePickerVisiblePersonal: false });
  }

  _handleDatePickedPersonal = (dobPersonal) => {
    this.setState({ dobPersonal: moment(dobPersonal).format("YYYY-MM-DD"), isDateTimePickerVisiblePersonal: false });
  }

  _showDateTimePickerExpert = () => this.setState({ isDateTimePickerVisibleExpert: true });

  _hideDateTimePickerExpert = () => {
    this.setState({ isDateTimePickerVisibleExpert: false });
  }

  _handleDatePickedExpert = (dobExpert) => {
    this.setState({ dobExpert: moment(dobExpert).format("YYYY-MM-DD"), isDateTimePickerVisibleExpert: false });
  }


  findSpacelization(query) {
    // method called everytime when we change the value of the input
    // if (query === undefined) {
    //   //if the query is null then return blank
    //   return [];
    // }
    // //making a case insensitive regular expression to get similar value from the film json
    // const regex = new RegExp(`${query.trim()}`, 'i');
    // //return the filtered film array according the query from the input
    // return speclist.filter(spec => spec.name.search(regex) >= 0);

    if (query === ''||query === undefined) {
      //if the query is null then return blank
      return [];
    }
    //making a case insensitive regular expression to get similar value from the film json
    const regex = new RegExp(`${query.trim()}`, 'i');
    //return the filtered film array according the query from the input
     console.log("dfdsfdsfsdfsdfs",console.log('search',speclist.filter(spec => spec.name.search(regex) >= 0 )))

  //  return speclist.filter(spec => spec.name.search(regex) >= 0 )
   
    return speclist.filter((x) =>
        String(x.name.toLowerCase()).startsWith(query.toLowerCase())
      ); 
  }






  selectPhotoPersonal = async () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    }
    await ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = response.uri;
        this.setState({ source: source });
      }
    });
  };

  selectPhotoExpert = async () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    }
    await ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let sourceExpert = response.uri;
        this.setState({ sourceExpert: sourceExpert });
        console.log('photo----', sourceExpert)
      }
    });
  };


  editProfilePersonal = async (DOB) => {
    const { UData, source, sliderOneValue, selectedspecialization, fieldId } = this.state
    if (source == '') {
      this.refs.toast.show('Please select profileImage !')
    } else if (fieldId == '' && selectedspecialization == '') {
      this.refs.toast.show('Please select Field !', "#FF0000")
    } else if (selectedspecialization == '') {
      this.refs.toast.show('Please Add specialization !', "#FF0000")
    } else {
      this.setState({ loading: true })
      const slider1value = sliderOneValue.first()
      this.setState({ slider1value })
      let form = new FormData();
      form.append("_id", UData.id ? UData.id : null || UData._id ? UData._id : null);
      // form.append("authtoken", UData.token ? UData.token : null || UData.authtoken ? UData.authtoken : null);
      form.append("userType", this.state.tab);
      if (source) {
        form.append("profileImage", { uri: source, name: "test.jpg", type: "image/jpeg" });
      }
      form.append("fullname", this.state.fullNamePersonal);
      form.append("email", this.state.emailPersonal);
      if (slider1value >= 0 && slider1value < 10) {
        form.append("gender", "Male");
      } else {
        form.append("gender", "Female");
      }
      form.append("specialization", JSON.stringify(this.state.selectedspecialization.map(ids => ids._id)))
      form.append("dob", this.state.dobPersonal);
      form.append("age", this.getAge(this.state.dobPersonal));
      form.append("location", this.state.googleAddress.city + ", " + this.state.googleAddress.country);
      form.append("occupation", this.state.ocupation);
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
                setTimeout(() => {
                  this.refs.toast.show('profile has been updated sucessfully!')
                }, 500)
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
                this.refs.toast.show(JSON.stringify(res.message))

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

  editProfileExpert = async () => {
    const { UData, sourceExpert, sliderOneValue, sliderTwoValue, sliderThreeValue, selectedspecializationExpert, fieldId } = this.state
    if (sourceExpert == '') {
      this.refs.toast.show('Please select profileImage !')
    } else if (fieldId == '' && selectedspecializationExpert == '') {
      this.refs.toast.show('Please select Field !')
    } else if (selectedspecializationExpert == '') {
      this.refs.toast.show('Please Add specialization !')
    } else {
      this.setState({ loading: true })
      const slider1value = sliderOneValue.first()
      this.setState({ slider1value })
      this.setState({ loading: true })
      const slider2value = sliderTwoValue.first()
      this.setState({ slider2value })
      const slider3value = sliderThreeValue.first()
      this.setState({ slider3value })
      let form = new FormData();
      form.append("_id", UData.id ? UData.id : null || UData._id ? UData._id : null);
      form.append("authtoken", UData.token ? UData.token : null || UData.authtoken ? UData.authtoken : null);
      form.append("userType", this.state.tab);
      if (sourceExpert) {
        form.append("profileImage", { uri: sourceExpert, name: "test.jpg", type: "image/jpeg" });
      }
      form.append("fullname", this.state.fullNamePersonal);
      form.append("email", this.state.emailPersonal);
      form.append("dob", (UData.dob) ? moment(UData.dob).format("YYYY-MM-DD") : '');
      form.append("age", this.getAge((UData.dob) ? moment(UData.dob).format("YYYY-MM-DD") : ''));
      if (slider1value >= 0 && slider1value < 10) {
        form.append("gender", "Male");
      } else {
        form.append("gender", "Female");
      }
      if (slider2value >= 0 && slider2value < 5) {
        form.append("consultingFees", 15);
      } else if (slider2value >= 5 && slider2value < 10) {
        form.append("consultingFees", 25);
      } else {
        form.append("consultingFees", 100);
      }
      // form.append("talkChargeTime", this.state.talkChargeTime);
      form.append("educationLabel", '');
      form.append("contact", this.state.googleAddress.city + ", " + this.state.googleAddress.country);
      form.append("website", '');
      form.append("experience", this.state.experience);
      form.append("aboutme", '');
      form.append("linkedIn", this.state.linkDinLink);
      form.append("specialization", JSON.stringify(this.state.selectedspecializationExpert.map(ids => ids._id)))
      form.append("googleAddress", this.state.googleAddress);
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
                this.setState({ loading: false })
                setTimeout(() => {
                  this.refs.toast.show('profile has been updated sucessfully!')
                }, 500)
                await AsyncStorage.setItem("fieldname", JSON.stringify(res.response.fieldname))
                await AsyncStorage.setItem("experience", JSON.stringify(res.response.experience))
                await AsyncStorage.setItem("userdata", JSON.stringify(res.response), async () => {
                  const user = await AsyncStorage.getItem('userdata')
                  const experience = await AsyncStorage.getItem('experience')
                  const fieldname = await AsyncStorage.getItem('fieldname')
                  const experienceValue = JSON.parse(experience)
                  const fieldnameValue = JSON.parse(fieldname)
                  const UData = JSON.parse(user)
                  this.setState({
                    UData,
                    experienceValue,
                    fieldnameValue
                  })
                }, async () => {
                  await this.listUserExpert()
                })
              }
              else if (res.STATUSCODE === 4002) {
                this.setState({ loading: false })
                this.refs.toast.show(JSON.stringify(res.message))
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

  getField = async () => {
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const data = {
      authtoken: token
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "get-all-field", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "authtoken": token ? token : null,
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(res => {
            if (res.STATUSCODE === 2000) {
              this.setState({ loading: false })
              this.setState({ fieldData: res.response, fieldDataExpert: res.response })
            }
            else if (res.STATUSCODE === 4002) {
              this.setState({ loading: false })
              this.refs.toast.show(res.message);
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show('Something went wrong please try again !');
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


  getSpecialty = async (id, val) => {
    const { tab } = this.state
    if (val == "other") {
      this.setState({ loading: true })
    } else {
      this.setState({ loading: false })
    }
    this.setState({ autoPopulateField: true })
    const data = {
      fieldId: id,
      userType: tab == 1 ? '1' : tab == 2 ? '2' : '',
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + "get-all-specialization", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(res => {
            if (res.STATUSCODE === 2000) {
              this.setState({ loading: false })
              let list = res.response;
              speclist = list
            }
            else if (res.STATUSCODE === 4200) {
              this.setState({ loading: false })
              this.refs.toast.show(res.message);
            }
            else {
              this.setState({ loading: false })
              this.refs.toast.show('Something went wrong please try again !');
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



  addSpeclization = (item) => {
    if (
      (this.findSpacelization(this.state.query)).length == 0
    ) {
      this.addSpecialization(this.state.query)
    } else {
      this.state.selectedspecialization.push(this.findSpacelization(this.state.query)[0])

    }
    this.setState({ query: '', autoPopulateField: true })
  }

  addSpeclizationExpert = (item) => {
    if (
      (this.findSpacelization(this.state.query)).length == 0
    ) {
      this.addSpecialization(this.state.query)
    } else {
      this.state.selectedspecializationExpert.push(this.findSpacelization(this.state.query)[0])

    }
    this.setState({ query: '', autoPopulateField: true })
  }

  removeSpeclization = (id) => {
    const selectedList = this.state.selectedspecialization
    let newList = []
    if (selectedList.length != 0) {
      selectedList.map(list => {
        if (list._id != id) {
          newList.push(list)
        }
      })
      this.setState({ selectedspecialization: newList }, () => {
        this.setState({ query: '', autoPopulateField: true })
      })
    } else {
      this.refs.toast.show('No data found! Please add specialization ')
    }
  }


  removeSpeclizationExpert = (id) => {
    const selectedList = this.state.selectedspecializationExpert
    let newList = []
    if (selectedList.length != 0) {
      selectedList.map(list => {
        if (list._id != id) {
          newList.push(list)
        }
      })
      this.setState({ selectedspecializationExpert: newList }, () => {
        this.setState({ query: '', autoPopulateField: true })
      })
    } else {
      this.refs.toast.show('No data found! Please add specialization ')
    }
  }


  addSpecialization = async (query) => {
    if(this.state.fieldId == ""){
      this.refs.toast.show('Please Select Field !')
    }else{
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const data = {
      fieldId: this.state.fieldId,
      name: query,
      userType: this.state.tab == 1 ? '1' : this.state.tab == 2 ? '2' : '',
    }
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}`+ "addSpecialization", {
          method: 'POST', // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "authtoken": token ? token : null,
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(response => {
            console.log("ggglljkljkjkjkj====>",response.response)
            if (response.STATUSCODE === 2000) {
              console.log("ggglljkljkjkjkj====>",response.response)
              this.setState({ loading: false })
              let addSpeclist = {
                _id: response.response._id,
                name: response.response.name,
                fieldId: response.response.fieldId,
                description: response.response.name
              }
              if (this.state.tab == 1) {
                this.state.selectedspecialization.push(addSpeclist)
              } else {
                this.state.selectedspecializationExpert.push(addSpeclist)
              }

              this.setState({ query: '' })
            }
            else if (response.STATUSCODE === 4002) {
              this.setState({ loading: false })
              this.refs.toast.show(response.message)
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
  
  listUserpersonal = async (id) => {
    const user = await AsyncStorage.getItem('userdata')
    const authtoken = JSON.parse(user).authtoken
    const _id = JSON.parse(user)._id
    const userType = this.state.tab
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + 'listUser?_id=' + `${_id}` + '&userType=' + `${userType}`, {
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
            if (res.STATUSCODE === 2000) {
              this.setState({ loading: false })
              res.response.map(data => {
                const { fieldData } = this.state
                if (data.location == '') {
                  this.setState({ flagDisable: true })
                } else {
                  this.setState({ flagDisable: false })
                }
                if (fieldData.length != 0) {
                  fieldData.map(dataItem => {
                    if (data.specialization.length != 0) {
                      if (data.specialization[0].fieldId == dataItem._id) {
                        this.setState({
                          [dataItem._id]: true,
                          // loading: true
                        }, () => {
                          this.getSpecialty(dataItem._id, "api")
                        })
                      }
                    }
                  })
                }
                if (data.gender == undefined) {
                  this.setState({
                    sliderOneValue: [0]
                  })
                }
                else if (data.gender == "Male") {
                  this.setState({
                    sliderOneValue: [0]
                  })
                } else {
                  this.setState({
                    sliderOneValue: [10]
                  })
                }
                this.setState({
                  fullNamePersonal: data.fullname,
                  emailPersonal: data.email,
                  selectedspecialization: data.specialization,
                  dobPersonal: (data.dob) ? moment(data.dob).format("YYYY-MM-DD") : '',
                  fullNameExpert: data.fullname,
                  emailExpert: data.email,
                  dobExpert: (data.dob) ? moment(data.dob).format("YYYY-MM-DD") : '',
                  googleAddress: { city: data.city, country: data.country },
                  contact: { city: data.city, country: data.country },
                  location: data.location,
                  ocupation: data.occupation,
                  // language: data.language,
                }, () => {
                  this.props.username(this.state.fullNamePersonal)
                  this.props.emailPersonal(this.state.emailPersonal)
                  this.props.address_string(this.state.googleAddress.city + ", " + this.state.googleAddress.country)
                  this.props.dobPersonal(this.state.dobPersonal)
                  this.props.usernameExpert(this.state.fullNameExpert)
                  this.props.emailExpert(this.state.emailExpert)
                  this.props.dobExpert(this.state.dobExpert)
                  this.props.ocupation(this.state.ocupation)
                  // this.props.language(this.state.language)
                })

              })
              this.setState({ tab: 2 }, () => {
                this.setState({ tab: 1 })
              })
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

  listUserExpert = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const authtoken = JSON.parse(user).authtoken
    const _id = JSON.parse(user)._id
    const userType = this.state.tab
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + 'listUser?_id=' + `${_id}` + '&userType=' + `${userType}`, {
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
            if (res.STATUSCODE === 2000) {
              res.response.map(data => {
                const { fieldDataExpert } = this.state
                if (fieldDataExpert.length != 0) {
                  fieldDataExpert.map(dataItem => {
                    if (data.specialization.length != 0) {
                      if (data.specialization[0].fieldId == dataItem._id) {
                        this.setState({
                          [dataItem._id]: true,
                        }, () => {
                          this.getSpecialty(dataItem._id, "api")
                        })
                      }
                    }
                  })
                }

                if (data.consultingFees == '') {
                  this.setState({
                    sliderTwoValue: [0]
                  })
                }
                else if (data.consultingFees == 15) {
                  this.setState({
                    sliderTwoValue: [0]
                  })
                } else if (data.consultingFees == 25) {
                  this.setState({
                    sliderTwoValue: [5]
                  })
                } else {
                  this.setState({
                    sliderTwoValue: [10]
                  })
                }
                this.setState({
                  fullNameExpert: data.fullname,
                  emailExpert: data.email,
                  dobExpert: (data.dob) ? moment(data.dob).format("YYYY-MM-DD") : null,
                  fullNamePersonal: data.fullname,
                  emailPersonal: data.email,
                  selectedspecializationExpert: data.specialization,
                  dobPersonal: (data.dob) ? moment(data.dob).format("YYYY-MM-DD") : null,
                  contact: { city: data.city, country: data.country },
                  contact: data.contact,
                  experience: data.experience,
                  linkDinLink: data.linkedIn,

                }, () => {
                  this.props.usernameExpert(this.state.fullNameExpert)
                  this.props.emailExpert(this.state.emailExpert)
                  this.props.address_string(this.state.googleAddress.city + ", " + this.state.googleAddress.country)
                  this.props.contact(this.state.contact.city + ", " + this.state.contact.country)
                  this.props.dobExpert(this.state.dobExpert)
                  this.props.username(this.state.fullNamePersonal)
                  this.props.emailPersonal(this.state.emailPersonal)
                  this.props.dobPersonal(this.state.dobPersonal)
                  this.props.experience(this.state.experience)
                  this.props.linkDinLink(data.linkedIn)
                })
              })
            }
            else if (res.STATUSCODE === 4002) {
              this.setState({ loading: false })
              this.refs.toast.show(res.message)
            }
            else {
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



  switchValue = (value, id) => {
    const { fieldData, fieldDataExpert } = this.state
    fieldData.map(data => {
      if (data._id == id) {
        this.setState({ [data._id]: true, fieldId: id, }, () => {
          this.getSpecialty(id, "other")
        })
      } else {
        this.setState({ [data._id]: false })
      }
    })

    fieldDataExpert.map(data => {
      if (data._id == id) {
        this.setState({ [data._id]: true, fieldId: id, }, () => {
          this.getSpecialty(id, "other")
        })
      } else {
        this.setState({ [data._id]: false })
      }
    })
  }



  render() {
    const { tab, sliderOneValue, sliderThreeValue, source, sourceExpert, sliderTwoValue, UData, query } = this.state
    const slider1value = sliderOneValue.first()
    const slider2value = sliderTwoValue.first()
    const slider3value = sliderThreeValue.first()
    const selectedspecialization = this.state.selectedspecialization ? this.state.selectedspecialization : undefined
    const selectedspecializationExpert = this.state.selectedspecializationExpert ? this.state.selectedspecializationExpert : undefined
    let speclist = this.findSpacelization(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    // const regex = query ? new RegExp(`${query.trim()}`, 'i') : ""
    return (
      <>
        <View style={{ height: Deviceheight, backgroundColor: '#1f1f1f', }}>
          {this.state.loading && <Loader loading={this.state.loading} navigation={this.props.navigation} />}
          <View style={{ marginTop: 10 }}>

            <View style={{ marginTop: 30, alignContent: "center", justifyContent: "space-around", }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 26, marginBottom: 25 }}>
                <TouchableOpacity
                  onPress={() => this.changeTab(1)}
                  activeOpacity={0.7}
                >
                  {tab == 1 ?
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ width: "100%", height: 40, borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 22, justifyContent: 'center', marginBottom: 2 }}>
                        <Text style={{ color: "#fff", fontSize: 14 }}>MY INSIGHTS</Text>
                      </View>
                    </View>
                    :
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ width: "100%", height: 40, borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 22, justifyContent: 'center', marginBottom: 2 }}>
                        <Text style={{ color: "#fff", fontSize: 14 }}>MY INSIGHTS</Text>
                      </View>
                    </View>
                  }
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={this.state.flagDisable}
                  onPress={() => this.changeTab(2)}
                  activeOpacity={0.7}
                >
                  {tab == 2 ?
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ width: "100%", height: 40, borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, justifyContent: 'center', marginBottom: 2 }}>
                        <Text style={{ color: "#fff", fontSize: 14 }}> MY EXPERTISE </Text>
                      </View>
                    </View>
                    :
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ width: "100%", height: 40, borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, justifyContent: 'center', marginBottom: 2 }}>
                        <Text style={{ color: "#fff", fontSize: 14 }}> MY EXPERTISE </Text>
                      </View>
                    </View>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {
            tab == 1 ?
              <>
                <KeyboardAvoidingView
                  behavior="padding"
                  style={{ height: Deviceheight / 1.5 }}
                >
                  <ScrollView
                    alwaysBounceVertical={true}
                    keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    style={{ height: Deviceheight / 1.5 }}
                  >
                    <View style={{}}>
                      <View style={{ marginBottom: 10, marginTop: 10, alignSelf: "center" }}>
                        {
                          source != null ?
                            <Image
                              source={{ uri: source }}
                              style={{ height: 70, width: 70, borderRadius: 35 }}
                            />
                            :
                            <Image
                              source={{ uri: UData.profileImage || UData.socialData ? UData.profileImage || UData.socialData.image : 'http://3.128.124.147/kuiktokapi/public/uploads/no-img.jpg' }}
                              style={{ height: 70, width: 70, borderRadius: 35 }}
                            />
                        }

                        <TouchableOpacity
                          onPress={this.selectPhotoPersonal}
                          activeOpacity={0.7}
                          style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "white", position: "absolute", alignItems: "center", justifyContent: "center", left: 50, alignContent: "center", tintColor: "red" }}
                        >
                          <Image
                            style={{ width: 14, height: 13, }}
                            source={require("../../assets/user/edit.png")}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginHorizontal: 46, alignItems: "center", marginBottom: 15 }}>
                        <Text style={{ color: "#d6d4d4", fontSize: 16 }}>{`${UData ? UData.fullname || UData.name : ""} ${","} ${UData.age ? UData.age : "0"}`}</Text>
                        <Text style={{ color: "#a1a1a1", fontSize: 14, textAlign: "center" }}>{UData ? UData.location : null} </Text>
                      </View>

                      <View style={{ borderTopColor: "#fff", borderTopWidth: 1, padding: 10, marginHorizontal: 15 }}>
                        <Text style={{ color: "#a1a1a1", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>INSIGHTS</Text>
                      </View>

                      <View style={{ width: Devicewidth }}>
                        {
                          this.state.fieldData.length > 0 ?
                            <FlatList
                              contentContainerStyle={{ width: Devicewidth, alignContent: "center", justifyContent: "center", alignItems: "center" }}
                              keyExtractor={item => item._id}
                              numColumns={5}
                              data={this.state.fieldData}
                              renderItem={({ item, index }) => {
                                return (
                                  <View style={{ paddingHorizontal: 8, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: "#fff", fontSize: 12, marginBottom: 5 }}>{item.name}</Text>
                                    <LabeledSwitch ref="lsr" index={index} active={this.state[item._id]} id={item._id} name={item.name} onValuesChange={(value) => this.switchValue(value, item._id)} />
                                  </View>
                                )
                              }}
                              removeClippedSubviews={false}
                              bounces={false}
                              showsHorizontalScrollIndicator={false}
                            /> : null

                        }

                      </View>

                      <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 5, zIndex: 999999, alignContent: "center" }}>
                        <Text style={{ color: "#a1a1a1", fontSize: 14, textAlign: "center", marginBottom: 10, marginLeft: 3 }}> Add topics </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", alignContent: "center" }}>
                          <View style={{ width: "62%", alignContent: "center", justifyContent: "center" }}>
                            <Autocomplete
                              autoCapitalize="none"
                              autoCorrect={false}
                              ref="autoField"
                              // hideResults={this.state.autoPopulateField}
                              style={{
                                width: "100%",
                                borderRadius: 20,
                                height: 36,
                                fontSize: 17,
                                padding: 7,
                                fontSize: 14,
                                color: "gray",
                                zIndex: 9999
                              }}
                              listStyle={{ maxHeight: 200, marginTop: 12, borderRadius: 5, position: "absolute", bottom: 50 }}
                              inputContainerStyle={styles.inputContainerStyle}
                              keyExtractor={index => index['_id'].toString()}
                              data={speclist.length === 1 && comp(query, speclist[0].name) ? [] : speclist}
                              defaultValue={query}
                              onChangeText={text => {
                                // if (!query) {
                                  this.setState({ query: text})
                                // }
                                // else {
                                //   this.setState({ query: text, autoPopulateField: true })
                                // }
                              }}
                              placeholderTextColor="#fff"
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  style={{ borderBottomColor: "gray", borderBottomWidth: 0.5 }}
                                  onPress={() => {
                                    this.setState({ query: item.name },()=>{
                                      this.addSpeclization()
                                    });

                                  }}>
                                  <Text style={styles.itemText}>
                                    {item.name}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            />

                          </View>
                          {/* <TouchableOpacity
                            onPress={this.addSpeclization}
                            disabled={regex == "" ? true : false}
                            activeOpacity={0.7}
                            style={{ width: 30, height: 30, borderRadius: 15, borderColor: "#fff", borderWidth: 1, alignContent: "center", marginLeft: 12, }}
                          >
                            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "400", textAlign: "center" }}>+</Text>
                          </TouchableOpacity> */}
                        </View>
                      </View>

                      <View style={{ alignContent: "center", borderColor: "#fff", width: "100%", justifyContent: "space-between", alignItems: "center", marginBottom: 20, }}>
                        {
                          selectedspecialization.length > 0 ?
                            <FlatList
                              contentContainerStyle={{ alignContent: "center", justifyContent: "center", paddingHorizontal: 5, alignItems: "center", paddingTop: 10, marginTop: 10 }}
                              keyExtractor={item => item._id}
                              numColumns={2}
                              data={selectedspecialization}
                              extraData={this.state}
                              renderItem={({ item }) => {
                                return (
                                  <ConversationTopics title={item.name} onClick={() => this.removeSpeclization(item._id)} />
                                )
                              }}
                              removeClippedSubviews={false}
                              bounces={false}
                              showsHorizontalScrollIndicator={false}
                            />
                            : null
                        }
                      </View>


                      <View style={{ marginBottom: 5, backgroundColor: "#232323", paddingVertical: 10 }}>
                        <Text style={{ color: "#d6d4d4", fontSize: 14, textAlign: "center", fontWeight: "bold" }}> Your Personal Infromation:</Text>
                      </View>

                      <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 15 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal:50}}>
                          {
                            slider1value == 0 ?
                              <Text style={{ color: "#f6ff00" }}>Male</Text>
                              : <Text style={{ color: "#fff" }}>Male</Text>

                          }

                          {
                            slider1value == 10 ?
                              <Text style={{ color: "#f6ff00" }}>Female</Text>
                              : <Text style={{ color: "#fff" }}>Female</Text>
                          }
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: -8 }}>
                          <MultiSlider
                            values={this.state.sliderOneValue}
                            sliderLength={250}
                            onValuesChange={(values) => this.sliderOneValuesChange(values)}
                            customMarker={CustomMarker}
                            allowOverlap
                            step={10}
                            snapped
                            selectedStyle={{ backgroundColor: "gray" }}
                          />
                        </View>
                        <Text style={{color: "gray", paddingBottom: 8, textAlign: "center" }}>Gender</Text>
                      </View>

                      <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 10 }}>
                        <Field
                          titleName="Name"
                          keyboardType="default"
                          val={this.state.fullNamePersonal}
                          component={renderField1}
                          changeField={fullNamePersonal => this.setState({ fullNamePersonal })}
                          name="username"
                        />
                      </View>

                      <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 10 }}>
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
                        // maxDate={new Date()}
                        />
                      </View>


                      <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 10 }}>
                        <Field
                          titleName="Ocupation"
                          keyboardType="default"
                          component={renderField1}
                          val={this.state.ocupation}
                          changeField={ocupation => this.setState({ ocupation })}
                          name="ocupation"
                        />
                      </View>


                      <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 10 }}>
                        <Field
                          titleName="Email"
                          keyboardType="default"
                          val={this.state.emailPersonal}
                          component={renderField2}
                          changeField={emailPersonal => this.setState({ emailPersonal })}
                          name="email"
                          // onPress={()=>this.props.navigation.navigate("ChangeEmailPersonal")}
                          returnKeyType="done"
                        // editable={false}
                        />
                      </View>

                      <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 110 }}>
                        {/* {this.renderLocation()} */}
                        <Field
                          titleName="Location"
                          component={googlePlaceSearch}
                          dValue={this.state.googleAddress != undefined && this.state.googleAddress.city ? this.state.googleAddress.city + "," + this.state.googleAddress.country : ''}
                          name="address"
                          valueChange={(data, details) => this.googleAddressChange(data, details)}
                        />
                      </View>


                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>

                <View style={{ alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={this.props.handleSubmit(this.editProfilePersonal)}
                    activeOpacity={0.7}
                    style={{ position: "absolute", bottom: 42, backgroundColor: '#4b4949', width: "40%", paddingVertical: 12, borderRadius: 8, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
              : null
          }

          {
            tab == 2 ?
              <>
                <KeyboardAvoidingView
                  behavior="padding"
                  style={{ height: Deviceheight / 1.5 }}
                >
                  <ScrollView
                    alwaysBounceVertical={true}
                    keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{ height: Deviceheight / 1.5 }}
                  >
                    <View style={{}}>
                      <View style={{ alignItems: "center", marginBottom: 10, marginTop: 10 }}>
                        {
                          sourceExpert != null ?
                            <Image
                              source={{ uri: sourceExpert }}
                              style={{ height: 70, width: 70, borderRadius: 35 }}
                            />
                            :
                            <Image
                              source={{ uri: UData.profileImage || UData.socialData ? UData.profileImage || UData.socialData.image : 'http://3.128.124.147/kuiktokapi/public/uploads/no-img.jpg' }}
                              style={{ height: 70, width: 70, borderRadius: 35 }}
                            />
                        }


                        <TouchableOpacity
                          onPress={this.selectPhotoExpert}
                          activeOpacity={0.7}
                          style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "white", position: "absolute", alignItems: "center", justifyContent: "center", alignContent: "center", right: "42%", tintColor: "red" }}
                        >
                          <Image
                            style={{ width: 14, height: 13, }}
                            source={require("../../assets/user/edit.png")}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginHorizontal: 46, alignItems: "center", marginBottom: 20 }}>
                        <Text style={{ color: "#d6d4d4", fontSize: 16 }}>{`${UData ? UData.fullname || UData.name : ""} ${","}${this.state.fieldnameValue.length > 0 ? this.state.fieldnameValue.slice(0, 2).map((data) => data) : 0} ${","} ${this.state.experienceValue ? this.state.experienceValue : 0}${" "}${"years"}`}</Text>
                        <Text style={{ color: "#a1a1a1", fontSize: 14, textAlign: "center" }}>{UData ? UData.location : null} </Text>
                      </View>

                      <View style={{ borderTopColor: "#fff", borderTopWidth: 1, padding: 10, marginHorizontal: 15, marginBottom: 8 }}>
                        <Text style={{ color: "#a1a1a1", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>EXPERTISE </Text>
                      </View>

                      <View style={{ width: Devicewidth }}>
                        {
                          this.state.fieldDataExpert.length > 0 ?
                            <FlatList
                              contentContainerStyle={{ width: Devicewidth, alignContent: "center", justifyContent: "center", alignItems: "center" }}
                              keyExtractor={item => item._id}
                              numColumns={5}
                              data={this.state.fieldDataExpert.slice(0, 5)}
                              renderItem={({ item, index }) => {
                                return (
                                  <View style={{ paddingHorizontal: 8, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: "#fff", fontSize: 12, marginBottom: 5 }}>{item.name}</Text>
                                    <LabeledSwitch ref="lsr" index={index} active={this.state[item._id]} id={item._id} name={item.name} onValuesChange={(value) => this.switchValue(value, item._id)} />
                                  </View>
                                )
                              }}
                              removeClippedSubviews={false}
                              bounces={false}
                              showsHorizontalScrollIndicator={false}
                            /> : null

                        }

                      </View>

                      <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 5, zIndex: 999999, alignContent: "center" }}>
                        <Text style={{ color: "#a1a1a1", fontSize: 14, textAlign: "center", marginBottom: 10 }}>Add up to 5 topics</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", alignContent: "center" }}>
                          <View style={{ width: "62%", alignContent: "center", justifyContent: "center"}}>
                            <Autocomplete
                              autoCapitalize="none"
                              autoCorrect={false}
                              // hideResults={this.state.autoPopulateField}
                              ref="autoField"
                              style={{
                                width: "100%",
                                borderRadius: 20,
                                height: 36,
                                fontSize: 17,
                                padding: 7,
                                fontSize: 14,
                                color: "gray",
                                zIndex: 9999
                              }}
                              keyExtractor={index => index['id']}
                              listStyle={{ maxHeight: 200, marginTop: 12, borderRadius: 5, position: "absolute", bottom: 50 }}
                              inputContainerStyle={styles.inputContainerStyle}
                              data={speclist.length === 1 && comp(query, speclist[0].name) ? [] : speclist}
                              defaultValue={query}
                              onChangeText={text => {
                                // if (query == '') {
                                  this.setState({ query: text })
                                // }
                                // else {
                                //   this.setState({ query: text, autoPopulateField: true })
                                // }
                              }}
                              placeholderTextColor="#fff"
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  style={{ borderBottomColor: "gray", borderBottomWidth: 0.5 }}
                                  onPress={() => {
                                    this.setState({ query: item.name },()=>{
                                      this.addSpeclizationExpert()
                                    });

                                  }}>
                                  <Text style={styles.itemText}>
                                    {item.name}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            />
                          </View>

                          {/* <TouchableOpacity
                            onPress={this.addSpeclizationExpert}
                            disabled={regex == "" ? true : false}
                            activeOpacity={0.7}
                            style={{ width: 30, height: 30, borderRadius: 15, borderColor: "#fff", borderWidth: 1, alignContent: "center", marginLeft: 12, }}
                          >
                            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "400", textAlign: "center" }}>+</Text>
                          </TouchableOpacity> */}
                        </View>
                      </View>


                      <View style={{ alignContent: "center", borderßColor: "#fff", width: "100%", justifyContent: "space-between", alignItems: "center", marginBottom: 20, }}>
                        {
                          selectedspecializationExpert.length > 0 ?
                            <FlatList
                              contentContainerStyle={{ alignContent: "center", justifyContent: "center", paddingHorizontal: 5, alignItems: "center", paddingTop: 15, marginTop: 15 }}
                              keyExtractor={item => item._id}
                              numColumns={2}
                              data={selectedspecializationExpert}
                              extraData={this.state}
                              renderItem={({ item }) => {
                                return (
                                  <ConversationTopics title={item.name} onClick={() => this.removeSpeclizationExpert(item._id)} />
                                )
                              }}
                              removeClippedSubviews={false}
                              bounces={false}
                              showsHorizontalScrollIndicator={false}
                            />
                            : null
                        }
                      </View>

                      <View style={{ marginBottom: 5, backgroundColor: "#232323", paddingVertical: 10 }}>
                        <Text style={{ color: "#d6d4d4", fontSize: 14, textAlign: "center", fontWeight: "bold" }}> Your hourly consulting rate:</Text>
                      </View>

                      <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingVertical: 15 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal:50}}>
                          {
                            slider2value == 0 ?
                              <Text style={{ color: "#f6ff00" }}>$15</Text>
                              : <Text style={{ color: "#fff" }}>$15</Text>

                          }

                          {
                            slider2value == 5 ?
                              <Text style={{ color: "#f6ff00" }}>$25</Text>
                              : <Text style={{ color: "#fff" }}>$25</Text>
                          }

                          {
                            slider2value == 10 ?
                              <Text style={{ color: "#f6ff00" }}>$100</Text>
                              : <Text style={{ color: "#fff" }}>$100</Text>
                          }
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: -8 }}>
                          <MultiSlider
                            values={this.state.sliderTwoValue}
                            sliderLength={250}
                            onValuesChange={(values) => this.sliderTwoValuesChange(values)}
                            customMarker={CustomMarker}
                            allowOverlap
                            step={5}
                            snapped
                            selectedStyle={{ backgroundColor: "gray" }}
                          />
                        </View>
                      </View>


                      <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 10 }}>
                        <Field
                          titleName="Years of Experience"
                          keyboardType="number-pad"
                          val={this.state.experience}
                          changeField={experience => this.setState({ experience })}
                          component={renderField1}
                          name="experience"
                          textContentType="addressCityAndState"
                        />
                      </View>


                      <View style={{ backgroundColor: "#232323", paddingVertical: 10, marginBottom: 100 }}>
                        <Field
                          titleName="LinkedIn Link"
                          keyboardType="default"
                          val={this.state.linkDinLink}
                          changeField={linkDinLink => this.setState({ linkDinLink })}
                          component={renderField1}
                          name="linkdinlink"
                        />
                      </View>

                      {
                        this.state.source == null ?
                          <Text style={{ color: "red", textAlign: "center", fontSize: 14 }}>{this.state.imageError}</Text>
                          : null
                      }
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>

                <View style={{ alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={this.props.handleSubmit(this.editProfileExpert)}
                    activeOpacity={0.7}
                    style={{ position: "absolute", bottom: 42, backgroundColor: '#4b4949', width: "40%", paddingVertical: 12, borderRadius: 8, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
              : null
          }

          <Toast
            ref="toast"
            style={{ backgroundColor: '#f6ff00' }}
            position='top'
            positionValue={20}
            textStyle={{ color: '#000', fontSize: 16, fontWeight: "bold" }}
          />
        </View>
      </>
    );
  }
}


const mapStateToProps = (state) => ({
  formState: state.form,
});

const FormComponent = connect(
  mapStateToProps, {
  username: val => change('user', 'username', val),
  usernameExpert: val => change('user', 'username', val),
  emailPersonal: val => change('user', 'email', val),
  emailExpert: val => change('user', 'email', val),
  address: val => change('user', 'address', val),
  contact: val => change('user', 'contact', val),
  address_string: val => change('user', 'address', val),
  googleAddress: val => change('user', 'googleAddress', val),
  dobPersonal: val => change('user', 'age', val),
  dobExpert: val => change('user', 'age', val),
  ocupation: val => change('user', 'ocupation', val),
  experience: val => change('user', 'experience', val),
  linkDinLink: val => change('user', 'linkdinlink', val),
}
)(user)

export default reduxForm({
  form: 'user',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate,
})(FormComponent)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5FCFF',
  },
  autocompleteContainer: {
    color: '#000000',
    fontSize: 17,
    height: 36,
    padding: 12,
    borderRadius: 5,
  },
  inputContainerStyle: {
    borderRadius: 20,
    borderColor: "#fff",
    borderWidth: 1,
    alignItems: "center",
    width: "90%",
    height: 35,
    paddingHorizontal: 5,
    marginHorizontal: 15,
    zIndex: 9999,
  },
  itemText: {
    fontSize: 16,
    margin: 5,
    textAlign: "center"
  },
});

