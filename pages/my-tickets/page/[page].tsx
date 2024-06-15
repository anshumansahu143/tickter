import { useRouter } from "next/router";
import Tickets from "../../../components/Ticket/tickets";
import { useEffect, useState } from "react";

export default function TicketsPage() {
  const router = useRouter();
  const { page } = router.query;
  const apage = Array.isArray(page) ? parseInt(page[0]) : page;


  const [args,setArgs] = useState({page:apage,scope:'mine'});

  useEffect(()=>{
    setArgs({...args,page:apage});
  },[apage]);

  return (
    <Tickets args={args}/>
  );
}
