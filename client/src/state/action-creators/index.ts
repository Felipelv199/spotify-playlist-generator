import { Dispatch } from 'redux';
import { AuthE, ProfileE } from '../action-types';
import { AuthAction, ProfileAction, ProfileI } from '../actions';

export const login = (token: string) => (dispatch: Dispatch<AuthAction>) => {
  dispatch({ type: AuthE.LOGIN, payload: token });
};

export const logout = () => (dispatch: Dispatch<AuthAction>) => {
  window.localStorage.removeItem('token');
  dispatch({ type: AuthE.LOGOUT });
};

export const setProfile =
  (clientId: string) => (dispatch: Dispatch<ProfileAction>) => {
    const profile: ProfileI = { clientId };
    dispatch({ type: ProfileE.SET_PROFILE, payload: profile });
  };
