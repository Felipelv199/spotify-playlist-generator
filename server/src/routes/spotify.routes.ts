import { Router } from 'express';
import {
  spotifyAuth,
  spotifyToken,
} from '../controllers/spotify/spotifyAuth.controllers';
import { getUserProfile } from '../controllers/spotify/spotifyUsers.controllers';
import { getUserSavedTracks } from '../controllers/spotify/spotifyLibrary.controller';

const router = Router();

router.get('/auth', spotifyAuth);
router.post('/token', spotifyToken);
router.get('/users/me', getUserProfile);
router.get('/library/tracks', getUserSavedTracks);

export default router;
