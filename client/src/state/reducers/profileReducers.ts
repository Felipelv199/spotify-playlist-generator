import { ProfileAction, ProfileI } from '../actions/index';
import { ProfileE } from '../action-types/index';

const initialState: ProfileI = { clientId: '' };

const reducer = (
  state: ProfileI = initialState,
  action: ProfileAction,
): ProfileI => {
  switch (action.type) {
    case ProfileE.SET_PROFILE:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
