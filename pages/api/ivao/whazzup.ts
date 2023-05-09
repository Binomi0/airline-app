import axios from "axios";
import moment, { Moment } from "moment";
import { NextApiRequest, NextApiResponse } from "next";

const CLIENTS_PATH = "./pages/api/ivao/data";

let nextCall: Moment;
let clients;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();
  const now = moment();

  if (!nextCall || nextCall.isBefore(now)) {
    nextCall = now.add(20, "seconds");
    try {
      console.log("requesting IVAO data at %s", now.format("HH:mm:ss"));

      const response = await axios.get(
        "https://api.ivao.aero/v2/tracker/whazzup"
      );

      clients = response.data.clients;

      return res.status(200).send(clients);
    } catch (error) {
      console.log("error =>", error);
      return res.status(500).send([]);
    }
  }
  return res.status(500).send([]);
};

export default handler;
