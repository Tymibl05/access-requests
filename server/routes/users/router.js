import { getCol } from '../../db/mongo.js';
import { ObjectId } from 'mongodb';
import express from 'express';
import { signin, getOnsite, getUserName } from './controller.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const col = await getCol('users');
  const users = await col.find().toArray();
  res.send(users);
});

router.post('/signin', signin);
router.get('/onsite', getOnsite);
router.get('/:user_id/name', getUserName);

export default router;
