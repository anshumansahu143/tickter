import { Trash2 } from 'lucide-react';
import { useAuthContext, useAuthContextType } from "../../context/AuthContext";
import { toFriendlyTime } from "../Common/friendlyTime";
export default function Reply(props:any) {
  const { state }: useAuthContextType = useAuthContext();
  let reply = props.reply;
  let replyTime = props.reply.updatedAt;
  let ms = (new Date().getTime()-new Date(replyTime).getTime())/1000;
  let oldClass = '';
  


  return (
   
      <div className={`${(reply?.private?'bg-slate-100':'')} flex flex-wrap gap-4 border border-slate-200 p-6  transition-all group`} onClick={()=>{
        
      }}>
          {
            reply?.author?.image?.length?
            <img className="w-12 h-12 border rounded-[50%]" src={reply?.author?.image}/>
            :<img className="w-12 h-12 border rounded-[50%]" src={'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}/>
          }
          <div className="reply-details flex-1 ">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs">{reply.author.name}</span>
                {
                  reply.author._id===state?.user?._id ?
                  <div className="flex flex-wrap">
                    <Trash2 className="w-4 h-4 cursor-pointer hidden group-hover:flex"  onClick={()=>{
                      props.update('deleted',reply);
                    }}></Trash2>
                  </div>
                  :''
                }
              </div>
              <div className="mt-4" dangerouslySetInnerHTML={{__html:reply.content}}></div>
              <div className="reply-meta text-xs opacity-75 flex justify-end flex-wrap">
                    {
                    reply.updatedAt?
                    toFriendlyTime(new Date(reply.updatedAt))
                    :''
                    }
                </div>
          </div>
      </div>
  );
}
