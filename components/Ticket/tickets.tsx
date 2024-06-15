import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useAuthContext, useAuthContextType } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import useTicketsList from "../../utils/use-tickets";
import Ticket from './ticket';
import Pagination from "./Pagination";
import { Skeleton } from "../ui/skeleton";
const  Tickets: React.FC<any> = (props) =>{
  const { data: session } = useSession<any>();
  const { state, dispatch }: useAuthContextType = useAuthContext();
   
  const [args,setArgs] = useState({page:0,per_page:5,order:'asc',orderby:'updatedAt',scope:'all',search:''});

  useEffect(()=>{
    setArgs({...args,...props.args});
  },[props.args]);

  const { data: ticketsData ,isLoading,isError} = useTicketsList(args);

  
  if(isLoading){
    return <div className="container p-6 flex flex-wrap gap-4">
      <div className="tix-wrap basis-9/12 flex gap-4 flex-col">
        <div className="flex w-full gap-4 m-4">
          <Skeleton className="w-[50px] h-[50px] rounded-full"></Skeleton>
          <div className="flex w-full flex-col gap-2 ">
            <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
            <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
            <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
          </div>
        </div>
        <div className="flex w-full gap-4 m-4">
          <Skeleton className="w-[50px] h-[50px] rounded-full"></Skeleton>
          <div className="flex w-full flex-col gap-2 ">
            <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
            <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
            <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
          </div>
        </div>
      </div>
    </div>;
  }
  return (
    <div className="container p-6 flex flex-wrap">
      <div className="tix-wrap w-full md:w-3/4">
      {
        ticketsData?.items?.length?
        <div className="flex flex-col  shadow-md ">
            {
              ticketsData?.items?.map((ticket:any)=>{
                return <Ticket ticket={ticket} key={ticket._id}/>
              })
            }
        </div>
        :<div className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
          <p>No tickets found!</p>
        </div>
      }
      {
        ticketsData?.items?
        <Pagination totalPages={ticketsData.totalPages} currentPage={ticketsData.page} />
        :''
      }
      
      </div>
      <div className="w-full md:w-1/4   lg:px-4 md:px-0">
          
          <div className="flex flex-col shadow-lg mx-4 p-4 gap-4 sticky top-[100px]" >
              
              <div className="flex flex-col gap-4">
              <Link
                href={'/tickets/new'} 
               className="btn w-full text-center">Submit a Ticket</Link>
               <Link
                href={'/my-tickets'} 
               className="w-full">My tickets</Link>
              </div>
          </div>
        </div>
    </div>
  );
}
export default Tickets;