import { cargos } from "mocks/cargos";
import { NextApiHandler } from "next";
import { getUser } from "../auth/[...thirdweb]";
import mongo from "lib/mongodb";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const user = await getUser(req);

  if (!user) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }

  const cargo = req.body;

  if (cargo.address !== user.address) {
    return res.status(400).end();
  }

  try {
    await mongo.mongoInstance;
    const db = mongo.client.db("cargo").collection("live");
    const current = await db.findOne({ address: user.address });

    if (current) {
      return res.status(202).json(current);
    }

    const newCargo = await db.insertOne(cargo);

    return res.status(201).send(newCargo);
  } catch (error) {
    console.log("New Cargo ERROR =>", error);
    return res.status(500).end();
  }
};

export default handler;
