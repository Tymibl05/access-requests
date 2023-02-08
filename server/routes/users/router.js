import { getCol } from '../../db/mongo.js';
import { ObjectId } from 'mongodb';
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  const col = await getCol('users');
  const users = await col.find().toArray();
  res.send(users);
});

export default router;
