import { NextApiRequest, NextApiResponse } from "next";
import connectDatabase from "../../../../lib/connectDatabase";
import Ticket from "../../../../model/Ticket";
import response_message from "../../../../lib/response_message";
import { getSession } from 'next-auth/react';
import User from "../../../../model/User";
import mongoose from "mongoose";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    // connect database
    await connectDatabase();
    let { id } = req.query;
    id = Array.isArray(id)?id[0]:id;

    // check request method PATCH or not
    if (req.method === "PATCH"){
        // check req body empty

        if (!req.body) return response_message(res, 404, "Don't have form data!");
        let data = JSON.parse(req.body);

        const session = await getSession({ req });

        if(!session?.user?.email){
            throw Error("Sorry you cannot create any tickets!");
        }
    
        const { _doc: user } = await User.findOne({ email:session?.user?.email });
        if(!user){
            throw Error("Sorry you cannot create any tickets!");
        }
        const { _doc: ticket } = await Ticket.findOne({ _id:new mongoose.Types.ObjectId(id) });
        if(ticket.author.equals(user._id) || user.role==1){
            const result:any = await Ticket.updateOne({_id:new mongoose.Types.ObjectId(id)},data, {
                upsert: false,
                runValidators: true,
            });
            return res.status(200).json({ status: result });
        }else{
            return res.status(200).json({ status: false });
        }
    }
      
    if(req.method==='DELETE'){

        const session = await getSession({ req });
    
        if(!session?.user?.email){
            throw Error("Sorry you cannot create any tickets!");
        }
    
        const { _doc: user } = await User.findOne({ email:session?.user?.email });
        if(!user){
            throw Error("Sorry you cannot create any tickets!");
        }

        const { _doc: ticket } = await Ticket.findOne({ _id:new mongoose.Types.ObjectId(id) });
       
        if(ticket.author.equals(user._id) || user.role==1){
            const result:any = await Ticket.deleteOne({_id:new mongoose.Types.ObjectId(id)});
            return res.status(200).json({ status: result });
        }else{
            return res.status(200).json({ status: false });
        }
        
      
    }
    throw Error("HTTP method not valid only PATCH AND DELETE Accepted!");
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
}
