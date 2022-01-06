import axios from 'axios';
import { onError, sleep } from '../utils/index';

const SPOTIFY_HOST = 'https://api.spotify.com/';
const VERSION = `${SPOTIFY_HOST}v1/`;
const USER_URL = `${VERSION}users/`;
const PLAYLIST_URL = `${VERSION}playlists/`;

export const createPlaylist = async (
  body: any,
  headers: any,
  clientId: string,
) => {
  try {
    const response = await axios.post(
      `${USER_URL}${clientId}/playlists`,
      body,
      { headers },
    );
    const { data } = response;
    const { id } = data;
    return id;
  } catch (error) {
    const errorMessage = onError(error);
    throw new Error(errorMessage);
  }
};

const tracksToPlaylistUploadHandler = async (
  requestParams: any,
  playlistId: string,
) => {
  while (true) {
    try {
      const { data, config } = requestParams;
      await axios.post(`${PLAYLIST_URL}${playlistId}/tracks`, data, config);
      break;
    } catch (error: any) {
      const { response } = error;
      const { status } = response;
      if (status !== 502 && status !== 500 && status !== 429) {
        const errorMessage = onError(error);
        throw new Error(errorMessage);
      }
    }
  }
  sleep(1000);
};

export const addTracksUrisToPlaylist = async (
  requestsParams: any[],
  playlistId: string,
) => {
  try {
    await Promise.all(
      requestsParams.map(async (requestParams: any) =>
        tracksToPlaylistUploadHandler(requestParams, playlistId),
      ),
    );
  } catch (error: any) {
    const errorMessage = onError(error);
    throw new Error(errorMessage);
  }
};
