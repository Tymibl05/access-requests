import { getCol } from "../../db/mongo.js";
import { ObjectId } from "mongodb";
import express from "express";
import {
  getRequests,
  getReqById,
  getReqByName,
  updateStatus,
  updateAccess,
  newRequest,
  getByStatus,
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
router.get("/by-status/:status/:comp_id", getByStatus);
router.post("/:req_id/update-status", updateStatus);
router.post("/:req_id/update-access", updateAccess);
router.post("/new", newRequest);

export default router;
