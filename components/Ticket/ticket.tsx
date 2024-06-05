import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { toFriendlyTime } from "../Common/friendlyTime";

export default function Ticket(props:any) {
  const { data: session } = useSession<any>();
  let ticket = props.ticket;
  let ticketTime = props.ticket.updatedAt;
  let ms = (new Date().getTime()-new Date(ticketTime).getTime())/1000;
  let oldClass = '';
  if(ms>24*60*60){
    oldClass = 'border-l-4 border-red-500';
  }else{
    oldClass  = 'border-l-4 border-green-500';
  }

  console.log(ticket);

  return (
      <div className={`${oldClass} flex flex-wrap items-center gap-4 border-b border-b-slate-200 p-4 cursor-pointer hover:bg-slate-100 transition-all`}>
          {
            ticket?.author?.image?.length?
            <img className="w-12 h-12 border rounded-[50%]" src={ticket?.author?.image}/>
            :<img className="w-12 h-12 border rounded-[50%]" src={'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}/>
          }
          <div className="ticket-details flex-1">
              <span className="text-xs">{ticket.author.name}</span>
              <h5 className="text-xl">{ticket.title}</h5>
              <div className="ticket-meta text-xs opacity-75 mt-4 flex justify-end flex-wrap">
                {
                  ticket.updatedAt?
                  toFriendlyTime(new Date(ticket.updatedAt))
                  :''
                }
              </div>
          </div>
      </div>
  );
}
