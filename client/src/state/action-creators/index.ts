import { Dispatch } from 'redux';
import { AuthE, PlaylistE, ProfileE } from '../action-types';
import {
  AuthAction,
  ProfileAction,
  ProfileI,
  PlaylistAction,
} from '../actions';

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

export const setPlaylistTracks =
  (tracks: any[]) => (dispatch: Dispatch<PlaylistAction>) =>
    dispatch({ type: PlaylistE.SET_PLAYLIST_TRACKS, payload: tracks });

export const setPlaylistGenre =
  (genre: string) => (dispatch: Dispatch<PlaylistAction>) =>
    dispatch({ type: PlaylistE.SET_PLAYLIST_GENRE, payload: genre });
