import { getCol } from "../../db/mongo.js";

export const getAvailable = async (req, res) => {
  const col = await getCol("badges");
  const badges = await col
    .find({ is_available: true })
    .sort({ number: 1 })
    .project({ number: 1, is_available: 1 })
    .toArray();
  res.send(badges);
};
