import axios from "axios";
import moment, { Moment } from "moment";
import { NextApiRequest, NextApiResponse } from "next";

let nextCall: Moment;
let clients: Record<string, string> = {};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();
  if (!nextCall || nextCall.isBefore(moment())) {
    try {
      console.log("requesting IVAO data at %s", moment().format("HH:MM:SS"));
      const response = await axios.get(
        "https://api.ivao.aero/v2/tracker/whazzup"
      );
      nextCall = moment().add(20, "seconds");
      clients = response.data.clients;

      return res.status(200).send({ ...clients });
    } catch (error) {
      return res.status(500).send([]);
    }
  }
  return res.status(202).send({ ...clients });
};

export default handler;
