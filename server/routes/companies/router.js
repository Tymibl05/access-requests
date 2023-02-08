import { getCol } from '../../db/mongo.js';
import { ObjectId } from 'mongodb';
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  const col = await getCol('companies');
  const companies = await col.find().toArray();
  res.send(companies);
});

export default router;
