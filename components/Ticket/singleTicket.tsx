import { useEffect, useState } from "react";
import { toFriendlyTime } from "../Common/friendlyTime";
import useTicket from "../../utils/use-ticket";
import useReplies from "../../utils/use-replies";
import Button from "../Common/Button";
import PostReply from "./postReply";
import Reply from "./Reply";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext, useAuthContextType } from "../../context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import TostMessage from "../Utils/TostMessage";
  
const SingleTicket: React.FC<any> = ({ id }) => {
  const { state, dispatch }: useAuthContextType = useAuthContext();
  const queryClient = useQueryClient();

  const {data:ticket} = useTicket(parseInt(id));
  const {data:replies} = useReplies(ticket?._id);
  const [showReplyBox,setShowReplyBox] = useState(false);

  const updateTicket = (field:string,value:string)=>{
    let updateArgs:any = {};
    updateArgs[field] = value; 
    fetch( `/api/tickets/${ticket?._id}`, {
        method: 'POST',
        body: JSON.stringify(updateArgs),
    } ) // wrapped
    .then( res => res.json() )
    .then( data => {
      if(data.status){
        queryClient.setQueryData(['ticket', ticket._id], (oldData:any) => {
          oldData = {...oldData,...updateArgs};
          return oldData;
        });

        TostMessage("Successfully created", "success");
      }else{
        TostMessage("Some error orrcured", "error");
      }
    })
    .catch( err => {
        console.log(err);
        TostMessage("Some error orrcured", "error");
    });
  }

  const deleteTicket = ()=>{
    fetch( `/api/tickets/${ticket?._id}`, {
        method: 'DELETE',
    } ) // wrapped
    .then( res => res.json() )
    .then( data => {
      if(data.status){
        TostMessage("Successfully created", "success");
      }else{
        TostMessage("Some error orrcured", "error");
      }
    })
    .catch( err => {
        console.log(err);
        TostMessage("Some error orrcured", "error");
    });
  }
  
  return (
    
      ticket?.ticketId?
      <div className="container flex flex-wrap  my-8">
        <div className="tix-wrap basis-9/12 shadow-lg">
            <div className="bg-white z-10">
              <div className={`${(ticket.privacy==='private'?'bg-rose-500':'bg-teal-500')} p-4 text-white`}>
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
                queryClient.setQueryData(['replies', ticket._id], (oldData:any) => {
                  console.log(oldData);
                  if (!oldData) {
                    oldData = []; // Initialize as empty array if undefined
                  }
                  oldData.unshift(updatedData);
                  return oldData;
                });
                //let response = await queryClient.refetchQueries({queryKey:["replies",ticket._id],stale: true});
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
        <div className="basis-3/12 ">
          
          <div className="flex flex-col shadow-lg mx-4 p-4 gap-4 sticky top-[100px]" >
              <div className="bg-teal-500 p-4 text-white -m-4 mb-4">
                  Ticket Actions
              </div>
              {
                ticket?.author?._id=== state?.user?._id ||  state?.user?.role==1?
                <>
                
                <select className="border p-2" onChange={(e)=>{
                  updateTicket('status',e.target.value)
                }}>
                  <option value="">Select status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                <select className="border  p-2" onChange={(e)=>{
                  updateTicket('status',e.target.value)
                }}>
                  <option value="">Select privacy</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
                <AlertDialog>
                <AlertDialogTrigger className="text-rose-600 p-2 cursor-pointer text-left">Delete ticket</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the ticket?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteTicket}>Yes</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

                
                </>
                :''
              }
          </div>
        </div>
        
      </div>
      :<></>
    
  );
}

export default SingleTicket;