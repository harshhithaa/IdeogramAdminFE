/* eslint-disable import/prefer-default-export */
import { combineReducers } from 'redux';
import userReducer from './user';

export const rootReducer = combineReducers({
  root: userReducer,
});
