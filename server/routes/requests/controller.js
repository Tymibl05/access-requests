import { ObjectId } from "mongodb";
import { getCol } from "../../db/mongo.js";

export const getRequests = async (req, res) => {
  return;
};

export const getReqById = async (req, res) => {
  const { req_id } = req.params;
  if (req_id.length !== 24)
    return res.status(400).send({ message: "Request Does Not Exist" });

  const reqCol = await getCol("requests");
  const request = await reqCol.findOne({ _id: new ObjectId(req_id) });
  if (!request) return res.status(404).send({ message: "Request Not Found" });

  return res.send(request);
};

export const getReqByName = async (req, res) => {
  const { req_name } = req.params;

  const reqCol = await getCol("requests");
  const request = await reqCol.findOne({ name: req_name });
  if (!request) return res.status(404).send({ message: "Request Not Found" });

  return res.send(request);
};

export const updateStatus = async (req, res) => {
  const { req_id } = req.params;
  if (req_id.length !== 24)
    return res.status(400).send({ message: "Request Does Not Exist" });

  const { status } = req.body;
  if (!status)
    return res.status(400).send({ message: "Update Parameters Not Provided" });

  const reqCol = await getCol("requests");
  const updatedReq = await reqCol.updateOne(
    { _id: new ObjectId(req_id) },
    { $set: { status: status } }
  );
  if ((updatedReq.matchedCount || updatedReq.modifiedCount) === 0)
    return res.status(400).send({ message: "Request Not Found" });

  return res.send({ message: `${req_id} update successful.` });
};

export const updateAccess = async (req, res) => {
  const { req_id } = req.params;
  if (req_id.length !== 24)
    return res.status(400).send({ message: "Request Does Not Exist" });

  const { user } = req.body;
  if (!user)
    return res.status(400).send({ message: "Update Parameters Not Provided" });

  const reqCol = await getCol("requests");

  // const updatedReq = await reqCol.updateOne(
  //   { _id: new ObjectId(req_id),  "visitors.user_id": user._id},
  //   { $set: { 'visitors.$.is_onsite':  user.is_onsite} }
  // );
  // if ((updatedReq.matchedCount || updatedReq.modifiedCount) === 0)
  //   return res.status(400).send({ message: "Request Not Found" });

  const testUpdate = await reqCol.updateOne(
    { _id: new ObjectId(req_id) },
    { $set: { "visitors.$[elem].is_onsite": user.is_onsite } },
    { arrayFilters: [{ "elem.user_id": user._id }] }
  );
  if ((testUpdate.matchedCount || testUpdate.modifiedCount) === 0)
    return res.status(400).send({ message: "Request Not Found" });

  return res.send({ message: `${req_id} update successful.` });
};
