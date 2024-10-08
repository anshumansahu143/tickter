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
    if (req.method !== "GET")
      throw Error("HTTP method not valid only GET Accepted!");
	let args:any = req.query.args;
	if(args){
		args = JSON.parse(args.toString());
	}
	if(!args.page || args.per_page>200){
		res.status(200).json({ message:"PArms not set properly" });
	}
	if(!args.scope){
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
	}else{
		if(args.scope=='mine' && user._id){
			filter['author'] = user._id;
		}else{
			if(user?.role===0){
				filter['privacy'] = 'public';
			}
		}
	}
	
	// Count the total number of documents that match the filter
	const totalItems = await Ticket.countDocuments(filter);
	const totalPages = Math.ceil(totalItems / args.per_page);

	// Ensure the page number is within the valid range
	args.page = Math.max(1, args.page);
	if(!args.orderby){
		args.orderby = 'updatedAt';
	}
	if(!args.order){
		args.order = 'desc';
	}
	if(!args.per_page){
		args.per_page = 30;
	}
	// Determine the sort order
	const sort:any = {};
	sort[args.orderby] = args.order === 'asc' ? 1 : -1;
	console.log('filter',filter,args,sort);
	// Find the items that match the filter and paginate
	const items = await Ticket.find(filter).populate('author')
		.sort(sort)
		.skip((args.page - 1) * args.per_page)
		.limit(args.per_page);

	data =  {
		page: args.page,
		pageSize: args.per_page,
		totalItems: totalItems,
		totalPages: totalPages,
		items: items
	};
	
    res.status(200).json({ data });
    
  } catch (error: any) {
	console.log('error',error);
	res.status(500).json({ error });
  }
}
