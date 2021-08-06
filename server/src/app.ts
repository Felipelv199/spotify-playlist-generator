import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import spotify from './routes/spotify.routes';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/spotify', spotify);

export default app;
