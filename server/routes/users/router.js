import { getCol } from '../../db/mongo.js';
import { ObjectId } from 'mongodb';
import express from 'express';
import { signin, getUserName, getUserCompany } from './controller.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const col = await getCol('users');
  const users = await col.find().toArray();
  res.send(users);
});

router.post('/signin', signin);
router.get('/:user_id/name', getUserName);
router.get('/:user_id/company', getUserCompany);

export default router;
