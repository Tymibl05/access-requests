import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectDb, getCol } from './db/mongo.js';
import { data } from './data.js';
import userRouter from './routes/users/router.js';
import companyRouter from './routes/companies/router.js';
import requestRouter from './routes/requests/router.js';
import badgeRouter from './routes/badges/router.js';
import logRouter from './routes/logs/router.js';
import path from 'path';

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
app.use('/api/users', userRouter);
app.use('/api/companies', companyRouter);
app.use('/api/requests', requestRouter);
app.use('/api/badges', badgeRouter);
app.use('/api/logs', logRouter);

app.get('/api/reset', async (req, res) => {
  const { users, companies, requests, badges, logs } = data;
  const userCol = await getCol('users');
  const companyCol = await getCol('companies');
  const requestCol = await getCol('requests');
  const badgeCol = await getCol('badges');
  const logCol = await getCol('logs');

  await userCol.deleteMany();
  await userCol.insertMany(users);
  await companyCol.deleteMany();
  await companyCol.insertMany(companies);
  await requestCol.deleteMany();
  await requestCol.insertMany(requests);
  await badgeCol.deleteMany();
  await badgeCol.insertMany(badges);
  await logCol.deleteMany();
  await logCol.insertMany(logs);

  res.send('DB Collections Reset');
});

//** Server Side Rendering Setup */
// const dir = path.resolve();
// const __dirname = dir.slice(0, -7); // removes /server from pathname
// console.log(__dirname);
// app.use(express.static(path.join(__dirname, './client/build')));
// app.get('/api', (req, res) =>
//   res.sendFile(path.join(__dirname, './client/build/index.html'))
// );
