import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthContext, useAuthContextType } from "../../context/AuthContext";
import useReplies from "../../utils/use-replies";
import useTicket from "../../utils/use-ticket";
import Reply from "./Reply";
import PostReply from "./postReply";

import TostMessage from "../Utils/TostMessage";
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
} from "../ui/alert-dialog";
import { Skeleton } from "../ui/skeleton";

const SingleTicket: React.FC<any> = ({ id }) => {
  const router = useRouter();
  const { state, dispatch }: useAuthContextType = useAuthContext();
  const queryClient = useQueryClient();

  const {data:ticket} = useTicket(parseInt(id));
  const {data:replies,isLoading} = useReplies(ticket?._id);
  const [showReplyBox,setShowReplyBox] = useState(false);

  const updateTicket = (field:string,value:string)=>{
    let updateArgs:any = {};
    updateArgs[field] = value; 
    ticket[field] = value;
    fetch( `/api/tickets/${ticket?._id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateArgs),
    } ) // wrapped
    .then( res => res.json() )
    .then( data => {
      if(data.status){
        queryClient.invalidateQueries({queryKey:['ticket', parseInt(id)]});

        TostMessage("Successfully updated", "success");
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
        TostMessage("Successfully deleted", "success");
        setTimeout(()=>{
          router.push("/tickets")
        },1500);
      }else{
        TostMessage("Some error orrcured", "error");
      }
    })
    .catch( err => {
        console.log(err);
        TostMessage("Some error orrcured", "error");
    });
  }

  const listenReply = (action:string,data:any)=>{
    console.log(action,data);
    if(action==='deleted'){

      queryClient.setQueryData(['replies', ticket._id], (oldData:any) => {
        if (!oldData) {
          oldData = []; // Initialize as empty array if undefined
        }
        
        const newData = oldData.filter((d:any)=>d._id!==data._id);
        console.log(oldData,oldData.findIndex((d:any)=>d._id===data._id));
        return newData;
      });

      fetch( `/api/replies/${data?._id}`, {
        method: 'DELETE',
      } ) // wrapped
      .then( res => res.json() )
      .then( data => {
        if(data.status){
          TostMessage("Successfully deleted", "success");
          
        }else{
          TostMessage("Some error orrcured", "error");
        }
      })
      .catch( err => {
          console.log(err);
          TostMessage("Some error orrcured", "error");
      });

    }
  }
  
  return (
    
      ticket?.ticketId?
      <div className="container flex flex-wrap  my-8 ">
        
        <div className="tix-wrap w-full md:w-3/4  shadow-lg">
            <div className="bg-white z-10">
              <div className={`${(ticket?.privacy==='private'?'bg-rose-400':'bg-teal-500')} p-4 text-white`}>
                  TICKET #{ticket.ticketId}
              </div>
              <h1 className="text-2xl p-4">{ticket.title}</h1>
              <div className=" p-4" dangerouslySetInnerHTML={{__html:ticket.description}}></div>
              <div className="bg-slate-100 p-4">
                  <button className="btn" onClick={()=>{setShowReplyBox(!showReplyBox)}}>Post a reply</button>
              </div>
            </div>
            {
              showReplyBox?
              <PostReply id={ticket._id} close={()=>setShowReplyBox(false)} replyAdded={async(updatedData:any)=>{
                queryClient.setQueryData(['replies', ticket._id], (oldData:any) => {
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
                  return <Reply reply={reply} key={reply._id} update={listenReply}></Reply>
                })
                :isLoading?<div className="flex flex-col gap-2 m-4">
                <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
                <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
                <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
          
                </div>:''
              }
              
            </div>
        </div>
        <div className="w-full md:w-1/4   lg:px-4 md:px-0">
          
          <div className="flex flex-col shadow-lg sticky top-[100px] w-full  p-4 " >
              <div className="bg-teal-500 p-4 text-white  -mx-4 lg:-mt-4 mb-4 md:-mt-0 ">
                  Ticket Actions
              </div>
              {
                ticket?.author?._id=== state?.user?._id ||  state?.user?.role==1?
                <div className=" flex flex-col  gap-2">
                
                <select className="border p-2" onChange={(e)=>{
                  updateTicket('status',e.target.value)
                }} value={ticket?.status}>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                <select className="border  p-2" onChange={(e)=>{
                  updateTicket('privacy',e.target.value)
                }} value={ticket?.privacy}>
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

                
                </div>
                :''
              }
          </div>
        </div>
      </div>
      :<div className="flex flex-col gap-2 m-4">
      <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
      <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
      <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>

      </div>
    
  );
}

export default SingleTicket;