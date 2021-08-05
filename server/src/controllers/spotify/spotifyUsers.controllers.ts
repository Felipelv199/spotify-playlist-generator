import { Response, Request } from 'express';
import axios from 'axios';

export const getUserProfile = async (req: Request, res: Response) => {
  const { query } = req;
  const { token } = query;
  if (!token) {
    res.status(400).json({ message: 'Missing data' });
    return;
  }
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { data } = response;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfileById = () => {};
