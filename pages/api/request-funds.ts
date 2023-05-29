import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "./auth/[...thirdweb]";
import clientPromise from "lib/mongodb";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Goerli } from "@thirdweb-dev/chains";
import { coinTokenAddress } from "contracts/address";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();
  if (!process.env["THIRDWEB_AUTH_PRIVATE_KEY"]) return res.status(403).end();

  const user = await getUser(req);
  if (!user || !user.address) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }
  const { address } = user;
  const client = await clientPromise;
  const collection = client.db("funding").collection("used");

  try {
    const requested = await collection.findOne({ address });
    if (requested) {
      return res.status(202).end();
    }

    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env["THIRDWEB_AUTH_PRIVATE_KEY"],
      Goerli
    );

    // amount to fill to each connected address
    const amount = 2;

    await sdk.wallet.transfer(address, amount, coinTokenAddress);
    await collection.insertOne({ address, amount });

    return res.status(201).end();
  } catch (error) {
    console.log("error =>", error);
    return res.status(500).json(error);
  }
};

export default handler;
