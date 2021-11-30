import Ticket from './Ticket';

function TicketList(props) {
  return (
    <ul>
      {props.tickets.map((ticket) => (
        <Ticket key={ticket.id} title={ticket.title} />
      ))}
    </ul>
  );
}

export default TicketList;
