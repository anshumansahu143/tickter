import { NextApiRequest, NextApiResponse } from "next";
import connectDatabase from "../../../lib/connectDatabase";
import Reply from "../../../model/Reply";
import { getSession } from 'next-auth/react';
import User from "../../../model/User";
import mongoose from "mongoose";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    // connect database
    await connectDatabase();
    // check request method POST or not
    if (req.method === "POST")
      throw Error("HTTP method not valid POST not Accepted!");

    // check req body empty
    const { id } = req.query;
  
    const ticketId = Array.isArray(id) ? id[0] : id;
    console.log('ticketId---',ticketId);
    if(!ticketId){
      throw Error("invalid id");
    }
    const session = await getSession({ req });

    if(!session?.user?.email){
        throw Error("Sorry you cannot fetch any tickets!");
    }
  
    const { _doc: user } = await User.findOne({ email:session?.user?.email });
 
    if(!user){
        throw Error("Sorry you cannot fetch any tickets!");
    }
    const items = await Reply.find({replyTicketId:ticketId}).populate('author').sort({'createdAt':-1}).exec();
    res.status(200).json({  replies:items });
   
    
  } catch (error: any) {
    console.log('error',error);
    res.status(500).json({ error: error });
  }
}
