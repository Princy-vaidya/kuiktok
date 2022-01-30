import Apis from './../Services/apis'
import { USER_FETCH, ONLINE_LIST,SETTINGUSER_TYPE,SINGLEUSER_LIST,SOCKET_DATA } from './types'


export const getUsers = () => {
  return async dispatch => {
    Apis.fetch_users()
    .then(response => {
      if(response) {
        dispatch({
          type: USER_FETCH,
          payload: response
        })
      }
    })
  }
}

export const saveOnlineUsers = (values) => {
  return async dispatch => {
    dispatch({
      type: ONLINE_LIST,
      payload: values
    })
  }
}

export const saveSingleOnlineUsers = (values) => {
  console.log("SINGLEUSER_LIST",values)
  return async dispatch => {
    dispatch({
      type: SINGLEUSER_LIST,
      payload: values
    })
  }
}

export const socketIncomingData = (values) => {
  console.log("SOCKET_DATA  -----------",values)
  return async dispatch => {
    dispatch({
      type: SOCKET_DATA,
      payload: values
    })
  }
}
export const settingNotificationUserType = (values) => {
  console.log("uservalue",values)
  return async dispatch => {
    dispatch({
      type: SETTINGUSER_TYPE,
      payload: values
    })
  }
}


