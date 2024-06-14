import { NextApiRequest, NextApiResponse } from "next";
import connectDatabase from "../../../lib/connectDatabase";
import Ticket from "../../../model/Ticket";
import response_message from "../../../lib/response_message";
import { getSession } from 'next-auth/react';
import User from "../../../model/User";

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
    if(!id){
      throw Error("invalid id");
    }
    const session = await getSession({ req });
   

  
    let user:any = {};
    try{
      const { _doc } = await User.findOne({ email:session?.user?.email });
      user = _doc;
    }catch(error){
  
    }
    const { _doc: ticket } = await Ticket.findOne({ ticketId:ticketId }).populate('author');
    res.status(200).json({  ticket });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
}
