import axios from "axios";
import moment, { Moment } from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

const CLIENTS_PATH = "./pages/api/ivao/data/clients.json";

let nextCall: Moment;

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
      fs.writeFileSync(CLIENTS_PATH, JSON.stringify(response.data.clients), {
        encoding: "utf-8",
      });

      return res.status(200).send(response.data.clients);
    } catch (error) {
      console.log("error =>", error);
      return res.status(500).send([]);
    }
  } else {
    try {
      const clients = fs.readFileSync(CLIENTS_PATH, "utf-8");

      return res.status(202).send(JSON.parse(clients));
    } catch (error) {
      console.log("error =>", error);

      return res.status(500).send([]);
    }
  }
};

export default handler;
