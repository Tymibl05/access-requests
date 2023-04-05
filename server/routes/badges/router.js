import { getCol } from '../../db/mongo.js';
import { ObjectId } from 'mongodb';
import express from 'express';
import { byUser, getAvailable } from './controller.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const col = await getCol('badges');
  const badges = await col.find().toArray();
  res.send(badges);
});

router.get('/available', getAvailable);
router.get('/by-user/:user_id', byUser);

export default router;
