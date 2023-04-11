import { getCol } from '../../db/mongo.js';
import { ObjectId } from 'mongodb';
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  const col = await getCol('logs');
  const logs = await col.find().toArray();
  res.send(logs);
});

router.get('/create-schema', async (req, res) => {
  const schema = {
    $jsonSchema: {
      title: 'Log of user activity',
      description: 'This document records the activity performed by a user',
      type: 'object',
      properties: {
        collection: {},
        type: {},
        message: {},
        timestamp: '',
      },
    },
  };
});

export default router;
