import { Fragment } from 'react';
import { useParams, Route, Link, useRouteMatch } from 'react-router-dom';
import Comments from '../comments/Comments';
import HighlightedQuote from '../quotes/HighlightedQuote';

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

function QuoteDetail() {
  const params = useParams();
  const match = useRouteMatch();

  // use route match contains path and url,
  // example:
  // path: '/quotes/:quoteId';
  // url: '/quotes/q1';

  const quote = DUMMY_DATA.find((quote) => quote.id === params.quoteId);

  if (!quote) {
    return <p>no quote found!</p>;
  }

  return (
    <Fragment>
      <HighlightedQuote text={quote.text} author={quote.author} />
      <Route path={match.path} exact>
        <div className="centered">
          <Link to={`${match.url}/comments`} className="btn--flat">
            Load Comments
          </Link>
        </div>
      </Route>
      <Route path={`${match.path}/comments`}>
        <Comments />
      </Route>
    </Fragment>
  );

//   <Fragment>
//   <HighlightedQuote text={quote.text} author={quote.author} />
//   <Route path={`/quotes/${params.quoteId}/`} exact>
//     <div className="centered">
//       <Link to={`/quotes/${params.quoteId}/comments`} className="btn--flat">
//         Load Comments
//       </Link>
//     </div>
//   </Route>
//   <Route path={`/quotes/${params.quoteId}/comments`}>
//     <Comments />
//   </Route>
// </Fragment>
}

export default QuoteDetail;
