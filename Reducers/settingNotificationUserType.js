import { SETTINGUSER_TYPE } from '../Actions/types'


export default function(state = {}, action) {
    switch (action.type) {
      case SETTINGUSER_TYPE:
        return  action.payload 
      default:
        return state;
    }
  }