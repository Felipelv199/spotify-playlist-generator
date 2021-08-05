import { Router } from 'express';
import {
  spotifyAuth,
  spotifyToken,
} from '../controllers/spotify/spotifyAuth.controllers';
import { getUserProfile } from '../controllers/spotify/spotifyUsers.controllers';

const router = Router();

router.get('/auth', spotifyAuth);
router.post('/token', spotifyToken);
router.get('/users/me', getUserProfile);

export default router;
