import { AuthAction } from '../actions/index';
import { AuthE } from '../action-types/index';

const initialState = '';

const reducer = (state: string = initialState, action: AuthAction): string => {
  switch (action.type) {
    case AuthE.LOGIN:
      return action.payload;
    case AuthE.LOGOUT:
      return '';
    default:
      return state;
  }
};

export default reducer;
