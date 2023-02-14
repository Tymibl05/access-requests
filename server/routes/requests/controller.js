import { ObjectId } from 'mongodb';
import { getCol } from '../../db/mongo.js';

export const getRequests = async (req, res) => {
  return;
};

export const getReqById = async (req, res) => {
  const { req_id } = req.params;
  if (req_id.length !== 24)
    return res.status(400).send({ message: 'Request Does Not Exist' });

  const reqCol = await getCol('requests');
  const request = await reqCol.findOne({ _id: new ObjectId(req_id) });
  if (!request) return res.status(404).send({ message: 'Request Not Found' });

  return res.send(request);
};

export const getReqByName = async (req, res) => {
  const { req_name } = req.params;

  const reqCol = await getCol('requests');
  const request = await reqCol.findOne({ name: req_name });
  if (!request) return res.status(404).send({ message: 'Request Not Found' });

  return res.send(request);
};
