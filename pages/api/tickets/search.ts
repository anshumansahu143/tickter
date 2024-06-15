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
	const sort:any = {};
	let myitems:any =[];
	sort['updatedAt'] = -1 ;
	const regex = new RegExp(search, 'i');
	if(!user?._id){
        filter['privacy'] = 'public';
       
    }else{
		if(user?.role===0){
			filter['privacy'] = 'public';
			myitems = await Ticket.find({privacy:'private','author': user._id,title:regex}).populate('author')
        }
	}

    filter['title'] = regex;
	
	

	// Find the items that match the filter and paginate
	const items = await Ticket.find(filter).populate('author')
		.sort(sort)
	let allitems= [...items,...myitems];
	
    res.status(200).json({ items: allitems});
    
  } catch (error: any) {
	res.status(500).json({ error });
  }
}
