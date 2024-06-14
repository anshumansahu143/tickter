import { QueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/router';
import SingleTicket from '../../../components/Ticket/singleTicket';

export default function TicketPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
      },
    },
  });
  const parsedId = Array.isArray(id) ? id[0] : id;

  return (
    <>
      {
        parsedId?
        <SingleTicket id={parsedId} page={1}/>
        :''
      }
      
    </>
  );
}
