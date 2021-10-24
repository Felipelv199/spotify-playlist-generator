import axios from 'axios';

const SPOTIFY_HOST = 'https://api.spotify.com/';
const VERSION = 'v1/';

export const createPlaylist = async (
  body: any,
  headers: any,
  clientId: string,
) => {
  try {
    const response = await axios.post(
      `${SPOTIFY_HOST}${VERSION}users/${clientId}/playlists`,
      body,
      { headers },
    );
    const { data } = response;
    const { id } = data;
    return id;
  } catch (error) {
    const { response: errorResponse } = error as any;
    const { statusText } = errorResponse;
    throw new Error(statusText);
  }
};

export const addTracksToPlaylist = async (
  body: any,
  headers: any,
  playlistId: string,
) => {
  try {
    return axios.post(
      `${SPOTIFY_HOST}${VERSION}playlists/${playlistId}/tracks`,
      body,
      { headers },
    );
  } catch (error) {
    const { response: errorResponse } = error as any;
    const { statusText } = errorResponse;
    throw new Error(statusText);
  }
};
