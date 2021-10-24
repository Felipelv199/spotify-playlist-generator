import { Request, Response } from 'express';
import Bottleneck from 'bottleneck';
import {
  createPlaylist,
  addTracksToPlaylist,
} from '../../services/spotifyClient';

const limiter = new Bottleneck({ minTime: 1000 });

const buildQueriesUris = (urisLenght: number, uris: Array<string>) => {
  const nRequests = urisLenght / 100;
  let startIndex = 0;
  let endIndex = 100;
  const queriesUris: Array<Array<string>> = [];
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
    queriesUris.push(urisSlice);
  }
  return queriesUris;
};

const validateBody = (body: any) => {
  const { clientId, playlist, token, tracks } = body;
  if (!clientId || !token || !playlist || !tracks) {
    throw new Error('Missing data');
  }
  const { name, description, public: playlistPublic } = playlist;
  if (!name || !description || !playlistPublic) {
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
    res.status(400).json({ message: (error as any).message });
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
  } catch (error) {
    res.status(500).json({ message: (error as any).message });
    return;
  }
  const uris: Array<string> = tracks.map(
    (track: any) => `spotify:track:${track}`,
  );
  const urisLenght: number = uris.length as number;
  const queriesUris = buildQueriesUris(urisLenght, uris);
  try {
    await limiter.schedule(() => {
      const allTasks = queriesUris.map((queryUris: Array<string>) =>
        addTracksToPlaylist(
          { uris: queryUris, position: 0 },
          headers,
          playlistId,
        ),
      );
      return Promise.all(allTasks);
    });
  } catch (error) {
    res.status(500).json({ message: (error as any).message });
    return;
  }
  res.json({ message: 'Playlist created' });
};
