import { combineReducers } from 'redux';
import authenticationReducer from './authenticationReducer';
import errorReducer from './errorReducer';

const TheReducer = combineReducers({
  auth: authenticationReducer,
  error: errorReducer,
});

export default TheReducer;
