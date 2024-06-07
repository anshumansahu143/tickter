import { NextApiRequest, NextApiResponse } from "next";
import connectDatabase from "../../../lib/connectDatabase";
import Reply from "../../../model/Reply";
import Ticket from "../../../model/Ticket";
import response_message from "../../../lib/response_message";
import { getSession } from 'next-auth/react';
import User from "../../../model/User";
import mongoose from "mongoose";


export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    // connect database
    await connectDatabase();

    // check request method POST or not
    if (req.method !== "POST")
      throw Error("HTTP method not valid only POST Accepted!");

    // check req body empty
    if (!req.body) return response_message(res, 404, "Don't have form data!");
    const { privacy, description,ticketId } = JSON.parse(req.body);

    const session = await getSession({ req });
   
    if(!session?.user?.email){
        throw Error("Sorry you cannot create any tickets!");
    }
  
    const { _doc: user } = await User.findOne({ email:session?.user?.email });
    delete user.password;
    if(!user){
        throw Error("Sorry you cannot create any tickets!");
    }
    Reply.create(
      { content:description, private: (privacy?1:0),status: 'open',author:user._id,replyTicketId:ticketId},
      async(error: any, doc: any) => {
        if (error) {
          res.status(200).json({ error: error });
        };
        const result = await Ticket.updateOne({_id:new mongoose.Types.ObjectId(ticketId)},{lastReply:doc._id}, {
            upsert: false,
            runValidators: true,
        });
        
        let newReply = {...doc._doc};
        newReply.author = user;
        console.log(newReply);
        res.status(200).json({ reply: newReply });
      }
    );
    
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
}
