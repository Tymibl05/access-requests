import { ObjectId } from 'mongodb';
import { getCol } from '../../db/mongo.js';

export const getByCompany = async (req, res) => {
  // USER AUTH - user.company_id
  const { comp_id } = req.params; // can remove params once user auth is added as company_id is in user object
  const compCol = await getCol('companies');
  const company = await compCol.findOne({ _id: comp_id });
  if (!company) return res.status(400).send({ message: 'Company Not Found' });

  const reqCol = await getCol('requests');
  if (company.is_client) {
    const requests = await reqCol.find().toArray();
    return res.send(requests);
  } else {
    const comp = await compCol
      .aggregate([
        { $match: { _id: comp_id } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'company_id',
            as: 'employees',
          },
        },
        //{ $unwind: "$employees" }, //adding unwind will genereate a seperate doc for each emp with the reqs they're assigned.
        {
          $lookup: {
            from: 'requests',
            localField: 'employees._id',
            foreignField: 'visitors.user_id',
            as: 'requests',
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
    return res.status(400).send({ message: 'Request Does Not Exist' });

  const reqCol = await getCol('requests');
  const request = await reqCol.findOne({ _id: new ObjectId(req_id) });
  if (!request) return res.status(404).send({ message: 'Request Not Found' });

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

  const reqCol = await getCol('requests');
  const request = await reqCol.findOne({ name: req_name });
  if (!request) return res.status(404).send({ message: 'Request Not Found' });

  return res.send(request);
};

export const updateStatus = async (req, res) => {
  // ADD AUTH -> only user.is_client can update

  const { req_id } = req.params;
  if (req_id.length !== 24)
    return res.status(400).send({ message: 'Request Does Not Exist' });

  const { status } = req.body;
  if (!status)
    return res.status(400).send({ message: 'Update Parameters Not Provided' });

  const reqCol = await getCol('requests');
  const updatedReq = await reqCol.updateOne(
    { _id: new ObjectId(req_id) },
    { $set: { status: status } }
  );
  if ((updatedReq.matchedCount || updatedReq.modifiedCount) === 0)
    return res.status(400).send({ message: 'Request Not Found' });

  // ADD LOG
  const request = await reqCol.findOne({ _id: new ObjectId(req_id) });
  const newLog = {
    timestamp: Date.now(),
    type: 'request',
    ref_id: request._id,
    message: `<User> has changed ${request.name}'s status to '${status}'.`,
  };

  const logCol = await getCol('logs');
  const insertLog = await logCol.insertOne(newLog);
  if (!insertLog.acknowledged)
    return res.status(404).send({ message: 'Error inserting log' });

  return res.send({
    message: `${request.name} update successful.`,
    log: { ...newLog, _id: insertLog.insertedId },
  });
};

export const updateAccess = async (req, res) => {
  // Params Check
  const { req_id } = req.params;
  if (req_id.length !== 24)
    return res.status(400).send({ message: 'Request Does Not Exist' });
  const { visitor } = req.body;
  if (!visitor)
    return res.status(400).send({ message: 'Update Parameters Not Provided' });

  const reqCol = await getCol('requests');
  //* Check if user is already checked into another req
  const onsiteCheck = await reqCol
    .find({
      visitors: { $elemMatch: { user_id: visitor._id, is_onsite: true } },
    })
    .toArray();
  if (visitor.is_onsite && onsiteCheck.length > 0)
    return res.status(400).send({
      message: `${visitor.name} is ALREADY checked in for ${onsiteCheck[0].name}`,
    });

  //* Check if request is wthin window

  // UPDATE VISITOR
  const updatedReq = await reqCol.updateOne(
    { _id: new ObjectId(req_id) },
    { $set: { 'visitors.$[elem].is_onsite': visitor.is_onsite } },
    { arrayFilters: [{ 'elem.user_id': visitor._id }] }
  );
  if ((updatedReq.matchedCount || updatedReq.modifiedCount) === 0)
    return res.status(400).send({ message: 'Request Not Found' });

  // UPDATE BADGE
  const badgeCol = await getCol('badges');
  if (visitor.is_onsite && visitor.badge_id) {
    const updateBadge = await badgeCol.updateOne(
      { _id: new ObjectId(visitor.badge_id) },
      { $set: { is_available: false, assigned_to: visitor._id } }
    );
    if ((updateBadge.matchedCount || updateBadge.modifiedCount) === 0)
      return res.status(400).send({ message: 'Error Assigning Badge' });
  }
  if (!visitor.is_onsite) {
    const assignedBadge = await badgeCol.findOne({ assigned_to: visitor._id });
    if (assignedBadge) {
      const updateBadge = badgeCol.updateOne(
        { assigned_to: visitor._id },
        { $set: { is_available: true, assigned_to: false } }
      );
      if ((updateBadge.matchedCount || updateBadge.modifiedCount) === 0)
        return res.status(400).send({ message: 'Badge Reset Error' });
    }
  }

  // ADD LOG
  const request = await reqCol.findOne({ _id: new ObjectId(req_id) });
  const action = visitor.is_onsite ? 'checked in' : 'checked out';
  const badge =
    visitor.is_onsite && visitor.badge_num ? visitor.badge_num : null;
  const message = !badge
    ? `<User> has ${action} ${visitor.name} for ${request.name}.`
    : `<User> has ${action} ${visitor.name} for ${request.name} with badge ${badge}.`;

  const newLog = {
    timestamp: Date.now(),
    type: 'request',
    ref_id: request._id,
    message: message,
  };

  const logCol = await getCol('logs');
  const insertLog = await logCol.insertOne(newLog);
  if (!insertLog.acknowledged)
    return res.status(404).send({ message: 'Error inserting log' });

  return res.send({
    message: `${req_id} update successful.`,
    updatedRequest: request,
    log: { ...newLog, _id: insertLog.insertedId },
  });
};

export const newRequest = async (req, res) => {
  const { description, visitors, window } = req.body;

  const compCol = await getCol('companies');
  const updateCount = await compCol.updateOne(
    { is_client: true },
    { $inc: { req_counter: 1 } }
  );
  if ((updateCount.matchedCount || updateCount.modifiedCount) === 0)
    return res.status(400).send({ message: 'Inc Req Count Error' });
  const client = await compCol.findOne(
    { is_client: true },
    { projection: { _id: 0, req_counter: 1 } }
  );

  const reqCol = await getCol('requests');
  const newReq = await reqCol.insertOne({
    name: `REQ000000${client.req_counter}`,
    description: description,
    status: 'pending',
    window: {
      start: window.start,
      end: window.end,
    },
    visitors: visitors,
  });

  if (!newReq.acknowledged)
    return res.status(500).send({ message: 'Error inserting request' });

  // ADD LOG
  const request = await reqCol.findOne({
    _id: new ObjectId(newReq.insertedId),
  });
  const message = `<User> submitted new request '${request.name}' for approval.`;
  const newLog = {
    timestamp: Date.now(),
    type: 'request',
    ref_id: request._id,
    message: message,
  };

  const logCol = await getCol('logs');
  const insertLog = await logCol.insertOne(newLog);
  if (!insertLog.acknowledged)
    return res.status(404).send({ message: 'Error inserting log' });

  return res.send({
    message: 'Request Added',
    _id: newReq.insertedId,
    log: { ...newLog, _id: insertLog.insertedId },
  });
};

export const getOnsite = async (req, res) => {
  //ADD AUTH -> // const { user } = req.body;

  const reqCol = await getCol('requests');

  const agg = await reqCol
    .aggregate([
      { $match: { 'visitors.is_onsite': true } },
      {
        $project: {
          visitors: {
            $filter: {
              input: '$visitors',
              as: 'visitor',
              cond: { $eq: ['$$visitor.is_onsite', true] },
            },
          },
          _id: 0,
          'request._id': '$_id',
          'request.name': '$name',
          'request.start': '$window.start',
          'request.end': '$window.end',
        },
      },
      { $unwind: '$visitors' },
      {
        $lookup: {
          from: 'badges',
          localField: 'visitors.user_id',
          foreignField: 'assigned_to',
          as: 'badge',
        },
      },
      { $unwind: { path: '$badge', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          request: 1,
          visitor: '$visitors',
          badge_number: '$badge.number',
        },
      },
    ])
    .toArray();

  res.send(agg);
};
