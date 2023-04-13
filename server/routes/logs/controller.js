import { ObjectId } from 'mongodb';
import { getCol } from '../../db/mongo.js';

export const getByRequest = async (req, res) => {
  // ADD AUTH
  const { req_id } = req.params;
  if (req_id.length !== 24)
    return res.status(400).send({ message: 'Request Does Not Exist' });

  const logCol = await getCol('logs');
  const logs = await logCol
    .find({ type: 'request', ref_id: new ObjectId(req_id) })
    .sort({ timestamp: -1 })
    .toArray();

  res.send(logs);
};
