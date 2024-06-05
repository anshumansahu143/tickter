import { NextApiRequest, NextApiResponse } from "next";
import connectDatabase from "../../../../lib/connectDatabase";
import Ticket from "../../../../model/Ticket";
import response_message from "../../../../lib/response_message";
import { getSession } from 'next-auth/react';
import User from "../../../../model/User";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    // connect database
    await connectDatabase();

    // check request method POST or not
    if (req.method !== "POST")
      throw Error("HTTP method not valid only POST Accepted!");

    // check req body empty
    if (!req.body) return response_message(res, 404, "Don't have form data!");
    const { title, description } = JSON.parse(req.body);

    const session = await getSession({ req });
   
    if(!session?.user?.email){
        throw Error("Sorry you cannot create any tickets!");
    }
  
    const { _doc: user } = await User.findOne({ email:session?.user?.email });
    if(!user){
        throw Error("Sorry you cannot create any tickets!");
    }
    Ticket.create(
      { title, description,  privacy: 'public',status: 'open',replyCount:0,author:user._id },
      (error: any, doc: any) => {
        if (error) {
          res.status(200).json({ error: error });
        };
        res.status(200).json({ ticket: doc });
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
}
