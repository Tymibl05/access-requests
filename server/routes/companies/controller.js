import { getCol } from "../../db/mongo.js";

export const getEmployees = async (req, res) => {
  //ADD AUTH - pass user in req body -> company = _id : user.company_id
  const { comp_id } = req.params;
  const compCol = await getCol("companies");
  const company = await compCol.findOne({ _id: comp_id });

  if (comp_id.length !== 24 || !company)
    return res.status(400).send({ message: "Company Does Not Exist" });

  const employees = company.is_client
    ? await compCol
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "company_id",
              as: "employee",
              pipeline: [{ $match: { is_active: true } }],
            },
          },
          { $unwind: "$employee" },
          {
            $project: {
              _id: 0,
              company_id: "$_id",
              company_name: "$name",
              is_trusted: 1,
              user_id: "$employee._id",
              user_name: "$employee.name",
            },
          },
        ])
        .toArray()
    : await compCol
        .aggregate([
          { $match: { _id: comp_id } }, // if user.is_client omit $match to return all employees for all comps
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "company_id",
              as: "employee",
              pipeline: [{ $match: { is_active: true } }],
            },
          },
          { $unwind: "$employee" },
          {
            $project: {
              _id: 0,
              company_id: "$_id",
              company_name: "$name",
              is_trusted: 1,
              user_id: "$employee._id",
              user_name: "$employee.name",
            },
          },
        ])
        .toArray();

  if (employees.length === 0)
    return res.status(404).send({ message: "Employees Not Found" });

  return res.send(employees);
};
