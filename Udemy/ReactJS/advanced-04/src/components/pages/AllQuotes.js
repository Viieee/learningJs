import QuoteList from '../quotes/QuoteList';

const DUMMY_DATA = [
  {
    id: 'q1',
    author: 'Vie',
    text: 'first quote',
  },
  {
    id: 'q2',
    author: 'Adhit',
    text: 'second quote',
  },
];

function AllQuotes() {
  return <QuoteList quotes={DUMMY_DATA} />;
}

export default AllQuotes;
