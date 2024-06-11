import { NextApiRequest, NextApiResponse } from "next";
import connectDatabase from "../../../lib/connectDatabase";
import Ticket from "../../../model/Ticket";
import response_message from "../../../lib/response_message";
import { getSession } from 'next-auth/react';
import User from "../../../model/User";
import mongoose from "mongoose";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    // connect database
    await connectDatabase();
    let { id } = req.query;
    id = Array.isArray(id)?id[0]:id;
    console.log(id);
    // check request method POST or not
    if (req.method === "POST"){
        // check req body empty

        if (!req.body) return response_message(res, 404, "Don't have form data!");
        let data = JSON.parse(req.body);
console.log('data',data)
        const session = await getSession({ req });
        console.log('session',session)
        if(!session?.user?.email){
            throw Error("Sorry you cannot create any tickets!");
        }
    
        const { _doc: user } = await User.findOne({ email:session?.user?.email });
        if(!user){
            throw Error("Sorry you cannot create any tickets!");
        }
        const result:any = await Ticket.updateOne({_id:new mongoose.Types.ObjectId(id)},data, {
            upsert: false,
            runValidators: true,
        });
        res.status(200).json({ status: result });
        return;
    }
      
    if(req.method==='DELETE'){
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
        const result:any = await Ticket.deleteOne({_id:new mongoose.Types.ObjectId(id)});
        res.status(200).json({ status: result });
        return;
    }
    throw Error("HTTP method not valid only PATCH AND DELETE Accepted!");
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
}
