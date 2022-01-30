import React from 'react';
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 22,
    backgroundColor: 'grey',
    alignContent:"center",
    alignItems:"center",
    flexDirection: 'row',
    overflow: 'visible',
    borderRadius: 15,
    shadowColor: 'black',
    shadowOpacity: 1.0,
    shadowOffset: {
      width: -2,
      height: 2,
    },
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems:"center",
    justifyContent:"center",
    alignContent:"center",
    backgroundColor: 'white',
    marginTop: -2,
    shadowColor: 'black',
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  circleGreen: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00e749',
    marginTop: -2,
    shadowColor: 'black',
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  circleBrown: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#636363',
    marginTop: -2,
    shadowColor: 'black',
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  activeContainer: {
    backgroundColor: '#636363',
    flexDirection: 'row-reverse',
  },
  label: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 6,
    fontWeight: 'bold',
  },
});

export class CustomMarker extends React.Component {
  render() {
    const {} = this.props
    return (
      <>
      <View style={styles.circle}>
         <View style={styles.circleGreen}/>
      </View>

      <View style={styles.circle}>
         <View style={styles.circleBrown}/>
      </View>
      </>
    );
  }
}

class LabeledSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      value1: false
    };
    this.toggle = this.toggle.bind(this);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // update local state.value if props.value changes....
    // if (nextProps.value !== this.state.value) {
    //   this.setState({ value: nextProps.value });
    // }
  }
  toggle() {
    // define how we will use LayoutAnimation to give smooth transition between state change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const id = this.props.id
    const newValue = !this.state.value1
    
    this.setState({
      [id]: newValue,
    }, () => this.setState({value1: newValue}));

    console.log("Id", this.state[id], this.state.value1);
    

    // fire function if exists
    //if (typeof this.props.onValueChange === 'function') {
      this.props.onValuesChange(!this.state.value1);
   // }
  }
  
  render() {
    const { value } = this.state;
    const {id} = this.props
    return (
      <TouchableOpacity onPress={this.toggle}>
        <View style={[
          styles.container,
          this.state[id] && styles.activeContainer]}
        >
          {/* <View style={styles.circle} />
          <Text style={styles.label}>
            { value ? 'YES' : 'NO' }
          </Text> */}
          {this.state[id] ?
           <View style={styles.circle}>
              <View style={styles.circleGreen}/>
            </View>
          :
          <View style={styles.circle}>
          <View style={styles.circleBrown}/>
       </View>
          }
        </View>
      </TouchableOpacity>
    );
  }
}

// LabeledSwitch.propTypes = {
//   onValueChange: React.PropTypes.func,
//   value: React.PropTypes.bool,
// };

// LabeledSwitch.defaultProps = {
// };

export default LabeledSwitch;