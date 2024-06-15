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
    if(!ticketId){
      throw Error("invalid id");
    }
    const session = await getSession({ req });

   
    let filter:any = {replyTicketId:ticketId};
    let user:any = {};
    try{
      const { _doc } = await User.findOne({ email:session?.user?.email });
      user = _doc;
    }catch(error){

    }
 
    
    let items:any = await Reply.find(filter).populate('author').populate('replyTicketId').sort({'createdAt':-1}).exec();



    if(items.length &&  (!user?.role || user?.role===0)){
      items = items.map((item:any)=>{
        if(item.private){
            let notShowPrivate = 0;
            if(!user?._id){
                notShowPrivate = 1;
            }else if(user?._id!==item?.ticket?.author){
                if(item.author!==user?._id){
                    notShowPrivate = 1;
                }                                                                               
            }
            
            if(notShowPrivate){
                item.content = '<div class="text-rose-500">Private Reply</div>';
            }
        }
        return item;
      });
    }


    res.status(200).json({  replies:items });
   
    
  } catch (error: any) {
    console.log('error',error);
    res.status(500).json({ error: error });
  }
}
