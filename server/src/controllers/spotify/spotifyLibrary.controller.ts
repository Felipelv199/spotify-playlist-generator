import { Request, Response } from 'express';
import axios from 'axios';
import qs from 'query-string';
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({ minTime: 333 });

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Artist {
  name: string;
  href: string;
  id: string;
  genres: string[];
}

interface Album {
  name: string;
  artists: Artist[];
  genres: string[];
  images: Image[];
}

interface Track {
  name: string;
  album: Album;
  id: string;
}

interface TaskItem {
  limit: number;
  offset: number;
}

interface ArtistTaskItem {
  limit: number;
  ids: string[];
}

const getError = (error: any) => {
  const { response } = error;
  if (response) {
    const { status, statusText } = response;
    return { status, message: statusText };
  }
  const { message } = error;
  return { status: 500, message };
};

const getTrackFromResponseData = (itemTrack: any): Track => {
  const { album, name, id } = itemTrack;
  const { artists, images } = album;
  const albumArtists: Artist[] = artists.map((artist: any) => ({
    name: artist.name,
    href: artist.href,
    id: artist.id,
    genres: [],
  }));
  const albumImages: Image[] = images.map((image: any) => ({
    height: image.height,
    width: image.width,
    url: image.url,
  }));
  const albumTrack: Album = {
    name: album.name,
    artists: albumArtists,
    genres: [],
    images: albumImages,
  };
  return { album: albumTrack, name, id };
};

const parseTaskResponseData = (data: any): Track[] => {
  const { items } = data;
  return items.map((item: any) => getTrackFromResponseData(item.track));
};

const fetchMeTracks = async (limit: number, offset: number, token: string) => {
  const queryParams = qs.stringify({
    limit,
    offset,
  });
  return axios.get(`https://api.spotify.com/v1/me/tracks?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const fetchArtistsByIds = async (ids: string[], token: string) => {
  const queryParams = qs.stringify({
    ids: ids.join(','),
  });
  return axios.get(`https://api.spotify.com/v1/artists?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getTracksByToken = async (token: string): Promise<Track[]> => {
  let limit = 50;
  const wrapped = limiter.wrap(fetchMeTracks);
  const tracks: Track[] = [];
  let total: number;
  const response = await wrapped(limit, 0, token);
  const { data } = response;
  total = data.total - limit;
  tracks.push(...parseTaskResponseData(data));
  const tasksArrayLenght = Math.ceil(total / limit);
  const tasksArray: TaskItem[] = [];
  for (let i = 0; i < tasksArrayLenght; i += 1) {
    const offset = (i + 1) * limit;
    if (total - limit < 0) {
      limit = Math.abs(total);
    }
    total -= limit;
    tasksArray.push({ offset, limit });
  }
  const tasksArrayResponses = await limiter.schedule(() => {
    const allTasks = tasksArray.map((task) =>
      fetchMeTracks(task.limit, task.offset, token),
    );
    return Promise.all(allTasks);
  });
  tasksArrayResponses.forEach((taskResponse) =>
    tracks.push(...parseTaskResponseData(taskResponse.data)),
  );
  return tracks;
};

const getAndMatchGenresWithArtistsTracks = async (
  token: string,
  tracksArtists: Artist[],
): Promise<Artist[]> => {
  const artists = [...tracksArtists];
  let limit = 50;
  let total = tracksArtists.length;
  const artistsTasksArrayLenght = Math.ceil(total / limit);
  const artistsTasksArray: ArtistTaskItem[] = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < artistsTasksArrayLenght; i += 1) {
    if (total - limit < 0) {
      limit = total;
    }
    if (i !== 0) {
      start = end;
    }
    if (start + limit > tracksArtists.length) {
      end = start + tracksArtists.length - start - 1;
    } else {
      end = start + limit;
    }
    const sliceArtists = tracksArtists.slice(start, end);
    artistsTasksArray.push({
      limit: sliceArtists.length,
      ids: sliceArtists.map((artist) => artist.id),
    });
    total -= limit;
  }
  const artistsTasksArrayResponses = await limiter.schedule(() => {
    const allTasks = artistsTasksArray.map((artistsTask) =>
      fetchArtistsByIds(artistsTask.ids, token),
    );
    return Promise.all(allTasks);
  });
  artistsTasksArrayResponses.forEach((artisTask) => {
    const { data } = artisTask;
    data.artists.forEach((element: any) => {
      const index = artists.findIndex((artist) => artist.id === element.id);
      if (index !== -1) {
        artists[index].genres = element.genres;
      }
    });
  });
  return artists;
};

export const getUserSavedTracks = async (req: Request, res: Response) => {
  const { query } = req;
  const { code } = query;
  if (!code) {
    res.status(400).json({ message: 'Missing data' });
    return;
  }
  const token: string = code as string;
  const tracks: Track[] = [];
  try {
    tracks.push(...(await getTracksByToken(token)));
  } catch (error) {
    const { message, status } = getError(error);
    res.status(status).json({ message });
    return;
  }
  const artistsTracks: Artist[] = [];
  tracks.forEach((track) => {
    const { album } = track;
    const { artists } = album;
    artists.forEach((artist) => {
      const exist = artistsTracks.some(
        (artistAlbumTrack) => artist.name === artistAlbumTrack.name,
      );
      if (!exist) {
        artistsTracks.push(artist);
      }
    });
  });
  const artistsWithGenres: Artist[] = [];
  try {
    artistsWithGenres.push(
      ...(await getAndMatchGenresWithArtistsTracks(token, artistsTracks)),
    );
  } catch (error) {
    const { message, status } = getError(error);
    res.status(status).json({ message });
    return;
  }
  tracks.forEach((track) => {
    const { album } = track;
    const albumArtists: Artist[] = track.album.artists;
    const albumGenres: string[] = [];
    albumArtists.forEach((artist) => {
      const { genres } = artist;
      const index = artistsWithGenres.findIndex(
        (tracksArtist) => artist.id === tracksArtist.id,
      );
      if (genres.length === 0 && index !== -1) {
        genres.push(...artistsWithGenres[index].genres);
      }
      albumGenres.push(...genres);
    });
    album.genres = albumGenres;
  });
  res.json({ tracks });
};

export const getUserSavedArtists = (_: Request, res: Response) => {
  res.json({ artists: [], message: 'Get saved artists' });
};
