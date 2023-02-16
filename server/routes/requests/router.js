import { getCol } from "../../db/mongo.js";
import { ObjectId } from "mongodb";
import express from "express";
import {
  getRequests,
  getReqById,
  getReqByName,
  updateStatus,
  updateAccess,
} from "./controller.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const col = await getCol("requests");
  const requests = await col.find().toArray();
  res.send(requests);
});

router.get("/test", getRequests);
router.get("/:req_id", getReqById);
router.get("/by-name/:req_name", getReqByName);
router.post("/:req_id/update-status", updateStatus);
router.post("/:req_id/update-access", updateAccess);

export default router;
