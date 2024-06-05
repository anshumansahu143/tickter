import Tickets from '../../components/Ticket/tickets';

export default function TicketsPage() {

  let args = {page:1};

  return (
    <Tickets args={args}/>
  );
}
