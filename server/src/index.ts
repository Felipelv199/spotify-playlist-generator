import { config } from 'dotenv';
import app from './app';

config({ path: '.env.local' });
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));
