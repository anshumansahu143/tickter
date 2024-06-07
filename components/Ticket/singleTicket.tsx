import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { toFriendlyTime } from "../Common/friendlyTime";
import useTicket from "../../utils/use-ticket";
import useReplies from "../../utils/use-replies";
import Button from "../Common/Button";
import PostReply from "./postReply";
import Reply from "./Reply";
import { useQueryClient } from "@tanstack/react-query";

  
const SingleTicket: React.FC<any> = ({ id }) => {
  const { data: session } = useSession<any>();
  const queryClient = useQueryClient();

  const {data:ticket} = useTicket(parseInt(id));
  const {data:replies} = useReplies(ticket?._id);
  const [showReplyBox,setShowReplyBox] = useState(false);

  return (
    ticket?.ticketId?
    <div className="container flex flex-wrap gap-4 my-8">
      <div className="tix-wrap basis-9/12 shadow-lg">
          <div className="bg-white z-10">
            <div className="bg-teal-500 p-4 text-white">
                TICKET #{ticket.ticketId}
            </div>
            <h1 className="text-2xl p-4">{ticket.title}</h1>
            <div className="bg-slate-100 p-4">
                <button className="btn" onClick={()=>{setShowReplyBox(!showReplyBox)}}>Post a reply</button>
            </div>
          </div>
          {
            showReplyBox?
            <PostReply id={ticket._id} close={()=>setShowReplyBox(false)} replyAdded={async(updatedData:any)=>{
              console.log(updatedData);
              let response = await queryClient.refetchQueries({queryKey:["replies",ticket._id],stale: true});
              console.log(response);
            }}></PostReply>
            :''
          }
          <div className="flex flex-col">
            {
              replies?.length?
              replies.map((reply:any)=>{
                return <Reply reply={reply} key={reply._id}></Reply>
              })
              :''
            }
            
          </div>
      </div>
      <div className="flex-1 basis-2/12">
        ticke actions
      </div>
    </div>
      :<></>
  );
}

export default SingleTicket;