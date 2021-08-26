import { combineReducers } from 'redux';
import auth from './authReducer';

const reducers = combineReducers({ auth });

export default reducers;

export type State = ReturnType<typeof reducers>;
