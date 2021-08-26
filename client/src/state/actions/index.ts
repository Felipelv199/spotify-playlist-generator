import { AuthE } from '../action-types';

interface LoginAction {
  type: AuthE.LOGIN;
  payload: string;
}

interface LogoutAction {
  type: AuthE.LOGOUT;
}

export type AuthAction = LoginAction | LogoutAction;
