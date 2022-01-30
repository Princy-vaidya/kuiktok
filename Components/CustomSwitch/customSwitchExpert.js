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

  circleRed: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
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



class LabeledSwitchExpert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      value1: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    // define how we will use LayoutAnimation to give smooth transition between state change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const id = this.props.id
    const newValue = !this.state.value1
    
    this.setState({
      [id]: newValue,
    }, () => this.setState({value1: newValue}));

    // console.log("helkjfkjfgjg========>", this.state[id], this.state.value1);
      this.props.onValuesChange(!this.state.value1);
  }
  
  render() {
    const { value } = this.state;
    const {id, active,index} = this.props
  //  console.log("helkjfkjfgjg========>", this.props.index, this.props.id,this.props.active);
    return (
      <TouchableOpacity onPress={() => this.props.onValuesChange(true)}>
        <View style={[
          styles.container,
          active && styles.activeContainer]}
        >
          {active ?
           <View style={styles.circle}>
              <View style={styles.circleGreen}/>
            </View>
          :
          <View style={styles.circle}>
            {
               index>4 ?
               <View style={styles.circleRed}/>
               :
               <View style={styles.circleBrown}/>
            }
          
       </View>
          }
        </View>
      </TouchableOpacity>
    );
  }
}

export default LabeledSwitchExpert;