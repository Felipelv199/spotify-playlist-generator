import { Dispatch } from 'redux';
import { AuthE } from '../action-types';
import { AuthAction } from '../actions';

export const login = (token: string) => (dispatch: Dispatch<AuthAction>) => {
  dispatch({ type: AuthE.LOGIN, payload: token });
};

export const logout = () => (dispatch: Dispatch<AuthAction>) => {
  window.localStorage.removeItem('token');
  dispatch({ type: AuthE.LOGOUT });
};
