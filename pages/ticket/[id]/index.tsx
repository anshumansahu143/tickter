import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/router';
import { ReactQueryClientProvider } from '../../../components/ReactQueryClientProvider';
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
    <ReactQueryClientProvider>
      {
        parsedId?
        <SingleTicket id={parsedId} page={1}/>
        :''
      }
      
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryClientProvider>
  );
}
