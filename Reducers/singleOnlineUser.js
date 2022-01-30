import { SINGLEUSER_LIST } from '../Actions/types'
export default function(state = {}, action) {
    switch (action.type) {
      case SINGLEUSER_LIST:
        return  action.payload 
      default:
        return state;
    }
  }