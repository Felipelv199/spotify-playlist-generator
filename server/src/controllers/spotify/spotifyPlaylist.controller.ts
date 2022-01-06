import { Request, Response } from 'express';
import {
  createPlaylist,
  addTracksUrisToPlaylist,
} from '../../services/spotifyClient';
import { onError } from '../../utils';

const buildRequestsParams = (
  urisLenght: number,
  uris: Array<string>,
  headers: any,
) => {
  const nRequests = urisLenght / 100;
  let startIndex = 0;
  let endIndex = 100;
  const requestsParams: Array<any> = [];
  for (let i = 0; i < nRequests; i += 1) {
    if (i !== 0) {
      startIndex = endIndex;
    }
    endIndex = startIndex + 100;
    if (urisLenght - endIndex < 0) {
      const diff = urisLenght - startIndex;
      endIndex = startIndex + diff;
    }
    const urisSlice = uris.slice(startIndex, endIndex);
    const data = { uris: urisSlice, position: 0 };
    const config = { headers };
    requestsParams.push({ data, config });
  }
  return requestsParams;
};

const validateBody = (body: any) => {
  const { clientId, playlist, token, tracks } = body;
  if (!clientId || !token || !playlist || !tracks) {
    throw new Error('Missing data');
  }
  const { name, description, public: playlistPublic } = playlist;
  if (!name || !description || playlistPublic === undefined) {
    throw new Error('Missing data');
  }
  if (tracks.length === 0) {
    throw new Error('Tracks list is empty');
  }
};

export const createPlaylistWithTracks = async (req: Request, res: Response) => {
  const { body } = req;
  try {
    validateBody(body);
  } catch (error) {
    const errorMessage = onError(error);
    res.status(400).json({ message: errorMessage });
    return;
  }
  const { clientId, playlist, token, tracks } = body;
  const { name, description, public: playlistPublic } = playlist;
  const headers = { Authorization: `Bearer ${token}` };
  let playlistId = '';
  try {
    playlistId = await createPlaylist(
      {
        name,
        description,
        public: playlistPublic,
      },
      headers,
      clientId,
    );
  } catch (error: any) {
    const errorMessage = onError(error);
    res.status(500).json({ message: errorMessage });
    return;
  }
  const tracksUris: Array<string> = tracks.map(
    (track: any) => `spotify:track:${track}`,
  );
  const urisLenght: number = tracksUris.length as number;
  const requestsParams = buildRequestsParams(urisLenght, tracksUris, headers);
  try {
    await addTracksUrisToPlaylist(requestsParams, playlistId);
  } catch (error: any) {
    const errorMessage = onError(error);
    res.status(500).json({ message: errorMessage });
    return;
  }
  res.json({ message: 'Playlist created' });
};
