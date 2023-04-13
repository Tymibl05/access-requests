import { getCol } from '../../db/mongo.js';

export const getAvailable = async (req, res) => {
  const col = await getCol('badges');
  const badges = await col
    .find({ is_available: true })
    .sort({ number: 1 })
    .project({ number: 1, is_available: 1 })
    .toArray();
  res.send(badges);
};

export const byUser = async (req, res) => {
  // ADD AUTH -> requesting user.is_client
  const { user_id } = req.params;

  const badgeCol = await getCol('badges');
  const badge = await badgeCol.findOne(
    { assigned_to: user_id },
    { projection: { number: 1 } }
  );
  if (!badge) return res.send(null);

  return res.send(badge);
};
