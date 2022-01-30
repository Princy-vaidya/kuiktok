import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Alert, Modal, KeyboardAvoidingView, TextInput, StatusBar, SafeAreaView } from 'react-native';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import moment from 'moment'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMarker from '../../Components/CustomSlider/index'

import { renderField1, renderField2, datePicker, googlePlaceSearch } from "../../Components/ReduxForm/inputs"
const Deviceheight = Dimensions.get('window').height;
Array.prototype.first = function () {
    return this[0];
};
Array.prototype.last = function () {
    return this[1];
};
class SearchSettings extends Component {

    static navigationOptions = {
        header: null
    };

    state = {
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




    render() {
        const { navigation,nav } = this.props
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
            <View style={{ flex: 1, backgroundColor: '#0e0e0e' }}>
                <SafeAreaView >
                    <View style={{ alignItems: "center", marginBottom: 10 }}>
                        <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "bold" }}>INGS</Text>
                    </View>

                    <View style={{ backgroundColor: "#f6ff00", marginHorizontal: 40, borderRadius: 10, paddingVertical: 10, marginBottom: 25 }}>
                        <Text style={{ fontSize: 16, color: "#000000", textAlign: "center" }}>
                            Kuiktok is FREE on your first{'\n'}
                            12 months full stop.
                        </Text>
                    </View>

                    <View>
                        <View style={{ marginHorizontal: 40, borderRadius: 10, paddingVertical: 10, }}>
                            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "bold" }}>Location range : </Text>
                        </View>

                        <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 12, marginHorizontal: 30 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 50 }}>
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
                        </View>

                        <View style={{ marginHorizontal: 40, borderRadius: 10, paddingVertical: 10, }}>
                            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "bold" }}>Age Range : </Text>
                        </View>

                        <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 12, marginHorizontal: 30 }}>
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
                        </View>

                        <View style={{ marginHorizontal: 40, borderRadius: 10, paddingVertical: 10, }}>
                            <Text style={{ color: "#f6ff00", fontSize: 20, fontWeight: "bold" }}>Gender : </Text>
                        </View>

                        <View style={{ marginBottom: 20, backgroundColor: "#232323", paddingTop: 12, marginHorizontal: 30 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 50 }}>
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
                        </View>


                        <TouchableOpacity
                            // onPress={this.editProfilePersonal}
                            activeOpacity={0.7}
                            style={{ borderWidth: 1, borderColor: "#4b4949", paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', marginHorizontal: "23%", borderRadius: 6, marginTop: 18 }}
                        >
                            <Text style={{ color: "#fff", fontSize: 20 }}>Save</Text>
                        </TouchableOpacity>

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
                    onPress={()=>this.props.onClick()}
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
)(SearchSettings)

export default reduxForm({
    form: 'SearchSettings',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
    // validate,
})(FormComponent)
