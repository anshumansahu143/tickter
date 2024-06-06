import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { toFriendlyTime } from "../Common/friendlyTime";

export default function Reply(props:any) {
  const { data: session } = useSession<any>();
  let reply = props.reply;
  let replyTime = props.reply.updatedAt;
  let ms = (new Date().getTime()-new Date(replyTime).getTime())/1000;
  let oldClass = '';
  


  return (
   
      <div className={` flex flex-wrap gap-4 border-b border-b-slate-200 p-6  transition-all`} onClick={()=>{
        
      }}>
          {
            reply?.author?.image?.length?
            <img className="w-12 h-12 border rounded-[50%]" src={reply?.author?.image}/>
            :<img className="w-12 h-12 border rounded-[50%]" src={'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}/>
          }
          <div className="reply-details flex-1 ">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs">{reply.author.name}</span>
                <div className="reply-meta text-xs opacity-75 flex justify-end flex-wrap">
                    {
                    reply.updatedAt?
                    toFriendlyTime(new Date(reply.updatedAt))
                    :''
                    }
                </div>
              </div>
              <div className="mt-12" dangerouslySetInnerHTML={{__html:reply.content}}></div>
          </div>
      </div>
  );
}
