import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, FlatList, Modal, KeyboardAvoidingView, TextInput, StatusBar, SafeAreaView ,StyleSheet} from 'react-native';
import { connect } from 'react-redux'
 import ConversationTopics from '../../Components/ConversationTopics'
import { Field, reduxForm } from 'redux-form';
import { base_url } from "../../Services/constants"
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import LabeledSwitch from '../../Components/CustomSwitch/'
import Autocomplete from 'react-native-autocomplete-input';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../navigation/AuthLoadingScreen'
import Toast from 'react-native-tiny-toast'
import { renderField1, renderField2, datePicker, googlePlaceSearch } from "../../Components/ReduxForm/inputs"
const Deviceheight = Dimensions.get('window').height;
const Devicewidth = Dimensions.get('window').width;

let speclist = []
let experienceArray = ['0-3','4-7','7-10','10+','20+']

class YourExpertise extends Component {

  static navigationOptions = {
    header: null
  };

  state = {
    fieldData: [],
    value: "",
    query: '',
    selectedspecialization: [],
    fieldId: '',
    selectedExperience:'0-3'
  }

  componentDidMount = async () => {

    this.getField();
    this.getLocalData()
    this.listUserpersonal()
  }


  getLocalData = async () => {
    const user = await AsyncStorage.getItem('userdata')
    const experience = await AsyncStorage.getItem('experience')
    const fieldname = await AsyncStorage.getItem('fieldname')
    const experienceValue = JSON.parse(experience)
    const fieldnameValue = JSON.parse(fieldname)
    const UData = JSON.parse(user)
    this.setState({ UData})
  }

    findSpacelization(query) {
    // let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    // let checkSpacialChar = format.test(query)
    //method called everytime when we change the value of the input
    if (query === '') {
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
      userType:  '2',
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
              Toast.show(res.message,{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })
            }
            else {
              this.setState({ loading: false })
              Toast.show('Something went wrong please try again !',{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })
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

  getallSpecialty = async (id) => {
    this.setState({ loading: true })
    const { tab } = this.state
    const data = {
      fieldId: id,
      userType: '2',
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
              Toast.show(res.message,{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })
            }
            else {
              this.setState({ loading: false })
              Toast.show('Something went wrong please try again !',{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })
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

  getField = async () => {
    this.setState({ loading: true })
    const user = await AsyncStorage.getItem('userdata')
    const token = JSON.parse(user).authtoken
    const data = {
       
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
              this.setState({ fieldData: res.response })
            }
            else if (res.STATUSCODE === 4002) {
              this.setState({ loading: false })
              Toast.show(res.message,{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })

            }
            else {
              this.setState({ loading: false })
              Toast.show('Something went wrong please try again !',{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })

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

  switchValue = (value, id) => {
    const { fieldData } = this.state
    fieldData.map(data => {
      if (data._id == id) {
        this.setState({ [data._id]: true, fieldId: id }, () => {
          this.getallSpecialty(id)
        })
      } else {
        this.setState({ [data._id]: false })
      }
    })
  }

    addSpeclization = () => {
    if (
      (this.findSpacelization(this.state.query)).length == 0
    ) {
      this.addSpecialization(this.state.query)
    } else {
      this.state.selectedspecialization.push(this.findSpacelization(this.state.query)[0])
    }
    this.setState({ test: true, query: '' })
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
        this.setState({ query: '' })
      })
    } else {
      Toast.show('No data found! Please add specialization ',{
        position: Toast.position.center,
        containerStyle:{backgroundColor: '#f6ff00'},
        textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
       
      })
    }
  }

  editProfilePersonal = async (DOB) => {
    const { UData, selectedspecialization,selectedExperience} = this.state
      this.setState({ loading: true })
      let form = new FormData();
      form.append("_id", UData.id ? UData.id : null || UData._id ? UData._id : null);
      // form.append("authtoken", UData.token ? UData.token : null || UData.authtoken ? UData.authtoken : null);
      form.append("userType", "2");
      form.append("specialization", JSON.stringify(this.state.selectedspecialization.map(ids => ids._id)))
      form.append("experience", this.state.selectedExperience);
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
                Toast.show('profile has been updated sucessfully!',{
                  containerStyle:{backgroundColor: '#f6ff00'},
                  textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
                 
                })
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
                  await this.listUserpersonal()
                })

              }
              else if (res.STATUSCODE === 4002) {
                this.setState({ loading: false })
                Toast.show(res.message,{
                  position: Toast.position.center,
                  containerStyle:{backgroundColor: '#f6ff00'},
                  textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
                 
                })

              }
              else {
                this.setState({ loading: false })
                Toast.show('Something went wrong please try again !',{
                  position: Toast.position.center,
                  containerStyle:{backgroundColor: '#f6ff00'},
                  textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
                 
                })
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

  listUserpersonal = async (id) => {
    const user = await AsyncStorage.getItem('userdata')
    const authtoken = JSON.parse(user).authtoken
    const _id = JSON.parse(user)._id
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        fetch(`${base_url}` + 'listUser?_id=' + `${_id}` + '&userType=' + `${"2"}`, {
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
                this.setState({
                  selectedspecialization: data.specialization,
                  selectedExperience:data.experience
                })
              })
            }
            else if (res.STATUSCODE === 4002) {
              this.setState({ loading: false })
              Toast.show(res.message,{
                position: Toast.position.center,
                containerStyle:{backgroundColor: '#f6ff00'},
                textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
               
              })

            }
            else {
              this.setState({ loading: false })
              this.setState({ loading: false })
                Toast.show('Something went wrong please try again !',{
                  position: Toast.position.center,
                  containerStyle:{backgroundColor: '#f6ff00'},
                  textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
                 
                })
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

  Next = ()=>{
    const { UData, selectedspecialization,selectedExperience} = this.state
    if (selectedspecialization.length == 0) {
      Toast.show('Please Add specialization !',{
        position: Toast.position.CENTER,
        containerStyle:{backgroundColor: '#f6ff00'},
        textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
       
      })
    }
    else if(selectedExperience.length == 0){
      Toast.show('Please select experience !',{
        position: Toast.position.CENTER,
        containerStyle:{backgroundColor: '#f6ff00'},
        textStyle:{ color: '#000', fontSize: 16, fontWeight: "bold" }
       
      })
    }
    else{
      this.editProfilePersonal()
      this.props.onClick()
    }
  }


  render() {
    const { navigation } = this.props
    const { tab, query } = this.state
    console.log("fgdfggdfg",this.state.selectedExperience)
     const selectedspecialization = this.state.selectedspecialization ? this.state.selectedspecialization : undefined
    let speclist = this.findSpacelization(query);
     const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={{ flex: 1, backgroundColor: '#0e0e0e' }}>
        <SafeAreaView >
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "bold" }}>YOUR EXPERTISE</Text>
          </View>

          <View style={{ backgroundColor: "#f6ff00", marginHorizontal: 40, borderRadius: 10, paddingVertical: 10, marginBottom: 40,marginTop:30,paddingHorizontal:10 }}>
            <Text style={{ fontSize: 16, color: "#000000", textAlign: "center" }}>
            Topics you have studied or practiced professionally.
           </Text>
          </View>

          <View style={{ marginHorizontal: 40, borderRadius: 10, paddingVertical: 10, }}>
            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "bold" }}>select a category : </Text>
          </View>

