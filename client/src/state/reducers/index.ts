import { combineReducers } from 'redux';
import auth from './authReducer';
import profile from './profileReducers';
import playlist from './playlistReducer';

const reducers = combineReducers({ auth, profile, playlist });

export default reducers;

export type State = ReturnType<typeof reducers>;
