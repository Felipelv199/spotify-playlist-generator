import { AuthE, PlaylistE, ProfileE } from '../action-types';

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

export interface PlaylistI {
  tracks: any[];
  genre: string;
}

interface SetPlaylistTracks {
  type: PlaylistE.SET_PLAYLIST_TRACKS;
  payload: any[];
}

interface SetPlaylistGenre {
  type: PlaylistE.SET_PLAYLIST_GENRE;
  payload: string;
}

export type PlaylistAction = SetPlaylistTracks | SetPlaylistGenre;
