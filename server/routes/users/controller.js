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
