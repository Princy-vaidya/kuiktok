import { combineReducers } from 'redux' 

import userReducer from './userReducer'
import { reducer as formReducer } from 'redux-form'
import onlineListReducer from './onlineListReducer'
import userTypeReducer from './settingNotificationUserType'
import sinleUserReducer from './singleOnlineUser'
export default combineReducers({
    form: formReducer,
    userdata: userReducer,
    onlineUsers: onlineListReducer,
    singleOnlineUsers:sinleUserReducer,
    userType:userTypeReducer,
})