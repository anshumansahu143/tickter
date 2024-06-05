import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useAuthContext, useAuthContextType } from "../context/AuthContext";
import { useEffect, useState } from "react";
import useTicketsList from "../utils/use-tickets";
import Ticket from '../components/Ticket/ticket';
import Pagination from "../components/Ticket/Pagination";
export default function Home() {
  const { data: session } = useSession<any>();
  const { state, dispatch }: useAuthContextType = useAuthContext();

  const [args,setArgs] = useState({page:1,per_page:3,order:'asc',orderby:'updatedAt',scope:'all',search:''});
  const { data: ticketsData } = useTicketsList(args);

  function signOutHandle() {
    signOut();
  }

  useEffect(() => {
    console.log("state ", state.user?._id);
  }, [state]);

  return (
    <div className="container p-6 flex flex-wrap gap-4">
      <div className="tix-wrap basis-9/12">
      {
        ticketsData?.items?.length?
        <div className="flex flex-col  shadow-md ">
            {
              ticketsData?.items?.map((ticket:any)=>{
                return <Ticket ticket={ticket}/>
              })
            }
        </div>
        :''
      }
      {
        ticketsData?.items?
        <Pagination totalPages={ticketsData.totalPages} currentPage={ticketsData.page} />
        :''
      }
      
      </div>
      <div className="flex-1 basis-2/12">
        bulk
      </div>
    </div>
  );
}
