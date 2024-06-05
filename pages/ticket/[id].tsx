import { useRouter } from 'next/router';
import SingleTicket from '../../components/Ticket/singleTicket';

export default function TicketPage() {
  const router = useRouter();
  const { id } = router.query;

  const parsedId = Array.isArray(id) ? id[0] : id;

  return (
    <SingleTicket id={parsedId}/>
  );
}
