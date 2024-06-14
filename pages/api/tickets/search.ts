import { NextApiRequest, NextApiResponse } from "next";
import connectDatabase from "../../../lib/connectDatabase";
import Ticket from "../../../model/Ticket";
import { getSession } from 'next-auth/react';
import User from "../../../model/User";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    // connect database
    await connectDatabase();

    // check request method POST or not
    if (req.method !== "POST")
      throw Error("HTTP method not valid only GET Accepted!");
	let {search} = JSON.parse(req.body);
	if(!search){
		res.status(200).json({ message:"PArms not set properly" });
	}
	let data:any ={};
	let filter:any = {};
    const session = await getSession({ req });
    let user:any = {};
	try{
		const { _doc } = await User.findOne({ email:session?.user?.email });
		user = _doc;
	}catch(error){

	}
	if(!user?._id){
        filter['privacy'] = 'public';
        if(user?.role===1){
            delete filter.privacy;
        }
    }

    const regex = new RegExp(search, 'i');

    filter['title'] = regex;
	// Count the total number of documents that match the filter

	// Ensure the page number is within the valid range
	
	
	
	// Determine the sort order
	const sort:any = {};
	sort['updatedAt'] = -1 ;

	// Find the items that match the filter and paginate
	const items = await Ticket.find(filter).populate('author')
		.sort(sort)

	
    res.status(200).json({ items });
    
  } catch (error: any) {
	res.status(500).json({ error });
  }
}
