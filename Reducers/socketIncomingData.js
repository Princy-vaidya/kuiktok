import { SOCKET_DATA } from '../Actions/types'

export default function(state = {}, action) {
    switch (action.type) {
      case SOCKET_DATA:
        return  action.payload 
      default:
        return state;
    }
  }