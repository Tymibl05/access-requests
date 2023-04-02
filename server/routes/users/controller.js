import { getCol } from '../../db/mongo.js';
import bcrypt from 'bcryptjs';

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const userCol = await getCol('users');
  const user = await userCol.findOne({ email: email });
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).send({ message: 'Invalid Email or Password.' });
  else if (!user.is_active)
    return res.status(401).send({ message: 'User Profile Disabled.' });
  else {
    const compCol = await getCol('companies');
    const company = await compCol.findOne({ _id: user.company_id });
    const admin =
      company.admins.filter((admin) => admin === user._id).length > 0;
    return res.send({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company_id: user.company_id,
        company_name: company.name,
        is_client: company.is_client,
        is_admin: admin,
      },
    });
  }
};

export const getOnsite = async (req, res) => {
  // add user auth to ensure req is from client
  const userCol = await getCol('users');

  const onsite = await userCol
    .aggregate([
      {
        $lookup: {
          from: 'requests',
          let: { uid: '$_id', uname: '$name' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    { user_id: '$$uid', user_name: '$$uname', is_onsite: true },
                    '$visitors',
                  ],
                },
              },
            },
            {
              $project: {
                name: 1,
                start: '$window.start',
                end: '$window.end',
              },
            },
          ],
          as: 'request',
        },
      },
      { $unwind: '$request' },
      {
        $lookup: {
          from: 'companies',
          localField: 'company_id',
          foreignField: '_id',
          //pipeline: [{ $project: { name: 1 }}],
          as: 'company',
        },
      },
      { $unwind: '$company' },
      {
        $lookup: {
          from: 'badges',
          localField: '_id',
          foreignField: 'assigned_to',
          //pipeline: [{ $project: { number: 1 } }],
          as: 'badge',
        },
      },
      { $unwind: { path: '$badge', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          user_id: '$_id',
          user_name: '$name',
          request: 1,
          company_name: '$company.name',
          badge_number: '$badge.number',
        },
      },
    ])
    .toArray();

  return res.send(onsite);
};

export const getUserName = async (req, res) => {
  const { user_id } = req.params; ///users/:user_id/name
  const userCol = await getCol('users');
  const user = await userCol.findOne(
    { _id: user_id },
    { projection: { _id: 0, name: 1 } }
  );
  res.send({ name: user.name });
};

export const getUserCompany = async (req, res) => {
  const { user_id } = req.params;
  if (user_id.length !== 24)
    return res.status(400).send({ message: 'User Does Not Exist' });

  const userCol = await getCol('users');
  const agg = await userCol
    .aggregate([
      { $match: { _id: user_id } },
      {
        $lookup: {
          from: 'companies',
          localField: 'company_id',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $unwind: '$company' },
      { $project: { company_name: '$company.name' } },
    ])
    .toArray();

  if (agg.length === 0)
    return res.status(404).send({ message: 'User Not Found' });

  return res.send(agg[0]);
};

export const getUserBadge = async (req, res) => {
  // needs update to match isonsite =true AND req = req =  -- all requests with user shows they has a badge
  const { user_id } = req.params;
  if (user_id.length !== 24)
    return res.status(400).send({ message: 'Badge Does Not Exist' });

  const userCol = await getCol('users');
  const agg = await userCol
    .aggregate([
      { $match: { _id: user_id } },
      {
        $lookup: {
          from: 'badges',
          localField: '_id',
          foreignField: 'assigned_to',
          as: 'badge',
        },
      },
      { $unwind: '$badge' },
      {
        $lookup: {
          from: 'requests',
          let: { uid: '$_id', uname: '$name' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    { user_id: '$$uid', user_name: '$$uname', is_onsite: true },
                    '$visitors',
                  ],
                },
              },
            },
          ],
          as: 'request',
        },
      },
      { $unwind: '$request' },
      {
        $project: {
          _id: 0,
          _id: '$badge._id',
          number: '$badge.number',
          user_id: '$_id',
          request_id: '$request._id',
        },
      },
    ])
    .toArray();

  if (agg.length === 0) return res.send({});

  return res.send(agg[0]);
};
