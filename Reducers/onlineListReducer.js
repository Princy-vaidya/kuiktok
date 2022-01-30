import { ONLINE_LIST } from '../Actions/types'

export default function(state = {}, action) {
    switch (action.type) {
      case ONLINE_LIST:
        return  action.payload 
      default:
        return state;
    }
  }