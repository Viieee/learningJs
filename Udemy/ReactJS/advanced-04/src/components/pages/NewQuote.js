import QuoteForm from '../quotes/QuoteForm';

import { useHistory } from 'react-router-dom';

function NewQuote() {
  const history = useHistory();
  function addQuoteHandler(data) {
    console.log(data);
    history.push('/quotes');
    // push -> adds new page (we can undo/go back to previous page)
    // replace -> redirect
  }

  return <QuoteForm onAddQuote={addQuoteHandler} />;
}

export default NewQuote;
