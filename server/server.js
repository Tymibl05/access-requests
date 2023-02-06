import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectDb } from './db/mongo.js';
// import path from 'path';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
  connectDb();
});

app.get('/api', async (req, res) => res.send('API'));

//** Server Side Rendering Setup */
// const dir = path.resolve();
// const __dirname = dir.slice(0, -7); // removes /server from pathname
// app.use(express.static(path.join(__dirname, './client/build')));
// app.get('/api', (req, res) =>
//   res.sendFile(path.join(__dirname, './client/build/index.html'))
// );
