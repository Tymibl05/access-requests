import { getCol } from '../../db/mongo.js';
import { ObjectId } from 'mongodb';
import express from 'express';
import {
  getReqById,
  getReqByName,
  updateStatus,
  updateAccess,
  newRequest,
  getByCompany,
  getOnsite,
} from './controller.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const col = await getCol('requests');
  const requests = await col.find().toArray();
  res.send(requests);
});

router.get('/onsite', getOnsite);
router.get('/by-id/:req_id', getReqById);
router.get('/by-name/:req_name', getReqByName);
router.get('/by-company/:comp_id', getByCompany);
router.post('/:req_id/update-status', updateStatus);
router.post('/:req_id/update-access', updateAccess);
router.post('/new', newRequest);

export default router;
