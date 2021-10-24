/* eslint-disable operator-linebreak */
import { Request, Response } from 'express';
import axios from 'axios';
import qs from 'query-string';

export const spotifyAuth = (_: Request, res: Response) => {
  const scope =
    'user-read-private user-read-email user-library-read playlist-modify-private playlist-modify-public';
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.CLIENT_ID;
  const queryParams = qs.stringify({
    response_type: 'code',
    redirect_uri: redirectUri,
    client_id: clientId,
    scope,
  });
  res.json({ url: `https://accounts.spotify.com/authorize?${queryParams}` });
};

export const spotifyToken = async (req: Request, res: Response) => {
  const { body } = req;
  const { code } = body;
  if (!code) {
    res.status(400).json({ message: 'Missing data' });
    return;
  }
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const bodyData = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  };
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify(bodyData),
    );
    const { data } = response;
    res.json({ token: data.access_token });
  } catch (error) {
    res.status(500).json({ message: (error as any).message });
  }
};
