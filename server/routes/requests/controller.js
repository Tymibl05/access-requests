import { ObjectId } from "mongodb";
import { getCol } from "../../db/mongo.js";

export const getRequests = async (req, res) => {
  return;
};

export const getByCompany = async (req, res) => {
  // USER AUTH - user.company_id
  const { comp_id } = req.params; // can remove params once user auth is added as company_id is in user object
  const compCol = await getCol("companies");
  const company = await compCol.findOne({ _id: comp_id });
  if (!company) return res.status(400).send({ message: "Company Not Found" });

  const reqCol = await getCol("requests");
  if (company.is_client) {
    const requests = await reqCol.find().toArray();
    return res.send(requests);
  } else {
    const comp = await compCol
      .aggregate([
        { $match: { _id: comp_id } },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "company_id",
            as: "employees",
          },
        },
        //{ $unwind: "$employees" }, //adding unwind will genereate a seperate doc for each emp with the reqs they're assigned.
        {
          $lookup: {
            from: "requests",
            localField: "employees._id",
            foreignField: "visitors.user_id",
            as: "requests",
          },
        },
      ])
      .toArray(); //this returns all company info including its employees and requests
    return res.send(comp[0].requests);
  }
};

export const getReqById = async (req, res) => {
  const { req_id } = req.params;
  if (req_id.length !== 24)
    return res.status(400).send({ message: "Request Does Not Exist" });

  const reqCol = await getCol("requests");
  const request = await reqCol.findOne({ _id: new ObjectId(req_id) });
  if (!request) return res.status(404).send({ message: "Request Not Found" });

  // aggregate pipe to add assigned badges into req.vis
  const aggReq = await reqCol
    .aggregate([
      { $match: { _id: new ObjectId(req_id) } },
      // {
      //   $lookup: {
      //     from: 'badges',
      //     let: { visitors: '$visitors' },
      //     pipeline: [{ $match }],
      //   },
      // },
    ])
    .toArray();
  //console.log(aggReq);

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
  // Params Check
  const { req_id } = req.params;
  if (req_id.length !== 24)
    return res.status(400).send({ message: "Request Does Not Exist" });
  const { user } = req.body;
  if (!user)
    return res.status(400).send({ message: "Update Parameters Not Provided" });

  const reqCol = await getCol("requests");
  //* Check if user is already checked into another req
  const onsiteCheck = await reqCol
    .find({
      visitors: { $elemMatch: { user_id: user._id, is_onsite: true } },
    })
    .toArray();
  if (user.is_onsite && onsiteCheck.length > 0)
    return res.status(400).send({
      message: `${user.name} is ALREADY checked in for ${onsiteCheck[0].name}`,
    });

  //* Check if request is wthin window

  // UPDATE VISITOR
  const updatedReq = await reqCol.updateOne(
    { _id: new ObjectId(req_id) },
    { $set: { "visitors.$[elem].is_onsite": user.is_onsite } },
    { arrayFilters: [{ "elem.user_id": user._id }] }
  );
  if ((updatedReq.matchedCount || updatedReq.modifiedCount) === 0)
    return res.status(400).send({ message: "Request Not Found" });

  // UPDATE BADGE
  const badgeCol = await getCol("badges");
  if (user.is_onsite && user.badge_id) {
    const updateBadge = await badgeCol.updateOne(
      { _id: new ObjectId(user.badge_id) },
      { $set: { is_available: false, assigned_to: user._id } }
    );
    if ((updateBadge.matchedCount || updateBadge.modifiedCount) === 0)
      return res.status(400).send({ message: "Error Assigning Badge" });
  }
  if (!user.is_onsite) {
    const assignedBadge = await badgeCol.findOne({ assigned_to: user._id });
    if (assignedBadge) {
      const updateBadge = badgeCol.updateOne(
        { assigned_to: user._id },
        { $set: { is_available: true, assigned_to: false } }
      );
      if ((updateBadge.matchedCount || updateBadge.modifiedCount) === 0)
        return res.status(400).send({ message: "Badge Reset Error" });
    }
  }

  return res.send({ message: `${req_id} update successful.` });
};

export const newRequest = async (req, res) => {
  const { description, visitors, window } = req.body;

  const compCol = await getCol("companies");
  const updateCount = await compCol.updateOne(
    { is_client: true },
    { $inc: { req_counter: 1 } }
  );
  if ((updateCount.matchedCount || updateCount.modifiedCount) === 0)
    return res.status(400).send({ message: "Inc Req Count Error" });
  const client = await compCol.findOne(
    { is_client: true },
    { projection: { _id: 0, req_counter: 1 } }
  );

  const reqCol = await getCol("requests");
  const newReq = await reqCol.insertOne({
    name: `REQ000000${client.req_counter}`,
    description: description,
    status: "pending",
    window: {
      start: window.start,
      end: window.end,
    },
    visitors: visitors,
  });

  if (!newReq.acknowledged)
    return res.status(500).send({ message: "Error inserting request" });

  return res.send({ _id: newReq.insertedId });
  // return res.send({ message: 'Request Added' });
};
