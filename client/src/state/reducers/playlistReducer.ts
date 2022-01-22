import { PlaylistAction, PlaylistI } from '../actions/index';
import { PlaylistE } from '../action-types/index';

const initialState: PlaylistI = { tracks: [] };

const reducer = (
  state: PlaylistI = initialState,
  action: PlaylistAction,
): PlaylistI => {
  switch (action.type) {
    case PlaylistE.SET_PLAYLIST_TRACKS:
      return { tracks: action.payload };
    default:
      return state;
  }
};

export default reducer;