          <View style={{ backgroundColor: "#232323", marginHorizontal: 30, alignContent: "center" }}>
            {
              this.state.fieldData.length > 0 ?
                <FlatList
                  contentContainerStyle={{ paddingTop: 10, alignItems: "center" }}
                  keyExtractor={item => item._id}
                  numColumns={5}
                  data={this.state.fieldData}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ paddingHorizontal: 10, marginBottom: 25, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#fff", fontSize: 12, marginBottom: 5 }}>{item.name}</Text>
                        <LabeledSwitch ref="lsr" index={index} active={this.state[item._id]} id={item._id} name={item.name} onValuesChange={(value) => this.switchValue(value, item._id)} />
                      </View>
                    )
                  }}
                  removeClippedSubviews={false}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                /> : <Text></Text>

            }
          </View>

          <View style={{ marginHorizontal: 40, borderRadius: 10, paddingVertical: 10, }}>
            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "bold" }}>Add Topics : </Text>
          </View>

          <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 5, zIndex: 999999, alignContent: "center", marginTop: 15 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", alignContent: "center" }}>
              <View style={{ width: "62%", alignContent: "center", justifyContent: "center" }}>
                <Autocomplete
                  autoCapitalize="none"
                  placeholder="Type a letter and select"
                  placeholderTextColor="gray"
                  autoCorrect={false}
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
                  onChangeText={text => this.setState({ query: text })}
                  renderItem={({ item }) => (
                    <ScrollView>
                      <TouchableOpacity
                        style={{ borderBottomColor: "gray", borderBottomWidth: 0.5 }}
                        onPress={() => {
                          this.setState({ query: item.name }, () => {
                            this.addSpeclization()
                          });

                        }}>
                        <Text style={styles.itemText}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                />

              </View>
              {/* <TouchableOpacity
                onPress={this.addSpeclization}
                disabled={this.state.query.length == 0 ? true : false}
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
                /> : null
            }
          </View>

          <View style={{ marginHorizontal: 40, borderRadius: 10, paddingVertical: 15, }}>
            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "bold" }}>years of experience : </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginHorizontal: "10%", marginBottom: 3 }}>            
          {
              experienceArray.map((data) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.setState({ selectedExperience: data })}
                    activeOpacity={0.7}
                  >
                  
                      <Text style={{ color: "#fff", fontSize: 18,color: this.state.selectedExperience == data ? "#f6ff00" : "#ffffff" }}>{data}</Text>
                   
                  </TouchableOpacity>
                )
              })
            }
          </View>

          <TouchableOpacity style={{
                        borderWidth: 2,
                        borderRadius: 20,
                        borderColor: '#f6ff00',
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                        position:"absolute",
                        bottom:-100,
                        right:20
                    }}
                    onPress={()=>this.Next()}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}>
                         Done!
                       </Text>
                    </TouchableOpacity>


         
        </SafeAreaView>
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
)(YourExpertise)

export default reduxForm({
  form: 'YourExpertise',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  // validate,
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



