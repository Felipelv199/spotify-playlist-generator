import { PlaylistAction, PlaylistI } from '../actions/index';
import { PlaylistE } from '../action-types/index';

const initialState: PlaylistI = { tracks: [], genre: '' };

const reducer = (
  state: PlaylistI = initialState,
  action: PlaylistAction,
): PlaylistI => {
  switch (action.type) {
    case PlaylistE.SET_PLAYLIST_TRACKS:
      return { ...state, tracks: action.payload };
    case PlaylistE.SET_PLAYLIST_GENRE:
      return { ...state, genre: action.payload };
    default:
      return state;
  }
};

export default reducer;
