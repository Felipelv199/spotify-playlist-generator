import { Router } from 'express';
import {
  spotifyAuth,
  spotifyToken,
} from '../controllers/spotify/spotifyAuth.controllers';
import { getUserProfile } from '../controllers/spotify/spotifyUsers.controllers';
import { getUserSavedTracks } from '../controllers/spotify/spotifyLibrary.controller';
import { createPlaylistWithTracks } from '../controllers/spotify/spotifyPlaylist.controller';

const router = Router();

router.get('/auth', spotifyAuth);
router.post('/token', spotifyToken);
router.get('/users/me', getUserProfile);
router.get('/library/tracks', getUserSavedTracks);
router.post('/playlist', createPlaylistWithTracks);

export default router;
