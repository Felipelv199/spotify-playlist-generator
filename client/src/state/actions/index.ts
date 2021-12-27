import { AuthE, ProfileE } from '../action-types';

interface LoginAction {
  type: AuthE.LOGIN;
  payload: string;
}

interface LogoutAction {
  type: AuthE.LOGOUT;
}

export type AuthAction = LoginAction | LogoutAction;

export interface ProfileI {
  clientId: string;
}

interface SetProfileAction {
  type: ProfileE.SET_PROFILE;
  payload: ProfileI;
}

export type ProfileAction = SetProfileAction;
