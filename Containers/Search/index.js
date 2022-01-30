import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform, TextInput, FlatList, Alert } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMarker from '../../Components/CustomSlider/index'
import AsyncStorage from '@react-native-community/async-storage';
import Toast, { DURATION } from 'react-native-easy-toast'
import Loader from '../../navigation/AuthLoadingScreen'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { base_url } from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";

const Deviceheight = Dimensions.get('window').height;

Array.prototype.first = function () {
  return this[0];
};
Array.prototype.last = function () {
  return this[1];
};
let speclist = [];
export default class Search extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Search Settings',
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

  componentDidMount = async () => {
    this.localData();
  };


  state = {
    tab: "1",
    UData: {},
    sliderOneValue: [0],
    sliderTwoValue: [0],
    sliderThreeValue: [0],
    sliderFourValue: [0],
    nonCollidingMultiSliderValueOne: [16, 100],
    nonCollidingMultiSliderValueTwo: [16, 100],
    slider1value: '',
    slider2value: '',
    slider3value: '',
    slider4value: '',
    settingStartage: '',
    settingEndage: '',
    settingStartageExpert: '',
    settingEndageExpert: '',
    loading: false,
  }

  changeTab = (tab) => {
    this.setState({ tab: tab })
    if (tab == 2) {
      this.listUserExpert()
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

  sliderThreeValuesChange(values) {
    this.setState({
      sliderThreeValue: values,
    });
  };

  sliderFourValuesChange(values) {
    this.setState({
      sliderFourValue: values,
    });
  };

  nonCollidingMultiSliderValuesOneChange(values) {
    this.setState({
      nonCollidingMultiSliderValueOne: values,
    });
  };

  nonCollidingMultiSliderValuesTwoChange(values) {
    this.setState({
      nonCollidingMultiSliderValueTwo: values,
    });
  };


  localData = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const UData = JSON.parse(user)
    this.setState({ UData }, () => {
      this.listUserpersonal()
    })
  }

  editProfilePersonal = async () => {
    this.setState({ loading: true })
    const { UData, sliderOneValue, sliderTwoValue, nonCollidingMultiSliderValueOne } = this.state
    const slider1value = sliderOneValue.first()
    this.setState({ slider1value })
    const slider2value = sliderTwoValue.first()
    this.setState({ slider2value })
    const settingStartage = nonCollidingMultiSliderValueOne.first() + 1
    this.setState({ settingStartage })
    const settingEndage = nonCollidingMultiSliderValueOne.last()
    this.setState({ settingEndage })
    let form = new FormData();
    form.append("_id", UData.id ? UData.id : null || UData._id ? UData._id : null);
    // form.append("authtoken", UData.token ? UData.token : null || UData.authtoken ? UData.authtoken : null);
    form.append("userType", this.state.tab);
    form.append("apptype", Platform.OS === 'android' ? 'ANDROID' : 'IOS');
    form.append("settingUserType", this.state.tab);
    let arrGender = []
    if (slider1value >= 0 && slider1value < 5) {
      arrGender.push('Male')
    } else if (slider1value >= 5 && slider1value < 10) {
      // arrGender.push('Male', 'Female')
      arrGender.push('Male')
      arrGender.push('Female')

    } else if (slider1value >= 10) {
      arrGender.push('Male')
      arrGender.push('Female')
      arrGender.push('N/A')
    }
    form.append("settingGender", JSON.stringify(arrGender));
    let arrContry = []
    if (slider2value >= 0 && slider2value < 5) {
      arrContry.push('city')
    } else if (slider2value >= 5 && slider2value < 10) {
      // arrContry.push('City', 'Country')
      arrContry.push('city')
      arrContry.push('country')

    } else if (slider2value >= 10) {
      arrContry.push('city')
      arrContry.push('country')
      arrContry.push('world')
    }
    form.append("settingTalkLocation", JSON.stringify(arrContry));
    form.append("settingStartage", settingStartage);
    form.append("settingEndage", settingEndage);
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
                this.refs.toast.show('Kuiktok settings has been saved sucessfully!!')
              }, 500)
              await AsyncStorage.setItem("userdata", JSON.stringify(res.response))

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
            console.log('Success:', res);
            if (res.STATUSCODE === 2000) {
                    res.response.map(data => {
                      if (data.settingGender.length > 0) {
                        data.settingGender.map(gender => {
                          if (gender === "Male" && data.settingGender.length == 1) {
                            this.sliderThreeValuesChange([0])
                          } else if (gender === "Female" && data.settingGender.length == 2) {
                            this.sliderThreeValuesChange([5])
                          } else {
                            this.sliderThreeValuesChange([10])
                          }
                        })
                      } else {
                        this.sliderThreeValuesChange([0])
                      }
          
                      if (data.settingEndage) {
                        this.nonCollidingMultiSliderValuesTwoChange([data.settingStartage, data.settingEndage])
                      }
          
                      if (data.settingTalkLocation.length > 0) {
                        data.settingTalkLocation.map(location => {
                          if (location === "city" && data.settingTalkLocation.length == 1) {
                            this.sliderFourValuesChange([0])
                          } else if (location === "country" && data.settingTalkLocation.length == 2) {
                            this.sliderFourValuesChange([5])
                          } else {
                            this.sliderFourValuesChange([10])
                          }
                        })
                      } else {
                        this.sliderFourValuesChange([0])
                      }
          
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
            console.log('Success:', res);
            if (res.STATUSCODE === 2000) {
                    res.response.map(data => {
                      if (data.settingGender.length > 0) {
                        data.settingGender.map(gender => {
                          if (gender === "Male" && data.settingGender.length == 1) {
                            this.sliderOneValuesChange([0])
                          } else if (gender === "Female" && data.settingGender.length == 2) {
                            this.sliderOneValuesChange([5])
                          } else {
                            this.sliderOneValuesChange([10])
                          }
                        })
                      } else {
                        this.sliderOneValuesChange([0])
                      }
          
                      if (data.settingEndage) {
                        this.nonCollidingMultiSliderValuesOneChange([data.settingStartage, data.settingEndage])
                      }
          
                      if (data.settingTalkLocation.length > 0) {
                        data.settingTalkLocation.map(location => {
                          if (location === "city" && data.settingTalkLocation.length == 1) {
                            this.sliderTwoValuesChange([0])
                          } else if (location === "country" && data.settingTalkLocation.length == 2) {
                            this.sliderTwoValuesChange([5])
                          } else {
                            this.sliderTwoValuesChange([10])
                          }
                        })
                      } else {
                        this.sliderTwoValuesChange([0])
                      }
          
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


  editProfileExpert = async () => {
    this.setState({ loading: true })
    const { UData, sliderThreeValue, sliderFourValue, nonCollidingMultiSliderValueTwo } = this.state
    const slider3value = sliderThreeValue.first()
    this.setState({ slider3value })
    const slider4value = sliderFourValue.first()
    this.setState({ slider4value })
    const settingStartageExpert = nonCollidingMultiSliderValueTwo.first() + 1
    this.setState({ settingStartageExpert })
    const settingEndageExpert = nonCollidingMultiSliderValueTwo.last()
    this.setState({ settingEndageExpert })
    let form = new FormData();
    form.append("_id", UData.id ? UData.id : null || UData._id ? UData._id : null);
    // form.append("authtoken", UData.token ? UData.token : null || UData.authtoken ? UData.authtoken : null);
     form.append("userType", this.state.tab);
    form.append("apptype", Platform.OS === 'android' ? 'ANDROID' : 'IOS');
    form.append("settingUserType", this.state.tab);
    let arrGender = []
    if (slider3value >= 0 && slider3value < 5) {
      arrGender.push('Male')
    } else if (slider3value >= 5 && slider3value < 10) {
      // arrGender.push('Male', 'Female')
      arrGender.push('Male')
      arrGender.push('Female')

    } else if (slider3value >= 10) {
      arrGender.push('Male')
      arrGender.push('Female')
      arrGender.push('N/A')
    }
    form.append("settingGender", JSON.stringify(arrGender));
    let arrContry = []
    if (slider4value >= 0 && slider4value < 5) {
      arrContry.push('city')
    } else if (slider4value >= 5 && slider4value < 10) {
      // arrContry.push('City', 'Country')
      arrContry.push('city')
      arrContry.push('country')

    } else if (slider4value >= 10) {
      arrContry.push('city')
      arrContry.push('country')
      arrContry.push('world')
    }
    form.append("settingTalkLocation", JSON.stringify(arrContry));
    form.append("settingStartage", settingStartageExpert);
    form.append("settingEndage", settingEndageExpert);
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
                this.refs.toast.show('Kuiktok settings has been saved sucessfully!')
              }, 500)
              await AsyncStorage.setItem("userdata", JSON.stringify(res.response))

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

  render() {
    const { tab, sliderOneValue, sliderTwoValue, sliderThreeValue, sliderFourValue, nonCollidingMultiSliderValueOne, nonCollidingMultiSliderValueTwo, fieldData, query } = this.state
    const slider1value = sliderOneValue.first()
    const slider2value = sliderTwoValue.first()
    const slider3value = sliderThreeValue.first()
    const slider4value = sliderFourValue.first()
    const settingStartage = nonCollidingMultiSliderValueOne.first() + 1
    const settingEndage = nonCollidingMultiSliderValueOne.last()
    const settingStartageExpert = nonCollidingMultiSliderValueTwo.first() + 1
    const settingEndageExpert = nonCollidingMultiSliderValueTwo.last()
    return (

      <View style={{ height: Deviceheight, backgroundColor: '#1f1f1f', }}>
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        {/* {this.renderCallReceived()} */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginTop: 50, alignContent: "center", justifyContent: "space-around", }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 26, marginBottom: 15 }}>
              <TouchableOpacity
                onPress={() => this.changeTab(1)}
                activeOpacity={0.7}
              >
                {tab == 1 ?
                  <View style={{ alignItems: 'center', marginBottom: 20, }}>
                    <Text style={{ color: "#f6ff00", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>INSIGHTS</Text>
                    <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                      <Image
                        style={{ width: 15, height: 14 }}
                        source={require('../../assets/home/two_users.png')}
                      />
                    </View>
                  </View>
                  :
                  <View style={{ alignItems: 'center', marginBottom: 20, }}>
                    <Text style={{ color: "#484848", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>INSIGHTS</Text>
                    <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                      <Image
                        style={{ width: 15, height: 14 }}
                        source={require('../../assets/home/two_users.png')}

                      />
                    </View>
                  </View>
                }
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.changeTab(2)}
                activeOpacity={0.7}
              >
                {tab == 2 ?
                  <View style={{ alignItems: 'center', marginBottom: 20, justifyContent: "space-around" }}>
                    <Text style={{ color: "#f6ff00", fontSize: 10, fontWeight: 'bold', marginBottom: 4, }}>EXPERTS</Text>
                    <View style={{ borderWidth: 1, borderColor: "#f6ff00", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                      <Image
                        style={{ width: 16, height: 15, tintColor: "#fff" }}
                        source={require('../../assets/home/two_users.png')}
                      />
                    </View>
                  </View>
                  :
                  <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ color: "#484848", fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>EXPERTS</Text>
                    <View style={{ borderWidth: 1, borderColor: "#484848", borderRadius: 5, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, justifyContent: 'center', marginBottom: 4 }}>
                      <Image
                        style={{ width: 16, height: 15, tintColor: "#fff" }}
                        source={require('../../assets/home/two_users.png')}

                      />
                    </View>
                  </View>
                }
              </TouchableOpacity>
            </View>
          </View>

          {
            tab == 1 ?
              <>
                <ScrollView
                  alwaysBounceVertical={true}
                  keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                  showsVerticalScrollIndicator={false}
                  style={{}}
                >
                  <View style={{ height: Deviceheight + 100 }}>
                    <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal:50 }}>
                        {
                          slider2value == 0 ?
                            <Text style={{ color: "#f6ff00" }}>Local</Text>
                            : <Text style={{ color: "#fff" }}>Local</Text>

                        }

                        {
                          slider2value == 5 ?
                            <Text style={{ color: "#f6ff00" }}>National</Text>
                            : <Text style={{ color: "#fff" }}>National</Text>
                        }

                        {
                          slider2value == 10 ?
                            <Text style={{ color: "#f6ff00" }}>Global</Text>
                            : <Text style={{ color: "#fff" }}>Global</Text>
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
                      <Text style={{ color: "gray", paddingBottom: 8, textAlign: "center" }}>Location range</Text>
                    </View>


                    <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 12 }}>
                      <Text style={{ color: "#f6ff00", textAlign: "center", marginBottom: -12 }}>{`${settingStartage}` + "-" + `${settingEndage}`}</Text>
                      <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <MultiSlider
                          values={[
                            this.state.nonCollidingMultiSliderValueOne[0],
                            this.state.nonCollidingMultiSliderValueOne[1],
                          ]}
                          sliderLength={250}
                          onValuesChange={(values) => this.nonCollidingMultiSliderValuesOneChange(values)}
                          min={16}
                          max={100}
                          step={1}
                          allowOverlap={false}
                          snapped
                          minMarkerOverlapDistance={40}
                          customMarker={CustomMarker}
                        />
                      </View>
                      <Text style={{color: "gray", paddingBottom: 8,textAlign:"center" }}>Age Range</Text>
                    </View>

                    <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal:50 }}>
                        {
                          slider1value == 0 ?
                            <Text style={{ color: "#f6ff00" }}>Male</Text>
                            : <Text style={{ color: "#fff" }}>Male</Text>

                        }

                        {
                          slider1value == 5 ?
                            <Text style={{ color: "#f6ff00" }}>Female</Text>
                            : <Text style={{ color: "#fff" }}>Female</Text>
                        }

                        {
                          slider1value == 10 ?
                            <Text style={{ color: "#f6ff00" }}>Both</Text>
                            : <Text style={{ color: "#fff" }}>Both</Text>
                        }
                      </View>
                      <View style={{ alignItems: "center", justifyContent: "center", marginTop: -8 }}>
                        <MultiSlider
                          values={this.state.sliderOneValue}
                          sliderLength={250}
                          onValuesChange={(values) => this.sliderOneValuesChange(values)}
                          customMarker={CustomMarker}
                          allowOverlap
                          step={5}
                          snapped
                          selectedStyle={{ backgroundColor: "gray" }}
                        />
                      </View>
                      <Text style={{ color: "gray", paddingBottom: 8, textAlign: "center" }}>Gender</Text>
                    </View>


                    <TouchableOpacity
                      onPress={this.editProfilePersonal}
                      activeOpacity={0.7}
                      style={{ borderWidth: 1, borderColor: "#4b4949", paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', marginHorizontal: "23%", borderRadius: 6, marginBottom: 60 }}
                    >
                      <Text style={{ color: "#fff", fontSize: 20 }}>Save</Text>
                    </TouchableOpacity>

                  </View>
                </ScrollView>
              </>
              : null
          }


          {
            tab == 2 ?
              <>
                <ScrollView
                  alwaysBounceVertical={true}
                  keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                  showsVerticalScrollIndicator={false}
                  style={{}}
                >
                  <View style={{ height: Deviceheight + 100 }}>
                    <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal:50 }}>
                        {
                          slider4value == 0 ?
                            <Text style={{ color: "#f6ff00" }}>Local</Text>
                            : <Text style={{ color: "#fff" }}>Local</Text>

                        }

                        {
                          slider4value == 5 ?
                            <Text style={{ color: "#f6ff00" }}>National</Text>
                            : <Text style={{ color: "#fff" }}>National</Text>
                        }

                        {
                          slider4value == 10 ?
                            <Text style={{ color: "#f6ff00" }}>Global</Text>
                            : <Text style={{ color: "#fff" }}>Global</Text>
                        }

                      </View>
                      <View style={{ alignItems: "center", justifyContent: "center", marginTop: -8 }}>
                        <MultiSlider
                          values={this.state.sliderFourValue}
                          sliderLength={250}
                          onValuesChange={(values) => this.sliderFourValuesChange(values)}
                          customMarker={CustomMarker}
                          allowOverlap
                          step={5}
                          snapped
                          selectedStyle={{ backgroundColor: "gray" }}
                        />
                      </View>
                      <Text style={{ color: "gray", paddingBottom: 8, textAlign: "center" }}>Location range</Text>
                    </View>


                    <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 12 }}>
                      <Text style={{ color: "#f6ff00", marginBottom: -12, textAlign: "center" }}>{`${settingStartageExpert}` + "-" + `${settingEndageExpert}`}</Text>
                      <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <MultiSlider
                          values={[
                            this.state.nonCollidingMultiSliderValueTwo[0],
                            this.state.nonCollidingMultiSliderValueTwo[1],
                          ]}
                          sliderLength={250}
                          onValuesChange={(values) => this.nonCollidingMultiSliderValuesTwoChange(values)}
                          min={16}
                          max={100}
                          step={1}
                          allowOverlap={false}
                          snapped
                          minMarkerOverlapDistance={40}
                          customMarker={CustomMarker}
                        />
                      </View>
                      <Text style={{  color: "gray", paddingBottom: 8,textAlign:"center" }}>Age Range</Text>
                    </View>

                    <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal:50 }}>
                        {
                          slider3value == 0 ?
                            <Text style={{ color: "#f6ff00" }}>Male</Text>
                            : <Text style={{ color: "#fff" }}>Male</Text>

                        }

                        {
                          slider3value == 5 ?
                            <Text style={{ color: "#f6ff00" }}>Female</Text>
                            : <Text style={{ color: "#fff" }}>Female</Text>
                        }

                        {
                          slider3value == 10 ?
                            <Text style={{ color: "#f6ff00" }}>Both</Text>
                            : <Text style={{ color: "#fff" }}>Both</Text>
                        }
                      </View>
                      <View style={{ alignItems: "center", justifyContent: "center", marginTop: -8 }}>
                        <MultiSlider
                          values={this.state.sliderThreeValue}
                          sliderLength={250}
                          onValuesChange={(values) => this.sliderThreeValuesChange(values)}
                          customMarker={CustomMarker}
                          allowOverlap
                          step={5}
                          snapped
                          selectedStyle={{ backgroundColor: "gray" }}
                        />
                      </View>
                      <Text style={{  color: "gray", paddingBottom: 8, textAlign: "center" }}>Gender</Text>
                    </View>

                    <TouchableOpacity
                      onPress={this.editProfileExpert}
                      activeOpacity={0.7}
                      style={{ borderWidth: 1, borderColor: "#4b4949", paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', marginHorizontal: "23%", borderRadius: 10, marginBottom: 60 }}
                    >
                      <Text style={{ color: "#fff", fontSize: 20 }}>Save</Text>
                    </TouchableOpacity>

                  </View>
                </ScrollView>
              </>
              : null
          }
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliders: {
    margin: 20,
    width: 280,
  },
  text: {
    alignSelf: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 30,
  },
  sliderOne: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    fontSize: 15,
    margin: 2,
  }
});