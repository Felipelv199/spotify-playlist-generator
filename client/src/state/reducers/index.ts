import { combineReducers } from 'redux';
import auth from './authReducer';
import profile from './profileReducers';

const reducers = combineReducers({ auth, profile });

export default reducers;

export type State = ReturnType<typeof reducers>;
