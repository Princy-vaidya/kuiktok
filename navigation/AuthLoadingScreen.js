import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.loggedInBefore();
    
  }

  async componentDidMount(){
    console.log(await AsyncStorage.getItem('userdata'), "userdata");
  }

  loggedInBefore = async () => {
    const userToken = await AsyncStorage.getItem('userdata');
    if(userToken === null){
      this.props.navigation.navigate('Auth');
    }else{
      this.props.navigation.navigate('Main');
    }
  }

  render(){
    return(
       <Loader/>
    );
  }
}

const Loader = props => {
  const {
    loading,
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size="large"
            color='#488f01'
            />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});